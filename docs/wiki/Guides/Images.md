# Images

## Rules

- Full colour is fine. No rounded corners, shadows or CSS filters; treatment goes into the file.
- Photographs as JPEG, screenshots as PNG (sharp text). At least 1600px on the long side; Astro
  crops to each slot's ratio and serves 480, 800, 1200 and 1600px widths.
- Stock must be free-licence; client screenshots need the client's permission.
- Alt text in both languages: what's in the image, briefly.

## Add or replace

**Replace:** overwrite the file in `src/assets/images/` with the same name; update the alt text
if the subject changed.

**Add:**

1. Save `src/assets/images/<key>.jpg` (or `.png`), with a kebab-case key: `service-…`,
   `step-…`, `insight-…`, `work-<client>-…`.
2. Register it in `src/lib/images.ts`:

   ```ts
   'insight-diagram': {
     en: 'A system diagram drawn on a whiteboard.',
     hr: 'Dijagram sustava nacrtan na bijeloj ploči.',
   },
   ```

3. Use the key in frontmatter (`coverImage`, `heroImage`, `gallery[].image`), in data modules
   (`image`, typed, so typos fail), or in a view:
   `<ImageFrame image="<key>" locale={locale} caption="…" ratio="4/3" />`.

A registered key without a file fails the build. An unknown key in content frontmatter isn't
typed: it shows the placeholder, so check the page.

`ImageFrame` props: `ratio` (default `4/3`), `sizes` (set it to the slot's real width),
`priority` (eager; at most one image above the fold), `caption` (placeholder text).

## Light-theme versions

A mockup on its own dark background stays dark in the light theme. Save a light version next to
it as `<key>-light.png`: same size and framing, background a warm light grey a little darker than
the light `--paper`. Nothing to register; the alt text is shared. Photographs don't need one.

## Notes on screenshots

Case study hero and gallery images (`AnnotatedImage`) can carry notes, defined in `notes` in
`src/lib/images.ts`:

```ts
'work-lift-mucnjak-forms': [
  {
    box: [11.6, 49.1, 27.3, 36.5], // left, top, width, height
    path: [[38.9, 80], [52, 80]], // from the box edge to where the label starts
    text: { en: 'Fault report, straight to the technician on call', hr: '…' },
  },
],
```

- Numbers are percent of the image; they hold because the slot's ratio is the file's.
- `path` starts on the box edge; every segment is horizontal or vertical; the label continues
  the last segment's direction. `width` caps a label that would run into something.
- Labels sit on the plain background, never over the picture. Two or three per image, a few
  words each. Check both languages at 960px and 1440px.
- Below `md` the lines go, the squares carry numbers and the labels become a list.

## Icons, favicon, share image

Not in the registry. Masters in `design/assets/`; `scripts/README.md` explains how the icons and
`public/og/default.png` were generated. `public/favicon.ico` is copied from the master.
