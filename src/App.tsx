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
user, loading, loginWithGoogle, logout, isAdmin, clearAll
} = useAppData()if (loading) {
return (
<div style={{
display: 'flex',
minHeight: '100vh',
alignItems: 'center',
justifyContent: 'center',
background: '#f3f4f6',
padding: 40,
borderRadius: 12,
boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
maxWidth: 280,
margin: '0 auto',
background: 'white',
padding: 40,
borderRadius: 12,
boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
maxWidth: 280,
marginBottom: 20
}}>
<div style={{ width: 40, height: 40, borderRadius: 8, background: '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
<span style={{ fontSize: 24 }}>🚗</span>
</div>
<div>
<div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>A carregar...</div>
</div>
</div>
)
}
if (!user) {
return (
<div style={{
display: 'flex',
minHeight: '100vh',
alignItems: 'center',
justifyContent: 'center',
background: '#f3f4f6',
padding: 40,
borderRadius: 12,
boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
maxWidth: 440,
margin: '0 auto',
flexDirection: 'column',
gap: 24,
textAlign: 'center'
}}>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
<div style={{ width: 48, height: 48, borderRadius: 12, background: '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
<span style={{ fontSize: 28 }}>🚗</span>
</div>
<h1 style={{ fontSize: 28, fontWeight: 'bold', margin: 0, color: '#111827' }}>TVDE Finance</h1>
</div>
<p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 24px 0' }}>Gestão financeira profissional para motoristas TVDE em Portugal.</p>
<button onClick={loginWithGoogle} style={{
background: 'white',
border: '1px solid #d1d5db',
borderRadius: 8,
padding: '12px 24px',
fontSize: 14,
fontWeight: 500,
color: '#1f2937',
display: 'flex',
alignItems: 'center',
gap: 12,
cursor: 'pointer',
transition: 'all 0.2s'
}} onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
<span style={{ fontSize: 20 }}>🔵</span>
Entrar com Google
</button>
<p style={{ fontSize: 13, color: '#9ca3af', margin: '16px 0 0 0' }}>Ao entrar, você concorda em guardar os seus dados localmente no browser.</p>
</div>
)
}return (
<>
<div className="app-layout">
<Sidebar currentPage={currentPage} onNavigate={setCurrentPage} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={logout} />
<div className="main-content">
<Header currentPage={currentPage} onMenuToggle={() => setSidebarOpen(o => !o)} profile={profile} />
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
<CommunityFeed posts={posts} profile={profile} onAddPost={addPost} onToggleLike={toggleLike} onAddComment={addComment} />
)}
{currentPage === 'stats' && (
<AggregatedStats trips={trips} />
)}
{currentPage === 'partnerships' && (
<Partnerships partnerships={partnerships} />
)}
{currentPage === 'admin' && isAdmin && (
<AdminPanel
profile={profile}
trips={trips}
expenses={expenses}
posts={posts}
onClearAll={clearAll}
/>
)}
</main><footer style={{ padding: '16px 24px', borderTop: `1px solid ${colors.gray200}`, background: colors.white, fontSize: 12, color: colors.gray400, textAlign: 'center', }}>TVDE Finance — Gestão Financeira para Motoristas TVDE em Portugal &nbsp;|&nbsp; Dados guardados localmente no seu browser</footer>
</div>
</div>
</>
)
}
