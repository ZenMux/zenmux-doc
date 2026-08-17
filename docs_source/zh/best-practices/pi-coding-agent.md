---
head:
  - - meta
    - name: description
      content: 使用普通 API Key 或 @zenmux/pi-zenmux-oauth OAuth PKCE 扩展将 Pi Coding Agent 接入 ZenMux
  - - meta
    - name: keywords
      content: ZenMux, Pi Coding Agent, API Key, OAuth, PKCE, 编程 Agent, models.json
---

# Pi Coding Agent 接入 ZenMux

Pi Coding Agent 支持两种 ZenMux 接入方式：

| 方式 | 是否需要扩展 | 适用场景 |
| --- | --- | --- |
| 普通 API Key 配置 | 否 | 已有 ZenMux API Key，希望手动配置指定模型 |
| OAuth PKCE | `@zenmux/pi-zenmux-oauth` | 希望通过浏览器登录、自动刷新令牌并动态获取模型列表 |

## 安装 Pi Coding Agent

Pi 目前使用官方包 `@earendil-works/pi-coding-agent`，需要 Node.js 22.19.0 或更高版本：

```bash
npm install -g @earendil-works/pi-coding-agent
```

验证安装结果：

```bash
pi --version
```

::: warning 从旧包迁移
原来的 `@mariozechner/pi-coding-agent` 已弃用。如果系统中仍安装了旧包，请先卸载，再安装当前版本：

```bash
npm uninstall -g @mariozechner/pi-coding-agent
npm install -g @earendil-works/pi-coding-agent
```
:::

## 配置普通 API Key

这种方式直接使用 Pi 自带的自定义 Provider 能力，不需要安装 ZenMux OAuth 扩展。

首先设置 ZenMux API Key：

```bash
export ZENMUX_API_KEY="sk-ai-v1-xxx"
```

然后在 `~/.pi/agent/models.json` 中添加 `zenmux` Provider：

```json
{
  "providers": {
    "zenmux": {
      "baseUrl": "https://zenmux.ai/api/v1",
      "api": "openai-completions",
      "apiKey": "$ZENMUX_API_KEY",
      "models": [
        {
          "id": "deepseek-v4-flash",
          "name": "DeepSeek V4 Flash"
        }
      ]
    }
  }
}
```

如果 `models.json` 已经包含其他 Provider，请把 `zenmux` 合并到现有的 `providers` 对象中，不要覆盖整个文件。需要使用其他 ZenMux 模型时，在 `models` 数组中继续添加对应的模型 ID。

启动 Pi，运行 `/model`，选择 `zenmux/deepseek-v4-flash`。也可以在启动时直接选择：

```bash
pi --provider zenmux --model deepseek-v4-flash
```

这里的 `apiKey` 保存的是环境变量引用，不会把 API Key 本身写入 `models.json`。如果需要长期使用，请根据当前 Shell，把 export 命令加入 `~/.zshrc` 或 `~/.bashrc`，然后重新打开终端。

::: tip 为什么这里需要填写模型
Pi 的普通自定义 Provider 配置不会自动导入 ZenMux 模型目录，因此需要在 `models.json` 中列出要使用的模型。如果希望自动获取当前可用模型，请使用下面的 OAuth 方式。
:::

## 使用 OAuth PKCE

官方扩展 `@zenmux/pi-zenmux-oauth` 会在浏览器中打开 ZenMux 授权页面，不需要创建或复制 ZenMux API Key，并会自动刷新 OAuth Token。

使用 Pi 安装扩展：

```bash
pi install npm:@zenmux/pi-zenmux-oauth
```

启动 Pi 后登录：

```text
/login zenmux
```

在浏览器中确认授权。回调页面显示连接成功后返回 Pi，运行 `/model` 并选择 ZenMux 模型。

该扩展会：

- 动态获取 ZenMux 模型目录，并将最后一次有效目录缓存到 `~/.pi/agent/models-store.json`。
- 根据 ZenMux 为每个模型声明的协议，选择 Anthropic Messages、OpenAI Responses 或 Chat Completions。
- 在 Pi 的 Provider 凭据存储中保存 Access Token 与 Refresh Token，并保存轮换后的 Refresh Token。
- 仅申请 `inference:invoke` 和 `offline_access` 权限。

如需退出登录，在 Pi 中运行 `/logout` 并选择 ZenMux。也可以在 ZenMux 的已授权应用中撤销授权。

授权流程和凭据安全的详细说明请参阅 [OAuth PKCE 接入指南](/zh/best-practices/oauth-pkce)。

## 如何选择

| 能力 | 普通 API Key | OAuth PKCE |
| --- | --- | --- |
| 认证方式 | `ZENMUX_API_KEY` | 浏览器授权 |
| 额外扩展 | 不需要 | `@zenmux/pi-zenmux-oauth` |
| 模型配置 | 在 `models.json` 中添加模型 ID | 自动获取模型目录 |
| 协议选择 | 由 `models.json` 中的 `api` 决定 | 根据 ZenMux 模型目录逐模型选择 |
| 凭据生命周期 | 用户自行管理 | 自动刷新并轮换 Access Token |

## 常见问题

### 找不到 ZenMux 模型

使用普通 API Key 时，请确认：

- `~/.pi/agent/models.json` 是合法的 JSON。
- Provider 包含 `baseUrl`、`api` 和至少一个模型 ID。
- 启动 Pi 的同一个终端中存在 `ZENMUX_API_KEY`。

可以直接检查 Pi 已加载的模型：

```bash
pi --list-models zenmux
```

使用 OAuth 时，请确认扩展已经安装：

```bash
pi list
```

必要时更新扩展并重新登录：

```bash
pi update npm:@zenmux/pi-zenmux-oauth
```

### 浏览器已经打开，但授权无法完成

OAuth 回调使用 `127.0.0.1` 上的临时端口，浏览器和 Pi 必须访问同一台机器的回环地址。远程服务器、容器、SSH 会话或浏览器代理环境可能需要端口转发，或者改为在本机运行 Pi。

### 请求返回 401

- 普通 API Key：确认 `ZENMUX_API_KEY` 仍然有效，并且在启动 Pi 前已经导出。
- OAuth：重新运行 `/login zenmux`。如果仍然失败，请先在 ZenMux 已授权应用中撤销旧授权，再重新登录。

不要把 API Key 或 OAuth Token 粘贴到提示词、项目文件、日志或截图中。
