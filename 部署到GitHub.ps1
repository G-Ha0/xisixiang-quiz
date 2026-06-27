# 毛概习概刷题系统 - GitHub Pages 一键部署脚本
# 使用方法：
# 1. 确保已安装 Git 并注册 GitHub 账号
# 2. 在 GitHub 上创建一个新仓库（例如：maogai-quiz）
# 3. 修改下面的 USERNAME 和 REPO 变量
# 4. 右键选择 "使用 PowerShell 运行" 或在 PowerShell 中执行

$USERNAME = "你的GitHub用户名"   # 改成你的 GitHub 用户名
$REPO = "maogai-quiz"           # 仓库名，可自定义

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  毛概习概刷题系统 - 部署到 GitHub Pages" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($USERNAME -eq "你的GitHub用户名") {
    Write-Host "[错误] 请先修改脚本中的 USERNAME 变量为你的 GitHub 用户名！" -ForegroundColor Red
    Write-Host "       右键编辑此文件 -> 编辑，修改第 7 行" -ForegroundColor Yellow
    Read-Host "按回车退出"
    exit 1
}

Write-Host "[1/5] 初始化 Git 仓库..." -ForegroundColor Green

if (-not (Test-Path .git)) {
    git init
} else {
    Write-Host "       已存在 Git 仓库，跳过初始化"
}

Write-Host "[2/5] 添加文件并提交..." -ForegroundColor Green
git add -A
git commit -m "Initial commit: 毛概习概刷题系统"

Write-Host ""
Write-Host "[3/5] 添加远程仓库..." -ForegroundColor Green
$remoteUrl = "https://github.com/$USERNAME/$REPO.git"

$remotes = git remote
if ($remotes -contains "origin") {
    git remote set-url origin $remoteUrl
} else {
    git remote add origin $remoteUrl
}

Write-Host ""
Write-Host "[4/5] 推送到 GitHub..." -ForegroundColor Green
git branch -M main
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[错误] 推送失败！" -ForegroundColor Red
    Write-Host "可能的原因：" -ForegroundColor Yellow
    Write-Host "  1. 仓库还未创建，请先在 github.com 上创建仓库 $REPO"
    Write-Host "  2. 用户名错误"
    Write-Host "  3. 没有配置 Git 认证"
    Write-Host ""
    Write-Host "解决方法：" -ForegroundColor Yellow
    Write-Host "  - 先去 https://github.com/new 创建仓库（选 Public）"
    Write-Host "  - 仓库名填: $REPO"
    Write-Host "  - 不要勾选 Initialize this repository with a README"
    Write-Host "  - 创建好后再重新运行此脚本"
    Read-Host "按回车退出"
    exit 1
}

Write-Host ""
Write-Host "[5/5] 启用 GitHub Pages..." -ForegroundColor Green
Write-Host "请手动在 GitHub 仓库页面上启用 Pages：" -ForegroundColor Yellow
Write-Host "  1. 打开：https://github.com/$USERNAME/$REPO/settings/pages"
Write-Host "  2. Source 选择 Deploy from a branch"
Write-Host "  3. Branch 选择 main / (root)"
Write-Host "  4. 点击 Save"
Write-Host ""
Write-Host "等待 1-2 分钟后，访问：" -ForegroundColor Green
$pagesUrl = "https://$USERNAME.github.io/$REPO/"
Write-Host "  $pagesUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "按回车退出"
