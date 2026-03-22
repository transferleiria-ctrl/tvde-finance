import type { CSSProperties } from 'react'

export const colors = {
  primary: '#1a56db',
  primaryDark: '#1e429f',
  primaryLight: '#e8f0fe',
  success: '#0e9f6e',
  successLight: '#def7ec',
  danger: '#e02424',
  dangerLight: '#fde8e8',
  warning: '#ff5a1f',
  warningLight: '#feecdc',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  white: '#ffffff',
  uber: '#000000',
  bolt: '#34d186',
  freenow: '#f5a623',
}

export const shadows = {
  sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
}

export const card: CSSProperties = {
  background: colors.white,
  borderRadius: 12,
  padding: '24px',
  boxShadow: shadows.md,
  border: `1px solid ${colors.gray200}`,
}

export const btn = (variant: 'primary' | 'danger' | 'ghost' = 'primary'): CSSProperties => {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 18px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    textDecoration: 'none',
  }
  if (variant === 'primary') return { ...base, background: colors.primary, color: colors.white }
  if (variant === 'danger') return { ...base, background: colors.danger, color: colors.white }
  return { ...base, background: 'transparent', color: colors.gray600, border: `1px solid ${colors.gray300}` }
}

export const input: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: `1px solid ${colors.gray300}`,
  fontSize: 14,
  fontFamily: 'inherit',
  color: colors.gray800,
  background: colors.white,
  boxSizing: 'border-box',
  outline: 'none',
}

export const label: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: colors.gray700,
  marginBottom: 6,
}

export const formGroup: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}

export const grid = (cols: number): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${cols}, 1fr)`,
  gap: 16,
})
