import React, { useState } from 'react'
import { Sidebar, type Page } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { TripLogger } from './components/TripLogger'
import { ExpenseTracker } from './components/ExpenseTracker'
import { MonthlyReports } from './components/MonthlyReports'
import { Profile } from './components/Profile'
import { Leaderboard } from './components/Leaderboard'
import { CommunityFeed } from './components/CommunityFeed'
import { AggregatedStats } from './components/AggregatedStats'
import { Partnerships } from './components/Partnerships'
import { useAppData } from './hooks/useAppData'
import { colors } from './styles'

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
  .page-content { flex: 1; padding: 24px; max-width: 1400px; width: 100%; margin: 0 auto; }

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
  const { 
    profile, trips, expenses, posts, partnerships,
    updateProfile, addTrip, deleteTrip, addExpense, deleteExpense,
    addPost, toggleLike, addComment,
    user, loading, loginWithGoogle, logout
  } = useAppData()

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <div style={{ fontSize: 18, color: '#4b5563' }}>A carregar...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', padding: 20 }}>
        <div style={{ background: 'white', padding: 40, borderRadius: 12, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 20 }}>🚗</div>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#111827' }}>TVDE Finance</h1>
          <p style={{ color: '#6b7280', marginBottom: 32 }}>Gestão financeira profissional para motoristas TVDE em Portugal.</p>
          
          <button 
            onClick={loginWithGoogle}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 12, 
              width: '100%', 
              padding: '12px 24px', 
              background: 'white', 
              border: '1px solid #d1d5db', 
              borderRadius: 8, 
              fontSize: 16, 
              fontWeight: 500, 
              color: '#374151', 
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>
          
          <div style={{ marginTop: 32, fontSize: 12, color: '#9ca3af' }}>
            Ao entrar, você concorda em guardar os seus dados localmente no browser.
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="app-layout">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={logout}
        />
        <div className="main-content">
          <Header
            currentPage={currentPage}
            onMenuToggle={() => setSidebarOpen(o => !o)}
            profile={profile}
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
            {currentPage === 'profile' && (
              <Profile profile={profile} onUpdate={updateProfile} />
            )}
            {currentPage === 'leaderboard' && (
              <Leaderboard trips={trips} profile={profile} />
            )}
            {currentPage === 'feed' && (
              <CommunityFeed 
                posts={posts} 
                profile={profile} 
                onAddPost={addPost} 
                onToggleLike={toggleLike} 
                onAddComment={addComment} 
              />
            )}
            {currentPage === 'stats' && (
              <AggregatedStats trips={trips} />
            )}
            {currentPage === 'partnerships' && (
              <Partnerships partnerships={partnerships} />
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
