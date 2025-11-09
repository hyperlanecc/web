#!/bin/bash
set -e

# ================= 配置 =================
BASE_DIR=/root/app/hyperlane.cc
TMP_DIR=/tmp/deploy_$(date +%s)
LOG_FILE=/var/log/hyperlane-deploy.log

# 日志函数
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" | tee -a "$LOG_FILE" >&2
}

# 错误处理
cleanup() {
    if [ $? -ne 0 ]; then
        log_error "部署失败，正在清理..."
    fi
    rm -rf "$TMP_DIR"
}
trap cleanup EXIT

mkdir -p "$TMP_DIR"

# ================= Git 更新 =================
log "🔄 拉取最新代码..."
cd "$BASE_DIR"
git fetch origin main
git reset --hard origin/main

# 更新子模块
log "📦 更新 Git 子模块..."
git submodule update --init --recursive --remote

# ================= 前端 =================
log "📦 构建前端到临时目录..."
cp -r "$BASE_DIR" "$TMP_DIR/frontend"
cd "$TMP_DIR/frontend"

log "📥 安装前端依赖..."
npm ci --production=false

log "🔨 构建 Next.js..."
npm run build

log "🚀 同步前端到生产目录..."
rsync -a --delete \
    --exclude='.git' \
    --exclude='server' \
    --exclude='node_modules' \
    --exclude='.next' \
    "$TMP_DIR/frontend/" "$BASE_DIR/"

# 复制构建产物
rsync -a "$TMP_DIR/frontend/.next/" "$BASE_DIR/.next/"
rsync -a "$TMP_DIR/frontend/node_modules/" "$BASE_DIR/node_modules/"

log "♻️ 热重载前端服务..."
if pm2 describe frontend >/dev/null 2>&1; then
    pm2 reload frontend
    log "✅ 前端服务已重载"
else
    pm2 start npm --name frontend -- start --prefix "$BASE_DIR"
    log "✅ 前端服务已启动"
fi

# ================= 后端 =================
if [ -d "$BASE_DIR/server" ]; then
    log "🔨 构建后端到临时目录..."
    mkdir -p "$TMP_DIR/backend"
    cd "$BASE_DIR/server"
    
    log "📥 下载 Go 依赖..."
    go mod download
    
    log "🔧 编译 Go 后端..."
    go build -o "$TMP_DIR/backend/app" -v .
    
    log "♻️ 替换后端二进制..."
    if [ -f "$BASE_DIR/server/app" ]; then
        mv "$BASE_DIR/server/app" "$BASE_DIR/server/app.backup.$(date +%s)"
    fi
    mv "$TMP_DIR/backend/app" "$BASE_DIR/server/app"
    chmod +x "$BASE_DIR/server/app"
    
    log "♻️ 重启后端服务..."
    if systemctl is-active --quiet hyperlane-server; then
        systemctl restart hyperlane-server
        log "✅ 后端服务已重启"
    else
        log "⚠️ 后端服务未运行，跳过重启"
    fi
else
    log "⚠️ 未找到后端目录，跳过后端部署"
fi

# ================= 清理 =================
log "🧹 清理临时文件..."
rm -rf "$TMP_DIR"

log "✅ 部署完成！"
log "-----------------------------------"
