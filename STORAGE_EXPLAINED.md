# 💾 Chat History Storage - Complete Explanation

## 📍 Where is Chat History Stored?

Chat history is stored in **TWO locations**:

1. **Frontend (Browser)** - localStorage
2. **Backend (Server)** - In-memory Python dictionaries

---

## 🌐 Frontend Storage (Browser)

### **Location:** Browser's localStorage

### **Storage Keys:**

#### **1. Individual Session Messages**
```javascript
Key: `finassist_messages_${sessionId}`
Example: "finassist_messages_session_1714377600000_abc123"

Value: Array of message objects
[
  {
    id: "user_1714377600001",
    role: "user",
    content: "Calculate my savings",
    timestamp: "2026-04-29T10:30:00.000Z"
  },
  {
    id: "assistant_1714377600002",
    role: "assistant",
    content: "Based on your income...",
    timestamp: "2026-04-29T10:30:01.500Z",
    image: "data:image/png;base64,..." // if chart present
  }
]
```

#### **2. All Sessions History**
```javascript
Key: "finassist_history"

Value: Array of session summaries
[
  {
    session_id: "session_1714377600000_abc123",
    title: "Calculate my savings",
    lastMessage: "Based on your income of ₹50,000...",
    timestamp: "2026-04-29T10:30:01.500Z",
    messages: [...], // Full message array
    messageCount: 10
  },
  {
    session_id: "session_1714380000000_def456",
    title: "Tips for saving money",
    lastMessage: "Here are some effective saving tips...",
    timestamp: "2026-04-29T11:00:00.000Z",
    messages: [...],
    messageCount: 6
  }
]
```

#### **3. Session & User IDs**
```javascript
Key: "finassist_session_id"
Value: "session_1714377600000_abc123"

Key: "finassist_user_id"
Value: "user_1714377500000_xyz789"
```

#### **4. Dashboard Data**
```javascript
Key: "finassist_dashboard_data"
Value: {
  monthlyIncome: 50000,
  monthlyExpenses: 30000,
  currentSavings: 100000,
  totalDebts: 200000,
  monthlySavings: 20000,
  savingsRate: 40,
  debtToIncome: 400,
  debtFreedomMonths: 34,
  debtFreedomDate: "Feb 2029",
  monthlyDebtPayment: 6000,
  lastUpdated: "2026-04-29T10:25:00.000Z"
}
```

---

## ⚙️ Backend Storage (Server)

### **Location:** Python In-Memory Dictionaries

### **Storage Variables:**

#### **1. chat_sessions**
```python
# Stores messages for each active session
chat_sessions: Dict = {
    "session_1714377600000_abc123": [
        {
            "role": "user",
            "content": "Calculate my savings",
            "timestamp": "2026-04-29T10:30:00.000Z"
        },
        {
            "role": "assistant",
            "content": "Based on your income...",
            "timestamp": "2026-04-29T10:30:01.500Z"
        }
    ],
    "session_1714380000000_def456": [...]
}
```

**Purpose:** 
- Maintain conversation context
- Last 10 messages used for AI context
- Temporary storage (lost on server restart)

#### **2. chat_history**
```python
# Stores all messages by user
chat_history: Dict = {
    "user_1714377500000_xyz789": [
        {
            "session_id": "session_1714377600000_abc123",
            "messages": [
                {"role": "user", "content": "...", "timestamp": "..."},
                {"role": "assistant", "content": "...", "timestamp": "..."}
            ]
        }
    ]
}
```

**Purpose:**
- User-level history tracking
- API endpoint: `/api/chat/history/{user_id}`
- Temporary storage (lost on server restart)

#### **3. users_db**
```python
# Stores user profiles (if created)
users_db: Dict = {
    "user_1714377500000_xyz789": {
        "user_id": "user_1714377500000_xyz789",
        "name": "John Doe",
        "age": 30,
        "monthly_income": 50000,
        "monthly_expenses": 30000,
        "savings": 100000,
        "debts": 200000,
        "financial_goals": "Buy a house",
        "risk_tolerance": "moderate"
    }
}
```

