<script lang="ts">
	import '../../app.css'; // Tetap impor CSS global kita
	// Di sini Anda bisa mengimpor komponen khusus admin, seperti AdminSidebar
</script>

<div class="flex h-screen bg-slate-50">
	<main class="flex-1 overflow-y-auto p-8">
		<slot />
	</main>
</div>