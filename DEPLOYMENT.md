# 部署配置指南

本文档说明如何配置 Hyperlane 中文社区网站的各种部署选项。

## GitHub Secrets 配置

在 GitHub 仓库的 Settings → Secrets and variables → Actions 中添加以下 secrets：

### Vercel 部署所需 Secrets

| Secret 名称 | 描述 | 获取方式 |
|------------|------|---------|
| `VERCEL_TOKEN` | Vercel 访问令牌 | 1. 访问 [Vercel Settings → Tokens](https://vercel.com/account/tokens)<br>2. 创建新 token<br>3. 复制 token 值 |
| `VERCEL_ORG_ID` | Vercel 组织 ID | 1. 运行 `vercel link`<br>2. 查看 `.vercel/project.json` 文件<br>3. 复制 `orgId` 值 |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID | 1. 运行 `vercel link`<br>2. 查看 `.vercel/project.json` 文件<br>3. 复制 `projectId` 值 |

### 自托管服务器部署所需 Secrets

| Secret 名称 | 描述 | 示例值 |
|------------|------|-------|
| `SERVER_HOST` | 服务器 IP 或域名 | `192.168.1.100` 或 `server.example.com` |
| `SERVER_USERNAME` | SSH 用户名 | `root` 或 `ubuntu` |
| `SERVER_SSH_KEY` | SSH 私钥 | 完整的私钥内容（包括 `-----BEGIN` 和 `-----END`） |
| `SERVER_PORT` | SSH 端口（可选） | `22`（默认值，可不设置） |

## Vercel 部署配置

### 1. 本地配置

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 链接项目（在项目根目录执行）
vercel link

# 查看项目信息
cat .vercel/project.json
```

### 2. 环境变量配置

在 Vercel 项目设置中添加以下环境变量（如果需要）：

```bash
# 数据库配置
DATABASE_URL=your_database_url

# 认证配置
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_secret_key

# 第三方服务
CLOUDINARY_URL=your_cloudinary_url
```

### 3. 构建配置

Vercel 会自动检测 Next.js 项目。如需自定义，在 `vercel.json` 中配置：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"]
}
```

## 自托管服务器配置

### 1. 服务器环境准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 Go 1.22
wget https://go.dev/dl/go1.22.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# 安装 PM2
sudo npm install -g pm2

# 配置 PM2 开机启动
pm2 startup
pm2 save
```

### 2. 克隆项目

```bash
# 创建项目目录
sudo mkdir -p /root/app
cd /root/app

# 克隆项目（包含子模块）
git clone --recurse-submodules git@github.com:hyperlanecc/web.git hyperlane.cc
cd hyperlane.cc
```

### 3. 配置后端服务

创建 systemd 服务文件：

```bash
sudo nano /etc/systemd/system/hyperlane-server.service
```

添加以下内容：

```ini
[Unit]
Description=Hyperlane Backend Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/app/hyperlane.cc/server
ExecStart=/root/app/hyperlane.cc/server/app
Restart=always
RestartSec=10
StandardOutput=append:/var/log/hyperlane-server.log
StandardError=append:/var/log/hyperlane-server-error.log

[Install]
WantedBy=multi-user.target
```

启用并启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable hyperlane-server
sudo systemctl start hyperlane-server
```

### 4. 配置环境变量

```bash
# 复制环境变量文件
cp .env.example .env

# 编辑环境变量
nano .env
```

### 5. 首次部署

```bash
# 赋予部署脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
bash deploy.sh
```

### 6. 配置 Nginx（可选）

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # 前端（Next.js）
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 日志查看

### 前端日志
```bash
# PM2 日志
pm2 logs frontend

# 查看最近日志
pm2 logs frontend --lines 100
```

### 后端日志
```bash
# systemd 日志
journalctl -u hyperlane-server -f

# 输出日志
tail -f /var/log/hyperlane-server.log

# 错误日志
tail -f /var/log/hyperlane-server-error.log
```

### 部署日志
```bash
# 查看部署日志
tail -f /var/log/hyperlane-deploy.log
```

## 故障排查

### 前端无法访问
```bash
# 检查 PM2 状态
pm2 status

# 重启前端
pm2 restart frontend

# 查看详细错误
pm2 logs frontend --err
```

### 后端无法访问
```bash
# 检查服务状态
systemctl status hyperlane-server

# 重启服务
systemctl restart hyperlane-server

# 查看详细日志
journalctl -u hyperlane-server -n 50 --no-pager
```

### Git 子模块问题
```bash
# 重新初始化子模块
git submodule deinit -f server
git submodule update --init --recursive

# 强制更新子模块
git submodule update --remote --force
```

## 持续集成/持续部署（CI/CD）

项目包含三个 GitHub Actions workflows：

1. **CI Build Check** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml))
   - 触发：推送到 `main`/`dev` 分支或 Pull Request
   - 功能：构建前端和后端，运行测试

2. **Deploy to Vercel** ([`.github/workflows/vercel.yml`](.github/workflows/vercel.yml))
   - 触发：推送到 `main`/`dev` 分支或 Pull Request
   - 功能：自动部署到 Vercel

3. **Deploy to Self-Hosted Server** ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
   - 触发：CI 成功后自动触发（仅 `main` 分支）
   - 功能：SSH 到服务器并运行部署脚本

## 安全建议

1. ✅ 定期更新依赖包
2. ✅ 使用强密码和 SSH 密钥认证
3. ✅ 配置防火墙规则
4. ✅ 启用 SSL/TLS
5. ✅ 定期备份数据库和配置文件
6. ✅ 监控日志异常活动
7. ✅ 使用环境变量存储敏感信息

## 参考资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [PM2 文档](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)