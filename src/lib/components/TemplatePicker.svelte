<script lang="ts">
	import { templates } from '$lib/templates';
	import type { Template } from '$lib/templates';
	import { createEventDispatcher } from 'svelte';

	export let selectedId: string | null = null;

	const dispatch = createEventDispatcher<{ select: string }>();

	function handleSelect(id: string) {
		dispatch('select', id);
	}

	/** Svelte action: renders a template onto a canvas element */
	function drawTemplate(canvas: HTMLCanvasElement, tpl: Template) {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		tpl.draw(ctx, canvas.width, canvas.height);
		return {
			update(newTpl: Template) {
				tpl.draw(ctx, canvas.width, canvas.height);
			}
		};
	}
</script>

<div class="grid grid-cols-4 gap-3">
	{#each templates as tpl}
		{@const isSelected = tpl.id === selectedId}
		<button
			class="group flex flex-col items-center gap-2 focus:outline-none"
			on:click={() => handleSelect(tpl.id)}
			title={tpl.name}
		>
			<!-- Thumbnail via canvas action -->
			<div
				class="w-full aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-200 shadow-sm group-hover:scale-105"
				class:border-pink-primary={isSelected}
				class:shadow-pink={isSelected}
				class:border-transparent={!isSelected}
			>
				<canvas
					width="120"
					height="120"
					class="w-full h-full"
					use:drawTemplate={tpl}
				/>
			</div>

			<!-- Template name -->
			<span
				class="text-xs font-heading transition-colors duration-200 text-center leading-tight"
				class:text-pink-primary={isSelected}
				class:text-booth-text={!isSelected}
			>
				{tpl.emoji} {tpl.name}
			</span>
		</button>
	{/each}
</div>
