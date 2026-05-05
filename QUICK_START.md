# FinAssist Quick Start Guide

## 🚀 Get Running in 3 Steps

### Step 1: Start the Backend

**Option A - Using Batch File (Windows)**
```bash
# Double-click START_BACKEND.bat
# OR run in terminal:
START_BACKEND.bat
```

**Option B - Manual Start**
```bash
cd finassist-backend
pip install -r requirements.txt
python main.py
```

**Expected Output:**
```
🚀 Starting FinAssist Backend on http://localhost:8000
📚 API Documentation: http://localhost:8000/docs
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ **Backend is ready when you see "Uvicorn running"**

---

### Step 2: Start the Frontend

**Open a NEW terminal window**

**Option A - Using Batch File (Windows)**
```bash
# Double-click START_FRONTEND.bat
# OR run in terminal:
START_FRONTEND.bat
```

**Option B - Manual Start**
```bash
cd finassist-frontend
npm install
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

✅ **Frontend is ready when you see "compiled successfully"**

---

### Step 3: Open the App

Open your browser and visit:
```
http://localhost:3000
```

You should see the FinAssist chat interface!

---

## ✅ Verification Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Browser shows FinAssist interface
- [ ] Can send messages in chat
- [ ] AI responds to messages

---

## 🐛 If Something Goes Wrong

### Backend Won't Start

**Error: "Port 8000 already in use"**
```bash
# Windows - Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Error: "Module not found"**
```bash
cd finassist-backend
pip install -r requirements.txt
```

**Error: "Groq API key not configured"**
- Check `finassist-backend/.env` file exists
- Verify GROQ_API_KEY is set

### Frontend Won't Start

**Error: "Port 3000 already in use"**
```bash
# Kill process or change port
# In package.json, change: "dev": "next dev -p 3001"
```

**Error: "Module not found"**
```bash
cd finassist-frontend
rm -rf node_modules package-lock.json
npm install
```

### Chat Shows Error

**Error: "Please make sure the backend is running"**

1. Check backend terminal - should show "Uvicorn running"
2. Visit http://localhost:8000 - should show JSON response
3. Check browser console (F12) for network errors
4. Verify CORS settings in backend

---

## 🎯 First Time Setup

### 1. Install Prerequisites

**Python 3.8+**
```bash
python --version
# If not installed: https://www.python.org/downloads/
```

**Node.js 18+**
```bash
node --version
# If not installed: https://nodejs.org/
```

### 2. Get Groq API Key

1. Visit: https://console.groq.com/keys
2. Sign up or log in
3. Create new API key
4. Copy the key
5. Add to `finassist-backend/.env`:
```
GROQ_API_KEY=your_key_here
```

### 3. Install Dependencies

**Backend:**
```bash
cd finassist-backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd finassist-frontend
npm install
```

---

## 📱 Using the App

### Chat Interface
1. Type your financial question
2. Click send or press Enter
3. AI responds with personalized advice

**Example Questions:**
- "Calculate my emergency fund"
- "Tips for saving money"
- "Analyze my financial health"

### Dashboard
1. Click "Dashboard" in sidebar
2. View financial metrics and charts
3. Track emergency fund progress

### Settings
1. Click "Settings" in sidebar
2. Adjust AI model parameters
3. Change temperature for creativity
4. Select different Llama models

---

## 🔧 Configuration

### Change Backend Port

Edit `finassist-backend/.env`:
```
BACKEND_PORT=8001
```

Also update frontend API URL in `finassist-frontend/src/app/page.tsx`:
```typescript
const response = await axios.post('http://localhost:8001/api/chat', {
```

### Change AI Model

In chat interface:
1. Click model selector (top right)
2. Only one model available:
   - Llama 3.3 70B (most capable and fast)

---

## 📊 Testing the API

Visit API documentation:
```
http://localhost:8000/docs
```

Test endpoints interactively with Swagger UI.

---

## 🎨 Features Overview

### ✨ AI Chat
- Real-time conversation
- Context-aware responses
- Multiple AI models
- Session history

### 📈 Dashboard
- Income/expense tracking
- Emergency fund calculator
- Savings rate analysis
- Interactive charts

### 📜 History
- View past conversations
- Search chat history
- Export data

### ⚙️ Settings
- AI model configuration
- Temperature/Top-P/Top-K tuning
- Appearance customization
- Notification preferences

---

## 🚦 Status Indicators

### Backend Status
- ✅ Running: Terminal shows "Uvicorn running"
- ❌ Stopped: No output or error messages
- ⚠️ Error: Red error messages in terminal

### Frontend Status
- ✅ Running: Terminal shows "compiled successfully"
- ❌ Stopped: No output
- ⚠️ Error: Compilation errors shown

### API Connection
- ✅ Connected: Chat works, AI responds
- ❌ Disconnected: Error message in chat
- ⚠️ Slow: Long loading times

---

## 💡 Pro Tips

1. **Keep both terminals open** - Don't close backend/frontend terminals
2. **Check logs** - Errors appear in terminal windows
3. **Use API docs** - Test endpoints at /docs
4. **Save API key** - Store in .env, not in code
5. **Restart on changes** - Restart servers after config changes

---

## 📞 Need Help?

1. Check `TROUBLESHOOTING.md` for detailed solutions
2. Review `README.md` for architecture details
3. Visit http://localhost:8000/docs for API reference
4. Check browser console (F12) for frontend errors
5. Check terminal for backend errors

---

## 🎉 You're All Set!

Your FinAssist application should now be running. Start chatting with your AI financial assistant!

**Next Steps:**
- Try asking about emergency funds
- Explore the dashboard
- Customize AI settings
- Review your chat history

---

**Happy Financial Planning! 💰**
