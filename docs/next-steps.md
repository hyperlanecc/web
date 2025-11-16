# 🚀 后续操作指南

代码修改已完成，现在需要按照以下步骤进行部署配置。

## 📝 第一步：提交代码更改

```bash
# 查看修改的文件
git status

# 添加修改的文件
git add deploy.sh .github/workflows/ci.yml .github/workflows/deploy.yml docs/

# 提交更改
git commit -m "chore:  hyperlane/web

- 更新服务器路径为 /root/app/hyperlane/web
- 更新后端目录为 server（匹配 git 子模块）
- 更新后端服务名为 hyperlane-server
- 升级 Node.js 到 20，Go 到 1.23
- 增强部署脚本的日志和错误处理
- 添加 Git 子模块自动更新功能"

# 推送到远程仓库
git push origin main
```

## 🖥️ 第二步：服务器端配置

### 2.1 确认服务器路径

```bash
# SSH 登录服务器
ssh root@your-server-ip

# 检查项目目录是否存在
ls -la /root/app/hyperlane/

# 如果不存在，创建并克隆项目
sudo mkdir -p /root/app/hyperlane
cd /root/app/hyperlane
git clone --recurse-submodules git@github.com:hyperlanecc/web.git

# 或者如果已经有旧项目，可以重命名
cd /root/app
mv hyperlane/web  # 重命名旧目录
```

### 2.2 检查并更新 systemd 服务配置

```bash
# 检查服务文件是否存在
sudo cat /etc/systemd/system/hyperlane-server.service

# 如果不存在或名称不对，创建/更新服务文件
sudo nano /etc/systemd/system/hyperlane-server.service
```

**服务文件内容应该是：**

```ini
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
```

**启用服务：**

```bash
# 重新加载 systemd 配置
sudo systemctl daemon-reload

# 启用服务（开机自启）
sudo systemctl enable hyperlane-server

# 如果有旧的 hyperlane-server 服务，停止并禁用它
sudo systemctl stop hyperlane-server 2>/dev/null
sudo systemctl disable hyperlane-server 2>/dev/null
```

### 2.3 配置日志目录权限

```bash
# 确保日志文件可写
sudo touch /var/log/hyperlane-deploy.log
sudo touch /var/log/hyperlane-server.log
sudo touch /var/log/hyperlane-server-error.log
sudo chmod 644 /var/log/hyperlane-*.log
```

### 2.4 安装 pnpm（如果尚未安装）

```bash
# 安装 pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

### 2.5 检查 PM2 配置

```bash
# 查看当前 PM2 进程
pm2 list

# 如果有旧的 frontend 进程，可以保留或删除
# 删除旧进程（可选）
pm2 delete frontend

# 保存 PM2 配置
pm2 save
```

### 2.6 赋予部署脚本执行权限

```bash
cd /root/app/hyperlane/web
chmod +x deploy.sh
```

## 🔑 第三步：更新 GitHub Secrets

在 GitHub 仓库设置中更新或确认以下 Secrets：

1. **进入仓库设置**
   - 访问：`https://github.com/hyperlanecc/web/settings/secrets/actions`

2. **检查/更新以下 Secrets：**

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `SERVER_HOST` | 您的服务器 IP 或域名 | 例如：`192.168.1.100` |
| `SERVER_SSH_KEY` | SSH 私钥内容 | 完整的私钥（包括 BEGIN/END） |
| `SERVER_USERNAME` | `root` | SSH 用户名（可选，默认 root） |
| `SERVER_PORT` | `22` | SSH 端口（可选，默认 22） |

## 🧪 第四步：测试部署

### 4.1 手动测试部署脚本

```bash
# 在服务器上手动运行部署脚本
cd /root/app/hyperlane/web
bash deploy.sh
```

**检查输出：**
- ✅ 是否成功拉取代码
- ✅ 是否成功更新子模块
- ✅ 前端是否正确构建
- ✅ 后端是否正确编译
- ✅ PM2 和 systemd 服务是否正常启动

**查看日志：**

```bash
# 部署日志
tail -f /var/log/hyperlane-deploy.log

# 前端日志
pm2 logs frontend

# 后端日志
sudo journalctl -u hyperlane-server -f
```

### 4.2 测试 GitHub Actions 自动部署

```bash
# 在本地进行一个小改动（如修改 README）
echo "\n## 测试自动部署" >> README.md
git add README.md
git commit -m "test: 测试自动部署"
git push origin main
```

**在 GitHub 上查看：**
1. 进入 Actions 页面：`https://github.com/hyperlanecc/web/actions`
2. 观察 CI Build Check 是否通过
3. 观察 Deploy to Production 是否成功触发并执行

## 🔍 第五步：验证部署结果

### 5.1 检查服务状态

```bash
# 检查前端服务
pm2 status

# 检查后端服务
sudo systemctl status hyperlane-server

# 检查端口监听
sudo netstat -tlnp | grep -E "3000|8080"
```

### 5.2 测试网站访问

```bash
# 测试前端
curl http://localhost:3000

# 测试后端 API
curl http://localhost:8080/api/health  # 根据实际 API 路径调整
```

## ✅ 检查清单

完成部署前，请确认以下事项：

- [ ] 代码已提交并推送到 GitHub
- [ ] 服务器路径已更新为 `/root/app/hyperlane/web`
- [ ] systemd 服务文件已正确配置
- [ ] 日志文件路径已创建并有写权限
- [ ] deploy.sh 有执行权限
- [ ] GitHub Secrets 已正确配置
- [ ] 手动部署测试成功
- [ ] GitHub Actions 自动部署测试成功
- [ ] 前后端服务都正常运行
- [ ] 网站可以正常访问

## 🆘 常见问题排查

### 问题 1：部署脚本报错 "子模块更新失败"

```bash
# 解决方案：手动重新初始化子模块
cd /root/app/hyperlane/web
git submodule deinit -f server
git submodule update --init --recursive
```

### 问题 2：后端服务启动失败

```bash
# 检查详细错误
sudo journalctl -u hyperlane-server -n 50 --no-pager

# 检查二进制文件是否存在
ls -la /root/app/hyperlane/web/server/app

# 手动测试后端
cd /root/app/hyperlane/web/server
./app
```

### 问题 3：前端 PM2 服务无法启动

```bash
# 删除并重新创建
pm2 delete frontend
pm2 start pnpm --name frontend -- start --prefix /root/app/hyperlane/web
pm2 save
```

### 问题 4：GitHub Actions 部署失败

1. 检查 Actions 日志中的错误信息
2. 确认 SSH 密钥正确配置
3. 确认服务器路径存在
4. 手动 SSH 到服务器测试连接

## 📚 相关文档

- [部署配置详细文档](./DEPLOYMENT.md)
- [修改计划文档](./docs/deploy-modification-plan.md)
- [项目 README](../README.md)

## 💡 下一步优化建议

部署成功后，可以考虑以下优化：

1. **配置 Nginx 反向代理**（参考 DEPLOYMENT.md）
2. **配置 SSL 证书**（使用 Let's Encrypt）
3. **设置监控和告警**（如 PM2 Plus、Prometheus）
4. **配置自动备份**（数据库和配置文件）
5. **优化日志轮转**（使用 logrotate）

---

如有任何问题，请查看日志文件或联系技术支持。