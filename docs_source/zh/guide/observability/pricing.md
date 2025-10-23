# 计费透明度

ZenMux 采用透明的计费体系，确保每一笔调用都被精确计量计费。不同模型的价格存在差异，而同一模型在不同供应商下的价格也可能有所不同。

## 价格查看

您可以在模型详情页面查看各个供应商的价格信息。每个供应商都会展示详细的计费标准，包括输入 Token、输出 Token 以及特殊功能的费用。

![pricing](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/23/XzrexEi/price.png)

对于阶梯定价的模型，价格信息会根据使用量区间进行分段展示，帮助您更好地了解不同使用量下的费用情况。

![pricing-tiered](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/23/H44UrQY/tier-pricing.png)

## 计费项目说明

ZenMux 的计费项目包括以下几种类型：

| 计费项                    | 说明                   |
| :------------------------ | :--------------------- |
| `prompt`                  | 输入提示词的处理费用   |
| `completion`              | 模型生成输出内容的费用 |
| `image`                   | 图像处理或生成的费用   |
| `request`                 | API 请求调用的基础费用 |
| `web_search`              | 网络搜索功能调用费用   |
| `input_cache_read`        | 缓存读取操作费用       |
| `input_cache_write`       | 缓存写入操作费用       |
| `input_cache_write_5_min` | 5 分钟缓存写入操作费用 |
| `input_cache_write_1_h`   | 1 小时缓存写入操作费用 |
| `internal_reasoning`      | 内部推理计算费用       |

::: tip 计费精度保证
我们保证每一笔调用都被精确计量计费，您可以在[日志详情](https://zenmux.ai/settings/activity)中查看每次调用的费用明细和详细的费率分解。
:::

::: tip Cost 统计查看
如果想了解当前时间段、当天、当月的费用情况，可以在[Cost统计页面查看](https://zenmux.ai/settings/cost)中进行筛选查看。
:::
