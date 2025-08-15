---
pageClass: api-page
description: Returns metadata about a specific generation request
headers:
  - Authorization: 
    - type: string
    - required: true
    - description: Bearer authentication of the form Bearer <token>, where token is your auth token.
aside: false
---
<script setup>
  import { computePosition, autoUpdate } from '@floating-ui/dom';

  setTimeout(() => {
    const docDOM = document.querySelector('.http-method.get');
    const floatDOM = document.querySelector('.http-method-show');
    let hasStart = false;

    function updatePosition() {
      const minY = 64;
      const rect = docDOM.getBoundingClientRect();
      const y = Math.max(rect.top, minY);
      floatDOM.style.top = y + 'px';

      if(!hasStart) {
        hasStart = true;
        autoUpdate(docDOM, floatDOM, updatePosition);
      }
      
    }
    document.querySelectorAll('.vp-doc > div > .vp-adaptive-theme').forEach(node => {
      floatDOM.appendChild(node);
    });
    updatePosition();
    console.info('--->', floatDOM, docDOM);
  });
</script>

# Get a generation

<span class="http-method get">GET</span> https://openrouter.ai/api/v1/generation

这是一个描述

## Headers

### Authorization <span>string</span> <span>Required</span>

Bearer authentication of the form Bearer `<token>`, where token is your auth token.

## Parameters

### Authorization <span>string</span> <span>Required</span>

Bearer authentication of the form Bearer `<token>`, where token is your auth token.

## Parameters

### Authorization <span>string</span> <span>Required</span>

Bearer authentication of the form Bearer `<token>`, where token is your auth token.

## Parameters

### Authorization <span>string</span> <span>Required</span>

Bearer authentication of the form Bearer `<token>`, where token is your auth token.

## Parameters

### Authorization <span>string</span> <span>Required</span>

Bearer authentication of the form Bearer `<token>`, where token is your auth token.

<div class="http-method-show"></div>

::: api-request GET xxx

```js
console.info('')
console.info('')
console.info('')
console.info('')
console.info('')
console.info('')
console.info('')
console.info('')console.info('')console.info('')console.info('')console.info('')console.info('')console.info('')console.info('')
console.info('')
console.info('')
console.info('')console.info('')
console.info('')
console.info('')
console.info('')console.info('')
console.info('')
console.info('')
console.info('')console.info('')
console.info('')
console.info('')
console.info('')
```

```typescript
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
console.info('typescript')
```


```json
{
  "data": {
    "id": "string",
    "total_cost": 1.1,
    "created_at": "string",
    "model": "string",
    "origin": "string",
    "usage": 1.1,
    "is_byok": true,
    "upstream_id": "string",
    "cache_discount": 1.1,
    "upstream_inference_cost": 1.1,
    "app_id": 1,
    "streamed": true,
    "cancelled": true,
    "provider_name": "string",
    "latency": 1,
    "moderation_latency": 1,
    "generation_time": 1,
    "finish_reason": "string",
    "native_finish_reason": "string",
    "tokens_prompt": 1,
    "tokens_completion": 1,
    "native_tokens_prompt": 1,
    "native_tokens_completion": 1,
    "native_tokens_reasoning": 1,
    "num_media_prompt": 1,
    "num_media_completion": 1,
    "num_search_results": 1
  }
}
```

:::

<style>
  .http-method-show {
    position: fixed;
    top: 0px;
    right: 20px;

    & > .vp-adaptive-theme:first-child pre {
      max-height: calc(50vh - 80px);
      width: 400px;
    }

    & > .vp-adaptive-theme:last-child pre {
      max-height: calc(50vh - 80px);
      width: 400px;
    }
  }
</style>