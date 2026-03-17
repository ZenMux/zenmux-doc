# Question Contribution Guide

Thank you for contributing to the ZenMux quiz question bank! This document explains how to properly add new questions.

## Question Bank File

Questions are stored in the `questions.json` file in the same directory.

## Question Types

| Type Value | Description | Number of Options |
|------------|-------------|-------------------|
| `single-choice` | Single-choice question (pick 1 of 4) | 4 options (A/B/C/D) |
| `true-false` | True/False question | 2 options (A: True / B: False) |

## Field Reference

```jsonc
{
  "id": "q004",              // Required: unique ID, increment from the current maximum ID by 1
  "type": "single-choice",  // Required: "single-choice" or "true-false"
  "category": "pricing",    // Required: see category list below
  "difficulty": "medium",   // Required: "easy" | "medium" | "hard"
  "question": "Full question text",    // Required: complete question description
  "options": [              // Required: list of options
    { "id": "A", "text": "Option A text" },
    { "id": "B", "text": "Option B text" },
    { "id": "C", "text": "Option C text" },  // Single-choice requires 4 options
    { "id": "D", "text": "Option D text" }
  ],
  "answer": "A",            // Required: option ID of the correct answer
  "explanation": "Explanation...", // Required: explain why this answer is correct
  "tags": ["tag1", "tag2"], // Optional: keyword tags
  "contributor": "your-github-username", // Optional: contributor
  "references": ["https://..."]          // Optional: relevant documentation links
}
```

## Categories (category)

Choose from the categories below. If you need a new category, explain it in the PR description:

| Value | Description |
|-------|-------------|
| `claude-code` | Claude Code related (usage, behavior, token consumption, etc.) |
| `zenmux-basics` | ZenMux basics (API Key, routing, model list, etc.) |
| `pricing` | Billing related (Flows, Pay-as-you-go, subscription, etc.) |
| `api-usage` | API usage (parameters, protocols, advanced features, etc.) |
| `observability` | Observability (logs, usage, cost, etc.) |

## Difficulty Guidelines

- **easy**: Basic concepts and definitions; users can find the answer directly in the documentation
- **medium**: Requires understanding of product logic or comparative analysis
- **hard**: Involves edge cases, in-depth principles, or complex calculations

## Contributing Steps

1. Fork this repository
2. Append new questions to the end of the `questions` array in `questions.json`
3. Ensure `id` is unique (increment from the current maximum by 1, e.g., `q004`)
4. Ensure the JSON is valid (you can verify with `jq . questions.json`)
5. Submit a PR with the title format: `quiz: add [category] question [brief description]`

## Notes

- Questions should be clear and unambiguous
- Distractors (incorrect options) should be plausible and not obviously wrong
- The `explanation` should explain **why the correct answer is right**, not merely repeat the answer
- If you reference external materials, include the links in `references`
- Do not modify the `id` of existing questions, as this may break downstream systems that reference those IDs
