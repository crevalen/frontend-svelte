<script lang="ts">
	import type { PageData } from './$types';
	// 1. Impor komponen <Icon> dan definisi ikon dari steeze-ui
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Newspaper, Eye, ChatBubbleLeftRight, ExclamationTriangle } from '@steeze-ui/heroicons';

	export let data: PageData;
</script>

<div class="w-full">
	<div class="mb-8">
		<h1 class="text-3xl font-bold tracking-tight text-slate-900">Dasbor Utama</h1>
		<p class="mt-1 text-lg text-slate-600">Ringkasan aktivitas blog Anda.</p>
	</div>

	
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-slate-500">Total Postingan</p>
				<Icon src={Newspaper} class="h-5 w-5 text-slate-400" />
			</div>
			<p class="mt-2 text-3xl font-bold text-slate-900">{data.stats.posts}</p>
		</div>
		<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-slate-500">Total Views</p>
				<Icon src={Eye} class="h-5 w-5 text-slate-400" />
			</div>
			<p class="mt-2 text-3xl font-bold text-slate-900">{data.stats.views.toLocaleString()}</p>
		</div>
		<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-slate-500">Total Komentar</p>
				<Icon src={ChatBubbleLeftRight} class="h-5 w-5 text-slate-400" />
			</div>
			<p class="mt-2 text-3xl font-bold text-slate-900">{data.stats.comments}</p>
		</div>
		<a
			href="/admin/comments"
			class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:bg-slate-50"
		>
			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-slate-500">Perlu Moderasi</p>
				<Icon
					src={ExclamationTriangle}
					class="h-5 w-5 {data.stats.pendingComments > 0 ? 'text-amber-500' : 'text-slate-400'}"
				/>
			</div>
			<p
				class="mt-2 text-3xl font-bold {data.stats.pendingComments > 0
					? 'text-amber-500'
					: 'text-slate-900'}"
			>
				{data.stats.pendingComments}
			</p>
		</a>
	</div>

	
	<div class="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
		<h3 class="border-b border-slate-200 p-4 text-lg font-semibold text-slate-800">
			Postingan Terpopuler
		</h3>
		<div class="flex flex-col">
			{#each data.popularPosts as post, i}
				<a
					href="/admin/posts/{post.slug}/edit"
					class="flex items-center justify-between border-b border-slate-200 p-4 transition-colors last:border-b-0 hover:bg-slate-50"
				>
					<div class="flex items-center gap-4">
						<span class="text-xl font-bold text-slate-400">{i + 1}</span>
						<div>
							<p class="font-medium text-slate-800">{post.title}</p>
						</div>
					</div>
					<div class="flex items-center gap-2 text-sm font-semibold text-slate-600">
						<Icon src={Eye} class="h-4 w-4 text-slate-400" />
						{post.viewCount.toLocaleString()}
					</div>
				</a>
			{:else}
				<p class="p-4 text-center text-sm text-slate-500">Belum ada data view.</p>
			{/each}
		</div>
	</div>
</div>