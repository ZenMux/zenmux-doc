---
head:
  - - meta
    - name: description
      content: 下载发票
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, invoice, billing
---

# 下载发票

ZenMux 为充值和订阅付费用户提供完整的发票支持。你可以在 **Billing（账单）** 页面集中查看 Pay As You Go 充值发票和订阅发票，按条件筛选、查看在线发票、下载 PDF，或一次性批量下载多张发票。

## 如何下载发票

下载发票主要分为两个步骤：

1. **确认发票信息** - 在 Billing 页面维护发票抬头和账单地址
2. **下载发票** - 在 Billing 页面查看、筛选并下载对应发票

## 第一步：确认发票信息

发票信息会用于后续生成的发票。你可以在 Billing 页面统一查看和更新，也可以在充值或订阅支付流程中填写。

### 在 Billing 页面编辑发票信息

1. 访问 **[Billing 页面](https://zenmux.ai/platform/billing)**
2. 在页面顶部找到 **Invoice details（发票信息）** 卡片
3. 点击 **Edit Address（编辑地址）**
4. 在弹窗中填写或修改发票抬头和账单地址
5. 点击 **Save billing info** 保存

发票信息表单包含以下字段：

| 字段                  | 说明                           | 必填  |
| --------------------- | ------------------------------ | ----- |
| **Full name**         | 发票抬头（个人姓名或公司名称） | ✅ 是 |
| **Country or region** | 国家或地区                     | ✅ 是 |
| **Address line 1**    | 详细地址（第一行）             | ✅ 是 |
| **Address line 2**    | 详细地址（第二行，可选）       | ⚪ 否 |
| **City**              | 城市                           | ✅ 是 |
| **State / Province**  | 州/省                          | ✅ 是 |
| **Postal code**       | 邮政编码                       | ✅ 是 |

::: warning 重要提示
修改 Billing 页面中的发票信息会影响后续生成的发票，并会在后续发票上新增一条 **Bill to** 记录。请在保存前仔细确认发票抬头和地址。
:::

### 在支付页面填写发票信息

当你进行 **Pay As You Go 充值**或**订阅套餐付费**时，支付页面底部仍会展示 **Invoice Details（发票详情）** 区域。你可以点击 **Edit**，在支付前填写或更新发票信息。

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/01/21/wNHvxNw/ruhehuoqufapiao-fapiaoshenqingrukou.png" alt="发票信息入口" style="width:400px; border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">

</br></br>

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/01/21/4G3z1Y6/ruhehuoqufapiao-tijiaofapiaoxinxi.png" alt="发票信息表单" style="width:400px; border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">

::: tip 建议
如果你是企业报销或财务审计场景，建议先在 Billing 页面确认发票信息，再进行充值或订阅支付。
:::

## 第二步：在 Billing 页面下载发票

完成充值或订阅付费后，你可以在 Billing 页面统一下载发票。

### 查看和筛选发票

1. 访问 **[Billing 页面](https://zenmux.ai/platform/billing)**
2. 在发票列表中查看所有可下载发票
3. 使用页面顶部筛选条件快速定位发票：

| 功能              | 说明                                                 |
| ----------------- | ---------------------------------------------------- |
| **Search**        | 按订单号、发票相关信息等关键词搜索                   |
| **月份范围筛选**  | 按账单月份筛选发票                                   |
| **类型筛选**      | 选择 **Subscription** 或 **PAYG**，也可以查看全部类型 |
| **Reset**         | 清空当前搜索和筛选条件                               |

发票列表包含以下信息：

| 列名             | 说明                                      |
| ---------------- | ----------------------------------------- |
| **Invoice**      | 发票名称，格式类似 `Invoice_Mar_27_2026` |
| **Amount**       | 账单金额（美元）                         |
| **Plan**         | 发票类型或套餐，例如 Subscription / PAYG |
| **Billing date** | 账单日期                                  |
| **Actions**      | 查看或下载发票                            |

### 下载单张发票

在发票列表中找到目标记录后，可以使用 **Actions（操作）** 列中的按钮：

- 点击 **View**：打开 Stripe 在线发票页面，适合在线查看或确认发票详情
- 点击 **Download**：直接下载该发票的 PDF 文件

::: info 发票生成时间
充值或订阅付费成功后，发票通常会立刻生成。如果超过 10 分钟仍未看到发票，请刷新 Billing 页面或联系客服处理。
:::

### 批量下载多张发票

如果需要一次性下载多张发票：

1. 在发票列表左侧勾选需要下载的发票
2. 页面会显示已选发票数量和总金额
3. 点击顶部选择栏中的 **Download**
4. 系统会准备发票压缩包，完成后自动下载 ZIP 文件

批量下载适合月度报销、财务归档或审计场景。

## 从旧入口跳转到 Billing 页面

你仍然可以从 Pay As You Go 和 Subscription 的历史记录中进入发票下载：

- 在 **[Pay As You Go 页面](https://zenmux.ai/platform/pay-as-you-go)** 的 **Transaction History（交易历史）** 中点击 **View Invoice**
- 在 **[Subscription 页面](https://zenmux.ai/platform/subscription)** 的 **Billing History（账单历史）** 中点击 **View Invoice**

点击后会跳转到 **Billing 页面**，并自动带入订单号搜索，帮助你快速定位对应发票。后续推荐直接在 **[Billing 页面](https://zenmux.ai/platform/billing)** 统一管理和下载发票。

## 账单总览

Billing 页面顶部提供 **Total billing amount（总账单金额）** 卡片，用于查看账号历史账单总额和最近月份趋势。点击卡片右上角的展开按钮，可以查看按月份拆分的账单趋势，其中包含：

- **Subscription**：订阅套餐费用
- **PAYG**：Pay As You Go 充值费用
- **Total**：当月合计金额

## 发票内容说明

ZenMux 发票包含以下信息：

- **发票编号**：唯一的发票识别码
- **开票日期**：发票生成日期
- **交易金额**：实际支付金额（美元）
- **发票抬头**：你填写的姓名或公司名称
- **账单地址**：你填写的完整地址信息

所有发票均为 **PDF 格式**，可直接打印或用于企业报销和财务审计。

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/01/21/XaAMGwv/ruhehuoqufapiao-fapiaoneirongshili.png" alt="invoice" style="border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">

## 常见问题

### 忘记填写发票信息怎么办？

如果支付时忘记填写发票信息，可以进入 **[Billing 页面](https://zenmux.ai/platform/billing)**，在 **Invoice details** 卡片中点击 **Edit Address** 补充或更新发票信息。

如需通过 Stripe 账单门户更新，也可以在订单对应的 Stripe 发票页面中修改账单信息。更新后，后续生成的发票将使用新的信息。

### 发票可以用于企业报销吗？

可以。ZenMux 提供的 PDF 格式发票包含完整的交易信息和开票资料，符合企业报销和财务审计要求。

### 发票生成需要多久？

充值或订阅付费成功后，发票通常会立刻生成。如果超过 10 分钟仍未看到发票，请刷新 Billing 页面或联系客服处理。

### 为什么找不到某一笔订单的发票？

请先确认筛选条件是否限制了月份或类型。你也可以点击 **Reset** 清空筛选条件，然后使用订单号搜索。如果仍然找不到，可能是该订单暂未生成发票或发票不可用，请联系客服处理。

### 发票与合规支持

ZenMux 现已支持在线获取英文电子 Invoice。如涉及企业采购流程或特殊财务合规要求，请发送邮件至商务团队：

- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)

## 下一步

现在你已经了解了如何获取发票，可以：

- 访问 [Billing 页面](https://zenmux.ai/platform/billing)，集中管理和下载发票
- 查看 [Pay As You Go 使用指南](/zh/guide/pay-as-you-go)，了解充值和余额管理
- 查看 [订阅制套餐指南](/zh/guide/subscription)，了解订阅计费方式
- 访问 [成本分析页面](https://zenmux.ai/settings/cost)，查看详细的费用明细
- 加入 [Discord 社区](http://discord.gg/vHZZzj84Bm)，与其他开发者交流

<ContactCards>
<ContactCard icon="mail" title="邮箱">

技术支持: [support@zenmux.ai](mailto:support@zenmux.ai)

商务合作: [bd@zenmux.ai](mailto:bd@zenmux.ai)

</ContactCard>
<ContactCard icon="x" title="X / Twitter" link="https://x.com/ZenMuxAI" label="@ZenMuxAI" />
<ContactCard icon="discord" title="Discord" link="https://discord.gg/vHZZzj84Bm" label="@ZenMuxAI" />
</ContactCards>
