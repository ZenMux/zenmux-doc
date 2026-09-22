# Desktop header typography regression

Run `header-typography.js` against an already loaded Docs preview with the current
source CSS, using the existing Playwright CLI `run-code --filename` convention.
The script checks the current page without navigation or account mutations.

## Page and environment

- `/docs/about/intro.html` and `/docs/zh/about/intro.html`.
- Desktop widths: 1340, 1440, 1512, 1920px; light and dark themes. Confirm the
  returned `viewport` equals the requested width when controlling multiple tabs.
- Check both the Login button and an avatar fixture because their widths differ.
- No query-string behavior is required by the product; isolated previews may use
  query parameters to choose theme and account fixtures.

## Assertions

No clicks are needed for this regression. Inspect all seven actual label spans,
covering ordinary links and flyout buttons: 16px, 400 weight, the same font family,
85% stretch, -0.32px tracking, equal vertical centers, and a 16px line box scaled
to 96%. Inspect both sun and moon glyphs, GitHub, and language: 18px inside centered
32px targets. Dropdown text stays 14px and chevrons stay 14px. Header sections must
remain ordered without overlap or viewport overflow.

Font rendering must match the main site's defaults (`text-rendering: auto` and
`-webkit-font-smoothing: auto` on browsers that support it). Both sites already
use weight 400 and #808080 for inactive light-theme labels; VitePress's inherited
antialiasing setting made Docs look lighter despite those matching values.

Check the actual avatar and account right edges, both 20px from the viewport.
The menu-to-GitHub gap is 86px: 36px menu padding plus the missing collapsed search
group (16px group gap + 16px glyph + 18px trailing margin). GitHub/theme/language
targets have 12px gaps. Language-to-account spacing is 64px: 12px icon margin plus
the missing notification target and its margin (32px + 20px). These empty slots
are CSS margins, so they add no clickable or keyboard-focusable controls.

At 1340–1439px the search shortcut hint is hidden and the search container can
shrink to 128px. Assert its visible contents stay inside the button. This prevents
the additional action spacing from pushing search over the logo when Login is
wider than the avatar; the search action and keyboard shortcut remain available.

Before the fix, this fails on Models/Campaign at 14px, flyout labels at 100%
stretch, 16px action glyphs, and the 40px language target. Checking only a flyout's
container font size would miss both typography regressions.

The subsequent action-alignment regression fails before the spacing fix with
36px avatar inset, 36/8/8/4px action gaps, and inherited antialiased text. It passes
with 20px avatar inset, 86/12/12/64px gaps, and default text rendering.

## Intentionally excluded

No live account data, links to external sites, API calls, theme persistence,
pixel-perfect font rasterization across operating systems, or screenshot pixel
comparison. `font-stretch` selects an available font width; it cannot synthesize
an unavailable font face. Mobile layout and dropdown/search interactions require
separate browser checks.

Exact first-item alignment also depends on matching menu contents and account
controls. The main site's conditional Enterprise entry is not added to Docs;
the reserved notification slot remains present for both Login and avatar states.
