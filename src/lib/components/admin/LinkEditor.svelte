<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Check, Link, Trash, XMark } from '@steeze-ui/heroicons';

	export let href: string = '';
	export let target: string = '';

	let urlInput: HTMLInputElement;
	let newTab: boolean = target === '_blank';
	const dispatch = createEventDispatcher();

	onMount(() => {
		urlInput?.focus();
	});

	function handleSave() {
		dispatch('save', {
			href: href,
			target: newTab ? '_blank' : ''
		});
	}
</script>

<div
	role="dialog"
	aria-modal="true"
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
	on:click={() => dispatch('close')}
	on:keydown={(e) => {
		if (e.key === 'Escape') dispatch('close');
	}}
>
	<div
		role="document"
		class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
		on:click|stopPropagation
	>
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-lg font-semibold text-slate-900">Edit Link</h3>
			<button on:click={() => dispatch('close')} class="text-slate-500 hover:text-slate-800">
				<Icon src={XMark} class="h-5 w-5" />
			</button>
		</div>
		<div class="space-y-4">
			<div>
				<label for="link-url" class="mb-2 block text-sm font-medium text-slate-600">URL</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Icon src={Link} class="h-4 w-4 text-slate-400" />
					</div>
					<input
						bind:this={urlInput}
						bind:value={href}
						on:keydown={(e) => {
							if (e.key === 'Enter') handleSave();
						}}
						id="link-url"
						type="text"
						placeholder="https://..."
						class="w-full rounded-lg border-slate-300 bg-white p-3 pl-10 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
			</div>
			<div class="flex items-center">
				<input
					id="new-tab"
					type="checkbox"
					bind:checked={newTab}
					class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
				/>
				<label for="new-tab" class="ms-3 text-sm font-medium text-slate-700">Buka di tab baru</label>
			</div>
		</div>
		<div class="mt-6 flex justify-between border-t border-slate-200 pt-4">
			<button
				type="button"
				on:click={() => dispatch('remove')}
				class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
			>
				<Icon src={Trash} class="h-4 w-4" /> Hapus Link
			</button>
			<button
				type="button"
				on:click={handleSave}
				class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
			>
				<Icon src={Check} class="h-4 w-4" /> Simpan
			</button>
		</div>
	</div>
</div>