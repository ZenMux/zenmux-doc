---
head:
  - - meta
    - name: description
      content: ZenMux 与 Neovate 的集成指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, neovate, code, API
---


# ZenMux 与 Neovate 的集成指南

[Neovate Code](https://neovateai.dev) 是一个开源的 AI 驱动代码助手，支持多种 AI 模型提供者。通过将 ZenMux 集成到 Neovate Code 中，用户可以访问多个 AI 模型，提升代码生成和辅助编程的能力。

## 配置方式

ZenMux 提供两种配置方式以适应不同的部署场景：

### 方法一：环境变量（推荐）

最简单的配置方式是使用 `ZENMUX_API_KEY` 环境变量：

```bash
export ZENMUX_API_KEY=your_zenmux_api_key_here
```

Windows 用户：
```cmd
set ZENMUX_API_KEY=your_zenmux_api_key_here
```

### 方法二：配置文件（针对旧版）

对于需要更复杂配置或从旧版本迁移的用户，ZenMux 支持使用配置文件：

```json
{
  "zenmux": {
    "apiKey": "your_zenmux_api_key_here",
    "api": "https://zenmux.ai/api/v1"
  }
}
```

更多细节请参阅 [Neovate 配置文档](https://neovateai.dev/en/docs/providers/#custom-providers)。

## 集成步骤

1. **安装 Neovate Code**（如果尚未安装）：
   ```bash
   npm install -g @neovate/code
   ```

2. **配置 ZenMux API Key**：
   ```bash
   export ZENMUX_API_KEY=your_api_key
   ```

3. **启动 Neovate**：
   ```bash
   neovate
   # 或者
   neo
   ```

4. **选择 ZenMux 提供者**：
   ```bash
   /login
   # 在提供者列表中选择 ZenMux
   ```

5. **选择模型**：
   ```bash
   /model
   # 从可用的 ZenMux 模型中选择
   ```

## 可用功能

配置完成后，你可以通过 Neovate Code 使用 ZenMux 的模型能力：

- **代码生成**：生成代码片段和完整函数
- **修复 Bug**：识别并解决代码问题
- **代码审查**：获得智能的代码审查建议
- **测试生成**：生成全面的单元测试
- **代码重构**：优化并重构现有代码

## 使用示例

```bash
# Generate error handling
"Add comprehensive error handling to the user authentication service"

# TypeScript migration
"Convert this JavaScript module to TypeScript with proper type definitions"

# Testing
"Create unit tests for the payment processing module with edge cases"

# Performance optimization
"Optimize this SQL query for better performance with large datasets"
```

## 使用 ZenMux 的好处

- **模型多样性**：通过单一接口访问多个 AI 模型
- **成本优化**：可根据性能和价格比较并选择模型
- **高可用性**：跨多个模型提供商的冗余保障
- **统一 API**：无论底层模型如何，接口保持一致

## 支持

如果遇到 ZenMux 相关问题：
- 访问 [ZenMux 文档](https://docs.zenmux.ai/)

如果遇到 Neovate 集成问题：
- 访问 [Neovate 文档](https://neovateai.dev)
- 在 GitHub 上提交问题：[neovate-code 仓库](https://github.com/neovateai/neovate-code)