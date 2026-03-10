# CyberRing: 赛博闭环任务系统 🪐

一个赛博朋克风格的游戏化人生任务管理系统。通过视觉化的圆环进度、AI 助手和成就系统，将你的日常任务转化为一场神经链路的同步之旅。

## 🚀 部署说明 (GitHub Pages)

由于本项目使用了 Vite + React 架构，你可以轻松地将其部署到 GitHub Pages。

### 1. 导出代码
在 Google AI Studio 中，点击 **Settings** -> **Export to GitHub**，将代码推送到你的 GitHub 仓库。

### 2. 初始化数据库 (Supabase) - **关键步骤**
报错 `Could not find the table 'public.logs'` 表示你的数据库中还没有创建对应的表。

1. 打开你的 [Supabase Dashboard](https://supabase.com/dashboard)。
2. 进入你的项目，点击左侧导航栏的 **SQL Editor**。
3. 点击 **New Query**。
4. 复制本项目根目录下 `SUPABASE_SETUP.sql` 文件中的全部内容，粘贴到编辑器中。
5. 点击 **Run**。

### 3. 配置密钥 (Secrets)
在 GitHub 仓库中配置以下密钥 (**Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**):

| 密钥名称 (Name) | 获取位置 (Where to find) | 示例值 (Example) |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) | `AIzaSy...` |
| `VITE_SUPABASE_URL` | Supabase -> Project Settings -> API -> **Project URL** | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase -> Project Settings -> API -> **anon / public** | `eyJh...` |

> **注意 (关于免费额度)：** Gemini 免费版 API 有频率限制（每分钟请求数有限）。如果在 AI 终端输入太快，可能会收到 429 错误。这是正常现象，稍等片刻即可恢复。

### 3. 开启自动部署
1. 在仓库的 **Settings** -> **Pages** 页面。
2. 在 **Build and deployment** -> **Source** 下，选择 **GitHub Actions**。
3. 每次你推送代码到 `main` 分支，GitHub 都会自动构建并发布。

### 4. 部署常见错误排查 (Troubleshooting)
如果你在 GitHub 的 **Actions** 标签页看到红色的叉（部署失败），请检查以下几点：

1. **分支名称不匹配**：本项目默认支持 `main` 和 `master` 分支。如果你的分支叫别的名字，请修改 `.github/workflows/deploy.yml` 中的 `branches` 部分。
2. **缺少 Secrets**：请确保你在仓库设置中添加了 `GEMINI_API_KEY`、`VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`。即使不使用 Supabase，也需要随便填个占位符，否则构建脚本可能会报错。
3. **权限问题**：在仓库的 **Settings** -> **Actions** -> **General** 中，确保 **Workflow permissions** 设置为 "Read and write permissions"。
4. **Pages 设置**：确保在 **Settings** -> **Pages** 中，**Source** 选择的是 **GitHub Actions** 而不是 "Deploy from a branch"。

## 🛠️ 技术架构
- **Frontend**: React + Vite + Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (用于数据同步)
- **AI**: Google Gemini API

## 🎨 视觉风格
- **主题**: 赛博朋克 / 霓虹数字 (Cyberpunk / Neon Digital)
- **字体**: Space Grotesk
- **交互**: 神经链路同步反馈音效

---
*身份识别完成 | 神经链路已同步*
