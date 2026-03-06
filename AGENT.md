# AGENT.md — Agent Rules & Conventions

## Role
You are an expert frontend developer building a fun, playful photo booth web app. Follow these rules strictly throughout the entire project.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit (latest) |
| Styling | Tailwind CSS v3 |
| UI Components | shadcn-svelte |
| Language | TypeScript |
| Package Manager | pnpm |
| Image Export | html2canvas |
| Fonts | Google Fonts — "Fredoka One" (headings), "Nunito" (body) |

---

## Project Structure

```
src/
├── lib/
│   ├── components/       # Reusable UI components
│   │   ├── Camera.svelte
│   │   ├── Countdown.svelte
│   │   ├── PhotoStrip.svelte
│   │   ├── TemplatePicker.svelte
│   │   └── TemplateCanvas.svelte
│   ├── stores/           # Svelte stores for state
│   │   └── booth.ts      # photos[], selectedTemplate, appStep
│   ├── templates/        # Template definitions
│   │   └── index.ts      # Array of template configs
│   └── utils/
│       └── export.ts     # html2canvas export logic
├── routes/
│   ├── +page.svelte          # Landing
│   ├── booth/+page.svelte    # Camera screen
│   ├── template/+page.svelte # Template picker
│   └── preview/+page.svelte  # Final preview + download
└── app.css                   # Global styles + font imports
```

---

## Design System

### Color Palette
```
Primary Pink:    #FF6B9D
Primary Yellow:  #FFD93D
Primary Purple:  #C77DFF
Primary Teal:    #4ECDC4
Light BG:        #FFF9FB
Dark Text:       #2D2D2D
```

### Typography
- Headings: `font-family: 'Fredoka One'` — fun, rounded, bold
- Body: `font-family: 'Nunito'` — friendly, readable

### Design Principles
- **Rounded everything**: use `rounded-2xl` or `rounded-3xl` minimum
- **Colorful & playful**: don't be afraid of bright colors
- **Animations matter**: add bounce, pulse, fade transitions throughout
- **Shadows**: use colored shadows (e.g. `shadow-pink-200`) not plain gray
- **Buttons**: large, pill-shaped (`rounded-full`), with hover scale effect

### Tailwind Custom Animations (add to tailwind.config)
```js
animation: {
  'bounce-soft': 'bounce 1s infinite',
  'pulse-fast': 'pulse 0.5s ease-in-out',
  'flash': 'flash 0.3s ease-out',
  'pop': 'pop 0.2s ease-out',
}
```

---

## State Management

Use a single Svelte store `src/lib/stores/booth.ts`:

```ts
// State shape
{
  step: 'landing' | 'booth' | 'template' | 'preview',
  photos: string[],        // base64 data URLs, max 3
  selectedTemplate: string | null,  // template id
}
```

- Never use `localStorage` or `sessionStorage`
- All state lives in memory (store resets on page refresh — that's fine)

---

## Camera Rules
- Always request `{ video: { facingMode: 'user' } }`
- Mirror the video preview with CSS: `transform: scaleX(-1)`
- Also mirror captured canvas so selfies look natural
- Handle `getUserMedia` permission denial gracefully — show friendly error UI
- Stop all media tracks when navigating away from camera screen

---

## Templates
Define templates as a TypeScript array in `src/lib/templates/index.ts`:

```ts
export type Template = {
  id: string
  name: string
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
}
```

Each template's `draw()` function renders the pattern onto a canvas — **no external image files**.

---

## Export Logic
- Use `html2canvas` to capture the final strip DOM element
- Filename format: `photobooth-[YYYY-MM-DD-HHmmss].png`
- Trigger browser download via `<a>` tag with `download` attribute
- Show a brief "Saving..." loading state during export

---

## Code Conventions
- Use TypeScript everywhere — no `any` types
- Prefer Svelte stores over component-local state for shared data
- Use `$:` reactive statements sparingly — prefer derived stores
- Component files: PascalCase (e.g. `PhotoStrip.svelte`)
- Utility files: camelCase (e.g. `export.ts`)
- Always handle loading and error states in UI
- Add comments for non-obvious logic (especially canvas drawing)

---

## DO's ✅
- Keep all logic client-side only
- Make it work on mobile (test touch events)
- Use shadcn-svelte components where appropriate (Button, Card, Badge)
- Add smooth page transitions between steps
- Make the countdown timer visually prominent and fun
- Add a subtle camera flash (white overlay) on each capture

## DON'Ts ❌
- Don't add any server routes or API endpoints
- Don't require any user login or auth
- Don't use `localStorage` or `sessionStorage`
- Don't use external image assets for templates — generate with canvas/CSS
- Don't skip error handling for camera access
- Don't use plain gray/default shadcn styling — always apply the colorful theme