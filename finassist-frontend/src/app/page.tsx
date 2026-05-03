'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Paperclip, 
  ChevronDown, 
  Sparkles, 
  TrendingUp,
  Calculator,
  Lightbulb,
  Bot,
  User,
  FileText,
  X,
  Check,
  Code,
  Plus
} from 'lucide-react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  image?: string
}

interface Suggestion {
  id: string
  text: string
  icon: any
}

const models = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', description: 'Fast and capable' },
]

const suggestions: Suggestion[] = [
  { id: '1', text: 'Calculate my savings', icon: Calculator },
  { id: '2', text: 'Tips for saving money', icon: Lightbulb },
  { id: '3', text: 'My financial health report', icon: TrendingUp },
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get or create session ID from localStorage
    let storedSessionId = localStorage.getItem('finassist_session_id')
    let storedUserId = localStorage.getItem('finassist_user_id')
    
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('finassist_session_id', storedSessionId)
    }
    
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('finassist_user_id', storedUserId)
    }
    
    setSessionId(storedSessionId)
    
    // Load existing messages from localStorage
    const storedMessages = localStorage.getItem(`finassist_messages_${storedSessionId}`)
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    } else {
      // Welcome message
      const welcomeMessage = {
        id: 'welcome',
        role: 'assistant' as const,
        content: `Hello! I'm FinAssist, your AI financial assistant. I can help you:

• Calculate your savings needs
• Analyze your financial health
• Provide saving tips and strategies
• Create data visualizations
• Answer your financial questions

To get the best results, I may ask about your income, expenses, and savings. Would you like to start by sharing some basic financial information?`,
        timestamp: new Date().toISOString()
      }
      setMessages([welcomeMessage])
      localStorage.setItem(`finassist_messages_${storedSessionId}`, JSON.stringify([welcomeMessage]))
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    
    // Save to localStorage
    localStorage.setItem(`finassist_messages_${sessionId}`, JSON.stringify(updatedMessages))
    
    setInput('')
    setIsLoading(true)

    try {
      const userId = localStorage.getItem('finassist_user_id') || 'default_user'
      
      // Get dashboard data if available
      const dashboardData = localStorage.getItem('finassist_dashboard_data')
      let financialContext = ''
      
      if (dashboardData) {
        const data = JSON.parse(dashboardData)
        financialContext = `\n\nUser's Financial Information (from Dashboard):
- Monthly Income: ₹${data.monthlyIncome?.toFixed(0) || 'Not provided'}
- Monthly Expenses: ₹${data.monthlyExpenses?.toFixed(0) || 'Not provided'}
- Current Savings: ₹${data.currentSavings?.toFixed(0) || 'Not provided'}
- Total Debts: ₹${data.totalDebts?.toFixed(0) || 'Not provided'}
- Monthly Savings: ₹${data.monthlySavings?.toFixed(0) || 'Not calculated'}
- Savings Rate: ${data.savingsRate?.toFixed(1) || 'Not calculated'}%
- Debt-to-Income Ratio: ${data.debtToIncome?.toFixed(1) || 'Not calculated'}%
- Debt Freedom Timeline: ${data.debtFreedomMonths > 0 ? `${data.debtFreedomMonths} months (by ${data.debtFreedomDate})` : 'No debt'}
- Monthly Debt Payment: ₹${data.monthlyDebtPayment?.toFixed(0) || '0'}

Use this information to provide personalized financial advice and calculations.`
      }
      
      const response = await axios.post('http://localhost:8000/api/chat', {
        message: content + financialContext,
        session_id: sessionId,
        user_id: userId,
        model_name: selectedModel.id
      })

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
        image: response.data.image || undefined
      }

      const finalMessages = [...updatedMessages, assistantMessage]
      setMessages(finalMessages)
      
      // Save to localStorage
      localStorage.setItem(`finassist_messages_${sessionId}`, JSON.stringify(finalMessages))
      
      // Save to history
      const history = JSON.parse(localStorage.getItem('finassist_history') || '[]')
      const sessionIndex = history.findIndex((s: any) => s.session_id === sessionId)
      
      if (sessionIndex >= 0) {
        history[sessionIndex].messages = finalMessages
        history[sessionIndex].lastMessage = assistantMessage.content.substring(0, 100)
        history[sessionIndex].timestamp = new Date().toISOString()
      } else {
        history.push({
          session_id: sessionId,
          title: content.substring(0, 50),
          lastMessage: assistantMessage.content.substring(0, 100),
          timestamp: new Date().toISOString(),
          messages: finalMessages,
          messageCount: finalMessages.length
        })
      }
      
      localStorage.setItem('finassist_history', JSON.stringify(history))
      
    } catch (error) {
      console.error('Chat error:', error)
      const backendDetail = axios.isAxiosError(error) ? error.response?.data?.detail : null
      const errorMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant' as const,
        content: backendDetail || 'Sorry, I encountered an error. Please make sure the backend is running.',
        timestamp: new Date().toISOString()
      }
      const finalMessages = [...updatedMessages, errorMessage]
      setMessages(finalMessages)
      localStorage.setItem(`finassist_messages_${sessionId}`, JSON.stringify(finalMessages))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestionClick = (text: string) => {
    sendMessage(text)
  }

  const startNewChat = () => {
    // Generate new session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('finassist_session_id', newSessionId)
    setSessionId(newSessionId)
    
    // Clear messages and show welcome
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm FinAssist, your AI financial assistant. I can help you:

• Calculate your savings needs
• Analyze your financial health
• Provide saving tips and strategies
• Create data visualizations
• Answer your financial questions

To get the best results, I may ask about your income, expenses, and savings. Would you like to start by sharing some basic financial information?`,
      timestamp: new Date().toISOString()
    }
    
    setMessages([welcomeMessage])
    localStorage.setItem(`finassist_messages_${newSessionId}`, JSON.stringify([welcomeMessage]))
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', height: 'calc(100vh - 48px)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
            Financial Assistant
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Ask me anything about your finances
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* New Chat Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startNewChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f8fafc',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            <Plus size={16} />
            New Chat
          </motion.button>

          {/* Model Selector */}
          <div style={{ position: 'relative' }}>
            <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f8fafc',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            <Sparkles size={16} color="#818cf8" />
            {selectedModel.name}
            <ChevronDown size={14} />
          </motion.button>

          <AnimatePresence>
            {showModelDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '8px',
                  minWidth: '220px',
                  zIndex: 1000,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model)
                      setShowModelDropdown(false)
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: selectedModel.id === model.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{model.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{model.description}</div>
                    </div>
                    {selectedModel.id === model.id && (
                      <Check size={16} color="#818cf8" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div style={{
        background: '#1e293b',
        borderRadius: '16px',
        border: '1px solid #334155',
        height: 'calc(100vh - 180px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {message.role === 'assistant' && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Bot size={18} color="white" />
                </div>
              )}
              
              <div style={{
                maxWidth: '70%',
                padding: '16px 20px',
                borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: message.role === 'user' ? '#6366f1' : '#334155',
                lineHeight: '1.6',
                fontSize: '14px',
              }}>
                {message.role === 'assistant' ? (
                  <>
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          // Hide all code blocks - they're already executed on backend
                          if (!inline) {
                            return null
                          }
                          // Keep inline code
                          return (
                            <code 
                              style={{ 
                                background: '#1e293b', 
                                padding: '2px 6px', 
                                borderRadius: '4px',
                                fontSize: '13px',
                                color: '#818cf8'
                              }} 
                              {...props}
                            >
                              {children}
                            </code>
                          )
                        },
                        p: ({ children }: any) => <p style={{ marginBottom: '12px', marginTop: '0' }}>{children}</p>,
                        ul: ({ children }: any) => <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>{children}</ul>,
                        ol: ({ children }: any) => <ol style={{ marginLeft: '20px', marginBottom: '12px' }}>{children}</ol>,
                        li: ({ children }: any) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                        strong: ({ children }: any) => <strong style={{ color: '#818cf8', fontWeight: '600' }}>{children}</strong>,
                        h1: ({ children }: any) => <h1 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#f8fafc' }}>{children}</h1>,
                        h2: ({ children }: any) => <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#f8fafc' }}>{children}</h2>,
                        h3: ({ children }: any) => <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#f8fafc' }}>{children}</h3>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                    {message.image && (
                      <div style={{ marginTop: '16px' }}>
                        <img 
                          src={message.image} 
                          alt="Visualization" 
                          style={{ 
                            width: '100%', 
                            maxWidth: '600px',
                            borderRadius: '8px',
                            border: '1px solid #475569'
                          }} 
                        />
                      </div>
                    )}
                  </>
                ) : (
                  message.content
                )}
              </div>

              {message.role === 'user' && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <User size={18} color="#94a3b8" />
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Bot size={18} color="white" />
              </div>
              <div style={{
                padding: '16px 20px',
                borderRadius: '16px 16px 16px 4px',
                background: '#334155',
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#818cf8',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {messages.length <= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                padding: '0 24px 16px',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon
                return (
                  <motion.button
                    key={suggestion.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '10px',
                      color: '#818cf8',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    <Icon size={16} />
                    {suggestion.text}
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #334155',
          background: '#0f172a',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            {/* File Upload Button */}
            <div style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setShowFileUpload(!showFileUpload)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
              >
                <Paperclip size={20} />
              </motion.button>

              <AnimatePresence>
                {showFileUpload && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: 0,
                      marginBottom: '8px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      padding: '12px',
                      minWidth: '200px',
                      zIndex: 1000,
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                      Upload Bank Statement
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.csv,.xlsx"
                      style={{ display: 'none' }}
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#818cf8',
                        fontSize: '13px',
                      }}
                    >
                      <FileText size={16} />
                      Choose File
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Text Input */}
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#334155'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!input.trim() || isLoading}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: input.trim() ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#334155',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                color: 'white',
                boxShadow: input.trim() ? '0 4px 16px rgba(99, 102, 241, 0.4)' : 'none',
              }}
            >
              <Send size={20} />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  )
}