# Google AdSense Readiness Audit — premium-ai-directory

Generated: 2026-07-18

This document is a complete audit of the repository for Google AdSense readiness. It inspects SEO, technical SEO, legal pages, navigation, AdSense-specific readiness, accessibility, performance, security, and all advertisement placeholders found in the codebase. No code was modified.

---

## Summary Findings (high level)
- Site has good base metadata (`app/layout.tsx`) with title, description, Open Graph and Twitter card entries.
- `sitemap` is implemented via `app/sitemap.ts` (Next metadata route) — good.
- `robots.txt`, `favicon`, and `manifest.json` are missing from `public/` — add before/at launch.
- Legal pages: `Privacy` and `Terms` exist. `About`, `Contact`, and a dedicated `Cookie Policy` are missing.
- Ad placeholders are present via `components/AdBanner.tsx` and used in multiple pages (home, tools listing, single tool pages, submit page). Good placement strategy, but needs AdSense integration details (script insertion, CSP updates, responsive ad units).
- Duplicate-access risk: each tool is reachable by id and name-slug — canonical links are missing and can cause duplicate-content issues.
- Accessibility: most forms use visible labels; some small areas (footer subscription input) lack a label element.
- Security: `next.config.ts` configures security headers for production — it currently allows `'unsafe-inline'` and `'unsafe-eval'` for scripts (relatively permissive). When integrating AdSense, update CSP to include Google ad domains.

---

## 1) SEO

- Title tags
  - Found global metadata in `app/layout.tsx` with site title and keywords. Good global default.
  - Page-level titles are set for tool pages (`app/tool/[slug]/page.tsx`, `app/tools/[id]/page.tsx`), blog posts (`app/blog/[slug]/page.tsx`) and other pages. Recommendation: ensure each page uses a unique descriptive title (already handled for tools and posts).

- Meta description
  - Present at global level and for several pages (tools, blog, privacy, terms, submit page). Good coverage.
  - Recommendation: ensure tool pages' descriptions are not duplicated across many entries. Pull unique text (first 150–160 chars) for SERP quality.

- Canonical URLs
  - No explicit canonical tags found in the codebase. (Next `metadata` supports `alternates`/`metadata.canonical` but it is not used.)
  - Risk: duplicate content for the same tool accessible by both id and slug (/tool/{id} and /tool/{slug}).
  - Recommendation: add canonical tags for tool pages (choose one canonical URL pattern, e.g., `/tool/{id}` or `/tool/{slug}`) inside page metadata.

- Open Graph
  - `openGraph` entries exist in `app/layout.tsx` and for tool pages/blog posts. However, OG image is not present — sharing cards will fall back to defaults.
  - Recommendation: add `openGraph.images` per-page or a site default image in `metadata` to improve social sharing.

- Twitter cards
  - Twitter card metadata exists in `app/layout.tsx` (`card: summary_large_image`) but no explicit image. Add `twitter.image` or `openGraph.images`.

- Structured data
  - No JSON-LD structured data (Organization, Website, Article) found.
  - Recommendation: add Organization structured data and Article schema for blog posts and tool pages where helpful.

- robots meta
  - `robots` metadata is present in `app/layout.tsx` and many pages set `index: true, follow: true`. Good.

---

## 2) Technical SEO

- `robots.txt`
  - No `public/robots.txt` found. Add one to instruct crawlers and point to sitemap.
    - Example minimal content:
      ```txt
      User-agent: *
      Allow: /
      Sitemap: https://your-domain.com/sitemap.xml
      ```

- `sitemap.xml`
  - `app/sitemap.ts` exists and generates a sitemap route using `NEXT_PUBLIC_SITE_URL` (or `SITE_URL`). On Vercel, ensure `NEXT_PUBLIC_SITE_URL` is set to the live domain.

- favicon
  - No `public/favicon.ico` (or alternative) found in `public/`. Add favicon files and link them via metadata or `public/` defaults.

- manifest.json
  - No `public/manifest.json`. If you want PWA or better mobile support, add a manifest and icons.

