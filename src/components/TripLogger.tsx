import React, { useState } from 'react'
import type { Trip, Platform } from '../types'
import { colors, card, btn, input, label, formGroup } from '../styles'

interface TripLoggerProps {
  trips: Trip[]
  onAdd: (trip: Omit<Trip, 'id'>) => void
  onDelete: (id: string) => void
}

const PLATFORMS: Platform[] = ['Uber', 'Bolt', 'FREE NOW', 'Outro']

function fmt(value: number) {
  return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
}

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  hours: '',
  km: '',
  earnings: '',
  platform: 'Uber' as Platform,
  notes: '',
}

export function TripLogger({ trips, onAdd, onDelete }: TripLoggerProps) {
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'Todas'>('Todas')
  const [sortBy, setSortBy] = useState<'date' | 'earnings'>('date')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date || !form.hours || !form.km || !form.earnings) return
    onAdd({
      date: form.date,
      hours: parseFloat(form.hours),
      km: parseFloat(form.km),
      earnings: parseFloat(form.earnings),
      platform: form.platform,
      notes: form.notes,
    })
    setForm(emptyForm)
    setShowForm(false)
  }

  const filtered = trips
    .filter(t => filterPlatform === 'Todas' || t.platform === filterPlatform)
    .sort((a, b) => {
      if (sortBy === 'date') return b.date.localeCompare(a.date)
      return b.earnings - a.earnings
    })

  const totalEarnings = filtered.reduce((s, t) => s + t.earnings, 0)
  const totalKm = filtered.reduce((s, t) => s + t.km, 0)
  const totalHours = filtered.reduce((s, t) => s + t.hours, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Summary bar */}
      <div className="stats-grid-3">
        {[
          { label: 'Total Ganhos', value: fmt(totalEarnings), color: colors.success },
          { label: 'Total KM', value: `${totalKm.toLocaleString('pt-PT')} km`, color: colors.primary },
          { label: 'Total Horas', value: `${totalHours.toFixed(1)}h`, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{
            ...card, textAlign: 'center',
            borderTop: `3px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: colors.gray500, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12,
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['Todas', ...PLATFORMS] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              style={{
                ...btn(filterPlatform === p ? 'primary' : 'ghost'),
                padding: '7px 14px',
                fontSize: 13,
              }}
            >{p}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'date' | 'earnings')}
            style={{ ...input, width: 'auto', padding: '8px 12px' }}
          >
            <option value="date">Ordenar por data</option>
            <option value="earnings">Ordenar por ganhos</option>
          </select>
          <button onClick={() => setShowForm(!showForm)} style={btn('primary')}>
            {showForm ? '✕ Cancelar' : '+ Nova Viagem'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div style={card}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
            Registar Nova Viagem
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div style={formGroup}>
                <label style={label}>Data *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  style={input}
                  required
                />
              </div>
              <div style={formGroup}>
                <label style={label}>Plataforma *</label>
                <select
                  value={form.platform}
                  onChange={e => setForm(f => ({ ...f, platform: e.target.value as Platform }))}
                  style={input}
                  required
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={formGroup}>
                <label style={label}>Horas trabalhadas *</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="Ex: 8.5"
                  value={form.hours}
                  onChange={e => setForm(f => ({ ...f, hours: e.target.value }))}
                  style={input}
                  required
                />
              </div>
              <div style={formGroup}>
                <label style={label}>Quilómetros (km) *</label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  placeholder="Ex: 120"
                  value={form.km}
                  onChange={e => setForm(f => ({ ...f, km: e.target.value }))}
                  style={input}
                  required
                />
              </div>
              <div style={formGroup}>
                <label style={label}>Ganhos (€) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 85.50"
                  value={form.earnings}
                  onChange={e => setForm(f => ({ ...f, earnings: e.target.value }))}
                  style={input}
                  required
                />
              </div>
              <div style={formGroup}>
                <label style={label}>Notas (opcional)</label>
                <input
                  type="text"
                  placeholder="Observações..."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  style={input}
                />
              </div>
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button type="submit" style={btn('primary')}>✓ Guardar Viagem</button>
              <button type="button" onClick={() => setShowForm(false)} style={btn('ghost')}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Trips table */}
      <div style={card}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
          Viagens ({filtered.length})
        </h3>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: colors.gray400, padding: '40px 0', fontSize: 14 }}>
            Nenhuma viagem encontrada. Clique em "Nova Viagem" para começar.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: colors.gray50 }}>
                  {['Data', 'Plataforma', 'Horas', 'KM', 'Ganhos', '€/h', '€/km', 'Notas', ''].map(h => (
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
                {filtered.map(t => (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                    <td style={{ padding: '10px 12px', color: colors.gray700 }}>
                      {new Date(t.date + 'T00:00:00').toLocaleDateString('pt-PT')}
                    </td>
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
                    <td style={{ padding: '10px 12px', color: colors.gray600 }}>{fmt(t.earnings / t.hours)}</td>
                    <td style={{ padding: '10px 12px', color: colors.gray600 }}>{(t.earnings / t.km).toFixed(3)}€</td>
                    <td style={{ padding: '10px 12px', color: colors.gray400, fontSize: 12 }}>{t.notes || '—'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <button
                        onClick={() => onDelete(t.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: colors.danger, fontSize: 16, padding: '2px 6px',
                          borderRadius: 4,
                        }}
                        title="Eliminar"
                      >✕</button>
                    </td>
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
