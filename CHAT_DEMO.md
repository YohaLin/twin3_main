# Twin3.ai AI Chat Demo

這個文件展示了 AI 驅動的聊天系統如何智能地回應用戶問題並顯示相應的 widgets。

---

## 🎯 系統架構

- **AI 模型**：OpenAI GPT-4o-mini
- **決策方式**：完全由 AI 根據上下文和用戶狀態決定
- **Widget 顯示**：AI 返回 `action` 參數來觸發對應的 widget

---

## 📝 問答範例

### 1️⃣ 一般問題（無 widget）

#### 問：`"tell me a joke"`
**AI 回應：**
```json
{
  "response": "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "action": null
}
```
**UI 顯示：**
- ✅ 顯示笑話文字
- ❌ 不顯示任何 widget

---

#### 問：`"what is twin3?"`
**AI 回應：**
```json
{
  "response": "twin3.ai is a platform that transforms your social influence into verifiable digital identity. We analyze your content to create your Twin Matrix (0-255 score) and match you with exclusive brand collaborations!",
  "action": null
}
```
**UI 顯示：**
- ✅ 顯示平台介紹文字
- ❌ 不顯示任何 widget

---

#### 問：`"how does twin3 work?"`
**AI 回應：**
```json
{
  "response": "Here's how twin3 works:\n\n1. **Connect** - Link your Instagram to verify your identity\n2. **Analyze** - Our AI calculates your Twin Matrix score (0-255) based on your content and engagement\n3. **Match** - Get matched with brand tasks that fit your style and influence\n4. **Earn** - Complete tasks to earn tokens and build your digital reputation\n\nWant to get started?",
  "action": null
}
```
**UI 顯示：**
- ✅ 顯示步驟說明文字
- ❌ 不顯示任何 widget

---

### 2️⃣ 瀏覽任務（需要驗證）

#### 問：`"browse tasks"` （用戶**未驗證**）
**用戶狀態：** `isVerified: false`

**AI 回應：**
```json
{
  "response": "📍 To unlock brand tasks, you need to verify your Instagram account first. This helps us calculate your Twin Matrix score and match you with the best opportunities!",
  "action": "show_instagram_widget"
}
```

**UI 顯示：**
- ✅ 顯示提示文字
- ✅ 顯示 **Instagram Connect Widget**（有 "Connect" 按鈕）

**Server Log：**
```
💬 [Chat API] Incoming message: "browse tasks" | Verified: false
✅ [Chat API] Response: {
  response: '📍 To unlock brand tasks...',
  action: 'show_instagram_widget'
}
```

---

#### 問：`"show me tasks"` （用戶**已驗證**）
**用戶狀態：** `isVerified: true`

**AI 回應：**
```json
{
  "response": "Here are the available brand opportunities for you:",
  "action": "show_tasks"
}
```

**UI 顯示：**
- ✅ 顯示提示文字
- ✅ 顯示**任務卡片列表**：
  - L'Oréal Paris - Lipstick Challenge (150 tokens)
  - Starbucks - Coffee Vlog Challenge (200 tokens)

---

#### 問：`"I want to see brand opportunities"` （用戶**未驗證**）
**用戶狀態：** `isVerified: false`

**AI 回應：**
```json
{
  "response": "I'd love to show you our brand opportunities! First, you'll need to verify your Instagram account. This helps us calculate your Twin Matrix score and match you with the best tasks.",
  "action": "show_instagram_widget"
}
```

**UI 顯示：**
- ✅ 顯示說明文字
- ✅ 顯示 **Instagram Connect Widget**

---

### 3️⃣ Twin Matrix（身份分數）

#### 問：`"show my matrix"`
**AI 回應：**
```json
{
  "response": "Here is your Twin Matrix - a 256-dimensional visualization of your digital identity:",
  "action": "show_twin_matrix"
}
```

**UI 顯示：**
- ✅ 顯示介紹文字
- ✅ 顯示 **Twin Matrix Widget**（6 維度雷達圖）

