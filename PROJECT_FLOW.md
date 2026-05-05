# 🔄 FinAssist - Complete Project Flow

## 📋 Table of Contents
1. [Application Startup Flow](#application-startup-flow)
2. [User Journey Flow](#user-journey-flow)
3. [Chat Feature Flow](#chat-feature-flow)
4. [Dashboard Feature Flow](#dashboard-feature-flow)
5. [Data Flow Architecture](#data-flow-architecture)
6. [Technical Flow](#technical-flow)

---

## 🚀 Application Startup Flow

### **Step 1: Backend Startup**
```
User runs: python main.py
    ↓
1. Load environment variables (.env)
   - GROQ_API_KEY
   - BACKEND_PORT (8000)
    ↓
2. Initialize FastAPI application
   - Configure CORS middleware
   - Set up API routes
    ↓
3. Connect to Groq API
   - Validate API key
   - Initialize Groq client
    ↓
4. Start Uvicorn server
   - Listen on 0.0.0.0:8000
   - Enable hot reload (dev mode)
    ↓
✅ Backend Ready: http://localhost:8000
```

### **Step 2: Frontend Startup**
```
User runs: npm run dev
    ↓
1. Load Next.js configuration
   - Read next.config.js
   - Set up TypeScript
    ↓
2. Compile React components
   - App Router pages
   - Components
   - Styles
    ↓
3. Start development server
   - Listen on localhost:3000
   - Enable hot reload
    ↓
✅ Frontend Ready: http://localhost:3000
```

---

## 👤 User Journey Flow

### **Complete User Experience:**

```
┌─────────────────────────────────────────────────────────────┐
│                    User Opens Browser                        │
│              http://localhost:3000                           │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Landing Page Loads                          │
│  - Check localStorage for existing session                   │
│  - Load previous messages (if any)                           │
│  - Display welcome message                                   │
│  - Show suggestion chips                                     │
└────────────────────────┬────────────────────────────────────┘
                         ↓
                    User Choice
                         ↓
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   [Chat Page]    [Dashboard Page]  [History Page]
        │                │                │
        └────────────────┴────────────────┘
                         ↓
              Continue using app...
```

---

## 💬 Chat Feature Flow

### **Detailed Chat Interaction:**

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: User Types Message                                 │
│  Input: "Calculate my savings"                              │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Frontend Processing                                │
│  - Create user message object                               │
│  - Add to messages array                                    │
│  - Save to localStorage                                     │
│  - Display in chat UI                                       │
│  - Set loading state                                        │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Check Dashboard Data                               │
│  - Read from localStorage                                   │
│  - If exists: Append financial context                      │
│    "User's Financial Information:                           │
│     - Monthly Income: ₹50,000                               │
│     - Monthly Expenses: ₹30,000                             │
│     - Current Savings: ₹100,000                             │
│     - Total Debts: ₹200,000"                                │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Send API Request                                   │
│  POST http://localhost:8000/api/chat                        │
│  Body: {                                                    │
│    message: "Calculate my savings + context",              │
│    session_id: "session_123...",                           │
│    user_id: "user_456...",                                 │
│    model_name: "llama-3.3-70b-versatile"                   │
│  }                                                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Backend Processing                                 │
│  1. Receive request                                         │
│  2. Validate data (Pydantic)                                │
│  3. Get/create session                                      │
│  4. Build conversation context (last 10 messages)           │
│  5. Add financial assistant prompt                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Call Groq AI                                       │
│  - Send prompt to Groq API                                  │
│  - Model: Llama 3.3 70B                                     │
│  - Wait for response                                        │
│  - Response time: ~500ms                                    │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 7: Process AI Response                                │
│  - Check if response contains Python code                   │
│  - If yes:                                                  │
│    • Extract code block                                     │
│    • Execute code safely                                    │
│    • Generate chart (matplotlib)                            │
│    • Convert to base64 image                                │
│    • Remove code from response text                         │
│  - Store in session history                                 │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 8: Return Response                                    │
│  Response: {                                                │
│    response: "Based on your income...",                     │
│    session_id: "session_123...",                           │
│    model_used: "llama-3.3-70b-versatile",                  │
│    image: "data:image/png;base64,..." (if chart)           │
│  }                                                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 9: Frontend Display                                   │
│  - Create assistant message object                          │
│  - Render markdown content                                  │
│  - Display chart (if present)                               │
│  - Save to localStorage                                     │
│  - Update chat history                                      │
│  - Clear loading state                                      │
│  - Scroll to bottom                                         │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 10: User Sees Response                                │
│  ✅ AI message displayed                                    │
│  ✅ Chart visible (if generated)                            │
│  ✅ Ready for next message                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Dashboard Feature Flow

### **Dashboard Calculation Flow:**

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: User Navigates to Dashboard                        │
│  Click "Dashboard" in sidebar                               │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Page Loads                                         │
│  - Check localStorage for saved data                        │
│  - If exists: Pre-fill form fields                          │
│  - If exists: Display previous results                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 3: User Enters Data                                   │
│  - Monthly Income: ₹50,000                                  │
│  - Monthly Expenses: ₹30,000                                │
│  - Current Savings: ₹100,000                                │
│  - Total Debts: ₹200,000                                    │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 4: User Clicks "Calculate Savings"                    │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Frontend Calculations (JavaScript)                 │
│                                                             │
│  1. Monthly Savings:                                        │
│     ₹50,000 - ₹30,000 = ₹20,000                            │
│                                                             │
│  2. Savings Rate:                                           │
│     (₹20,000 / ₹50,000) × 100 = 40%                        │
│                                                             │
│  3. Debt-to-Income:                                         │
│     (₹200,000 / ₹50,000) × 100 = 400%                      │
│                                                             │
│  4. Monthly Debt Payment (30% of savings):                  │
│     ₹20,000 × 0.30 = ₹6,000                                │
│                                                             │
│  5. Debt Freedom Timeline:                                  │
│     ₹200,000 ÷ ₹6,000 = 33.33 → 34 months                 │
│                                                             │
│  6. Debt-Free Date:                                         │
│     April 2026 + 34 months = February 2029                 │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Save to localStorage                               │
│  Key: "finassist_dashboard_data"                            │
│  Value: {                                                   │
│    monthlyIncome: 50000,                                    │
│    monthlyExpenses: 30000,                                  │
│    currentSavings: 100000,                                  │
│    totalDebts: 200000,                                      │
│    monthlySavings: 20000,                                   │
│    savingsRate: 40,                                         │
│    debtToIncome: 400,                                       │
│    debtFreedomMonths: 34,                                   │
│    debtFreedomDate: "Feb 2029",                            │
│    monthlyDebtPayment: 6000,                                │
│    lastUpdated: "2026-04-29T..."                           │
│  }                                                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 7: Display Results                                    │
│                                                             │
│  📊 4 Metric Cards:                                         │
│  ┌──────────────┬──────────────┬──────────────┬──────────┐ │
│  │ Monthly      │ Savings      │ Debt-to-     │ Debt     │ │
│  │ Savings      │ Rate         │ Income       │ Freedom  │ │
│  │ ₹20,000      │ 40%          │ 400%         │ 34 mo    │ │
│  └──────────────┴──────────────┴──────────────┴──────────┘ │
│                                                             │
│  💳 Debt Freedom Timeline:                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Total Debt: ₹200,000    Debt-Free By: Feb 2029     │   │
│  │ ▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │ Monthly Payment: ₹6,000  Time: 34 months           │   │
│  │ 💡 Tip: Increase percentage to pay off faster      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Data Flow Architecture

### **Data Storage & Retrieval:**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Browser)                        │
│                                                             │
│  localStorage:                                              │
│  ├── finassist_session_id                                   │
│  ├── finassist_user_id                                      │
│  ├── finassist_messages_{session_id}                        │
│  ├── finassist_dashboard_data                               │
│  └── finassist_history (all sessions)                       │
│                                                             │
│  React State:                                               │
│  ├── messages (current chat)                                │
│  ├── input (user typing)                                    │
│  ├── isLoading (API call status)                            │
│  ├── selectedModel (AI model)                               │
│  └── formData (dashboard inputs)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    BACKEND (Server)                          │
│                                                             │
│  In-Memory Storage (Python Dictionaries):                   │
│  ├── chat_sessions: {                                       │
│  │     "session_123": [                                     │
│  │       {role: "user", content: "...", timestamp: "..."},  │
│  │       {role: "assistant", content: "...", ...}           │
│  │     ]                                                    │
│  │   }                                                      │
│  │                                                          │
│  ├── chat_history: {                                        │
│  │     "user_456": [                                        │
│  │       {session_id: "...", messages: [...]}               │
│  │     ]                                                    │
│  │   }                                                      │
│  │                                                          │
│  └── users_db: {                                            │
│        "user_456": {profile data}                           │
│      }                                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                    API Calls
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    GROQ AI SERVICE                           │
│                                                             │
│  - Receives prompts                                         │
│  - Processes with Llama 3.3 70B                             │
│  - Returns AI responses                                     │
│  - No data storage (stateless)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Flow

### **Request-Response Cycle:**

```
┌─────────────────────────────────────────────────────────────┐
│  1. USER ACTION                                             │
│  User clicks "Send" button                                  │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  2. REACT EVENT HANDLER                                     │
│  handleSubmit(e) {                                          │
│    e.preventDefault()                                       │
│    sendMessage(input)                                       │
│  }                                                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  3. FRONTEND PROCESSING                                     │
│  sendMessage(content) {                                     │
│    // Create user message                                   │
│    // Update state                                          │
│    // Save to localStorage                                  │
│    // Set loading state                                     │
│  }                                                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  4. HTTP REQUEST (Axios)                                    │
│  axios.post('http://localhost:8000/api/chat', {             │
│    message: content,                                        │
│    session_id: sessionId,                                   │
│    user_id: userId,                                         │
│    model_name: selectedModel.id                             │
│  })                                                         │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  5. BACKEND ENDPOINT (FastAPI)                              │
│  @app.post("/api/chat")                                     │
│  async def chat(request: ChatRequest):                      │
│    # Validate request                                       │
│    # Get session                                            │
│    # Build context                                          │
│    # Call Groq AI                                           │
│    # Process response                                       │
│    # Return result                                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  6. GROQ API CALL                                           │
│  response = client.chat.completions.create(                 │
│    model="llama-3.3-70b-versatile",                         │
│    messages=[...],                                          │
│    temperature=0.7                                          │
│  )                                                          │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  7. AI PROCESSING                                           │
│  - Llama 3.3 70B processes prompt                           │
│  - Generates response                                       │
│  - Returns text                                             │
│  - Time: ~500ms                                             │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  8. BACKEND POST-PROCESSING                                 │
│  - Check for Python code                                    │
│  - Execute code if present                                  │
│  - Generate charts                                          │
│  - Convert to base64                                        │
│  - Store in session                                         │
│  - Return JSON response                                     │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  9. FRONTEND RECEIVES RESPONSE                              │
│  .then(response => {                                        │
│    // Create assistant message                              │
│    // Update messages state                                 │
│    // Save to localStorage                                  │
│    // Update history                                        │
│    // Clear loading state                                   │
│  })                                                         │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  10. REACT RE-RENDER                                        │
│  - Messages array updated                                   │
│  - Component re-renders                                     │
│  - New message appears                                      │
│  - Chart displays (if present)                              │
│  - Scroll to bottom                                         │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  11. USER SEES RESULT                                       │
│  ✅ AI response displayed                                   │
│  ✅ Ready for next interaction                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Feature-Specific Flows

### **New Chat Flow:**
```
User clicks "New Chat"
    ↓
Generate new session_id
    ↓
Clear messages array
    ↓
Show welcome message
    ↓
Save to localStorage
    ↓
Ready for new conversation
```

### **Model Selection Flow:**
```
User clicks model dropdown
    ↓
Show available models
    ↓
User selects model
    ↓
Update selectedModel state
    ↓
Close dropdown
    ↓
Next message uses new model
```

### **History View Flow:**
```
User clicks "History"
    ↓
Load from localStorage
    ↓
Parse all sessions
    ↓
Display as list
    ↓
User clicks session
    ↓
Load that session's messages
    ↓
Navigate to chat with loaded messages
```

### **Settings Flow:**
```
User clicks "Settings"
    ↓
Load current settings from localStorage
    ↓
Display sliders (temperature, top-p)
    ↓
User adjusts values
    ↓
Click "Save Settings"
    ↓
Save to localStorage
    ↓
Show success message
    ↓
Settings applied to next API call
```

---

## 🔄 Session Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│  First Visit                                                │
│  - No session_id in localStorage                            │
│  - Generate: session_{timestamp}_{random}                   │
│  - Generate: user_{timestamp}_{random}                      │
│  - Save both to localStorage                                │
│  - Create welcome message                                   │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Subsequent Visits                                          │
│  - Load session_id from localStorage                        │
│  - Load user_id from localStorage                           │
│  - Load messages for this session                           │
│  - Display previous conversation                            │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Browser Refresh                                            │
│  - Session persists (localStorage)                          │
│  - Messages reload                                          │
│  - Continue conversation                                    │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  New Chat Button                                            │
│  - Generate new session_id                                  │
│  - Keep same user_id                                        │
│  - Clear messages                                           │
│  - Start fresh conversation                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Complete User Journey Example

### **Scenario: New User Calculates Debt Freedom**

```
1. User opens http://localhost:3000
   ✅ Welcome message appears
   ✅ 3 suggestion chips shown

2. User clicks "Dashboard" in sidebar
   ✅ Dashboard page loads
   ✅ Empty form displayed

3. User enters financial data:
   - Income: ₹50,000
   - Expenses: ₹30,000
   - Savings: ₹100,000
   - Debts: ₹200,000

4. User clicks "Calculate Savings"
   ✅ Calculations run instantly
   ✅ 4 metric cards appear
   ✅ Debt freedom timeline shows: 34 months
   ✅ Data saved to localStorage

5. User clicks "Chat" in sidebar
   ✅ Returns to chat page
   ✅ Dashboard data now available

6. User types: "How can I pay off debt faster?"
   ✅ Message sent to backend
   ✅ Backend includes dashboard context
   ✅ Groq AI generates personalized advice
   ✅ Response appears in ~1 second
   ✅ Advice based on actual financial data

7. User asks: "Create a savings plan"
   ✅ AI generates detailed plan
   ✅ Includes specific numbers from dashboard
   ✅ May include visualization chart

8. User clicks "History"
   ✅ Sees current session listed
   ✅ Can review past conversations

9. User closes browser
   ✅ All data saved in localStorage

10. User returns next day
    ✅ Session restored
    ✅ Messages still there
    ✅ Dashboard data preserved
    ✅ Can continue conversation
```

---

## 🎯 Summary

### **Key Flow Points:**

1. **Startup:** Backend → Frontend → Ready
2. **Chat:** User Input → API → Groq → Response → Display
3. **Dashboard:** Input → Calculate → Save → Display
4. **Data Sharing:** Dashboard → localStorage → Chat Context
5. **Persistence:** localStorage maintains state across sessions
6. **AI Integration:** Groq provides fast, intelligent responses
7. **Visualization:** Python code executed, charts generated

### **Data Flow:**
```
User Input → Frontend → Backend → Groq AI → Backend → Frontend → User Display
     ↓                                                              ↑
localStorage ←─────────────────────────────────────────────────────┘
```

---

**This is the complete flow of FinAssist from startup to user interaction! 🚀**
