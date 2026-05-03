'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Clock, 
  Trash2, 
  Search,
  Calendar,
  ChevronRight,
  Bot,
  User,
  MoreVertical,
  Download,
  Share2
} from 'lucide-react'
import axios from 'axios'

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: string
  messageCount: number
}

export default function History() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      // Load from localStorage
      const storedHistory = localStorage.getItem('finassist_history')
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory)
        const formattedSessions: ChatSession[] = parsedHistory.map((item: any) => ({
          id: item.session_id,
          title: item.title || 'Untitled Conversation',
          lastMessage: item.lastMessage || '',
          timestamp: item.timestamp,
          messageCount: item.messageCount || 0
        }))
        setSessions(formattedSessions)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const deleteSession = (id: string) => {
    // Remove from state
    setSessions(sessions.filter(s => s.id !== id))
    
    // Remove from localStorage
    const storedHistory = localStorage.getItem('finassist_history')
    if (storedHistory) {
      const history = JSON.parse(storedHistory)
      const updatedHistory = history.filter((s: any) => s.session_id !== id)
      localStorage.setItem('finassist_history', JSON.stringify(updatedHistory))
    }
    
    // Remove session messages
    localStorage.removeItem(`finassist_messages_${id}`)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          Chat History
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          View and manage your past conversations
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div style={{
          flex: 1,
          position: 'relative',
        }}>
          <Search 
            size={18} 
            color="#64748b"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 14px 14px 48px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
      </motion.div>

      {/* Sessions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #334155',
                  borderTopColor: '#6366f1',
                  borderRadius: '50%',
                }}
              />
            </div>
          ) : filteredSessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '64px',
                background: '#1e293b',
                borderRadius: '16px',
                border: '1px solid #334155',
              }}
            >
              <MessageSquare size={48} color="#64748b" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                No conversations yet
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Start a new chat to see your history here
              </p>
            </motion.div>
          ) : (
            filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedSession(session.id)}
                style={{
                  background: selectedSession === session.id ? 'rgba(99, 102, 241, 0.15)' : '#1e293b',
                  border: selectedSession === session.id ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid #334155',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <MessageSquare size={22} color="white" />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#f8fafc' }}>
                        {session.title}
                      </h3>
                      <span style={{ fontSize: '12px', color: '#64748b', flexShrink: 0 }}>
                        {formatDate(session.timestamp)}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session.lastMessage}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageSquare size={12} />
                        {session.messageCount} messages
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {new Date(session.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(session.id)
                      }}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748b',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronRight size={18} color="#64748b" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          marginTop: '32px',
          padding: '20px 24px',
          background: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        {[
          { label: 'Total Conversations', value: sessions.length },
          { label: 'Messages This Week', value: sessions.reduce((acc, s) => acc + s.messageCount, 0) },
          { label: 'Active Sessions', value: sessions.filter(s => Date.now() - new Date(s.timestamp).getTime() < 86400000).length },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#818cf8' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}