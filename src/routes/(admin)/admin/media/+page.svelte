<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	// Menggunakan ikon dari steeze-ui
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		Photo,
		ArrowUpTray,
		Trash,
		Pencil,
		XMark,
		CircleStack,
		ClipboardDocument
	} from '@steeze-ui/heroicons';

	export let data: PageData;

	// --- State Baru ---
	let viewingMedia: typeof data.media[0] | null = null; // Untuk pratinjau gambar
	let editingMedia: typeof data.media[0] | null = null; // Untuk edit detail
	let editModalEl: HTMLDivElement;
	let viewModalEl: HTMLDivElement;
	

	// Fokus ke modal saat muncul
	$: if (editingMedia && editModalEl) editModalEl.focus();
	$: if (viewingMedia && viewModalEl) viewModalEl.focus();

	function formatBytes(bytes: number, decimals = 2) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			alert('URL disalin ke clipboard!');
		} catch (err) {
			console.error('Gagal menyalin: ', err);
		}
	}
</script>

{#if viewingMedia}
	<div
		role="dialog"
		aria-modal="true"
		bind:this={viewModalEl}
		tabindex="-1"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
		on:click={() => (viewingMedia = null)}
		on:keydown={(e) => {
			if (e.key === 'Escape') viewingMedia = null;
		}}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			role="document"
			class="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-slate-50 p-4 shadow-2xl"
			on:click|stopPropagation
		>
			<button
				on:click={() => (viewingMedia = null)}
				class="absolute -top-4 -right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg hover:bg-slate-200"
				aria-label="Tutup"
			>
				<Icon src={XMark} class="h-6 w-6" />
			</button>
			<img
				src={viewingMedia.url}
				alt={viewingMedia.altText ?? ''}
				class="h-auto w-full flex-shrink-1 overflow-y-auto rounded-md object-contain"
			/>
			<div class="mt-4 flex-shrink-0">
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label class="block text-xs font-medium text-slate-500">URL Gambar</label>
				<div class="mt-1 flex">
					<input
						type="text"
						readonly
						value={viewingMedia.url}
						class="w-full rounded-l-md border-slate-300 bg-slate-100 p-2 text-sm text-slate-600"
					/>
					<button
						on:click={() => copyToClipboard(viewingMedia.url)}
						class="rounded-r-md border border-l-0 border-slate-300 bg-slate-200 px-3 text-slate-600 hover:bg-slate-300"
						aria-label="Salin URL"
					>
						<Icon src={ClipboardDocument} class="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if editingMedia}
	<div
		role="dialog"
		aria-modal="true"
		bind:this={editModalEl}
		tabindex="-1"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		on:click={() => (editingMedia = null)}
		on:keydown={(e) => {
			if (e.key === 'Escape') editingMedia = null;
		}}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			role="document"
			class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
			on:click|stopPropagation
		>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold text-slate-900">Edit Detail Media</h3>
				<button on:click={() => (editingMedia = null)} class="text-slate-500 hover:text-slate-800">
					<Icon src={XMark} class="h-5 w-5" />
				</button>
			</div>
			<form
				method="POST"
				action="?/editFile"
				use:enhance={() => {
					editingMedia = null;
					return async ({ update }) => {
						await update({ reset: false });
						await invalidateAll(); // Refresh data setelah edit
					};
				}}
			>
				<input type="hidden" name="id" value={editingMedia.id} />
				<div class="space-y-4">
					<div>
						<label for="filename" class="mb-1 block text-sm font-medium text-slate-600">Filename</label>
						<input id="filename" name="filename" value={editingMedia.filename ?? ''} class="input-text w-full" />
					</div>
					<div>
						<label for="title" class="mb-1 block text-sm font-medium text-slate-600">Judul</label>
						<input id="title" name="title" value={editingMedia.title ?? ''} class="input-text w-full" />
					</div>
					<div>
						<label for="altText" class="mb-1 block text-sm font-medium text-slate-600">Alt Text (Teks Alternatif)</label>
						<textarea id="altText" name="altText" rows="3" class="input-textarea w-full">{editingMedia.altText ?? ''}</textarea>
					</div>
					<div>
						<label for="caption" class="mb-1 block text-sm font-medium text-slate-600">Caption</label>
						<textarea id="caption" name="caption" rows="2" class="input-textarea w-full">{editingMedia.caption ?? ''}</textarea>
					</div>
				</div>
				<div class="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
					<button
						type="button"
						on:click={() => (editingMedia = null)}
						class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
						>Batal</button
					>
					<button
						type="submit"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
						>Simpan</button
					>
				</div>
			</form>
		</div>
	</div>
{/if}


<main class="w-full">
	<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		</div>

	<div class="mb-8 rounded-lg border-2 border-dashed border-slate-300 p-6 hover:border-blue-500">
		</div>

	{#if data.media.length > 0}
		<div
			class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
		>
			{#each data.media as medium (medium.id)}
				<div
					class="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
				>
					<button class="block w-full" on:click={() => (viewingMedia = medium)}>
						<img
							src={medium.url}
							alt={medium.altText ?? 'Gambar'}
							class="h-40 w-full object-cover transition-transform group-hover:scale-105"
						/>
					</button>

					<div class="p-3">
						<p class="truncate text-xs font-medium text-slate-700" title={medium.filename}>{medium.filename}</p>
						<div class="mt-2 flex items-center justify-between text-xs text-slate-500">
							<span class="flex items-center gap-1">
								<Icon src={CircleStack} class="h-3 w-3" /> {formatBytes(medium.size)}
							</span>
							<div class="flex items-center gap-2">
								<button
									on:click={() => (editingMedia = medium)}
									class="flex items-center gap-1 hover:text-slate-900">
									<Icon src={Pencil} class="h-3 w-3" /> Edit
								</button>
								<form method="POST" action="?/deleteFile" use:enhance>
									<input type="hidden" name="id" value={medium.id} />
									<input type="hidden" name="key" value={medium.key} />
									<button type="submit" class="flex items-center gap-1 text-red-600 hover:text-red-800">
										<Icon src={Trash} class="h-3 w-3" /> Hapus
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
{/if}
</main>
<style>
	/* PERBAIKAN 4: Menghapus blok style kosong yang menyebabkan error */
</style>
