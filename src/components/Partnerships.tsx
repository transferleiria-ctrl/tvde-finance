import React, { useState } from 'react'
import { colors, card, btn, input, label, formGroup } from '../styles'
import type { Partnership } from '../types'

interface PartnershipsProps {
  partnerships: Partnership[]
}

export function Partnerships({ partnerships }: PartnershipsProps) {
  const [filter, setFilter] = useState<string>('Todos')
  const categories = ['Todos', ...Array.from(new Set(partnerships.map(p => p.category)))]

  const filtered = filter === 'Todos' 
    ? partnerships 
    : partnerships.filter(p => p.category === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              ...btn(filter === cat ? 'primary' : 'ghost'),
              padding: '8px 16px',
              fontSize: 14,
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ ...card, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ 
                  fontSize: 12, 
                  fontWeight: 700, 
                  color: colors.primary, 
                  textTransform: 'uppercase', 
                  marginBottom: 4,
                  backgroundColor: `${colors.primary}10`,
                  padding: '4px 8px',
                  borderRadius: 4,
                  display: 'inline-block'
                }}>
                  {p.category}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.gray900, margin: '8px 0 4px' }}>{p.name}</h3>
                <div style={{ fontSize: 14, color: colors.gray500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>📍 {p.location}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fbbf24' }}>★ {p.rating.toFixed(1)}</div>
                <div style={{ fontSize: 12, color: colors.gray400 }}>{p.reviews} avaliações</div>
              </div>
            </div>

            <p style={{ fontSize: 15, color: colors.gray600, lineHeight: 1.5, margin: 0 }}>
              {p.description}
            </p>

            {p.discount && (
              <div style={{ 
                padding: '12px 16px', 
                backgroundColor: '#f0fdf4', 
                border: '1px dashed #22c55e', 
                borderRadius: 8,
                color: '#166534',
                fontWeight: 700,
                fontSize: 14,
                textAlign: 'center'
              }}>
                🎁 {p.discount}
              </div>
            )}

            <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${colors.gray100}` }}>
              <button style={{ ...btn('primary'), width: '100%' }}>Ver Detalhes e Contactar</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...card, padding: 32, textAlign: 'center', border: `2px dashed ${colors.gray200}`, background: 'none' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.gray900, marginBottom: 8 }}>É um parceiro?</h3>
        <p style={{ fontSize: 14, color: colors.gray500, marginBottom: 20 }}>
          Ofereça benefícios exclusivos aos motoristas da nossa comunidade e aumente a sua visibilidade.
        </p>
        <button style={{ ...btn('ghost'), padding: '10px 24px' }}>Candidatar-se a Parceiro</button>
      </div>
    </div>
  )
}
