<div align="center">
  <img width="100%" src="https://cdn.marmot-cloud.com/storage/zenmux/2025/09/16/lAK3vlZ/banner.png" alt="ZenMux Banner" />

  <p>
    <a href="../README.md">English</a> | <a href="#README_cn.md">简体中文</a>
  </p>
</div>

# ZenMux 文档仓库

基于 VitePress 的多语言文档站点，是 [ZenMux 官方文档](https://docs.zenmux.ai/)的源码仓库。

## 快速开始

1. 安装依赖

```sh
pnpm install
```

2. 启动本地开发服务器（热更新）

```sh
pnpm run dev
```

3. 生产构建（输出到 `docs/` 目录）

```sh
pnpm run build
```

4. 本地预览已构建站点

```sh
pnpm run preview
```

## 撰写文档

本项目遵循**中文优先**工作流：内容先以中文写作，再翻译为英文。

### AI 辅助工具（Claude Code Skill）

翻译和优化均通过 [Claude Code](https://claude.ai/code) skill 完成，无需手动脚本或配置 API Key。在 Claude Code 中打开本仓库，直接描述你的需求即可：

**翻译中文文档为英文：**

> "翻译 `docs_source/zh/guide/quickstart.md` 为英文"
>
> "把 `docs_source/zh/best-practices/` 下的所有文件翻译成英文"
>
> "强制重新翻译 `docs_source/zh/guide/intro.md`"

Skill 会自动处理路径转换（`zh/` → `en/`），默认跳过已存在的文件，并自动更新两个语言的侧边栏配置。

**优化中文文档：**

> "优化 `docs_source/zh/guide/quickstart.md`"
>
> "润色这份草稿，保存到 `docs_source/zh/guide/new-feature.md`"

Skill 会改善语言表达、文档结构和 VitePress 语法，无需额外配置。

### 图片格式化

```sh
# 自动格式化所有文档中的图片
pnpm run format-images
```

## 目录结构

```text
docs_source/                    # 文档源码目录
├── .vitepress/config.mts      # VitePress 配置文件
├── config.ts                  # 多语言配置中心
├── index.md                   # 英文首页
├── en/                        # 英文文档目录
│   ├── config.ts              # 英文语言配置
│   └── [文档文件]
├── zh/                        # 中文文档目录（源语言）
│   ├── config.ts              # 中文语言配置
│   └── [文档文件]
└── public/                    # 静态资源目录

.claude/
├── skills/
│   ├── translate-docs/        # 翻译 skill（中文 → 英文）
│   └── optimize-chinese-docs/ # 中文文档优化 skill
└── agents/                    # （保留）

.prompts/                      # AI 提示词模板
├── translation-zh-to-en.xml   # 翻译规范
└── optimize-chinese-docs.xml  # 优化规范

scripts/                       # 工具脚本
└── format-images.js           # 图片格式化

docs/                          # 构建输出目录（GitHub Pages 发布）
```

## 贡献指南

欢迎任何形式的贡献，无论是修正错别字、改进表达，还是新增一篇完整的指南。

### 新增文档

1. **中文优先** — 在 `docs_source/zh/` 下创建中文文件，路径结构与 `docs_source/en/` 保持镜像关系。

2. **更新侧边栏** — 在 `docs_source/zh/config.ts` 中添加菜单项：
   ```ts
   { text: "我的新页面", link: "/zh/guide/my-new-page" }
   ```

3. **翻译为英文** — 在 Claude Code 中说：
   > "翻译 `docs_source/zh/guide/my-new-page.md` 为英文"

   Skill 会自动创建英文文件，并将对应菜单项添加到 `docs_source/en/config.ts`。

4. **提交 Pull Request** — 向 `main` 分支提 PR。

### 修改现有文档

- **修正错别字或小错误**：直接编辑中文文件，如改动较大则重新翻译。
- **较大范围的重写**：修改中文源文件，必要时先用优化 skill 润色，再翻译。
- 始终保持中英文版本同步。

### 文件命名规范

- 使用小写 kebab-case 命名：`my-new-feature.md`
- 在 `zh/` 和 `en/` 目录中使用完全相同的文件名
- 侧边栏配置中的 `link` 路径需与文件名精确对应

### 路由规则

| 语言 | 路径格式                  | 示例                            |
| ---- | ------------------------- | ------------------------------- |
| 英文 | `/guide/page-name`        | `/guide/quickstart`             |
| 中文 | `/zh/guide/page-name`     | `/zh/guide/quickstart`          |

### VitePress 常用语法

使用以下元素让文档更清晰：

```markdown
::: tip 标题
重要提示和最佳实践。
:::

::: warning
需要注意的事项。
:::

::: code-group

```python [Python]
# 示例代码
```

```ts [TypeScript]
// 示例代码
```

:::
```

## 部署

每次向 `main` 分支推送代码，站点会自动部署到 GitHub Pages：

1. `pnpm run build` 将源码编译到 `docs/` 目录
2. GitHub Pages 从 `docs/` 发布到 [docs.zenmux.ai](https://docs.zenmux.ai)

> `docs_source/.vitepress/config.mts` 已设置 `outDir: '../docs'`，无需额外参数。
