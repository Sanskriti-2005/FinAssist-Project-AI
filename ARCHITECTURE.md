# FinAssist Architecture Documentation

## 🏗️ System Overview

FinAssist is a full-stack AI-powered financial assistant application built with a modern microservices architecture.

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                     (http://localhost:3000)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages: Chat, Dashboard, History, Settings           │  │
│  │  Components: Sidebar, Charts, Forms                  │  │
│  │  State: React Hooks, Session Management              │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Axios HTTP Requests
                         │ CORS Enabled
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Backend (FastAPI)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Endpoints: /api/chat, /api/user, /api/dashboard    │  │
│  │  Middleware: CORS, Error Handling                    │  │
│  │  Storage: In-Memory (Dict-based)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  AI provider API                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Models: 2.5 Flash, 1.5 Pro, 1.5 Flash, Flash Lite  │  │
│  │  Features: Text Generation, Context Understanding    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Architecture

### Frontend Architecture (Next.js 14)

```
finassist-frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Chat Interface (/)
│   │   ├── layout.tsx                # Root Layout with Sidebar
│   │   ├── globals.css               # Global Styles
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Financial Dashboard
│   │   ├── history/
│   │   │   └── page.tsx              # Chat History
│   │   └── settings/
│   │       └── page.tsx              # Settings & Configuration
│   └── components/
│       └── Sidebar.tsx               # Navigation Component
├── public/                           # Static Assets
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript Config
└── next.config.js                    # Next.js Config
```

#### Key Frontend Components

**1. Chat Interface (`page.tsx`)**
- Real-time messaging UI
- Message history display
- AI model selector
- File upload interface
- Suggestion chips
- Loading states

**2. Dashboard (`dashboard/page.tsx`)**
- Financial metrics cards
- Area charts (monthly trends)
- Pie charts (expense breakdown)
- Progress bars (emergency fund)
- Key performance indicators

**3. History (`history/page.tsx`)**
- Session list view
- Search functionality
- Session management
- Export capabilities

**4. Settings (`settings/page.tsx`)**
- AI model configuration
- Parameter tuning (temperature, top-p, top-k)
- Appearance settings
- Privacy controls

**5. Sidebar (`Sidebar.tsx`)**
- Navigation menu
- Active route highlighting
- Model indicator
- Pro tips display

---

### Backend Architecture (FastAPI)

```
finassist-backend/
├── main.py                           # FastAPI Application
├── requirements.txt                  # Python Dependencies
├── .env                              # Environment Variables
└── __pycache__/                      # Python Cache
```

#### API Endpoints Structure

```python
FastAPI App
├── Middleware
│   └── CORS (localhost:3000)
├── Routes
│   ├── GET  /                        # Health Check
│   ├── POST /api/chat                # AI Chat
│   ├── POST /api/user/profile        # Create Profile
│   ├── GET  /api/user/profile/{id}   # Get Profile
│   ├── POST /api/dashboard/data      # Dashboard Metrics
│   ├── GET  /api/chat/history/{id}   # Chat History
│   ├── POST /api/settings            # Update Settings
│   ├── POST /api/model/change        # Change Model
│   ├── POST /api/file/upload         # File Upload
│   └── POST /api/scenario/calculate  # Scenario Calc
└── Storage
    ├── users_db: Dict                # User Profiles
    ├── chat_sessions: Dict           # Active Sessions
    └── chat_history: Dict            # Message History
```

---

## 🔄 Data Flow

### Chat Message Flow

```
1. User Input
   └─> Frontend: page.tsx
       └─> State: setInput(message)
           └─> Event: handleSubmit()

2. API Request
   └─> Axios POST to /api/chat
       └─> Headers: Content-Type: application/json
           └─> Body: {
                 message: string,
                 session_id: string,
                 user_id: string,
                 model_name: string
               }

3. Backend Processing
   └─> FastAPI: @app.post("/api/chat")
       └─> Validate Request
           └─> Get/Create Session
               └─> Build Context from History
                   └─> Add Financial Context Prompt

4. AI Generation
   └─> AI API Call
       └─> Model: genai.GenerativeModel(model_name)
           └─> Generate: model.generate_content(prompt)
               └─> Response: AI-generated text

5. Response Storage
   └─> Store in chat_sessions[session_id]
       └─> Append user message
           └─> Append assistant message

6. API Response
   └─> Return JSON: {
         response: string,
         session_id: string,
         model_used: string
       }

7. Frontend Update
   └─> Update messages state
       └─> Render new message
           └─> Scroll to bottom
               └─> Clear input field
```

---

## 💾 Data Models

### Frontend TypeScript Interfaces

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatRequest {
  message: string
  session_id: string
  user_id: string
  model_name: string
}

interface DashboardData {
  monthly_income: number
  monthly_expenses: number
  savings: number
  debts: number
  monthly_savings: number
  emergency_fund_3months: number
  emergency_fund_6months: number
  savings_rate: number
  debt_to_income: number
}

interface SettingsState {
  temperature: number
  topP: number
  topK: number
  maxTokens: number
  darkMode: boolean
  notifications: boolean
  soundEffects: boolean
}
```

### Backend Pydantic Models

```python
class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    session_id: str
    user_id: str
    model_name: str = "llama-3.3-70b-versatile"

class UserProfile(BaseModel):
    user_id: str
    name: str
    age: int
    monthly_income: float
    monthly_expenses: float
    savings: float
    debts: float
    financial_goals: str
    risk_tolerance: str

class SettingsUpdate(BaseModel):
    temperature: float = 0.7
    top_p: float = 0.9
    top_k: int = 40
    max_tokens: int = 2048

class ModelChange(BaseModel):
    user_id: str
    model_name: str
```

---

## 🔐 Security Architecture

### Current Implementation

```
┌─────────────────────────────────────────────────────────────┐
│                      Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│  1. Environment Variables                                    │
│     └─> API keys stored in .env                             │
│     └─> Not committed to git (.gitignore)                   │
├─────────────────────────────────────────────────────────────┤
│  2. CORS Protection                                          │
│     └─> Whitelist: localhost:3000, 127.0.0.1:3000          │
│     └─> Credentials: Enabled                                │
├─────────────────────────────────────────────────────────────┤
│  3. Input Validation                                         │
│     └─> Pydantic models validate all inputs                 │
│     └─> Type checking enforced                              │
├─────────────────────────────────────────────────────────────┤
│  4. Error Handling                                           │
│     └─> Try-catch blocks in all endpoints                   │
│     └─> Generic error messages to client                    │
└─────────────────────────────────────────────────────────────┘
```

### Production Security Recommendations

```
┌─────────────────────────────────────────────────────────────┐
│                  Production Security Stack                   │
├─────────────────────────────────────────────────────────────┤
│  1. Authentication & Authorization                           │
│     └─> JWT tokens                                          │
│     └─> OAuth2 / Auth0                                      │
│     └─> Role-based access control                           │
├─────────────────────────────────────────────────────────────┤
│  2. Data Encryption                                          │
│     └─> HTTPS/TLS for all traffic                          │
│     └─> Database encryption at rest                         │
│     └─> Encrypted API keys in vault                         │
├─────────────────────────────────────────────────────────────┤
│  3. Rate Limiting                                            │
│     └─> API rate limits per user                            │
│     └─> DDoS protection                                     │
│     └─> Request throttling                                  │
├─────────────────────────────────────────────────────────────┤
│  4. Input Sanitization                                       │
│     └─> SQL injection prevention                            │
│     └─> XSS protection                                      │
│     └─> CSRF tokens                                         │
├─────────────────────────────────────────────────────────────┤
│  5. Monitoring & Logging                                     │
│     └─> Security event logging                              │
│     └─> Intrusion detection                                 │
│     └─> Audit trails                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI/UX Architecture

### Design System

**Color Palette:**
```css
--primary: #6366f1        /* Indigo */
--secondary: #10b981      /* Green */
--background: #0f172a     /* Dark Blue */
--surface: #1e293b        /* Slate */
--text-primary: #f8fafc   /* White */
--text-secondary: #94a3b8 /* Gray */
```

**Typography:**
- Font Family: Inter
- Sizes: 12px - 28px
- Weights: 400, 500, 600, 700

**Spacing:**
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48

**Border Radius:**
- Small: 8px
- Medium: 12px
- Large: 16px
- Circle: 50%

### Animation Strategy

**Framer Motion Animations:**
```typescript
// Page transitions
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

// Hover effects
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}

// Loading states
animate={{ rotate: 360 }}
transition={{ repeat: Infinity, duration: 1 }}
```

---

## 📊 State Management

### Frontend State Architecture

```
Application State
├── Local Component State (useState)
│   ├── messages: Message[]
│   ├── input: string
│   ├── isLoading: boolean
│   ├── selectedModel: Model
│   └── settings: SettingsState
├── Session Storage
│   └── sessionId: string
└── API State (Axios)
    ├── Request state
    ├── Response state
    └── Error state
```

### Backend State Architecture

```
Application State
├── In-Memory Storage
│   ├── users_db: Dict[str, UserProfile]
│   ├── chat_sessions: Dict[str, List[Message]]
│   └── chat_history: Dict[str, List[Message]]
└── Session Management
    └── Session ID generation
    └── Context building from history
```

---

## 🔌 API Integration

### AI Integration

```python
# Configuration
genai.configure(api_key=API_KEY)

# Available Models
AVAILABLE_MODELS = {
    "llama-3.3-70b-versatile": "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant": "llama-3.1-8b-instant",
    "llama3-8b-8192": "llama3-8b-8192"
}

# Model Initialization
model = genai.GenerativeModel(model_name)

# Content Generation
response = model.generate_content(prompt)
```

### Frontend API Client

```typescript
// Axios Configuration
const API_BASE_URL = 'http://localhost:8000'

// Chat Request
const response = await axios.post(`${API_BASE_URL}/api/chat`, {
  message: content,
  session_id: sessionId,
  user_id: 'default_user',
  model_name: selectedModel.id
})

// Error Handling
try {
  // API call
} catch (error) {
  console.error('Chat error:', error)
  // Show error message
}
```

---

## 🚀 Deployment Architecture

### Development Environment

```
Local Machine
├── Backend: localhost:8000
├── Frontend: localhost:3000
└── Database: In-Memory
```

### Production Recommendations

```
Cloud Infrastructure
├── Frontend
│   ├── Vercel / Netlify
│   ├── CDN for static assets
│   └── Environment variables
├── Backend
│   ├── AWS EC2 / Google Cloud Run
│   ├── Load balancer
│   ├── Auto-scaling
│   └── Health checks
├── Database
│   ├── PostgreSQL / MongoDB
│   ├── Backup strategy
│   └── Replication
└── Monitoring
    ├── Application logs
    ├── Error tracking (Sentry)
    └── Performance monitoring
```

---

## 📈 Performance Optimization

### Frontend Optimizations

1. **Code Splitting**
   - Dynamic imports for routes
   - Lazy loading components
   - Tree shaking unused code

2. **Asset Optimization**
   - Image optimization (Next.js Image)
   - Font subsetting
   - CSS minification

3. **Caching Strategy**
   - Browser caching
   - Service workers
   - API response caching

### Backend Optimizations

1. **Response Time**
   - Async/await for I/O operations
   - Connection pooling
   - Query optimization

2. **Caching**
   - Redis for session storage
   - Response caching
   - Static content caching

3. **Scalability**
   - Horizontal scaling
   - Load balancing
   - Microservices architecture

---

## 🧪 Testing Strategy

### Frontend Testing

```
Testing Pyramid
├── Unit Tests (Jest)
│   └── Component logic
│   └── Utility functions
├── Integration Tests (React Testing Library)
│   └── Component interactions
│   └── API integration
└── E2E Tests (Playwright)
    └── User workflows
    └── Critical paths
```

### Backend Testing

```
Testing Pyramid
├── Unit Tests (pytest)
│   └── Endpoint logic
│   └── Data models
├── Integration Tests
│   └── API endpoints
│   └── Database operations
└── Load Tests (Locust)
    └── Performance benchmarks
    └── Stress testing
```

---

## 📝 Code Quality

### Linting & Formatting

**Frontend:**
- ESLint for code quality
- Prettier for formatting
- TypeScript for type safety

**Backend:**
- Pylint for code quality
- Black for formatting
- MyPy for type checking

### Code Review Checklist

- [ ] Follows coding standards
- [ ] Has proper error handling
- [ ] Includes type annotations
- [ ] Has meaningful variable names
- [ ] Includes comments for complex logic
- [ ] No hardcoded values
- [ ] Security best practices followed
- [ ] Performance optimized

---

## 🔄 CI/CD Pipeline

### Recommended Pipeline

```
Git Push
  └─> GitHub Actions
      ├─> Lint & Format Check
      ├─> Run Tests
      ├─> Build Application
      ├─> Security Scan
      └─> Deploy
          ├─> Staging Environment
          │   └─> Integration Tests
          │       └─> Manual Approval
          └─> Production Environment
              └─> Health Check
                  └─> Rollback on Failure
```

---

## 📚 Documentation Structure

```
Project Documentation
├── README.md                 # Overview & setup
├── ARCHITECTURE.md           # This file
├── QUICK_START.md           # Getting started guide
├── TROUBLESHOOTING.md       # Common issues
├── API_REFERENCE.md         # API documentation
└── CONTRIBUTING.md          # Contribution guidelines
```

---

**Last Updated**: 2024
**Version**: 1.0.0