**Purpose:**
- User profile data
- Currently not used (optional feature)
- Temporary storage

---

## 🔄 How Storage Works

### **When User Sends a Message:**

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: User types and sends message                       │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Frontend saves to localStorage                     │
│  - Add to messages array                                    │
│  - Save: finassist_messages_{sessionId}                     │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Send to backend API                                │
│  POST /api/chat                                             │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Backend stores in memory                           │
│  - Add to chat_sessions[session_id]                         │
│  - Add to chat_history[user_id]                             │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Get AI response                                    │
│  - Use last 10 messages from chat_sessions as context       │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Backend stores AI response                         │
│  - Add to chat_sessions[session_id]                         │
│  - Add to chat_history[user_id]                             │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 7: Frontend receives and saves                        │
│  - Add to messages array                                    │
│  - Save: finassist_messages_{sessionId}                     │
│  - Update: finassist_history (session summary)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Storage Locations Summary

| Data | Frontend (Browser) | Backend (Server) |
|------|-------------------|------------------|
| **Current Chat** | ✅ localStorage | ✅ In-memory |
| **All Sessions** | ✅ localStorage | ✅ In-memory |
| **Dashboard Data** | ✅ localStorage | ❌ Not stored |
| **User Profile** | ❌ Not stored | ✅ In-memory (optional) |
| **Persistence** | ✅ Survives refresh | ❌ Lost on restart |

---

## 🔍 How to View Stored Data

### **Frontend (Browser):**

**Method 1: Browser DevTools**
1. Open browser (Chrome/Edge/Firefox)
2. Press `F12` to open DevTools
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click **Local Storage** → `http://localhost:3000`
5. See all keys:
   - `finassist_session_id`
   - `finassist_user_id`
   - `finassist_messages_session_...`
   - `finassist_history`
   - `finassist_dashboard_data`

**Method 2: Console**
```javascript
// View current session ID
console.log(localStorage.getItem('finassist_session_id'))

// View all history
console.log(JSON.parse(localStorage.getItem('finassist_history')))

// View current session messages
const sessionId = localStorage.getItem('finassist_session_id')
console.log(JSON.parse(localStorage.getItem(`finassist_messages_${sessionId}`)))

// View dashboard data
console.log(JSON.parse(localStorage.getItem('finassist_dashboard_data')))
```

### **Backend (Server):**

**Method 1: API Endpoints**
```bash
# Get user's chat history
curl http://localhost:8000/api/chat/history/user_123

# Get specific session
curl http://localhost:8000/api/chat/session/session_123
```

**Method 2: Add Debug Print**
```python
# In main.py, add:
@app.get("/debug/sessions")
def debug_sessions():
    return {
        "sessions": list(chat_sessions.keys()),
        "history": list(chat_history.keys())
    }
```

---

## 💾 Storage Size & Limits

### **Frontend (localStorage):**

**Browser Limits:**
- **Chrome/Edge:** ~10 MB per domain
- **Firefox:** ~10 MB per domain
- **Safari:** ~5 MB per domain

**Current Usage (Estimated):**
- Each message: ~500 bytes
- 100 messages: ~50 KB
- Dashboard data: ~1 KB
- **Total for typical use:** < 100 KB

**Limit Reached?**
- Browser shows error: "QuotaExceededError"
- Solution: Clear old sessions from history

### **Backend (In-Memory):**

**Limits:**
- Depends on server RAM
- Python dict has no hard limit
- Typical usage: < 10 MB for 100 users

**Issues:**
- ⚠️ Data lost on server restart
- ⚠️ Not shared across multiple servers
- ⚠️ No persistence

---

## 🔒 Data Persistence

### **What Survives:**

