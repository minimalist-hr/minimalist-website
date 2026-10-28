# Add or replace an image

## Rules

- Full colour is fine (approved deviation). No rounded corners, no shadows, **no CSS filters**:
  any treatment goes into the file.
- Photographs as JPEG; screenshots of client work as PNG, so text stays sharp until Astro
  encodes the served sizes.
- Provide a large source (at least 1600px on the long side). Astro crops it to each slot's ratio
  and generates 480, 800, 1200 and 1600px widths.
- Stock photographs must be free-licence. Client screenshots need the client's permission.
- Alt text in both languages, in the brand voice: describe what's in the image, briefly.

## Replace an existing image

Overwrite the file in `src/assets/images/` with the same name. If the subject changes, update
its alt text in `src/lib/images.ts`. Done; every slot using that key picks it up.

## Add a new image

1. Save it as `src/assets/images/<key>.jpg` (or `.png`). Use a descriptive kebab-case key:
   `service-…`, `step-…`, `insight-…`, `work-<client>-…`, `portrait-…`.
2. Register it in `src/lib/images.ts`:

   ```ts
   'insight-diagram': {
     en: 'A system diagram drawn on a whiteboard.',
     hr: 'Dijagram sustava nacrtan na bijeloj ploči.',
   },
   ```

3. Use the key:
   - content frontmatter: `coverImage`, `heroImage`, `gallery[].image`;
   - data modules: `image` in `services.ts` or `steps.ts` (typed `ImageKey`, so typos fail);
   - in a view: `<ImageFrame image="<key>" locale={locale} caption="…" ratio="4/3" />`.

## How `ImageFrame` behaves

| Prop       | Default                          | Notes                                                           |
| :--------- | :------------------------------- | :-------------------------------------------------------------- |
| `image`    | —                                | Registry key. Missing or unknown → striped placeholder          |
| `locale`   | —                                | Required with `image`, to pick the alt text                     |
| `caption`  | —                                | Placeholder caption, e.g. `product shot / core banking console` |
| `ratio`    | `4/3`                            | Reserved aspect ratio, e.g. `4/5`, `16/9`                       |
| `sizes`    | `(min-width: 60rem) 33vw, 100vw` | Set it to the slot's real width                                 |
| `priority` | `false`                          | `true` loads eagerly; use for at most one image above the fold  |

## Errors

- `No image file for "<key>"`: the key is registered but the file is missing or misnamed.
- A content entry with a typo in its key shows the placeholder (content keys aren't typed).
  Check the page after adding.

## Icons, favicon and share image

These aren't in the registry. The masters are in `design/assets/`; `scripts/README.md` explains
how `public/favicon.svg`, the PNG icons and `public/og/default.png` were generated.
`public/favicon.ico` is copied from the master, never regenerated.
