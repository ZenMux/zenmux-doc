---
head:
  - - meta
    - name: description
      content: 使用 ZenMux 组织账户协作管理成员、API Key、用量和账单
  - - meta
    - name: keywords
      content: ZenMux, 组织, Organization, 团队, 成员, API Key, 用量, 账单
---

# 组织账户

ZenMux 组织账户为团队提供独立的按量付费工作空间。成员可以在同一组织余额下使用 Studio 和 API，管理员可以集中管理成员、API Key、用量、限额与账单。

::: info 个人账户与组织账户相互独立
组织拥有独立的余额、API Key、请求日志和用量数据。切换账户后，请先确认当前账户，再进行充值、创建 API Key 或发起请求。
:::

## 功能概览

| 能力         | 说明                                                       |
| ------------ | ---------------------------------------------------------- |
| 账户切换     | 在个人账户和已加入的组织之间切换                           |
| 成员协作     | 通过邮箱邀请成员，并分配管理员或成员角色                   |
| API Key 管理 | 成员创建和使用自己的组织 API Key，管理员查看组织内全部 Key |
| 成员限额     | 按总量、自然日、自然周和自然月设置 Credits 上限            |
| 用量分析     | 按成员查看请求日志、用量和成本                             |
| 集中结算     | 使用组织独立的 Pay As You Go 余额统一结算                  |

组织账户当前使用 **Pay As You Go（按量付费）**，不继承个人账户的 Builder Plan 订阅和额度。有关充值及计费方式，请参阅 [Pay As You Go 按量付费](/zh/guide/pay-as-you-go)。

## 创建组织

![创建组织](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/Ks3i10S/01-settings-organization-entry.png)

