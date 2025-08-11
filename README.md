# ZenMux 文档站点

基于 VitePress 的多语言文档站点。源文件在 `docs_source/`，构建产物输出到 `docs/`（用于 GitHub Pages 发布）。

## 环境要求

- Node.js 18+（VitePress 1.6.x 需 Node 18 或更高）
- npm 8+

## 快速开始

1. 安装依赖

```sh
pnpm install
```

2. 本地开发（热更新）

```sh
pnpm run dev
```

3. 生产构建（输出到 docs/ 目录）

```sh
pnpm run build
```

4. 本地预览已构建站点

```sh
pnpm run preview
```

提示

- 本仓库的 `docs_source/.vitepress/config.mts` 已设置 `outDir: '../docs'`，因此无需在命令行传 `--out`。
- 已开启本地全文搜索（`search.provider = 'local'`）。

## 目录结构

- `docs_source/` 文档源码（Markdown + 站点配置）
  - `.vitepress/config.mts` 站点与主题配置（已启用中英文 locales）
  - `index.md` 英文首页与快速开始
  - `api/overview.md` API 概览
  - `zh/` 中文文档目录（含中文首页与示例）
- `docs/` 构建输出目录（GitHub Pages 发布使用）
- `patches/` 对第三方包的修补（`patch-package`）

## 如何新增文档

以新增一篇“Getting Started/快速上手”为例：

1. 新增 Markdown 文件

- 英文：`docs_source/guide/getting-started.md`
- 中文：`docs_source/zh/guide/getting-started.md`

示例（英文）：

```md
---
title: Getting Started
outline: deep
---

# Getting Started

这里写正文内容，支持 VitePress 的所有 Markdown 扩展。
```

示例（中文）：

```md
---
title: 快速上手
outline: deep
---

# 快速上手

这里写中文内容。
```

1. 把文档加到侧边栏

编辑 `docs_source/.vitepress/config.mts`，在 `themeConfig.sidebar`（英文）与 `locales.zh.themeConfig.sidebar`（中文）中增加菜单项：

```ts
// 英文侧边栏
{
  text: 'Guide',
  items: [
    { text: 'Getting Started', link: '/guide/getting-started' },
  ],
}

// 中文侧边栏
{
  text: '指南',
  items: [
    { text: '快速上手', link: '/zh/guide/getting-started' },
  ],
}
```

1. 路由与链接规则

- 英文根路由以 `/` 开头，如 `/guide/getting-started`。
- 中文路由以 `/zh/` 前缀开头，如 `/zh/guide/getting-started`。
- 中英文互相跳转时，请注意加上或去掉 `/zh/` 前缀。

## 调试与构建

- 开发模式：`pnpm run dev`，默认打开 <http://localhost:5173>（Vite 默认端口，实际端口以终端输出为准）。
- 构建输出：`pnpm run build` 后产物写入 `docs/`；若启用 GitHub Pages，将直接用该目录发布。
- 预览构建：`pnpm run preview`。

## 部署到 GitHub Pages（使用 docs 目录）

1. 打开 GitHub 仓库 Settings → Pages。
2. Source 选择 “Deploy from a branch”。
3. Branch 选择 `main`，目录选择 `/docs`。
4. 自定义域名：本仓库已在 `docs/CNAME` 配置 `docs.zenmux.ai`。确保 DNS 解析指向 GitHub Pages 并完成主机名验证。
5. 推送构建产物：

```sh
pnpm run build
git add -A
git commit -m "build: docs site"
git push
```

GitHub Pages 会自动从 `/docs` 目录发布最新站点。

## 规范与约定

- Markdown 头部 Frontmatter 建议至少包含 `title`，必要时添加 `outline: deep` 以生成更完整目录。
- 站点导航位于 `config.mts -> themeConfig.nav`（英文）与 `locales.zh.themeConfig.nav`（中文）。
- 新增页面后，确保侧边栏与导航均能找到入口，避免“孤儿页面”。

## 常见问题（FAQ）

- 预览为什么 404？
  - 新增中文文档请确保路径以 `/zh/` 前缀；英文文档则不需要此前缀。
- GitHub Pages 发布后路径错乱？
  - 如果使用自定义域名（`docs.zenmux.ai`），`config.mts` 中的 `base` 应为 `/`。若使用非根路径发布，需相应配置 `base`。
- 死链检查怎么做？
  - 构建后可借助简单脚本或站点扫描工具检测 `docs/` 内页面的外链有效性。

## 贡献

欢迎提交 PR 改进文档与示例。建议在提交前本地构建并预览，确保链接与导航正常。
