---
head:
  - - meta
    - name: description
      content: Subscribe to ZenMux changelog, notices, and model updates via RSS
  - - meta
    - name: keywords
      content: ZenMux, RSS, feed, changelog, notification, models, subscribe
---

# RSS Feeds

ZenMux publishes public RSS 2.0 feeds so you can follow product updates, platform notices, and new models from a reader, monitoring system, or automation workflow. No login or API Key is required.

::: tip Recommended feed
If you only want one URL, subscribe to [All updates](https://zenmux.ai/rss/all.xml). It includes changelog entries, notices, and model updates.
:::

## Feed URLs

| Feed | Contents | URL |
| --- | --- | --- |
| Changelog | Product releases and release notes | [https://zenmux.ai/rss/changelog.xml](https://zenmux.ai/rss/changelog.xml) |
| Notices | Public notices such as model retirement warnings | [https://zenmux.ai/rss/notification.xml](https://zenmux.ai/rss/notification.xml) |
| Models | New model launches and model-related updates | [https://zenmux.ai/rss/models.xml](https://zenmux.ai/rss/models.xml) |
| All updates | Combined feed of the three sources above | [https://zenmux.ai/rss/all.xml](https://zenmux.ai/rss/all.xml) |

## How to subscribe

Add the URL to any RSS-capable client, for example:

- Readers such as Feedly, Inoreader, NetNewsWire, or Reeder
- Slack, Discord, or email gateways that accept RSS
- Custom monitors that poll the XML on a schedule

Most readers support “Add subscription by URL”. Paste a feed URL from the table above.

## Feed fields

All feeds are RSS 2.0. Common fields:

| Field | Description |
| --- | --- |
| `channel/title` | Feed name, for example `ZenMux Changelog` |
| `channel/description` | Short description of the feed |
| `item/title` | Item title |
| `item/link` | Detail URL (model items usually point to the model page; changelog items point to [Changelog](https://zenmux.ai/changelog)) |
| `item/guid` | Stable unique ID for deduplication |
| `item/pubDate` | Publication time (GMT) |
| `item/category` | Category: `Changelog`, `Notice`, or `Models` |
| `item/description` | Summary. Some new-model items may have an empty description; use the title and link |

`all.xml` mixes all three types. Filter by `category` if you need a subset.

## Suggested uses

- **Engineering and operations**: subscribe to notices so you catch model retirements or provider changes.
- **Product and research**: subscribe to the models feed for new launches.
- **Product changes**: subscribe to the changelog for feature releases and behavior changes.
- **Automation**: deduplicate with `guid` so the same item is not processed twice.

::: info Related pages
- Web changelog: [https://zenmux.ai/changelog](https://zenmux.ai/changelog)
- Model catalog: [https://zenmux.ai/models](https://zenmux.ai/models)
:::