1. 登录 ZenMux，进入 [Manage > Settings](https://zenmux.ai/platform/settings)。
2. 在 **Account** 区域找到 **Organization**，点击 **Create**。
3. 输入组织名称，并按需上传组织 Logo。
4. 点击 **Create**。创建成功后，系统会自动切换到新组织。

![创建组织弹窗](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/OQm69Fz/02-create-organization-dialog.png)

组织名称最多 64 个字符。Logo 必须为图片格式，文件大小不能超过 10 MB，推荐使用 1:1 图片。

::: tip 当前默认数量限制
每个用户最多创建 **1 个组织**，最多加入 **5 个组织**。平台可能根据账户情况调整实际限制，请以页面提示为准。
:::

如果 Settings 中没有 Organization 入口，可能是该功能尚未向你的账户开放。如果按钮不可用，请检查是否已达到创建或加入组织的数量上限。

## 切换账户

![切换个人账户和组织账户](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/iXcNTHY/03-account-switcher-raw.png)

1. 点击页面右上角的头像。
2. 在当前账户名称下方点击或悬停 **Personal** / **Organization**。
3. 从账户列表中选择目标个人账户或组织。

切换后，页面会使用目标账户的余额、API Key、日志和用量数据。部分仅支持个人账户或组织管理员的页面会自动返回可访问页面。

## 邀请和管理成员

只有组织管理员可以进入 [Manage > Members](https://zenmux.ai/platform/members) 管理成员。

### 邀请成员

![组织成员列表](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/P6x5mhF/20260722100720.jpg)
![组织成员列表2](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/AmkQfPU/20260722101056.jpg)

1. 切换到目标组织。
2. 进入 **Manage > Members**，点击 **Invite**。
3. 输入一个或多个成员邮箱，并为其选择 **Admin** 或 **Member** 角色。
4. 发送邀请。

![邀请组织成员](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/d7SouON/20260722101143.jpg)

被邀请人需要使用与邀请邮箱相同的 ZenMux 账户打开链接并接受邀请。尚未注册的用户可以先用该邮箱完成注册。邀请链接有效期为 **7 天**。

::: tip 成员数量限制
每个组织最多包含 **50 名活跃或待加入成员**。重复邀请已加入的成员会被跳过；管理员也可以撤销待处理的邀请。
:::

### 角色权限

| 能力                               | Admin | Member |
| ---------------------------------- | :---: | :----: |
| 使用组织余额调用 Studio 和 API     |   ✓   |   ✓    |
| 创建和管理自己的组织 API Key       |   ✓   |   ✓    |
| 查看自己的日志和用量               |   ✓   |   ✓    |
| 查看组织全部成员、日志、用量和成本 |   ✓   |   —    |
| 邀请、移除成员或调整角色           |   ✓   |   —    |
| 设置成员 Credits 限额              |   ✓   |   —    |
| 充值、管理账单和余额提醒           |   ✓   |   —    |
| 修改或删除组织                     |   ✓   |   —    |

组织必须始终保留至少一名管理员。最后一名管理员不能降级、被移除或直接离开组织，需要先将其他成员设为管理员。

### 设置成员限额

管理员可以在 Members 页面为每位成员设置以下 Credits 限额：

![设置成员限额](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/hBmFiFM/20260722101230.jpg)
![设置成员限额](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/dyCsB2d/20260722101242.jpg)

| 限额  | 说明                              |
| ----- | --------------------------------- |
| Total | 该成员可累计消耗的 Credits 总上限 |
| Day   | 每个自然日可消耗的 Credits 上限   |
| Week  | 每个自然周可消耗的 Credits 上限   |
| Month | 每个自然月可消耗的 Credits 上限   |

留空表示不限制。成员达到周期限额后将暂停使用组织额度，并在下一个周期恢复；达到 Total 限额后不会自动恢复，需要管理员调整限额。

## 使用组织 API Key

切换到组织后，在 **Manage > Pay As You Go** 或 **Manage > Platform API** 创建的 API Key 都属于当前组织，其调用费用从组织余额中扣除。

![管理组织 API Key](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/Aui9AJy/20260722101421.jpg)
![管理组织 API Key2](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/I6m4GS3/20260722101521.jpg)

- 普通成员只能查看、复制和管理自己创建的 API Key。
- 管理员可以查看组织内全部 API Key 及其创建者，但其他成员的完整 Key 会被隐藏。
- 管理员可以通过用量和成本页面按成员筛选数据。
- 成员退出或被移除后，其在该组织下创建的 API Key 会立即被禁用。

::: warning 切换账户后再创建 Key
个人账户和组织账户的数据完全隔离。创建 API Key 前，请检查头像菜单中当前显示的是正确的 Organization。
:::

## 充值、账单与用量

组织管理员可以在 **Manage > Pay As You Go** 中充值、设置自动充值和余额提醒，并在 **Manage > Billing** 中维护账单信息。普通成员可以使用组织额度，但不能管理充值和账单。

![组织充值与余额](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/e8F1a2V/20260722101654.jpg)

在 Analysis 下的 Logs、Usage 和 Cost 页面中：

- 管理员可以查看整个组织的数据，并按成员筛选。
- 普通成员只能查看与自己及自己的 API Key 相关的数据。

## 修改、退出或删除组织

点击右上角头像后，点击当前组织右侧的设置图标，即可打开组织管理窗口。也可以在 **Manage > Settings > Account** 中点击 Organization 的 **Manage**。

![组织管理](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/IJrWedE/20260722101751.jpg)

### 修改组织

管理员可以修改组织名称和 Logo。普通成员可以查看组织信息，但不能修改。

### 退出组织

所有成员都可以主动退出组织。退出后：

- 系统会自动切换回个人账户；
- 你将无法继续访问该组织的数据；
- 你在该组织下创建的 API Key 会被立即禁用。

最后一名管理员必须先指定另一名管理员，才能退出。

### 删除组织

只有管理员可以删除组织。删除前需要输入 `DELETE` 确认；如果组织处于欠费状态，必须先结清欠款。

![删除组织确认](https://cdn.marmot-cloud.com/storage/zenmux/2026/07/22/QlpYfmY/20260722103101.jpg)

::: danger 删除后无法恢复
删除组织会立即禁用全部 API Key、移除所有成员，并使剩余余额作废且不予退还。组织历史数据无法恢复。
:::

## 常见问题

### 为什么无法接受邀请？

请确认当前登录账户的邮箱与邀请邮箱完全一致，并检查邀请是否已过期、被撤销或已经接受。

### 为什么成员的 API 请求被拒绝？

请依次检查组织余额、API Key 状态，以及该成员的 Total、Day、Week 和 Month 限额。成员被移除或退出组织后，其组织 API Key 也会被禁用。

### 为什么普通成员看不到 Members 或 Billing？

这些页面仅对组织管理员开放。管理员可以在 Members 页面将成员角色调整为 Admin。
