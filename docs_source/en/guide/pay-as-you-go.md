---
head:
  - - meta
    - name: description
      content: Pay As You Go
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, pay, you, OpenAI, API
---

# Pay As You Go

Welcome to the **ZenMux Pay As You Go** plan! This guide will help you understand the key benefits of Pay As You Go, and how to top up, manage your balance, and create production-grade API keys.

::: tip 💡 Best for production
Pay As You Go is a usage-based billing plan built specifically for production. It offers **no rate limits**, **no concurrency limits**, **production-grade stability**, and **transparent, precise billing**.
:::

---

## What is Pay As You Go?

**Pay As You Go** is ZenMux’s billing plan tailored for enterprise customers and production use. Unlike subscription plans, Pay As You Go uses a **prepaid balance + pay-as-you-consume** model, so you only pay for the API usage you actually consume.

### Key features

| Feature | Description |
|------|------|
| **No Rate Limit** | No per-minute request limit; supports high-concurrency workloads |
| **Production-grade stability** | SLA coverage plus an AI insurance compensation mechanism |
| **Precise billing** | Token-level billing for transparent and controllable costs |
| **Enterprise services** | Full request logs, cost analytics, and billing statistics |

---

## Why choose Pay As You Go?

### Use cases

Pay As You Go is especially suitable for:

- **Commercial AI products already in production** — no concurrency limits, stable and reliable
- **AI services for end users** — production-grade stability guarantees
- **AI agent business systems** — precise billing based on actual consumption
- **Enterprise application integrations** — predictable costs and auditable billing

### Differences vs. subscriptions

| Dimension | Pay As You Go | Builder Plan (Subscription) |
|---------|--------------------------|----------------------|
| **Best for** | Production, commercial products | Personal development, learning & experimentation |
| **Rate Limit** | ✅ Unlimited | ⚠️ 10–15 RPM |
| **Concurrency** | ✅ Unlimited | ⚠️ Weekly Limit applies |
| **Stability** | ✅ Production-grade | Standard |
| **Cost model** | Precise usage-based billing | Fixed monthly fee |
| **Usage restrictions** | No special restrictions | ❌ Not allowed for production use |

::: warning ⚠️ Important
If your project is already live or about to be commercialized, you **must use Pay As You Go**. The subscription plan (Builder Plan) is only for personal development and learning scenarios (Vibe Coding and Media Create scenarios) and must not be used in production. Violations may impact your account.
:::

---

## How to use Pay As You Go

### Step 1: Sign in to the console

