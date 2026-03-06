export type Template = {
    id: string;
    name: string;
    emoji: string;
    /** Renders the background pattern onto ctx for given width/height */
    draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
};

// ──────────────────────────────────────────────
//  Helper utilities
// ──────────────────────────────────────────────

function drawDots(
    ctx: CanvasRenderingContext2D,
    bg: string,
    dotColor: string,
    radius: number,
    spacing: number,
    w: number,
    h: number
) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = dotColor;
    for (let x = spacing / 2; x < w; x += spacing) {
        for (let y = spacing / 2; y < h; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawStripes(
    ctx: CanvasRenderingContext2D,
    colors: string[],
    stripeWidth: number,
    diagonal: boolean,
    w: number,
    h: number
) {
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    if (diagonal) {
        // Tiling diagonal stripes using a large rotated pattern
        const size = Math.max(w, h) * 3;
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate(Math.PI / 4);
        ctx.translate(-size / 2, -size / 2);
        let col = 0;
        for (let x = -stripeWidth; x < size + stripeWidth; x += stripeWidth) {
            ctx.fillStyle = colors[col++ % colors.length];
            ctx.fillRect(x, 0, stripeWidth, size);
        }
        ctx.restore();
    } else {
        // Horizontal stripes
        let row = 0;
        for (let y = 0; y < h; y += stripeWidth) {
            ctx.fillStyle = colors[row++ % colors.length];
            ctx.fillRect(0, y, w, stripeWidth);
        }
    }
}

function drawCheckerboard(
    ctx: CanvasRenderingContext2D,
    colorA: string,
    colorB: string,
    cellSize: number,
    w: number,
    h: number
) {
    for (let row = 0; row * cellSize < h; row++) {
        for (let col = 0; col * cellSize < w; col++) {
            ctx.fillStyle = (row + col) % 2 === 0 ? colorA : colorB;
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}

function drawConfetti(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number
) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    const shapes = ['rect', 'circle', 'triangle'] as const;
    const colors = ['#FF6B9D', '#FFD93D', '#C77DFF', '#4ECDC4', '#FF8C42', '#6BCB77'];
    const rng = mulberry32(42); // deterministic seed

    for (let i = 0; i < 120; i++) {
        const x = rng() * w;
        const y = rng() * h;
        const size = 6 + rng() * 12;
        const angle = rng() * Math.PI * 2;
        const shape = shapes[Math.floor(rng() * shapes.length)];
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = colors[Math.floor(rng() * colors.length)];
        ctx.globalAlpha = 0.85;
        if (shape === 'rect') {
            ctx.fillRect(-size / 2, -size / 4, size, size / 2);
        } else if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(0, -size / 2);
            ctx.lineTo(size / 2, size / 2);
            ctx.lineTo(-size / 2, size / 2);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
        ctx.globalAlpha = 1;
    }
}

/** Simple seedable RNG (Mulberry32) for deterministic confetti */
function mulberry32(seed: number): () => number {
    let s = seed;
    return () => {
        s |= 0;
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function drawStars(ctx: CanvasRenderingContext2D, bg: string, starColor: string, w: number, h: number) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    const rng = mulberry32(99);
    ctx.fillStyle = starColor;
    for (let i = 0; i < 60; i++) {
        const x = rng() * w;
        const y = rng() * h;
        const size = 4 + rng() * 10;
        drawStar(ctx, x, y, 5, size, size / 2);
    }
}

function drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number,
    spikes: number,
    outerR: number,
    innerR: number
) {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.fill();
}

// ──────────────────────────────────────────────
//  Template definitions
// ──────────────────────────────────────────────

export const templates: Template[] = [
    {
        id: 'pink-polkadot',
        name: 'Pink Polkadot',
        emoji: '🩷',
        draw(ctx, w, h) {
            drawDots(ctx, '#FFFFFF', '#FF6B9D', 10, 40, w, h);
        },
    },
    {
        id: 'yellow-polkadot',
        name: 'Yellow Dots',
        emoji: '🌼',
        draw(ctx, w, h) {
            // Pastel yellow bg, colorful dots
            ctx.fillStyle = '#FFFDE7';
            ctx.fillRect(0, 0, w, h);
            const colors = ['#FF6B9D', '#C77DFF', '#4ECDC4', '#FF8C42'];
            const rng = mulberry32(7);
            for (let x = 20; x < w; x += 40) {
                for (let y = 20; y < h; y += 40) {
                    ctx.fillStyle = colors[Math.floor(rng() * colors.length)];
                    ctx.beginPath();
                    ctx.arc(x + rng() * 10 - 5, y + rng() * 10 - 5, 7 + rng() * 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        },
    },
    {
        id: 'rainbow-stripes',
        name: 'Rainbow Stripes',
        emoji: '🌈',
        draw(ctx, w, h) {
            drawStripes(
                ctx,
                ['#FFB3C1', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#BDB2FF', '#FFC6FF'],
                Math.ceil(h / 7),
                false,
                w,
                h
            );
        },
    },
    {
        id: 'diagonal-stripes',
        name: 'Diagonal Stripes',
        emoji: '🎀',
        draw(ctx, w, h) {
            drawStripes(ctx, ['#FF6B9D', '#FFFFFF', '#FF6B9D', '#FFD93D'], 30, true, w, h);
        },
    },
    {
        id: 'checkerboard',
        name: 'Checkerboard',
        emoji: '♟️',
        draw(ctx, w, h) {
            drawCheckerboard(ctx, '#E8C7FF', '#FFFFFF', Math.ceil(Math.max(w, h) / 12), w, h);
        },
    },
    {
        id: 'confetti',
        name: 'Confetti',
        emoji: '🎉',
        draw(ctx, w, h) {
            drawConfetti(ctx, w, h);
        },
    },
    {
        id: 'starry-night',
        name: 'Starry Night',
        emoji: '⭐',
        draw(ctx, w, h) {
            drawStars(ctx, '#1A1A2E', '#FFD93D', w, h);
        },
    },
    {
        id: 'mint-hearts',
        name: 'Mint Hearts',
        emoji: '💚',
        draw(ctx, w, h) {
            ctx.fillStyle = '#E8FFF5';
            ctx.fillRect(0, 0, w, h);
            const rng = mulberry32(21);
            ctx.fillStyle = '#4ECDC4';
            for (let i = 0; i < 50; i++) {
                const x = rng() * w;
                const y = rng() * h;
                const size = 8 + rng() * 12;
                ctx.globalAlpha = 0.6 + rng() * 0.4;
                // Simple heart using two arcs + path
                ctx.save();
                ctx.translate(x, y);
                ctx.beginPath();
                ctx.moveTo(0, size * 0.3);
                ctx.bezierCurveTo(-size, -size * 0.3, -size, size * 0.8, 0, size * 1.2);
                ctx.bezierCurveTo(size, size * 0.8, size, -size * 0.3, 0, size * 0.3);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                ctx.globalAlpha = 1;
            }
        },
    },
];

export function getTemplateById(id: string): Template | undefined {
    return templates.find((t) => t.id === id);
}
