
# FinAssist - AI-Powered Financial Assistant

An intelligent financial assistant that helps users calculate emergency funds, analyze financial health, and receive personalized saving tips.



## Objective
To simplify personal finance management using AI-driven insights, real-time dashboards, and intuitive user interaction.
## Architecture
### Backend (FastAPI)
- **Framework**: FastAPI with Python
- **AI Model**: Groq (Llama 3.3 70B, Llama 3.1 8B, Llama 3 8B)
- **API**: RESTful endpoints for chat, user profiles, dashboard data
- **Storage**: In-memory (upgrade to database for production)

### Frontend (Next.js)
- **Framework**: Next.js 14 with TypeScript
- **UI Library**: React 18 with Framer Motion
- **Charts**: Recharts for data visualization
- **Styling**: Custom CSS with dark theme


## Project Structure
```
finassist/
├── finassist-backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── finassist-frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Chat interface
│   │   │   ├── dashboard/         # Financial dashboard
│   │   │   ├── history/           # Chat history
│   │   │   ├── settings/          # AI settings
│   │   │   └── layout.tsx         # Root layout
│   │   └── components/
│   │       └── Sidebar.tsx        # Navigation sidebar
│   ├── package.json
│   └── next.config.js
└── README.md
```
### Prerequisites
- Python 3.8+
- Node.js 18+
- Groq API Key (free at https://console.groq.com/keys)





## Installation

Install my-project with npm
1. Clone the repository

git clone https://github.com/Sanskriti-2005/FinAssist-AI-Project.git
cd FinAssist-AI-Project

2. Backend Start
```bash
cd finassist-backend
pip install -r requirements.txt
python main.py
```
3. Frontend Start

**Open a NEW terminal window**
```bash
cd finassist-frontend
npm install
npm run dev
```




    
## Features

### 1. AI Chat Interface
- Real-time conversation with AI financial assistant
- **Domain-specific**: Only responds to finance-related questions
- Context-aware financial advice using dashboard data
- Session-based chat history with persistence
- Auto-execution of Python visualization code
- Markdown formatting for responses

### 2. Financial Dashboard
- 4 input fields: Monthly income, expenses, savings, debts (₹)
- 4 calculated metrics: Monthly savings, savings rate, debt-to-income, debt freedom
- Debt Freedom Timeline with 30% allocation strategy
- Progress visualization with charts
- Data saved to localStorage and shared with chat

### 3. Chat History
- View all past conversations
- Session metadata (title, timestamp, message count)
- Click to load previous conversations
- Data persisted in localStorage

### 4. Settings
- AI model configuration (temperature, top-p only)
- Settings saved to localStorage
- Applied to all future chat interactions

### 5. Domain Restriction 🔒
- **Finance-only responses**: AI politely declines non-finance questions
- Focused on: budgeting, savings, investments, debt management, financial planning
- Ensures relevant and professional financial advice
- See `DOMAIN_RESTRICTION.md` for details

## API Endpoints
### Chat
- `POST /api/chat` - Send message to AI assistant

### User Profile
- `POST /api/user/profile` - Create/update user profile
- `GET /api/user/profile/{user_id}` - Get user profile

### Dashboard
- `POST /api/dashboard/data` - Get dashboard metrics

### History
- `GET /api/chat/history/{session_id}` - Get chat history

### Settings
- `POST /api/settings` - Update AI settings
- `POST /api/model/change` - Change AI model

## UI Components
### Pages

1. **Chat** (`/`) - Main chat interface with AI assistant
2. **Dashboard** (`/dashboard`) - Financial metrics and visualizations
3. **History** (`/history`) - Past conversation management
4. **Settings** (`/settings`) - Configuration and preferences

### Components
- **Sidebar** - Navigation with active route highlighting
- **Message Bubbles** - User and AI message display
- **Charts** - Area charts, pie charts, bar charts for financial data
- **Model Selector** - Dropdown for AI model selection

## Security Considerations
### Current Implementation
- API key stored in environment variables
- CORS enabled for localhost
- In-memory session storage

## Data Flow

1. **User Input** → Frontend chat interface
2. **API Request** → Axios POST to `/api/chat`
3. **Backend Processing** → FastAPI receives request
4. **AI Generation** → AI provider processes with context
5. **Response** → Backend returns AI response
6. **UI Update** → Frontend displays message

## Common Issues & Fixes

### Backend Connection Error
**Error**: "Sorry, I encountered an error. Please make sure the backend is running."

**Solutions**:
1. Ensure backend is running on port 8000
2. Check GROQ_API_KEY is configured
3. Verify CORS settings allow localhost:3000
4. Check firewall/antivirus isn't blocking port 8000

### API Key Issues
**Error**: "API key not configured"

**Solution**: Set GROQ_API_KEY in `.env` file

### Module Not Found
**Error**: Import errors

**Solution**: 
```bash
pip install -r requirements.txt
```

## Development Workflow

1. Start backend: `python main.py` (in finassist-backend/)
2. Start frontend: `npm run dev` (in finassist-frontend/)
3. Access app at `http://localhost:3000`
4. Test API at `http://localhost:8000/docs`

## Future Enhancements
### High Priority
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication system
- [ ] Persistent chat history
- [ ] Bank statement parsing
- [ ] Budget planning tools

### Medium Priority
- [ ] Mobile responsive design improvements
- [ ] Export financial reports (PDF)
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Dark/light theme toggle

### Low Priority
- [ ] Social sharing features
- [ ] Financial goal tracking
- [ ] Investment recommendations
- [ ] Expense categorization
- [ ] Receipt scanning

## Technology Stack

### Backend
- FastAPI 0.115.0
- Google Generative AI 0.8.6
- Python Multipart 0.0.17

### Frontend
- Next.js 14.1.0
- React 18.2.0
- TypeScript 5.3.3
- Recharts 2.12.0




## Contributors
Pragati Tripathi

Sanskriti Soumya

## License

This project is for educational purposes.



## Support

For support, issues or questions, please open an issue on the repository.

