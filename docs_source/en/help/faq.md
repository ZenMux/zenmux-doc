# FAQ

## Basic Usage

### What is ZenMux?

ZenMux is an enterprise-grade AI model aggregation platform that provides unified API access to hundreds of AI models. We support mainstream models including OpenAI GPT, Claude, Gemini, Qwen, and more, allowing you to use all models through a single API interface.

### What are the advantages of ZenMux?

::: info Core Advantages

- **Unified Interface**: Access hundreds of AI models through one API
- **Intelligent Routing**: Automatically select the best model and provider
- **Failover**: Automatically switch to available service providers
- **Cost Optimization**: Dynamically choose the most cost-effective models
- **High Availability**: 99.9% service availability guarantee
- **Global Deployment**: Multi-region deployment with low-latency access
  :::

### Which AI models are supported?

We support over 200 AI models covering the following types:

- **Text Generation**: GPT-4, Claude 3, Gemini Pro, Qwen, ChatGLM, etc.
- **Image Generation**: DALL-E, Midjourney, Stable Diffusion, etc.
- **Speech Recognition**: Whisper, Azure Speech, etc.
- **Image Recognition**: GPT-4V, Claude 3 Vision, etc.

::: tip Quick Start
Check the [complete model list](/zh/models/) to learn about all supported models and their features
:::

### How do I get started?

::: details Getting Started Steps

