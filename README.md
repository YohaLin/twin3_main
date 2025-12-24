# Twin3.ai - A2UI with CopilotKit & OpenAI

这是一个使用 **Next.js**、**CopilotKit** 和 **OpenAI API** 构建的 A2UI 项目，保留了原有的玻璃拟态 UI 设计和左中右三栏布局。

## 🎯 功能特性

- ✅ **完整保留原有 UI** - 左中右三栏布局，玻璃拟态设计
- ✅ **CopilotKit 集成** - AI 对话功能由 CopilotKit 提供
- ✅ **OpenAI GPT-4o-mini** - 使用最新的 OpenAI 模型
- ✅ **A2UI Widget 系统** - 支持所有原有的 Widget（TwinMatrix、InstagramConnect 等）
- ✅ **动态 Actions** - AI 可以触发任务浏览、验证、仪表盘等功能
- ✅ **Next.js 14+** - 使用 App Router 和 Server Components

## 📦 安装依赖

```bash
npm install
```

## 🔑 配置 API Key

1. 复制环境变量模板：

```bash
cp .env.local.example .env.local
```

2. 编辑 `.env.local`，添加你的 OpenAI API Key：

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
DEMO_MODE=false
```

**获取 OpenAI API Key：**
- 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
- 登录/注册账号
- 创建新的 API Key
- 将 Key 粘贴到 `.env.local` 文件

**测试模式：**
如果还没有 API Key，可以先设置 `DEMO_MODE=true` 来测试基本功能（使用预设回复）。

## 🚀 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🏗️ 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 主页（CopilotKit 包装）
│   └── api/
│       └── copilotkit/
│           └── route.ts        # CopilotKit API 端点
│
├── components/
│   └── ChatLayoutWithCopilot.tsx  # 主聊天布局组件
│
├── features/
│   ├── chat/                   # 聊天相关组件
│   │   ├── MessageBubble.tsx
│   │   └── ChatLayout.tsx      # 原始布局（已废弃）
│   ├── widgets/                # A2UI Widget 组件
│   │   ├── TwinMatrixWidget.tsx
│   │   ├── InstagramConnectWidget.tsx
│   │   ├── GlobalDashboardWidget.tsx
│   │   ├── ActiveTaskWidget.tsx
│   │   └── ...
│   └── cards/
│       ├── TaskOpportunityCard.tsx
│       └── TaskDetailModal.tsx
│
├── services/
│   ├── copilotService.ts       # CopilotKit Actions 和 Hooks
│   ├── geminiService.ts        # Gemini 服务（已废弃）
│   └── influenceEngine.ts      # 分数计算引擎
│
├── types/
│   ├── index.ts                # 核心类型定义
│   └── a2ui.ts                 # A2UI 协议类型
│
├── data/
│   └── inventory.ts            # A2UI 交互配置库
│
└── styles/
    └── globals.css             # 全局样式（玻璃拟态）
```

## 🤖 CopilotKit Actions

AI 可以触发以下 Actions：

### 1. `showWidget`
显示各种 UI Widget：
- `twin_matrix` - 256维身份矩阵可视化
- `instagram_connect` - Instagram 验证流程
- `active_task` - 活跃任务跟踪
- `global_dashboard` - 全局仪表盘
- `task_card` - 任务机会卡片

### 2. `verifyUser`
用户验证流程：
- Instagram 验证
- 钱包连接验证

### 3. `browseTasks`
浏览可用任务：
- 品牌任务（L'Oréal、Starbucks、Dior 等）
- 分类筛选（social、content、review）

### 4. `showTwinMatrix`
显示用户的 Twin Matrix 分数

### 5. `showDashboard`
打开全局仪表盘

## 🎨 UI 设计

- **设计风格**：iOS 风格玻璃拟态（Glassmorphism）
- **颜色主题**：黑白灰极简主义
- **字体**：Inter 字体家族
- **动画**：流畅的淡入、缩放和悬停效果
- **响应式**：支持桌面和移动端

## 🔧 开发工具

### DevConsole
按 `DevConsole` 按钮打开调试控制台，可以查看：
- 系统日志
- AI 响应记录
- Widget 触发事件
- 用户操作追踪

### TypeScript
项目使用严格的 TypeScript 配置：

```bash
npm run type-check  # 运行类型检查
```

## 📝 常见问题

### Q: 如何切换 AI 模型？
A: 在 `.env.local` 中修改 `OPENAI_MODEL`：
```env
OPENAI_MODEL=gpt-4o        # 使用 GPT-4o
OPENAI_MODEL=gpt-4o-mini   # 使用 GPT-4o-mini（默认）
```

### Q: 如何添加新的 Widget？
A:
1. 在 `features/widgets/` 创建新组件
2. 在 `types/a2ui.ts` 的 `WidgetType` 添加类型
3. 在 `services/copilotService.ts` 注册新 Action
4. 在 `ChatLayoutWithCopilot.tsx` 添加渲染逻辑

### Q: CopilotKit API 调用失败？
A: 检查：
1. `.env.local` 中的 `OPENAI_API_KEY` 是否正确
2. OpenAI 账户是否有余额
3. 网络连接是否正常
4. 查看浏览器控制台的错误信息

### Q: 如何禁用 AI，只使用预设回复？
A: 在 `.env.local` 设置 `DEMO_MODE=true`

## 🚦 迁移说明

### 从 Vite 到 Next.js
原项目使用 Vite，已完整迁移到 Next.js：
- ✅ 所有组件转换为 Next.js 兼容
- ✅ 路由从客户端单页应用改为 Next.js App Router
- ✅ 环境变量从 `VITE_` 前缀改为 Next.js 格式
- ✅ 样式系统完整保留（CSS Variables）

### 从 Gemini 到 OpenAI
AI 服务从 Google Gemini 迁移到 OpenAI：
- ✅ CopilotKit 提供统一的 AI 接口
- ✅ 支持 OpenAI 全系列模型
- ✅ 保留原有的交互逻辑（INTERACTION_INVENTORY）

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

---

**Built with ❤️ using Next.js, CopilotKit, and OpenAI**
