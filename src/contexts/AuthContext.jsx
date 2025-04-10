import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)
      } catch (error) {
        console.error('Error checking session:', error)
        setUser(null)
        setLoading(false)
        setError(error.message)
      }
    }

    checkSession()
  }, [])

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (data) => {
    try {
      setLoading(true)
      setError(null)
      const { data: { user }, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.metadata?.name
          }
        }
      })
      
      if (error) throw error
      return user
    } catch (error) {
      console.error('Error during signup:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (data) => {
    try {
      setLoading(true)
      setError(null)
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })
      
      if (error) throw error
      return user
    } catch (error) {
      console.error('Error during sign in:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      setUser(null)
    } catch (error) {
      console.error('Error during sign out:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    loading,
    error,
    isAuthenticated: !!user,
    clearError: () => setError(null)
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
