---
title: VitePress + GitHub Pages 建站完整手记
date: 2026-11-25
tags: [VitePress, GitHub Pages, 建站, 教程]
---

# VitePress + GitHub Pages 建站完整手记

从零开始搭一个个人网站，技术栈：VitePress + GitHub + GitHub Actions。本文记录完整流程和所有踩过的坑，方便复现。

## 最终架构

- **框架**：VitePress 1.6.x（静态站点生成器，Markdown 驱动）
- **包管理**：pnpm（锁版本 9.15.0）
- **托管**：GitHub Pages（免费，自动 HTTPS）
- **部署**：GitHub Actions（push 到 main 自动构建发布）
- **本地路径**：`C:\Users\86130\luobida-site`
- **线上地址**：https://luobida974-star.github.io

## 前置准备

### 1. 注册 GitHub

- 官网 `github.com` 注册，用户名慎重选择（决定默认域名 `<用户名>.github.io`）
- 必须完成邮箱验证
- 建议开启两步验证（2FA）

**坑 1：假冒的"GitHub 中文社区"**

搜索 GitHub 时可能点进第三方镜像站（如 gitcn.org），它们会弹出"Authorize GitHub中文社区"的 OAuth 授权页。**这不是官方流程，直接 Cancel**。GitHub 没有官方中文社区，认准 `github.com` 域名。

### 2. 安装环境（Windows PowerShell）

```powershell
winget install OpenJS.NodeJS.LTS    # Node.js 22
winget install Git.Git
npm install -g pnpm                  # 包管理器