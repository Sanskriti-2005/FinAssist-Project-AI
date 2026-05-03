'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Brain,
  Thermometer,
  Hash,
  Save
} from 'lucide-react'

interface SettingsState {
  temperature: number
  topP: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    temperature: 0.7,
    topP: 0.9,
  })

  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    localStorage.setItem('finassist_settings', JSON.stringify(settings))
    alert('Settings saved successfully!')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          AI Model Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Customize the AI behavior and response style
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#1e293b',
          borderRadius: '16px',
          border: '1px solid #334155',
          padding: '32px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Brain size={22} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>AI Model Configuration</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Fine-tune the AI behavior</p>
          </div>
        </div>

        {/* Temperature */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Thermometer size={16} color="#818cf8" />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Temperature</span>
            </div>
            <span style={{ fontSize: '14px', color: '#818cf8', fontWeight: '600' }}>{settings.temperature}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(settings.temperature / 2) * 100}%, #334155 ${(settings.temperature / 2) * 100}%, #334155 100%)`,
              appearance: 'none',
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
            <span>Precise (0)</span>
            <span>Balanced (1)</span>
            <span>Creative (2)</span>
          </div>
        </div>

        {/* Top P */}
        <div style={{ marginBottom: '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Hash size={16} color="#818cf8" />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Top P</span>
            </div>
            <span style={{ fontSize: '14px', color: '#818cf8', fontWeight: '600' }}>{settings.topP}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.topP}
            onChange={(e) => updateSetting('topP', parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${settings.topP * 100}%, #334155 ${settings.topP * 100}%, #334155 100%)`,
              appearance: 'none',
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
            <span>Focused (0)</span>
            <span>Diverse (1)</span>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={saveSettings}
        style={{
          width: '100%',
          padding: '14px 24px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <Save size={18} />
        Save Settings
      </motion.button>
    </div>
  )
}
