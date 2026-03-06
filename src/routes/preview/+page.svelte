<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { booth } from '$lib/stores/booth';
	import TemplateCanvas from '$lib/components/TemplateCanvas.svelte';

	let photos: string[] = [];
	let selectedTemplate: string | null = null;
	let isSaving = false;
	let saved = false;

	// The canvas exposed by TemplateCanvas (bound via bind:canvasEl)
	let canvasEl: HTMLCanvasElement | null = null;

	const unsubscribe = booth.subscribe((state) => {
		photos = state.photos;
		selectedTemplate = state.selectedTemplate;
	});

	onMount(() => {
		if (photos.length < 3 || !selectedTemplate) {
			goto('/template');
		}
	});

	onDestroy(() => unsubscribe());

	async function download() {
		if (isSaving || !canvasEl) return;
		isSaving = true;

		try {
			// Use toBlob so the browser honours the filename in link.download
			// (data: URIs cause browsers to generate a UUID filename and ignore the download attribute)
			await new Promise<void>((resolve, reject) => {
				canvasEl!.toBlob(
					(blob) => {
						if (!blob) { reject(new Error('Canvas toBlob failed')); return; }

						const now = new Date();
						const pad = (n: number) => String(n).padStart(2, '0');
						const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

						const objectUrl = URL.createObjectURL(blob);
						const link = document.createElement('a');
						link.href = objectUrl;
						link.download = `photobooth-strip-${ts}.jpg`;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);

						// Release the object URL after the browser has started the download
						setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
						resolve();
					},
					'image/jpeg',
					0.92
				);
			});

			saved = true;
			setTimeout(() => { saved = false; }, 3000);
		} catch (err) {
			console.error('Download failed:', err);
		} finally {
			isSaving = false;
		}
	}

	function startOver() {
		booth.reset();
		goto('/');
	}
</script>

<svelte:head>
	<title>📸 Photobooth — Your Strip!</title>
</svelte:head>

<main class="min-h-screen flex flex-col items-center px-4 py-8 gap-8 animate-fade-in">

	<!-- Header -->
	<div class="text-center">
		<h1 class="font-heading text-4xl" style="color: #4ECDC4;">
			🎉 Your Strip is Ready!
		</h1>
		<p class="font-body text-booth-text/60 mt-1">
			Here's your beautiful photo strip. Download it and share!
		</p>
	</div>

	<!-- Canvas strip — bind:canvasEl exposes the canvas for download -->
	<div class="w-full max-w-2xl flex justify-center">
		<TemplateCanvas
			templateId={selectedTemplate}
			{photos}
			bind:canvasEl
		/>
	</div>

	<!-- Action buttons -->
	<div class="flex flex-wrap gap-4 justify-center">
		<button
			class="btn-primary text-xl px-10 py-4"
			on:click={download}
			disabled={isSaving}
		>
			{#if isSaving}
				⏳ Saving…
			{:else if saved}
				✅ Saved!
			{:else}
				⬇️ Download JPG
			{/if}
		</button>

		<button
			class="btn-secondary border-2 border-teal-400 text-teal-500 hover:bg-teal-50"
			on:click={startOver}
		>
			🔁 Start Over
		</button>
	</div>

	<!-- Back link -->
	<a href="/template" class="font-body text-sm text-booth-text/40 hover:text-purple-primary transition-colors">
		← Change background
	</a>
</main>
