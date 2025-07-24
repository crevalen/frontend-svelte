<script lang="ts">
	import { page } from '$app/stores';

	// 1. Impor komponen <Icon> untuk menampilkan ikon
	import { Icon } from '@steeze-ui/svelte-icon';
	import { fade } from 'svelte/transition';

	// 2. Impor definisi ikon yang kita butuhkan dari @steeze-ui/heroicons
	import {
		ChartBarSquare,
		Newspaper,
		DocumentText,
		ChatBubbleLeftRight,
		Tag,
		Users,
		Photo,
		Cog6Tooth,
		PaintBrush,
		CodeBracketSquare
	} from '@steeze-ui/heroicons';

	const navLinks = [
		{ href: '/admin', label: 'Dasbor', icon: ChartBarSquare },
		{ href: '/admin/posts', label: 'Postingan', icon: Newspaper },
		{ href: '/admin/pages', label: 'Halaman', icon: DocumentText },
		{ href: '/admin/comments', label: 'Komentar', icon: ChatBubbleLeftRight },
		{ href: '/admin/taxonomies', label: 'Kategori & Tag', icon: Tag },
		{ href: '/admin/users', label: 'Pengguna', icon: Users },
		{ href: '/admin/media', label: 'Media', icon: Photo },
		{ href: '/admin/settings/seo', label: 'Pengaturan SEO', icon: Cog6Tooth },
		{ href: '/admin/settings/general', label: 'Pengaturan Umum', icon: PaintBrush },
		{ href: '/admin/settings/robots', label: 'Robots.txt', icon: CodeBracketSquare }
	];
</script>

<div class="flex min-h-screen bg-slate-50 text-slate-900">
	<aside class="sticky top-0 h-screen w-64 flex-shrink-0 border-r border-slate-50 bg-slate-50 p-4">
		<div class="mb-8 text-center">
			<a href="/admin" class="text-2xl font-bold text-slate-900">
				My<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">CMS</span>
			</a>
		</div>
		<nav class="flex flex-col gap-2">
			{#each navLinks as link}
				{@const isActive = $page.url.pathname === link.href ||
($page.url.pathname.startsWith(link.href) && link.href !== '/admin')}
				<a
					href={link.href}
					class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors {isActive
						? 'bg-blue-500 text-slate-50'
						: 'text-slate-900 hover:bg-blue-500 hover:text-slate-50'}"
				>
					<Icon src={link.icon} theme="outline" class="h-5 w-5" />
					<span>{link.label}</span>
				</a>
			{/each}
		</nav>
	</aside>

	<div class="flex-grow p-4 sm:p-6 lg:p-8">
		{#key $page.url.pathname}
			<div in:fade={{ duration: 200, delay: 200 }} out:fade={{ duration: 200 }}>
				<slot />
			</div>
		{/key}
	</div>
</div>