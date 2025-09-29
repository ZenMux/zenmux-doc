# ZenMux-Benchmark 测评榜单

## 关于 ZenMux-Benchmark

ZenMux-Benchmark 是由 ZenMux 官方维护的动态 AI 模型测评榜单，致力于为业界提供全面、客观、实时的 AI 模型性能评估。我们定期对 ZenMux 平台上所有供应商渠道的 AI 模型进行系统性测评，确保用户能够获得最新、最准确的模型性能数据。

### 测评特色

**全渠道覆盖测评**：对于每个模型的所有可用供应商渠道，我们都进行独立测试。例如，GPT-4 模型如果同时支持 OpenAI 和 Azure 两个供应商，我们将分别对这两个渠道进行测评，以反映不同供应商在性能、稳定性等方面的差异。

**完全开源透明**：所有测试代码、测试流程和测试结果均在 GitHub 完全公开，任何人都可以查看、验证和复现我们的测评结果。项目地址：[https://github.com/ZenMux/zenmux-benchmark](https://github.com/ZenMux/zenmux-benchmark)

### 数据集与方法论

我们采用 Scale AI 公开发布的 **Humanity's Last Exam (Text Only)** 数据集作为主要测评标准。该数据集涵盖了广泛的知识领域和推理能力测试，是业界公认的高质量 AI 评估基准。

关于该数据集的详细信息，请参考：[https://scale.com/leaderboard/humanitys_last_exam_text_only](https://scale.com/leaderboard/humanitys_last_exam_text_only)

### 测评方法

我们对每个模型进行全量测试，力求获得最全面的性能评估。但由于部分模型厂商的内容过滤策略等技术限制，某些模型可能无法完成全部测试问题。

针对此类情况，我们采用以下公平的计分方式：

- **评分计算**：以该模型实际成功回复的问题数量作为总数进行评分计算
- **价格折算**：按照实际测试完成率对价格进行等比例折算，确保性价比计算的公平性
- **透明度保障**：每个模型的详细成功率和测试完成情况可参考各期 benchmark 中对应供应商来源模型的测试原始数据

### 我们的目标

ZenMux-Benchmark 致力于构建一个**动态更新的实时榜单**，让业界能够及时了解 AI 模型的最新性能表现。我们将持续改进测评方法，扩展测试维度，为用户提供更全面的模型选择参考。

### 反馈与建议

我们欢迎社区的反馈与建议！如果您对测评方法、结果分析或榜单功能有任何想法，请在我们的 GitHub Issue 区提出：[https://github.com/ZenMux/zenmux-benchmark/issues](https://github.com/ZenMux/zenmux-benchmark/issues)

感谢您对 ZenMux-Benchmark 的关注与支持！
