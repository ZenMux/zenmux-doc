---
head:
  - - meta
    - name: description
      content: Immersive Translate Integration Guide
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, immersive, translate, OpenAI, API
---

# Immersive Translate Integration Guide

Immersive Translate is a high-quality bilingual side-by-side translation extension that supports web pages, PDF, EPUB, and more. By configuring ZenMux, you can leverage our aggregated, high-quality translation models to enhance your translation experience.

## Configuration Steps

### 1. Obtain a ZenMux API Key

Go to the [ZenMux Console](https://zenmux.ai/console) to register an account and get your API Key.

::: tip Quick Start
Configuration takes just a few minutes—start experiencing high-quality, multi-model translation right away.
:::

### 2. Install Immersive Translate

1. Search for "Immersive Translate" in your browser’s extension store
2. Install and enable the extension
3. Open the extension’s settings page

### 3. Configure the OpenAI Service

In the Immersive Translate settings:

1. Select Translation Service: choose "OpenAI"
2. Fill in the configuration:

| Setting             | Value                                                   |
| ------------------- | ------------------------------------------------------- |
| API Key             | Your ZenMux API Key                                     |
| Custom API Base URL | `https://zenmux.ai/api/v1`                              |
| Model               | `anthropic/claude-3-5-sonnet-20241022` or another supported model |