import React from 'react'
import { colors } from '../styles'

export type Page = 'dashboard' | 'trips' | 'expenses' | 'reports' | 'profile' | 'leaderboard' | 'feed' | 'stats' | 'partnerships' | 'admin'

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  mobileOpen: boolean
  onClose: () => void
  onLogout: () => void
}

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'trips', label: 'Turnos', icon: '🚗' },
  { id: 'expenses', label: 'Despesas', icon: '💸' },
  { id: 'reports', label: 'Relatórios', icon: '📅' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
  { id: 'feed', label: 'Comunidade', icon: '💬' },
  { id: 'stats', label: 'Estatísticas', icon: '📈' },
  { id: 'partnerships', label: 'Parcerias', icon: '🤝' },
        { id: 'admin', label: 'Admin', icon: '🛠️' },
  { id: 'profile', label: 'O Meu Perfil', icon: '👤' },
]

export function Sidebar({ currentPage, onNavigate, mobileOpen, onClose, onLogout }: SidebarProps) {
  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 40, display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      <aside
        style={{
          width: 240,
          minHeight: '100vh',
          background: colors.gray900,
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          transition: 'transform 0.3s ease',
        }}
        className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}
      >
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: `1px solid ${colors.gray700}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: colors.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 800, color: colors.white,
            }}>T</div>
            <div>
              <div style={{ color: colors.white, fontWeight: 700, fontSize: 16 }}>TVDE Finance</div>
              <div style={{ color: colors.gray400, fontSize: 12 }}>Portugal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: colors.gray500, padding: '0 8px', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Menu
          </div>
          {navItems.map(item => {
            const active = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '11px 12px',
                  borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  fontFamily: 'inherit',
                  background: active ? colors.primary : 'transparent',
                  color: active ? colors.white : colors.gray400,
                  marginBottom: 2,
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: `1px solid ${colors.gray700}`,
        }}>
          <button
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              width: '100%', padding: '11px 12px',
              borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 400,
              fontFamily: 'inherit',
              background: 'transparent',
              color: colors.gray400,
              marginBottom: 12,
              transition: 'all 0.15s ease',
              textAlign: 'left',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = colors.white}
            onMouseOut={(e) => e.currentTarget.style.color = colors.gray400}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            Sair da Conta
          </button>
          <div style={{ fontSize: 12, color: colors.gray500 }}>
            <div>v1.1.0 — Dados locais</div>
            <div style={{ marginTop: 4 }}>© 2026 TVDE Finance</div>
          </div>
        </div>
      </aside>
    </>
  )
}
