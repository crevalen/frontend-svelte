<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import NProgress from 'nprogress';
  import 'nprogress/nprogress.css';
  import type { PageData } from './$types';
  import { theme } from '$lib/stores/theme';
  import { fade } from 'svelte/transition';

  import "../../app.css";

  import TopHeader from '$lib/sections/TopHeader.svelte';
  import Header from "$lib/sections/Header.svelte";
  import Footer from "$lib/sections/Footer.svelte";
  import ReadingProgressBar from '$lib/components/ui/ReadingProgressBar.svelte';
  import CookieBanner from '$lib/components/ui/CookieBanner.svelte';
  import NotificationPopup from '$lib/components/ui/NotificationPopup.svelte'; 
  import { urlBase64ToUint8Array } from '$lib/utils/formatters';

  export let data: PageData;

  let showCookieBanner = false;
  let lastScrollY = 0;
  let showHeader = true;
  let showNotificationPopup = false;

  function handleAcceptCookies() {
    showCookieBanner = false;
    localStorage.setItem('cookie_consent', 'true');
  }

  async function handleAcceptNotification() {
    showNotificationPopup = false;
    if (!browser || !('Notification' in window) || !('serviceWorker' in navigator)) return;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const swRegistration = await navigator.serviceWorker.register('/service-worker.js');
      const vapidKeyString = import.meta.env.VITE_PUBLIC_VAPID_KEY;
      if (!vapidKeyString) return;

      const applicationServerKey = urlBase64ToUint8Array(vapidKeyString);
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      await fetch('/api/subscriptions/save', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  function handleRejectNotification() {
    showNotificationPopup = false;
    const rejectionTime = new Date().getTime();
    localStorage.setItem('notification_rejection_timestamp', rejectionTime.toString());
  }

  // Theme toggler
  $: if (browser) {
    const html = document.documentElement;
    if ($theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  // NProgress loading config
  NProgress.configure({ showSpinner: false });

  beforeNavigate(() => {
    NProgress.start();
    // Biarkan header seperti kondisi sebelumnya (jangan paksa muncul)
  });

  afterNavigate(() => {
    NProgress.done();
    // Scroll ke atas dengan smooth agar tidak lompat kasar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function handleScroll() {
    if (!browser) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 150) {
      showHeader = false;
    } else {
      showHeader = true;
    }
    lastScrollY = currentScrollY;
  }

   onMount(() => {
    // --- PERBAIKAN LOGIKA GOOGLE ANALYTICS DI SINI ---
    // Tunda pemuatan GA selama 3 detik setelah halaman interaktif
    setTimeout(() => {
      if (browser && data.settings?.ga4_id) {
        const ga4Id = data.settings.ga4_id;
        
        const script = document.createElement('script');
        script.async = true;
        // Gunakan ID dinamis dari CMS
        script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
          window.dataLayer.push(arguments);
        }
        
        gtag('js', new Date());
        // Gunakan ID dinamis dari CMS
        gtag('config', ga4Id);
      }
    }, 3000);
    // --- SELESAI PERBAIKAN ---
    if (browser && 'Notification' in window && Notification.permission === 'default') {
      const rejectionTimestamp = localStorage.getItem('notification_rejection_timestamp');
      if (rejectionTimestamp) {
        const oneDayInMillis = 24 * 60 * 60 * 1000;
        const timeSinceRejection = new Date().getTime() - Number(rejectionTimestamp);
        if (timeSinceRejection > oneDayInMillis) showNotificationPopup = true;
      } else {
        showNotificationPopup = true;
      }
    }

    if (!localStorage.getItem('cookie_consent')) {
      showCookieBanner = true;
    }

    if (browser) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (browser) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  });
</script>

<svelte:head>
  <title>{data.settings?.site_title || 'Judul Situs Default'}</title>
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  {#if data.settings?.gsc_verification_code}<meta name="google-site-verification" content={data.settings.gsc_verification_code} />{/if}
  {#if data.settings?.bing_verification_code}<meta name="msvalidate.01" content={data.settings.bing_verification_code} />{/if}
  {#if data.settings?.yandex_verification_code}<meta name="yandex-verification" content={data.settings.yandex_verification_code} />{/if}


  {#if data.settings?.custom_head_script}{@html data.settings.custom_head_script}{/if}
</svelte:head>

<TopHeader pages={data.pages} />

{#if $page.route.id === '/(public)/[category]/[slug]'}
  <ReadingProgressBar />
{/if}

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
  <div class="sticky top-0 z-40 transition-opacity duration-300" class:opacity-0={!showHeader} class:pointer-events-none={!showHeader}>
    <Header siteTitle={data.settings?.site_title} siteLogoUrl={data.settings?.site_logo_url} />
  </div>

  <main class="flex-grow">
    {#key $page.url.pathname}
			<div in:fade={{ duration: 200, delay: 200 }} out:fade={{ duration: 200 }}>
				<slot />
			</div>
		{/key}
  </main>

  <Footer />
</div>

{#if showNotificationPopup}
  <NotificationPopup on:accept={handleAcceptNotification} on:reject={handleRejectNotification} />
{/if}

{#if showCookieBanner}
  <CookieBanner on:accept={handleAcceptCookies} />
{/if}

{#if data.settings?.custom_footer_script}{@html data.settings.custom_footer_script}{/if}

<style>
  :global(#nprogress .bar) {
    background: #06b6d4 !important;
    height: 3px !important;
    z-index: 9999 !important;
  }
</style>
