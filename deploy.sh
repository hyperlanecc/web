#!/bin/bash
set -e

# ==================== 配置区域 ====================
# Git 仓库配置
GIT_REPO="git@github.com:hyperlane/web.git"
GIT_BRANCH="main"

# 部署目录
BASE_DIR="/root/app/hyperlane.cc"
BACKUP_DIR="${BASE_DIR}/.backups"
TMP_DIR="/tmp/hyperlane_deploy_$(date +%s)"

# 日志配置
LOG_FILE="/var/log/hyperlane-deploy.log"
LOG_MAX_SIZE=10485760  # 10MB

# 备份保留数量
BACKUP_KEEP=3

# 健康检查配置
HEALTH_CHECK_TIMEOUT=30
HEALTH_CHECK_RETRIES=3
FRONTEND_PORT=3000
BACKEND_PORT=8080

# 服务名称
FRONTEND_SERVICE="frontend"
BACKEND_SERVICE="hyperlane-server"

# ==================== 颜色定义 ====================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ==================== 日志函数 ====================
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date +'%Y-%m-%d %H:%M:%S')
    
    # 写入日志文件
    echo "[${timestamp}] [${level}] ${message}" >> "$LOG_FILE"
    
    # 控制台输出（带颜色）
    case $level in
        INFO)
            echo -e "${BLUE}ℹ${NC} ${message}"
            ;;
        SUCCESS)
            echo -e "${GREEN}✓${NC} ${message}"
            ;;
        WARNING)
            echo -e "${YELLOW}⚠${NC} ${message}"
            ;;
        ERROR)
            echo -e "${RED}✗${NC} ${message}"
            ;;
        STEP)
            echo -e "${PURPLE}▶${NC} ${message}"
            ;;
    esac
}

log_info() { log "INFO" "$@"; }
log_success() { log "SUCCESS" "$@"; }
log_warning() { log "WARNING" "$@"; }
log_error() { log "ERROR" "$@"; }
log_step() { log "STEP" "$@"; }

# ==================== 工具函数 ====================
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 未安装，请先安装"
        return 1
    fi
    return 0
}

check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    fi
    return 1
}

wait_for_port() {
    local port=$1
    local timeout=$2
    local retries=$3
    
    for i in $(seq 1 $retries); do
        if check_port $port; then
            return 0
        fi
        log_info "等待端口 $port 启动... ($i/$retries)"
        sleep $((timeout / retries))
    done
    return 1
}

health_check() {
    local url=$1
    local timeout=$2
    local retries=$3
    
    for i in $(seq 1 $retries); do
        if curl -f -s -m 5 "$url" > /dev/null 2>&1; then
            return 0
        fi
        log_info "健康检查中... ($i/$retries)"
        sleep $((timeout / retries))
    done
    return 1
}

get_current_commit() {
    cd "$BASE_DIR" 2>/dev/null || return 1
    git rev-parse HEAD 2>/dev/null || echo "unknown"
}

save_backup() {
    local commit=$(get_current_commit)
    local backup_name="backup_${commit}_$(date +%Y%m%d_%H%M%S)"
    local backup_path="${BACKUP_DIR}/${backup_name}"
    
    mkdir -p "$BACKUP_DIR"
    
    log_step "保存当前版本备份: $backup_name"
    
    # 备份关键文件
    mkdir -p "$backup_path"
    echo "$commit" > "$backup_path/commit.txt"
    
    if [ -f "${BASE_DIR}/server/app" ]; then
        cp "${BASE_DIR}/server/app" "$backup_path/app.backup"
    fi
    
    if [ -d "${BASE_DIR}/.next" ]; then
        tar -czf "$backup_path/frontend.tar.gz" -C "$BASE_DIR" .next node_modules 2>/dev/null || true
    fi
    
    log_success "备份已保存: $backup_path"
    echo "$backup_path"
}

