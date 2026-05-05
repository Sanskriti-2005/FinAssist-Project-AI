# 🚀 Groq API Setup Guide

## What is Groq?

Groq provides ultra-fast AI inference using their custom LPU (Language Processing Unit) hardware. FinAssist uses Groq to power its AI financial assistant with Llama models.

---

## ✅ Step-by-Step Setup

### Step 1: Create Groq Account

1. Visit: **https://console.groq.com**
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with:
   - Google account
   - GitHub account
   - Email address

### Step 2: Get API Key

1. After logging in, go to: **https://console.groq.com/keys**
2. Click **"Create API Key"**
3. Give it a name (e.g., "FinAssist")
4. Click **"Submit"**
5. **Copy the API key** (starts with `gsk_...`)
   - ⚠️ **Important:** Save it now! You won't be able to see it again

### Step 3: Add API Key to Project

1. Open `FinAssist-AI-Project/finassist-backend/.env`
2. Add your API key:
   ```env
   GROQ_API_KEY=gsk_your_actual_key_here
   BACKEND_PORT=8000
   FRONTEND_URL=http://localhost:3000
   ```
3. Save the file

### Step 4: Start Backend

```bash
cd FinAssist-AI-Project/finassist-backend
python main.py
```

You should see:
```
🚀 Starting FinAssist Backend on http://localhost:8000
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## 🤖 Available Models

FinAssist supports these Groq models:

| Model | Description | Best For |
|-------|-------------|----------|
| **Llama 3.3 70B Versatile** | Most capable, fast | Complex financial analysis |
| **Llama 3.1 8B Instant** | Balanced performance | General queries |
| **Llama 3 8B** | Lightweight, efficient | Quick responses |

---

## 🔍 Verify Setup

### Test 1: Check Backend
```bash
curl http://localhost:8000/
```

**Expected Response:**
```json
{"message":"FinAssist API is running","version":"1.0.0"}
```

### Test 2: Test Chat API
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","session_id":"test","user_id":"test","model_name":"llama-3.3-70b-versatile"}'
```

**Expected Response:**
```json
{
  "response": "Hello! I'm FinAssist, your AI financial assistant...",
  "session_id": "test",
  "model_used": "llama-3.3-70b-versatile"
}
```

---

## 🆓 Free Tier Limits

Groq offers generous free tier:
- **Rate Limits:** 30 requests/minute
- **Token Limits:** Varies by model
- **No credit card required** for free tier

Check current limits: https://console.groq.com/settings/limits

---

## 🐛 Troubleshooting

### Error: "API key not valid"

**Solution:**
1. Verify API key is correct in `.env` file
2. Make sure key starts with `gsk_`
3. Check for extra spaces or quotes
4. Restart backend after changing `.env`

### Error: "Rate limit exceeded"

**Solution:**
1. Wait 1 minute before trying again
2. Upgrade to paid plan for higher limits
3. Use a different model (smaller models have higher limits)

### Error: "Unable to connect to Groq"

**Solution:**
1. Check internet connection
2. Verify Groq service status: https://status.groq.com
3. Check firewall settings

---

## 🔒 Security Best Practices

### DO:
✅ Store API key in `.env` file only  
✅ Add `.env` to `.gitignore`  
✅ Never commit API keys to GitHub  
✅ Regenerate key if exposed  
✅ Use environment variables in production  

### DON'T:
❌ Hardcode API keys in source code  
❌ Share API keys publicly  
❌ Commit `.env` files to version control  
❌ Use same key across multiple projects  

---

## 📊 Monitoring Usage

1. Visit: https://console.groq.com/usage
2. View:
   - Request count
   - Token usage
   - Rate limit status
   - Cost (if on paid plan)

---

## 💰 Pricing

**Free Tier:**
- Perfect for development and testing
- Generous rate limits
- All models available

**Paid Plans:**
- Higher rate limits
- Priority support
- Custom solutions

Check pricing: https://groq.com/pricing

---

## 🔄 Switching from Gemini to Groq

If you previously used Gemini:

1. **Update .env file:**
   ```env
   # OLD (remove this)
   # GEMINI_API_KEY=AIzaSy...
   
   # NEW (add this)
   GROQ_API_KEY=gsk_...
   ```

2. **Restart backend** - Changes won't apply until restart

3. **Update model names in frontend** - Already done in latest version

---

## 📚 Resources

- **Groq Console:** https://console.groq.com
- **API Documentation:** https://console.groq.com/docs
- **Model Playground:** https://console.groq.com/playground
- **Status Page:** https://status.groq.com
- **Community:** https://groq.com/community

---

## 🎯 Quick Reference

**Get API Key:** https://console.groq.com/keys  
**View Usage:** https://console.groq.com/usage  
**Check Limits:** https://console.groq.com/settings/limits  
**API Docs:** https://console.groq.com/docs  

---

## ✅ Checklist

Before starting FinAssist:

- [ ] Created Groq account
- [ ] Generated API key
- [ ] Added key to `.env` file
- [ ] Saved `.env` file
- [ ] Restarted backend
- [ ] Tested API endpoint
- [ ] Frontend can connect to backend

---

**You're all set! Start chatting with your AI financial assistant! 💬**
