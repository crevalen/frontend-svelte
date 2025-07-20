<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import NProgress from 'nprogress';
  import 'nprogress/nprogress.css';
  import type { PageData } from './$types';
  import { theme } from '$lib/stores/theme';
  
  import "../../app.css";
 
  import TopHeader from '$lib/sections/TopHeader.svelte';
  import Header from "$lib/sections/Header.svelte";
  import Footer from "$lib/sections/Footer.svelte";
  import ReadingProgressBar from '$lib/components/ui/ReadingProgressBar.svelte';
  import CookieBanner from '$lib/components/ui/CookieBanner.svelte';
  import NotificationPopup from '$lib/components/ui/NotificationPopup.svelte'; 
  import { urlBase64ToUint8Array } from '$lib/utils/formatters';
  
 

  
  export let data: PageData;


  // --- LOGIKA BARU UNTUK COOKIE BANNER ---
  let showCookieBanner = false;

  function handleAcceptCookies() {
    showCookieBanner = false;
    localStorage.setItem('cookie_consent', 'true');
  }
  // --- SELESAI LOGIKA BARU ---

   // --- LOGIKA BARU UNTUK POPUP NOTIFIKASI ---
  let showNotificationPopup = false;

    async function handleAcceptNotification() {
    showNotificationPopup = false;
    if (!browser || !('Notification' in window) || !('serviceWorker' in navigator)) {
      return;
    }
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

  $: if (browser) {
    const html = document.documentElement;
    if ($theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  let lastScrollY = 0;
  let showHeader = true;
  NProgress.configure({ showSpinner: false });
  beforeNavigate(() => NProgress.start());
  afterNavigate(() => NProgress.done());
  function handleScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 150) {
      showHeader = false;
    } else {
      showHeader = true;
    }
    lastScrollY = currentScrollY;
  }
  onMount(() => {

    if (browser && 'Notification' in window && Notification.permission === 'default') {
      const rejectionTimestamp = localStorage.getItem('notification_rejection_timestamp');
      if (rejectionTimestamp) {
        const oneDayInMillis = 24 * 60 * 60 * 1000;
        const timeSinceRejection = new Date().getTime() - Number(rejectionTimestamp);
        // Tampilkan lagi jika sudah lebih dari 24 jam
        if (timeSinceRejection > oneDayInMillis) {
          showNotificationPopup = true;
        }
      } else {
        // Tampilkan jika belum pernah menolak sama sekali
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
  <meta name="google-site-verification" content="nVnoX2VqJN1VEotoKyNBB1WHBUdK86IANmecOn95yXs" />

  {#if data.settings?.site_favicon_url}<link rel="icon" href={data.settings.site_favicon_url} />{/if}
  {#if data.settings?.gsc_verification_code}<meta name="google-site-verification" content={data.settings.gsc_verification_code} />{/if}
  {#if data.settings?.bing_verification_code}<meta name="msvalidate.01" content={data.settings.bing_verification_code} />{/if}
  {#if data.settings?.yandex_verification_code}<meta name="yandex-verification" content={data.settings.yandex_verification_code} />{/if}
  {#if browser && data.settings?.ga4_id}
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-LXGKK2J43E"></script>
   <script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-LXGKK2J43E');
</script>
  {/if}
  {#if data.settings?.custom_head_script}{@html data.settings.custom_head_script}{/if}
</svelte:head>

<TopHeader pages={data.pages} />

{#if $page.route.id === '/[category]/[slug]'}
  <ReadingProgressBar />
{/if}

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
  <div class="sticky top-0 z-40 transition-transform duration-300" class:-translate-y-full={!showHeader}>
    <Header siteTitle={data.settings?.site_title} siteLogoUrl={data.settings?.site_logo_url} />
  </div>
  <main class="flex-grow">
    {#key data.url}
        <slot />
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