from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict
from groq import Groq
import os
import json
from datetime import datetime
import uuid
from dotenv import load_dotenv
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import io
import base64
import re

# Load environment variables
load_dotenv()

app = FastAPI(title="FinAssist API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure API
API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=API_KEY)

# Available models
AVAILABLE_MODELS = {
    "llama-3.3-70b-versatile": "llama-3.3-70b-versatile",  # Fast and capable
}

# In-memory storage (replace with database in production)
users_db: Dict = {}
chat_sessions: Dict = {}
chat_history: Dict = {}

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: str

class ChatRequest(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
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

class CodeExecutionRequest(BaseModel):
    code: str
    session_id: str

@app.get("/")
def root():
    return {"message": "FinAssist API is running", "version": "1.0.0"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Main chat endpoint"""
    try:
        # Validate API key
        if not API_KEY:
            raise HTTPException(
                status_code=500,
                detail="API key not configured. Please set GROQ_API_KEY environment variable."
            )
        
        model_name = AVAILABLE_MODELS.get(request.model_name, "llama-3.3-70b-versatile")
        
        # Get or create session
        if request.session_id not in chat_sessions:
            chat_sessions[request.session_id] = []
        
        # Build context from history
        context = ""
        for msg in chat_sessions[request.session_id][-10:]:  # Last 10 messages
            context += f"{msg['role']}: {msg['content']}\n"
        
        # Financial context prompt with domain restriction
        financial_context = """You are FinAssist, an AI financial assistant specializing EXCLUSIVELY in personal finance, savings, budgeting, and financial planning.

STRICT DOMAIN POLICY:
You MUST ONLY respond to questions related to:
- Personal finance and money management
- Savings and investment strategies
- Budgeting and expense tracking
- Debt management and repayment
- Financial planning and goals
- Indian financial products (FD, PPF, mutual funds, etc.)
- Tax planning and savings
- Emergency funds and insurance
- Retirement planning
- Income and expense analysis
- Financial calculations and metrics

If the user asks about ANYTHING outside these finance topics (like general knowledge, entertainment, sports, technology, health, cooking, travel, etc.), you MUST politely decline with this exact response:
"I'm FinAssist, your financial assistant. I can only help with personal finance, budgeting, savings, investments, and money management questions. Please ask me something related to your finances, and I'll be happy to help! 💰"

RESPONSE GUIDELINES (for finance questions only):
- Keep responses SHORT and PRECISE (2-3 paragraphs max)
- Use bullet points for lists
- Format numbers clearly with Indian Rupee symbol (e.g., ₹50,000 not 50000)
- Be conversational but professional
- Focus on actionable advice
- Use Indian context for financial advice (Rupees, Indian financial products)

CAPABILITIES (finance-related only):
- Savings fund calculations
- Budget analysis
- Saving strategies
- Financial health assessment
- Debt repayment planning
- Investment advice (Indian context)
- Tax planning tips
- Data visualization (Python code)

IMPORTANT - DATA VISUALIZATION:
When the user asks for charts, graphs, or visualizations (e.g., "show me a chart", "create a graph", "visualize my expenses"), you MUST:
1. Provide a brief explanation (1-2 sentences)
2. Then provide Python code in this EXACT format:

```python
import matplotlib.pyplot as plt
import numpy as np

# Set up figure with dark theme
fig, ax = plt.subplots(figsize=(10, 6), facecolor='#1e293b')
ax.set_facecolor('#1e293b')

# Your visualization code here
# Example: ax.bar(['Category1', 'Category2'], [value1, value2], color='#6366f1')

# Style the chart for dark theme
ax.set_title('Chart Title', color='white', fontsize=16, pad=20)
ax.set_xlabel('X Label', color='white', fontsize=12)
ax.set_ylabel('Y Label', color='white', fontsize=12)
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

plt.tight_layout()
```

CRITICAL RULES for visualization code:
- Always use the EXACT format: ```python (with backticks)
- Import matplotlib.pyplot as plt at the start
- Use fig, ax = plt.subplots() for creating plots
- Set facecolor='#1e293b' for dark theme on figure and axes
- Use ax.bar(), ax.pie(), ax.plot() instead of plt.bar(), plt.pie(), plt.plot()
- Set all text colors to 'white' (title, labels, ticks)
- Do NOT include plt.show() - it will be handled automatically
- Do NOT pass facecolor to tight_layout() - it doesn't accept that parameter
- Use colors like '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981' for bars/slices
- Keep code simple and executable
- Include proper labels and titles

REMEMBER: If the question is not about finance, politely decline and redirect to financial topics."""
        
        # Generate response
        full_prompt = f"{financial_context}\n\nConversation:\n{context}\nUser: {request.message}"
        
        response = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": full_prompt}],
            max_tokens=2048,
            temperature=0.7
        )
        response_text = response.choices[0].message.content
        
        # Check if response contains Python code for visualization
        image_data = None
        if '```python' in response_text:
            # Extract Python code
            import re
            code_match = re.search(r'```python\n(.*?)\n```', response_text, re.DOTALL)
            if code_match:
                python_code = code_match.group(1)
                print(f"📊 Executing visualization code...")
                print(f"Code length: {len(python_code)} characters")
                
                # Try to execute the code and generate image
                try:
                    plt.clf()
                    plt.close('all')
                    
                    import numpy as np
                    safe_globals = {
                        'plt': plt,
                        'matplotlib': matplotlib,
                        'np': np,
                        'numpy': np,
                    }
                    
                    # Execute code
                    exec(python_code.replace('plt.show()', ''), safe_globals, {})
                    
                    # Save to base64
                    buf = io.BytesIO()
                    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1e293b')
                    buf.seek(0)
                    image_data = f"data:image/png;base64,{base64.b64encode(buf.read()).decode('utf-8')}"
                    
                    plt.close('all')
                    buf.close()
                    
                    print(f"✅ Visualization generated successfully! Image size: {len(image_data)} bytes")
                    
                    # Remove code from response, keep only explanation
                    response_text = re.sub(r'```python\n.*?\n```', '', response_text, flags=re.DOTALL).strip()
                    
                except Exception as e:
                    print(f"❌ Error executing visualization code: {e}")
                    import traceback
                    print(traceback.format_exc())
                    # Add error message to response instead of failing silently
                    response_text += f"\n\n⚠️ Note: I generated visualization code but encountered an error executing it. The chart couldn't be displayed."
            else:
                print("⚠️ Found ```python marker but couldn't extract code")
        
        # Store message in history with timestamp
        timestamp = datetime.now().isoformat()
        user_msg = {
            "role": "user",
            "content": request.message,
            "timestamp": timestamp
        }
        
        assistant_msg = {
            "role": "assistant",
            "content": response_text,
            "timestamp": timestamp
        }
        
        if image_data:
            assistant_msg["image"] = image_data
        
        chat_sessions[request.session_id].append(user_msg)
        chat_sessions[request.session_id].append(assistant_msg)
        
        # Store in persistent history
        if request.user_id not in chat_history:
            chat_history[request.user_id] = []
        
        chat_history[request.user_id].append({
            "session_id": request.session_id,
            "messages": [user_msg, assistant_msg]
        })
        
        return {
            "response": response_text,
            "session_id": request.session_id,
            "model_used": request.model_name,
            "image": image_data
        }
    except Exception as e:
        error_msg = str(e).lower()
        if "quota" in error_msg or "rate" in error_msg or "limit" in error_msg:
            raise HTTPException(
                status_code=429,
                detail="AI API quota exceeded. Please check your API plan or retry after a few minutes."
            )
        elif "key" in error_msg or "auth" in error_msg:
            raise HTTPException(
                status_code=401,
                detail="API key not valid. Please check your GROQ_API_KEY environment variable."
            )
        else:
            raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@app.post("/api/user/profile")
async def create_profile(profile: UserProfile):
    """Create or update user profile"""
    users_db[profile.user_id] = profile.dict()
    return {"status": "success", "user_id": profile.user_id}

@app.get("/api/user/profile/{user_id}")
async def get_profile(user_id: str):
    """Get user profile"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="Profile not found")
    return users_db[user_id]

@app.post("/api/settings")
async def update_settings(settings: SettingsUpdate):
    """Update LLM settings"""
    return settings.dict()

@app.post("/api/model/change")
async def change_model(change: ModelChange):
    """Change AI model"""
    if change.model_name not in AVAILABLE_MODELS:
        raise HTTPException(status_code=400, detail="Invalid model name")
    return {"status": "success", "model": change.model_name}

@app.get("/api/chat/history/{user_id}")
async def get_chat_history(user_id: str):
    """Get all chat history for a user"""
    if user_id not in chat_history:
        return {"history": []}
    return {"history": chat_history[user_id]}

@app.get("/api/chat/session/{session_id}")
async def get_session(session_id: str):
    """Get specific session messages"""
    if session_id not in chat_sessions:
        return {"messages": []}
    return {"messages": chat_sessions[session_id]}

@app.post("/api/file/upload")
async def upload_file(file: UploadFile = File(...)):
    """Handle file uploads (bank statements)"""
    # In production, save to cloud storage
    return {
        "filename": file.filename,
        "status": "uploaded",
        "size": file.size
    }

@app.post("/api/dashboard/data")
async def get_dashboard_data(user_id: str):
    """Generate dashboard data with charts"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile = users_db[user_id]
    
    # Calculate savings fund metrics
    monthly_savings = profile["monthly_income"] - profile["monthly_expenses"]
    savings_fund_3months = profile["monthly_expenses"] * 3
    savings_fund_6months = profile["monthly_expenses"] * 6
    
    return {
        "monthly_income": profile["monthly_income"],
        "monthly_expenses": profile["monthly_expenses"],
        "savings": profile["savings"],
        "debts": profile["debts"],
        "monthly_savings": monthly_savings,
        "savings_fund_3months": savings_fund_3months,
        "savings_fund_6months": savings_fund_6months,
        "savings_rate": (monthly_savings / profile["monthly_income"]) * 100 if profile["monthly_income"] > 0 else 0,
        "debt_to_income": (profile["debts"] / profile["monthly_income"]) * 100 if profile["monthly_income"] > 0 else 0
    }

@app.post("/api/scenario/calculate")
async def calculate_scenario(scenario: Dict):
    """Calculate scenario-based savings fund"""
    months = scenario.get("months", 3)
    monthly_expenses = scenario.get("monthly_expenses", 0)
    
    return {
        "required_fund": monthly_expenses * months,
        "months": months,
        "current_savings": scenario.get("current_savings", 0),
        "gap": (monthly_expenses * months) - scenario.get("current_savings", 0)
    }

@app.post("/api/execute/python")
async def execute_python_code(request: CodeExecutionRequest):
    """Execute Python code and return visualization as base64 image"""
    try:
        # Create a new figure
        plt.clf()
        plt.close('all')
        
        # Prepare execution environment with necessary imports
        import numpy as np
        
        safe_globals = {
            'plt': plt,
            'matplotlib': matplotlib,
            'np': np,
            'numpy': np,
        }
        
        safe_locals = {}
        
        # Execute the code (remove plt.show() as we'll save instead)
        code_to_execute = request.code.replace('plt.show()', '').strip()
        exec(code_to_execute, safe_globals, safe_locals)
        
        # Save plot to bytes
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1e293b')
        buf.seek(0)
        
        # Convert to base64
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        
        # Clean up
        plt.close('all')
        buf.close()
        
        return {
            "success": True,
            "image": f"data:image/png;base64,{img_base64}",
            "message": "Code executed successfully"
        }
        
    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc(),
            "message": "Failed to execute code"
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    print(f"🚀 Starting FinAssist Backend on http://localhost:{port}")
    print(f"📚 API Documentation: http://localhost:{port}/docs")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")