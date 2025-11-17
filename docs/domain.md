恭喜部署成功！🎉 现在服务已经在运行：
- ✅ 前端：3000 端口
- ✅ 后端：8080 端口

接下来配置域名访问的完整步骤：

## 📋 配置检查清单

### 第一步：域名 DNS 解析配置

1. **登录域名注册商管理后台**（如阿里云、腾讯云、Cloudflare 等）

2. **添加 A 记录**，指向您的服务器 IP：

   | 类型 | 主机记录 | 记录值 | TTL |
   |------|---------|--------|-----|
   | A | @ | YOUR_SERVER_IP | 600 |
   | A | www | YOUR_SERVER_IP | 600 |

   - `@` 表示根域名（如 `hyperlane.cc`）
   - `www` 表示带 www 的域名（如 `www.hyperlane.cc`）

3. **验证 DNS 解析**（需要等待 5-30 分钟生效）：
   ```bash
   # 检查 DNS 是否解析成功
   nslookup hyperlane.cc
   nslookup www.hyperlane.cc
   
   # 或使用 dig 命令
   dig hyperlane.cc
   ```

### 第二步：安装 Nginx

```bash
# 安装 Nginx
sudo apt update
sudo apt install nginx -y

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx

# 检查 Nginx 版本
nginx -v
```

### 第三步：配置 Nginx 反向代理

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/hyperlane.cc
```

添加以下内容（替换 `hyperlane.cc` 为您的实际域名）：

```nginx
# HTTP 重定向到 HTTPS（稍后添加 SSL 后启用）
server {
    listen 80;
    listen [::]:80;
    server_name hyperlane.cc www.hyperlane.cc;

    # 临时配置，用于测试和申请 SSL 证书
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API 后端代理
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**启用配置**：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/hyperlane.cc /etc/nginx/sites-enabled/

# 删除默认配置（可选）
sudo rm /etc/nginx/sites-enabled/default

# 测试配置是否正确
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 第四步：安装 SSL 证书（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 自动申请和配置 SSL 证书
sudo certbot --nginx -d hyperlane.cc -d www.hyperlane.cc

# 按照提示操作：
# 1. 输入邮箱地址
# 2. 同意服务条款 (A)
# 3. 选择是否重定向 HTTP 到 HTTPS（建议选 2 - Redirect）
```

**Certbot 会自动**：
- 申请 SSL 证书
- 修改 Nginx 配置添加 HTTPS
- 配置自动续期

**测试自动续期**：
```bash
sudo certbot renew --dry-run
```

### 第五步：优化后的 Nginx 配置

SSL 证书配置成功后，完整的 Nginx 配置应该类似：

```nginx

# HTTP 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name hyperlane.cc www.hyperlane.cc;
    return 301 https://$server_name$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on; 
    server_name hyperlane.cc www.hyperlane.cc;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/hyperlane.cc/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hyperlane.cc/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # 安全头（重要！）
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;



    # 后端 API
    location /api/v1/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置（保留！）
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Next.js 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置（避免请求超时）
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态资源缓存（提升性能）
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 第六步：配置防火墙

```bash
# 允许 HTTP 和 HTTPS 流量
sudo ufw allow 'Nginx Full'

# 或手动开放端口
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 查看状态
sudo ufw status
```

### 第七步：验证配置

```bash
# 1. 检查 Nginx 配置
sudo nginx -t

# 2. 重新加载 Nginx
sudo systemctl reload nginx

# 3. 检查 Nginx 状态
sudo systemctl status nginx

# 4. 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 第八步：浏览器测试

1. 访问 `http://hyperlane.cc` - 应该自动跳转到 HTTPS
2. 访问 `https://hyperlane.cc` - 显示您的网站
3. 检查 SSL 证书是否有效（浏览器地址栏应显示🔒）

## 🔧 常用命令

```bash
# 重启 Nginx
sudo systemctl restart nginx

# 重新加载配置（不中断服务）
sudo systemctl reload nginx

# 查看 Nginx 状态
sudo systemctl status nginx

# 测试配置文件
sudo nginx -t

# 查看实时日志
sudo tail -f /var/log/nginx/error.log

# 续期 SSL 证书（自动）
sudo certbot renew
```

## 📝 注意事项

1. **DNS 解析时间**：可能需要 5-30 分钟，请耐心等待
2. **SSL 证书**：Let's Encrypt 证书有效期 90 天，Certbot 会自动续期
3. **备份配置**：修改配置前先备份
4. **查看日志**：遇到问题先查看 Nginx 和应用日志

完成这些步骤后，您的网站就可以通过域名访问了！🚀