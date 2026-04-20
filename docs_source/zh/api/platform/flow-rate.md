---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: 获取 Flow 汇率
  - - meta
    - name: keywords
      content: Zenmux, API, flow rate, 汇率, management
---

# Get Flow Rate

::: tip 💡 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```
GET https://zenmux.ai/api/v1/management/flow_rate
```

获取当前账号的 Flow 汇率信息，包括平台基准汇率和账号实际有效汇率。

::: tip 💡 什么是 Flow？
Flow 是 ZenMux 的统一计量单位，用于衡量 AI 推理请求的资源消耗。1 Flow ≈ 某一参考模型处理一次标准请求的成本。详见 [定价说明](https://zenmux.ai/pricing/subscription)。
:::

## 鉴权

### Authorization Header <font color="red">必选</font>

```http
Authorization: Bearer <ZENMUX_MANAGEMENT_API_KEY>
```

- **参数名**：`Authorization`
- **格式**：`Bearer <API_KEY>`
- **说明**：Management API Key，在 [ZenMux 控制台](https://zenmux.ai/platform/management) 创建

::: warning ⚠️ 仅支持 Management API Key
本接口仅接受 Management API Key 鉴权，不支持普通 API Key。
:::

## 限流

每个接口独立计数，每分钟最大请求数由平台统一配置。超出限制时返回 `422` 错误。

## 返回值

### data.currency `string`

货币单位，固定为 `"usd"`。

### data.base_usd_per_flow `number`

平台基准汇率，即当前套餐在无任何个人调整时，每 1 Flow 对应的美元成本。

### data.effective_usd_per_flow `number`

账号实际有效汇率，即本账号当前每 1 Flow 对应的实际美元成本。

- 正常情况下与 `base_usd_per_flow` 相同
- 当账号存在用量异常时可能高于基准汇率

::: api-request GET /api/v1/management/flow_rate

```cURL
curl https://zenmux.ai/api/v1/management/flow_rate \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY"
```

```python
import requests

response = requests.get(
    "https://zenmux.ai/api/v1/management/flow_rate",
    headers={"Authorization": f"Bearer {ZENMUX_MANAGEMENT_API_KEY}"}
)
print(response.json())
```

```javascript
const response = await fetch("https://zenmux.ai/api/v1/management/flow_rate", {
  headers: { Authorization: `Bearer ${ZENMUX_MANAGEMENT_API_KEY}` },
});
const data = await response.json();
```

:::

::: api-response

```json
{
  "success": true,
  "data": {
    "currency": "usd",
    "base_usd_per_flow": 0.03283,
    "effective_usd_per_flow": 0.03283
  }
}
```

:::
