export type Platform = 'Uber' | 'Bolt' | 'FREE NOW' | 'Outro'

export interface Trip {
  id: string
  date: string
  hours: number
  km: number
  earnings: number
  platform: Platform
  notes?: string
}

export interface Expense {
  id: string
  date: string
  category: ExpenseCategory
  amount: number
  description: string
}

export type ExpenseCategory =
  | 'Combustível'
  | 'Manutenção'
  | 'Seguro'
  | 'Impostos'
  | 'Licença TVDE'
  | 'Limpeza'
  | 'Outro'

export interface MonthlyReport {
  month: string
  year: number
  totalEarnings: number
  totalExpenses: number
  totalKm: number
  totalHours: number
  trips: number
  profit: number
}

export interface AppState {
  trips: Trip[]
  expenses: Expense[]
}
