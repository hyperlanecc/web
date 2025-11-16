## 🚀 从零开始部署 Hyperlane 项目完整指南

由于您的服务器 `/root/app/hyperlane` 目前为空，以下是完整的部署步骤：

---

### 第一步：本地提交代码修改

```bash
# 在您的本地电脑上执行
git add deploy.sh .github/workflows/ docs/ DEPLOYMENT.md
git commit -m "chore: 迁移部署配置到 hyperlane/web 并切换到 pnpm"
git push origin main
```

---

### 第二步：服务器环境准备

```bash
# 1. SSH 登录服务器
ssh root@your-server-ip

# 2. 更新系统
sudo apt update && sudo apt upgrade -y

# 3. 安装基础工具
sudo apt install -y git curl wget

# 4. 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 5. 安装 pnpm
npm install -g pnpm

# 6. 安装 PM2
npm install -g pm2

# 7. 安装 Go 1.23
wget https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz
rm go1.23.0.linux-amd64.tar.gz

# 8. 配置 Go 环境变量
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# 9. 验证安装
node --version   # v20.x.x
pnpm --version   # 8.x.x
go version       # go1.23.0
pm2 --version    # 5.x.x
```

---

### 第三步：克隆项目

```bash
# 1. 进入目录
cd /root/app/hyperlane

# 2. 克隆项目（包含 server 子模块）
git clone --recurse-submodules https://github.com/hyperlanecc/web.git

# 3. 进入项目目录
cd /root/app/hyperlane/web

# 4. 验证项目结构
ls -la
# 应该看到：src/, public/, server/, deploy.sh, package.json 等

# 5. 验证子模块
ls -la server/
# 应该看到后端代码
```

---

### 第四步：配置环境变量

```bash
# 1. 前端环境变量
cd /root/app/hyperlane/web
cp .env.example .env
nano .env
# 根据需要填写环境变量

# 2. 后端环境变量（如果需要）
cd server
# 根据后端项目要求配置
```

---

### 第五步：配置后端 systemd 服务

```bash
# 1. 创建服务文件
sudo nano /etc/systemd/system/hyperlane-server.service

# 2. 粘贴以下内容：
[Unit]
Description=Hyperlane Backend Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/app/hyperlane/web/server
ExecStart=/root/app/hyperlane/web/server/app
Restart=always
RestartSec=10
StandardOutput=append:/var/log/hyperlane-server.log
StandardError=append:/var/log/hyperlane-server-error.log

[Install]
WantedBy=multi-user.target

# 3. 创建日志文件
sudo touch /var/log/hyperlane-server.log
sudo touch /var/log/hyperlane-server-error.log
sudo touch /var/log/hyperlane-deploy.log
sudo chmod 644 /var/log/hyperlane-*.log

# 4. 启用服务
sudo systemctl daemon-reload
sudo systemctl enable hyperlane-server
```

---

### 第六步：首次部署

```bash
# 1. 赋予执行权限
cd /root/app/hyperlane/web
chmod +x deploy.sh

# 2. 运行部署
bash deploy.sh

# 部署过程会自动：
# - 拉取代码
# - 更新子模块
# - 安装前端依赖（pnpm）
# - 构建前端
# - 编译后端
# - 启动 PM2 前端服务
# - 启动后端服务
```

---

### 第七步：验证部署

```bash
# 1. 检查前端（PM2）
pm2 status
pm2 logs frontend --lines 20

# 2. 检查后端（systemd）
sudo systemctl status hyperlane-server
sudo journalctl -u hyperlane-server -n 20

# 3. 检查端口
sudo netstat -tlnp | grep -E "3000|8080"

# 4. 测试访问
curl http://localhost:3000

# 5. 查看部署日志
tail -20 /var/log/hyperlane-deploy.log
```

---

### 第八步：配置 GitHub Actions（可选）

在 GitHub 仓库中配置 Secrets：
- 访问：`https://github.com/hyperlanecc/web/settings/secrets/actions`
- 添加：
  - `SERVER_HOST`: 服务器 IP
  - `SERVER_SSH_KEY`: SSH 私钥内容
  - `SERVER_USERNAME`: root

---

## ✅ 检查清单

- [ ] Node.js 20、pnpm、PM2、Go 1.23 已安装
- [ ] 项目已克隆到 `/root/app/hyperlane/web`
- [ ] 子模块已初始化
- [ ] 环境变量已配置
- [ ] systemd 服务已配置
- [ ] 首次部署成功
- [ ] 前端服务运行（`pm2 status` 显示 online）
- [ ] 后端服务运行（`systemctl status hyperlane-server` 显示 active）

---

## 🆘 常见问题

**子模块克隆失败：**
```bash
git submodule update --init --recursive --force
```

**PM2 服务启动失败：**
```bash
pm2 delete frontend
pm2 start pnpm --name frontend -- start --prefix /root/app/hyperlane/web
pm2 save
```

**后端编译失败：**
```bash
cd /root/app/hyperlane/web/server
go mod tidy
go build -v
```

---

完成后，网站可通过 `http://服务器IP:3000` 访问！

详细文档请查看项目中的 [`docs/next-steps.md`](docs/next-steps.md)。