'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  LayoutDashboard, 
  History, 
  Settings, 
  Wallet,
  Sparkles
} from 'lucide-react'

const navItems = [
  { href: '/', icon: MessageSquare, label: 'Chat' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        width: '280px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        borderRight: '1px solid #334155',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 12px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
        }}>
          <Wallet size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc' }}>FinAssist</h1>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Savings AI</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1 }}>
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  marginBottom: '8px',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isActive ? '#818cf8' : '#94a3b8',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: '15px', fontWeight: isActive ? '600' : '500' }}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      marginLeft: 'auto',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#6366f1',
                    }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ 
        padding: '16px', 
        background: 'rgba(99, 102, 241, 0.1)', 
        borderRadius: '12px',
        border: '1px solid rgba(99, 102, 241, 0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Sparkles size={18} color="#818cf8" />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#818cf8' }}>Pro Tip</span>
        </div>
        <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
          Build 3-6 months of savings for financial security.
        </p>
      </div>

      {/* Model indicator */}
      <div style={{ 
        marginTop: '16px', 
        padding: '12px 16px',
        background: '#1e293b',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>Active Model</span>
        <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: '500' }}>Llama 3.3 70B</span>
      </div>
    </motion.aside>
  )
}