| Event | Frontend Data | Backend Data |
|-------|--------------|--------------|
| **Browser Refresh** | ✅ Survives | ✅ Survives |
| **Browser Close** | ✅ Survives | ✅ Survives |
| **Clear Browser Data** | ❌ Lost | ✅ Survives |
| **Backend Restart** | ✅ Survives | ❌ Lost |
| **Server Crash** | ✅ Survives | ❌ Lost |
| **New Device** | ❌ Lost | ❌ Lost |

---

## 🚀 Production Recommendations

### **Current Issues:**

❌ **Backend in-memory storage:**
- Lost on restart
- Not scalable
- No backup

❌ **Frontend localStorage:**
- Limited to one device
- No sync across devices
- Can be cleared by user

### **Recommended Solution:**

#### **1. Add Database (Backend)**
```python
# Use PostgreSQL
import psycopg2

# Store in database
CREATE TABLE chat_sessions (
    session_id VARCHAR PRIMARY KEY,
    user_id VARCHAR,
    messages JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR,
    role VARCHAR,
    content TEXT,
    timestamp TIMESTAMP,
    image_data TEXT
);
```

#### **2. Add User Authentication**
```python
# JWT tokens for user identification
# Sync data across devices
# Secure user data
```

#### **3. Add Caching Layer**
```python
# Use Redis for fast access
# Cache recent sessions
# Reduce database load
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│                                                             │
│  localStorage:                                              │
│  ├── finassist_session_id                                   │
│  ├── finassist_user_id                                      │
│  ├── finassist_messages_{session_id}  ← Current chat       │
│  ├── finassist_history                ← All sessions       │
│  └── finassist_dashboard_data         ← Financial data     │
│                                                             │
│  ✅ Persistent (survives refresh)                           │
│  ✅ Device-specific                                         │
│  ❌ Not synced across devices                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    BACKEND SERVER                            │
│                                                             │
│  In-Memory Dictionaries:                                    │
│  ├── chat_sessions: {                                       │
│  │     session_id: [messages]                               │
│  │   }                                                      │
│  │                                                          │
│  ├── chat_history: {                                        │
│  │     user_id: [sessions]                                  │
│  │   }                                                      │
│  │                                                          │
│  └── users_db: {                                            │
│        user_id: {profile}                                   │
│      }                                                      │
│                                                             │
│  ⚠️ Temporary (lost on restart)                             │
│  ⚠️ Not persistent                                          │
│  ⚠️ Not scalable                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Code Examples

### **Frontend - Save to localStorage:**
```typescript
// Save current session messages
localStorage.setItem(
  `finassist_messages_${sessionId}`, 
  JSON.stringify(messages)
)

// Save to history
const history = JSON.parse(localStorage.getItem('finassist_history') || '[]')
history.push({
  session_id: sessionId,
  title: "Calculate my savings",
  lastMessage: "Based on your income...",
  timestamp: new Date().toISOString(),
  messages: messages,
  messageCount: messages.length
})
localStorage.setItem('finassist_history', JSON.stringify(history))
```

### **Backend - Save to memory:**
```python
# Save to session
chat_sessions[request.session_id].append(user_msg)
chat_sessions[request.session_id].append(assistant_msg)

# Save to history
if request.user_id not in chat_history:
    chat_history[request.user_id] = []

chat_history[request.user_id].append({
    "session_id": request.session_id,
    "messages": [user_msg, assistant_msg]
})
```

---

## ✅ Summary

**Chat history is stored in TWO places:**

1. **Browser localStorage** (Frontend)
   - ✅ Persistent across refreshes
   - ✅ Survives browser close
   - ❌ Device-specific
   - ❌ Can be cleared by user

2. **Python dictionaries** (Backend)
   - ✅ Fast access
   - ✅ Used for AI context
   - ❌ Lost on server restart
   - ❌ Not persistent

**For production:** Use a database (PostgreSQL) + caching (Redis) for reliable, scalable storage.

---

**Your chat history is safe in localStorage and will persist across browser sessions! 💾**
