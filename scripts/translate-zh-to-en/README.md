# 中文文档翻译脚本

这个脚本用于将中文 Markdown 文档自动翻译为英文。

## 环境设置

1. 设置环境变量：

```bash
export ZENMUX_API_KEY=your_api_key_here
```

或者创建 `.env` 文件：

```bash
cp .env.example .env
# 编辑 .env 文件，填入你的 API Key
```

## 使用方法

```bash
# 翻译单个文件
npm run translate docs_source/zh/index.md

# 翻译指南文档
npm run translate docs_source/zh/guide/quickstart.md

# 翻译关于页面
npm run translate docs_source/zh/about/intro.md
```

## 功能特性

- ✅ 自动检测中文路径（必须包含 `/zh/` 目录）
- ✅ 自动生成对应的英文路径（将 `zh` 替换为 `en`）
- ✅ 智能跳过已存在的英文文件
- ✅ 自动创建目标目录
- ✅ 使用专业的翻译提示词保证质量
- ✅ 保持代码和格式不变

## 注意事项

- 源文件路径必须包含 `/zh/` 目录
- 如果目标英文文件已存在，脚本会跳过翻译
- 只支持 Markdown (`.md`) 文件
- 需要有效的 ZenMux API Key
