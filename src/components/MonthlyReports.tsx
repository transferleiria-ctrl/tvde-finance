import React, { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts'
import type { Trip, Expense } from '../types'
import { colors, card, btn } from '../styles'

interface MonthlyReportsProps {
  trips: Trip[]
  expenses: Expense[]
}

function fmt(value: number) {
  return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
}

const MONTHS_PT_FULL = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const MONTHS_PT_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function getMonthKey(date: string) {
  return date.substring(0, 7) // YYYY-MM
}

export function MonthlyReports({ trips, expenses }: MonthlyReportsProps) {
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  // Get all years present in data
  const years = useMemo(() => {
    const ys = new Set<number>()
    ys.add(now.getFullYear())
    trips.forEach(t => ys.add(parseInt(t.date.substring(0, 4))))
    expenses.forEach(e => ys.add(parseInt(e.date.substring(0, 4))))
    return Array.from(ys).sort((a, b) => b - a)
  }, [trips, expenses])

  // Monthly data for selected year
  const yearData = useMemo(() => {
    return Array.from({ length: 12 }, (_, m) => {
      const key = `${selectedYear}-${String(m + 1).padStart(2, '0')}`
      const monthTrips = trips.filter(t => getMonthKey(t.date) === key)
      const monthExpenses = expenses.filter(e => getMonthKey(e.date) === key)
      const earnings = monthTrips.reduce((s, t) => s + t.earnings, 0)
      const exp = monthExpenses.reduce((s, e) => s + e.amount, 0)
      return {
        month: m,
        name: MONTHS_PT_SHORT[m],
        fullName: MONTHS_PT_FULL[m],
        receitas: earnings,
        despesas: exp,
        lucro: earnings - exp,
        km: monthTrips.reduce((s, t) => s + t.km, 0),
        horas: monthTrips.reduce((s, t) => s + t.hours, 0),
        viagens: monthTrips.length,
        key,
      }
    })
  }, [trips, expenses, selectedYear])

  const yearTotals = useMemo(() => ({
    receitas: yearData.reduce((s, m) => s + m.receitas, 0),
    despesas: yearData.reduce((s, m) => s + m.despesas, 0),
    lucro: yearData.reduce((s, m) => s + m.lucro, 0),
    km: yearData.reduce((s, m) => s + m.km, 0),
    horas: yearData.reduce((s, m) => s + m.horas, 0),
    viagens: yearData.reduce((s, m) => s + m.viagens, 0),
  }), [yearData])

  // Selected month detail
  const monthDetail = useMemo(() => {
    if (selectedMonth === null) return null
    const key = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`
    const monthTrips = trips.filter(t => getMonthKey(t.date) === key)
    const monthExpenses = expenses.filter(e => getMonthKey(e.date) === key)

    // Expense by category
    const expByCat: Record<string, number> = {}
    monthExpenses.forEach(e => { expByCat[e.category] = (expByCat[e.category] || 0) + e.amount })

    // Earnings by platform
    const earnByPlatform: Record<string, number> = {}
    monthTrips.forEach(t => { earnByPlatform[t.platform] = (earnByPlatform[t.platform] || 0) + t.earnings })

    const earnings = monthTrips.reduce((s, t) => s + t.earnings, 0)
    const exp = monthExpenses.reduce((s, e) => s + e.amount, 0)

    return {
      key,
      monthTrips,
      monthExpenses,
      expByCat,
      earnByPlatform,
      earnings,
      exp,
      profit: earnings - exp,
      km: monthTrips.reduce((s, t) => s + t.km, 0),
      horas: monthTrips.reduce((s, t) => s + t.hours, 0),
    }
  }, [selectedMonth, selectedYear, trips, expenses])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Year selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: colors.gray600 }}>Ano:</span>
        {years.map(y => (
          <button
            key={y}
            onClick={() => { setSelectedYear(y); setSelectedMonth(null) }}
            style={{ ...btn(selectedYear === y ? 'primary' : 'ghost'), padding: '7px 16px' }}
          >{y}</button>
        ))}
      </div>

      {/* Annual summary */}
      <div style={card}>
        <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
          Resumo Anual — {selectedYear}
        </h3>
        <div className="stats-grid">
          {[
            { label: 'Receitas', value: fmt(yearTotals.receitas), color: colors.success, icon: '💰' },
            { label: 'Despesas', value: fmt(yearTotals.despesas), color: colors.danger, icon: '💳' },
            { label: 'Lucro Líquido', value: fmt(yearTotals.lucro), color: yearTotals.lucro >= 0 ? colors.primary : colors.warning, icon: '📈' },
            { label: 'Total KM', value: `${yearTotals.km.toLocaleString('pt-PT')} km`, color: '#8b5cf6', icon: '🛣️' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '16px', borderRadius: 10,
              background: s.color + '10',
              border: `1px solid ${s.color}30`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 12, color: colors.gray500, fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Annual charts */}
      <div className="charts-grid">
        <div style={{ ...card, gridColumn: 'span 2' }} className="chart-wide">
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
            Receitas e Despesas por Mês — {selectedYear}
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={yearData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.gray100} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: colors.gray500 }} />
              <YAxis tick={{ fontSize: 12, fill: colors.gray500 }} tickFormatter={v => `€${v}`} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Legend />
              <Bar dataKey="receitas" name="Receitas" fill={colors.success} radius={[3, 3, 0, 0]} />
              <Bar dataKey="despesas" name="Despesas" fill={colors.danger} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
            Evolução do Lucro — {selectedYear}
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.gray100} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: colors.gray500 }} />
              <YAxis tick={{ fontSize: 12, fill: colors.gray500 }} tickFormatter={v => `€${v}`} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Line type="monotone" dataKey="lucro" name="Lucro" stroke={colors.primary} strokeWidth={2.5} dot={{ fill: colors.primary, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div style={card}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
          Detalhe Mensal — Clique para expandir
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: colors.gray50 }}>
                {['Mês', 'Viagens', 'Horas', 'KM', 'Receitas', 'Despesas', 'Lucro', 'Margem'].map(h => (
                  <th key={h} style={{
                    padding: '10px 12px', textAlign: 'left',
                    fontWeight: 600, color: colors.gray500,
                    fontSize: 12, textTransform: 'uppercase',
                    borderBottom: `2px solid ${colors.gray200}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {yearData.map(m => {
                const margin = m.receitas > 0 ? ((m.lucro / m.receitas) * 100).toFixed(1) + '%' : '—'
                const isSelected = selectedMonth === m.month
                const hasData = m.receitas > 0 || m.despesas > 0
                return (
                  <tr
                    key={m.month}
                    onClick={() => setSelectedMonth(isSelected ? null : m.month)}
                    style={{
                      borderBottom: `1px solid ${colors.gray100}`,
                      cursor: hasData ? 'pointer' : 'default',
                      background: isSelected ? colors.primaryLight : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  >
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: colors.gray800 }}>
                      {m.fullName}
                    </td>
                    <td style={{ padding: '10px 12px', color: colors.gray600 }}>{m.viagens}</td>
                    <td style={{ padding: '10px 12px', color: colors.gray600 }}>{m.horas.toFixed(1)}h</td>
                    <td style={{ padding: '10px 12px', color: colors.gray600 }}>{m.km.toLocaleString('pt-PT')}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: colors.success }}>{m.receitas > 0 ? fmt(m.receitas) : '—'}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: colors.danger }}>{m.despesas > 0 ? fmt(m.despesas) : '—'}</td>
                    <td style={{
                      padding: '10px 12px', fontWeight: 700,
                      color: m.lucro > 0 ? colors.primary : m.lucro < 0 ? colors.danger : colors.gray400,
                    }}>
                      {hasData ? fmt(m.lucro) : '—'}
                    </td>
                    <td style={{ padding: '10px 12px', color: colors.gray500 }}>{margin}</td>
                  </tr>
                )
              })}
              {/* Totals row */}
              <tr style={{ background: colors.gray900, color: colors.white }}>
                <td style={{ padding: '12px', fontWeight: 700, color: colors.white }}>TOTAL {selectedYear}</td>
                <td style={{ padding: '12px', color: colors.gray300 }}>{yearTotals.viagens}</td>
                <td style={{ padding: '12px', color: colors.gray300 }}>{yearTotals.horas.toFixed(1)}h</td>
                <td style={{ padding: '12px', color: colors.gray300 }}>{yearTotals.km.toLocaleString('pt-PT')}</td>
                <td style={{ padding: '12px', fontWeight: 700, color: '#6ee7b7' }}>{fmt(yearTotals.receitas)}</td>
                <td style={{ padding: '12px', fontWeight: 700, color: '#fca5a5' }}>{fmt(yearTotals.despesas)}</td>
                <td style={{ padding: '12px', fontWeight: 700, color: yearTotals.lucro >= 0 ? '#93c5fd' : '#fca5a5' }}>{fmt(yearTotals.lucro)}</td>
                <td style={{ padding: '12px', color: colors.gray300 }}>
                  {yearTotals.receitas > 0 ? ((yearTotals.lucro / yearTotals.receitas) * 100).toFixed(1) + '%' : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Month detail panel */}
      {selectedMonth !== null && monthDetail && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
              Detalhe: {MONTHS_PT_FULL[selectedMonth]} {selectedYear}
            </h3>
            <button onClick={() => setSelectedMonth(null)} style={{ ...btn('ghost'), padding: '6px 12px', fontSize: 13 }}>
              Fechar ✕
            </button>
          </div>

          <div className="stats-grid-3" style={{ marginBottom: 20 }}>
            {[
              { label: 'Receitas', value: fmt(monthDetail.earnings), color: colors.success },
              { label: 'Despesas', value: fmt(monthDetail.exp), color: colors.danger },
              { label: 'Lucro', value: fmt(monthDetail.profit), color: monthDetail.profit >= 0 ? colors.primary : colors.warning },
              { label: 'KM percorridos', value: `${monthDetail.km.toLocaleString('pt-PT')} km`, color: '#8b5cf6' },
              { label: 'Horas trabalhadas', value: `${monthDetail.horas.toFixed(1)}h`, color: '#06b6d4' },
              { label: 'Nº de viagens', value: String(monthDetail.monthTrips.length), color: colors.gray600 },
            ].map(s => (
              <div key={s.label} style={{
                padding: '14px 16px', borderRadius: 10,
                background: s.color + '10',
                border: `1px solid ${s.color}30`,
              }}>
                <div style={{ fontSize: 12, color: colors.gray500 }}>{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="charts-grid">
            {/* Earnings by platform */}
            {Object.keys(monthDetail.earnByPlatform).length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: colors.gray700 }}>
                  Receitas por Plataforma
                </h4>
                {Object.entries(monthDetail.earnByPlatform).map(([platform, amount]) => (
                  <div key={platform} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: colors.gray600 }}>{platform}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: colors.gray800 }}>{fmt(amount)}</span>
                    </div>
                    <div style={{ height: 6, background: colors.gray100, borderRadius: 3 }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        background: colors.success,
                        width: `${(amount / monthDetail.earnings) * 100}%`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Expenses by category */}
            {Object.keys(monthDetail.expByCat).length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: colors.gray700 }}>
                  Despesas por Categoria
                </h4>
                {Object.entries(monthDetail.expByCat)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, amount]) => (
                    <div key={cat} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: colors.gray600 }}>{cat}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: colors.danger }}>{fmt(amount)}</span>
                      </div>
                      <div style={{ height: 6, background: colors.gray100, borderRadius: 3 }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          background: colors.danger,
                          width: `${(amount / monthDetail.exp) * 100}%`,
                        }} />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
