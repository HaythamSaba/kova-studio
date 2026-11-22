# Kova Studio — UI/UX & Motion Audit

**Scope:** Code-only audit (no source files modified). Verified against the actual repository at the time of writing, plus a local `next build` run. Live site reference: https://kova-studio-hs.vercel.app/

## Stack verification

| Claim | Actual | Source |
|---|---|---|
| Next.js | 16.2.4, **App Router** (`app/`, no `pages/`) | `package.json`, directory listing |
| React | 19.2.4 | `package.json` |
| TypeScript | ^5 | `package.json` |
| Tailwind | v4 (`@tailwindcss/postcss`, CSS-first `@theme` config) | `package.json`, `app/globals.css` |
| GSAP + ScrollTrigger | 3.15.0 | `package.json`, `lib/gsap.ts` |
| Framer Motion | 12.38.0 | `package.json` |
| Lenis | 1.3.23 | `package.json`, `components/providers/LenisProvider.tsx` |
| "Scores near-perfect in Lighthouse" | **Not verified — several findings below actively work against this** (blocking preloader, hidden hero text until scroll, large uncompressed PNGs, no OG image) | See K1, K3, K14 |

**Build result:** `next build` (Turbopack) compiles cleanly. TypeScript passes. All routes are static:

```
○ /            (Static)
○ /_not-found  (Static)
○ /work        (Static)
● /work/[slug] (SSG — terrain, norda, veld, stav)
```

One build-time warning: Next.js misidentifies the workspace root because of an unrelated `package-lock.json` at `C:\Users\Haytham\package-lock.json` (outside this repo). See K17.

---

## Tracker

| ID | Title | Priority | Effort | Status |
|---|---|---|---|---|
| K1 | Hero headline/CTA invisible until ~1,300px of scroll | Critical | M | Open |
| K2 | Fabricated, specific "credibility" claims (awards, funding, metrics) | Critical | S | Decided |
| K3 | Preloader blocks every load, ignores reduced motion | Critical | S | Decided |
| K4 | Primary CTA fails WCAG AA contrast at rest | Critical | S | Open |
| K5 | Content hidden via inline `opacity:0` breaks if JS fails | High | M | Open |
| K6 | Arbitrary 500ms timeout before ScrollTrigger setup | High | M | Open |
| K7 | Case study page only partially respects reduced motion | High | S | Open |
| K8 | Pinned/scrubbed scroll sections run unmodified on mobile | High | M | Decided |
| K9 | No "concept project" disclosure anywhere in the UI | High | S | Decided |
| K10 | Duplicate/conflicting global `cursor:none` rule | Medium | S | Open |
| K11 | No intentional focus-visible styling | Medium | S | Open |
| K12 | GSAP and Framer Motion both implement the same scroll-fade effect | Medium | M | Open |
| K13 | Full-screen curtain transition on every navigation, every time | Medium | S | Open |
| K14 | Unoptimized source images (15MB+ of PNGs) | Medium | S | Open |
| K15 | No Open Graph image | Medium | S | Open |
| K16 | No sitemap/robots | Medium | S | Open |
| K17 | Turbopack workspace-root warning | Low | S | Open |
| K18 | README is unedited `create-next-app` boilerplate | Low | S | Open |
| K19 | Hero pin distance is a fixed px value, not viewport-relative | Low | S | Open |

*Status: Open = no decision yet · Decided = approach agreed, not yet implemented · Done = fixed and verified.*

---

## Critical

### K1 — Hero headline, tagline and CTA are invisible until the visitor scrolls ~1,300px
**Problem:** `components/sections/Hero.tsx:41-57,75-85`. On mount, `gsap.set(".hero-item", { opacity: 0, y: 40 })` hides the eyebrow, H1, tagline and both CTAs. They're only revealed inside the pinned ScrollTrigger timeline (`start: "top top", end: "+=2000", scrub: 1.5`), where the reveal tween is placed at timeline position `0.82` against a timeline whose total duration is `~1.27` (image tween duration `1`, text tween `0.82→1.27`). That means the text starts fading in only at scroll-progress ≈ 0.65 and finishes at 1.0 — i.e., roughly the last 700px of a 2,000px pinned scroll. A visitor who loads the page and doesn't scroll sees only the background photo and a small "Digital Studio / Ljubljana" label — no studio name framing, no headline, no CTA.

