import React from 'react'
import { colors } from '../styles'

type Page = 'dashboard' | 'trips' | 'expenses' | 'reports'

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  trips: 'Registo de Viagens',
  expenses: 'Registo de Despesas',
  reports: 'Relatórios Mensais',
}

interface HeaderProps {
  currentPage: Page
  onMenuToggle: () => void
}

export function Header({ currentPage, onMenuToggle }: HeaderProps) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header style={{
      background: colors.white,
      borderBottom: `1px solid ${colors.gray200}`,
      padding: '0 24px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onMenuToggle}
          className="menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            borderRadius: 8,
            fontSize: 20,
            color: colors.gray700,
          }}
        >
          ☰
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.gray900 }}>
            {pageTitles[currentPage]}
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: colors.gray500, textTransform: 'capitalize' }}>
            {dateStr}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: colors.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: colors.white, fontWeight: 700, fontSize: 14,
        }}>
          M
        </div>
      </div>
    </header>
  )
}
