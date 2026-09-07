# Mobile documentation navigation regression

## Page and environment

Run against a preview of the current documentation source. The script uses the
origin of the browser's current page and preserves the `/docs/` base and `/zh/`
locale prefix. It needs no login or new project dependencies.

```sh
playwright-cli -s=doc-nav open http://127.0.0.1:4174/docs/guide/quickstart --mobile
playwright-cli -s=doc-nav run-code --filename=test/e2e/mobile-navigation.js
```

## Clicks and assertions

At 390px and 959px widths, in English and Chinese:

1. Open Quickstart and click its localized documentation menu button.
2. Select API reference, Integrations (集成), then Docs (文档).
3. Verify the URL resolves to `api/openai/create-chat-completion`,
   `best-practices/claude-code`, and `guide/quickstart`, respectively, with the
   correct base/locale prefix; VitePress's optional `.html` suffix is accepted.
4. Wait for the native sidebar to close. On API pages, wait for the async
   examples and their code to mount so a late layout shift cannot escape detection.
5. Assert the directory button is visible below the header and entirely within
   the first viewport, then click it to prove the drawer still opens.
6. Assert the selected category is active; press Escape and verify drawer closure.
7. Assert API examples follow the complete article and precede any previous/next
   chapter navigation in both DOM order and rendered geometry.
   Directly visit `api/openai/create-image-edit` (the screenshot's page)
   and repeat the article-order, first-viewport menu, drawer-open, and Escape checks.

This produces 16 checks across the two widths and locales. The API-order assertion
waits for async code examples and never scrolls the page before checking the menu.

## Intentionally excluded

No assertions on live account data, API execution, remote icons, full example
contents, analytics, or exact sidebar item counts. This case checks navigation
availability and native drawer behavior rather than a screenshot pixel match.
