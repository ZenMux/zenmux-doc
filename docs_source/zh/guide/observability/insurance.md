# **保险补偿（Insurance）**

ZenMux 提供了完善的保险补偿系统，帮助您实时监控和分析因服务异常或性能问题导致的补偿情况。您可以查看各类补偿数据的汇总信息、按类型和模型分类的统计图表，以及具体的补偿明细记录，从而更好地了解服务运行状态并优化成本控制。

## **概览**

![insurance](https://cdn.marmot-cloud.com/storage/zenmux/2026/01/19/xoP7JKz/baoxianpeichang-gailan.png)

在页面顶部，展示了当前筛选条件下的关键补偿指标：

- **Total Compensation（总补偿金额）**：显示在指定时间范围内累计产生的总补偿金额。
- **Compensation Count（补偿次数）**：表示触发补偿机制的请求数量。
- **Average Per Compensation（平均补偿金额）**：每笔触发补偿的请求所对应的平均补偿金额。
- **Average Compensation / Day（日平均补偿次数）**：基于时间范围计算出的日均补偿次数。


## **各维度分析**

可通过以下标签切换，从不同维度查看补偿数据：
- **补偿金额（Credits of Compensation）**
- **补偿次数（Times of Compensation）**

![insurance](https://cdn.marmot-cloud.com/storage/zenmux/2026/01/19/nbp1NcW/baoxianpeichang-peichangjifen.png)

![insurance](https://cdn.marmot-cloud.com/storage/zenmux/2026/01/19/cf6J8Ds/baoxianpeichang-peichangcishu.png)

- **按补偿类型聚合（Aggregate by compensation type）**：此图表展示不同补偿原因的分布情况，例如“内容不达标”、“高延迟”等。通过该视图，您可以快速识别最常见的补偿类型，进而定位系统瓶颈或服务质量问题。

- **按补偿模型聚合（Aggregate by compensation model）**：此图表按使用的模型分类，展示各模型产生的补偿情况。有助于评估不同模型的服务稳定性与可靠性，便于进行资源调整或优化策略制定。

## **补偿详情（Compensation Details）**

在下方表格中，列出了所有触发补偿的具体请求记录，支持按多种维度进行筛选与查看。

可通过以下标签切换不同的补偿类别：
- **Unsatisfactory Content**：因生成内容质量不达标而触发的补偿。
- **High Latency**：因响应延迟过高而触发的补偿。

![insurance](https://cdn.marmot-cloud.com/storage/zenmux/2026/01/19/hUuEcUF/baoxianpeichang-peichangxiangqing.png)

![insurance](https://cdn.marmot-cloud.com/storage/zenmux/2026/01/19/v0c8ti2/baoxianpeichang-peichangxiangqing2.png)

### **字段说明**
| 字段 | 说明 |
|------|------|
| **Timestamp** | 请求发生的时间戳，精确到毫秒。 |
| **Model** | 所调用的模型名称（如 `anthropic/claude-3.5-sonnet`）。 |
| **Input Tokens** | 输入 token 数量，用于衡量请求复杂度。 |
| **Output Tokens** | 输出 token 数量，反映生成内容长度。 |
| **Cost** | 本次请求的实际费用（含补偿部分）。 |
| **Latency** | 请求处理耗时（单位：毫秒），高延迟可能触发补偿。 |
| **Throughput** | 每秒处理的 token 数，体现系统吞吐能力。 |
| **Finish** | 请求完成状态（如 `stop`, `length`, `error` 等）。 |
| **Payout** | 实际赔付金额（若存在补偿）。 |
| **Action** | 操作按钮，点击可查看请求详情页或原始 Meta 信息。 |

## **使用建议**

1. **定期检查补偿趋势**：结合时间范围筛选器，观察补偿是否随时间增长，判断是否存在系统性风险。
2. **关注高发补偿类型**：优先解决频繁出现的补偿原因，提升整体服务质量。
3. **对比不同模型表现**：利用“按模型聚合”视图，识别表现较差的模型并考虑替换或优化。
4. **深入分析具体案例**：点击“Details”进入请求详情页，查看原始请求参数、响应内容及日志，辅助排查问题根源。


> 💡 提示：如需进一步分析原始数据，可在“请求详情页面”中查看完整的 Meta 信息，包括 API 请求头、上下文、错误码等。

---
::: tip 联系我们
如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。
:::