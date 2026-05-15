---
head:
  - - meta
    - name: description
      content: Data Services & ZDR Mode
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, data services, ZDR, Zero Data Retention, privacy, logging
---

# Data Services

Data Services is ZenMux's core data management toggle that controls whether the platform stores and processes your request data on its servers. When enabled, it unlocks advanced features such as AI insurance claims, request detail viewing, and cross-device Chat sync. When disabled, your account enters **ZDR (Zero Data Retention) mode**, where all data is stored only in your local browser.

::: tip Privacy First
ZDR mode is ideal for users with strict data privacy requirements. With Data Services turned off, ZenMux does not retain your request content or conversation history on its servers, providing maximum data privacy protection.
:::

## Features Unlocked by Data Services

With Data Services enabled, you can access the following advanced features:

| Feature              | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| **AI Insurance Claims** | When an API request fails due to an upstream outage, the system automatically evaluates and provides compensation |
| **Request Details**     | View full details of each API request on the Logs page, including request parameters, response content, latency, and token usage |
| **Cross-device Chat Sync** | Chat conversation history is stored in the cloud, enabling seamless sync across multiple devices and browsers |
| **Video Task Sync**       | Video generation tasks in Video Studio are stored in the cloud, allowing you to check task status and results from any device |

## ZDR (Zero Data Retention) Mode

When Data Services is turned off, your account enters ZDR mode. In this mode:

- **No request data uploaded**: API request content is not stored on ZenMux servers
- **Conversations stored locally only**: Chat sessions are saved in the browser's local storage (IndexedDB)
- **Video tasks stored locally only**: Video Studio generation tasks are saved only in the current browser
- **Advanced features unavailable**: Features that depend on server-side data, such as AI insurance claims and request detail viewing, will be unavailable

::: warning Data Storage Risk
In ZDR mode, conversation history and video tasks are stored only in the current browser. Clearing browser data, switching browsers, or changing devices will result in **permanent data loss** that cannot be recovered. Please proceed with caution.
:::

## Configuration

### Enable or Disable Data Services

1. Visit the [ZenMux Strategy Settings page](https://zenmux.ai/settings/strategy)
2. Find the **Data Services** toggle at the top of the page
3. Toggle the switch to enable or disable
4. Changes take effect immediately

<!-- ![Data Services settings](https://cdn.marmot-cloud.com/storage/zenmux/2025/xx/xx/data-services.png) -->

::: tip Instant Effect
Toggling Data Services takes effect immediately — no page refresh or app restart required.
:::

## How It Works

### Session Storage Mechanism

The Data Services toggle determines how **newly created sessions** are stored:

- Sessions created **with Data Services enabled** → stored in the cloud with cross-device sync
- Sessions created **with Data Services disabled** → stored only in the local browser

::: details Important: Session Storage Mode Cannot Be Changed

Each session's storage mode is determined **at creation time** and does not change when you toggle Data Services:

- Local sessions created in ZDR mode will **remain locally stored** even if you later enable Data Services
- Cloud sessions created with Data Services enabled will **remain cloud-synced** even if you later disable Data Services

This means toggling Data Services does not affect existing sessions — it only affects newly created ones.

:::

### Session Type Identification

In the Chat sidebar, you can identify the storage type by the session icon:

| Icon | Meaning |
| ---- | ------- |
| ☁️ Cloud icon | Cloud-synced session — data stored on the server |
| 🖥️ Desktop icon | Local session — data stored only in the current browser |

### API Calls

For API calls (non-Chat):

- **Data Services enabled**: Request details are recorded on the Logs page for debugging and analysis; AI insurance uses request records for claim evaluation
- **Data Services disabled**: Requests are routed and responded to normally, but no details are recorded — the Logs page will show no corresponding data

## FAQ

### Q: Will disabling Data Services affect my API calls?

A: No. Disabling Data Services only affects data storage and advanced features — it **does not affect normal API routing and responses**. Your API requests will continue to be processed as usual, and core features like model fallback and provider routing remain fully functional.

### Q: What happens to existing Chat sessions after toggling Data Services?

A: Existing sessions are not affected. Each session's storage mode is determined at creation time and does not change afterward. Disabling Data Services only causes **newly created sessions** to use local storage — existing cloud sessions will continue to sync normally.

### Q: Where is local data stored in ZDR mode?

A: Data is stored in the browser's IndexedDB. This means the data is tied to a specific browser — clearing browser data, using incognito mode, or switching devices will result in data loss.

### Q: How can I migrate local sessions to the cloud?

A: Currently, migrating already-created local sessions to the cloud is not supported. If you need cross-device sync, enable Data Services first and then create new sessions.

### Q: Can I use AI insurance with Data Services disabled?

A: No. AI insurance claims rely on server-side request records to evaluate claim conditions. In ZDR mode, since no server-side data is retained, the insurance feature cannot function.

### Q: Does the Data Services toggle affect billing?

A: No. Regardless of whether Data Services is enabled, API call billing remains the same. Data Services only controls data storage and the availability of advanced features.

::: tip Contact Us
If you encounter any issues or have suggestions and feedback, feel free to reach out through the following channels:

- **Website**: <https://zenmux.ai>
- **Support email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord community**: <http://discord.gg/vHZZzj84Bm>

For more contact options and details, visit our [Contact Us page](/help/contact).
:::
