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
import { AdminPanel } from './components/AdminPanel'
import { useAppData } from './hooks/useAppData'
import { colors } from './styles'

const GLOBAL_CSS = `*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; color: #111827; }
input, select, textarea, button { font-family: inherit; }
input:focus, select:focus, textarea:focus { outline: 2px solid #1a56db; outline-offset: 1px; }
button:hover { opacity: 0.88; }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #f3f4f6; }
::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
.app-layout { display: flex; min-height: 100vh; }
.sidebar { transform: translateX(0); }
.main-content { margin-left: 240px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
.page-content { flex: 1; padding: 24px; max-width: 1400px; width: 100%; margin: 0 auto; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stats-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.charts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.chart-wide { grid-column: span 2; }
.form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
@media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .charts-grid { grid-template-columns: repeat(2, 1fr); } .chart-wide { grid-column: span 2; } .cat-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .sidebar { transform: translateX(-100%); position: fixed !important; } .sidebar.sidebar-open { transform: translateX(0); } .mobile-overlay { display: block !important; } .menu-btn { display: flex !important; } .main-content { margin-left: 0; } .stats-grid { grid-template-columns: repeat(2, 1fr); } .stats-grid-3 { grid-template-columns: repeat(2, 1fr); } .charts-grid { grid-template-columns: 1fr; } .chart-wide { grid-column: span 1; } .form-grid { grid-template-columns: 1fr; } .cat-grid { grid-template-columns: repeat(2, 1fr); } .page-content { padding: 16px; } }
@media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } .stats-grid-3 { grid-template-columns: 1fr; } .cat-grid { grid-template-columns: 1fr; } }`

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    profile,
    trips,
    expenses,
    posts,
    partnerships,
    updateProfile,
    addTrip,
    deleteTrip,
    addExpense,
    deleteExpense,
    addPost,
    toggleLike,
    addComment,
    user,
    loading,
    loginWithGoogle,
    logout,
    isAdmin,
    clearAll,
  } = useAppData()

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f3f4f6', color: '#111827' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>A carregar...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f3f4f6', color: '#111827' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
        <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>TVDE Finance</div>
        <div style={{ color: '#6b7280', marginBottom: '32px', textAlign: 'center' }}>
          Gestão financeira profissional para motoristas TVDE em Portugal.
        </div>
        <button
          onClick={loginWithGoogle}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', border: 'none', borderRadius: '8px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', cursor: 'pointer', fontSize: '16px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#f9fafb')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'white')}
        >
          🔵 Entrar com Google
        </button>
        <div style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>
          Ao entrar, você concorda em guardar os seus dados localmente no browser.
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="app-layout">
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={logout}
          isAdmin={isAdmin}
        />
        <div className="main-content">
          <Header onMenuClick={() => setSidebarOpen(o => !o)} profile={profile} />
          <div className="page-content">
            {currentPage === 'dashboard' && <Dashboard user={user} profile={profile} trips={trips} expenses={expenses} />}
            {currentPage === 'trips' && <TripLogger trips={trips} onAdd={addTrip} onDelete={deleteTrip} />}
            {currentPage === 'expenses' && <ExpenseTracker expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} />}
            {currentPage === 'reports' && <MonthlyReports trips={trips} expenses={expenses} />}
            {currentPage === 'profile' && <Profile user={user} profile={profile} onUpdate={updateProfile} />}
            {currentPage === 'leaderboard' && <Leaderboard />}
            {currentPage === 'feed' && <CommunityFeed posts={posts} onAdd={addPost} onLike={toggleLike} onComment={addComment} />}
            {currentPage === 'stats' && <AggregatedStats />}
            {currentPage === 'partnerships' && <Partnerships partnerships={partnerships} />}
            {currentPage === 'admin' && isAdmin && <AdminPanel clearAll={clearAll} />}
          </div>
          <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '14px', borderTop: '1px solid #e5e7eb' }}>
            TVDE Finance — Gestão Financeira para Motoristas TVDE em Portugal  |  Dados guardados localmente no seu browser
          </div>
        </div>
      </div>
    </>
  )
}
