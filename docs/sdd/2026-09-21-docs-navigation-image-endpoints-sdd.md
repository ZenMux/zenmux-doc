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