**Why it matters:** This is the single biggest risk to the brief's first criterion ("communicate who the studio is and what it does within a few seconds"). Recruiters skim; many will screenshot or judge the landing state before scrolling 1,300px into a pinned section. Right now that first screen is just a stock-feeling photo.

**Solution:** Decouple the headline/tagline/CTA reveal from the image-expansion scrub. Reveal them on mount (or with a very short, time-based Framer Motion entrance, which the file already has available via `fadeUpVariants` for the top-right label) instead of gating them behind scroll position. Keep the image clip/scale scrub as the scroll-driven element; let the text introduce the brand immediately.
```ts
// instead of revealing .hero-item at tl position 0.82,
// animate it independently on mount:
gsap.to(".hero-item", { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, delay: 0.4, ease: "power3.out" });
// keep only the image clip-path/scale tween inside the scroll-scrubbed timeline
```
**Effort:** M

### K2 — Fabricated, specific "credibility" claims with no disclosure that the studio/clients are fictional
**Problem:** `data/projects.ts` states as fact: Norda "won an Honorable Mention on Awwwards within three weeks of launch" (line 56); Terrain's site "launched to 28,000 email subscribers with a 3.4% conversion rate" (line 37); Stav "closed their Series A at €2.4M with participation from two Vienna-based funds" (line 94); Veld's "wholesale accounts tripled... packaging now sits in 14 independent cafés" (line 75). `components/ui/Footer.tsx:81-82` separately claims "Awwwards Nominee" and "CSS Design Awards" for Kova Studio itself. None of this is flagged anywhere as illustrative/fictional — not in the footer, not in About, not in metadata, not in the README.

**Why it matters:** This is the brief's own honesty criterion (#9). These read as specific, checkable facts (a named award, a funding round size, named investor cities, a conversion-rate percentage). A recruiter who spot-checks "Norda Awwwards Honorable Mention" and finds nothing won't read it as creative flavor — they'll read it as embellishment, which colors their trust in the rest of the portfolio, including the real work.

**Solution:** Two independent fixes, both worth doing:
1. Soften the copy itself — replace specific checkable numbers/claims ("Honorable Mention on Awwwards", "€2.4M Series A", "28,000 subscribers / 3.4%") with qualitative, unverifiable-by-design language ("the launch became the firm's primary source of inbound inquiries", "the identity carried the brand through its first wholesale wave").
2. Add one small, tasteful disclosure — e.g. in the footer or an About line: *"Kova Studio and its client work are a fictional concept project — part of [name]'s portfolio."* This doesn't need to break the fiction loudly; one line in the footer (where "Awwwards Nominee" currently sits) is enough.

**Effort:** S

**Decision (2026-11-22):** Do both. Rewrite every specific, checkable claim in `data/projects.ts` — the Awwwards mention, the €2.4M funding figure, the 28,000-subscriber/3.4%-conversion numbers, the café count — as qualitative outcomes with nothing a recruiter could fact-check and fail to find. The disclosure itself lives in the footer per K9, not duplicated here.

