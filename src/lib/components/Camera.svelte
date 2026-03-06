<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { booth } from '$lib/stores/booth';
	import Countdown from './Countdown.svelte';

	const dispatch = createEventDispatcher<{ captured: string }>();

	let videoEl: HTMLVideoElement;
	let canvasEl: HTMLCanvasElement;
	let stream: MediaStream | null = null;
	let cameraError: string | null = null;
	let isLoading = true;
	let isCapturing = false;
	let showCountdown = false;
	let showFlash = false;
	let photoCaptured = false;

	onMount(async () => {
		await initCamera();
	});

	onDestroy(() => {
		stopCamera();
	});

	async function initCamera() {
		isLoading = true;
		cameraError = null;
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
				audio: false,
			});
			videoEl.srcObject = stream;
			await videoEl.play();
			isLoading = false;
		} catch (err) {
			isLoading = false;
			if (err instanceof DOMException) {
				if (err.name === 'NotAllowedError') {
					cameraError = "Camera access was denied. Please allow camera permissions and refresh the page.";
				} else if (err.name === 'NotFoundError') {
					cameraError = "No camera found on this device.";
				} else {
					cameraError = `Camera error: ${err.message}`;
				}
			} else {
				cameraError = "Could not access the camera. Please try again.";
			}
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((t) => t.stop());
			stream = null;
		}
	}

	async function startCapture() {
		if (isCapturing) return;
		isCapturing = true;
		showCountdown = true;
	}

	function onCountdownDone() {
		showCountdown = false;
		capturePhoto();
	}

	function capturePhoto() {
		const video = videoEl;
		const canvas = canvasEl;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		// Mirror horizontally so selfies look natural
		ctx.save();
		ctx.translate(canvas.width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(video, 0, 0);
		ctx.restore();

		const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

		// Flash effect
		showFlash = true;
		setTimeout(() => { showFlash = false; }, 400);

		dispatch('captured', dataUrl);
		photoCaptured = true;

		setTimeout(() => {
			photoCaptured = false;
			isCapturing = false;
		}, 600);
	}
</script>

<div class="relative w-full flex flex-col items-center gap-4">

	<!-- Flash overlay -->
	{#if showFlash}
		<div class="absolute inset-0 bg-white z-50 animate-flash pointer-events-none rounded-3xl" />
	{/if}

	<!-- Camera viewport -->
	<div class="relative w-full max-w-sm">
		{#if isLoading}
			<div class="flex items-center justify-center w-full aspect-[3/4] bg-pink-100 rounded-3xl">
				<div class="flex flex-col items-center gap-3">
					<div class="w-12 h-12 border-4 border-pink-primary border-t-transparent rounded-full animate-spin" />
					<p class="font-body text-pink-400 font-semibold">Loading camera…</p>
				</div>
			</div>
		{:else if cameraError}
			<div class="flex items-center justify-center w-full aspect-[3/4] bg-red-50 rounded-3xl p-8 text-center">
				<div class="flex flex-col items-center gap-4">
					<span class="text-5xl">😕</span>
					<p class="font-body text-red-500 font-semibold">{cameraError}</p>
					<button
						class="btn-primary"
						on:click={initCamera}
					>Try Again</button>
				</div>
			</div>
		{/if}

		<!-- Video element — always rendered so we can attach stream -->
		<div class="relative aspect-[3/4]" class:hidden={isLoading || !!cameraError}>
			<!-- Countdown overlay -->
			{#if showCountdown}
				<div class="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
					<Countdown on:done={onCountdownDone} />
				</div>
			{/if}

			<video
				bind:this={videoEl}
				class="absolute inset-0 w-full h-full object-cover rounded-3xl border-4 border-white shadow-pink"
				style="transform: scaleX(-1);"
				playsinline
				muted
				autoplay
			/>
		</div>
	</div>

	<!-- Hidden canvas for capture -->
	<canvas bind:this={canvasEl} class="hidden" />

	<!-- Capture button -->
	{#if !isLoading && !cameraError}
		<button
			class="btn-primary flex items-center gap-2 text-xl px-10 py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
			disabled={isCapturing}
			on:click={startCapture}
		>
			{#if isCapturing}
				<span class="animate-pulse-fast">⏳</span> Get ready…
			{:else}
				📸 Capture Photo
			{/if}
		</button>
	{/if}
</div>