---

#### 問：`"what is my score?"`
**AI 回應：**
```json
{
  "response": "Let me show you your Twin Matrix score across all 6 dimensions:",
  "action": "show_twin_matrix"
}
```

**UI 顯示：**
- ✅ 顯示文字
- ✅ 顯示 **Twin Matrix Widget**

---

#### 問：`"how is my profile?"`
**AI 回應：**
```json
{
  "response": "Your profile is looking great! Here's your current Twin Matrix:",
  "action": "show_twin_matrix"
}
```

**UI 顯示：**
- ✅ 顯示鼓勵文字
- ✅ 顯示 **Twin Matrix Widget**

---

### 4️⃣ Dashboard（儀表板）

#### 問：`"show my dashboard"`
**AI 回應：**
```json
{
  "response": "Here is your dashboard with all your tasks and progress:",
  "action": "show_dashboard"
}
```

**UI 顯示：**
- ✅ 顯示文字
- ✅ 顯示 **Global Dashboard Widget**

---

#### 問：`"what's my progress?"`
**AI 回應：**
```json
{
  "response": "Let me show you your current progress and active tasks:",
  "action": "show_dashboard"
}
```

**UI 顯示：**
- ✅ 顯示文字
- ✅ 顯示 **Global Dashboard Widget**

---

### 5️⃣ 驗證流程

#### 問：`"I want to verify my account"`
**AI 回應：**
```json
{
  "response": "Great! Let's verify your Instagram account to unlock all features:",
  "action": "show_instagram_widget"
}
```

**UI 顯示：**
- ✅ 顯示鼓勵文字
- ✅ 顯示 **Instagram Connect Widget**

---

#### 問：`"how do I verify?"`
**AI 回應：**
```json
{
  "response": "Verification is easy! Just connect your Instagram account and we'll analyze your content to generate your Twin Matrix score:",
  "action": "show_instagram_widget"
}
```

**UI 顯示：**
- ✅ 顯示說明文字
- ✅ 顯示 **Instagram Connect Widget**

---

### 6️⃣ 自然語言變化（AI 靈活理解）

#### 問：`"我想看任務"` （中文）
**AI 回應：**
```json
{
  "response": "I understand you want to browse tasks! To unlock brand opportunities, please verify your Instagram first:",
  "action": "show_instagram_widget"
}
```
*（如果未驗證）*

---

#### 問：`"任務在哪裡？"` （中文）
**AI 回應：**
```json
{
  "response": "讓我為您顯示可用的任務！",
  "action": "show_tasks"
}
```
*（如果已驗證）*

---

#### 問：`"can I see some jobs?"`
**AI 回應：**
```json
{
  "response": "Absolutely! Here are the current brand collaborations available:",
  "action": "show_tasks"
}
```
*（如果已驗證）*

---

## 🔄 完整對話流程範例

### 場景：新用戶首次使用

```
👤 User: "Hello"

🤖 AI: "Welcome to twin3.ai! 👋

twin3 transforms your social influence into verifiable digital identity. Our AI analyzes your content to create your Twin Matrix score (0-255) and matches you with exclusive brand collaborations.

Would you like to get started?"
Action: null

---

👤 User: "What can I do here?"

🤖 AI: "Great question! On twin3, you can:

✨ Verify your identity via Instagram
📊 View your Twin Matrix score (256-dimensional analysis)
🎯 Browse and accept brand partnership tasks
💰 Earn tokens for completing collaborations
📈 Track your progress on the dashboard

What interests you most?"
Action: null

---

👤 User: "Show me some tasks"

🤖 AI: "📍 To unlock brand tasks, you need to verify your Instagram account first. This helps us calculate your Twin Matrix score and match you with the best opportunities!"
Action: show_instagram_widget

📱 [Instagram Connect Widget 顯示]

---

👤 User: [點擊 Connect 按鈕，驗證完成]

🤖 AI: "✅ Verification Complete!

Your Instagram is now linked. Let me show you your Twin Matrix Score!"

📊 [Twin Matrix Widget 顯示]

---

👤 User: "Now show me tasks"

🤖 AI: "Here are the available brand opportunities for you:"
Action: show_tasks

🎴 [Task Cards 顯示：L'Oréal, Starbucks...]

---

👤 User: "What's my dashboard look like?"

🤖 AI: "Here is your dashboard with all your tasks and progress:"
Action: show_dashboard

📈 [Global Dashboard Widget 顯示]
```

