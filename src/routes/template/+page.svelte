<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { booth } from '$lib/stores/booth';
	import PhotoStrip from '$lib/components/PhotoStrip.svelte';
	import TemplatePicker from '$lib/components/TemplatePicker.svelte';
	import { onDestroy } from 'svelte';

	let photos: string[] = [];
	let selectedTemplate: string | null = null;

	const unsubscribe = booth.subscribe((state) => {
		photos = state.photos;
		selectedTemplate = state.selectedTemplate;
	});

	onMount(() => {
		if (photos.length < 3) {
			goto('/booth');
		}
	});

	function handleSelect(event: CustomEvent<string>) {
		booth.setTemplate(event.detail);
	}

	function goPreview() {
		if (!selectedTemplate) return;
		goto('/preview');
	}

	function retake() {
		booth.clearPhotos();
		goto('/booth');
	}

	onDestroy(() => unsubscribe());
</script>

<svelte:head>
	<title>📸 Photobooth — Choose Background</title>
</svelte:head>

<main class="min-h-screen flex flex-col items-center px-4 py-8 gap-8 animate-fade-in">

	<!-- Header -->
	<div class="text-center">
		<h1 class="font-heading text-4xl" style="color: #C77DFF;">
			🎨 Pick a Background!
		</h1>
		<p class="font-body text-booth-text/60 mt-1">
			Choose a fun background for your photo strip
		</p>
	</div>

	<!-- Photo strip preview -->
	<div class="w-full max-w-xl">
		<div class="card-booth p-4">
			<PhotoStrip {photos} />
		</div>
	</div>

	<!-- Template picker -->
	<div class="w-full max-w-2xl card-booth">
		<h2 class="font-heading text-xl text-booth-text mb-4">Backgrounds</h2>
		<TemplatePicker selectedId={selectedTemplate} on:select={handleSelect} />
	</div>

	<!-- Actions -->
	<div class="flex flex-wrap gap-4 justify-center mt-2">
		<button
			class="btn-secondary border-2 border-pink-primary text-pink-primary hover:bg-pink-50"
			on:click={retake}
		>
			🔄 Retake Photos
		</button>

		<button
			class="btn-primary"
			disabled={!selectedTemplate}
			on:click={goPreview}
		>
			✨ Next — Preview
		</button>
	</div>
</main>