**Decision (2026-11-22, follow-up):** No link to a real Awwwards submission — nothing in this project has actually been submitted to any award site, and all studio/client/outcome data is fictional. Scope expanded accordingly: remove every award or recognition reference anywhere in the codebase, not just the numeric claims. A full search turned up exactly two locations: `data/projects.ts:56` (Norda's "won an Honorable Mention on Awwwards within three weeks of launch") and `components/ui/Footer.tsx:81-82` ("Awwwards Nominee" / "CSS Design Awards"). Both are removed outright, not softened or reworded into a vaguer award-shaped claim.

### K3 — Preloader blocks every page load and ignores `prefers-reduced-motion`
**Problem:** `components/ui/Preloader.tsx`. Renders unconditionally in `app/page.tsx:15` on every full load of `/` (including a recruiter hitting back/forward or refreshing). The counter runs 0→100 with variable per-tick delays (`Math.max(20, 80 - progress*80)`, settling at 60ms near the end) plus a 300ms initial pause and a 600ms hold at 100 before the exit wipe — roughly 2–3+ seconds minimum before the real page is visible. There is no `prefersReducedMotion()` check anywhere in the component, unlike every other animated component in the codebase.

**Why it matters:** This directly undercuts the "near-perfect Lighthouse" claim — the dominant above-the-fold content (and the real LCP element) is hidden behind an opaque overlay for seconds on every visit, with no "seen it once" memory. For a recruiter clicking between the homepage and case studies and back, it's also simply annoying the second and third time.

**Solution:**
- Gate on `prefersReducedMotion()` like every other component here does — skip straight to `setVisible(false)`.
- Show it once per session: check `sessionStorage.getItem("kova-intro-seen")` before mounting, and set it on dismiss.
- Shorten the curve — a few hundred ms is enough to feel intentional without costing real seconds of every visit.
**Effort:** S

**Decision (2026-11-22):** Keep the Preloader, but: gate it on `sessionStorage` so it only shows once per session; shorten the total duration (initial pause + count + hold) to roughly 1 second; and skip it entirely when `prefersReducedMotion()` is true, rather than just softening it.

### K4 — Primary CTA fails WCAG AA contrast at rest
**Problem:** `components/sections/Hero.tsx:171` — `"Start a project"` uses `bg-accent text-white hover:text-bg`. Accent is `#c17f3e` (`app/globals.css:10`); white text on that background measures **≈3.3:1**, below the 4.5:1 AA threshold for normal-size text (this is 14px/`text-sm`, not large text, so the 3:1 large-text exception doesn't apply). The fix only applies `text-bg` on `:hover`, so the default/resting state — and the focused state for keyboard users, since `:hover` doesn't trigger on focus — is the failing one.

**Why it matters:** This is a real, measurable accessibility regression on the site's single most important conversion element, visible to any automated contrast checker (axe, Lighthouse a11y audit) a technically-minded reviewer might run.

**Solution:** Swap the default state to the passing combination and keep (or drop) the hover effect as a secondary treatment:
```tsx
className="... bg-accent text-bg hover:text-white transition-colors duration-300"
```
`text-bg` on `bg-accent` measures ≈5.9:1 — comfortably passes AA.
**Effort:** S

---

## High

### K5 — Content hidden via inline `opacity:0` breaks permanently if JS fails or is slow
**Problem:** Several components set `opacity: 0` (and in one case `clipPath`) as a literal inline `style` in the server-rendered JSX, relying on a client-side GSAP effect to restore visibility later: `components/ui/SectionHeader.tsx:51`, `components/ui/SectionTitle.tsx:73`, `components/sections/About.tsx:145` (paragraphs) and `:156` (tags row), `components/sections/Capabilities.tsx:135` (`clipPath: "inset(0 0 100% 0)"` + `opacity:0`). This is different from `Hero.tsx`, where the hidden state is applied by `gsap.set()` at runtime (so a no-JS visitor still sees the text) — here the HTML itself ships invisible.

**Why it matters:** If JavaScript errors out before these effects run, is blocked, or is simply slow on a bad connection, the About headline, all three About paragraphs, the credential tags, and every Capabilities tile are permanently invisible — not delayed, gone. That's section headers, body copy, and a full services section on the homepage.

**Solution:** Don't ship the hidden state in server HTML. Either apply the hidden state via `gsap.set()` inside the effect (matching the `Hero.tsx` pattern) or default to visible and only animate a secondary property (e.g., `y`) that degrades gracefully. Minimal fix per component:
```tsx
// instead of: style={{ opacity: 0 }} in JSX
// set it inside the effect, right before building the tween:
gsap.set(headerRef.current, { opacity: 0 });
```
**Effort:** M (same fix repeated across 4 files)

### K6 — Arbitrary 500ms timeout substitutes for a real "layout is ready" signal
**Problem:** `components/sections/About.tsx:33`, `components/sections/Capabilities.tsx:51`, `components/sections/Contact.tsx:47`, `components/ui/SectionTitle.tsx:33` all wrap their `gsap.context`/ScrollTrigger setup in `setTimeout(fn, 500)`, with a comment explaining it's waiting for "the full page height to be known" before ScrollTrigger measures trigger positions. Meanwhile `Hero.tsx` and `HorizontalScroll.tsx` set up ScrollTrigger immediately, with no such wait.

**Why it matters:** 500ms is a guess, not a guarantee. All three custom fonts use `display: "swap"` (`app/layout.tsx:22,31,39`), which causes a layout shift when the real font swaps in — on a slow connection that can land after 500ms, after which all the ScrollTrigger start/end positions measured during setup are already stale. The result is animations that fire at the wrong scroll position intermittently, and it's inconsistent (two components don't wait at all, four do).

**Why it matters (2):** Flaky, hard-to-reproduce "the About section animates a bit early/late" bugs are exactly the kind of motion-craft issue the brief flags as something an experienced reviewer would notice.

**Solution:** Replace the timer with a deterministic signal — call `ScrollTrigger.refresh()` from a `window.addEventListener("load", ...)` handler (covers fonts + images), or use `document.fonts.ready.then(...)` before the first `ScrollTrigger.create`. For image-adjacent sections, prefer `next/image`'s `onLoad` to trigger a refresh.
**Effort:** M

### K7 — Case study pages only partially respect `prefers-reduced-motion`
**Problem:** `components/sections/CaseStudy.tsx:28-105`. Inside one `gsap.context`, three separate animations are set up: (1) the meta-row `.detail-item` stagger (lines 30-48) — **no reduced-motion check**; (2) the image-grid pin + clip-path reveal (lines 50-78) — correctly gated by `if (!prefersReducedMotion() && imageGridRef.current)`; (3) the footer-nav image's clip-path/scale scrub (lines 80-99) — **no reduced-motion check**.

**Why it matters:** A visitor with reduced motion enabled still gets the pinned-section skip, but still gets the staggered meta-row entrance and the scale-to-1.5/clip-path-expand scrub on the footer image — on every one of the four case study pages. Partial compliance on a page the brief specifically calls out for review is an easy miss to catch.

**Solution:** Wrap all three blocks behind the same single `prefersReducedMotion()` check at the top of the effect (as `HorizontalScroll.tsx` and `Marquee.tsx` already do), rather than checking it per-block.
**Effort:** S

### K8 — Three pinned/scrubbed scroll-hijack sections run unmodified on mobile
**Problem:** `Hero.tsx` (pin, `end: "+=2000"`), `HorizontalScroll.tsx` (pin for the full card-scroller width), and `CaseStudy.tsx`'s image-grid (pin, `end: "+=900"`) all create `ScrollTrigger` pins unconditionally — none check viewport width or `matchMedia`. These stack with Lenis smooth scrolling underneath. Combining `position: fixed`-style pinning, scrub, and a smooth-scroll library on mobile Safari is a well-documented source of rubber-banding, pin flicker, and scroll-jank (GSAP's own docs flag pinning + iOS momentum scroll as fragile).

