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
pnpm run translate docs_source/zh/index.md

# 翻译多个文件（并行处理）
pnpm run translate docs_source/zh/guide/quickstart.md docs_source/zh/about/intro.md

# 翻译整个文件夹
pnpm run translate docs_source/zh/

# 翻译多个文件夹（并行处理）
pnpm run translate docs_source/zh/guide/ docs_source/zh/api/

# 混合使用：同时翻译文件和文件夹
pnpm run translate docs_source/zh/index.md docs_source/zh/guide/ docs_source/zh/about/

# 强制覆盖已存在的英文文件
pnpm run translate docs_source/zh/index.md --force

# 使用更高的并发数量加快翻译速度
pnpm run translate docs_source/zh/ --concurrency=10

# 组合使用：翻译多个路径，强制覆盖，高并发
pnpm run translate docs_source/zh/guide/ docs_source/zh/api/ --force --concurrency=10
```

## 参数说明

- `<源路径...>`: 支持一个或多个源文件/文件夹路径
  - 可以是单个文件：`docs_source/zh/index.md`
  - 可以是文件夹：`docs_source/zh/guide/`
  - 可以同时指定多个路径，脚本会自动收集所有文件并去重
- `--force`: 强制覆盖已存在的目标文件，默认情况下脚本会跳过已存在的英文文件
- `--concurrency=N`: 设置并发翻译数量（默认: 5）
  - 增加并发数可以加快翻译速度，但会消耗更多 API 配额
  - 建议根据 API 速率限制合理设置

## 功能特性

- ✅ **多路径支持**：支持同时处理多个文件或文件夹
- ✅ **智能去重**：自动去除重复指定的文件
- ✅ **并发翻译**：可配置并发数量，提高翻译效率
- ✅ **自动检测**：自动检测中文路径（必须包含 `/zh/` 目录）
- ✅ **路径映射**：自动生成对应的英文路径（将 `zh` 替换为 `en`）
- ✅ **智能跳过**：默认跳过已存在的英文文件
- ✅ **强制覆盖**：支持强制覆盖模式（`--force` 参数）
- ✅ **自动创建**：自动创建目标目录
- ✅ **专业翻译**：使用专业的翻译提示词保证质量
- ✅ **格式保持**：保持代码块和格式不变
- ✅ **错误处理**：显示详细的翻译结果统计

## 注意事项

- 源文件路径必须包含 `/zh/` 目录
- 支持同时指定多个文件和文件夹路径
- 重复指定的文件会自动去重
- 默认情况下，如果目标英文文件已存在，脚本会跳过翻译
- 使用 `--force` 参数可以强制覆盖已存在的文件
- 只支持 Markdown (`.md`) 文件
- 需要有效的 ZenMux API Key
- 并发数量越高翻译越快，但会消耗更多 API 配额，请根据实际情况调整

## 使用建议

1. **首次翻译整个文档库**：使用高并发模式
   ```bash
   pnpm run translate docs_source/zh/ --concurrency=10
   ```

2. **更新少量文档**：指定具体文件路径
   ```bash
   pnpm run translate docs_source/zh/guide/quickstart.md docs_source/zh/api/intro.md
   ```

3. **批量更新多个模块**：同时指定多个文件夹
   ```bash
   pnpm run translate docs_source/zh/guide/ docs_source/zh/api/ --force
   ```

4. **开发调试**：使用较低并发数避免超出速率限制
   ```bash
   pnpm run translate docs_source/zh/test.md --concurrency=1
   ```