cleanup_old_backups() {
    log_step "清理旧备份（保留最近 $BACKUP_KEEP 个）"
    
    if [ ! -d "$BACKUP_DIR" ]; then
        return 0
    fi
    
    local backup_count=$(ls -1 "$BACKUP_DIR" | wc -l)
    if [ $backup_count -le $BACKUP_KEEP ]; then
        log_info "当前备份数: $backup_count，无需清理"
        return 0
    fi
    
    ls -1t "$BACKUP_DIR" | tail -n +$((BACKUP_KEEP + 1)) | while read backup; do
        rm -rf "${BACKUP_DIR}/${backup}"
        log_info "已删除旧备份: $backup"
    done
    
    log_success "备份清理完成"
}

rollback() {
    log_error "部署失败，开始回滚..."
    
    if [ -z "$BACKUP_PATH" ] || [ ! -d "$BACKUP_PATH" ]; then
        log_error "未找到备份，无法回滚"
        return 1
    fi
    
    log_step "回滚到: $BACKUP_PATH"
    
    # 回滚后端
    if [ -f "$BACKUP_PATH/app.backup" ]; then
        cp "$BACKUP_PATH/app.backup" "${BASE_DIR}/server/app"
        chmod +x "${BASE_DIR}/server/app"
        systemctl restart $BACKEND_SERVICE 2>/dev/null || true
        log_success "后端已回滚"
    fi
    
    # 回滚前端
    if [ -f "$BACKUP_PATH/frontend.tar.gz" ]; then
        cd "$BASE_DIR"
        tar -xzf "$BACKUP_PATH/frontend.tar.gz"
        pm2 restart $FRONTEND_SERVICE 2>/dev/null || true
        log_success "前端已回滚"
    fi
    
    log_success "回滚完成"
}

# ==================== 清理函数 ====================
cleanup() {
    local exit_code=$?
    
    if [ $exit_code -ne 0 ]; then
        log_error "部署过程中发生错误 (退出码: $exit_code)"
        if [ "$SKIP_ROLLBACK" != "true" ]; then
            rollback
        fi
    fi
    
    # 清理临时目录
    if [ -d "$TMP_DIR" ]; then
        rm -rf "$TMP_DIR"
    fi
    
    exit $exit_code
}

trap cleanup EXIT INT TERM

