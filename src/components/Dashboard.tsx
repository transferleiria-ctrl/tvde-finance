import React, { useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import type { Trip, Expense } from '../types'
import { colors, card, shadows } from '../styles'

interface DashboardProps {
  trips: Trip[]
  expenses: Expense[]
}

function fmt(value: number) {
  return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
}

function StatCard({
  title, value, sub, color, icon,
}: {
  title: string; value: string; sub: string; color: string; icon: string
}) {
  return (
    <div style={{
      ...card,
      borderLeft: `4px solid ${color}`,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: colors.gray500, fontWeight: 500, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: colors.gray900 }}>{value}</div>
          <div style={{ fontSize: 12, color: colors.gray400, marginTop: 4 }}>{sub}</div>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: color + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>{icon}</div>
      </div>
    </div>
  )
}

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function Dashboard({ trips, expenses }: DashboardProps) {
  const totalEarnings = useMemo(() => trips.reduce((s, t) => s + t.earnings, 0), [trips])
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses])
  const profit = totalEarnings - totalExpenses
  const totalKm = useMemo(() => trips.reduce((s, t) => s + t.km, 0), [trips])
  const totalHours = useMemo(() => trips.reduce((s, t) => s + t.hours, 0), [trips])
  const earningsPerKm = totalKm > 0 ? totalEarnings / totalKm : 0
  const earningsPerHour = totalHours > 0 ? totalEarnings / totalHours : 0

  // Monthly chart data (last 6 months)
  const monthlyData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const m = d.getMonth()
      const y = d.getFullYear()
      const key = `${y}-${String(m + 1).padStart(2, '0')}`
      const earn = trips.filter(t => t.date.startsWith(key)).reduce((s, t) => s + t.earnings, 0)
      const exp = expenses.filter(e => e.date.startsWith(key)).reduce((s, e) => s + e.amount, 0)
      return { name: MONTHS_PT[m], receitas: earn, despesas: exp, lucro: earn - exp }
    })
  }, [trips, expenses])

  // Expense by category
  const expByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [expenses])

  // Platform breakdown
  const platformData = useMemo(() => {
    const map: Record<string, number> = {}
    trips.forEach(t => { map[t.platform] = (map[t.platform] || 0) + t.earnings })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [trips])

  const PIE_COLORS = [colors.primary, colors.success, colors.warning, colors.danger, '#8b5cf6', '#06b6d4']

  const recentTrips = trips.slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI Cards */}
      <div className="stats-grid">
        <StatCard title="Receitas Totais" value={fmt(totalEarnings)} sub={`${trips.length} viagens registadas`} color={colors.success} icon="💰" />
        <StatCard title="Despesas Totais" value={fmt(totalExpenses)} sub={`${expenses.length} despesas registadas`} color={colors.danger} icon="💳" />
        <StatCard title="Lucro Líquido" value={fmt(profit)} sub={profit >= 0 ? 'Resultado positivo' : 'Resultado negativo'} color={profit >= 0 ? colors.primary : colors.warning} icon="📈" />
        <StatCard title="Total de KM" value={totalKm.toLocaleString('pt-PT')} sub={`${fmt(earningsPerKm)}/km`} color="#8b5cf6" icon="🛣️" />
      </div>

      {/* Charts row */}
      <div className="charts-grid">
        {/* Area chart */}
        <div style={{ ...card, gridColumn: 'span 2' }} className="chart-wide">
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
            Receitas vs Despesas — Últimos 6 Meses
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.success} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.success} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.danger} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.danger} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.gray100} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: colors.gray500 }} />
              <YAxis tick={{ fontSize: 12, fill: colors.gray500 }} tickFormatter={v => `€${v}`} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Area type="monotone" dataKey="receitas" stroke={colors.success} fill="url(#colorReceitas)" strokeWidth={2} name="Receitas" />
              <Area type="monotone" dataKey="despesas" stroke={colors.danger} fill="url(#colorDespesas)" strokeWidth={2} name="Despesas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart expenses */}
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
            Despesas por Categoria
          </h3>
          {expByCategory.length === 0 ? (
            <div style={{ textAlign: 'center', color: colors.gray400, padding: '40px 0', fontSize: 14 }}>
              Sem despesas registadas
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {expByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Second row */}
      <div className="charts-grid">
        {/* Bar chart profit */}
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
            Lucro Mensal
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.gray100} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: colors.gray500 }} />
              <YAxis tick={{ fontSize: 12, fill: colors.gray500 }} tickFormatter={v => `€${v}`} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Bar dataKey="lucro" name="Lucro" radius={[4, 4, 0, 0]}>
                {monthlyData.map((entry, i) => (
                  <Cell key={i} fill={entry.lucro >= 0 ? colors.primary : colors.danger} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platform breakdown */}
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
            Receitas por Plataforma
          </h3>
          {platformData.length === 0 ? (
            <div style={{ textAlign: 'center', color: colors.gray400, padding: '40px 0', fontSize: 14 }}>
              Sem viagens registadas
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={platformData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                  {platformData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Key metrics */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
            Métricas Chave
          </h3>
          {[
            { label: 'Ganho por hora', value: fmt(earningsPerHour), icon: '⏱️' },
            { label: 'Ganho por km', value: fmt(earningsPerKm), icon: '📍' },
            { label: 'Total de horas', value: `${totalHours.toFixed(1)}h`, icon: '🕐' },
            { label: 'Margem de lucro', value: totalEarnings > 0 ? `${((profit / totalEarnings) * 100).toFixed(1)}%` : '—', icon: '📊' },
          ].map(m => (
            <div key={m.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: 8, background: colors.gray50,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
                <span style={{ fontSize: 13, color: colors.gray600 }}>{m.label}</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: colors.gray900 }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent trips */}
      <div style={card}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
          Viagens Recentes
        </h3>
        {recentTrips.length === 0 ? (
          <div style={{ textAlign: 'center', color: colors.gray400, padding: '24px 0', fontSize: 14 }}>
            Nenhuma viagem registada. Adicione viagens no separador "Viagens".
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${colors.gray100}` }}>
                  {['Data', 'Plataforma', 'Horas', 'KM', 'Ganhos'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: colors.gray500, fontSize: 12, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTrips.map(t => (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                    <td style={{ padding: '10px 12px', color: colors.gray700 }}>{new Date(t.date).toLocaleDateString('pt-PT')}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: t.platform === 'Uber' ? '#f3f4f6' : t.platform === 'Bolt' ? '#d1fae5' : t.platform === 'FREE NOW' ? '#fef3c7' : '#ede9fe',
                        color: t.platform === 'Uber' ? '#1f2937' : t.platform === 'Bolt' ? '#065f46' : t.platform === 'FREE NOW' ? '#92400e' : '#5b21b6',
                      }}>{t.platform}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: colors.gray700 }}>{t.hours}h</td>
                    <td style={{ padding: '10px 12px', color: colors.gray700 }}>{t.km} km</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: colors.success }}>{fmt(t.earnings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
