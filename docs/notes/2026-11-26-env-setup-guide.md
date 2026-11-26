---
title: 新电脑环境配置手册（简约步骤版）
date: 2026-11-26
tags: [环境配置, CUDA, PyTorch, YOLO]
---

# 新电脑环境配置手册（简约步骤版）

[下载完整文档 (PDF)](/files/env-setup-guide.pdf)

> 适用：Windows 10/11 · RTX 5060 8GB（40/50 系通用）· CUDA 12.8
> 全程约 3 小时 | 每步有【通过信号】，不对就停

---

## 第 0 步 · 准备与自查

**准备项**

| 项 | 要求 |
|:---|:---|
| 硬件 | NVIDIA 显卡 + 管理员账号 |
| 文件 | `requirements_yolo_utf8.txt` 放 `E:\env_backup\`（无 E 盘放 C:） |
| 网络 | 能访问清华镜像 + pytorch.org |
| 终端 | **Anaconda PowerShell Prompt**（非 cmd / 非普通 PS） |

**自查（全过再开工）**

- [ ] E 盘存在（或已决定用方案 B 全走 C 盘）
- [ ] `dir E:\env_backup` 显示 `requirements_yolo_utf8.txt`（非 `.txt.txt`）
- [ ] `nvidia-smi` 能识别显卡

**环境隔离**

| 环境 | 路径 | 用途 | Python |
|:---|:---|:---|:---|
| yolo | `E:\anaconda3\envs\yolo` | 训练+推理+主程序 | 3.12 |
| label | `E:\py-project\venvs\label` | AnyLabeling 标注 | 3.11 |
| base | `E:\anaconda3` | conda 宿主，不装项目包 | - |

---

## 第 1 步 · 磁盘决策（已分盘跳过）

仅 C 盘时：`Win+X` → 磁盘管理 → 压缩 C: 卷 `204800`（200GB）→ 新建简单卷 E

✅ **信号**：资源管理器出现 E: 盘

---

## 第 2 步 · NVIDIA 驱动

装 ≥ 572.xx（RTX 50 系硬性要求）。NVIDIA App 或官网下载，选"自定义→清洁安装"，重启。

```powershell
nvidia-smi
```

✅ **信号**：显示 Driver Version ≥ 572.xx，识别 RTX 5060

---

## 第 3 步 · Anaconda

1. 清华镜像下载 `Anaconda3-xxxx-Windows-x86_64.exe`
2. 安装：Just Me → 路径 `E:\anaconda3` → **不勾 Add to PATH** → **不勾 Register default Python**
3. 打开 Anaconda PowerShell Prompt：

```powershell
conda --version
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
conda config --set show_channel_urls yes
```

✅ **信号**：`conda --version` 有版本号

---

## 第 4 步 · YOLO 训练环境（核心）

### 4.1 建环境

```powershell
conda create -n yolo python=3.12 -y
conda activate yolo
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

✅ **信号**：提示符变 `(yolo)`

### 4.2 核查清单（必做）

```powershell
dir E:\env_backup
# 必须显示 requirements_yolo_utf8.txt（非 .txt.txt），否则 ren 去掉一层扩展名

(Get-Content E:\env_backup\requirements_yolo_utf8.txt) -replace '^contourpy==1\.4\.0$','contourpy==1.3.3' | Set-Content -Encoding ASCII E:\env_backup\requirements_yolo_utf8.txt
findstr /n "contourpy" E:\env_backup\requirements_yolo_utf8.txt
```

✅ **信号**：输出 `5:contourpy==1.3.3`

### 4.3 一键安装（46 包，约 3GB）

```powershell
pip install -r E:\env_backup\requirements_yolo_utf8.txt --no-deps --extra-index-url https://download.pytorch.org/whl/cu128
```

**关键参数**：
- `--no-deps`：跳过 opencv/numpy 元数据冲突
- `--extra-index-url .../cu128`：解析 torch 本地版本号

✅ **信号**：`Successfully installed ... torch-2.11.0+cu128 ...`（46 个包）

**下载中断**：勿动窗口等自动续传；红色 ERROR 后重跑同命令

### 4.4 门禁验证

```powershell
python -c "import torch, numpy, cv2, ultralytics, PySide6; print(torch.__version__, torch.cuda.is_available(), numpy.__version__, cv2.__version__)"
```

✅ **信号**：`2.11.0+cu128 True 1.26.4 5.0.0.93`

❌ `False` → 驱动问题或 CPU 版，重装 torch
❌ `import cv2` 报错 → `pip install numpy==2.2.6` 兜底

---

## 第 5 步 · PyCharm

1. 官网下载 2023.3.7 Professional（学生邮箱免费激活）
2. 绑定解释器：`Settings → Python Interpreter → Add → Conda Environment → Use existing → E:\anaconda3\envs\yolo\python.exe`
   - 下拉为空 → 改选 System Interpreter 同路径
3. 设置：File Encodings 全 UTF-8；Edit Configurations 勾 "Emulate terminal"
4. 验证：新建 `test_env.py` 运行

```python
import torch
print(torch.__version__, torch.cuda.is_available())
```

✅ **信号**：右下角 `Python 3.12 (yolo)`，输出 `2.11.0+cu128 True`

---

## 第 6 步 · Label 标注环境（必须 Python 3.11）

```powershell
conda create -p E:\py-project\venvs\label python=3.11 -y
conda activate E:\py-project\venvs\label
python -c "import sys; print(sys.executable); print(sys.version)"
# 硬性标准：路径含 venvs\label，版本 3.11.x

pip install anylabeling==0.4.43 imgviz==2.0.0 "matplotlib<3.8"
anylabeling
```

✅ **信号**：弹出 AnyLabeling 窗口

> 红线：此环境绝不装 torch；matplotlib<3.8 防只读色图 bug

---

## 第 7 步 · 验收与收尾

**四项全绿 = 成功**

| # | 标志 | 验证 |
|:---|:---|:---|
| 1 | 驱动就位 | `nvidia-smi` ≥ 572.xx |
| 2 | yolo 可用 | `python -c "import torch;print(torch.__version__,torch.cuda.is_available())"` → `2.11.0+cu128 True` |
| 3 | PyCharm 绑定 | 右下角 `Python 3.12 (yolo)` |
| 4 | 标注可用 | `anylabeling` 弹窗 |

**收尾**：PyCharm 内置终端执行（避 PS 5.1 UTF-16 坑）

```powershell
pip freeze > E:\env_backup\requirements_yolo_<姓名日期>.txt
```

---

## 附录 · 故障速查

| 现象 | 处置 |
|:---|:---|
| `conda activate yolo` 报 EnvironmentNameNotFound | 先 `conda create -n yolo python=3.12` |
| `pip install -r` 报 UnicodeDecodeError | 只用 UTF-8 版清单 |
| `dir` 看到 `.txt.txt` | `ren` 去掉一层扩展名 |
| `ERROR: contourpy conflicting` | 清单 contourpy 改 1.3.3 |
| `ERROR: opencv depends on numpy>=2` | 加 `--no-deps` |
| `CUDA: False` | 卸载 torch 按 cu128 源重装 |
| label 环境报 VC++ 14.0 | 删环境重建 `python=3.11` |
| torch 下载中断 | 勿动等续传；ERROR 重跑 |
| PyCharm 右下角 <无解释器> | 确认包列表有 torch → 应用；或改 System Interpreter |
| `WinError 1114` | torch 必须先于 PySide6 导入 |
| `Activate.ps1` 禁止运行 | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| 装包断网 | 重跑同命令续装 |
