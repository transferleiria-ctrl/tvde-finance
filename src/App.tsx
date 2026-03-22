import React, { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { TripLogger } from './components/TripLogger'
import { ExpenseTracker } from './components/ExpenseTracker'
import { MonthlyReports } from './components/MonthlyReports'
import { useAppData } from './hooks/useAppData'
import { colors } from './styles'

type Page = 'dashboard' | 'trips' | 'expenses' | 'reports'

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; color: #111827; }
  input, select, textarea, button { font-family: inherit; }
  input:focus, select:focus, textarea:focus { outline: 2px solid #1a56db; outline-offset: 1px; }
  button:hover { opacity: 0.88; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #f3f4f6; }
  ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }

  /* Layout */
  .app-layout { display: flex; min-height: 100vh; }
  .sidebar { transform: translateX(0); }
  .main-content { margin-left: 240px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .page-content { flex: 1; padding: 24px; max-width: 1400px; width: 100%; }

  /* Grids */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .stats-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .charts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .chart-wide { grid-column: span 2; }
  .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

  /* Mobile */
  @media (max-width: 1024px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .charts-grid { grid-template-columns: repeat(2, 1fr); }
    .chart-wide { grid-column: span 2; }
    .cat-grid { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); position: fixed !important; }
    .sidebar.sidebar-open { transform: translateX(0); }
    .mobile-overlay { display: block !important; }
    .menu-btn { display: flex !important; }
    .main-content { margin-left: 0; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .stats-grid-3 { grid-template-columns: repeat(2, 1fr); }
    .charts-grid { grid-template-columns: 1fr; }
    .chart-wide { grid-column: span 1; }
    .form-grid { grid-template-columns: 1fr; }
    .cat-grid { grid-template-columns: repeat(2, 1fr); }
    .page-content { padding: 16px; }
  }

  @media (max-width: 480px) {
    .stats-grid { grid-template-columns: 1fr; }
    .stats-grid-3 { grid-template-columns: 1fr; }
    .cat-grid { grid-template-columns: 1fr; }
  }
`

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { trips, expenses, addTrip, deleteTrip, addExpense, deleteExpense } = useAppData()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="app-layout">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="main-content">
          <Header
            currentPage={currentPage}
            onMenuToggle={() => setSidebarOpen(o => !o)}
          />
          <main className="page-content">
            {currentPage === 'dashboard' && (
              <Dashboard trips={trips} expenses={expenses} />
            )}
            {currentPage === 'trips' && (
              <TripLogger trips={trips} onAdd={addTrip} onDelete={deleteTrip} />
            )}
            {currentPage === 'expenses' && (
              <ExpenseTracker expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} />
            )}
            {currentPage === 'reports' && (
              <MonthlyReports trips={trips} expenses={expenses} />
            )}
          </main>
          <footer style={{
            padding: '16px 24px',
            borderTop: `1px solid ${colors.gray200}`,
            background: colors.white,
            fontSize: 12,
            color: colors.gray400,
            textAlign: 'center',
          }}>
            TVDE Finance — Gestão Financeira para Motoristas TVDE em Portugal &nbsp;|&nbsp; Dados guardados localmente no seu browser
          </footer>
        </div>
      </div>
    </>
  )
}
