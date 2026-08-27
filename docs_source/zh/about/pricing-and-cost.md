---
head:
  - - meta
    - name: description
      content: ZenMux 定价与费用说明
  - - meta
    - name: keywords
      content: ZenMux, 定价, 费用, 模型, 供应商, API
---

# 定价与费用

ZenMux 使用透明的计费系统，确保每次调用均被准确计量和计费。价格随模型和供应商而变化，同一模型在不同供应商处的价格也可能不同。

## 查看价格

请在[模型详情页](https://zenmux.ai/models)查看供应商维度的价格表，其中包括输入 Token、输出 Token 和特殊功能的费用。

## 计费项目

| 计费项目 | 说明 |
| :--- | :--- |
| `prompt` | 处理输入提示词的费用。 |
| `completion` | 模型生成输出的费用。 |
| `image` | 图片处理或生成的费用。 |
| `request` | 每次 API 请求的基础费用。 |
| `web_search` | 调用网络搜索的费用。 |
| `input_cache_read` | 读取缓存的费用。 |
| `input_cache_write` | 写入缓存的费用。 |
| `input_cache_write_5_min` | 写入 5 分钟缓存的费用。 |
| `input_cache_write_1_h` | 写入 1 小时缓存的费用。 |
| `internal_reasoning` | 内部推理计算的费用。 |

::: tip 计费精度
每次调用均会被准确计量。可在控制台查看按调用拆分的费用明细。
:::

## 查看费用明细

### 控制台活动页

控制台的 **Activity** 页面会显示所有 API 调用的费用、Token 用量和调用时间。点击某条记录可查看更细的费用拆分。

### API 返回的 Meta 信息

除控制台外，也可以读取 API 返回的 Meta 信息分析成本。以下字段最为关键：

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `originAmount` | string | 原始金额，计费调整前的金额。 |
| `billAmount` | string | 计费金额。 |
| `discountAmount` | string | 优惠金额。 |
| `realAmount` | string | 最终应付金额。 |
| `ratingDetails` | array | 按计费项目提供的金额与单价明细。 |

::: info 费用计算
最终应付金额的计算公式为：`realAmount = billAmount - discountAmount`。

`ratingDetails` 中的每一项都包含对应计费项目的金额与单位价格。
:::
