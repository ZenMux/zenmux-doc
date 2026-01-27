---
head:
  - - meta
    - name: description
      content: Introduction
  - - meta
    - name: keywords
      content: Zenmux, about, intro, OpenAI, Anthropic, Claude, API
---

# Introduction

## ZenMux Overview

ZenMux is the world’s first enterprise-grade large model aggregation platform with an insurance payout mechanism. The platform provides one-stop access to the latest models across providers. When issues such as poor output quality or excessive latency occur during use, our intelligent insurance detection and payout mechanism automatically compensates, addressing enterprise concerns around AI hallucinations and unstable quality.

Our core philosophy is developer friendliness. Beyond a unified API interface for accessing mainstream LLMs from OpenAI, Anthropic, Google, DeepSeek, and others, we continuously refine features for API call log analysis, Cost, Usage, and Performance to offer comprehensive observability for developers.

Core advantages of the platform:

- Native dual-protocol support: Fully compatible with both OpenAI and Anthropic protocol standards; seamlessly integrates with mainstream tools like Claude Code
- Transparent quality assurance: Routine “degradation checks” (HLE tests) across all channels and models, with processes and results open-sourced on GitHub (each run costs approximately $4,000)
- Intelligent routing with insurance: Automatically selects the optimal model and provides insurance-backed quality guarantees
- Enterprise-grade services: High capacity reserves, automatic failover, and global edge acceleration

::: tip 💡 Top-up Boost
We currently boost your top-up by 20% with extra Credits. Recharging is supported via Stripe credit cards and Alipay. We welcome you to try it out and share feedback.
:::

### Product Name Meaning

ZenMux is a portmanteau of Zen and Mux (Multiplexer):

::: tip Meaning of Zen
Reflects the product’s core philosophy: simplifying complex, multi-model selection, risk management, and API invocation into a minimalist experience of “one API, one SDK, one platform” through intelligent automation. It also provides an insurance backstop to alleviate concerns about hallucinations and other issues when using AI.
:::

::: tip Meaning of Mux (Multiplexer)
Represents the product’s core capability: aggregating multiple AI model providers (OpenAI, Anthropic, Google, DeepSeek, etc.) and using intelligent routing to pick the model best suited to the current task from many choices.
:::

::: tip Product Philosophy
With a Zen mindset, harness the power of AI — unify countless models into one; achieve optimal outcomes through ultimate simplicity.
:::

## Key Features

### LLM Aggregation Platform

ZenMux aggregates leading closed- and open-source large language models, providing developers with a unified platform for convenient model invocation.

::: tip One-Stop Integration Experience
Simply create a single API key and use a unified API standard to invoke models from different providers. No need to register on multiple platforms, manage multiple keys, or recharge multiple wallets.
:::

Main advantages:

- Unified identity management: One API key controls access to all providers
- Unified billing: Transparent usage and cost tracking with centralized account management
- Rich model selection: Access the latest models from major providers including OpenAI, Anthropic, Google, DeepSeek, and more

### Dual-Protocol Support

ZenMux offers unique, industry-first dual-protocol support so developers can integrate AI models in the most familiar way.

::: tip Flexible Protocol Choices
- OpenAI-compatible protocol: Invoke all models on the platform via the OpenAI standard API
- Anthropic-compatible protocol: Invoke all models on the platform via the Anthropic standard API, seamlessly integrating with tools like Claude Code
:::

This means you can choose the API protocol that best fits your project and team preferences without worrying about differences across model providers.

### High Capacity and High Availability

We maintain ample capacity for every LLM to ensure your business is unaffected by provider capacity constraints.

::: tip Enterprise-Grade Service Guarantees
- High capacity reserves: Nearly all models have Tier 5 capacity quotas
- Multi-provider support: Critical models are backed by multiple providers
- Automatic failover: When one provider reaches capacity, the system automatically switches to others to prevent service interruptions
:::

Through multi-layered capacity reserves and intelligent failover, ZenMux guarantees high availability for your AI applications.

### Platform-Wide “Degradation Checks”

