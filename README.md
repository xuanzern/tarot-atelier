# Art Nouveau Tarot Atelier

An interactive tarot reading experience that procedurally generates an Art Nouveau styled deck. Users can choose spreads, draw seeded cards, and explore detailed meanings for upright and reversed orientations.

## Features
- **Generative visuals**: Each card illustration is rendered on the fly with flowing motifs, gradients, and palettes inspired by early 1900s Art Nouveau posters.
- **Spread selection**: Pick between single-card insight, Past | Present | Future, or a five-card growth spread. Readings are deterministic thanks to seeded shuffles.
- **Rich interpretations**: Fortune-telling prompts, keywords, and upright/reversed meanings sourced from Mark McElroy's _A Guide to Tarot Meanings_.
- **Accessible UI**: Keyboard focus states, descriptive labels, and responsive layouts that adapt from mobile to large displays.

## Getting Started
```bash
npm install
npm run dev
```
Then visit the printed URL (defaults to `http://localhost:5173`).

## Building for Production
```bash
npm run build
npm run preview
```
`npm run build` creates the optimized bundle in `dist/`; `npm run preview` serves the result locally for verification.

## Project Structure
- `src/App.tsx` – Main page composition: header controls, spread selection, card grid, and interpretation panel.
- `src/components/` – UI pieces including the SVG-based `TarotCardArt`, card tiles, and the interpretation panel.
- `src/data/tarot_raw.json` – Interpretation corpus for all 78 cards.
- `src/data/tarot.ts` – Data shaping utilities plus deterministic shuffle helpers.
- `src/main.css` – Glassmorphic Art Nouveau theme, responsive layout, and accessibility helpers.

## Design Notes
- Generative art uses seeded randomness so identical card IDs always share visual motifs.
- Spread order flows top-to-bottom: choose a spread, review drawn cards, then read detailed interpretations.
- Share the "Reading code" to reproduce the same card order and orientations on another device.

## Licensing
Card interpretations originate from the public dataset in [dariusk/corpora](https://github.com/dariusk/corpora). Generated illustrations and application code are released under the project owner's preferred terms.