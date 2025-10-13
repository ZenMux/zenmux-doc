# ZenMux Integration Guide for Neovate

ZenMux is an AI model aggregation platform similar to OpenRouter that provides unified access to multiple AI models. This guide shows you how to integrate ZenMux with [Neovate](https://neovateai.dev).

## Configuration Methods

ZenMux offers two configuration approaches to suit different deployment scenarios:

### Method 1: Environment Variable (Recommended)

The simplest way to configure ZenMux is using the `ZENMUX_API_KEY` environment variable:

```bash
export ZENMUX_API_KEY=your_zenmux_api_key_here
```

For Windows users:
```cmd
set ZENMUX_API_KEY=your_zenmux_api_key_here
```

### Method 2: Configuration File (Legacy)

For users requiring more complex configurations or those migrating from older versions, ZenMux supports configuration files:

```json
{
  "zenmux": {
    "apiKey": "your_zenmux_api_key_here",
    "api": "https://zenmux.ai/api/v1"
  }
}
```

For more details, refer to the [Neovate Configuration Documentation](https://neovateai.dev/en/docs/providers/#custom-providers).

## Integration Steps

1. **Install Neovate Code** (if not already installed):
   ```bash
   npm install -g @neovate/code
   ```

2. **Configure ZenMux API Key**:
   ```bash
   export ZENMUX_API_KEY=your_api_key
   ```

3. **Launch Neovate**:
   ```bash
   neovate
   # or
   neo
   ```

4. **Select ZenMux Provider**:
   ```bash
   /login
   # Select ZenMux from the provider list
   ```

5. **Choose Your Model**:
   ```bash
   /model
   # Select from available ZenMux models
   ```

## Available Features

Once configured, you can leverage ZenMux's model capabilities through Neovate Code:

- **Code Generation**: Generate code snippets and complete functions
- **Bug Fixing**: Identify and resolve code issues
- **Code Review**: Get intelligent code review suggestions
- **Test Creation**: Generate comprehensive unit tests
- **Code Refactoring**: Optimize and restructure existing code

## Example Usage

```bash
# Generate error handling
"Add comprehensive error handling to the user authentication service"

# TypeScript migration
"Convert this JavaScript module to TypeScript with proper type definitions"

# Testing
"Create unit tests for the payment processing module with edge cases"

# Performance optimization
"Optimize this SQL query for better performance with large datasets"
```

## Benefits of Using ZenMux

- **Model Diversity**: Access to multiple AI models through a single interface
- **Cost Optimization**: Compare and choose models based on performance and pricing
- **High Availability**: Redundancy across multiple model providers
- **Unified API**: Consistent interface regardless of the underlying model

## Support

For ZenMux-specific issues:
- Visit [ZenMux Documentation](https://docs.zenmux.ai/)

For Neovate integration issues:
- Visit [Neovate Documentation](https://neovateai.dev)
- [Submit issues on GitHub](https://github.com/neovateai/neovate-code)