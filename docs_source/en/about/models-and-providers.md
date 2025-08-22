# Models & Providers

ZenMux adopts a multi-model, multi-provider redundancy architecture to ensure high availability and stability of large language model services. We integrate industry-leading large language models to provide developers with rich choices and flexible usage experiences.

## Model List

::: tip Quick View
You can view all supported models and their basic information on the **Models** interface of the official website. Use the filter conditions on the left, the search box at the top, and sorting options to quickly locate the desired model.
:::

![Model List Page](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/iAG4cry/models-page.png)

## Multi-Provider Architecture

### Redundancy Protection

Most large language models are configured with multiple provider access. When a provider experiences service exceptions, ZenMux automatically switches to other available providers to ensure service continuity.

For detailed provider routing strategies, please refer to the [Provider Routing Documentation](https://docs.zenmux.ai/zh/about/provider-routing.html)

### Provider Details

Taking the `anthropic/claude-sonnet-4` model as an example, click on the model card to view detailed information:

**Supported Providers:**

- **Anthropic** - Official original interface
- **Vertex AI** - Google Cloud managed service
- **Amazon Bedrock** - AWS managed service

![Model Details Page](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/vrmIq6I/model-details.png)

## Provider Comparison Information

On the model details page, you can compare detailed information from various providers, including performance metrics, pricing, availability, and other aspects.

### Performance Metrics Description

| Metric | Description |
| --- | --- |
| **Time to First Token** | Time from request to returning the first token |
| **Throughput** | Number of tokens processed per minute |
| **Availability** | Real-time service status and stability |