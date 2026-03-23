import React from 'react'
import { colors } from '../styles'
import type { UserProfile, Trip, Expense, Post } from '../types'

interface AdminPanelProps {
  profile: UserProfile
  trips: Trip[]
  expenses: Expense[]
  posts: Post[]
  onClearAll: () => void
}

export function AdminPanel({ profile, trips, expenses, posts, onClearAll }: AdminPanelProps) {
  return (
    <div style={{
      background: colors.white,
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.gray900, marginBottom: 8 }}>
          Painel de Administrador
        </h1>
        <p style={{ color: colors.gray500 }}>
          Gerir dados do utilizador: {profile.email}
        </p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.gray700, marginBottom: 16 }}>
          Resumo de Dados
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          <div style={{
            background: colors.blue50,
            border: `1px solid ${colors.blue200}`,
            borderRadius: 8,
            padding: 16,
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.blue600 }}>
              {trips.length}
            </div>
            <div style={{ fontSize: 14, color: colors.blue800 }}>Turnos</div>
          </div>
          <div style={{
            background: colors.orange50,
            border: `1px solid ${colors.orange200}`,
            borderRadius: 8,
            padding: 16,
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.orange600 }}>
              {expenses.length}
            </div>
            <div style={{ fontSize: 14, color: colors.orange800 }}>Despesas</div>
          </div>
          <div style={{
            background: colors.purple50,
            border: `1px solid ${colors.purple200}`,
            borderRadius: 8,
            padding: 16,
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.purple600 }}>
              {posts.length}
            </div>
            <div style={{ fontSize: 14, color: colors.purple800 }}>Posts na Comunidade</div>
          </div>
        </div>
      </div>

      <div style={{
        background: colors.red50,
        border: `1px solid ${colors.red200}`,
        borderRadius: 8,
        padding: 24,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.red700, marginBottom: 8 }}>
          Zona de Perigo
        </h2>
        <p style={{ color: colors.red600, fontSize: 14, marginBottom: 16 }}>
          Ao clicar no botão abaixo, todos os dados locais serao apagados (turnos, despesas e posts). Esta ação não pode ser desfeita.
        </p>
        <button
          onClick={onClearAll}
          style={{
            background: colors.red600,
            color: colors.white,
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = colors.red700}
          onMouseOut={(e) => e.currentTarget.style.background = colors.red600}
        >
          Apagar Todos os Dados Locais
        </button>
      </div>
    </div>
  )
}
