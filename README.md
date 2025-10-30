# Moving SVG Reel

This repository contains the source for a Remotion project that renders a 1080×1920 short-form reel featuring a morphing SVG blob, kinetic typography, and reusable brand tokens. The main project files live inside the [`moving-svg-reel/`](moving-svg-reel) directory.

## Getting started

```bash
cd moving-svg-reel
npm install
npm run start
```

The `start` script launches the Remotion preview player. To produce a final render use:

```bash
npm run render
```

## SVG pipeline

Two helper scripts keep SVG assets consistent:

- `npm run svg:clean path/to/file.svg` optimizes and validates a single SVG.
- `npm run svg:clean:all` optimizes every SVG stored in `src/assets/svg/`.

Invalid SVG files produce actionable error messages describing the rejected tags or attributes.