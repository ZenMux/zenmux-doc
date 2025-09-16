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

## 脚本命令

本项目提供了多个实用脚本来简化开发流程：

### 📖 文档开发

```sh
# 启动开发服务器（热更新）
pnpm run dev

# 构建生产版本（输出到 docs/ 目录）
pnpm run build

# 预览已构建的站点
pnpm run preview
```

### 🌐 翻译工具

```sh
# 将中文文档翻译为英文（支持单个文件或整个文件夹）
pnpm run translate <中文文件路径或文件夹路径> [--force] [--concurrency=5]

# 示例：翻译单个文档
pnpm run translate docs_source/zh/guide/quickstart.md

# 示例：翻译整个文件夹（递归处理所有markdown文件）
pnpm run translate docs_source/zh/

# 强制重新翻译（覆盖现有英文文件）
pnpm run translate docs_source/zh/guide/quickstart.md --force

# 自定义并发数量（同时翻译多个文件，默认为5）
pnpm run translate docs_source/zh/ --concurrency=10

# 完整示例：翻译整个文件夹，强制覆盖，使用10个并发
pnpm run translate docs_source/zh/ --force --concurrency=10
```

**翻译工具说明**：

- 支持单个文件或文件夹输入，文件夹会递归处理所有 markdown 文件
- 自动将 `zh/` 路径转换为 `en/` 路径
- 使用 AI 模型 (openai/gpt-5) 进行高质量翻译
- 保留代码块、变量名和 Markdown 格式
- 支持并行处理多个文件，提高翻译效率
- 需要设置环境变量 `ZENMUX_API_KEY`

**参数说明**：

- `--force`: 强制覆盖已存在的目标文件
- `--concurrency=N`: 设置并发翻译数量（默认为 5，建议不超过 10 以避免 API 限流）

### ✨ 文档优化

```sh
# 优化中文文档的语言和结构
pnpm run optimize <输入文件> <输出文件> [--force]

# 示例：优化草稿文档
pnpm run optimize draft.md docs_source/zh/guide/quickstart.md

# 强制覆盖现有文件
pnpm run optimize draft.md docs_source/zh/guide/quickstart.md --force
```

**文档优化工具说明**：

- 改善中文文档的表达和结构
- 确保 VitePress 语法的正确使用
- 统一文档风格和格式
- 需要设置环境变量 `ZENMUX_API_KEY`

### 🖼️ 图片格式化

```sh
# 自动格式化所有文档中的图片
pnpm run format-images
```

**图片格式化工具功能**：

- 智能分类不同类型图片并设置合适尺寸
- 统一样式：响应式设计、圆角边框、阴影效果
- 性能优化：懒加载支持，避免重复处理

**提示**：

- 本仓库的 `docs_source/.vitepress/config.mts` 已设置 `outDir: '../docs'`，因此无需在命令行传 `--out`。
- 已开启本地全文搜索（`search.provider = 'local'`）。

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

scripts/                       # 自动化脚本
├── translate-zh-to-en/        # 翻译脚本
├── optimize-chinese-docs/     # 文档优化脚本
└── format-images.js           # 图片格式化脚本

.prompts/                      # AI 提示词模板
├── translation-zh-to-en.xml   # 翻译提示词
└── optimize-chinese-docs.xml  # 优化提示词

docs/                          # 构建输出目录（GitHub Pages 发布）
```

## 如何新增文档

### 文档创建流程

1. **中文优先**：在 `docs_source/zh/` 中创建中文文档
2. **自动翻译**：使用 `pnpm run translate <中文文件路径>` 生成英文版本
3. **更新导航**：在对应语言的 config.ts 中添加侧边栏菜单

### 路由规则

- 英文文档：根路径，如 `/guide/getting-started`
- 中文文档：`/zh/` 前缀，如 `/zh/guide/getting-started`

## 部署

项目已配置自动部署到 GitHub Pages：

1. 运行 `pnpm run build` 构建到 `docs/` 目录
2. 推送到 main 分支即可自动发布到 `docs.zenmux.ai`

## 开发规范

- Markdown 头部建议包含 `title` 字段
- 新增页面后需要更新对应语言的侧边栏配置
