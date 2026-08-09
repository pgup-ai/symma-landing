# Symma brand assets

The clasped-S mark, in every form the product needs. One geometry across the
favicon, header, footer and Slack avatar.

**Open `preview.png` first** — it shows every folder's contents on the ground it
belongs on.

## Folders

```text
masters/                flat mark, ground baked in        ← the default choice
masters-gradient/       gradient mark, ground baked in    ← 64 px and above
masters-transparent/    no ground, for surfaces you control
icons/                  rounded tile, ground baked in
icons-transparent/      icon geometry, no ground
app-icon/               Slack avatar and store icons
social/                 og-image
```

`ondark` means the file **has** the `#09090b` ground. `onlight` means it has the
white one. Only `masters-transparent/` and `icons-transparent/` are transparent,
and they are named so.

Use `masters/` and `icons/` anywhere you do not control the background — Slack,
app stores, README embeds, decks, email. Use `masters-transparent/` in the site
and the app, where the mark needs to sit on your own surface colours.

## Colour

| Where                        | Colour                | Contrast          |
| ---------------------------- | --------------------- | ----------------- |
| Dark backgrounds (`#09090b`) | Violet `#9f8bea`      | 6.97 : 1          |
| Light backgrounds (white)    | Violet Ink `#5b4d95`  | 7.14 : 1          |
| Mid surfaces                 | Violet Deep `#7161b6` | 5.14 : 1 on white |

`#9f8bea` measures 2.86 : 1 on white and `#c0b4ee` reaches 1.91 : 1 — both fail
the 3 : 1 graphics minimum. Never use them on a light background.

**Violet Ink `#5b4d95` is not an approved site token.** The approved violet tokens
live in `styles.css` under `:root`; `AGENTS.md` limits the site to that accent
family. The supplied light-surface exports need sign-off before use. Until then,
use Violet Deep `#7161b6` on light backgrounds and omit the `onlight` files.

Note the naming: **Violet Ink** is `#5b4d95`, the light-mode brand violet. **Ink**
alone is `#09090b`, the page background. The near-black monochrome file is
`symma-mark-black.svg`, not `-ink`, so the two cannot be confused.

## Gradient

Two stops, 135°, running along the clasp so one hook hands off to the other.

- On dark: `#7161b6 → #9f8bea`
- On light: `#5b4d95 → #7161b6`

Use at 64 px and above only. Never on the favicon, the 24 px header lockup, or
behind the mark as a glow. The flat violet is the default; the gradient is the
exception.

## Sizes

- Mark alone, on a tile: 16 px minimum
- Mark alone, untiled: 20 px minimum
- Full lockup: 96 px wide minimum
- Gradient variant: 64 px minimum
- Clear space: 25 % of the mark's height on all four sides

Marks in `masters/` sit at 58 % of their square. Icons and app icons sit at 66 %
of a tile with a 24 % corner radius. Transparent masters have a 4 % margin.

## Landing page wiring

`index.html` — head:

```html
<link rel="icon" href="/brand/icons/favicon.svg" type="image/svg+xml" />
<link rel="alternate icon" sizes="32x32" href="/brand/icons/favicon-32.png" />
<link rel="apple-touch-icon" href="/brand/icons/apple-touch-icon-180.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta property="og:image" content="https://symma.dev/brand/social/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Symma" />
```

`styles.css` — replaces the CSS-drawn mark at lines 178–212:

```css
.wordmark-mark {
  width: 24px;
  height: 24px;
  flex: none;
  background: var(--violet);
  -webkit-mask: url('./brand/masters-transparent/symma-mark.svg') center / contain no-repeat;
  mask: url('./brand/masters-transparent/symma-mark.svg') center / contain no-repeat;
}
```

The two `<span>` children of `.wordmark-mark` in `index.html` are no longer
needed — remove them.

Delete the old root `favicon.svg`, and update the `AGENTS.md` line about the
favicon reusing the wordmark geometry. It now does, for the first time.

Applying this closes findings **H3** (no social preview image) and **H4** (two
competing logo treatments) from the landing audit.

## Provenance

These vectors are traced from the supplied PNG, not the designer's master. The
trace is faithful and production-usable, but a 227 px raster cannot carry the
exact bézier control points. Ask the designer for the SVG master, replace the
`d` attribute, and re-export — every file here derives from one path, so it is a
single substitution.
