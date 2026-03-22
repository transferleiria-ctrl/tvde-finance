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

export interface UserProfile {
  displayName: string
  carModel: string
  photoUrl?: string
}

export interface Post {
  id: string
  userId: string
  userName: string
  userPhoto?: string
  content: string
  date: string
  likes: string[] // IDs dos usuários que curtiram
  comments: Comment[]
}

export interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  date: string
}

export interface Partnership {
  id: string
  name: string
  category: 'Mecânico' | 'Seguro' | 'Aluguer' | 'Outro'
  description: string
  location: string
  rating: number
  reviews: number
  discount?: string
}

export interface AppState {
  trips: Trip[]
  expenses: Expense[]
  profile: UserProfile
  posts: Post[]
  partnerships: Partnership[]
}
