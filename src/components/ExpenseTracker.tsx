import React, { useState } from 'react'
import type { Expense, ExpenseCategory } from '../types'
import { colors, card, btn, input, label, formGroup } from '../styles'

interface ExpenseTrackerProps {
  expenses: Expense[]
  onAdd: (expense: Omit<Expense, 'id'>) => void
  onDelete: (id: string) => void
}

const CATEGORIES: ExpenseCategory[] = [
  'Combustível', 'Manutenção', 'Seguro', 'Impostos', 'Licença TVDE', 'Limpeza', 'Outro',
]

const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  'Combustível': '⛽',
  'Manutenção': '🔧',
  'Seguro': '🛡️',
  'Impostos': '🏛️',
  'Licença TVDE': '📋',
  'Limpeza': '🧹',
  'Outro': '📦',
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Combustível': '#f59e0b',
  'Manutenção': '#3b82f6',
  'Seguro': '#8b5cf6',
  'Impostos': '#ef4444',
  'Licença TVDE': '#06b6d4',
  'Limpeza': '#10b981',
  'Outro': '#6b7280',
}

function fmt(value: number) {
  return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
}

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  category: 'Combustível' as ExpenseCategory,
  amount: '',
  description: '',
}

export function ExpenseTracker({ expenses, onAdd, onDelete }: ExpenseTrackerProps) {
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [filterCat, setFilterCat] = useState<ExpenseCategory | 'Todas'>('Todas')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date || !form.amount || !form.description) return
    onAdd({
      date: form.date,
      category: form.category,
      amount: parseFloat(form.amount),
      description: form.description,
    })
    setForm(emptyForm)
    setShowForm(false)
  }

  const filtered = expenses
    .filter(e => filterCat === 'Todas' || e.category === filterCat)
    .sort((a, b) => b.date.localeCompare(a.date))

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0)

  // Category totals
  const catTotals = CATEGORIES.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Category summary cards */}
      {catTotals.length > 0 && (
        <div className="cat-grid">
          {catTotals.map(({ cat, total }) => (
            <div
              key={cat}
              onClick={() => setFilterCat(filterCat === cat ? 'Todas' : cat)}
              style={{
                ...card,
                cursor: 'pointer',
                borderLeft: `4px solid ${CATEGORY_COLORS[cat]}`,
                opacity: filterCat !== 'Todas' && filterCat !== cat ? 0.5 : 1,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{CATEGORY_ICONS[cat]}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.gray700 }}>{cat}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: CATEGORY_COLORS[cat] }}>{fmt(total)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12,
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterCat('Todas')}
            style={{ ...btn(filterCat === 'Todas' ? 'primary' : 'ghost'), padding: '7px 14px', fontSize: 13 }}
          >Todas</button>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(filterCat === c ? 'Todas' : c)}
              style={{ ...btn(filterCat === c ? 'primary' : 'ghost'), padding: '7px 14px', fontSize: 13 }}
            >{CATEGORY_ICONS[c]} {c}</button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} style={btn('primary')}>
          {showForm ? '✕ Cancelar' : '+ Nova Despesa'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={card}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
            Registar Nova Despesa
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
                <label style={label}>Categoria *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as ExpenseCategory }))}
                  style={input}
                  required
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
                </select>
              </div>
              <div style={formGroup}>
                <label style={label}>Valor (€) *</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Ex: 45.00"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  style={input}
                  required
                />
              </div>
              <div style={formGroup}>
                <label style={label}>Descrição *</label>
                <input
                  type="text"
                  placeholder="Ex: Abastecimento na Galp Lisboa"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  style={input}
                  required
                />
              </div>
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button type="submit" style={btn('primary')}>✓ Guardar Despesa</button>
              <button type="button" onClick={() => setShowForm(false)} style={btn('ghost')}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colors.gray800 }}>
            Despesas ({filtered.length})
          </h3>
          <span style={{ fontSize: 15, fontWeight: 700, color: colors.danger }}>{fmt(totalFiltered)}</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: colors.gray400, padding: '40px 0', fontSize: 14 }}>
            Nenhuma despesa encontrada. Clique em "Nova Despesa" para começar.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: colors.gray50 }}>
                  {['Data', 'Categoria', 'Descrição', 'Valor', ''].map(h => (
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
                {filtered.map(e => (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${colors.gray100}` }}>
                    <td style={{ padding: '10px 12px', color: colors.gray700 }}>
                      {new Date(e.date + 'T00:00:00').toLocaleDateString('pt-PT')}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: CATEGORY_COLORS[e.category] + '20',
                        color: CATEGORY_COLORS[e.category],
                      }}>
                        {CATEGORY_ICONS[e.category]} {e.category}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: colors.gray700 }}>{e.description}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: colors.danger }}>{fmt(e.amount)}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <button
                        onClick={() => onDelete(e.id)}
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
