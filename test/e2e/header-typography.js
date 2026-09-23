async (page) => {
  const result = await page.evaluate(() => {
    const failures = [];
    const near = (actual, expected) => Math.abs(actual - expected) < 0.1;
    const menu = document.querySelector('.VPNavBarMenu');
    if (window.innerWidth < 1340 || menu === null || menu.getBoundingClientRect().width === 0) {
      throw new Error('Run on a Docs page with the desktop menu visible (width >= 1340px)');
    }

    // Inspect every rendered label: links and buttons have different inheritance paths.
    const labels = [...menu.querySelectorAll(
      ':scope > .VPNavBarMenuLink > span, :scope > .VPNavBarMenuGroup > .button > .text > span:first-child'
    )].map(element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        text: element.textContent.trim(),
        fontSize: style.fontSize,
        fontStretch: style.fontStretch,
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        letterSpacing: style.letterSpacing,
        smoothing: style.getPropertyValue('-webkit-font-smoothing'),
        textRendering: style.textRendering,
        height: rect.height,
        centerY: rect.top + rect.height / 2,
      };
    });
    if (labels.length !== 8) failures.push(`Expected 8 top-level labels, found ${labels.length}`);
    for (const label of labels) {
      if (label.fontSize !== '16px' || label.fontStretch !== '85%' ||
          label.fontWeight !== '400' || label.letterSpacing !== '-0.32px' ||
          label.fontFamily !== labels[0].fontFamily || !near(label.height, 16 * 0.96) ||
          !near(label.centerY, labels[0].centerY)) {
        failures.push(`Inconsistent label: ${JSON.stringify(label)}`);
      }
      if ((label.smoothing !== '' && label.smoothing !== 'auto') || label.textRendering !== 'auto') {
        failures.push(`Navigation must use the main site's default font rendering: ${label.text}`);
      }
    }

    const icons = [
      ['GitHub', '.VPNavBarSocialLinks .VPSocialLink', '[class^="vpi-social-"]'],
      ['Theme', '.VPNavBarAppearance .VPSwitchAppearance', '.icon > span'],
      ['Language', '.VPNavBarTranslations > .button', '.option-icon'],
    ].map(([name, targetSelector, iconSelector]) => {
      const target = document.querySelector(targetSelector);
      if (target === null) throw new Error(`Missing ${name} action`);
      const box = target.getBoundingClientRect();
      const glyphs = [...target.querySelectorAll(iconSelector)].map(element => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height,
          offsetX: rect.left + rect.width / 2 - box.left - box.width / 2,
          offsetY: rect.top + rect.height / 2 - box.top - box.height / 2 };
      });
      if (!near(box.width, 32) || !near(box.height, 32) || glyphs.length === 0 ||
          glyphs.some(glyph => !near(glyph.width, 18) || !near(glyph.height, 18) ||
            !near(glyph.offsetX, 0) || !near(glyph.offsetY, 0))) {
        failures.push(`Incorrect ${name} action geometry`);
      }
      return { name, width: box.width, height: box.height, glyphs };
    });
    for (const arrow of menu.querySelectorAll('.button .vpi-chevron-down')) {
      const style = getComputedStyle(arrow);
      if (style.width !== '14px' || style.height !== '14px') failures.push('Incorrect chevron size');
    }
    for (const link of menu.querySelectorAll('.VPNavBarMenuGroup > .menu .link')) {
      if (getComputedStyle(link).fontSize !== '14px') failures.push('Dropdown text must stay 14px');
    }
    const ordered = [
      '.VPNavBarTitle', '.VPNavBarSearch', '.content-body > .ai-trigger', '.VPNavBarMenu',
      '.VPNavBarSocialLinks', '.VPNavBarAppearance', '.VPNavBarTranslations', '.login-button',
    ].map(selector => document.querySelector(selector)?.getBoundingClientRect());
    for (let index = 1; index < ordered.length; index++) {
      const current = ordered[index];
      const previous = ordered[index - 1];
      if (current && previous && current.left < previous.right - 0.1) failures.push('Header items overlap');
    }
    if (ordered.some(rect => rect && (rect.left < 0 || rect.right > window.innerWidth + 0.1))) {
      failures.push('Header overflows the viewport');
    }
    const search = document.querySelector('.VPNavBarSearch .DocSearch-Button');
    const searchRect = search.getBoundingClientRect();
    for (const child of search.children) {
      const rect = child.getBoundingClientRect();
      if (rect.width > 0 && (rect.left < searchRect.left || rect.right > searchRect.right)) {
        failures.push('Search contents overflow the search button');
      }
    }
    const nav = menu.getBoundingClientRect();
    const github = document.querySelector('.VPNavBarSocialLinks').getBoundingClientRect();
    const theme = document.querySelector('.VPNavBarAppearance').getBoundingClientRect();
    const language = document.querySelector('.VPNavBarTranslations').getBoundingClientRect();
    const account = document.querySelector('.login-button').getBoundingClientRect();
    const avatar = document.querySelector('.user-avatar-trigger')?.getBoundingClientRect();
    const spacing = {
      // 36px menu padding + 16px group gap + 16px search icon + 18px group margin.
      menuToGithub: github.left - nav.right,
      githubToTheme: theme.left - github.right,
      themeToLanguage: language.left - theme.right,
      // 12px language margin + 32px notification slot + 20px notification margin.
      languageToAccount: account.left - language.right,
      accountRightInset: window.innerWidth - account.right,
      avatarRightInset: avatar ? window.innerWidth - avatar.right : null,
    };
    if (!near(spacing.menuToGithub, 86) || !near(spacing.githubToTheme, 12) ||
        !near(spacing.themeToLanguage, 12) || !near(spacing.languageToAccount, 64) ||
        !near(spacing.accountRightInset, 20) ||
        (spacing.avatarRightInset !== null && !near(spacing.avatarRightInset, 20))) {
      failures.push(`Header action spacing differs from the main site: ${JSON.stringify(spacing)}`);
    }
    return { viewport: window.innerWidth, failures, labels, icons, spacing };
  });
  if (result.failures.length > 0) throw new Error(result.failures.join('\n'));
  return result;
}
