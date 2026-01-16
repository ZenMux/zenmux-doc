# Usage Analytics

ZenMux provides comprehensive usage analytics to help you monitor and analyze API call patterns, service provider performance, and model efficiency in real time. Through usage analytics, you can gain deep insights into key metrics such as token consumption, API request volume, and response times, enabling you to optimize application performance and control costs.

> **Note**: The data displayed on this page does not include usage from subscription plans. It only reflects Pay As You Go usage.

## Usage Overview

The "Usage" tab provides an overview of your overall resource consumption, including token usage and API request counts.

### Key Metrics

| Metric | Description |
|--------|-------------|
| **Total Token Usage** | Total tokens consumed across all models (input + output). |
| **Input Token Usage** | Total tokens from the input portion of all requests. |
| **Output Token Usage** | Total tokens from the output portion of all responses. |
| **Total API Requests** | Total number of API calls within the specified time period. |

### Filters

- **Time Range**: Filter by granularity such as "Month", "Week", or "Day".
- **API Keys**: Filter data by specific API key, or select "All Keys".
- **Model Scope**: Analyze "All Models" or select a specific model category.

### Breakdown Analysis

- **Usage by Model**  
  Displays token usage distribution across models in chart or table format, helping you identify high-consumption models.

- **Usage by Token Type**  
  Breaks down usage by input and output tokens separately, allowing you to evaluate the cost structure of requests and responses.

- **Usage by API Key**  
  Shows token and request usage segmented by API key, useful for usage isolation and auditing in multi-user or multi-project scenarios.

- **Web Search Usage**  
  Displays token consumption and request counts for requests with web search enabled (if applicable), helping you assess the frequency and cost of enhanced retrieval features.

## Provider Analysis

Switch to the "Provider" tab to view performance metrics across different AI service providers.

### Key Metrics

| Metric | Description |
|--------|-------------|
| **Primary Provider** | The most frequently used AI service provider (e.g., Google Gemini, OpenAI). |
| **Provider Count** | Total number of service providers utilized. |
| **Average Success Rate** | Average success rate across all requests, reflecting service reliability. |
| **Fastest Response Provider** | The service provider with the shortest response time. |

### Breakdown Analysis

- **Token Distribution**  
  Shows the proportion of token usage across providers, helping you evaluate resource allocation efficiency.

- **Request Distribution**  
  Displays API request distribution by provider, reflecting the call load on each provider.

- **Provider Details**  
  Lists detailed metrics for each provider, including request count, success rate, average latency, and token consumption.

> **Tip**: Combine model and provider filters to analyze performance for specific configurations.

## Performance

The "Performance" tab provides API call performance metrics to help you evaluate model response efficiency and service quality.

### Key Metrics

| Metric | Description |
|--------|-------------|
| **Average Latency** | Average response latency in milliseconds. Lower values indicate faster responses. |
| **Average Throughput** | Average throughput in tokens per second, reflecting processing capacity over time. |
| **Fastest / Slowest** | Shows the fastest and slowest model response records, helping identify performance bottlenecks. |
| **Highest / Lowest Throughput** | Displays models with the highest and lowest throughput, useful for optimizing load balancing. |

### Breakdown Analysis

- **First Token Latency by Model**  
  Displays the time to first token (TTFT) for each model.  
  > **Note**: First token latency is a critical metric for user experience—lower values mean faster perceived responses.  
  - Presented in chart or list format showing latency distribution across models.  
  - Filter by model to quickly identify high-latency models.

- **Throughput by Model**  
  Displays throughput (tokens per second) for each model.  
  > **Note**: The higher the value, the better the performance.  
  - Use this to compare processing efficiency across different models.  
  - Helps you select high-throughput models to improve overall system responsiveness.
