<script lang="ts">
	import { goto } from '$app/navigation';
	import { booth } from '$lib/stores/booth';

	function start() {
		booth.reset();
		goto('/booth');
	}

	const features = [
		{ emoji: '📸', text: 'Take 3 fun photos' },
		{ emoji: '🎨', text: 'Pick a colorful background' },
		{ emoji: '⬇️', text: 'Download your strip!' },
	];
</script>

<svelte:head>
	<title>📸 Photobooth — Fun Photo Strips!</title>
	<meta name="description" content="A fun, playful photo booth web app — take 3 photos, pick a background, and download your strip!" />
</svelte:head>

<main class="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">

	<!-- Decorative background blobs -->
	<div class="absolute top-0 left-0 w-72 h-72 bg-pink-100 rounded-full opacity-60 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
	<div class="absolute bottom-0 right-0 w-80 h-80 bg-purple-100 rounded-full opacity-60 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
	<div class="absolute top-1/2 left-1/4 w-48 h-48 rounded-full opacity-40 blur-2xl pointer-events-none" style="background: #FFD93D;" />

	<div class="relative z-10 flex flex-col items-center gap-8 animate-fade-in text-center">

		<!-- Hero emoji -->
		<div class="text-8xl animate-bounce-soft select-none">📸</div>

		<!-- Title -->
		<div>
			<h1 class="font-heading text-6xl md:text-7xl"
				style="background: linear-gradient(135deg, #FF6B9D, #C77DFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
				Photobooth
			</h1>
			<p class="font-body text-booth-text/70 text-lg mt-2">
				Your pocket-sized photo strip studio ✨
			</p>
		</div>

		<!-- Feature list -->
		<div class="flex flex-col md:flex-row gap-4 mt-2">
			{#each features as f}
				<div class="card-booth flex items-center gap-3 px-6 py-4 border border-pink-100 hover:shadow-pink transition-all duration-300 hover:scale-105">
					<span class="text-3xl">{f.emoji}</span>
					<span class="font-body font-semibold text-booth-text">{f.text}</span>
				</div>
			{/each}
		</div>

		<!-- CTA -->
		<button
			id="start-booth-btn"
			class="btn-primary text-2xl px-12 py-5 mt-4 animate-pop"
			on:click={start}
		>
			🎉 Start Booth
		</button>

		<p class="font-body text-sm text-booth-text/50">
			No account needed · Works right in your browser · 100% private
		</p>
	</div>
</main>
