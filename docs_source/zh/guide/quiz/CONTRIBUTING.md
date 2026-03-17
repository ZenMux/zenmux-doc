# 贡献题目指南

感谢你对 ZenMux 知识问答题库的贡献！本文档说明如何规范地新增题目。

## 题库文件

题目存储在同目录下的 `questions.json` 文件中。

## 题目类型

| 类型值 | 说明 | 选项数量 |
|--------|------|----------|
| `single-choice` | 单选题（4 选 1） | 4 项（A/B/C/D） |
| `true-false` | 判断题 | 2 项（A: 正确 / B: 错误） |

## 字段说明

```jsonc
{
  "id": "q004",              // 必填：唯一 ID，在现有最大 ID 基础上 +1
  "type": "single-choice",  // 必填："single-choice" 或 "true-false"
  "category": "pricing",    // 必填：见下方分类列表
  "difficulty": "medium",   // 必填："easy" | "medium" | "hard"
  "question": "题目正文",    // 必填：完整的问题描述
  "options": [              // 必填：选项列表
    { "id": "A", "text": "选项 A 内容" },
    { "id": "B", "text": "选项 B 内容" },
    { "id": "C", "text": "选项 C 内容" },  // 单选题需要 4 个选项
    { "id": "D", "text": "选项 D 内容" }
  ],
  "answer": "A",            // 必填：正确答案的选项 ID
  "explanation": "解析...", // 必填：说明为什么这个答案是正确的
  "tags": ["tag1", "tag2"], // 可选：关键词标签
  "contributor": "your-github-username", // 可选：贡献者
  "references": ["https://..."]          // 可选：相关文档链接
}
```

## 分类（category）

请从以下分类中选择，如有新分类需求请在 PR 描述中说明：

| 值 | 说明 |
|----|------|
| `claude-code` | Claude Code 相关（用法、行为、token 消耗等） |
| `zenmux-basics` | ZenMux 基础功能（API Key、路由、模型列表等） |
| `pricing` | 计费相关（Flows、Pay-as-you-go、订阅等） |
| `api-usage` | API 调用相关（参数、协议、高级功能等） |
| `observability` | 可观测性相关（日志、用量、成本等） |

## 难度参考

- **easy**：基础概念、定义类，用户可直接从文档中找到答案
- **medium**：需要理解产品逻辑或对比分析
- **hard**：涉及边界情况、深度原理或复杂计算

## 贡献步骤

1. Fork 本仓库
2. 在 `questions.json` 的 `questions` 数组末尾追加新题目
3. 确保 `id` 唯一（在现有最大编号上 +1，如 `q004`）
4. 确保 JSON 格式合法（可用 `jq . questions.json` 验证）
5. 提交 PR，标题格式：`quiz: 新增 [分类] 题目 [题目简述]`

## 注意事项

- 题目表述应清晰、无歧义
- 干扰项（错误选项）应合理，避免明显错误
- `explanation` 应解释**为什么正确答案是对的**，而非仅重复答案
- 如引用了外部资料，请在 `references` 中注明链接
- 请勿修改已有题目的 `id`，避免影响引用该 ID 的下游系统
