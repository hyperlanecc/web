#!/bin/bash
set -e

# ================= 配置 =================
PROJECT_NAME="hyperlane"
BASE_DIR=/root/app/hyperlane/web
BACKEND_DIR=server
BACKEND_SERVICE=hyperlane-server
FRONTEND_SERVICE=frontend
TMP_DIR=/tmp/deploy_$(date +%s)
LOG_FILE=/var/log/hyperlane-deploy.log

# ================= 日志函数 =================
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ ERROR: $1" | tee -a $LOG_FILE >&2
    exit 1
}

# ================= 磁盘空间检查 =================
log "🔍 检查磁盘空间..."

# 检查 /tmp 目录可用空间（至少需要 1GB）
TMP_AVAILABLE=$(df /tmp | tail -1 | awk '{print $4}')
if [ $TMP_AVAILABLE -lt 1048576 ]; then
    error "磁盘空间不足！/tmp 目录可用空间: $(($TMP_AVAILABLE/1024))MB，至少需要: 1GB"
fi

# 检查项目目录可用空间（至少需要 2GB）
BASE_AVAILABLE=$(df $BASE_DIR | tail -1 | awk '{print $4}')
if [ $BASE_AVAILABLE -lt 2097152 ]; then
    error "磁盘空间不足！项目目录可用空间: $(($BASE_AVAILABLE/1024))MB，至少需要: 2GB"
fi

log "✓ 磁盘空间充足 (可用: /tmp=$(($TMP_AVAILABLE/1024))MB, 项目目录=$(($BASE_AVAILABLE/1024))MB)"

# ================= 开始部署 =================
log "🚀 开始部署 $PROJECT_NAME..."
mkdir -p $TMP_DIR

# 拉取最新代码
log "🔄 拉取最新代码..."
git -C $BASE_DIR reset --hard || error "Git reset 失败"
git -C $BASE_DIR pull origin main || error "Git pull 失败"

# 更新子模块
log "🔄 更新 Git 子模块..."
git -C $BASE_DIR submodule update --init --recursive || error "子模块更新失败"

# ================= 前端 =================
log "📦 构建前端到临时目录..."
cp -r $BASE_DIR $TMP_DIR/frontend || error "复制前端代码失败"
cd $TMP_DIR/frontend

log "📦 安装前端依赖..."
pnpm install || error "前端依赖安装失败"

log "🔨 构建前端..."
pnpm run build || error "前端构建失败"

log "🚀 同步前端到生产目录..."
rsync -a --delete $TMP_DIR/frontend/.next/ $BASE_DIR/.next/ || error "前端同步失败"
rsync -a --delete $TMP_DIR/frontend/node_modules/ $BASE_DIR/node_modules/ || error "依赖同步失败"

log "♻️ 热重载前端服务..."
pm2 describe $FRONTEND_SERVICE >/dev/null 2>&1 \
  && pm2 reload $FRONTEND_SERVICE \
  || pm2 start pnpm --name $FRONTEND_SERVICE -- start --prefix $BASE_DIR

# ================= 后端 =================
log "🔨 构建后端到临时目录..."
mkdir -p $TMP_DIR/backend
cd $BASE_DIR/$BACKEND_DIR

log "📦 安装后端依赖..."
go mod download || error "后端依赖下载失败"

log "🔨 编译后端..."
go build -o $TMP_DIR/backend/app || error "后端构建失败"

log "♻️ 替换后端二进制..."
mv $TMP_DIR/backend/app $BASE_DIR/$BACKEND_DIR/app || error "后端二进制替换失败"

log "♻️ 重启后端服务..."
systemctl restart $BACKEND_SERVICE || error "后端服务重启失败"

# ================= 清理 =================
log "🧹 清理临时文件..."
rm -rf $TMP_DIR

log "✅ 部署完成！"
log "前端服务: $FRONTEND_SERVICE (PM2)"
log "后端服务: $BACKEND_SERVICE (systemd)"

