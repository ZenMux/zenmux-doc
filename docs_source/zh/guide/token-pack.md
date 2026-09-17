---
head:
  - - meta
    - name: description
      content: ZenMux Token 包（Token Pack）— 定义、消耗顺序、有效期、账单与预警
  - - meta
    - name: keywords
      content: Zenmux, Token Pack, Token 包, 额度, PAYG, 消耗顺序, Credits
---

# Token 包（Token Pack）

**Token 包（Token Pack）** 是 ZenMux 发放的一种定量 API 调用权益：每个包包含固定的 Token 总量（例如 1M / 10M tokens）和独立的有效期。在按量付费（Pay As You Go）口径下，调用产生的 Token 用量会**优先从 Token 包扣减**，包内额度未覆盖的部分才进入账户余额（PAYG Credits）。

::: info 命名说明
对外名称为 **Token Pack**，中文称「Token 包」。部分界面可能仍显示 Token Package、Token 套餐 等写法，指的都是同一权益。
:::

## Token 包与其他额度体系的关系

ZenMux 账户下有四类容易混淆的额度，它们互相独立、来源与消耗规则各不相同：

| 额度类型 | 是什么 | 怎么获得 | 计量方式 | 有效期 |
| --- | --- | --- | --- | --- |
| **Token 包（Token Pack）** | 定量 Token 权益包 | 平台活动发放（见下文） | 按 Token 用量扣减 | 每个包独立有效期 |
| **充值额度（Top-Up Credits）** | 账户余额的充值部分 | 充值付款 | 按美元计价 | 长期有效 |
| **奖励与补偿额度（Bonus & Compensation Credits）** | 充值赠送、推荐、保险赔偿等 | 平台赠送 | 按美元计价 | 部分来源有有效期 |
| **订阅额度（Flows）** | 订阅套餐月配额 | 订阅 Builder Plan | 按订阅计费口径 | 按计费窗口重置 |

另有两类与 Token 包相邻的权益，注意区分：

- **充值加赠消费券**：充值时附带的折扣/加赠类券（如 +20% bonus），作用于充值环节，不直接参与调用扣减。
- **礼品卡（Gift Card）**：购买后转赠他人，兑换后进入收礼人的 PAYG Credits 余额；Token 包则仅限本人账号使用。

## 消耗顺序（完整优先级表)

每次 API 调用时，费用按以下固定顺序扣减，上一级未耗尽不进入下一级：

| 优先级 | 扣减来源 | 说明 |
| --- | --- | --- |
| 1 | **订阅额度（Flows）** | 仅订阅计费的请求消耗（订阅 API Key 或 Studio Chat 的 Subscription 模式） |
| 2 | **Token 包（Token Pack）** | 按量口径（含订阅配额用尽转按量的情况）下最先扣减；多包并存时**最先到期的先扣** |
| 3 | **奖励与补偿额度（Bonus & Compensation Credits）** | Token 包用尽或不可用时进入 |
| 4 | **充值额度（Top-Up Credits）** | 最后消耗，从账户余额扣减 |

::: info 订阅用户的顺序
使用订阅 API Key 时请求优先消耗订阅额度；当订阅配额用尽且开启了 [Extra Usage](/zh/guide/subscription) 时，转入按量口径，同样遵循 **Token 包 → 奖励额度 → 充值额度** 的顺序。
:::

到第 4 级余额仍不足时，调用将返回 `402`（余额不足），参考 [错误码文档](/zh/guide/advanced/error-codes)。

### Token 包的扣减方式

- **按 Token 用量扣减**：一次调用的输入/输出 Token（不含 Prompt 缓存命中率、缓存读写部分与 Web 搜索计费项）计入包内额度消耗。
- **整笔覆盖**：当一次调用的计费 Token 不超过包内剩余额度时，该次调用**全额由包承担**（自付 $0，含当次调用的其他费用项）。
- **无法整笔覆盖时**：该次调用跳过 Token 包、直接按上图第 3、4 级扣费；包内剩余额度仍可在后续调用中继续使用。
- **多包并存**：按「最先到期优先」扣减，帮助你用掉即将过期的额度。

## 获得与使用

::: info 当前发放渠道
Token 包目前通过**平台活动**发放，例如新模型上线的限时免费体验包、面向指定用户的定向赠送，以及营销活动页面领取。你可以在 **Gift Center**（礼品卡与优惠券中心）的 **我的券包** 中查看自己持有的 Token 包。
:::

- **即时生效**：领取成功后立即到账，无需激活，后续调用自动按优先级扣减，无需任何配置。
- **仅限本人账号**：Token 包绑定领取账号，不可转赠、不可跨账号使用；组织成员个人名下的 Token 包也不会在组织成员间共享。
- **可同时持有多个**：多个有效包并存时按「最先到期优先」自动扣减。

