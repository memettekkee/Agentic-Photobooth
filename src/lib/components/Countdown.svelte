<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher<{ done: void }>();

	let count = 3;
	let intervalId: ReturnType<typeof setInterval>;
	let animKey = 0; // forces re-animation on each number change

	onMount(() => {
		intervalId = setInterval(() => {
			count--;
			animKey++;
			if (count <= 0) {
				clearInterval(intervalId);
				setTimeout(() => dispatch('done'), 500);
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<div class="flex flex-col items-center justify-center">
	{#key animKey}
		<div
			class="w-36 h-36 rounded-full flex items-center justify-center text-7xl font-heading text-white shadow-2xl animate-count-pop"
			style="background: radial-gradient(circle, #FF6B9D, #C77DFF);"
		>
			{count > 0 ? count : '📸'}
		</div>
	{/key}
	<p class="mt-4 font-heading text-white text-2xl drop-shadow-lg">
		{count > 0 ? 'Get ready!' : 'Smile!'}
	</p>
</div>
