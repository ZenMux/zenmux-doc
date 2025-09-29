# ZenMux-Benchmark Leaderboard

## About ZenMux-Benchmark

ZenMux-Benchmark is a dynamic AI model evaluation leaderboard maintained by the ZenMux team, dedicated to providing comprehensive, objective, and timely performance assessments of AI models. We regularly conduct systematic evaluations of all AI models across every provider channel available on the ZenMux platform to ensure users have access to the latest and most accurate performance data.

### Benchmark Highlights

**Full cross-channel coverage**: We test every available provider channel for each model independently. For example, if the GPT-4 model is available via both OpenAI and Azure, we evaluate each channel separately to reflect differences in performance, stability, and other factors across providers.

**Fully open-source and transparent**: All test code, procedures, and results are publicly available on GitHub. Anyone can review, verify, and reproduce our findings. Project repository: [https://github.com/ZenMux/zenmux-benchmark](https://github.com/ZenMux/zenmux-benchmark)

### Dataset and Methodology

We use Scale AI’s publicly released dataset, **Humanity's Last Exam (Text Only)**, as our primary evaluation benchmark. This dataset spans a broad range of knowledge domains and reasoning capabilities and is widely recognized in the industry as a high-quality AI evaluation standard.

For detailed information about the dataset, see: [https://scale.com/leaderboard/humanitys_last_exam_text_only](https://scale.com/leaderboard/humanitys_last_exam_text_only)

### Evaluation Methodology

We run full-scale testing for each model to deliver the most comprehensive performance assessment. However, due to content filtering policies and other technical constraints from certain vendors, some models may be unable to complete all questions.

To address this fairly, we apply the following scoring approach:

- **Scoring**: Use the number of questions the model successfully responded to as the total when computing scores.
- **Cost normalization**: Adjust cost proportionally based on the actual completion rate to ensure fairness in cost-effectiveness comparisons.
- **Transparency**: Detailed success rates and completion status for each model can be found in the raw test data for the corresponding provider source in each benchmark release.

### Our Goal

ZenMux-Benchmark aims to build a **dynamically updated real-time leaderboard** that enables the industry to track the latest performance of AI models. We will continue to refine our methodology, expand evaluation dimensions, and provide users with more comprehensive guidance for model selection.

### Feedback and Suggestions

We welcome community feedback and suggestions! If you have ideas about the evaluation methodology, result analysis, or leaderboard features, please open an issue on GitHub: [https://github.com/ZenMux/zenmux-benchmark/issues](https://github.com/ZenMux/zenmux-benchmark/issues)

Thank you for your interest in and support of ZenMux-Benchmark!