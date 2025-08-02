import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, type Profile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, username: string, displayName: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  refreshProfile: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<Profile | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user and profile on mount
  useEffect(() => {
    async function loadUser() {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          await loadProfile(user.id)
        }
      } finally {
        setLoading(false)
      }
    }
    loadUser()

    // Set up auth listener - KEEP SIMPLE, avoid any async operations in callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // NEVER use any async operations in callback
        setUser(session?.user || null)

        if (session?.user) {
          // Load profile outside of callback to avoid deadlocks
          loadProfile(session.user.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = useCallback(async (userId: string) => {
    try {
      console.log('AuthContext: Loading profile for userId:', userId)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      console.log('AuthContext: Profile fetch result:', { data, error })

      if (error) {
        console.error('AuthContext: Error loading profile:', error)
        setProfile(null)
        return
      }

      if (data) {
        console.log('AuthContext: Profile loaded successfully:', data.username)
        setProfile(data)
      } else {
        console.log('AuthContext: No profile found for user, creating one...')
        console.log('About to call createMissingProfile with userId:', userId)
        try {
          await createMissingProfile(userId)
          console.log('createMissingProfile completed')
        } catch (createError) {
          console.error('Failed to create missing profile:', createError)
          setProfile(null)
        }
      }
    } catch (error) {
      console.error('AuthContext: Exception loading profile:', error)
      setProfile(null)
    }
  }, [])

  const createMissingProfile = async (userId: string) => {
    try {
      console.log('Creating missing profile for userId:', userId)

      // Get user email from auth
      console.log('Getting user data from Supabase auth...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error('Error getting user:', userError)
        return
      }

      if (!user) {
        console.error('No authenticated user found')
        return
      }

      console.log('User data retrieved:', { email: user.email, metadata: user.user_metadata })

      // Generate a username from email or use a default
      const email = user.email || ''
      const baseUsername = email.split('@')[0] || 'user'
      const randomSuffix = Math.floor(Math.random() * 1000)
      const username = `${baseUsername}${randomSuffix}`.toLowerCase()

      const newProfile = {
        user_id: userId,
        username: username,
        display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || baseUsername,
        bio: null,
        avatar_url: user.user_metadata?.avatar_url || null,
        primary_color: '#3B82F6',
        subscription_status: 'free' as const,
        plan_type: 'free' as const,
        product_count: 0,
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('Attempting to insert profile:', newProfile)

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single()

      console.log('Insert result:', { data, error })

      if (error) {
        console.error('Error creating profile:', error)
        setProfile(null)
        return
      }

      console.log('Profile created successfully:', data)
      setProfile(data)
    } catch (error) {
      console.error('Exception creating profile:', error)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

  const signUp = async (email: string, password: string, username: string, displayName: string) => {
    try {
      // Check if username is already taken - this should have been validated on the frontend
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle()

      // If username exists, throw an error instead of auto-generating
      if (existingProfile) {
        throw new Error('Username is already taken. Please choose a different username.')
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase(),
            display_name: displayName
          }
        }
      })

      if (error) throw error

      return data
    } catch (err) {
      console.error('Signup error:', err)
      throw err
    }
  }

  const signIn = async (emailOrUsername: string, password: string) => {
    // Check if input looks like an email
    const isEmail = emailOrUsername.includes('@')

    if (isEmail) {
      // Direct email login
      return await supabase.auth.signInWithPassword({ email: emailOrUsername, password })
    } else {
      // For username login, we'll need to use a Supabase Edge Function or RPC
      // For now, let's try a simpler approach by attempting both methods

      // First try as email (in case user enters email without @)
      const emailResult = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password
      })

      if (!emailResult.error) {
        return emailResult
      }

      // If that fails, we need to find the email for this username
      // Since we can't access auth.users directly, we'll create an RPC function
      try {
        const { data: emailData, error: rpcError } = await supabase
          .rpc('get_email_by_username', { username_input: emailOrUsername.toLowerCase() })

        if (rpcError || !emailData) {
          throw new Error('Username not found')
        }

        // Try to sign in with the found email
        return await supabase.auth.signInWithPassword({ email: emailData, password })

      } catch (error: any) {
        // If RPC doesn't exist or fails, show helpful error
        throw new Error('Invalid username or password. Please try using your email address to sign in.')
      }
    }
  }

  const signOut = async () => {
    return await supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<Profile>): Promise<Profile | null> => {
    if (!user || !profile) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .maybeSingle()

    if (error) throw error

    if (data) {
      setProfile(data)
      return data
    }

    return null
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}