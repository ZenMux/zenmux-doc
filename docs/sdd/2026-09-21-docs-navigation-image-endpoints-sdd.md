# Docs navigation and image endpoints

Date: 2026-09-21. Work item: [2026092000119263210](https://project.alipay.com/?openWorkItemId=2026092000119263210).

**Background and goals**

The documentation header used older Studio destinations and a single Analytics link. The OpenAI sidebar exposed two advanced image streaming event pages alongside operation pages, while the endpoint drawer omitted image generation and editing. The approved names are exactly `Generate image` and `Generate image edit`.

The change aligns the public navigation, applies those names to both locales, removes the streaming pages from the sidebar, and adds the two operations to the Docs drawer. It is based on upstream main `b5fbaae`, which already includes Rerank, Speech, Transcription, and five provider cards.

**Non-goals**

No backend APIs, request examples, schemas, authentication rules, model filters, document URLs, or deployment behavior change. The Next.js site's independent drawer is outside this change. Docs keeps its existing Image visibility; Icons and Enterprise are not added because Docs does not consume the main site's complete permission and rollout data. No shared navigation service, component rewrite, or new dependency is introduced.

**Affected files**

- `docs_source/en/config.ts` and `docs_source/zh/config.ts`: header order, Analytics children, Studio destinations, image labels, and removal of the two streaming sidebar entries.
- `docs_source/{en,zh}/api/openai/generate-an-image.md`: H1, platform operation name, description, and English SEO title.
- `docs_source/{en,zh}/api/openai/create-image-edit.md`: corresponding editing labels and metadata.
- `docs_source/{en,zh}/guide/advanced/openai-image-generation.md`: image operation link labels; event links remain intact.
- `docs_source/.vitepress/theme/endpoint-drawer.vue`: two image entries, existing image/edit icon components, and localized document navigation for the new entries.

**Data and navigation contracts**

Public header order is Studio, Models, Analytics, Pricing, Developers, Campaign, About Us. Studio points to `https://zenmux.ai/platform/chat?newChat=true`, `/platform/image`, and `/platform/video`. Analytics contains `/analytics/models` and `/analytics/apps`. All main-site targets use the absolute `https://zenmux.ai` origin. Existing Docs and Endpoints navigation behavior is preserved. Desktop and mobile continue to consume the same locale-specific `theme.nav`.

| Operation | Relative API path | English document | Chinese document |
| --- | --- | --- | --- |
| Generate image | `/images/generations` | `/docs/api/openai/generate-an-image.html` | `/docs/zh/api/openai/generate-an-image.html` |
| Generate image edit | `/images/edits` | `/docs/api/openai/create-image-edit.html` | `/docs/zh/api/openai/create-image-edit.html` |

The OpenAI Base URL remains `https://zenmux.ai/api/v1`. The internal `Endpoint` interface gains optional `docUrlZh`; only the two new entries supply it. `image-edit` is added to the icon union and mapped to the existing `IconImage_editing`; generation reuses `imagen` and `IconImageai`. There is no public API or persistence change.

**Control flow**

The existing `endpoints` document event opens the drawer. The new image entries appear after Rerank and before Speech. Copy continues to write the relative API path to the clipboard. The Docs button passes the selected endpoint to `openDoc`, which reads VitePress's reactive `localeIndex` at click time: `zh` selects `docUrlZh` when present; otherwise it uses `docUrl`. The URL opens in a new tab. Existing entries without `docUrlZh` retain their original behavior.

Both API H1s and sidebar labels use the approved English operation names in both locales. English SEO titles match those names, while Chinese SEO titles remain natural Chinese. API descriptions are localized. References to OpenAI's own official pages retain their official `Create image` / `Create image edit` names. The existing API example component reads H1, so its title follows without a component change.

The four streaming event documents remain byte-for-byte unchanged. Only their sidebar entries are removed. Existing advanced-guide links remain the entry points; search and direct URLs remain eligible. The existing sidebar-derived breadcrumb can become shorter on event pages, as accepted in the design. No `noindex` flag or route rewrite is added.

**Edge cases and compatibility**

- Switching locale while the drawer is mounted must change the new entries' Docs destinations without changing their titles or API paths.
- Existing providers and endpoints must retain their data and relative order; the OpenAI card grows from seven to nine entries.
- Chinese links include `/docs/zh/` once; English links include `/docs/` once. Main-site navigation must not acquire a `/docs/` prefix.
- Advanced-guide links and the four event files must survive sidebar removal; request code blocks must remain unchanged.
- Existing responsive columns, Escape, close-button, overlay, and share-link behavior are retained.

**Validation and results**

Completed without starting a Docs dev server or running a production build:

- `git diff --check`.
- Strict TypeScript checking of the actual drawer setup script and both locale configs, using the installed TypeScript compiler and a Vue import declaration without emitting files.
- Vue script, template, and scoped-style compilation of the actual drawer and imported icons in a temporary validation directory.
- Config and content checks for header order, Studio/Analytics URLs, retained developer actions, exact image names, locale-specific document paths, and sidebar removal.
- Comparison against the base commit confirms that existing provider data, existing endpoint data, all four event documents, and API request code blocks are unchanged.
- Playwright component checks at 1280px and 390px in English and Chinese: exact labels and paths, SVG icons, relative-path copy values, localized Docs targets, retained provider cards, and Escape close. Close-button and overlay dismissal also pass, with no component runtime exceptions.
- Visual inspection of settled desktop light/dark and mobile component captures confirms the two new image rows fit the existing layout.

The browser harness compiles the real component, supplies a reactive VitePress locale, and intercepts clipboard writes and `window.open` to inspect their arguments. It blocks unrelated remote CDN images. It therefore verifies component behavior, not clipboard permissions, external image availability, full VitePress navigation, or deployed destination responses. The temporary harness does not add or change repository e2e cases.

Before release, verify the full site in both locales: header and mobile menu navigation, async API card headings, event-page direct visits and mobile sidebar entry, search results, Copy Page content, and `?endpoints=open`. No local Docs server was running, so these integrated checks were not claimed as passed.

**Rollout and rollback**

Release all nine source-file changes together through the existing Docs CI, which regenerates HTML, local-search indexes, and Copy Page raw text. Do not edit generated outputs. Retained document URLs and API paths require no redirect or data migration. Rollback restores these source files and republishes using the same process.

**Open questions**

No product decisions remain for this scope. Main-site drawer synchronization and identity-dependent header parity remain separate follow-up work.

## Header style alignment — 2026-09-22

Work item: [2026092100119307151](https://project.alipay.com/?openWorkItemId=2026092100119307151).

**Problem and scope.** Align the existing Docs desktop menu typography, spacing,
dropdown treatment, and action sizes with `zenmux-next-new`'s `HeaderMenu`,
`HeaderActions`, and `LanguageSwitcher`. After the initial CSS pass, Models and
Campaign still rendered at 14px while flyout labels rendered at 16px; the flyout
buttons also reset inherited `font-stretch` to 100%. VitePress's scoped link rule
outranked the bare custom selector. The language button incorrectly used a
descendant selector although `VPNavBarTranslations` and `VPFlyout` are classes on
the same element, leaving its target at 40×56px instead of 32×32px.
The follow-up side-by-side screenshot also exposed a 36px avatar right inset
instead of 20px, missing space for search/notifications, and lighter-looking
text caused by VitePress's inherited antialiasing. Live main-site inspection
confirmed the same font stack, 16px/400/85% typography and #808080 inactive color,
but default font smoothing and `text-rendering: auto`.

**Files and behavior.** `docs_source/.vitepress/theme/custom.css` is the only
runtime change. `test/e2e/header-typography.js` and its adjacent logic document
cover the regression. No navigation data, public API, persistence, authentication,
search implementation, Vue component, or dependency changes are needed.

- Use a shared rule for top-level links and flyout text: the main site's system
  font stack, 16px, weight 400, -0.02em tracking, and explicit 85% stretch. Give the
  link selector sufficient specificity to beat VitePress's scoped default and
  apply stretch after the button inheritance boundary. Only label spans get a
  16px line box and `scaleY(0.96)`; hit areas and arrows are not transformed.
- Apply default font smoothing and text rendering only to the navigation,
  preserving document typography. Keep normal weight 400 rather than simulating
  heavier text with a different font weight or color.
- Use a 24px menu gap, 14px chevrons, and 188px
  minimum dropdown panels with 14px entries. Reuse theme colors and visible focus
  outlines. The existing right-pointing chevron asset rotates 90° closed and 270°
  while hovered or expanded, matching VitePress's two menu-opening states.
- At desktop sizes, center 18px GitHub, sun/moon, and language glyphs inside 32px
  targets. Use a same-element language selector. These overrides start at 960px;
  the existing 20px mobile glyph rules and mobile layout remain unchanged.
- Keep one 20px right inset at the wrapper. Remove the nested content's extra
  right padding, Login wrapper padding/negative margin, and avatar left margin
  on desktop. The actual avatar and account wrapper now share the same right edge.
- At 1340px and above, reserve the main site's collapsed search group using an
  86px menu-to-GitHub gap (36 + 16 + 16 + 18), followed by 12px icon gaps. Reserve
  notifications with a 64px language-to-account gap (12 + 32 + 20). CSS margins
  provide the slots without adding inert buttons or focus stops. The notification
  slot remains reserved in both account states. Conditional main-site Enterprise
  navigation remains outside Docs, so differing menu sets can still have different
  first-item positions even when their right edges match.
- Keep the 1340px menu collapse breakpoint. The search container can shrink from
  200px to 128px, its button fills that container, Ask AI retains 16px of trailing
  spacing, and sidebar-header padding shrinks from 174px to 124px near the desktop
  breakpoint to accommodate the larger text without overlap.
  Hide only the search shortcut hint at 1340–1439px so search contents still fit
  when Login and the reserved action slots use more width; the shortcut itself
  and search action are unchanged.

**Validation and limitations.** A temporary localhost mirror serves published
VitePress markup/runtime with the working-tree CSS substituted in its original
cascade position. Account states are fixtures; no real account APIs are called.
The saved regression's browser evaluation fails before the fix and passes after
it. It measures every rendered top-level label, both theme glyphs, all three
action targets, dropdown fonts, chevrons, and header overlap/overflow. Its dropdown
selector explicitly starts at a flyout because the outer nav also has class
`menu` and would otherwise include top-level links.

Twenty desktop scenarios passed at 1340/1440/1512/1920px across English/Chinese,
light/dark, and Login/avatar states. Dark checks assert the actual root class.
Each result reports the actual viewport width. The expanded regression also
asserts default font rendering, 20px account/avatar right insets, all four action
gaps, and search-content bounds. Before this correction it fails on the old
36px avatar inset, 36/8/8/4px gaps, and inherited antialiased rendering.
All seven labels measure 16px/85%, with equal centers and 15.36px transformed
line boxes. English flyout text also becomes measurably narrower (Studio:
44.79px → 41.54px), confirming that the width request affects the available font.
Mobile checks at 390/959px retain 20px glyphs without overflow; 1339px still
collapses the desktop menu. The Chinese dark flyout opens with its upward arrow;
search opens and closes with Escape, and mobile navigation opens. CSS/JS syntax
and `git diff --check` pass. No project dev server or production build was run.
This verifies the current CSS against VitePress's rendered structure, not a full
fresh site build or live account behavior. Font-width availability and rasterizing
details can vary by OS; the code requests 85% consistently without synthesizing
horizontal transforms.

**Rollout and compatibility.** Publish the source CSS through the normal Docs
pipeline; do not hand-edit generated assets. Existing links and the shared
locale/mobile navigation remain intact. Rollback reverts the stylesheet change
and republishes. No new product decisions or migrations are required.
