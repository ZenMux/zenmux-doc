# Models & Providers

ZenMux employs a multi-model, multi-provider redundancy architecture to ensure high availability and stability of large language model services. We integrate industry-leading large language models to provide developers with rich choices and flexible usage experiences.

## Model List

::: tip Quick View
All supported models and their basic information can be viewed on the **Models** page of the official website. You can quickly locate the desired models using the filter options on the left, search box at the top, and sorting options.
:::

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/iAG4cry/models-page.png" 
       alt="Model List Page" 
       style="width: 100%; max-width: 700px; border-radius: 6px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); margin: 18px 0;"
       loading="lazy" />
</div>

## Multi-Provider Architecture

### Redundancy Guarantee

Most large language models are configured with multiple provider integrations. When a provider experiences service issues, ZenMux automatically switches to other available providers to ensure service continuity.

For detailed strategies on provider routing, please refer to the [Provider Routing Documentation](https://docs.zenmux.ai/zh/about/provider-routing.html)

### Provider Details

Taking the `anthropic/claude-sonnet-4` model as an example, click on the model card to view detailed information:

**Supported Providers:**

- **Anthropic** - Official provider interface
- **Vertex AI** - Google Cloud managed service
- **Amazon Bedrock** - AWS managed service

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/vrmIq6I/model-details.png" 
       alt="Model Details Page" 
       style="width: 100%; max-width: 700px; border-radius: 6px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); margin: 18px 0;"
       loading="lazy" />
</div>

## Provider Comparison Information

The model details page allows you to compare detailed information across providers, including performance metrics, pricing, availability, and other aspects.

### Performance Metrics Description

| Metric              | Description                            |
| ------------------- | -------------------------------------- |
| **Latency (Time to First Token)** | Time from request to returning the first token |
| **Throughput**      | Number of tokens processed per minute         |
| **Uptime**         | Real-time service status and stability       |