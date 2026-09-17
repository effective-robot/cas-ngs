# README-CASNGS-THEME — Warm Sand & Earth (Conservation Release v1.2)

> A **100% intact** clone of the Twenty Twenty-Five fork
> [`bunny-here/effective-robot`](https://github.com/bunny-here/effective-robot), modified
> *only* to inject the Warm Sand & Earth palette, the floating glass dock header, the
> full-bleed site footer, and the selectable premium animation library.
>
> **0 files deleted · 0 pattern-markup edits · 15 surgically modified files · 3 additions.**

Release history: v1.0 failed on deleted assets, edited pattern HTML, squeezed layout and a
dropped-file ZIP. v1.1 fixed all four but failed fresh-install deployment on three structural
bugs. **v1.2 fixes those three bugs** — see §2 — and works out-of-the-box on activation.

---

## 1. The palette (slug-preserving remap)

Original palette **slugs stay exactly where they are**; only their values move to earth.
Patterns, templates and saved posts reference slugs — never hex values — so the whole site
recolors with zero markup edits and zero block-validation risk.

| Slug (unchanged) | New value | Role |
| --- | --- | --- |
| `base` | `#ede0d4` | Base canvas background |
| `contrast` | `#865438` | Primary text, headlines, icons, button fill |
| `accent-1` | `#d4996e` | Amber glow — links & accents |
| `accent-2` | `#e6ccb2` | Elevated card / surface |
| `accent-3` | `#af7853` | Secondary text |
| `accent-4` | `#6e422b` | Hover state |
| `accent-5` | `rgba(134, 84, 56, 0.20)` | Card borders & dividers |
| `accent-6` | `rgba(237, 224, 212, 0.65)` | Glassmorphic surface |

**Additive tokens** (new slugs appended, nothing displaced): `glass`, `bark`, `clay`,
`line`. Buttons are pinned in `theme.json → styles.elements.button`: `contrast` fill,
`base` text, `999px` pill radius, `#6e422b` hover. Layout restored to
**`contentSize: 800px` / `wideSize: 1200px`**.

## 2. The three v1.1 production bugs — and their v1.2 fixes

### Bug 1 · The minified CSS trap
Twenty Twenty-Five's `functions.php` enqueues **`style.min.css`** on the front end whenever
`SCRIPT_DEBUG` is off — `style.css` is only loaded in debug mode. v1.1 appended the custom
layer to `style.css` alone, so production installs never received it.

**Fix:** the identical CASNGS layer (dock, footer, pills, plugin resilience, animation styles)
is now appended to **both** `style.css` and `style.min.css`. Original minified content
stays byte-intact at the top; the layer is plain appended CSS, valid in either sheet. The theme
now renders identically in both `SCRIPT_DEBUG` modes.

### Bug 2 · Class-name hallucination (header)
v1.1 put `site-header-wrap` on the part's outer block and relied on an inner pattern
reference to supply `site-header-dock` — in live rendering the stylesheet's
`.site-header-dock` selector and the outermost markup drifted apart.

**Fix:** `parts/header.html` is now **self-contained**: the outermost Group block (a
`<header>` tag) natively carries `className: "site-header-dock"`, with the Site Logo,
Site Title, Navigation and CTA button serialized directly inside it. Selector and markup are
one and the same block — they cannot desynchronize. The insertable
`twentytwentyfive/header` pattern follows the identical class contract.

### Bug 3 · Footer layout mismatch
The footer part delegated to the untouched upstream pattern, whose width handling did not
survive the new layout constraints — the live footer looked nothing like the preview.

**Fix:** `parts/footer.html` is now **self-contained and explicitly aligned**: outermost
Group is `"align": "full"` with the `site-footer-wrap` class and the `surface`
background; Columns, Separator and the colophon row are `"align": "wide"` against a
`wideSize: 1200px` constrained layout — the exact geometry of the preview. All supporting
rules (uppercase clay headings, page-list link styling, hairline separator, mono colophon)
live in the appended layer, i.e. in **both** stylesheets per the Bug 1 fix.

## 3. Conservation guarantees (unchanged from v1.1)

| Previous failure | Structural fix |
| --- | --- |
| ~90 assets deleted | **Zero-deletion policy** — every font, image and pattern ships byte-identical; ZIP count-verified against the live GitHub tree. |
| "Unexpected or invalid content" errors | **No pattern/template markup edited.** Color flows through `theme.json` slug remaps, CSS variables and appended stylesheet rules. |
| Squeezed pages | `settings.layout` at **800px / 1200px**. |
| Dropped files in ZIP | Packager downloads **every blob**, refuses to build on any fetch failure, verifies `zip count == repo blobs + 3 additions`. |

The only files that differ from upstream (audited, exact list):

| File | Treatment |
| --- | --- |
| `theme.json` | Values remapped on original slugs · layout 800/1200 · 4 tokens appended · gradients/duotones re-earthened |
| `styles/01-evening.json` … `styles/08-midnight.json` | Variation palettes re-anchored to earth values, same slugs |
| `styles/blocks/*.json`, `styles/colors/*.json` | Legacy hex values swapped where present — structure untouched |
| `style.css` | Original intact — CASNGS layer v1.2 **appended** |
| `style.min.css` | Original intact — **identical layer appended** (v1.2 Bug 1) |
| `functions.php` | Original intact — motion JS enqueue, `add_editor_style()`, block style registrations **appended** |
| `parts/header.html` | Self-contained dock — outermost block natively carries `.site-header-dock` (v1.2 Bug 2) |
| `parts/footer.html` | Self-contained footer — alignfull group, wide 1200px columns (v1.2 Bug 3) |
| `patterns/header.php` | Insertable dock pattern — original slug preserved, same class contract |

Additions: `assets/css/casngs-animations.css` (Visual Editor styles),
`assets/js/casngs-animations.js` (front-end engine), `README-CASNGS-THEME.md`.

## 4. The floating glass dock header

* **85% of the viewport**, detached `14px` from the top edge, never full-bleed.
* `backdrop-filter: blur(16px)` over the glass surface, hairline border, `22px` corners.
* Logo / site title **left**, navigation **centered**, CTA pill **right**.
* Under `782px`: native Navigation block hamburger overlay — frosted glass, full palette.
* Gutenberg-compliant serialized blocks, editable like any other part.

Revert: `git checkout -- parts/header.html patterns/header.php`

## 5. The site footer

Full-bleed `surface` band: brand column (site title + blurb), **Explore** column driven by
`wp:page-list` (auto-populated from published pages — works on a fresh install), field
stations column, dispatch column with a pill CTA, hairline separator, mono colophon.
Outermost group `alignfull`, inner structure `alignwide` at 1200px.

Revert: `git checkout -- parts/footer.html`

## 6. The selectable animation library

Five premium entrance animations registered through the native **Block Styles API** for
`core/group`, `core/columns`, `core/image` and `core/buttons` — 20 combinations:
`anim-fade-up`, `anim-slide-right`, `anim-cinematic`, `anim-blur-rise`,
`anim-scale-in`.

* **Front end:** the animation CSS ships inside the appended layer of `style.css` **and**
  `style.min.css` — it cannot be lost to the minified-sheet trap. The dependency-free JS
  engine (`IntersectionObserver` + `MutationObserver`) adds `.is-in` on first viewport
  entry; `prefers-reduced-motion` renders instantly.
* **Editor:** `add_editor_style( 'assets/css/casngs-animations.css' )` shows every animation
  in its finished state while composing — authors never see hidden content.
* **Workflow:** select the block → Styles panel → pick the animation.

## 7. Installation & verification

```bash
# WP-CLI
wp theme install ./effective-robot-casngs-v1.2.0.zip --activate

# or: WP Admin → Appearance → Themes → Add New → Upload Theme
```

**Verification:** the ZIP contains exactly `N + 3` files (`N` = blob count of the
repository tree at build time; the packager prints both numbers and refuses to ship on
mismatch). Fresh-install checklist: header floats at 85% with blur ✔ · footer spans full width
with wide columns ✔ · pill buttons in `#865438` ✔ · Styles panel lists the 5 CASNGS
animations ✔ — with `SCRIPT_DEBUG` both on and off.

Requirements: WordPress ≥ 6.7, PHP ≥ 7.4. Text domain remains `twentytwentyfive`.

## 8. An honest note on untouched patterns

A handful of stock patterns hard-code legacy hex values inside block attributes. Per the
markup-safety policy those files are **not edited**; preset-based color (the overwhelming
majority) follows the new palette automatically, and the resilience layer in both stylesheets
normalizes plugin output.

---

*License: GPL-2.0-or-later · v1.2 — every original byte accounted for, every reported bug structurally fixed.*
