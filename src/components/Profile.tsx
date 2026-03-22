import React, { useState, useMemo } from 'react'
import { colors, card, btn, input, label, formGroup } from '../styles'
import type { UserProfile } from '../types'

interface ProfileProps {
  profile: UserProfile
  onUpdate: (profile: UserProfile) => void
}

export function Profile({ profile, onUpdate }: ProfileProps) {
  const [formData, setFormData] = useState<UserProfile>(profile)
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(formData)
    setIsEditing(false)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ ...card, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            width: 120, 
            height: 120, 
            borderRadius: '50%', 
            backgroundColor: colors.gray100, 
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: `4px solid ${colors.white}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            {formData.photoUrl ? (
              <img src={formData.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontSize: 48, color: colors.gray400 }}>{formData.displayName[0]}</div>
            )}
          </div>
          <h2 style={{ margin: '0 0 4px', fontSize: 24 }}>{profile.displayName}</h2>
          <p style={{ margin: '0 0 4px', color: colors.gray500 }}>{profile.carModel}</p>
          <p style={{ margin: 0, color: colors.gray400, fontSize: 14 }}>{profile.email}</p>
        </div>

        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            style={{ ...btn('primary'), width: '100%' }}
          >
            Editar Perfil
          </button>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={formGroup}>
              <label style={label}>Email (Google)</label>
              <input
                style={{ ...input, backgroundColor: colors.gray50, cursor: 'not-allowed' }}
                value={formData.email}
                readOnly
                disabled
              />
            </div>
            <div style={formGroup}>
              <label style={label}>Nome de Exibição</label>
              <input
                style={input}
                value={formData.displayName}
                onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                required
              />
            </div>
            <div style={formGroup}>
              <label style={label}>Modelo do Carro</label>
              <input
                style={input}
                value={formData.carModel}
                onChange={e => setFormData(prev => ({ ...prev, carModel: e.target.value }))}
                required
              />
            </div>
            <div style={formGroup}>
              <label style={label}>Foto de Perfil</label>
              <input
                type="file"
                accept="image/*"
                style={input}
                onChange={handlePhotoChange}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button 
                type="button" 
                onClick={() => {
                  setFormData(profile)
                  setIsEditing(false)
                }}
                style={{ ...btn('ghost'), flex: 1 }}
              >
                Cancelar
              </button>
              <button type="submit" style={{ ...btn('primary'), flex: 1 }}>
                Guardar Alterações
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
