---
head:
  - - meta
    - name: description
      content: Download Invoices
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, invoice, billing
---

# Download Invoices

ZenMux provides invoice support for top-ups and subscription payments. You can use the **Billing** page to view Pay As You Go and subscription invoices in one place, filter records, view hosted invoices, download PDFs, or batch-download multiple invoices.

## How to Download Invoices

Downloading invoices involves two steps:

1. **Confirm invoice details** - Maintain your invoice recipient and billing address on the Billing page
2. **Download invoices** - View, filter, and download invoices from the Billing page

## Step 1: Confirm Invoice Details

Invoice details are used for future invoices. You can manage them centrally on the Billing page, or fill them in during a top-up or subscription checkout flow.

### Edit Invoice Details on the Billing Page

1. Visit the **[Billing page](https://zenmux.ai/platform/billing)**
2. Find the **Invoice details** card at the top of the page
3. Click **Edit Address**
4. Fill in or update the invoice recipient and billing address in the modal
5. Click **Save billing info**

The invoice details form includes these fields:

| Field                 | Description                                          | Required |
| --------------------- | ---------------------------------------------------- | -------- |
| **Full name**         | Invoice recipient name, such as a person or company | ✅ Yes   |
| **Country or region** | Country or region                                    | ✅ Yes   |
| **Address line 1**    | Detailed address, line 1                             | ✅ Yes   |
| **Address line 2**    | Detailed address, line 2, optional                   | ⚪ No    |
| **City**              | City                                                 | ✅ Yes   |
| **State / Province**  | State or province                                    | ✅ Yes   |
| **Postal code**       | Postal code                                          | ✅ Yes   |

::: warning Important
Updating invoice details on the Billing page affects future invoices and adds a new **Bill to** record on future invoices. Please review the recipient and address carefully before saving.
:::

### Fill in Invoice Details During Payment

When you make a **Pay As You Go top-up** or a **subscription payment**, the checkout page still shows an **Invoice Details** section. Click **Edit** to fill in or update invoice details before payment.

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/01/21/wNHvxNw/ruhehuoqufapiao-fapiaoshenqingrukou.png" alt="Invoice information entry" style="width:400px; border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">

</br></br>

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/01/21/4G3z1Y6/ruhehuoqufapiao-tijiaofapiaoxinxi.png" alt="Invoice information form" style="width:400px; border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">

::: tip Recommendation
For company reimbursement or financial audits, confirm your invoice details on the Billing page before topping up or subscribing.
:::

## Step 2: Download Invoices from the Billing Page

After a successful top-up or subscription payment, you can download invoices from the Billing page.

### View and Filter Invoices

1. Visit the **[Billing page](https://zenmux.ai/platform/billing)**
2. Review all available invoices in the invoice table
3. Use the filters at the top of the page to find the invoice you need:

| Feature           | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| **Search**        | Search by order ID or invoice-related keywords             |
| **Month range**   | Filter invoices by billing month                           |
| **Type filter**   | Select **Subscription** or **PAYG**, or view all types      |
| **Reset**         | Clear the current search and filters                       |

The invoice table contains:

| Column           | Description                                     |
| ---------------- | ----------------------------------------------- |
| **Invoice**      | Invoice name, such as `Invoice_Mar_27_2026`    |
| **Amount**       | Billing amount in USD                           |
| **Plan**         | Invoice type or plan, such as Subscription/PAYG |
| **Billing date** | Billing date                                    |
| **Actions**      | View or download the invoice                    |

### Download a Single Invoice

Find the target invoice in the table, then use the **Actions** buttons:

- Click **View** to open the hosted Stripe invoice page for online review
- Click **Download** to download the invoice PDF directly

::: info Invoice Generation Time
Invoices are usually generated immediately after a successful top-up or subscription payment. If you still do not see the invoice after 10 minutes, refresh the Billing page or contact support.
:::

### Batch Download Multiple Invoices

To download multiple invoices at once:

1. Select invoices using the checkboxes on the left side of the table
2. The selection bar shows the selected invoice count and total amount
3. Click **Download** in the selection bar
4. ZenMux prepares an invoice archive and downloads a ZIP file when it is ready

Batch download is useful for monthly reimbursement, finance archiving, and audit workflows.

## Jumping from Older Invoice Entrances

You can still enter invoice download flows from Pay As You Go and Subscription history:

- On the **[Pay As You Go page](https://zenmux.ai/platform/pay-as-you-go)**, click **View Invoice** in **Transaction History**
- On the **[Subscription page](https://zenmux.ai/platform/subscription)**, click **View Invoice** in **Billing History**

These links take you to the **Billing page** and automatically search for the related order ID, so you can quickly locate the invoice. Going forward, we recommend using the **[Billing page](https://zenmux.ai/platform/billing)** as the central place to manage and download invoices.

## Billing Summary

At the top of the Billing page, the **Total billing amount** card shows your account's historical billing total and recent monthly trend. Click the expand icon to view monthly billing details, including:

- **Subscription**: Subscription plan payments
- **PAYG**: Pay As You Go top-ups
- **Total**: Monthly total

## Invoice Content Details

ZenMux invoices contain:

- **Invoice number**: Unique invoice identifier
- **Invoice date**: Date the invoice was generated
- **Transaction amount**: Actual payment amount in USD
- **Invoice recipient**: The name or company name you provided
- **Billing address**: The complete billing address you provided

All invoices are in **PDF format** and can be printed or used for company reimbursement and financial audits.

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/01/21/XaAMGwv/ruhehuoqufapiao-fapiaoneirongshili.png" alt="invoice" style="border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">

## Frequently Asked Questions

### What if I forgot to fill in invoice details?

Go to the **[Billing page](https://zenmux.ai/platform/billing)**, find the **Invoice details** card, and click **Edit Address** to add or update invoice details.

You can also update billing information from the related Stripe hosted invoice page. Future invoices will use the updated information.

### Can the invoice be used for company reimbursement?

Yes. ZenMux PDF invoices include transaction and billing details and can be used for company reimbursement and financial audits.

### How long does invoice generation take?

Invoices are usually generated immediately after a successful top-up or subscription payment. If you still do not see the invoice after 10 minutes, refresh the Billing page or contact support.

### Why can't I find an invoice for an order?

First check whether your month or type filters are limiting the table. You can click **Reset** to clear filters, then search by order ID. If you still cannot find it, the invoice may not have been generated yet or may not be available for that order. Please contact support.

### Invoicing & Compliance

ZenMux provides standard electronic invoices in English, available for download from your dashboard. For corporate procurement processes or specific financial compliance requirements, contact our business team:

- **Business inquiry**: [bd@zenmux.ai](mailto:bd@zenmux.ai)

## Next Steps

Now that you know how to obtain invoices, you can:

- Visit the [Billing page](https://zenmux.ai/platform/billing) to manage and download invoices
- Read the [Pay As You Go Guide](/en/guide/pay-as-you-go) to learn about top-ups and balance management
- Read the [Subscription Plan Guide](/en/guide/subscription) to learn about subscription billing
- Visit the [Cost Analysis page](https://zenmux.ai/settings/cost) to view detailed expense breakdowns
- Join the [Discord Community](http://discord.gg/vHZZzj84Bm) to connect with other developers

<ContactCards>
<ContactCard icon="mail" title="Email">

Technical support: [support@zenmux.ai](mailto:support@zenmux.ai)

Business cooperation: [bd@zenmux.ai](mailto:bd@zenmux.ai)

</ContactCard>
<ContactCard icon="x" title="X / Twitter" link="https://x.com/ZenMuxAI" label="@ZenMuxAI" />
<ContactCard icon="discord" title="Discord" link="https://discord.gg/vHZZzj84Bm" label="@ZenMuxAI" />
</ContactCards>