ZenMux is the first platform in the industry to conduct open, continuous quality assessments across all model channels.

::: tip Transparent Quality Assurance
We regularly conduct Human Last Exam (HLE) tests for all models across all channels on the platform, with the testing process and results open-sourced on GitHub.
:::

Core mechanisms:

- Routine quality checks: Continuous monitoring of truthfulness and reliability across all model channels
- Open-source transparency: Complete testing processes and results are publicly available on GitHub for community oversight
- Real-time leaderboard: Test results are published on the official site to form a dynamic HLE leaderboard
- Quality traceability: Ensures that all channels and models on the platform are authentic and reliable, eliminating degraded models

This mechanism provides trustworthy quality assurance so you can select models with confidence.

### AI Model Insurance Service

ZenMux is the world’s first platform offering an AI model insurance service, providing a safety net for model output quality.

::: tip Innovative Insurance Mechanism
We underwrite scenarios such as poor performance, hallucinations, and excessive latency during LLM usage. Through daily automated detection and payouts, we provide a quality backstop for your AI applications.
:::

Insurance features:

- Comprehensive coverage: Includes subpar performance, hallucinated outputs, and high response latency
- Automated detection and payouts: Insurance checks run daily on platform call data, with payouts credited the next day
- Data flywheel value: Data identified by the insurance algorithms are high-quality bad cases that can directly improve your AI product
- Continuous improvement: Build a product data flywheel from insurance payout data to continually enhance AI performance

This innovative service not only protects your costs but also helps you accumulate valuable optimization data.

### Intelligent Model Routing

If you want the optimal balance between model quality and usage cost, ZenMux’s intelligent routing is the ideal choice.

::: tip Automated Best-Choice Selection
The system analyzes the request content and task characteristics to automatically choose the most suitable model, ensuring strong results while minimizing costs.
:::

Advantages of intelligent routing:

- Balance of quality and cost: Automatically optimizes between high-performance and cost-effective models
- Task-aware selection: Deep analysis of requests to match the best-fitting model capabilities
- Continuous learning: Routing strategies improve over time based on historical data
- Transparent and controllable: Detailed routing decision logs with support for custom routing rules

With intelligent routing, you can enjoy a “cheap yet effective” experience without manually selecting models.

### Developer-Friendly Observability

ZenMux is built for developers, offering comprehensive observability and debugging capabilities.

::: tip Holistic Data Insights
Gain deep, multi-dimensional visibility into model usage, helping you quickly pinpoint issues, optimize costs, and improve outcomes.
:::

Core features:

- Detailed log analysis: Complete records of request and response details for every API call
- Aggregated cost analytics: Analyze cost distribution by project, model, time, and more
- Usage analytics: Real-time monitoring of token consumption and call frequency
- Performance analytics: Track response time, concurrency, and other key performance indicators
- Model quality comparison: Compare output quality across different models
- Visual dashboards: Intuitive charts and reports to quickly grasp the big picture

This robust observability framework lets you fully control your AI application’s runtime state and promptly identify and resolve issues.

### Global Edge Nodes

Leveraging Cloudflare’s powerful infrastructure, ZenMux deploys distributed edge computing nodes worldwide.

::: tip Global Acceleration Network
Wherever your users are, they can invoke models from the nearest edge node, enjoying low-latency and high-performance service.
:::

Technical advantages:

- Global coverage: Edge nodes deployed across continents
- Intelligent routing: Automatically routes requests to the nearest node
- Low-latency assurance: Significantly reduces network transmission delays and improves response speed
- Highly available architecture: Multi-node redundancy ensures service stability

With global edge deployment, ZenMux provides a solid infrastructure foundation for your worldwide AI applications.

## Contact Us

If you encounter any issues while using the platform or have suggestions and feedback, please reach out via:

- Official website: <https://zenmux.ai>
- Technical support email: [support@zenmux.ai](mailto:support@zenmux.ai)
- Business cooperation email: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- Twitter: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- Discord community: <http://discord.gg/vHZZzj84Bm>

For more contact methods and details, please visit our [Contact Us page](/help/contact).
