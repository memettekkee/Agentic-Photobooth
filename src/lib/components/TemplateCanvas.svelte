<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { getTemplateById } from '$lib/templates';

	export let templateId: string | null = null;
	export let photos: string[] = [];
	// Exposed so parent can bind to this canvas and call toDataURL()
	export let canvasEl: HTMLCanvasElement | null = null;

	// Vertical strip: single column, 3 frames stacked
	const FRAME_W = 480;        // width of each frame
	const FRAME_H = 360;        // height per frame (4:3 landscape)
	const GAP = 10;             // gap between frames
	const PADDING = 24;
	const WATERMARK_H = 40;
	const TOTAL_W = PADDING * 2 + FRAME_W;
	const TOTAL_H = PADDING * 2 + FRAME_H * 3 + GAP * 2 + WATERMARK_H;

	$: if (canvasEl && (templateId !== undefined || photos !== undefined)) {
		draw();
	}

	onMount(() => draw());
	afterUpdate(() => draw());

	async function draw() {
		if (!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const W = TOTAL_W;
		const H = TOTAL_H;
		canvasEl.width = W;
		canvasEl.height = H;

		// 1. Background
		if (templateId) {
			const tpl = getTemplateById(templateId);
			if (tpl) {
				tpl.draw(ctx, W, H);
			} else {
				ctx.fillStyle = '#FFF9FB';
				ctx.fillRect(0, 0, W, H);
			}
		} else {
			ctx.fillStyle = '#FFF9FB';
			ctx.fillRect(0, 0, W, H);
		}

		// 2. Photo frames — stacked vertically
		for (let i = 0; i < 3; i++) {
			const x = PADDING;
			const y = PADDING + i * (FRAME_H + GAP);

			// Frame background / placeholder
			ctx.save();
			roundedRect(ctx, x, y, FRAME_W, FRAME_H, 16);
			ctx.fillStyle = '#FFE0ED';
			ctx.fill();
			ctx.strokeStyle = '#FFFFFF';
			ctx.lineWidth = 6;
			ctx.stroke();

			// Photo image if available
			if (photos[i]) {
				try {
					const img = await loadImage(photos[i]);
					ctx.save();
					roundedRect(ctx, x, y, FRAME_W, FRAME_H, 16);
					ctx.clip();
					// Scale to cover
					const scaleX = FRAME_W / img.width;
					const scaleY = FRAME_H / img.height;
					const scale = Math.max(scaleX, scaleY);
					const dw = img.width * scale;
					const dh = img.height * scale;
					const dx = x + (FRAME_W - dw) / 2;
					const dy = y + (FRAME_H - dh) / 2;
					ctx.drawImage(img, dx, dy, dw, dh);
					ctx.restore();
					// Border on top
					ctx.save();
					roundedRect(ctx, x, y, FRAME_W, FRAME_H, 16);
					ctx.strokeStyle = '#FFFFFF';
					ctx.lineWidth = 6;
					ctx.stroke();
					ctx.restore();
				} catch {
					// Keep placeholder
				}
			} else {
				// Placeholder text
				ctx.fillStyle = '#FF6B9D';
				ctx.font = `bold 18px 'Nunito', sans-serif`;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(`📸 ${i + 1}`, x + FRAME_W / 2, y + FRAME_H / 2);
			}
			ctx.restore();
		}

		// 3. Watermark
		ctx.fillStyle = 'rgba(45, 45, 45, 0.5)';
		ctx.font = `bold 18px 'Nunito', sans-serif`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('📸 photobooth', W / 2, H - WATERMARK_H / 2 - 4);
	}

	function roundedRect(
		ctx: CanvasRenderingContext2D,
		x: number, y: number,
		w: number, h: number,
		r: number
	) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + w - r, y);
		ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		ctx.lineTo(x + w, y + h - r);
		ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		ctx.lineTo(x + r, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		ctx.lineTo(x, y + r);
		ctx.quadraticCurveTo(x, y, x + r, y);
		ctx.closePath();
	}

	function loadImage(src: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = src;
		});
	}
</script>

<!-- The canvas element is exposed via bind:canvasEl for parent download logic -->
<canvas
	bind:this={canvasEl}
	class="rounded-3xl shadow-card max-w-full"
	style="max-height: 60vh;"
	aria-label="Photo strip preview"
/>
