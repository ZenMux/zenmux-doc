#!/bin/bash
# filepath: /Users/hugehard/project/tbox_doc/generate_ssh_keys.sh

# SSH密钥生成脚本
# 用于为不同的域名/服务生成独立的SSH密钥对

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# SSH目录
SSH_DIR="$HOME/.ssh"

# 确保SSH目录存在
if [ ! -d "$SSH_DIR" ]; then
    print_info "创建SSH目录: $SSH_DIR"
    mkdir -p "$SSH_DIR"
    chmod 700 "$SSH_DIR"
fi

# 生成SSH密钥的函数
generate_ssh_key() {
    local domain_name="$1"
    local email="$2"
    local key_type="${3:-ed25519}"
    
    if [ -z "$domain_name" ] || [ -z "$email" ]; then
        print_error "域名和邮箱不能为空"
        return 1
    fi
    
    # 密钥文件名
    local key_file="$SSH_DIR/id_${key_type}_${domain_name}"
    
    # 检查密钥是否已存在
    if [ -f "$key_file" ]; then
        print_warning "密钥文件已存在: $key_file"
        read -p "是否覆盖? (y/N): " overwrite
        if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
            print_info "跳过生成密钥: $domain_name"
            return 0
        fi
    fi
    
    print_info "为 $domain_name 生成 $key_type 密钥..."
    
    # 生成密钥
    ssh-keygen -t "$key_type" \
               -C "$email" \
               -f "$key_file" \
               -N ""
    
    # 设置正确的权限
    chmod 600 "$key_file"
    chmod 644 "$key_file.pub"
    
    print_info "密钥生成完成:"
    print_info "  私钥: $key_file"
    print_info "  公钥: $key_file.pub"
    
    # 显示公钥内容
    echo
    print_info "公钥内容 ($domain_name):"
    cat "$key_file.pub"
    echo
}

# 更新SSH配置的函数
update_ssh_config() {
    local config_file="$SSH_DIR/config"
    local backup_file="$SSH_DIR/config.backup.$(date +%Y%m%d_%H%M%S)"
    
    # 备份现有配置
    if [ -f "$config_file" ]; then
        print_info "备份现有SSH配置到: $backup_file"
        cp "$config_file" "$backup_file"
    fi
    
    print_info "更新SSH配置文件: $config_file"
    
    # 创建或更新配置文件
    cat > "$config_file" << 'EOF'
# SSH配置文件
# 自动生成，用于不同域名使用不同的SSH密钥

# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    IdentitiesOnly yes

# GitLab
Host gitlab.com
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_ed25519_gitlab
    IdentitiesOnly yes

# 公司GitLab (示例)
Host gitlab.company.com
    HostName gitlab.company.com
    User git
    IdentityFile ~/.ssh/id_ed25519_company
    IdentitiesOnly yes

# 个人服务器 (示例)
Host myserver.com
    HostName myserver.com
    User root
    IdentityFile ~/.ssh/id_ed25519_myserver
    Port 22

# Bitbucket
Host bitbucket.org
    HostName bitbucket.org
    User git
    IdentityFile ~/.ssh/id_ed25519_bitbucket
    IdentitiesOnly yes

EOF
    
    chmod 600 "$config_file"
    print_info "SSH配置文件已更新"
}

# 主菜单
show_menu() {
    echo
    print_info "=== SSH密钥管理工具 ==="
    echo "1. 生成GitHub密钥"
    echo "2. 生成GitLab密钥"
    echo "3. 生成公司GitLab密钥"
    echo "4. 生成Bitbucket密钥"
    echo "5. 生成自定义密钥"
    echo "6. 批量生成常用密钥"
    echo "7. 更新SSH配置文件"
    echo "8. 查看现有密钥"
    echo "9. 退出"
    echo
}

# 查看现有密钥
list_keys() {
    print_info "现有SSH密钥:"
    ls -la "$SSH_DIR"/id_* 2>/dev/null || print_warning "未找到SSH密钥文件"
}

# 批量生成常用密钥
batch_generate() {
    read -p "请输入你的邮箱地址: " email
    if [ -z "$email" ]; then
        print_error "邮箱地址不能为空"
        return 1
    fi
    
    print_info "开始批量生成常用SSH密钥..."
    
    generate_ssh_key "github" "$email"
    generate_ssh_key "gitlab" "$email"
    generate_ssh_key "bitbucket" "$email"
    
    print_info "批量生成完成"
    update_ssh_config
}

# 生成自定义密钥
generate_custom_key() {
    read -p "请输入域名/服务名称 (如: company, myserver): " domain
    read -p "请输入邮箱地址: " email
    read -p "请选择密钥类型 (ed25519/rsa) [ed25519]: " key_type
    
    key_type=${key_type:-ed25519}
    
    if [ -z "$domain" ] || [ -z "$email" ]; then
        print_error "域名和邮箱不能为空"
        return 1
    fi
    
    generate_ssh_key "$domain" "$email" "$key_type"
}

# 主程序
main() {
    if [ "$#" -eq 0 ]; then
        # 交互式模式
        while true; do
            show_menu
            read -p "请选择操作 [1-9]: " choice
            
            case $choice in
                1)
                    read -p "请输入邮箱地址: " email
                    generate_ssh_key "github" "$email"
                    ;;
                2)
                    read -p "请输入邮箱地址: " email
                    generate_ssh_key "gitlab" "$email"
                    ;;
                3)
                    read -p "请输入公司GitLab域名 (如: gitlab.company.com): " company_domain
                    read -p "请输入邮箱地址: " email
                    domain_name=$(echo "$company_domain" | sed 's/.*\.\([^.]*\)\.\([^.]*\)$/\1/')
                    generate_ssh_key "$domain_name" "$email"
                    ;;
                4)
                    read -p "请输入邮箱地址: " email
                    generate_ssh_key "bitbucket" "$email"
                    ;;
                5)
                    generate_custom_key
                    ;;
                6)
                    batch_generate
                    ;;
                7)
                    update_ssh_config
                    ;;
                8)
                    list_keys
                    ;;
                9)
                    print_info "退出程序"
                    exit 0
                    ;;
                *)
                    print_error "无效选择，请输入 1-9"
                    ;;
            esac
        done
    else
        # 命令行模式
        case "$1" in
            "generate")
                if [ "$#" -lt 3 ]; then
                    print_error "用法: $0 generate <domain> <email> [key_type]"
                    exit 1
                fi
                generate_ssh_key "$2" "$3" "${4:-ed25519}"
                ;;
            "config")
                update_ssh_config
                ;;
            "list")
                list_keys
                ;;
            "batch")
                if [ "$#" -lt 2 ]; then
                    print_error "用法: $0 batch <email>"
                    exit 1
                fi
                # 使用传入的邮箱进行批量生成
                email="$2"
                generate_ssh_key "github" "$email"
                generate_ssh_key "gitlab" "$email"
                generate_ssh_key "bitbucket" "$email"
                update_ssh_config
                ;;
            *)
                echo "用法: $0 [generate <domain> <email> [key_type] | config | list | batch <email>]"
                echo "或者直接运行脚本进入交互模式"
                exit 1
                ;;
        esac
    fi
}

# 运行主程序
main "$@"