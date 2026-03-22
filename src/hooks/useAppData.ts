import { useState, useEffect, useCallback } from 'react'
import type { Trip, Expense, AppState } from '../types'

const STORAGE_KEY = 'tvde_finance_data'

const defaultState: AppState = {
  trips: [],
  expenses: [],
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    return JSON.parse(raw) as AppState
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

  useEffect(() => {
    saveState(state)
  }, [state])

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

  const clearAll = useCallback(() => {
    setState(defaultState)
  }, [])

  return {
    trips: state.trips,
    expenses: state.expenses,
    addTrip,
    deleteTrip,
    addExpense,
    deleteExpense,
    clearAll,
  }
}
