---
head:
  - - meta
    - name: description
      content: Pay As You Go 按量付费
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, pay, you, OpenAI, API
---

# Pay As You Go 按量付费

欢迎使用 **ZenMux Pay As You Go（按量付费）** 方案！本指南将帮助你了解按量付费的核心优势，以及如何充值、管理余额和创建生产级 API Key。

::: tip 💡 生产环境的最佳选择
Pay As You Go 是专为生产环境打造的按量计费方案，提供**无 Rate Limit 限制**、**无并发限制**、**生产级稳定性保障**和**精准透明计费**。
:::

## 什么是 Pay As You Go？

**Pay As You Go（按量付费）** 是 ZenMux 为企业客户和生产环境量身打造的计费方案。与订阅制不同，按量付费采用**预充值 + 按实际消耗扣费**的模式，让你只为实际使用的 API 调用付费。

### 核心特性

| 特性              | 说明                                |
| ----------------- | ----------------------------------- |
| **无 Rate Limit** | 无每分钟请求数限制，支持高并发调用  |
| **生产级稳定**    | 提供 SLA 保障和 AI 保险赔付机制     |
| **精准计费**      | 按 Token 级别精确计费，成本透明可控 |
| **企业级服务**    | 完整的调用日志、成本统计和账单统计  |

## 为什么选择 Pay As You Go？

### 适用场景

Pay As You Go 方案特别适合以下场景：

- **已上线的商业化 AI 产品** —— 无并发限制，稳定可靠
- **面向终端用户的 AI 服务** —— 生产级稳定性保障
- **AI 智能体业务系统** —— 按实际消耗精准计费
- **企业级应用集成** —— 成本可预测，账单可审计

### 与订阅制的区别

| 对比维度       | Pay As You Go（按量付费） | Builder Plan（订阅制） |
| -------------- | ------------------------- | ---------------------- |
| **适用场景**   | 生产环境、商业化产品      | 个人开发、学习探索     |
| **Rate Limit** | ✅ 无限制                 | ⚠️ 10-15 RPM           |
| **并发限制**   | ✅ 无限制                 | ⚠️ 有 Weekly Limit     |
| **稳定性保障** | ✅ 生产级                 | 标准                   |
| **成本结构**   | 按实际消耗精准计费        | 固定月费               |
| **使用限制**   | 无特殊限制                | ❌ 禁止生产环境使用    |

::: warning ⚠️ 重要提示
如果你的项目已经上线或即将商业化，**必须使用 Pay As You Go 方案**。订阅制（Builder Plan）仅限个人开发和学习场景(Vibe Coding场景和Media Create场景)，禁止用于生产环境，违规使用将导致账号受影响。
:::

## 如何使用 Pay As You Go？

### 第一步：登录控制台

