# SPEC.md — Photo Booth Web App

## Overview
A fun, fully client-side web photo booth application. No login, no backend, no database. Everything runs in the browser.

---

## User Flow

1. **Landing Screen**
   - Show app title and a big "Start Booth" button
   - Brief instruction text (e.g. "Take 3 photos, pick a background, download your strip!")

2. **Camera Screen**
   - Request webcam access from browser
   - Show live camera preview (mirrored)
   - "Capture" button to start the sequence
   - Auto-capture 3 photos one by one, each with a 3-2-1 countdown
   - Flash effect on each capture
   - Show captured thumbnails below the preview as each is taken

3. **Template Selection Screen**
   - Show the 3 captured photos as a horizontal strip
   - Below/beside it: grid of background template options (min. 6 templates)
   - Clicking a template applies it as background to the strip preview
   - Selected template has a highlighted border
   - "Retake" button to go back and redo photos

4. **Download Screen**
   - Show final composed photo strip (3 frames + chosen background)
   - "Download" button — exports as a single PNG file
   - "Start Over" button to restart from scratch

---

## Features

### Camera
- Access webcam via `getUserMedia` browser API
- Mirror the live preview (like a selfie camera)
- Countdown timer (3-2-1) before each shot with animated display
- White flash animation on capture
- Support front camera on mobile

### Photo Strip
- 3 frames arranged horizontally
- Each frame has a slight border/shadow
- Rounded corners on frames
- Fixed aspect ratio per frame (e.g. 4:3 or 1:1)

### Background Templates (minimum 6)
| # | Name | Description |
|---|------|-------------|
| 1 | Pink Polkadot | White background, pink dots |
| 2 | Yellow Polkadot | Pastel yellow, colorful dots |
| 3 | Rainbow Stripes | Horizontal pastel rainbow stripes |
| 4 | Diagonal Stripes | Diagonal pink & white stripes |
| 5 | Checkerboard | Pastel purple & white checks |
| 6 | Confetti | Colorful scattered shapes on white |

- Templates are generated via CSS or Canvas (no external image files needed)
- Each template thumbnail shown in the picker is a small preview of the pattern

### Download / Export
- Use `html2canvas` or native Canvas API to composite:
  - Background pattern
  - 3 photo frames
  - Optional: small watermark/logo at bottom ("📸 photobooth")
- Export as `.png` file
- Filename: `photobooth-strip-[timestamp].png`

---

## Screens Summary

| Screen | Route | Description |
|--------|-------|-------------|
| Landing | `/` | Welcome screen, start button |
| Booth | `/booth` | Camera + capture flow |
| Template | `/template` | Pick background |
| Preview | `/preview` | Final strip + download |

---

## Constraints
- No authentication
- No server-side logic
- No external API calls
- Works on desktop and mobile browsers
- No file uploads from user (camera only)