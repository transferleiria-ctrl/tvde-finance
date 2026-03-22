import React, { useState, useMemo } from 'react'
import { colors, card, btn } from '../styles'
import type { Trip, UserProfile } from '../types'

interface LeaderboardProps {
  trips: Trip[]
  profile: UserProfile
}

type Filter = 'weekly' | 'monthly' | 'yearly'

export function Leaderboard({ trips, profile }: LeaderboardProps) {
  const [filter, setFilter] = useState<Filter>('monthly')

  const rankings = useMemo(() => {
    const now = new Date()
    const filterTrips = (t: Trip) => {
      const date = new Date(t.date)
      if (filter === 'weekly') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return date >= weekAgo
      }
      if (filter === 'monthly') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }
      return date.getFullYear() === now.getFullYear()
    }

    const userEarnings = trips.filter(filterTrips).reduce((sum, t) => sum + t.earnings, 0)

    // Dados simulados para outros usuários
    const baseMocks = [
      { name: 'Ricardo P.', car: 'Mercedes EQE', earnings: 1250, photo: '' },
      { name: 'Ana M.', car: 'Dacia Jogger', earnings: 980, photo: '' },
      { name: 'Carlos T.', car: 'Tesla Model Y', earnings: 1100, photo: '' },
      { name: 'Sofia L.', car: 'Toyota Corolla', earnings: 850, photo: '' },
    ]

    const multiplier = filter === 'weekly' ? 0.25 : filter === 'yearly' ? 12 : 1
    const mocks = baseMocks.map(m => ({
      ...m,
      earnings: m.earnings * multiplier * (0.9 + Math.random() * 0.2)
    }))

    const all = [
      ...mocks,
      { name: `${profile.displayName} (Tu)`, car: profile.carModel, earnings: userEarnings, photo: profile.photoUrl, isUser: true }
    ].sort((a, b) => b.earnings - a.earnings)

    return all
  }, [trips, profile, filter])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
        {(['weekly', 'monthly', 'yearly'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...btn(filter === f ? 'primary' : 'ghost'),
              padding: '8px 16px',
              fontSize: 14,
              textTransform: 'capitalize'
            }}
          >
            {f === 'weekly' ? 'Semanal' : f === 'monthly' ? 'Mensal' : 'Anual'}
          </button>
        ))}
      </div>

      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: colors.gray50, borderBottom: `1px solid ${colors.gray200}` }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', color: colors.gray500, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Posição</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', color: colors.gray500, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Motorista</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', color: colors.gray500, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Ganhos</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((entry, i) => (
              <tr key={i} style={{ 
                borderBottom: i === rankings.length - 1 ? 'none' : `1px solid ${colors.gray100}`,
                backgroundColor: entry.isUser ? `${colors.primary}08` : 'transparent'
              }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ 
                    width: 28, 
                    height: 28, 
                    borderRadius: '50%', 
                    backgroundColor: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#92400e' : colors.gray100,
                    color: i < 3 ? colors.white : colors.gray600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 600
                  }}>
                    {i + 1}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: colors.gray200,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {entry.photo ? (
                        <img src={entry.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ color: colors.gray500, fontWeight: 600 }}>{entry.name[0]}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: colors.gray900 }}>{entry.name}</div>
                      <div style={{ fontSize: 12, color: colors.gray500 }}>{entry.car}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, color: colors.primary }}>
                  {entry.earnings.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
