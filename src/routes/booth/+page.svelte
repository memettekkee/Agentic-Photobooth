<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { booth, photoCount, allPhotosTaken } from '$lib/stores/booth';
	import Camera from '$lib/components/Camera.svelte';

	let photos: string[] = [];
	let isCapturing = false;
	let captureQueue = false;

	const unsubscribe = booth.subscribe((state) => {
		photos = state.photos;
	});

	onDestroy(() => {
		unsubscribe();
	});

	function handleCaptured(event: CustomEvent<string>) {
		if (photos.length >= 3) return;
		booth.addPhoto(event.detail);

		// If we still need more photos, re-trigger capture automatically after a pause
		const currentCount = photos.length + 1; // +1 because store update is reactive
		if (photos.length < 2) {
			// will trigger re-capture from the Camera component next tick
		}
	}

	$: if ($allPhotosTaken) {
		// Brief delay then navigate
		setTimeout(() => goto('/template'), 1000);
	}
</script>

<svelte:head>
	<title>📸 Photobooth — Camera</title>
</svelte:head>

<main class="min-h-screen flex flex-col items-center justify-start px-4 py-8 gap-6 animate-fade-in">

	<!-- Header -->
	<div class="text-center">
		<h1 class="font-heading text-4xl" style="color: #FF6B9D;">
			📸 Strike a Pose!
		</h1>
		<p class="font-body text-booth-text/60 mt-1">
			{#if $allPhotosTaken}
				All 3 photos taken! Moving on… 🎉
			{:else}
				Photo {$photoCount + 1} of 3 — hit the button when you're ready!
			{/if}
		</p>
	</div>

	<!-- Progress dots -->
	<div class="flex gap-3 items-center">
		{#each { length: 3 } as _, i}
			<div
				class="w-4 h-4 rounded-full transition-all duration-300"
				class:scale-125={i < photos.length}
				style="background: {i < photos.length ? 'linear-gradient(135deg,#FF6B9D,#C77DFF)' : '#E0C0D0'};"
			/>
		{/each}
	</div>

	<!-- Camera + vertical thumbnail strip side by side -->
	<div class="flex gap-4 items-start justify-center w-full">

		<!-- Camera -->
		<Camera on:captured={handleCaptured} />

		<!-- Vertical thumbnail strip of captured photos -->
		{#if photos.length > 0}
			<div class="flex flex-col gap-3 animate-fade-in">
				{#each photos as photo, i}
					<div class="relative animate-pop">
						<img
							src={photo}
							alt="Captured photo {i + 1}"
							class="w-16 h-20 md:w-20 md:h-[6.5rem] object-cover rounded-2xl border-4 border-white shadow-pink"
						/>
						<div
							class="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-heading text-white shadow"
							style="background: linear-gradient(135deg, #FF6B9D, #C77DFF);"
						>
							{i + 1}
						</div>
					</div>
				{/each}
				<!-- Empty placeholder slots -->
				{#each { length: 3 - photos.length } as _}
					<div class="w-16 h-20 md:w-20 md:h-[6.5rem] rounded-2xl border-4 border-dashed border-pink-200 bg-pink-50 flex items-center justify-center">
						<span class="text-pink-300 text-xl">?</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Back link -->
	<a href="/" class="font-body text-sm text-booth-text/40 hover:text-pink-primary transition-colors mt-auto">
		← Back to home
	</a>
</main>