## 有效期与作废

- 每个 Token 包的**有效期独立**，领取/发放时即确定，券面会展示到期时间。
- **到期即失效**：有效期结束后，包内未消耗的剩余额度作废，不可延期、不可折现、不可转回余额。
- 多个包并存时优先消耗最先到期的包，帮你尽量避免额度过期作废。
- 若平台因活动调整停用某个发放活动，未消耗的 Token 包将停止参与扣减；已消耗部分不受影响。

::: warning 不涉及退款
Token 包是平台出资发放的活动权益，不属于你的付费购买项，因此**不适用**按量付费充值的 24 小时退款规则，也不能提现或兑换为其他额度。
:::

## 在账单与用量中的呈现

- **我的券包（Gift Center → 优惠券区）**：Token 包卡片展示 Token 剩余/总量（如 880K / 1M）、使用比例（x.x% Used）与到期时间（Expires），并按「可用 / 已用·过期」分组。
- **请求日志（Logs）**：日志会标注每次调用的计费来源与券抵扣情况（如 Token 包抵扣的 token 数），金额列同时展示原价与抵扣后的实付金额——整笔由包覆盖的调用实付为 $0。
- **用量/成本分析**：按量口径的用量与成本统计与既有页面一致；Token 包抵扣的部分不计入账户余额消耗。
- 账单中每笔消费会区分**券抵扣金额（Token 包承担）**与**自付金额（PAYG/订阅承担）**，合计 = 券抵扣 + 自付。

## 消耗预警

当 Token 包即将耗尽时，ZenMux 会在 **Studio Chat** 中弹窗提醒，避免你以为余额在扣、实际权益即将用尽：

- **90% 已消耗**：弹窗提示 Token 包已消耗 90%、剩余约 $xx。用尽后将自动改用按量付费额度（PAYG Credits）继续计费，按实际用量从账户余额中扣减，可从弹窗查看余额或前往充值。
- **100% 已耗尽**：弹窗提示 Token 包已耗尽，后续调用从账户余额扣费。
- 每个包的每个阈值（90%、100%）只提醒一次，关闭状态跨会话保留，不打断正在进行的输入。
- 提醒中展示的剩余额度与到期时间以服务端实时数据为准。
- 同一账号持有多个包时，提醒会明确指出是**哪一个** Token 包（含到期日），避免为即将过期的包误充值。

::: tip 余额预警是另一回事
Token 包耗尽**不会中断调用**——计费自动切换到 PAYG 余额。真正需要关注的是账户余额：参考 [余额提醒（Low Balance Alert）](/zh/guide/pay-as-you-go)，在余额不足前充值。
:::

## 常见问题

### Token 包需要配置或激活吗？

不需要。领取后自动生效，调用时按默认优先级自动扣减，无需修改任何 API Key 配置。

### 多个 Token 包，先用哪一个？

按「最先到期优先」自动扣减——即将过期的包先消耗，减少额度作废。

### Token 包用完会中断我的服务吗？

不会。Token 包耗尽后，计费自动切换到 PAYG 余额（先奖励额度后充值额度）继续服务；只有当账户余额也不足时，调用才会返回 `402` 余额不足错误。

### Token 包可以退款、提现或转让吗？

不可以。Token 包是平台活动发放的权益，不适用按量付费充值的 24 小时退款规则，不支持提现与转赠。

### Token 包的额度和 PAYG Credits 是一回事吗？

不是。PAYG Credits 以美元计价（1 额度 = 1 美元等值的 API 调用量），是账户余额；Token 包按 Token 用量计量、有独立有效期，且在扣减顺序上**优先于** PAYG 余额。

### 哪里查看 Token 包剩余额度和到期时间？

在 **Gift Center → 我的券包** 查看，或留意 Studio Chat 中的额度展示与预警弹窗。

## 下一步

- 了解 [按量付费（Pay As You Go）](/zh/guide/pay-as-you-go) 的余额与充值机制
- 了解 [订阅制套餐](/zh/guide/subscription) 的额度（Flows）与 Extra Usage
- 访问 [ZenMux 控制台](https://zenmux.ai/platform/pay-as-you-go) 查看你的余额与券包

<ContactCards>
<ContactCard icon="mail" title="邮箱">

技术支持: [support@zenmux.ai](mailto:support@zenmux.ai)

商务合作: [bd@zenmux.ai](mailto:bd@zenmux.ai)

</ContactCard>
<ContactCard icon="x" title="X / Twitter" link="https://x.com/ZenMuxAI" label="@ZenMuxAI" />
<ContactCard icon="discord" title="Discord" link="https://discord.gg/vHZZzj84Bm" label="@ZenMuxAI" />
</ContactCards>
