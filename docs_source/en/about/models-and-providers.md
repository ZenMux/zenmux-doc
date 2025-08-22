# Models and Providers

ZenMux adopts a multi-model, multi-provider redundancy architecture to ensure high availability and stability of large language model services. We integrate industry-leading large language models to provide developers with rich choices and flexible usage experiences.

## Model List

::: tip Quick View
You can view all supported models and their basic information in the **Models** interface of the console
:::

The console models page displays the following key information:
- Model names and versions
- Number of supported providers
- Performance metrics overview
- Real-time availability status

![Models List Page](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/iAG4cry/models-page.png)

## Multi-Provider Architecture

### Redundancy Protection

Each large language model is configured with multiple provider integrations. When a provider experiences service issues, ZenMux automatically switches to other available providers to ensure service continuity.

### Provider Details

Using the `anthropic/claude-sonnet-4` model as an example, click on the model card to view detailed information:

**Supported Providers:**
- **Anthropic** - Official original interface
- **Vertex AI** - Google Cloud managed service
- **Amazon Bedrock** - AWS managed service

![Model Details Page](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/vrmIq6I/model-details.png)

## Provider Comparison Information

::: warning Note Differences
Different providers for the same model may have variations in configuration, performance, and service quality, which can affect actual usage experience
:::

You can compare detailed information of each provider on the model details page:

### Basic Parameters
- **Context Window**: Maximum supported token length
- **Feature Support**: Tool calling, multimodal capabilities, etc.
- **API Compatibility**: OpenAI format compatibility level

### Performance Metrics
| Metric | Description |
|--------|-------------|
| **Time to First Token** | Time from request to returning the first token |
| **Throughput** | Number of tokens processed per minute |
| **Availability** | Real-time service status and stability |

### Price Comparison
- **Input Token** costs
- **Output Token** costs
- **Special Features** additional charges (such as image understanding, tool calling, etc.)

::: details View Pricing Details
For complete pricing information, please refer to the [Pricing Page](https://zenmux.ai/pricing)
:::

## Intelligent Routing Mechanism

### Automatic Optimal Provider Selection

ZenMux automatically selects the most suitable provider based on the following factors:

1. **Real-time Performance**: Latency and throughput metrics
2. **Service Status**: Provider availability
3. **Load Balancing**: Distribute request pressure
4. **Cost Optimization**: Choose the most cost-effective option while meeting performance requirements

### Transparent Experience

Developers don't need to worry about the underlying provider selection logic, just specify the model name:

::: code-group

```python [Python]
response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4",  # [!code highlight]
    messages=[{"role": "user", "content": "Hello!"}]
)
```

```curl [cURL]
curl https://zenmux.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

:::

::: info Advanced Configuration
If you need to specify a particular provider or customize routing strategies, please refer to the [Provider Routing](./provider-routing.md) documentation
:::