**Why it matters:** The brief explicitly asks whether scroll-driven effects should be simplified on mobile. Right now they're identical on a phone and a desktop: a 2,000px pinned hero and a pinned horizontal card scroller, on every device, with no fallback.

**Solution:** Gate all three pins behind a `matchMedia("(min-width: 768px)")` (or similar) check, falling back to simple scroll-into-view fades on small viewports — consistent with how `prefersReducedMotion()` is already checked per-component, just add a viewport check alongside it.
**Effort:** M

**Decision (2026-11-22):** Disable all pinning and scrubbing below 768px; fall back to simple fade-ins at that breakpoint. Implement with `gsap.matchMedia()` (rather than a one-shot `window.innerWidth` check) so the pinned/scrubbed timelines are scoped to the ≥768px condition and cleanly revert if the breakpoint is crossed live (device rotation, resizing a browser window).

### K9 — No "this is a concept project" disclosure anywhere
**Problem:** Checked `app/layout.tsx` metadata, `components/ui/Footer.tsx`, `components/sections/About.tsx`, `components/sections/Contact.tsx`, and `README.md` — none mention that Kova Studio or its four clients are fictional.

**Why it matters:** Independent of K2's specific fabricated numbers, there's no safety net anywhere telling a recruiter "this is a demonstration, not a real agency." Related to K2 but worth tracking separately since fixing K2's copy doesn't by itself add this disclosure.

**Solution:** One line, placed where it won't interrupt the experience — e.g. in the footer's "Recognition" column (which currently holds the fabricated awards) or as a closing line in About: *"A fictional studio built to demonstrate [name]'s frontend/motion work."*
**Effort:** S

