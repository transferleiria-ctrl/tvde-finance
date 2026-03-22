import React, { useMemo } from 'react'
import { colors, card, shadows } from '../styles'
import type { Trip } from '../types'

interface AggregatedStatsProps {
  trips: Trip[]
}

export function AggregatedStats({ trips }: AggregatedStatsProps) {
  const stats = useMemo(() => {
    const userTotalEarnings = trips.reduce((sum, t) => sum + t.earnings, 0)
    const userTotalHours = trips.reduce((sum, t) => sum + t.hours, 0)
    const userTotalKm = trips.reduce((sum, t) => sum + t.km, 0)
    const userCount = trips.length

    const userAvgEarnings = userCount > 0 ? userTotalEarnings / userCount : 0
    const userAvgHourlyRate = userTotalHours > 0 ? userTotalEarnings / userTotalHours : 0
    const userAvgKm = userCount > 0 ? userTotalKm / userCount : 0

    // Dados simulados da comunidade (médias de todos os usuários)
    const communityAvgEarnings = 115.40
    const communityAvgHourlyRate = 14.20
    const communityAvgKm = 185.60

    return {
      user: {
        avgEarnings: userAvgEarnings,
        avgHourlyRate: userAvgHourlyRate,
        avgKm: userAvgKm
      },
      community: {
        avgEarnings: communityAvgEarnings,
        avgHourlyRate: communityAvgHourlyRate,
        avgKm: communityAvgKm
      }
    }
  }, [trips])

  const MetricCard = ({ title, userValue, communityValue, unit, format = 'currency' }: any) => {
    const diff = communityValue > 0 ? ((userValue - communityValue) / communityValue) * 100 : 0
    const isPositive = diff >= 0

    const formatValue = (val: number) => {
      if (format === 'currency') return val.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
      return `${val.toFixed(1)}${unit}`
    }

    return (
      <div style={{ ...card, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.gray500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: colors.gray400, marginBottom: 4 }}>A sua média</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.gray900 }}>{formatValue(userValue)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: colors.gray400, marginBottom: 4 }}>Média Global</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.primary }}>{formatValue(communityValue)}</div>
          </div>
        </div>

        <div style={{ 
          marginTop: 8, 
          padding: '8px 12px', 
          borderRadius: 6, 
          backgroundColor: isPositive ? '#ecfdf5' : '#fef2f2',
          color: isPositive ? '#059669' : '#dc2626',
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <span>{isPositive ? '▲' : '▼'}</span>
          <span>{Math.abs(diff).toFixed(1)}% em relação à comunidade</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: colors.gray900, marginBottom: 12 }}>Estatísticas da Comunidade</h2>
        <p style={{ fontSize: 16, color: colors.gray500, lineHeight: 1.6 }}>
          Compare o seu desempenho com a média de todos os motoristas na plataforma para identificar áreas de melhoria.
        </p>
      </div>

      <div className="stats-grid-3">
        <MetricCard 
          title="Ganhos por Turno" 
          userValue={stats.user.avgEarnings} 
          communityValue={stats.community.avgEarnings} 
        />
        <MetricCard 
          title="Ganho por Hora" 
          userValue={stats.user.avgHourlyRate} 
          communityValue={stats.community.avgHourlyRate} 
        />
        <MetricCard 
          title="Km por Turno" 
          userValue={stats.user.avgKm} 
          communityValue={stats.community.avgKm} 
          unit=" km"
          format="number"
        />
      </div>

      <div style={{ ...card, padding: 32, backgroundColor: colors.primary, color: colors.white, textAlign: 'center' }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Dica de Performance</h3>
        <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 800, margin: '0 auto' }}>
          Motoristas com ganhos 15% acima da média costumam operar entre as 07:00 e as 10:00 nas zonas de Lisboa e Porto. 
          Considere ajustar o seu horário para maximizar a rentabilidade por hora.
        </p>
      </div>
    </div>
  )
}
