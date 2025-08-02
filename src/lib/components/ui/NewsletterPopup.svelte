<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let showPopup = false;
	let formStatus: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
	let errorMessage = '';

	onMount(() => {
		const hasSeenPopup = sessionStorage.getItem('newsletter_popup_seen');
		if (!hasSeenPopup) {
			const timer = setTimeout(() => {
				showPopup = true;
			}, 8000);
			return () => clearTimeout(timer);
		}
	});

	function handleClose() {
		showPopup = false;
		sessionStorage.setItem('newsletter_popup_seen', 'true');
	}
</script>

{#if showPopup}
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-[98] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
		on:click={handleClose}
		aria-hidden="true"
	></div>

	<div
		transition:scale={{ duration: 300, start: 0.95, easing: (t) => 1 - Math.pow(1 - t, 3) }}
		class="fixed inset-0 z-[99] m-auto h-fit max-h-[90vh] w-[90vw] max-w-4xl rounded-2xl bg-white shadow-2xl"
	>
		<button
			type="button"
			on:click={handleClose}
			class="cursor-pointer absolute -top-3 -right-3 z-10 rounded-full bg-slate-700 p-1.5 text-white transition-all hover:bg-slate-900 hover:scale-110"
			aria-label="Tutup"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2.5"
				stroke="currentColor"
				class="h-5 w-5"
				><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg
			>
		</button>

		<div class="grid overflow-hidden rounded-2xl md:grid-cols-2">
			<div class="flex flex-col justify-center p-8 md:p-12">
				{#if formStatus === 'success'}
					<div class="flex h-full min-h-[250px] flex-col items-center justify-center text-center">
						<h3 class="text-2xl font-bold text-slate-900">Terima Kasih!</h3>
						<p class="mt-2 max-w-sm text-slate-600">
							Anda selangkah lebih dekat untuk mendapatkan konten terbaik dari kami.
						</p>
					</div>
				{:else}
					<div>
						<h3 class="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
							Berlangganan Artikel
						</h3>
						<p class="mt-3 text-slate-600">
							Jangan Ketinggalan Update Terbaru!
Dapatkan tips, artikel, dan konten eksklusif langsung ke email Anda.
						</p>
						<form
							method="POST"
							action="/subscribe"
							use:enhance={() => {
								formStatus = 'submitting';
								errorMessage = '';
								return async ({ result }) => {
									if (result.type === 'success' || result.type === 'failure') {
										if (result.data?.success) {
											formStatus = 'success';
											setTimeout(handleClose, 2500);
										} else {
											formStatus = 'error';
											errorMessage = result.data?.message || 'Terjadi kesalahan.';
										}
									} else {
										formStatus = 'error';
										errorMessage = 'Respons dari server tidak valid.';
									}
								};
							}}
							class="mt-6"
						>
							<div class="flex flex-col gap-3 sm:flex-row">
								<input
									type="email"
									name="email"
									placeholder="Masukkan Email Anda..."
									aria-label="Alamat Email untuk Newsletter"
									required
									class="w-full rounded-lg border-slate-300 px-4 py-3 text-base shadow-sm placeholder:text-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
								/>
								<button
									type="submit"
									disabled={formStatus === 'submitting'}
									class="cursor-pointer flex-shrink-0 rounded-lg bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 disabled:opacity-60"
								>
									{formStatus === 'submitting' ? '...' : 'Daftar'}
								</button>
							</div>
							{#if formStatus === 'error'}
								<p class="mt-2 text-left text-sm text-red-600">{errorMessage}</p>
							{/if}
						</form>
					</div>
				{/if}
			</div>

			<div class="hidden items-center justify-center bg-slate-50 md:flex">
				<img
					src="/newsletter-illustration.webp"
					alt="Newsletter Illustration"
					class="h-full w-full object-cover"
				/>
			</div>
		</div>
	</div>
{/if}