1. Visit the [ZenMux Console](https://console.zenmux.ai) to register an account
2. Obtain an API Key
3. Check the [Quick Start Guide](/zh/guide/quickstart)
4. Start sending API requests
   :::

## Account & Billing

### How do I get an API Key?

Follow these steps to obtain your API Key:

1. Log in to the [ZenMux Console](https://console.zenmux.ai)
2. Click "API Keys" in the left menu
3. Click "Create New API Key"
4. Set a name and permissions for the API Key
5. Copy the generated API Key

::: warning Important Reminder
Please securely store your API Key, as the system will not display the complete key again
:::

### What is the billing method?

We use a transparent usage-based billing model:

| Service Type     | Billing Method              | Description                                    |
| ---------------- | --------------------------- | ---------------------------------------------- |
| **Text Models**  | Billed by token count       | Includes input and output tokens               |
| **Image Models** | Billed by generated images  | Priced by resolution and quality tiers         |
| **Speech Models** | Billed by processing time   | Billed per second, partial seconds rounded up |

::: info View Pricing
For detailed pricing information, please visit the [Pricing Page](https://zenmux.ai/pricing)
:::

### How do I top up and view bills?

**Top-up Methods:**

- Top up in the "Account Balance" page of the console
- Support for Alipay, WeChat, bank cards, and other payment methods

**Bill Viewing:**

- View detailed usage and billing in the "Usage Statistics" page
- Support filtering by time period, model type, and other dimensions

### Is there a free trial?

::: tip Free Trial Benefits
New registered users receive:

- Free trial credit of $5
- 30-day trial period
- Access to all models
  :::

## Technical Issues

### What is the API request format?

ZenMux is fully compatible with the OpenAI API format. You only need to replace the API endpoint:

::: code-group

```bash [curl]
# Original OpenAI API
curl https://api.openai.com/v1/chat/completions

# ZenMux API
curl https://api.zenmux.ai/v1/chat/completions  # [!code highlight]
```

```python [Python]
# Only need to modify base_url
from openai import OpenAI

client = OpenAI(
    base_url="https://api.zenmux.ai/v1",  # [!code highlight]
    api_key="your-zenmux-api-key"  # [!code highlight]
)
```

:::

For detailed API documentation, please see the [Basic Usage Guide](/zh/guide/basic).

### How do I set up intelligent routing?

Add the `zenmux-route` parameter in your request to enable intelligent routing:

::: code-group

```json [Cost Priority]
{
  "model": "gpt-4",
  "messages": [...],
  "zenmux-route": {
    "strategy": "cost",  // [!code highlight]
    "fallback": ["claude-3", "gemini-pro"]
  }
}
```

```json [Speed Priority]
{
  "model": "gpt-4",
  "messages": [...],
  "zenmux-route": {
    "strategy": "latency",  // [!code highlight]
    "fallback": ["gpt-3.5-turbo", "claude-instant"]
  }
}
```

:::

For detailed configuration, please refer to the [Parameter Mapping Guide](/zh/guide/parameter-mapping).

### Do you support streaming responses?

We fully support streaming responses. Simply set `stream: true`:

```json
{
  "model": "gpt-4",
  "messages": [...],
  "stream": true  // [!code highlight]
}
```

### How do I handle error responses?

ZenMux returns standard HTTP status codes with detailed error information:

| Status Code | Error Type              | Handling Suggestion                     |
| ----------- | ----------------------- | --------------------------------------- |
| `400`       | Request parameter error | Check request parameter format          |
| `401`       | Invalid API Key         | Verify if the API Key is correct        |
| `403`       | Insufficient permission or balance | Check account balance and permission settings |
| `429`       | Request rate too high   | Implement request rate control          |
| `500`       | Internal server error   | Retry later or contact technical support |

### Are there request rate limits?

Different models have corresponding rate limits:

::: info Rate Limit Information

- **GPT Models**: 60 requests per minute
- **Claude Models**: 100 requests per minute
- **Image Models**: 20 requests per minute
  :::

::: tip Increase Limits
For higher rate limits, please contact our sales team to apply for a custom plan
:::

## Security & Privacy

### How is data security ensured?

We employ multiple security measures to ensure your data security:

::: info Security Measures

- **Transmission Security**: All API requests are encrypted via HTTPS
- **Storage Security**: We do not store your request content and response data
- **Access Control**: API Keys support fine-grained permission control
- **Compliance Certification**: Certified with SOC 2 and ISO 27001
  :::

### Are request logs saved?

We strictly follow data privacy principles:

- **Metadata**: We save request metadata (time, model, token count, etc.) for billing and monitoring
- **Content Data**: We do not save specific request content (prompts, responses, etc.)
- **Retention Period**: Metadata is automatically deleted after 90 days

### Do you support private deployment?

We provide flexible enterprise-grade deployment solutions:

::: details Deployment Options

- **On-premises Deployment**: Deploy in your private cloud environment
- **Dedicated Cluster**: Create a dedicated cluster for you in public cloud
- **Hybrid Deployment**: Hybrid solutions combining public and private clouds
  :::

Please contact our sales team for custom solutions.

## Troubleshooting

### What should I do if API requests fail?

Follow these troubleshooting steps:

1. **Check API Key**: Confirm that the API Key is correct and valid
2. **Check Balance**: Confirm that the account balance is sufficient
3. **Check Parameters**: Confirm that the request parameter format is correct
4. **Review Error Codes**: Handle accordingly based on returned error codes
5. **Contact Support**: If the problem persists, please contact technical support

### What should I do if response speed is slow?

Suggestions for optimizing response speed:

::: tip Performance Optimization Suggestions

1. **Choose Appropriate Models**: Some models process faster
2. **Use Intelligent Routing**: Let the system automatically choose the fastest provider
3. **Reduce Request Content**: Overly long prompts increase processing time
4. **Check Network**: Ensure network connection is stable
   :::

### How do I contact technical support?

We provide multiple contact methods:

- **Online Customer Service**: Visit the [Contact Page](/zh/help/contact)
- **Email Support**: Send email to support@zenmux.ai
- **Technical Documentation**: Check detailed [Technical Documentation](/zh/guide/)
- **Community Support**: Join the developer community for help

---

::: tip Need More Help?
If your question is not answered on this page, please visit our [Contact Page](/zh/help/contact) for technical support. Our technical team is dedicated to serving you.
:::