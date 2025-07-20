<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { browser } from '$app/environment';
	
	// Logika dark mode tetap di sini agar berlaku global
	$: if (browser) {
		const html = document.documentElement;
		if ($theme === 'dark') {
			html.classList.add('dark');
		} else {
			html.classList.remove('dark');
		}
	}
</script>

<slot />