**Decision (2026-11-22):** Replace the footer's entire "Recognition" column (`components/ui/Footer.tsx:77-83`, currently "Awwwards Nominee" / "CSS Design Awards") with a single disclosure line: *"Kova Studio is a concept project by Haytham Saba. Studio, clients and outcomes are fictional."* Both "Awwwards Nominee" and "CSS Design Awards" are removed outright, not softened.

**Decision (2026-11-22, follow-up):** No link to a real Awwwards submission — confirmed nothing in this project has been submitted anywhere. The disclosure line stands alone, with no link of any kind. This also settles K2's scope: every award/recognition reference site-wide (the footer pair above, plus Norda's Awwwards line in `data/projects.ts:56`) is removed, not reworded into softer award-adjacent language.

---

## Medium

### K10 — Duplicate, conflicting global `cursor: none` rule
**Problem:** `app/globals.css`. Lines 41-45 correctly scope `* { cursor: none !important; }` inside `@media (pointer: fine) and (hover: hover)` within `@layer base` — the stated intent (per the adjacent comment) is to hide the native cursor only for real mice, not touch/stylus. But lines 66-68 repeat the identical rule **unscoped, outside the `@layer`**, which wins and applies to every device regardless of pointer type — making the guard on lines 41-45 dead code.

**Why it matters:** Functionally this mostly matters for hybrid devices (styluses, some tablets) where `pointer:fine`/`hover:hover` don't match but a visible system cursor is still expected; it's also just a code-quality smell — two rules doing the same thing, one of them unreachable.

**Solution:** Delete the unscoped block at the bottom (lines 66-68); the guarded rule at 41-45 already expresses the intended behavior.
**Effort:** S

### K11 — No intentional focus-visible styling
**Problem:** No `focus:`, `focus-visible:`, or `outline` rule exists anywhere in the codebase (checked all `.tsx`/`.css`). Every link, button, and the mobile hamburger relies entirely on the browser's default focus ring.

**Why it matters:** Not a hard WCAG failure (default UA focus rings still render), but on a site that replaces the native cursor with a custom one and leans heavily on a specific dark/amber palette, an unstyled default blue ring looks out of place and its visibility against `--color-bg: #0e0c0a` isn't verified across browsers. Given how much care went into the mobile menu's focus trap (`Navbar.tsx:64-103`), the resting focus style is a visible gap in otherwise solid keyboard-nav work.

**Solution:** Add one `:focus-visible` rule in `globals.css` using the accent color:
```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
```
**Effort:** S

### K12 — GSAP and Framer Motion both implement the same "fade up on scroll into view" effect
**Problem:** The "fade/slide up when scrolled into view" pattern is implemented twice, in two different libraries, in different files: via `gsap.fromTo(...)` + `ScrollTrigger` in `About.tsx`, `Capabilities.tsx`, `Contact.tsx`, `SectionTitle.tsx`, `SectionHeader.tsx`; and via Framer Motion's `whileInView`/`animate` props in `CaseStudy.tsx`'s tagline block (lines 119-129) and `AllWorkHero.tsx`'s intro paragraph/CTA (lines 31-38, 64-84).

**Why it matters:** This isn't GSAP-for-scrub / Framer-for-UI-transitions (a defensible split, and mostly what's happening elsewhere) — it's the exact same conceptual effect solved twice, which is real duplication: two mental models for the same thing, and both libraries' cost paid on pages that only need one.

**Solution:** Pick one for simple viewport-triggered entrances — Framer's `whileInView` is the lighter-weight, more idiomatic choice for anything that doesn't need scroll-scrubbing — and reserve GSAP/ScrollTrigger for the pinned/scrubbed timelines (Hero, HorizontalScroll, CaseStudy image grid) where Framer has no equivalent primitive.
**Effort:** M

### K13 — Full-screen curtain transition fires on every navigation with no reduced-motion gate
**Problem:** `components/sections/PageTransition.tsx` wraps every route change in a `0.5s`/`0.4s` full-screen curtain wipe plus a `0.3s` content fade (with a `0.1s` delay stacked on top), on every single internal navigation. Unlike every GSAP component in the codebase, this file never calls `prefersReducedMotion()` directly — it relies solely on the root `MotionConfig reducedMotion="user"` in `app/layout.tsx:87` to soften it automatically.

