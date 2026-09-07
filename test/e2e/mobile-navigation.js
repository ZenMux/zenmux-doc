async (page) => {
  const origin = await page.evaluate(() => location.origin);
  const results = [];

  async function assertMenuInViewport(menu, label) {
    const visible = await menu.isVisible();
    const box = await menu.boundingBox();
    const header = await page.locator('.VPNavBar').boundingBox();
    const viewport = page.viewportSize();
    if (!visible || !box || !header || !viewport ||
        box.y < header.y + header.height ||
        box.y + box.height > viewport.height ||
        box.x < 0 || box.x + box.width > viewport.width) {
      throw new Error(`${label}: documentation menu is missing from the first viewport (${JSON.stringify(box)})`);
    }
  }

  async function assertExamplesAfterArticle(label) {
    await page.locator('.api-container pre').first().waitFor();
    const correctlyOrdered = await page.locator('.api-container').evaluate(examples => {
      const article = document.querySelector('.VPDoc .main');
      const pager = document.querySelector('.VPDocFooter .prev-next');
      return article !== null &&
        Boolean(article.compareDocumentPosition(examples) & Node.DOCUMENT_POSITION_FOLLOWING) &&
        examples.getBoundingClientRect().top >= article.getBoundingClientRect().bottom &&
        (pager === null || (
          Boolean(examples.compareDocumentPosition(pager) & Node.DOCUMENT_POSITION_FOLLOWING) &&
          examples.getBoundingClientRect().bottom <= pager.getBoundingClientRect().top
        ));
    });
    if (!correctlyOrdered) {
      throw new Error(`${label}: API examples must appear after the article and before chapter navigation`);
    }
  }

  for (const width of [390, 959]) {
    await page.setViewportSize({ width, height: 844 });
    for (const locale of ['en', 'zh']) {
      const prefix = locale === 'zh' ? '/docs/zh' : '/docs';
      const menuLabel = locale === 'zh' ? '打开文档目录' : 'Open documentation menu';
      const sections = [
        { label: 'API reference', path: '/api/openai/create-chat-completion' },
        { label: locale === 'zh' ? '集成' : 'Integrations', path: '/best-practices/claude-code' },
        { label: locale === 'zh' ? '文档' : 'Docs', path: '/guide/quickstart' },
      ];

      await page.goto(`${origin}${prefix}/guide/quickstart`);
      const menu = page.getByRole('button', { name: menuLabel, exact: true });
      await menu.waitFor();
      for (const section of sections) {
        await menu.click();
        await page.locator('.VPSidebar.open').waitFor();
        await page.locator('.doc-tabs-sidebar').getByRole('link', {
          name: section.label, exact: true,
        }).click();
        await page.waitForURL(url => url.pathname.replace(/\.html$/, '') === `${prefix}${section.path}`);
        await page.locator('.VPSidebar.open').waitFor({ state: 'hidden' });
        if (section.path.startsWith('/api/')) {
          // The async API examples must finish mounting before checking geometry.
          await page.locator('.api-container').waitFor();
          await page.locator('.api-container pre').first().waitFor();
        }
        const label = `${width}px ${locale} ${section.label}`;
        if (section.path.startsWith('/api/')) {
          await assertExamplesAfterArticle(label);
        }
        await assertMenuInViewport(menu, label);
        await menu.click();
        await page.locator('.VPSidebar.open').waitFor();
        const activeTab = await page.locator('.doc-tabs-sidebar .doc-tab-item.active').textContent();
        if (activeTab?.trim() !== section.label) {
          throw new Error(`${label}: incorrect active category ${activeTab}`);
        }
        await page.keyboard.press('Escape');
        await page.locator('.VPSidebar.open').waitFor({ state: 'hidden' });
        results.push(`${label}: PASS`);
      }

      // Cover the exact page reported in the mobile screenshot as a direct visit.
      await page.goto(`${origin}${prefix}/api/openai/create-image-edit`);
      await menu.waitFor();
      const imageEditLabel = `${width}px ${locale} Create image edit`;
      await assertExamplesAfterArticle(imageEditLabel);
      await assertMenuInViewport(menu, imageEditLabel);
      await menu.click();
      await page.locator('.VPSidebar.open').waitFor();
      await page.keyboard.press('Escape');
      await page.locator('.VPSidebar.open').waitFor({ state: 'hidden' });
      results.push(`${imageEditLabel}: PASS`);
    }
  }

  return results;
}
