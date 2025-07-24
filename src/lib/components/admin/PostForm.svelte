<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import CustomEditor from './CustomEditor.svelte';
	// 1. Impor komponen <Icon> dan definisi ikon dari steeze-ui
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CheckCircle, ExclamationTriangle, XMark, Plus } from '@steeze-ui/heroicons';

	type Taxonomy = { id: string; name: string };

	// Props
	export let title = '';
	export let slug = '';
	export let metaTitle = '';
	export let metaDescription = '';
	export let focusKeyword = '';
	export let ogTitle = '';
	export let ogDescription = '';
	export let canonicalUrl = '';
	export let noIndex = false;
	export let noFollow = false;
	export let schemaType = 'BlogPosting';
	export let schemaTypes: string[] = [];
	// svelte-ignore export_let_unused
	export let selectedOgImage: { id: string; url: string } | null = null;
	export let content: string = '';
	export let published = false;
	export let form: { error?: string; success?: boolean; message?: string } | null = null;
	export let allCategories: Taxonomy[] = [];
	export let allTags: Taxonomy[] = [];
	export let selectedCategories: Taxonomy[] = [];
	export let selectedTags: Taxonomy[] = [];
	export let existingImageUrl: string | null | undefined = null;

	// State internal
	let imagePreviewUrl: string | null = existingImageUrl ?? null;
	let notification: { type: 'success' | 'error'; message: string } | null = null;
	let isCreatingCategory = false;
	let newCategoryName = '';
	let isCreatingTag = false;
	let newTagName = '';
	let categoryString: string;
	let tagString: string;

	// Logika Notifikasi
	$: if (form) {
		if (form.success && form.message) {
			notification = { type: 'success', message: form.message };
		} else if (form.error) {
			notification = { type: 'error', message: form.error };
		}
		form = null;
		setTimeout(() => (notification = null), 4000);
	}

	// Logika lain-lain
	$: categoryString = selectedCategories.map((c) => c.name).join(',');
	$: tagString = selectedTags.map((t) => t.name).join(',');

	function handleImageSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			imagePreviewUrl = URL.createObjectURL(input.files[0]);
		}
	}
	$: availableCategories = allCategories.filter((ac) => !selectedCategories.find((sc) => sc.name === ac.name));
	function handleCategorySelect(event: Event) {
		const target = event.target as HTMLSelectElement;
		const selectedId = target.value;
		if (selectedId === 'CREATE_NEW') {
			isCreatingCategory = true;
			return;
		}
		const categoryToAdd = allCategories.find((c) => c.id === selectedId);
		if (categoryToAdd) selectedCategories = [...selectedCategories, categoryToAdd];
		target.value = '';
	}
	function handleAddCategory() {
		if (newCategoryName.trim()) {
			selectedCategories = [...selectedCategories, { id: newCategoryName.trim(), name: newCategoryName.trim() }];
			newCategoryName = '';
			isCreatingCategory = false;
		}
	}
	function removeCategory(name: string) {
		selectedCategories = selectedCategories.filter((c) => c.name !== name);
	}
	$: availableTags = allTags.filter((at) => !selectedTags.find((st) => st.name === at.name));
	function handleTagSelect(event: Event) {
		const target = event.target as HTMLSelectElement;
		const selectedId = target.value;
		if (selectedId === 'CREATE_NEW') {
			isCreatingTag = true;
			return;
		}
		const tagToAdd = allTags.find((t) => t.id === selectedId);
		if (tagToAdd) selectedTags = [...selectedTags, tagToAdd];
		target.value = '';
	}
	function handleAddTag() {
		if (newTagName.trim()) {
			selectedTags = [...selectedTags, { id: newTagName.trim(), name: newTagName.trim() }];
			newTagName = '';
			isCreatingTag = false;
		}
	}
	function removeTag(name: string) {
		selectedTags = selectedTags.filter((t) => t.name !== name);
	}
</script>

