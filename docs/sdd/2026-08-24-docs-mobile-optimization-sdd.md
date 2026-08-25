# Docs Mobile Optimization SDD

## Background

The documentation site currently relies on VitePress's generic mobile navigation and desktop-oriented custom styles. The approved Figma design introduces a compact mobile header, a wider documentation drawer, and mobile-first search and AI entry points.

## Goals

- Apply the redesign only below `960px` while preserving the existing desktop layout.
- Reuse VitePress sidebar state, routing, focus handling, Escape handling, and scroll locking.
- Keep local search, AI chat streaming, image attachments, and authentication as the existing sources of truth.
- Mirror the main site's paid personal-account avatar frame and plan label from existing user-info fields.
- Prevent mobile overlays and document content from creating horizontal page overflow.

## Non-goals

- No backend, database, route, or public URL changes.
- No replacement of the VitePress search index generation pipeline.
- No notification center is added because the existing Docs header does not expose notifications.
- No simulation of browser chrome shown in the Figma frame.

## Affected files and modules

- `docs_source/.vitepress/config.mts`: injects the mobile Copy Page control after Markdown H1 headings.
- `docs_source/.vitepress/theme/index.ts`: connects mobile search, sidebar tabs, and the existing assistant to VitePress layout slots.
- `docs_source/.vitepress/theme/custom.css`: isolates desktop navigation rules and defines the `<960px` shell, drawer, article, and overlay behavior.
- `doc-tabs.vue`, `breadcrumb.vue`, `login.vue`, `ai-assistant.vue`: responsive variants, membership avatar presentation, and mobile interaction behavior.
- `mobile-search.vue`: new mobile search surface.
- `assistant-events.ts`, `composables/use-auth.ts`, `composables/use-body-scroll-lock.ts`, `virtual-modules.d.ts`: typed events, user-info fields, shared scroll lock, and local-search module declarations.

## API and data contracts

The internal `open-ai-assistant` DOM event now accepts `{ query?: string; autoSend?: boolean }`. Callers without a payload remain compatible. `autoSend` sends only when no response is already streaming; otherwise the query remains in the composer.

No public API response shape changes are introduced.

The Docs auth model now consumes the existing `activeAccount.type`, `activeAccount.subscriptionPlanKey`, `flags.subscription`, and `flags.subscriptionInsider` fields returned by `/api/user/info`. The response is normalized from untrusted data rather than cast to `any`.

## Control flow

### Navigation and content

At mobile widths, the VitePress local-navigation menu button is visually moved into the 60px header. It still emits VitePress's native sidebar event. The sidebar renders `DocTabs` in `sidebar` mode before the configured locale-aware navigation tree. Markdown H1 closing tokens append a mobile-only `Copy` instance so the reading order is breadcrumb, title, Copy Page, then content.

The implementation follows Figma node `12160:2162`: the Header uses 16px outer padding, a 24px menu icon, an 88.354px by 20px logo, 36px appearance/language controls, and a 40px account treatment. The article uses a `#fafafa` light surface with 20px top and 16px horizontal padding. Mobile typography is 14px for breadcrumbs, 28px bold for H1, 20px bold for H2, and 16px regular for body copy, with the 8px and 28px vertical gaps shown in the design.

The 360px drawer uses 12px content padding. Its 46px three-column tab row has a 16px gap and a 2px active underline; navigation rows remain backed by the locale-specific VitePress sidebar configuration and use the design's 36px top-level rows, 32px nested rows, and 20px section separation.

### Search and assistant

The floating Search button and mobile `Cmd/Ctrl+K` or `/` shortcut open a focus-trapped modal and lock page scrolling. A non-empty query shows the localized AI prompt first and up to five MiniSearch results loaded from `@localSearchIndex`. Selecting the AI prompt closes search, opens the assistant, and requests immediate send. The assistant is a bottom sheet on mobile, retains the existing message and attachment state, and restores focus when closed.

### Membership avatar

The header uses the active account avatar returned by `/api/user/info`. A paid personal account with a non-`free` `subscriptionPlanKey` receives the same 40px outer treatment, 32px inset avatar, clipped plan-colored ring, and 12px plan label used by the main site. Free accounts, organization accounts, and accounts without an active subscription retain the plain avatar. Unknown future paid plan keys remain visible with the neutral fallback treatment.

### Search and assistant geometry

The mobile search overlay uses 60% black, 20px viewport padding, a maximum 362px card, 16px radius, 8px card padding, and a 40px input. The Assistant uses the same overlay, starts 74px from the top, has 20px top corners and a 60px header, and presents its composer as a 120px card with 12px padding and 36px attachment/send controls. Device status bars and browser toolbars shown in Figma remain excluded from the web implementation.

## Edge cases

- Empty search text displays only the input.
- Missing or failed search indexes do not affect page navigation.
- Long titles, sidebar labels, membership labels, tables, code blocks, and images are constrained or independently scrollable.
- Missing or partial user-info fields fall back to the existing avatar and display name without breaking Header rendering.
- Shared body-lock state prevents one overlay from re-enabling scroll while another overlay remains open.
- Dynamic viewport height and safe-area insets account for mobile browser chrome and the on-screen keyboard.

## Validation plan

- Check widths 375, 390, 402, 768, 959, 960, and 1280px in light/dark and English/Chinese states, including free, paid, and organization accounts.
- Exercise sidebar route close, search keyboard navigation, search-to-AI automatic send, streaming prefill, overlay and Escape close, and focus restoration.
- Verify no page-level horizontal overflow for tables, code blocks, images, drawers, or sheets.
- Run repository static checks and `git diff --check`; do not run a frontend production build or start a development server for this change.

## Rollout and compatibility

All new mobile layout behavior is guarded by `max-width: 959px`. Desktop slots and interaction remain in place. The assistant event extension is backward compatible, and the membership treatment consumes fields already returned by the existing user-info endpoint, so it requires no server rollout.

## Open questions

None for this iteration.
