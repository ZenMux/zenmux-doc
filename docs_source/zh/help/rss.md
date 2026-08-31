---
head:
  - - meta
    - name: description
      content: 通过 RSS 订阅 ZenMux 更新日志、公告和模型上新
  - - meta
    - name: keywords
      content: ZenMux, RSS, feed, changelog, notification, models, 订阅
---

# RSS 订阅

ZenMux 提供公开 RSS 2.0 订阅源，方便你在阅读器、监控系统或自动化工作流中及时获取产品更新、平台公告和模型上新。无需登录，也无需 API Key。

::: tip 推荐订阅
如果只想维护一个订阅地址，使用 [全部更新](https://zenmux.ai/rss/all.xml) 即可覆盖更新日志、公告和模型动态。
:::

## 订阅地址

| 订阅源 | 内容 | 地址 |
| --- | --- | --- |
| 更新日志 | 产品功能发布与版本说明 | [https://zenmux.ai/rss/changelog.xml](https://zenmux.ai/rss/changelog.xml) |
| 公告通知 | 公开公告，例如模型下线、停用提醒 | [https://zenmux.ai/rss/notification.xml](https://zenmux.ai/rss/notification.xml) |
| 模型动态 | 新模型上线与模型相关更新 | [https://zenmux.ai/rss/models.xml](https://zenmux.ai/rss/models.xml) |
| 全部更新 | 以上三类内容的合集 | [https://zenmux.ai/rss/all.xml](https://zenmux.ai/rss/all.xml) |

## 如何订阅

将对应地址添加到任意支持 RSS 的客户端即可，例如：

- Feedly、Inoreader、NetNewsWire、Reeder 等阅读器
- Slack、Discord、邮件网关等支持 RSS 入站的集成
- 自建监控脚本（按固定间隔拉取 XML）

多数阅读器支持「通过 URL 添加订阅」。把上表中的地址粘贴进去即可。

## Feed 字段说明

各订阅源均为 RSS 2.0。常见字段如下：

| 字段 | 说明 |
| --- | --- |
| `channel/title` | 订阅源名称，例如 `ZenMux Changelog` |
| `channel/description` | 订阅源简介 |
| `item/title` | 条目标题 |
| `item/link` | 详情页链接（模型条目通常指向模型页，更新日志指向 [Changelog](https://zenmux.ai/changelog)） |
| `item/guid` | 条目唯一标识，可用于去重 |
| `item/pubDate` | 发布时间（GMT） |
| `item/category` | 分类：`Changelog`、`Notice` 或 `Models` |
| `item/description` | 正文摘要。部分模型上新条目可能为空，请以标题和链接为准 |

`all.xml` 会混合三类条目，可用 `category` 再做过滤。

## 使用建议

- **开发与运维**：订阅公告源，及时感知模型下线或供应商变更。
- **产品与研究**：订阅模型源，跟进新模型上线。
- **关注产品演进**：订阅更新日志，了解功能发布与行为变化。
- **自动化**：用 `guid` 去重，避免重复处理同一条目。

::: info 相关页面
- 网页版更新日志：[https://zenmux.ai/changelog](https://zenmux.ai/changelog)
- 模型列表：[https://zenmux.ai/models](https://zenmux.ai/models)
:::
