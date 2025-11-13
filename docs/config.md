好的 ✅ 以下是根据你当前部署情况（前端网址 `https://hyperlane.cc`、后端服务器 `https://172.237.71.71`）整理好的 **`.env`** 和 **`config.yml`** 最终正确配置。

---

### 🧩 `.env`（前端环境变量）

```bash
# GitHub OAuth 登录入口
NEXT_PUBLIC_OAUTH=https://github.com/login/oauth/authorize?client_id=你的_CLIENT_ID&redirect_uri=https://172.237.71.71/api/auth/callback&scope=read:user,user:email
```

> ⚠️ 注意：
>
> * `redirect_uri` 必须与你在 GitHub Developer Settings → OAuth App 中配置的 **“Authorization callback URL”** 完全一致。
> * 前端会重定向到这个 URL，GitHub 登录成功后会带上 `?code=xxxx`。

---

### ⚙️ `config.yml`（后端配置）

```yaml
oauth:
  provider: github
  clientId: 你的_CLIENT_ID
  clientSecret: 你的_CLIENT_SECRET
  accessApi: https://github.com/login/oauth/access_token
  getUser: https://api.github.com/user
  redirectUri: https://172.237.71.71/api/auth/callback
  frontendUri: https://hyperlane.cc
```

---

### 🪄 同步 GitHub 上的配置

请前往 [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers)
编辑你的应用，保持以下内容一致：

| 项目                             | 值                                         |
| ------------------------------ | ----------------------------------------- |
| **Homepage URL**               | `https://hyperlane.cc`                    |
| **Authorization callback URL** | `https://172.237.71.71/api/auth/callback` |

---
