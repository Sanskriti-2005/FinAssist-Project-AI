# 🚀 START HERE - FinAssist Quick Setup

## ⚡ Get Running in 2 Minutes

### What You're Seeing
Your FinAssist app shows an error: **"Sorry, I encountered an error. Please make sure the backend is running."**

### Why It's Happening
The backend server (Python FastAPI) isn't running. The frontend (Next.js) can't connect to it.

### The Fix (Choose One)

---

## 🎯 Option 1: One-Click Start (Easiest)

### Step 1: Start Backend
**Double-click this file:**
```
START_BACKEND.bat
```

Wait for this message:
```
🚀 Starting FinAssist Backend on http://localhost:8000
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Start Frontend (if not running)
**Double-click this file:**
```
START_FRONTEND.bat
```

Wait for this message:
```
✓ Ready in 2.5s
```

### Step 3: Test
Open browser: http://localhost:3000

**Send a message in chat - it should work now!** ✅

---

## 🛠️ Option 2: Manual Start

### Terminal 1 - Backend
```bash
cd finassist-backend
pip install -r requirements.txt
python main.py
```

### Terminal 2 - Frontend
```bash
cd finassist-frontend
npm install
npm run dev
```

### Test
Open: http://localhost:3000

---

## ✅ How to Know It's Working

### Backend Running ✅
- Terminal shows: `Uvicorn running on http://0.0.0.0:8000`
- Visit http://localhost:8000 → See JSON response

### Frontend Running ✅
- Terminal shows: `compiled successfully`
- Visit http://localhost:3000 → See FinAssist interface

### Chat Working ✅
- Send message → AI responds
- No error messages

---

## 🐛 Still Not Working?

### Problem: "cannot import name 'PYDANTIC_V2'"
**This is a dependency version conflict!**

**Quick Fix:**
```bash
# Double-click this file:
FIX_DEPENDENCIES.bat
```

**Then try starting backend again:**
```bash
START_BACKEND.bat
```

**Manual Fix:**
```bash
cd finassist-backend
pip uninstall -y fastapi pydantic uvicorn
pip install fastapi==0.109.2 pydantic==2.6.1 uvicorn[standard]==0.27.1
```

See [DEPENDENCY_FIX_GUIDE.md](DEPENDENCY_FIX_GUIDE.md) for detailed instructions.

---

### Problem: "Python not found"
**Solution:**
1. Install Python: https://www.python.org/downloads/
2. Check: `python --version` (should be 3.8+)

### Problem: "Module not found"
**Solution:**
```bash
cd finassist-backend
pip install -r requirements.txt
```

### Problem: "Port 8000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Then restart backend
```

### Problem: "API key not configured"
**Solution:**
1. Create file: `finassist-backend/.env`
2. Add line: `GROQ_API_KEY=your_key_here`
3. Get key from your provider and add it to `.env`
4. Restart backend

---

## 📚 More Help

### Quick Guides
- **QUICK_START.md** - Detailed setup guide
- **ERROR_FIX_GUIDE.md** - Fix the error you're seeing
- **TROUBLESHOOTING.md** - 10+ common issues solved

### Documentation
- **README.md** - Complete project overview
- **ARCHITECTURE.md** - Technical details
- **ANALYSIS_SUMMARY.md** - What was fixed

### API Reference
- http://localhost:8000/docs - Interactive API docs

---

## 🎯 Quick Commands

### Check Status
```bash
# Backend
curl http://localhost:8000

# Frontend
curl http://localhost:3000
```

### Restart Services
```bash
# Stop: Press Ctrl+C in terminal
# Start: Run python main.py or npm run dev again
```

### View Logs
- Backend logs: Check terminal running `python main.py`
- Frontend logs: Check terminal running `npm run dev`
- Browser logs: Press F12 → Console tab

---

## 💡 Pro Tips

1. **Keep terminals open** - Don't close backend/frontend terminals
2. **Backend first** - Always start backend before using frontend
3. **Check ports** - Make sure 8000 and 3000 are free
4. **Read errors** - Terminal shows helpful error messages
5. **Use batch files** - Easiest way to start on Windows

---

## 🎉 Success!

Once both services are running:
1. Open http://localhost:3000
2. Type a message: "Calculate my emergency fund"
3. AI responds with financial advice
4. Explore Dashboard, History, Settings

**You're ready to use FinAssist!** 🎊

---

## 📞 Need More Help?

### Step-by-Step Guides
1. Read **QUICK_START.md** for detailed instructions
2. Check **ERROR_FIX_GUIDE.md** for your specific error
3. Review **TROUBLESHOOTING.md** for common issues

### Verify Installation
```bash
# Check Python
python --version  # Should be 3.8+

# Check Node
node --version    # Should be 18+

# Check dependencies
cd finassist-backend && pip list
cd finassist-frontend && npm list --depth=0
```

### Test Backend Directly
```bash
# Start backend
cd finassist-backend
python main.py

# In another terminal, test API
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","session_id":"test","user_id":"test","model_name":"llama-3.3-70b-versatile"}'
```

---

## 🔑 First Time Setup

### 1. Get API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### 2. Configure Backend
Create `finassist-backend/.env`:
```
GROQ_API_KEY=paste_your_key_here
BACKEND_PORT=8000
```

### 3. Install Dependencies
```bash
# Backend
cd finassist-backend
pip install -r requirements.txt

# Frontend
cd finassist-frontend
npm install
```

### 4. Start Services
Use batch files or manual commands above

---

## 🎨 What You Can Do

### Chat with AI
- Ask about emergency funds
- Get saving tips
- Analyze financial health
- Budget planning advice

### View Dashboard
- Income/expense tracking
- Emergency fund progress
- Savings rate analysis
- Interactive charts

### Manage History
- View past conversations
- Search chat history
- Export data

### Configure Settings
- Change AI models
- Adjust creativity (temperature)
- Customize appearance
- Set preferences

---

## ⚠️ Important Notes

### Keep Backend Running
- Backend must run while using app
- Don't close backend terminal
- Restart after code changes

### Port Requirements
- Backend: Port 8000
- Frontend: Port 3000
- Both must be available

### API Key Required
- Get from Groq Console (https://console.groq.com/keys)
- Store in .env file
- Never commit to git

---

## 🚦 Status Check

### ✅ Everything Working
- Backend terminal: "Uvicorn running"
- Frontend terminal: "compiled successfully"
- Browser: No errors in console (F12)
- Chat: AI responds to messages

### ❌ Something Wrong
- Check terminal for error messages
- Visit http://localhost:8000 (should show JSON)
- Check browser console (F12)
- Read ERROR_FIX_GUIDE.md

---

## 🎯 Next Steps

1. ✅ Start backend (python main.py)
2. ✅ Start frontend (npm run dev)
3. ✅ Open http://localhost:3000
4. ✅ Send a test message
5. ✅ Explore features

**Happy Financial Planning!** 💰

---

**Quick Links:**
- [Quick Start Guide](QUICK_START.md)
- [Error Fix Guide](ERROR_FIX_GUIDE.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Full Documentation](README.md)
