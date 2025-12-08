'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

interface Profile {
    id?: string
    id_usuario?: string
    nombre_completo: string | null
    avatar_url: string | null
    email?: string | null
}

interface UserContextType {
    user: User | null
    profile: Profile | null
    loading: boolean
    avatarUrl: string | null
    refreshProfile: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    const fetchUserData = useCallback(async () => {
        try {
            // Don't set loading to true here to avoid UI flickering on background refresh
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.user) {
                setUser(session.user)

                // Fetch profile from 'perfiles_usuario'
                const { data: profileData, error } = await supabase
                    .from('perfiles_usuario')
                    .select('*')
                    .eq('id_usuario', session.user.id)
                    .single()

                if (profileData) {
                    setProfile(profileData)
                    setAvatarUrl(profileData.avatar_url)
                } else {
                    console.log("No profile found in perfiles_usuario or error:", error)
                    // Profile might not exist yet, treat as null or partial
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUserData()

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user)
                fetchUserData()
            } else {
                setUser(null)
                setProfile(null)
                setAvatarUrl(null)
                setLoading(false)
            }
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [fetchUserData])

    const refreshProfile = async () => {
        await fetchUserData()
    }

    return (
        <UserContext.Provider value={{ user, profile, loading, avatarUrl, refreshProfile }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