- Indexing
  - Pages are allowed to be indexed by metadata. Ensure private/internal admin routes are properly protected and disallowed if public.

- Page loading
  - No heavy images found in code; no `next/image` usage. Next automatically code-splits pages; performance should be reasonable.
  - Recommendation: add `og:image` optimized sizes, and consider using `next/image` for any large images.

---

## 3) Legal Pages

- Found files:
  - `app/privacy/page.tsx` — Privacy Policy: present and contains cookies & tracking section.
  - `app/terms/page.tsx` — Terms of Service: present and includes Affiliate disclosure and a Disclaimer subsection.

- Missing or recommended:
  - `About` page — footer links to `About` but that link currently points to `/` (home). Consider creating a dedicated About page.
  - `Contact` page — not present. Required for trust and some affiliate/AdSense acceptance.
  - `Cookie Policy` — Privacy touches cookies but consider a dedicated Cookie Policy if you place Google Ads and third-party trackers.
  - `Disclaimer` — present in Terms but consider a clear, separate Disclosure/Disclaimer page for affiliate/legal clarity.

Recommendation: add `Contact` and `Cookie Policy` pages (even simple) before applying for AdSense and affiliate programs.

---

## 4) Navigation

- Broken links
  - I did not find evidence of broken links in code. Run a link-checker against the deployed URL to confirm (tools: `broken-link-checker`, online crawlers).

- Missing pages
  - `About`, `Contact`, and `Cookie Policy` (see Legal Pages above).

- Duplicate pages
  - `/tool/{id}` and `/tool/{slug}` both resolve to tool pages (see `app/tool/[slug]/page.tsx` and `app/tools/[id]/page.tsx` and the `generateStaticParams` that adds both id and slug variants). This creates duplicate-content risk.
  - Recommendation: add canonical tags on one variant and optionally redirect the alternate to canonical using a server-side redirect or canonical meta.

---

## 5) Google AdSense Readiness

- Content quality
  - Pages appear to have decent content and length (tool pages have descriptions, blog posts have multi-paragraph content). Good.

- Thin pages
  - Possible thin pages: auto-generated tool pages with only minimal description (if a tool has minimal description in DB). Ensure each tool has >= 300 words ideally for AdSense quality.

- Placeholder pages
  - No large placeholders except `AdBanner` placeholders that are intentionally ad slots (these are expected).

- Duplicate content
  - Risk from id vs slug duplicate endpoints (see Duplicate pages). Add canonical to avoid content dilution.

- Empty pages
  - Search results and 404 pages exist. Ensure `/submit` provides meaningful content and not gated by empty forms.

AdSense-specific checklist before requesting AdSense approval:
  - Public site URL accessible and stable (done).
  - Privacy Policy present (done).
  - Contact page present (missing — add it).
  - Site language and content quality (mostly present — ensure enough text on tool pages).
  - No adult/illegal content (not detected).

---

## 6) Accessibility

- Image alt text
  - No `<img>` tags discovered in the main app tree; inline SVGs used. If you add images, ensure `alt` attributes.

- Heading hierarchy
  - Page-level `h1` present on main pages (home, tools, tool details, blog posts). Subheadings use `h2`/`h3`. Good structure.

- ARIA labels
  - `Navbar` menu toggle includes `aria-label="Toggle menu"`.
  - Footer subscription input is a bare input with `placeholder` but no visible label — add a hidden label or `aria-label` for screen readers.

Recommendation: run an automated accessibility audit (Lighthouse / axe) on live site and fix any issues found (contrast, form labels, focus states).

---

## 7) Performance

- Lazy loading
  - No `next/image` components detected; lazy-loading images not applicable. If future images are added, wrap them with `next/image` for optimization and lazy loading.

- Image optimization
  - No large images currently used. Add an `og:image` optimized for social sharing (1200x630) via metadata.

- Code splitting
  - Next.js handles code splitting automatically. Keep third-party scripts to a minimum.

