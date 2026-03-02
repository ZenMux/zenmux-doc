# Deploying OpenClaw on Alibaba Cloud and Integrating ZenMux: A Hands-on Guide

> With [ZenMux](https://zenmux.ai/), you can be among the first to try:
>
> - **OpenAI GPT-5.2** — A general-purpose LLM with top-tier code generation and logical reasoning
> - **Anthropic Claude Sonnet 4.6** — Ultra-long context, ideal for complex document processing
> - **Google Gemini 3.1 Pro** — Native multimodal support with strong image-and-text understanding
>
> 💡 **No need to register separately for overseas platforms like OpenAI, Google, or Anthropic**—one ZenMux account covers it all, so you can skip complicated credit card binding and regional restrictions.
>
> ⚠️ **Security warning**: Per the current [OpenClaw Secure Usage Guidelines](https://s.antgroup-inc.cn/home/talk/articleDetail?regionId=100001&id=20900001), ZenMux is an external model service. Direct use is **prohibited** in internal office environments. If you want to try it out, deploy in a **non-office environment**, such as an Alibaba Cloud server or a personal Mac mini.

## Deploy OpenClaw

> Deploying OpenClaw itself isn’t complicated. If you don’t have a spare Mac, a cloud server is a good option. Cloud servers are online 24/7, don’t suffer from power outages, and don’t consume your local machine’s resources. Major cloud providers also offer one-click OpenClaw deployment solutions. This guide uses Alibaba Cloud and costs only ~~RMB 68/year~~ (it seems the promotion has ended; you can purchase monthly to try it out).

[Deploy the OpenClaw image and build a DingTalk AI employee](https://help.aliyun.com/zh/simple-application-server/use-cases/quickly-deploy-and-use-openclaw)

Follow Alibaba Cloud’s documentation and you should be able to finish deployment quickly. Note that the DingTalk referenced in the docs is not Ant DingTalk. Currently, the app application process for Ant DingTalk is relatively cumbersome, so you can first follow the doc to integrate with DingTalk (create an enterprise using your personal DingTalk account, then access the DingTalk Open Platform).

> **Alibaba Cloud integrates Bailian API Key by default**, which comes with some free quota—enough to get the Web UI and DingTalk integration working.

## Configure ZenMux

### Prerequisites

1. OpenClaw has been deployed on the server and is running properly
2. You have registered a ZenMux account and obtained an API key

---

### Step 1: Get a ZenMux API Key

1. Log in to the [ZenMux Console](https://zenmux.ai)
2. Go to the **API Keys** page
3. Click **Create new key**
4. Copy the generated key (format: `sk-ss-v1-xxxx` or `sk-ai-v1-xxxx`)

> Notes:
>
> - Prefix `sk-ss-v1-`: Subscription plan (monthly billing)
> - Prefix `sk-ai-v1-`: Pay-as-you-go plan

---

### Step 2: Edit the OpenClaw Configuration

Log in to the server and edit `~/.openclaw/openclaw.json` (default path on Alibaba Cloud servers is `/home/admin/.openclaw`). Update the `models` and `agents` sections:

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "zenmux": {
        "baseUrl": "https://zenmux.ai/api/v1",
        "apiKey": "sk-ss-v1-replace-with-your-zenmux-api-key",
        "api": "openai-completions",
        "models": [
          {
            "id": "openai/gpt-5.2",
            "name": "GPT-5.2 via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "google/gemini-3.1-pro-preview",
            "name": "Gemini 3.1 Pro via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "anthropic/claude-sonnet-4.6",
            "name": "Claude Sonnet 4.6 via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "zenmux/openai/gpt-5.2"
      },
      "models": {
        "zenmux/openai/gpt-5.2": {},
        "zenmux/google/gemini-3.1-pro-preview": {},
        "zenmux/anthropic/claude-sonnet-4.6": {}
      }
    }
  }
}
```

---

### Step 3: Verify the Configuration

Run on the server:

```bash
# View the list of available models
openclaw models list
```

A successful setup means ZenMux models like `zenmux/openai/gpt-5.2` appear in the list.

Example output:

```
NAME                                PROVIDER    ID
openai/gpt-5.2                      zenmux      openai/gpt-5.2
google/gemini-3.1-pro-preview       zenmux      google/gemini-3.1-pro-preview
anthropic/claude-sonnet-4.6         zenmux      anthropic/claude-sonnet-4.6
```

Then run:

```bash
# Set the default model
openclaw models set zenmux/openai/gpt-5.2

# Test a conversation
openclaw agent --local --agent main --message "Hello, just testing"
```

---

## Additional Configuration

The following configuration is strongly recommended: web search & Browser.

> In theory, you can also ask OpenClaw to install these via chat, but in my experience it can end up breaking itself 😅. In the end, I installed Claude Code on the server to help me debug OpenClaw. Below is the ~~old-school~~ manual setup process.

---

### Web Search Configuration (Tavily)

The Alibaba Cloud OpenClaw app image comes with a built-in web search Skill based on SearXNG, but in practice it often times out or fails to find results. The officially recommended Brave has a relatively high registration cost, so **Tavily** is recommended here. It’s easy to sign up and provides 1,000 free requests per month.

#### Step 1: Sign Up and Get an API Key

Go to the [Tavily website](https://tavily.com) to register, then retrieve your API key from the console.

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/VAVtdUO/1772450803550-28c2a035-c83a-4bbc-95fb-5d2cc6e31551.png)

> Tip: You can also click **Generate MCP Link** and send the generated link to OpenClaw to have it automatically add the MCP service.

#### Step 2: Install the Tavily Plugin

```bash
openclaw plugins install openclaw-tavily
```

#### Step 3: Restart the Gateway

```bash
openclaw gateway restart
```

#### Step 4: Configure the Plugin

Edit `~/.openclaw/openclaw.json` and add:

```json
{
  "plugins": {
    "entries": {
      "openclaw-tavily": {
        "enabled": true,
        "config": {
          "apiKey": "tvly-..."
        }
      }
    }
  }
}
```

#### Step 5: Verify the Configuration

Just tell OpenClaw to prefer Tavily for web search going forward.

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/xB6mFxR/1772451999609-01d4ca0e-4816-4c5f-8a30-ed67e1497260.png)

---

### Browser Configuration

The Browser tool allows OpenClaw to directly control a browser for page visits, screenshots, automation, and more.

> The steps below apply only to CentOS/OpenCloudOS environments (Alibaba Cloud ECS default OS).

#### Step 1: Install Google Chrome

```bash
sudo yum install -y wget
sudo yum install -y https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
```

If installation fails, install dependencies first:

```bash
sudo yum install -y nss atk cups-libs libdrm libXcomposite libXdamage libXrandr libgbm alsa-lib pango gtk3
sudo yum install -y liberation-fonts xdg-utils google-noto-sans-cjk-fonts
```

#### Step 2: Install Chinese Fonts

```bash
sudo yum install -y fontconfig freetype
sudo yum install -y google-noto-sans-cjk-fonts
sudo yum install -y wqy-microhei
sudo fc-cache -f -v
```

Verify fonts:

```bash
fc-list | grep -i -E "noto|cjk|wqy|wenquanyi" | head
```

#### Step 3: Configure Browser Options

```bash
openclaw config set browser.executablePath "/usr/bin/google-chrome"
openclaw config set browser.defaultProfile "openclaw"
openclaw config set browser.headless true
openclaw config set browser.noSandbox true
```

#### Step 4: Restart the Gateway

```bash
openclaw gateway restart
```

#### Step 5: Verify the Configuration

```bash
openclaw browser status
```

Expected output: `running: true`, and it no longer shows `browser: unknown`.
Use OpenClaw Browser to take a screenshot of any Chinese website (e.g., Baidu). If Chinese renders correctly, the setup is successful.

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/dbqgTic/1772453669779-f6645b05-3dee-4898-9463-4c51340e8c78.png)

---

### DingTalk AI Card Configuration

OpenClaw supports DingTalk AI interactive cards, enabling streaming output, reasoning display, and more.

> Prerequisite: You have completed the basic configuration of the DingTalk app and bot.

#### Step 1: Create an AI Card Template

1. Visit the [DingTalk Card Platform](https://open-dev.dingtalk.com/fe/card)
2. Create a new template → select the **AI Card** type → associate your DingTalk app
3. Make no changes—just save and publish
4. Record the template ID for later configuration

#### Step 2: Enable Card Permissions

Go to the DingTalk [App Development](https://open-dev.dingtalk.com/fe/app) page, select your app, and enable the following under **Permission Management**:

| Permission              | Description                              |
| ----------------------- | ---------------------------------------- |
| ✅ Card.Instance.Write  | Create and deliver card instances        |
| ✅ Card.Streaming.Write | Streaming update permission for AI cards |

#### Step 3: Configure OpenClaw

Edit `~/.openclaw/openclaw.json` and update `channels.dingtalk`:

```json
{
  "channels": {
    "dingtalk": {
      "enabled": true,
      "clientId": "dingxxxxxx",
      "clientSecret": "your-app-secret",
      "robotCode": "dingxxxxxx",
      "messageType": "card",
      "cardTemplateId": "xxxxxx",
      "cardTemplateKey": "content",
      "dmPolicy": "open",
      "groupPolicy": "open"
    }
  }
}
```

#### Key Configuration Parameters

| Parameter       | Required | Description                                 |
| --------------- | -------- | ------------------------------------------- |
| clientId        | ✅       | DingTalk app AppKey                         |
| clientSecret    | ✅       | DingTalk app AppSecret                      |
| messageType     | ❌       | `markdown` (default) or `card`              |
| cardTemplateId  | ❌       | AI card template ID                         |
| cardTemplateKey | ❌       | Card content field; default is `content`    |
| dmPolicy        | ❌       | DM policy: `open` / `pairing` / `allowlist` |
| groupPolicy     | ❌       | Group policy: `open` / `allowlist`          |

#### Step 4: Restart and Verify

```bash
openclaw gateway restart
```

Run a conversation test in DingTalk. If you see the card-based interactive UI, the configuration is successful.

## Use Cases

### Scheduled Task: Monitoring New ZenMux Models

Set up a scheduled task to check daily whether ZenMux has released new models, so you can try the latest capabilities as soon as possible.

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/5DA3il2/1772453969722-39c7383b-0a19-464f-bbbb-ec7d1f5f460a.png)

In the Web UI, you can see the configured scheduled tasks and manually trigger them to validate the logic.

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/1KIV8iV/1772453390450-a9905ca5-7984-4f2e-bc8b-dec693bca70c.png)

Actual result: the bot automatically pushes new model announcements to the DingTalk group.

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/Ar04e0Q/1772454079027-0ec93b6d-2a1c-496e-b236-bb98d415ba58.png)

## Related Resources

- [ZenMux Documentation](https://zenmux.ai/docs/best-practices/openclaw.html)
- [OpenClaw Documentation](https://openclaw.io/docs)
- [OpenClaw GitHub](https://github.com/openclaw)
- [Tavily Website](https://tavily.com)

## Contact Us

If you encounter any issues during use, or have suggestions and feedback, please contact us through the following channels:

::: tip Get Help

- **Official Website**: <https://zenmux.ai>
- **Technical Support Email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Cooperation Email**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contacts and details, visit our [Contact Us page](/help/contact).
:::