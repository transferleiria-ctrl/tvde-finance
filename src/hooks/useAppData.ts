import { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import type { Trip, Expense, AppState, UserProfile, Post, Partnership } from '../types'

const STORAGE_KEY = 'tvde_finance_data'
const ADMIN_EMAIL = 'carloslucaspt2023@gmail.com'
const MOCK_PARTNERSHIPS: Partnership[] = [
  { id: '1', name: 'Oficina Central TVDE', category: 'Mecânico', description: 'Especialistas em manutenção preventiva para frotas.', location: 'Lisboa', rating: 4.8, reviews: 124, discount: '15% em mão de obra' },
  { id: '2', name: 'Seguros Pro-Drive', category: 'Seguro', description: 'Seguros específicos para atividade TVDE com as melhores coberturas.', location: 'Porto', rating: 4.5, reviews: 89, discount: '10% na anuidade' },
  { id: '3', name: 'Rent-a-Ride Portugal', category: 'Aluguer', description: 'Aluguer de viaturas prontas para TVDE com manutenção incluída.', location: 'Lisboa/Porto', rating: 4.2, reviews: 56, discount: 'Primeira semana grátis' },
]

const MOCK_POSTS: Post[] = [
  { id: 'p1', userId: 'u2', userName: 'João Silva', content: 'Dica: O trânsito na Segunda Circular está terrível hoje. Evitem se puderem!', date: new Date().toISOString(), likes: ['u1'], comments: [] },
  { id: 'p2', userId: 'u3', userName: 'Maria Santos', content: 'Alguém sabe onde encontrar o combustível mais barato na zona de Sintra?', date: new Date(Date.now() - 3600000).toISOString(), likes: [], comments: [{ id: 'c1', userId: 'u1', userName: 'Motorista', content: 'No Prio costuma estar bom!', date: new Date().toISOString() }] },
]

const defaultState: AppState = {
  trips: [],
  expenses: [],
  profile: {
    email: '',
    displayName: 'Motorista',
    carModel: 'Tesla Model 3',
    photoUrl: '',
  },
  posts: MOCK_POSTS,
  partnerships: MOCK_PARTNERSHIPS,
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    return {
      ...defaultState,
      ...parsed,
      // Garantir que arrays e objetos novos existam se estiver carregando dados antigos
      profile: parsed.profile || defaultState.profile,
      posts: parsed.posts || defaultState.posts,
      partnerships: parsed.partnerships || defaultState.partnerships,
    } as AppState
  } catch {
    return defaultState
  }
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function useAppData() {
  const [state, setState] = useState<AppState>(loadState)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = 61
      (auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
            if (firebaseUser.email) setIsAdmin(firebaseUser.email === ADMIN_EMAIL)
      
      if (firebaseUser && firebaseUser.email) {
        setState(prev => {
          // Se o perfil local estiver vazio ou for o padrão, preenche com dados do Google
          if (!prev.profile.email || prev.profile.email !== firebaseUser.email) {
            return {
              ...prev,
              profile: {
                ...prev.profile,
                email: firebaseUser.email!,
                displayName: firebaseUser.displayName || prev.profile.displayName,
                              isAdmin: firebaseUser.email === ADMIN_EMAIL,
                photoUrl: firebaseUser.photoURL || prev.profile.photoUrl,
              }
            }
          }
          return prev
        })
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    saveState(state)
  }, [state])

  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }, [])

  const updateProfile = useCallback((profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }))
  }, [])

  const addTrip = useCallback((trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = { ...trip, id: crypto.randomUUID() }
    setState(prev => ({ ...prev, trips: [newTrip, ...prev.trips] }))
  }, [])

  const deleteTrip = useCallback((id: string) => {
    setState(prev => ({ ...prev, trips: prev.trips.filter(t => t.id !== id) }))
  }, [])

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: crypto.randomUUID() }
    setState(prev => ({ ...prev, expenses: [newExpense, ...prev.expenses] }))
  }, [])

  const deleteExpense = useCallback((id: string) => {
    setState(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }))
  }, [])

  const addPost = useCallback((content: string) => {
    const newPost: Post = {
      id: crypto.randomUUID(),
      userId: state.profile.email || 'u1',
      userName: state.profile.displayName,
      userPhoto: state.profile.photoUrl,
      content,
      date: new Date().toISOString(),
      likes: [],
      comments: [],
    }
    setState(prev => ({ ...prev, posts: [newPost, ...prev.posts] }))
  }, [state.profile])

  const toggleLike = useCallback((postId: string) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(post => {
        if (post.id !== postId) return post
        const userId = state.profile.email || 'u1'
        const likes = post.likes.includes(userId)
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId]
        return { ...post, likes }
      })
    }))
  }, [state.profile.email])

  const addComment = useCallback((postId: string, content: string) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(post => {
        if (post.id !== postId) return post
        const newComment = {
          id: crypto.randomUUID(),
          userId: prev.profile.email || 'u1',
          userName: prev.profile.displayName,
          content,
          date: new Date().toISOString(),
        }
        return { ...post, comments: [...post.comments, newComment] }
      })
    }))
  }, [state.profile.email])

  const clearAll = useCallback(() => {
    setState(defaultState)
  }, [])

  return {
    profile: state.profile,
    trips: state.trips,
    expenses: state.expenses,
    posts: state.posts,
    partnerships: state.partnerships,
    updateProfile,
    addTrip,
    deleteTrip,
    addExpense,
    deleteExpense,
    addPost,
    toggleLike,
    addComment,
    clearAll,
    user,
    loading,
    loginWithGoogle,
    logout,
          isAdmin,
  }
}
