# Hyperlane 中文社区

Hyperlane 中文社区官方网站，基于 [Next.js](https://nextjs.org) 构建。

## 项目简介

这是 Hyperlane 中文社区的官方网站，提供：
- 📚 Hyperlane 技术文档
- 🎯 社区活动和黑客松
- 📝 技术博客分享
- 🌐 生态系统展示

## 技术栈

- **前端**: Next.js 15 + TypeScript + React
- **后端**: Go (作为子模块引入)
- **样式**: CSS Modules
- **部署**: Vercel / 自托管

## 快速开始

### 1. 克隆项目（包含子模块）

```bash
# 克隆项目及所有子模块
git clone --recurse-submodules https://github.com/hyperlanecc/web.git

# 如果已经克隆但没有子模块，可以执行：
git submodule update --init --recursive
```

### 2. 安装前端依赖

```bash
cd web
npm install
# 或
pnpm install
# 或
yarn install
```

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

### 4. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 5. 后端服务（可选）

后端代码位于 `server/` 子模块目录：

```bash
cd server

# 复制配置文件
cp config.example.yaml config/config.yaml
# 编辑配置文件

# 运行后端服务
go run main.go

# 或编译后运行
go build -o app
./app
```

## Git 子模块管理

本项目使用 Git 子模块管理后端代码。

### 更新子模块到最新版本

```bash
# 更新所有子模块到最新提交
git submodule update --remote

# 或进入子模块目录手动拉取
cd server
git pull origin main
cd ..
```

### 查看子模块状态

```bash
git submodule status
```

### 提交包含子模块的更改

```bash
# 1. 先提交子模块的更改（如果有）
cd server
git add .
git commit -m "Update submodule"
git push
cd ..

# 2. 然后在主项目中提交子模块引用的更新
git add server
git commit -m "Update server submodule"
git push
```

## 项目结构

```
.
├── src/
│   ├── pages/          # Next.js 页面
│   ├── components/     # React 组件
│   ├── styles/         # 样式文件
│   ├── docs/          # Markdown 文档
│   └── lib/           # 工具函数
├── public/            # 静态资源
├── server/            # 后端服务（Git 子模块）
├── .github/           # GitHub Actions 配置
└── deploy.sh          # 部署脚本
```

## 部署

📚 **详细部署配置请查看 [DEPLOYMENT.md](DEPLOYMENT.md)**

### 1. Vercel 部署（推荐用于前端）

#### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hyperlanecc/web)

#### GitHub Actions 自动部署

项目已配置 Vercel 自动部署 workflow（[`.github/workflows/vercel.yml`](.github/workflows/vercel.yml)）。

**配置步骤：**

1. 在 Vercel 创建项目并获取凭证：
   ```bash
   # 安装 Vercel CLI
   npm i -g vercel
   
   # 登录并链接项目
   vercel link
   
   # 获取项目信息
   vercel project ls
   ```

2. 在 GitHub 仓库设置中添加以下 Secrets：
   - `VERCEL_TOKEN`: Vercel 访问令牌
   - `VERCEL_ORG_ID`: 组织 ID
   - `VERCEL_PROJECT_ID`: 项目 ID

3. 推送代码即可自动部署：
   - `main` 分支 → 生产环境
   - `dev` 分支 → 预览环境
   - Pull Request → 预览环境（自动评论预览链接）

### 2. 自托管部署

#### 自动部署（推荐）

使用 GitHub Actions 自动部署到自托管服务器（[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)）。

**配置步骤：**

1. 在 GitHub 仓库设置中添加以下 Secrets：
   - `SERVER_HOST`: 服务器 IP 或域名
   - `SERVER_USERNAME`: SSH 用户名（默认: root）
   - `SERVER_SSH_KEY`: SSH 私钥
   - `SERVER_PORT`: SSH 端口（可选，默认: 22）

2. 推送到 `main` 分支自动触发部署

#### 手动部署

```bash
# SSH 到服务器
ssh user@your-server

# 进入项目目录
cd /root/app/hyperlane.cc

# 运行部署脚本
bash deploy.sh
```

**部署脚本功能：**
- ✅ 拉取最新代码和子模块
- ✅ 安装依赖并构建前端
- ✅ 编译 Go 后端
- ✅ 使用 PM2 重载前端服务
- ✅ 重启后端 systemd 服务
- ✅ 完整的日志记录
- ✅ 错误处理和回滚支持

**服务器环境要求：**
- Node.js 20+
- Go 1.22+
- PM2 (用于前端服务管理)
- systemd (用于后端服务管理)

## 贡献指南

欢迎为 Hyperlane 中文社区贡献代码！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 相关链接

- 🌐 [Hyperlane 官网](https://www.hyperlane.xyz/)
- 📖 [Hyperlane 文档](https://docs.hyperlane.xyz/)
- 🐦 [Twitter/X](https://x.com/hyperlanecc)
- 💬 [Telegram](https://t.me/hyperlanecc)
- 💻 [后端仓库](https://github.com/hyperlanecc/server)

## 许可证

MIT License

## 致谢

感谢所有为 Hyperlane 中文社区做出贡献的开发者！