访问 **[ZenMux 控制台](https://zenmux.ai/platform/pay-as-you-go)**，导航到 **Manage > Pay As You Go** 页面。

![Pay As You Go 页面](https://cdn.marmot-cloud.com/storage/zenmux/2026/01/19/rsGoojf/pay-as-you-go.png)

### 第二步：查看账户余额

在页面顶部，你可以看到三种余额类型：

- **Total Balance（总余额）**：你当前可用的总额度
- **Top-Up Credits（充值额度）**：你充值获得的额度
- **Bonus & Compensation Credits（奖励与补偿额度）**：充值赠送、推荐奖励、保险赔偿等获得的额度

::: info 💡 余额说明
所有额度以美元计价（$），1 额度 = 1 美元等值的 API 调用量。消耗时优先使用奖励额度，然后使用充值额度。
:::

### 第三步：充值账户

#### 手动充值

1. 点击页面右上角的 **「Top Up」** 按钮
2. 选择充值金额（$5 - $25,000，支持自定义金额）
3. 完成支付（支持 Stripe、支付宝等多种支付方式）
4. 充值成功后，额度会立即到账，并自动赠送额外额度

::: tip 💡 充值优惠

- **0% 手续费**：ZenMux 当前免收充值手续费
- **充值赠送**：每次充值均可获得额外赠送额度，具体比例以页面显示为准
  :::

## 创建和管理 API Key

Pay As You Go 的 API Key 与订阅制完全独立，专为生产环境设计。在 **Pay As You Go API Keys** 区域，点击 **「+ Create API Key」** 按钮即可创建新的 API Key，创建后也可随时点击 **编辑** 按钮修改配置。

![创建 API Key](https://cdn.marmot-cloud.com/storage/zenmux/2026/04/22/DHfAbVz/20260422174504.jpg)

### API Key 配置项

| 配置项         | 说明                                                       |
| -------------- | ---------------------------------------------------------- |
| **Name**       | API Key 名称，建议使用清晰易识别的描述性名称               |
| **Tags**       | 标签，用于分类和管理 Key（例如：`production`、`frontend`） |
| **Key Status** | 启用/禁用开关。禁用后该 Key 的所有请求将被拒绝             |

::: tip 💡 API Key 使用提示

- 为不同的项目或环境创建独立的 API Key，方便成本归因和管理
- 定期检查 **Last Used** 和 **Used** 列，识别不活跃或高消耗的 Key
- 如果发现 API Key 泄露，请立即禁用或删除该 Key
  :::

### Limits 限制配置

开启 **Enable Limits** 开关后，可以为单个 API Key 设置独立的速率和额度限制，实现精细化的成本与访问控制：

![Edit Key](https://cdn.marmot-cloud.com/storage/zenmux/2026/04/22/dWTyjcQ/20260422172958.jpg)

| 配置项                   | 说明                                                                           |
| ------------------------ | ------------------------------------------------------------------------------ |
| **Credit Limit**         | 该 Key 的最大可用额度。达到上限后请求将被拒绝，适合控制单个项目或客户的预算    |
| **Credit Threshold (%)** | 额度阈值百分比。当消耗达到 Credit Limit 的该比例时触发邮件提醒，方便提前预警   |
| **RPM Limit**            | 每分钟请求数限制，用于防止突发流量或滥用                                       |
| **TPM Limit**            | 每分钟 Token 数限制，用于控制大模型调用的 Token 消耗速率                       |
| **Supported Models**     | 限制该 Key 可调用的模型范围。默认为 All models（无限制），可选择仅允许特定模型 |

::: warning ⚠️ 注意
禁用 API Key 会立即停止所有使用该 Key 的请求，生产环境请谨慎操作。状态变更可能需要最多 3 分钟生效。
:::

### 使用 Pay As You Go API Key 调用

创建 API Key 后，你可以在代码中使用该 Key 调用 ZenMux API。使用方式与快速开始指南中的方法完全相同，只需替换为你的 Pay As You Go API Key：

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<你的 PAY_AS_YOU_GO_API_KEY>",  # [!code highlight]
)

completion = client.chat.completions.create(
    model="openai/gpt-5",
    messages=[
        {
            "role": "user",
            "content": "生命的意义是什么？"
        }
    ]
)

print(completion.choices[0].message.content)
```

```ts [TypeScript]
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: "<你的 PAY_AS_YOU_GO_API_KEY>", // [!code highlight]
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-5",
    messages: [
      {
        role: "user",
        content: "生命的意义是什么？",
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

:::

::: info 📚 更多使用方式
完整的 API 调用方式请参考 [快速开始指南](/zh/guide/quickstart)。
:::

## 余额管理和账单查询

### 查看余额明细

点击 **Total Balance** 旁边的信息图标，可以查看 **Credits Breakdown（额度明细）**：

![额度明细](https://cdn.marmot-cloud.com/storage/zenmux/2026/04/22/4BSAkMo/20260422174540.jpg)

额度明细包括：

- **Top-ups（充值）**：你的充值记录
- **Bonuses（奖励）**：充值赠送的额外额度
- **Gifts（赠送）**：平台赠送的额度
- **Referrals（推荐）**：推荐好友获得的奖励
- **Compensations（赔偿）**：AI 保险赔偿的额度
- **Adjustments（调整）**：平台手动调整的额度
- **Expired（已过期）**：已过期的奖励额度
- **Usage（用量）**：API 调用消耗的额度
- **Total Balance（总余额）**：当前可用总额度

### 余额提醒（Low Balance Alert）

你可以设置余额提醒，当余额低于自定义阈值时，系统会发送邮件通知：

1. 在 **Total Balance** 卡片上，点击右上角的 **「设置余额提醒」** 链接
   ![设置余额提醒](https://cdn.marmot-cloud.com/storage/zenmux/2026/04/22/iggRJxK/20260422172846.jpg)
2. 开启 **Low Balance Alert** 开关
   ![Low Balance Alert](https://cdn.marmot-cloud.com/storage/zenmux/2026/04/22/Gpzqp0H/20260422172931.jpg)
3. 设置自定义阈值金额（默认为 $3）
4. 当余额低于设定阈值时，系统会自动向你的注册邮箱发送提醒邮件

### 查看交易历史

在 **Transaction History（交易历史）** 区域，你可以查看所有的充值、消耗和赔偿记录：

| 列名                      | 说明               |
| ------------------------- | ------------------ |
| **Date**                  | 交易日期和时间     |
| **Amount**                | 交易金额           |
| **Type / Method**         | 交易类型           |
| **Description / Invoice** | 交易描述或发票链接 |

常见的交易类型包括：

| 类型          | 说明               |
| ------------- | ------------------ |
| **Stripe**    | Stripe 渠道充值    |
| **Antom**     | Antom 渠道充值     |
| **Discount**  | 充值赠送的折扣额度 |
| **Gift**      | 平台赠送的额度     |
| **Referral**  | 推荐好友获得的奖励 |
| **Insurance** | AI 保险赔偿        |
| **Refund**    | 退款               |
| **Expire**    | 已过期的额度       |

点击 **View Invoice** 可以下载对应的充值发票，方便企业报销和账单审计。

## 常见问题

### 如何避免余额不足导致服务中断？

建议开启**余额提醒（Low Balance Alert）**功能，当余额低于自定义阈值时系统会发送邮件通知，方便你及时充值。

### Pay As You Go 和订阅制可以同时使用吗？

可以！你可以在个人开发阶段使用 **Builder Plan（订阅制）**，当项目上线或商业化时切换到 **Pay As You Go**。两个方案的 API Key 完全独立，互不影响。

### 充值后多久到账？

充值成功后，额度会**立即到账**，无需等待。同时系统会自动赠送额外额度（具体比例以页面显示为准）。

### 如何查看某个 API Key 的消耗明细？

在 **Pay As You Go API Keys** 列表中，点击对应 Key 的 **「Details」** 按钮，可以查看该 Key 的详细消耗记录和调用日志。

### 如何导出账单用于企业报销？

在 **Transaction History** 中，点击对应充值记录的 **「View Invoice」** 链接，即可下载正式的充值发票（PDF 格式），支持企业报销和财务审计。

## 下一步

现在你已经了解了 Pay As You Go 的使用方法，可以：

- 查看 [高级调用指南](/zh/guide/advanced/streaming)，了解流式输出、多模态等高级特性
- 阅读 [AI 保险文档](/zh/guide/insurance)，了解如何申请理赔
- 访问 [成本分析页面](https://zenmux.ai/platform/cost)，查看详细的成本归因和使用趋势
- 加入 [Discord 社区](http://discord.gg/vHZZzj84Bm)，与其他开发者交流

::: tip 联系我们
如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。
:::
