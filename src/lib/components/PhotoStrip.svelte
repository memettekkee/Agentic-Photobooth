<script lang="ts">
	export let photos: string[];
	/** Extra classes for the strip wrapper */
	export let className = '';

	const SLOT_LABELS = ['📸 1', '📸 2', '📸 3'];
</script>

<!--
  The strip: 3 portrait photo frames stacked vertically.
  Used in the template picker as a live preview.
-->
<div
	id="photo-strip"
	class="relative rounded-3xl overflow-hidden border-4 border-white shadow-card {className}"
	style="display: inline-flex; flex-direction: column; gap: 0; background: #FFF9FB;"
>
	{#each { length: 3 } as _, i}
		<div class="relative w-full" style="aspect-ratio: 4/3;">
			{#if photos[i]}
				<img
					src={photos[i]}
					alt="Photo {i + 1}"
					class="w-full h-full object-cover"
					style="display: block;"
				/>
			{:else}
				<!-- Empty slot placeholder -->
				<div class="w-full h-full flex flex-col items-center justify-center bg-pink-50">
					<span class="text-3xl opacity-40">{SLOT_LABELS[i]}</span>
				</div>
			{/if}

			<!-- Slot number badge -->
			<div
				class="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm text-xs font-heading text-pink-primary rounded-full px-2 py-0.5 shadow"
			>
				{i + 1}
			</div>
		</div>

		{#if i < 2}
			<!-- Horizontal separator between frames -->
			<div class="h-1.5 w-full bg-white flex-shrink-0" />
		{/if}
	{/each}

	<!-- Watermark -->
	<div
		class="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/70 text-xs font-heading tracking-wider drop-shadow"
		style="pointer-events: none;"
	>
		📸 photobooth
	</div>
</div>