---

## 🎨 Available Widgets

系統中可用的所有 widgets：

| Widget Name | Action | 用途 |
|------------|--------|------|
| Instagram Connect | `show_instagram_widget` | 驗證 Instagram 帳號 |
| Twin Matrix | `show_twin_matrix` | 顯示 256 維度身份分數 |
| Task Cards | `show_tasks` | 顯示品牌任務列表 |
| Global Dashboard | `show_dashboard` | 顯示任務進度和統計 |

---

## 🧠 AI 決策邏輯

AI 根據以下因素決定回應：

1. **用戶意圖**：分析問題想達成什麼
2. **驗證狀態**：`isVerified: true/false`
3. **對話歷史**：最近 5 條對話記錄
4. **系統規則**：在 system prompt 中定義的規則

### 系統規則（from app/api/chat/route.ts）

```typescript
**Important Rules:**
1. If user wants to browse tasks but is NOT verified, you MUST:
   - Explain they need to verify first to unlock tasks
   - Return action: "show_instagram_widget"

2. If user wants to browse tasks and IS verified:
   - Return action: "show_tasks"

3. If user asks about their matrix/score/profile:
   - Return action: "show_twin_matrix"

4. If user asks about dashboard/progress:
   - Return action: "show_dashboard"

5. For general questions, just provide a helpful text response (no action needed)
```

---

## 🧪 測試建議

### 未驗證狀態下測試：
1. `"browse tasks"` → 應顯示 Instagram widget
2. `"show me opportunities"` → 應顯示 Instagram widget
3. `"I want to see jobs"` → 應顯示 Instagram widget
4. `"what is twin3?"` → 只顯示文字，無 widget

### 已驗證狀態下測試：
1. `"browse tasks"` → 應顯示任務列表
2. `"show my matrix"` → 應顯示 Twin Matrix
3. `"dashboard"` → 應顯示 dashboard
4. `"tell me a joke"` → 只顯示笑話文字

---

## 📊 Server Logs 範例

成功的 AI 回應會在 server log 中顯示：

```bash
💬 [Chat API] Incoming message: "browse tasks" | Verified: false
✅ [Chat API] Response: {
  response: '📍 To unlock brand tasks, you need to verify your Instagram account first...',
  action: 'show_instagram_widget'
}
POST /api/chat 200 in 2.1s
```

---

## 🎯 快速測試指令

在聊天框中輸入這些問題來測試 AI：

```
✅ 一般問題
- "hello"
- "what is twin3?"
- "tell me a joke"
- "how does this work?"

✅ 需要驗證的功能
- "browse tasks"
- "show me jobs"
- "I want to see opportunities"

✅ 身份相關
- "show my matrix"
- "what's my score?"
- "how is my profile?"

✅ 進度追蹤
- "show my dashboard"
- "what's my progress?"
- "show my tasks"

✅ 驗證流程
- "I want to verify"
- "how do I verify?"
- "connect instagram"
```

---

## 🔗 相關文件

- **AI 系統提示**：`app/api/chat/route.ts` (第 14-75 行)
- **Action 處理器**：`components/SimpleChatLayout.tsx` (第 370-449 行)
- **Widget 組件**：`features/widgets/` 目錄

---

**最後更新**：2024-12-24
**AI 模型**：gpt-4o-mini
**架構版本**：完全 AI 驅動 v1.0
