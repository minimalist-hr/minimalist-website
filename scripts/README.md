# scripts

`lighthouse.mjs` runs the Lighthouse audit (`pnpm run test:lighthouse`, see lighthouserc.cjs).

The rest are manual asset scripts. They are not part of `pnpm run build`; run them only when
the master artwork in `design/assets/` changes, then commit the regenerated files.

## outline-svg-text.py

The master SVGs use live Archivo type, so they render in the wrong font for anyone without
Archivo installed. This converts their `<text>` to outlined `<path>`.

```bash
pip install fonttools
curl -sSLo Archivo.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf"
python scripts/outline-svg-text.py Archivo.ttf design/assets/minimalist-mark-ink.svg public/favicon.svg
```

## Icon and share image PNGs

`public/apple-touch-icon.png` (180), `public/icon-192.png`, `public/icon-512.png` and
`public/og/default.png` (1200×630, mark centred at 220px on `--paper` dark `#111110`) were
rendered from `public/favicon.svg` with headless Chromium at those exact pixel sizes.
Any renderer works; the source of truth is the outlined SVG.

`public/favicon.ico` is the master file from `design/assets/` (M alone at 16/32, full mark
from 48 up) and is copied, never regenerated.
