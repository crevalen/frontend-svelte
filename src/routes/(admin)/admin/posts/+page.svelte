<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	export let data: PageData;
</script>

<div class="min-h-screen bg-slate-50 text-slate-900">
	<main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Manajemen Postingan</h1>
				<p class="mt-1 text-sm text-slate-900">Buat, edit, dan hapus artikel blog Anda dari sini.</p>
			</div>
			<div class="flex w-full sm:w-auto gap-x-4">
				<a href="/admin" class="w-1/2 sm:w-auto rounded-lg px-5 py-2.5 text-center text-sm font-medium text-slate-900 ring-1 ring-slate-700 transition-colors hover:bg-blue-800 hover:text-slate-100">
					← Dasbor
				</a>
				<a href="/admin/posts/new" class="w-1/2 sm:w-auto flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform hover:scale-105">
					+ Tulis Baru
				</a>
			</div>
		</div>

		<div class="w-full overflow-hidden rounded-lg border border-slate-800">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-slate-800">
					<thead class="bg-slate-50">
						<tr>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-900">Judul</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-900">Author</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-900">Kategori & Tag</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-900">Status</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-900">Terakhir Diupdate</th>
							<th scope="col" class="relative px-6 py-3"><span class="sr-only">Aksi</span></th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-800 bg-slate-50">
						{#each data.posts as post (post.id)}
							<tr>
								<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 max-w-xs truncate" title={post.title}>
    {post.title}
</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-slate-900">{post.author.username}</td>
								<td class="px-6 py-4 text-sm text-slate-900">
									<div class="flex flex-wrap gap-1">
										{#each post.categories as category}
											<span class="rounded-full bg-blue-700 px-2 py-0.5 text-xs text-slate-50">{category.name}</span>
										{/each}
										{#each post.tags as tag}
											<span class="rounded-full bg-blue-700 px-2 py-0.5 text-xs text-slate-50">{tag.name}</span>
										{/each}
									</div>
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm">
									{#if post.published}
										<span class="inline-flex items-center rounded-full bg-green-700 px-2 py-1 text-xs font-medium text-slate-50">Published</span>
									{:else}
										<span class="inline-flex items-center rounded-full bg-green-700 px-2 py-1 text-xs font-medium text-slate-50">Draft</span>
									{/if}
								</td>
								<td class="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
									{new Date(post.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
								</td>
								<td class="flex items-center justify-end gap-x-4 whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
									<a href="/{post.categories}/{post.slug}" target="_blank" class="text-green-400 transition-colors hover:text-green-700">Lihat</a>
									<a href="/admin/posts/{post.slug}/edit" class="text-blue-400 transition-colors hover:text-blue-700">Edit</a>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={post.id} />
										<button type="submit" class="text-red-400 transition-colors hover:text-red-900" on:click|preventDefault={(e) => {
											if(confirm(`Anda yakin ingin menghapus postingan '${post.title}'?`)) {
												e.currentTarget.form?.submit()
											}
										}}>Delete</button>
									</form>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="6" class="px-6 py-12 text-center text-sm text-slate-900">
									Anda belum memiliki postingan. Silakan buat yang baru.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</main>
</div>