**Why it matters:** This is likely fine in practice (Framer Motion's `MotionConfig` does suppress most motion for `prefers-reduced-motion` users), but it's the one motion-heavy component in the app that doesn't follow the codebase's otherwise-consistent explicit pattern, and it's unverified here that the curtain's `scaleY` transform is included in what `MotionConfig` suppresses. Worth confirming directly rather than relying on an implicit framework default for a wipe that runs dozens of times per session.
**Effort:** S

### K14 — Unoptimized source images
**Problem:** `public/images/projects/` totals ~15MB across 8 PNGs (~1.5–2.0MB each); `public/images/bg.png` (the hero background) is 1.6MB. All are PNG — a lossy-but-visually-fine JPEG/AVIF source would cut these dramatically before `next/image` even gets to resize/reformat them at request time.

**Why it matters:** `next/image` will serve resized, modern-format output to browsers, so this isn't a direct Core Web Vitals hit the way it would be with plain `<img>` tags — but it does mean larger build artifacts, slower image-optimization at build/edge time, and no safety margin if any image is ever rendered near its native size.

**Solution:** Re-export source images as high-quality JPEG or WebP before committing; no code change needed, `next/image` usage is already correct throughout (`fill`, `sizes`, `priority` on above-the-fold images).
**Effort:** S

### K15 — No Open Graph image
**Problem:** `app/layout.tsx:58-69` defines `openGraph.title`/`description` and a `twitter` card, but no `openGraph.images` and no `app/opengraph-image.tsx`/static OG image.

**Why it matters:** Criterion #10 explicitly asks about sharing — a link shared to a recruiter over Slack/LinkedIn/email currently renders as plain text with no preview image, which undersells a visually-driven portfolio piece exactly where a good preview image would help most.

**Solution:** Add a static `app/opengraph-image.png` (1200×630) or a generated `opengraph-image.tsx` using `next/og`, then reference it in `metadata.openGraph.images`.
**Effort:** S

### K16 — No sitemap or robots file
**Problem:** No `app/sitemap.ts`, `app/robots.ts`, or static equivalents in `public/`.

**Why it matters:** Minor for a four-project portfolio site, but it's a basic Next.js fundamental the brief asks about, and it's a two-file, ten-minute addition.

**Solution:**
```ts
// app/sitemap.ts
import { projects } from "@/data/projects";
export default function sitemap() {
  return [
    { url: "https://kova-studio-hs.vercel.app/" },
    { url: "https://kova-studio-hs.vercel.app/work" },
    ...projects.map((p) => ({ url: `https://kova-studio-hs.vercel.app/work/${p.slug}` })),
  ];
}
```
**Effort:** S

---

## Low

### K17 — Turbopack workspace-root warning on every build
**Problem:** `next build` prints: *"We detected multiple lockfiles and selected the directory of `C:\Users\Haytham\package-lock.json` as the root directory."* That file belongs to an unrelated project in the parent user directory, not this repo.

**Why it matters:** Harmless today since Next.js still resolved the correct directory, but ambiguous root inference is the kind of thing that breaks silently in CI or on a teammate's machine with a different home-directory layout.

**Solution:** Set it explicitly in `next.config.ts`:
```ts
const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
};
```
**Effort:** S

### K18 — README is unedited `create-next-app` boilerplate
**Problem:** `README.md` still references `Geist` (a font this project doesn't use — it uses Cormorant Garamond/DM Sans/DM Mono) and generic "Learn Next.js" links, with nothing about what Kova Studio actually is.

**Why it matters:** Low cost, disproportionate visibility — a recruiter who clicks through from the portfolio to the GitHub repo (a very likely path for exactly this audience) sees unedited scaffolding on the very first thing that loads.

**Solution:** Replace with a short project description, stack list, and a link to the live site.
**Effort:** S

### K19 — Hero's pinned scroll distance is a fixed pixel value
**Problem:** `components/sections/Hero.tsx:51` — `end: "+=2000"` is a fixed 2,000px regardless of viewport height.

**Why it matters:** On a short, wide viewport (e.g., a laptop in a browser window that isn't maximized) 2,000px of scroll to clear the hero feels disproportionately long relative to the viewport; on a tall phone in portrait it feels shorter relative to content seen per scroll-px. Not broken, just not viewport-aware.

**Solution:** Derive the distance from viewport height, e.g. `end: () => "+=" + window.innerHeight * 2.5`, recalculated via `invalidateOnRefresh` (already set).
**Effort:** S

---

## What's already working (don't touch)

- **`SplitText` accessibility** (`components/ui/SplitText.tsx`) — the per-character animation wrapper carries `aria-label={text}` on the outer `motion.span`, with every decorative inner span marked `aria-hidden="true"`. This is exactly the right pattern for character-split text and is easy to get wrong; it's done correctly here.
- **`LenisProvider` lifecycle** (`components/providers/LenisProvider.tsx`) — checks `prefersReducedMotion()` before initializing, wires `gsap.ticker` to Lenis's `raf` correctly, disables GSAP's own lag smoothing to avoid double-smoothing, and fully tears down (`gsap.ticker.remove` + `lenis.destroy()`) on unmount.
- **`Marquee` cleanup** (`components/ui/Marquee.tsx`) — respects reduced motion, kills in-flight `timeScale` tweens with `gsap.killTweensOf` before killing the main tween, removes every listener on cleanup, and the scroll-velocity speed-boost is a genuinely nice touch rather than a gimmick.
- **`Navbar` mobile menu a11y** (`components/ui/Navbar.tsx:64-103`) — real focus trap (Tab/Shift+Tab cycling within the menu), Escape-to-close, and focus restored to the hamburger button on every close path, not just Escape. `aria-expanded`/`aria-controls`/`aria-modal` are all wired correctly. This is better than most marketing-site navbars.
- **Routing & rendering** — every route is static or SSG (`generateStaticParams` used correctly for the four case studies), `generateMetadata` is async and correctly awaits the Next 16 `params` Promise, and the TypeScript build is clean.
- **Framer Motion's global reduced-motion coverage** — `MotionConfig reducedMotion="user"` at the root (`app/layout.tsx:87`) gives every `motion.*` component sitewide reduced-motion handling without per-component boilerplate, which is why the GSAP side (which has no such global switch) needed the manual checks flagged in K7.
- **Toast feedback** (`components/sections/Contact.tsx:205-227`) — the "copied to clipboard" toast correctly uses `role="status" aria-live="polite"`, with a clipboard-API failure fallback to `mailto:`.
- **Case study structure** — each of the four projects genuinely reads as brief → identity rationale → tagline → visual grid (with brief/outcome copy surfaced on hover) → outcome → prev/next navigation, not just an image gallery. The narrative shape the brief asks about is there; the only problem is the specific fabricated numbers used to sell the outcome (K2), not the structure itself.

---

## Top 3 changes for portfolio-review impact

1. **Fix K1 (Hero text reveal).** The first screen a recruiter sees is currently just a photo. Decoupling the headline/CTA from the scroll-gated reveal is the single highest-leverage fix here.
2. **Fix K2/K9 (fabricated claims, no disclosure).** A recruiter who notices or fact-checks a specific, false "Awwwards Honorable Mention" or "€2.4M Series A" won't read it as creative flavor — it's a credibility risk for the whole piece, including the real engineering underneath it.
3. **Fix K3 (Preloader).** It's the first 2–3 seconds of every single visit and directly undercuts the performance story this project is meant to demonstrate.

## Decisions (recorded 2026-11-22)

No fixes have been implemented yet — these are agreed approaches, captured inline under K2/K3/K8/K9 above, for whenever each item is picked up:

- **K2/K9:** Both. Rewrite every specific, checkable claim in `data/projects.ts` (awards, funding amounts, subscriber counts, conversion rates, café counts) as qualitative outcomes. Replace the footer's "Recognition" column with one disclosure line: *"Kova Studio is a concept project by Haytham Saba. Studio, clients and outcomes are fictional."* Remove every award/recognition reference outright — "Awwwards Nominee" and "CSS Design Awards" in `components/ui/Footer.tsx:81-82`, and the "Honorable Mention on Awwwards" line in `data/projects.ts:56` — with no link to a real submission, since nothing in this project has actually been submitted anywhere.
- **K3:** Keep the Preloader. Show it once per session via `sessionStorage`, shorten it to ~1 second total, and skip it entirely for `prefers-reduced-motion` users.
- **K8:** Disable all pinning/scrubbing below 768px, falling back to simple fade-ins, implemented with `gsap.matchMedia()` so the behavior reverts cleanly across the breakpoint.

All three decision points are now fully resolved; nothing is pending.
