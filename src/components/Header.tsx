import React from 'react'
import { colors } from '../styles'
import type { Page } from './Sidebar'
import type { UserProfile } from '../types'

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  trips: 'Registo de Turnos',
  expenses: 'Registo de Despesas',
  reports: 'Relatórios Mensais',
  profile: 'O Meu Perfil',
  leaderboard: 'Leaderboard da Comunidade',
  feed: 'Feed da Comunidade',
  stats: 'Estatísticas Globais',
  partnerships: 'Parcerias e Descontos',
}

interface HeaderProps {
  currentPage: Page
  onMenuToggle: () => void
  profile: UserProfile
}

export function Header({ currentPage, onMenuToggle, profile }: HeaderProps) {
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
        <div style={{ textAlign: 'right', display: 'none' }} className="desktop-only">
          <div style={{ fontSize: 14, fontWeight: 600, color: colors.gray900 }}>{profile.displayName}</div>
          <div style={{ fontSize: 11, color: colors.gray500 }}>{profile.carModel}</div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: colors.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: colors.white, fontWeight: 700, fontSize: 14,
          overflow: 'hidden',
          border: `2px solid ${colors.gray100}`
        }}>
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            profile.displayName[0]
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 769px) {
          .desktop-only { display: block !important; }
        }
      `}} />
    </header>
  )
}