Go to the **[ZenMux Console](https://zenmux.ai/plantform/pay-as-you-go)** and navigate to **Manage > Pay As You Go**.

![Pay As You Go page](https://cdn.marmot-cloud.com/storage/zenmux/2026/01/19/rsGoojf/pay-as-you-go.png)

### Step 2: Check your balance

At the top of the page, you’ll see three balance types:

- **Total Balance**: your current total available credits
- **Top-Up Credits**: credits obtained from top-ups
- **Bonus & Compensation Credits**: credits from top-up bonuses, referral rewards, insurance compensation, etc.

::: info 💡 Balance notes
All credits are denominated in USD ($). 1 credit equals $1 worth of API usage. During consumption, bonus credits are used first, then top-up credits.
:::

### Step 3: Top up your account

#### Manual top-up

1. Click the **Top Up** button in the top-right corner
2. Choose a top-up amount (custom amounts supported)
3. Complete payment (Stripe, Alipay, and more supported)
4. After a successful top-up, credits are applied immediately and you’ll automatically receive an additional **20% bonus credits**

**Top-up bonus examples:**

| Top-up amount | Credits received | Bonus rate |
|---------|---------|---------|
| $100 | $120 | +20% |
| $500 | $600 | +20% |
| $1000 | $1200 | +20% |

#### Auto Top-Up

To avoid service impact from insufficient balance, you can enable **Auto Top-Up**:

1. Click **Auto Top-Up**
2. Set the trigger threshold (e.g., trigger when balance falls below $10)
3. Set the top-up amount per charge (e.g., $100 each time)
4. Link a payment method and save

Once enabled, the system will automatically top up when your balance falls below the configured threshold—ensuring your API service won’t be interrupted due to low balance.

---

## Create and manage API keys

### Create a Pay As You Go API key

Pay As You Go API keys are completely separate from subscription keys and are designed for production:

1. In **Pay As You Go API Keys**, click **+ Create API Key**
2. Enter a name for the API key (e.g., `production-app`)
3. Click **Create** to finish

![Create API key](https://cdn.marmot-cloud.com/storage/zenmux/2026/01/19/BNdWYST/pay-as-you-go-details.png)

### API key management

In the API Keys list, you can view and manage all Pay As You Go API keys:

| Column | Description |
|------|------|
| **Name** | API key name |
| **API Key** | API key prefix (click to copy the full key) |
| **Status** | Status (Enabled/Disabled) |
| **Created** | Created date |
| **Last Used** | Last used time |
| **Used** | Amount consumed |
| **Activity** | Actions (view details, edit, delete) |

::: tip 💡 API key best practices

- Create separate API keys for different projects/environments to simplify cost attribution and management
- Regularly review **Last Used** and **Used** to identify inactive or high-spend keys
- If you suspect a key has been leaked, immediately disable or delete it via the **Actions** column
:::

### Call the API with a Pay As You Go API key

After creating an API key, you can use it in code to call the ZenMux API. The usage is exactly the same as in the quickstart guide—just replace it with your Pay As You Go API key:

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<YOUR PAY_AS_YOU_GO_API_KEY>",  # [!code highlight]
)

completion = client.chat.completions.create(
    model="openai/gpt-5",
    messages=[
        {
            "role": "user",
            "content": "What is the meaning of life?"
        }
    ]
)

print(completion.choices[0].message.content)
```

```ts [TypeScript]
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: "<YOUR PAY_AS_YOU_GO_API_KEY>",  // [!code highlight]
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-5",
    messages: [
      {
        role: "user",
        content: "What is the meaning of life?",
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

:::

::: info 📚 More usage
For complete API usage examples, see the [Quickstart Guide](/guide/quickstart).
:::

---

## Balance management and billing

### View balance breakdown

Click the info icon next to **Total Balance** to view the **Credits Breakdown**:

![Credits breakdown](https://cdn.marmot-cloud.com/storage/zenmux/2026/01/19/YqxRLvm/pay-as-you-go-keys.png)

The breakdown includes:

- **Top-ups**: your top-up records
- **Bonuses**: the 20% bonus credits from top-ups
- **Gifts**: credits granted by the platform
- **Referrals**: rewards earned from referring friends
- **Compensations**: AI insurance compensation credits
- **Adjustments**: manual credit adjustments by the platform
- **Expired**: expired bonus credits
- **Usage**: credits consumed by API calls
- **Total Balance**: current total available credits

### View transaction history

In **Transaction History**, you can review all top-ups, usage, and compensation records:

| Column | Description |
|------|------|
| **Date** | Transaction date and time |
| **Amount** | Transaction amount |
| **Type / Method** | Transaction type (Insurance compensation, Stripe top-up, Discount, etc.) |
| **Description / Invoice** | Transaction description or invoice link |

Click **View Invoice** to download the corresponding top-up invoice for reimbursements and billing audits.

---

## FAQ

### How can I avoid service interruptions due to insufficient balance?

Enable **Auto Top-Up**. With a reasonable trigger threshold and top-up amount configured, the system will automatically top up when your balance is low, ensuring uninterrupted service.

### Can I use Pay As You Go and a subscription plan at the same time?

Yes. You can use the **Builder Plan (Subscription)** during personal development, and switch to **Pay As You Go** when going live or commercializing. API keys for the two plans are completely independent.

### How long does it take for credits to arrive after topping up?

Credits are applied **immediately** after a successful top-up—no waiting required. The system also automatically adds a 20% bonus.

### How do I view usage details for a specific API key?

In the **Pay As You Go API Keys** list, click **Details** for the corresponding key to view detailed usage records and request logs.

### How do I export invoices for company reimbursement?

In **Transaction History**, click **View Invoice** for the relevant top-up record to download an official top-up invoice (PDF), suitable for reimbursement and financial audits.

---

## Next steps

Now that you understand how Pay As You Go works, you can:

- Read the [Advanced Calling Guide](/guide/advanced/streaming) to learn streaming, multimodal, and other advanced features
- Review the [AI Insurance Docs](/guide/insurance) to learn how to file claims
- Visit the [Cost Analytics page](https://zenmux.ai/settings/cost) for detailed cost attribution and usage trends
- Join the [Discord community](http://discord.gg/vHZZzj84Bm) to connect with other developers

::: tip Contact us
If you run into any issues or have suggestions/feedback, feel free to reach us via:

- **Website**: <https://zenmux.ai>
- **Support email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business email**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord**: <http://discord.gg/vHZZzj84Bm>

For more contact options and details, visit our [Contact page](/help/contact).
:::