{#if notification}
	<div
		class="fixed top-5 right-5 z-50 flex items-center gap-4 rounded-lg p-4 {notification.type === 'success'
			? 'bg-green-600'
			: 'bg-red-600'} border {notification.type === 'success'
			? 'border-green-700'
			: 'border-red-700'} text-white shadow-lg"
	>
		{#if notification.type === 'success'}
			<Icon src={CheckCircle} class="h-5 w-5" />
		{:else}
			<Icon src={ExclamationTriangle} class="h-5 w-5" />
		{/if}
		<p class="text-sm font-medium">{notification.message}</p>
		<button on:click={() => (notification = null)} class="ml-auto opacity-70 hover:opacity-100">
			<Icon src={XMark} class="h-5 w-5" />
		</button>
	</div>
{/if}

<form method="POST" enctype="multipart/form-data">
	<div class="mb-8 flex items-center justify-end gap-x-4">
		<a
			href="/admin/posts"
			class="rounded-lg px-5 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100"
			>Kembali</a
		>
		<button
			type="submit"
			class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform hover:scale-105"
		>
			Simpan Postingan
		</button>
	</div>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="flex flex-col gap-y-6 lg:col-span-2">
			<div class="rounded-lg border border-slate-50 bg-slate-50">
				<label for="title" class="mb-2 block text-sm font-medium text-slate-900">Judul</label>
				<input
					id="title"
					name="title"
					type="text"
					required
					bind:value={title}
					class="input-text text-lg"
				/>
			</div>
			<div class="rounded-lg border border-slate-50 bg-slate-50">
				<label for="slug" class="mb-2 block text-sm font-medium text-slate-900">Slug</label>
				<input
					id="slug"
					name="slug"
					type="text"
					required
					bind:value={slug}
					class="input-text"
				/>
			</div>
			<div class="rounded-lg border border-slate-900 bg-white p-2 shadow-sm">
				<CustomEditor bind:value={content} />
			</div>
			<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
				<h3 class="mb-4 text-sm font-medium text-slate-500">Pratinjau di Google</h3>
				<div class="font-sans">
					<p class="text-sm text-slate-600">
						<span class="font-medium">https://www.crevalen.xyz</span> › Kategori › {slug || '...'}
					</p>
					<h2 class="truncate text-xl text-blue-700 hover:underline">
						{metaTitle || title || 'Judul Postingan Anda'}
					</h2>
					<p class="mt-1 text-sm text-slate-500">
						{metaDescription ||
							content.replace(/<[^>]*>/g, ' ').substring(0, 160) ||
							'Deskripsi akan muncul di sini...'}
					</p>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-y-6 lg:col-span-1">
			<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
				<h3 class="mb-4 font-semibold text-slate-800">Publikasi</h3>
				<div class="flex items-center">
					<input
						id="published"
						name="published"
						type="checkbox"
						bind:checked={published}
						class="h-4 w-4 rounded border-slate-300 bg-slate-100 text-blue-600 focus:ring-blue-500"
					/>
					<label for="published" class="ms-3 text-sm font-medium text-slate-700">Publikasikan</label>
				</div>
			</div>
			<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
				<h3 class="mb-4 font-semibold text-slate-800">Featured Image</h3>
				{#if imagePreviewUrl}
					<div class="mb-4">
						<img
							src={imagePreviewUrl}
							alt="Pratinjau"
							class="h-auto w-full rounded-lg object-cover"
						/>
					</div>
				{/if}
				<input
					id="imageUrl"
					name="imageUrl"
					type="file"
					accept="image/*"
					on:change={handleImageSelect}
					class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
				/>
				<div class="mt-4">
					<label for="imageAltText" class="mb-2 block text-xs font-medium text-slate-500"
						>Alt Text</label
					>
					<input
						id="imageAltText"
						name="imageAltText"
						type="text"
						placeholder="Deskripsi singkat gambar..."
						class="w-full rounded-lg border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-500"
					/>
				</div>
			</div>
			<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
				<h3 class="mb-4 font-semibold text-slate-800">Kategori</h3>
				<div class="flex flex-wrap gap-2">
					{#each selectedCategories as category (category.name)}
						<span
							class="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
						>
							{category.name}
							<button type="button" on:click={() => removeCategory(category.name)} class="text-blue-600 hover:text-blue-900">
								<Icon src={XMark} class="h-3.5 w-3.5" />
							</button>
						</span>
					{/each}
				</div>
				<div class="mt-4">
					{#if !isCreatingCategory}
						<select
							on:change={handleCategorySelect}
							class="w-full rounded-lg border-slate-300 bg-white p-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-blue-500"
						>
							<option value="" disabled selected>Pilih kategori...</option>
							{#each availableCategories as category}
								<option value={category.id}>{category.name}</option>
							{/each}
							<option value="CREATE_NEW" class="font-bold text-blue-600">-- Tambah Baru --</option>
						</select>
					{:else}
						<div class="flex gap-2">
							<input
								type="text"
								bind:value={newCategoryName}
								placeholder="Nama kategori baru..."
								class="w-full rounded-lg border-slate-300 bg-white p-2 text-sm text-slate-800"
								on:keydown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										handleAddCategory();
									}
								}}
							/>
							<button type="button" on:click={handleAddCategory} class="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white">Add</button>
							<button type="button" on:click={() => isCreatingCategory = false} class="rounded-lg bg-slate-200 px-3 py-1 text-sm text-slate-700">X</button>
						</div>
					{/if}
				</div>
			</div>
			<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
				<h3 class="mb-4 font-semibold text-slate-800">Tag</h3>
				<div class="flex flex-wrap gap-2">
					{#each selectedTags as tag (tag.name)}
						<span class="flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
							{tag.name}
							<button type="button" on:click={() => removeTag(tag.name)} class="text-purple-600 hover:text-purple-900">
								<Icon src={XMark} class="h-3.5 w-3.5" />
							</button>
						</span>
					{/each}
				</div>
				<div class="mt-4">
					{#if !isCreatingTag}
						<select
							on:change={handleTagSelect}
							class="w-full rounded-lg border-slate-300 bg-white p-2 text-sm text-slate-800 focus:border-purple-500 focus:ring-purple-500"
						>
							<option value="" disabled selected>Pilih tag...</option>
							{#each availableTags as tag}
								<option value={tag.id}>{tag.name}</option>
							{/each}
							<option value="CREATE_NEW" class="font-bold text-purple-600">-- Tambah Baru --</option>
						</select>
					{:else}
						<div class="flex gap-2">
							<input
								type="text"
								bind:value={newTagName}
								placeholder="Nama tag baru..."
								class="w-full rounded-lg border-slate-300 bg-white p-2 text-sm text-slate-800"
								on:keydown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										handleAddTag();
									}
								}}
							/>
							<button type="button" on:click={handleAddTag} class="rounded-lg bg-purple-600 px-3 py-1 text-sm text-white">Add</button>
							<button type="button" on:click={() => isCreatingTag = false} class="rounded-lg bg-slate-200 px-3 py-1 text-sm text-slate-700">X</button>
						</div>
					{/if}
				</div>
			</div>
			<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
				<h3 class="mb-4 font-semibold text-slate-800">Pengaturan SEO</h3>
				<div class="space-y-4">
					<div>
						<label for="focusKeyword" class="mb-2 block text-sm font-medium text-slate-500">Focus Keyword</label>
						<input id="focusKeyword" name="focusKeyword" type="text" bind:value={focusKeyword} class="input-text w-full" />
					</div>
					<div>
						<label for="metaTitle" class="mb-2 block text-sm font-medium text-slate-500">Meta Title</label>
						<input id="metaTitle" name="metaTitle" type="text" bind:value={metaTitle} class="input-text w-full" />
					</div>
					<div>
						<label for="metaDescription" class="mb-2 block text-sm font-medium text-slate-500">Meta Description</label>
						<textarea id="metaDescription" name="metaDescription" rows="4" bind:value={metaDescription} class="input-textarea w-full"></textarea>
					</div>
				</div>
			</div>
			<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
				<h3 class="mb-4 font-semibold text-slate-800">Pengaturan Lanjutan</h3>
				<div class="space-y-4">
					<div>
						<label for="canonicalUrl" class="mb-2 block text-sm font-medium text-slate-500">Canonical URL</label>
						<input id="canonicalUrl" name="canonicalUrl" type="text" bind:value={canonicalUrl} placeholder="Biarkan kosong untuk default" class="input-text w-full" />
					</div>
					<div>
						<label for="schemaType" class="mb-2 block text-sm font-medium text-slate-500">Tipe Schema</label>
						<select id="schemaType" name="schemaType" bind:value={schemaType} class="input-select w-full">
							{#each schemaTypes as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
						<p class="mt-1 text-xs text-slate-500">Pilih tipe konten yang paling sesuai.</p>
					</div>
					<div class="space-y-2">
						<span class="block text-sm font-medium text-slate-500">Robots Meta</span>
						<label class="flex items-center gap-x-3 text-sm text-slate-600">
							<input type="checkbox" name="noIndex" bind:checked={noIndex} class="input-checkbox" />
							<span>Halangi mesin pencari (noindex)</span>
						</label>
						<label class="flex items-center gap-x-3 text-sm text-slate-600">
							<input type="checkbox" name="noFollow" bind:checked={noFollow} class="input-checkbox" />
							<span>Larang mesin pencari mengikuti link (nofollow)</span>
						</label>
					</div>
				</div>
			</div>
			<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
				<h3 class="mb-4 font-semibold text-slate-800">Pratinjau Social Media (Open Graph)</h3>
				<div class="space-y-4">
					<div>
						<label for="ogTitle" class="mb-2 block text-sm font-medium text-slate-500">OG Title</label>
						<input id="ogTitle" name="ogTitle" type="text" bind:value={ogTitle} placeholder="Gunakan Judul SEO jika kosong" class="input-text w-full" />
					</div>
					<div>
						<label for="ogDescription" class="mb-2 block text-sm font-medium text-slate-500">OG Description</label>
						<textarea id="ogDescription" name="ogDescription" rows="3" bind:value={ogDescription} placeholder="Gunakan Meta Description jika kosong" class="input-textarea w-full"></textarea>
					</div>
					<div>
						<label for="ogImage" class="mb-2 block text-sm font-medium text-slate-500">OG Image</label>
						<input id="ogImage" name="ogImage" type="file" accept="image/*" class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-purple-700 hover:file:bg-purple-100" />
					</div>
				</div>
			</div>
			{#if form?.error}
				<div class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{form.error}</div>
			{/if}
		</div>
	</div>

	<input type="hidden" name="content" value={content} />
	<input type="hidden" name="categories" value={categoryString} />
	<input type="hidden" name="tags" value={tagString} />
</form>

