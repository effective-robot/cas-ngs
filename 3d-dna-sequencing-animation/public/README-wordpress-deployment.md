# casNGS · "From Sample to Code" — WordPress Deployment README

Two self-contained deployment packages (no shared runtime, no theme toggles):

| Package | File | Brand |
|---|---|---|
| **1 · Signature Bronze & Warm Earth** (default) | `index.html` (site root) | Ivory studio, bronze CTAs, gold/amber accents |
| **2 · Steel Blue Academic** | `casngs-intro-steel-blue-academic.html` | Ice blue, oxford/steel geometry, navy CTAs |

Each file = fonts + CSS + semantic HTML (4 figure cards + HUD) + Three.js/GLB pipeline + GSAP Observer engine. All IDs/classes are namespaced `csi-*` to avoid theme collisions.

---

## 1 · How to deploy in WordPress

### Option A — Custom page template (recommended)
1. In your theme (child theme advised), create `wp-content/themes/your-theme/page-intro.php`.
2. Paste the **entire contents** of the chosen package file into it. Optionally add `<?php /* Template Name: casNGS Intro */ ?>` as the very first line.
3. WP Admin → Pages → Add New → **Page Attributes → Template: casNGS Intro** → Publish. Set this page as your front page (Settings → Reading) if the intro is the homepage.
4. Add your normal page content (Gutenberg blocks) **below the `WORDPRESS CONTENT SEAM` comment** — or, if using a full template, hook it in with `<?php the_content(); ?>` directly under that comment.

### Option B — Gutenberg Custom HTML block
1. Edit the page → add a **Custom HTML** block at the very top.
2. Paste everything **between `<body>` and `</body>`**, plus the three `<link>` font tags and the page `<title>` can be ignored. That is: the `<style>…</style>` block, the markup, the CDN `<script>` tags and the inline `<script>`.
3. Place all remaining page blocks **after** the Custom HTML block.
4. Note: some security plugins (Wordfence strict mode, WPCode sanitizers) strip `<script>` from blocks — if the block gets cleaned, use Option A or a plugin like **Insert Headers and Footers** / **WPCode** to inject the scripts.

### Option C — Elementor HTML widget
1. Create the page with the **Elementor Canvas** template (no theme header/footer — the intro expects to own the viewport).
2. Add an **HTML widget** as the first element and paste the same payload as Option B.
3. Build the rest of the page below it; the Section 4 exit hands scroll off to your Elementor sections automatically.

> **Template tip:** the intro works best on header-less templates (Elementor Canvas, GeneratePress "no header", a custom `page-landing.php`). If your theme header must stay, the intro's z-indexes (stage 9990, HUD 9992, loader 9999) keep it above typical theme chrome — but a sticky theme menu above z 9990 will overlap.

---

## 2 · Hosting the 3D GLB model

1. Rename your model `dna.glb` (lowercase, no spaces).
2. WP Admin → Media → Add New → upload `dna.glb`.
   - **If WordPress rejects `.glb`:** add the MIME type via a code-snippets plugin or `functions.php`:
     ```php
     add_filter('upload_mimes', function ($mimes) {
         $mimes['glb']  = 'model/gltf-binary';
         $mimes['gltf'] = 'model/gltf+json';
         return $mimes;
     });
     ```
3. Copy the file URL from the Media Library (e.g. `https://casngs.com/wp-content/uploads/2026/01/dna.glb`).
4. In the package file, find the top of the `<script>` block and replace:
   ```js
   const DNA_MODEL_URL = 'https://your-site.com/wp-content/uploads/…/dna.glb';
   ```
5. The loader holds Frame 1 until the model is ready. If the URL 404s, is CORS-blocked, or takes >5 s, a brand-tinted procedural helix (identical scale/position/lighting) loads instead — the page never breaks.
6. Recommended: serve the GLB through a CDN / caching plugin and keep it under ~2 MB for instant first paint.

---

## 3 · Customizing content & styles

### Text, tickers, CTAs — plain HTML
- Card headers/copy/data rows: edit the four `<section class="csi-card">` blocks directly (`<h2 class="csi-title">`, `<p class="csi-copy">`, `<dl class="csi-data">`).
- CTA labels & destinations: the two `<a class="csi-btn …" href="#…">` elements — point `href` at any WP URL or page anchor. Clicking a CTA during the intro exits gracefully, then scrolls to the target.
- Ticker: populated by the readout engine; the static prefixes live in `tick()` inside the script.

### Design tokens — top of the `<style>` block
| Variable | Controls |
|---|---|
| `--font-display` | Serif used for card titles & wordmark |
| `--font-body` | Body copy font (point at your theme font to drop the Google Font) |
| `--font-mono` | Data rows, ticker, buttons, dots |
| `--canvas-bg` | Page **and** WebGL clear color (single-sourced — the script reads it) |
| `--card-bg` / `--card-border` | Frosted card fill & border (change `blur(10px)` in `.csi-card` to adjust the frost) |
| `--btn-bg` / `--btn-hover` / `--btn-text` | CTA fill, hover fill (with elevation lift), label color |
| `--text` / `--text-muted` / `--text-faint` | Type contrast ladder |
| `--accent`, `--accent-2…4` | Dots, ticker, cue and per-card accent edges |

### 3D material colors
Edit the `THEME = { … }` block at the top of the inline `<script>` (bg, DNA backbone, ribbons, stream, heatmap ramp, rings, lights).

---

## 4 · Mobile behavior & performance

- **Touch:** swipe up/down flicks navigate sections via the same GSAP Observer (no scroll-jacking bugs on iOS — `touch-action` is managed by the `csi-locked` state). Swipe up on Section 4 exits into your WordPress content; pull down at the very top re-engages Frame 4.
- **Cursor trail:** the A·T·C·G emitter is pointer-driven and capped at 40 pooled particles; set `var FX_ENABLED = false;` at the top of the script to disable it entirely.
- **Frame rate:** devicePixelRatio capped at 1.75 (WebGL) / 2 (trail canvas); all geometry is procedural/instanced; the render loop pauses when the tab is hidden **and** after the Section 4 exit, so the intro costs zero GPU once visitors are reading your content.
- **Accessibility:** `prefers-reduced-motion` shortens glides and disables sway/trail; dots carry ARIA labels; cards are semantic `<section>/<h2>/<dl>`.
- **Z-index map:** stage `9990` · HUD/rail/ticker `9992` · loader `9999` — all below the WP admin bar (`99999`).
