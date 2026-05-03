'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign,
  PiggyBank,
  TrendingDown,
  AlertTriangle,
  Save
} from 'lucide-react'

export default function Dashboard() {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    savings: '',
    debts: ''
  })

  const [calculated, setCalculated] = useState(false)
  const [results, setResults] = useState({
    monthlySavings: 0,
    savingsRate: 0,
    debtToIncome: 0,
    debtFreedomMonths: 0,
    debtFreedomDate: 'N/A',
    monthlyDebtPayment: 0
  })

  // Load saved dashboard data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('finassist_dashboard_data')
    if (savedData) {
      const data = JSON.parse(savedData)
      setFormData({
        monthlyIncome: data.monthlyIncome?.toString() || '',
        monthlyExpenses: data.monthlyExpenses?.toString() || '',
        savings: data.currentSavings?.toString() || '',
        debts: data.totalDebts?.toString() || ''
      })
      setResults({
        monthlySavings: data.monthlySavings || 0,
        savingsRate: data.savingsRate || 0,
        debtToIncome: data.debtToIncome || 0,
        debtFreedomMonths: data.debtFreedomMonths || 0,
        debtFreedomDate: data.debtFreedomDate || 'N/A',
        monthlyDebtPayment: data.monthlyDebtPayment || 0
      })
      setCalculated(true)
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setCalculated(false)
  }

  const calculateMetrics = () => {
    const income = parseFloat(formData.monthlyIncome) || 0
    const expenses = parseFloat(formData.monthlyExpenses) || 0
    const savings = parseFloat(formData.savings) || 0
    const debts = parseFloat(formData.debts) || 0

    const monthlySavings = income - expenses
    const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0
    const debtToIncome = income > 0 ? (debts / income) * 100 : 0
    
    // Calculate debt freedom timeline
    // Assume 30% of monthly savings goes to debt repayment
    const monthlyDebtPayment = monthlySavings > 0 ? monthlySavings * 0.3 : 0
    const debtFreedomMonths = monthlyDebtPayment > 0 && debts > 0 ? Math.ceil(debts / monthlyDebtPayment) : 0
    const debtFreedomDate = debtFreedomMonths > 0 
      ? new Date(Date.now() + debtFreedomMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      : 'N/A'

    const calculatedResults = {
      monthlySavings,
      savingsRate,
      debtToIncome,
      debtFreedomMonths,
      debtFreedomDate,
      monthlyDebtPayment
    }

    setResults(calculatedResults)
    setCalculated(true)

    // Save dashboard data to localStorage for chat access
    const dashboardData = {
      monthlyIncome: income,
      monthlyExpenses: expenses,
      currentSavings: savings,
      totalDebts: debts,
      ...calculatedResults,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem('finassist_dashboard_data', JSON.stringify(dashboardData))
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
          Savings Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Enter your financial information to calculate your savings
        </p>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
          Your Financial Information
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {/* Monthly Income */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              <DollarSign size={16} color="#10b981" />
              Monthly Income (₹)
            </label>
            <input
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
              placeholder="e.g., 50000"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Monthly Expenses */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              <TrendingDown size={16} color="#f59e0b" />
              Monthly Expenses (₹)
            </label>
            <input
              type="number"
              value={formData.monthlyExpenses}
              onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
              placeholder="e.g., 30000"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Current Savings */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              <PiggyBank size={16} color="#6366f1" />
              Current Savings (₹)
            </label>
            <input
              type="number"
              value={formData.savings}
              onChange={(e) => handleInputChange('savings', e.target.value)}
              placeholder="e.g., 100000"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Total Debts */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              <AlertTriangle size={16} color="#ef4444" />
              Total Debts (₹) - if any
            </label>
            <input
              type="number"
              value={formData.debts}
              onChange={(e) => handleInputChange('debts', e.target.value)}
              placeholder="e.g., 20000"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={calculateMetrics}
          style={{
            marginTop: '24px',
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
          Calculate Savings
        </motion.button>
      </motion.div>

      {/* Results */}
      {calculated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {[
              { label: 'Monthly Savings', value: `₹${results.monthlySavings.toFixed(0)}`, color: '#10b981' },
              { label: 'Savings Rate', value: `${results.savingsRate.toFixed(1)}%`, color: '#f59e0b' },
              { label: 'Debt-to-Income', value: `${results.debtToIncome.toFixed(1)}%`, color: results.debtToIncome > 200 ? '#ef4444' : '#6366f1' },
              { label: 'Debt Freedom', value: results.debtFreedomMonths > 0 ? `${results.debtFreedomMonths} months` : 'No Debt', color: results.debtFreedomMonths > 0 ? '#8b5cf6' : '#10b981' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>{stat.label}</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Debt Freedom Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
              Debt Freedom Timeline
            </h3>

            {parseFloat(formData.debts) > 0 ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Total Debt</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>₹{parseFloat(formData.debts).toFixed(0)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Debt-Free By</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{results.debtFreedomDate}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Payoff Progress</span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>{results.debtFreedomMonths} months remaining</span>
                  </div>
                  <div style={{ 
                    height: '12px', 
                    background: '#334155', 
                    borderRadius: '6px', 
                    overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '10%' }}
                      transition={{ duration: 1 }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%)',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                </div>

                <div style={{ 
                  background: '#0f172a', 
                  borderRadius: '12px', 
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Monthly Payment (30% of savings)</div>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#f59e0b' }}>₹{results.monthlyDebtPayment.toFixed(0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Time to Freedom</div>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#8b5cf6' }}>
                      {results.debtFreedomMonths < 12 
                        ? `${results.debtFreedomMonths} months` 
                        : `${Math.floor(results.debtFreedomMonths / 12)}y ${results.debtFreedomMonths % 12}m`}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}>
                  <div style={{ fontSize: '13px', color: '#818cf8' }}>
                    💡 <strong>Tip:</strong> Allocating 30% of your monthly savings (₹{results.monthlyDebtPayment.toFixed(0)}) to debt repayment. 
                    Increase this percentage to become debt-free faster!
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>
                  Debt-Free!
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  You have no debts. Keep up the great financial management!
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