Recommendation: run Lighthouse and WebPageTest on the deployed site and address any suggestions for speed / CLS / LCP.

---

## 8) Security

- HTTPS compatibility
  - Vercel serves via HTTPS by default. Ensure all external urls use https.

- CSP
  - `next.config.ts` contains production-only security headers including Content-Security-Policy. Current `script-src` includes `'unsafe-inline'` and `'unsafe-eval'` which is permissive.
  - For AdSense, you must allow Google ad domains (see recommendations below). Tighten CSP where possible and only allow required domains.

- XSS risks
  - User-submitted content (submissions) should be safely escaped when rendered. Most content is rendered as plain text. When rendering HTML from external sources, sanitize.

---

## 9) Ads Integration — advertisement placeholders

All ad placeholders are implemented via a single component: `components/AdBanner.tsx`. This component renders three visual placeholders and is used in multiple pages.

Component: `components/AdBanner.tsx`
- Definition: line ~3 (`export default function AdBanner({`)
- Internal visual placeholders (found by string search):
  - `Advertisement` text occurrences at lines ~12, ~25, ~37 in the file (these correspond to the three sizes rendered).

Ad placements (occurrences)

- `components/HomePageContent.tsx`
  - Component: `HomePageContent`
  - Usage: `<AdBanner size="leaderboard" />`
  - File: [components/HomePageContent.tsx](components/HomePageContent.tsx)
  - Line: 84 (usage line reported by project search)
  - Container: centered leaderboard container with max width `max-w-[728px]` and height `h-[90px]` in placeholder
  - Suggested Ad format: "Leaderboard" / responsive or `728x90` (desktop), use responsive AdSense unit (auto) for mobile-friendly rendering.

- `app/tools/page.tsx`
  - Component: `BrowseToolsPage`
  - Usage: `<AdBanner size="leaderboard" />`
  - File: [app/tools/page.tsx](app/tools/page.tsx)
  - Line: 37
  - Container: leaderboard `728x90` placeholder
  - Suggested Ad format: Leaderboard / responsive

- `app/tool/[slug]/page.tsx`
  - Component: `ToolPage`
  - Usage: `<AdBanner size="leaderboard" />`
  - File: [app/tool/[slug]/page.tsx](app/tool/[slug]/page.tsx)
  - Line: 194
  - Container: leaderboard `728x90` placeholder (max width 728)
  - Suggested Ad format: Leaderboard / responsive

- `app/tools/[id]/page.tsx` (tool profile listing variant)
  - Component: `ToolProfilePage`
  - Usages:
    - `<AdBanner size="leaderboard" />` — File: [app/tools/[id]/page.tsx](app/tools/[id]/page.tsx) — Line: 198 — Leaderboard
    - `<AdBanner size="in-article" />` — File: [app/tools/[id]/page.tsx](app/tools/[id]/page.tsx) — Line: 255 — In-article (336x280 placeholder)
  - Suggested Ad formats: Leaderboard (top) and Large Rectangle / In-Article (`336x280`) for content area.

- `app/submit/page.tsx`
  - Component: `SubmitPage`
  - Usage: `<AdBanner size="leaderboard" />`
  - File: [app/submit/page.tsx](app/submit/page.tsx)
  - Line: 27
  - Container: leaderboard `728x90`
  - Suggested Ad format: Leaderboard / responsive

Ad container dimensions (from `AdBanner` placeholder visuals):
- `leaderboard` placeholder: 728 × 90 (container uses `h-[90px] max-w-[728px]`)
- `sidebar` placeholder: 300 × 250 (container uses `h-[250px]` and shows `300 x 250`)
- `in-article` placeholder: 336 × 280 (container uses `h-[280px] max-w-[336px]`)

Suggested Google Ad formats per container
- Leaderboard (top of content and list pages):
  - `responsive` AdSense unit (preferred for responsive layout)
  - Desktop fallback: `728x90` or `970x90`

- Sidebar / Box (not currently used in pages but present as a component size):
  - `300x250` (Medium Rectangle) — high-performing and commonly supported by AdSense