# ==================== 环境检查 ====================
check_environment() {
    log_step "检查部署环境..."
    
    local has_error=0
    
    # 检查必要命令
    for cmd in git pnpm go pm2 systemctl curl; do
        if ! check_command $cmd; then
            has_error=1
        else
            log_success "$cmd 已安装"
        fi
    done
    
    # 检查日志文件大小
    if [ -f "$LOG_FILE" ]; then
        local log_size=$(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null || echo 0)
        if [ $log_size -gt $LOG_MAX_SIZE ]; then
            log_warning "日志文件过大，正在轮转..."
            mv "$LOG_FILE" "${LOG_FILE}.old"
            touch "$LOG_FILE"
        fi
    fi
    
    # 检查磁盘空间
    local disk_usage=$(df -h "$BASE_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $disk_usage -gt 90 ]; then
        log_warning "磁盘使用率过高: ${disk_usage}%"
    fi
    
    if [ $has_error -eq 1 ]; then
        log_error "环境检查失败，请安装缺失的工具"
        exit 1
    fi
    
    log_success "环境检查通过"
}

# ==================== Git 操作 ====================
setup_repository() {
    log_step "设置 Git 仓库..."
    
    if [ ! -d "$BASE_DIR/.git" ]; then
        log_info "首次部署，克隆仓库..."
        mkdir -p "$BASE_DIR"
        git clone --recurse-submodules "$GIT_REPO" "$BASE_DIR"
        cd "$BASE_DIR"
        git checkout "$GIT_BRANCH"
    else
        log_info "更新现有仓库..."
        cd "$BASE_DIR"
        
        # 保存本地更改（如果有）
        git stash save "Auto-stash before deploy $(date)" 2>/dev/null || true
        
        # 拉取最新代码
        git fetch origin "$GIT_BRANCH"
        git reset --hard "origin/$GIT_BRANCH"
        
        # 更新子模块
        git submodule update --init --recursive --remote
    fi
    
    local commit=$(git rev-parse HEAD)
    local commit_short=$(git rev-parse --short HEAD)
    local commit_msg=$(git log -1 --pretty=%B)
    
    log_success "当前版本: $commit_short"
    log_info "提交信息: $commit_msg"
}

# ==================== 前端部署 ====================
deploy_frontend() {
    log_step "开始部署前端..."
    
    # 在临时目录构建
    mkdir -p "$TMP_DIR/frontend"
    
    log_info "复制源代码到临时目录..."
    rsync -a --exclude='.git' --exclude='node_modules' --exclude='.next' \
        "$BASE_DIR/" "$TMP_DIR/frontend/"
    
    cd "$TMP_DIR/frontend"
    
    # 安装依赖
    log_info "安装前端依赖 (pnpm)..."
    pnpm install --frozen-lockfile
    
    # 构建
    log_info "构建 Next.js 应用..."
    pnpm run build
    
    # 同步到生产目录
    log_info "同步构建产物到生产目录..."
    rsync -a --delete "$TMP_DIR/frontend/.next/" "$BASE_DIR/.next/"
    rsync -a --delete "$TMP_DIR/frontend/node_modules/" "$BASE_DIR/node_modules/"
    
    # 重启服务
    log_info "重启前端服务..."
    if pm2 describe $FRONTEND_SERVICE >/dev/null 2>&1; then
        pm2 reload $FRONTEND_SERVICE --update-env
    else
        cd "$BASE_DIR"
        pm2 start pnpm --name $FRONTEND_SERVICE -- start
        pm2 save
    fi
    
    # 健康检查
    log_info "前端健康检查..."
    if ! wait_for_port $FRONTEND_PORT $HEALTH_CHECK_TIMEOUT $HEALTH_CHECK_RETRIES; then
        log_error "前端服务未能在指定时间内启动"
        return 1
    fi
    
    if ! health_check "http://localhost:$FRONTEND_PORT" $HEALTH_CHECK_TIMEOUT $HEALTH_CHECK_RETRIES; then
        log_error "前端健康检查失败"
        return 1
    fi
    
    log_success "前端部署成功"
}

# ==================== 后端部署 ====================
deploy_backend() {
    if [ ! -d "$BASE_DIR/server" ]; then
        log_warning "未找到后端目录，跳过后端部署"
        return 0
    fi
    
    log_step "开始部署后端..."
    
    cd "$BASE_DIR/server"
    
    # 下载依赖
    log_info "下载 Go 依赖..."
    go mod download
    
    # 编译
    log_info "编译 Go 应用..."
    mkdir -p "$TMP_DIR/backend"
    go build -o "$TMP_DIR/backend/app" -ldflags="-s -w" -v .
    
    # 替换二进制文件
    log_info "替换后端二进制文件..."
    if [ -f "$BASE_DIR/server/app" ]; then
        mv "$BASE_DIR/server/app" "$BASE_DIR/server/app.old"
    fi
    mv "$TMP_DIR/backend/app" "$BASE_DIR/server/app"
    chmod +x "$BASE_DIR/server/app"
    
    # 重启服务
    log_info "重启后端服务..."
    if systemctl is-active --quiet $BACKEND_SERVICE; then
        systemctl restart $BACKEND_SERVICE
    else
        log_warning "后端服务未运行，尝试启动..."
        systemctl start $BACKEND_SERVICE
    fi
    
    # 健康检查
    log_info "后端健康检查..."
    if ! wait_for_port $BACKEND_PORT $HEALTH_CHECK_TIMEOUT $HEALTH_CHECK_RETRIES; then
        log_error "后端服务未能在指定时间内启动"
        return 1
    fi
    
    # 尝试健康检查端点
    if health_check "http://localhost:$BACKEND_PORT/api/health" 5 2 || \
       health_check "http://localhost:$BACKEND_PORT/api/ping" 5 2; then
        log_success "后端健康检查通过"
    else
        log_warning "后端健康检查端点未响应，但服务已启动"
    fi
    
    log_success "后端部署成功"
}

# ==================== 部署摘要 ====================
print_summary() {
    local end_time=$(date +%s)
    local duration=$((end_time - START_TIME))
    
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ 部署完成${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "版本: ${BLUE}$(get_current_commit | cut -c1-8)${NC}"
    echo -e "分支: ${BLUE}$GIT_BRANCH${NC}"
    echo -e "耗时: ${BLUE}${duration}秒${NC}"
    echo -e "时间: ${BLUE}$(date +'%Y-%m-%d %H:%M:%S')${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "服务状态:"
    echo -e "  前端: ${GREEN}http://localhost:$FRONTEND_PORT${NC}"
    echo -e "  后端: ${GREEN}http://localhost:$BACKEND_PORT${NC}"
    echo ""
    echo "查看日志:"
    echo "  pm2 logs $FRONTEND_SERVICE"
    echo "  journalctl -u $BACKEND_SERVICE -f"
    echo ""
}

# ==================== 主函数 ====================
main() {
    START_TIME=$(date +%s)
    
    echo -e "${CYAN}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  🚀 Hyperlane 自动化部署"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${NC}"
    
    # 环境检查
    check_environment
    
    # 保存备份
    BACKUP_PATH=$(save_backup)
    
    # Git 操作
    setup_repository
    
    # 部署前端
    if [ "$BACKEND_ONLY" != "true" ]; then
        deploy_frontend
    fi
    
    # 部署后端
    if [ "$FRONTEND_ONLY" != "true" ]; then
        deploy_backend
    fi
    
    # 清理旧备份
    cleanup_old_backups
    
    # 打印摘要
    print_summary
    
    log_success "所有部署任务完成"
}

# ==================== 命令行参数 ====================
show_help() {
    cat << EOF
Hyperlane 自动化部署脚本

用法: $0 [选项]

选项:
    --branch <分支名>       部署指定分支 (默认: main)
    --tag <标签名>          部署指定 tag
    --frontend-only         仅部署前端
    --backend-only          仅部署后端
    --skip-health-check     跳过健康检查
    --skip-rollback         失败时不自动回滚
    --rollback              回滚到上一个版本
    --history               查看部署历史
    --clean-backups         清理所有备份
    --help                  显示此帮助信息

示例:
    $0                      # 标准部署
    $0 --branch develop     # 部署 develop 分支
    $0 --frontend-only      # 仅部署前端
    $0 --rollback           # 回滚到上一版本

EOF
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --branch)
            GIT_BRANCH="$2"
            shift 2
            ;;
        --tag)
            GIT_TAG="$2"
            shift 2
            ;;
        --frontend-only)
            FRONTEND_ONLY=true
            shift
            ;;
        --backend-only)
            BACKEND_ONLY=true
            shift
            ;;
        --skip-health-check)
            HEALTH_CHECK_TIMEOUT=0
            shift
            ;;
        --skip-rollback)
            SKIP_ROLLBACK=true
            shift
            ;;
        --rollback)
            BACKUP_PATH=$(ls -1t "$BACKUP_DIR" 2>/dev/null | head -1)
            if [ -n "$BACKUP_PATH" ]; then
                BACKUP_PATH="${BACKUP_DIR}/${BACKUP_PATH}"
                rollback
                exit 0
            else
                log_error "未找到可用的备份"
                exit 1
            fi
            ;;
        --history)
            echo "部署历史:"
            ls -1t "$BACKUP_DIR" 2>/dev/null | while read backup; do
                if [ -f "${BACKUP_DIR}/${backup}/commit.txt" ]; then
                    commit=$(cat "${BACKUP_DIR}/${backup}/commit.txt")
                    echo "  - $backup (commit: ${commit:0:8})"
                fi
            done
            exit 0
            ;;
        --clean-backups)
            rm -rf "$BACKUP_DIR"
            log_success "所有备份已清理"
            exit 0
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            log_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 执行主函数
main