- In-Article:
  - `336x280` (Large Rectangle) or `in-article` responsive ad — good for content-heavy pages

Implementation notes for AdSense
- Add AdSense script in a safe place (preferably `app/head` or `app/layout.tsx`) using Next `Script` component or `next/head` for server-side metadata. Example (server-side metadata supports including raw script via `next/script` on client):

```jsx
import Script from 'next/script';

<Script
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  strategy="afterInteractive"
  data-ad-client="ca-pub-XXXXXXXXXXXX"
/>
```

- For each ad slot, use AdSense ad unit markup (use `ins` with `adsbygoogle` or use the new AdSense responsive code) inside a client component.
- Ensure you register the site in your AdSense account and get `ca-pub-XXXXX` publisher id before inserting ad code.

CSP changes required to allow Google ads (update `next.config.ts` production headers)
- Add these hosts to `script-src`, `img-src`, `connect-src`, and `frame-src` as needed:
  - `https://pagead2.googlesyndication.com`
  - `https://googleads.g.doubleclick.net`
  - `https://tpc.googlesyndication.com`
  - `https://www.googletagservices.com`
  - `https://www.google.com`
  - `https://www.gstatic.com`

Example (in `script-src` allow `https://pagead2.googlesyndication.com` and drop `unsafe-eval` if possible):

```text
script-src 'self' https://pagead2.googlesyndication.com 'unsafe-inline';
img-src 'self' data: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net;
frame-src https://googleads.g.doubleclick.net;
connect-src 'self' https://pagead2.googlesyndication.com;
```

---

## Actionable Recommendations (priority-ordered)

1. Add `public/robots.txt` and `public/manifest.json`, and add `public/favicon.ico` (or relevant icons). Update `README` and Vercel env `NEXT_PUBLIC_SITE_URL`.
2. Add `Contact` and `Cookie Policy` pages; expand `Privacy Policy` to explicitly mention AdSense and third-party vendors.
3. Resolve duplicate tool URLs: choose canonical pattern and add canonical metadata to tool pages; optionally redirect the alternate pattern to canonical.
4. Add `og:image` site default or per-page images and `twitter.image` for improved social previews.
5. If you will integrate AdSense, insert the AdSense script (add to `app/layout.tsx` via `next/script`) and replace `AdBanner` placeholders with the official AdSense unit markup (use client components and run `adsbygoogle` after load).
6. Update CSP (in `next.config.ts`) to permit Google's ad domains when in production, while removing unnecessary `'unsafe-eval'` or `'unsafe-inline'` if possible.
7. Run Lighthouse and accessibility checks on the live site to address small issues (footer subscription input label, contrast, performance optimizations).
8. Ensure content-rich tool pages: aim for at least 300 words where possible and avoid many near-duplicate entries.

---

## Files inspected (representative)

- `app/layout.tsx` — global metadata (title, description, openGraph, twitter, robots)
- `app/sitemap.ts` — sitemap generator (requires `NEXT_PUBLIC_SITE_URL`)
- `app/page.tsx`, `app/tools/page.tsx`, `app/tool/[slug]/page.tsx`, `app/tools/[id]/page.tsx`, `app/submit/page.tsx` — content pages and ad placements
- `app/privacy/page.tsx`, `app/terms/page.tsx` — legal pages
- `components/AdBanner.tsx` — ad placeholder component
- `components/HomePageContent.tsx`, `components/ToolCard.tsx`, `components/ToolsGrid.tsx`, `components/SubmitForm.tsx`, `components/Navbar.tsx` — UI components
- `next.config.ts` — security headers and CSP config for production

---

If you want, I can now:

- produce a list of exact code snippets to insert AdSense (script + example unit) and where to put them in `app/layout.tsx` and `components/AdBanner.tsx` (client-safe approach), or
- create `public/robots.txt`, `public/manifest.json` and add a simple `Contact` and `Cookie Policy` page as pull-request-ready changes.

Tell me which follow-up action you'd like and I'll prepare the changes (I will not modify files until you confirm).
