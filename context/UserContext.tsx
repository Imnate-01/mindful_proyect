'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

interface Profile {
    id: string
    nombre_completo: string | null
    avatar_url: string | null
    email: string | null
}

interface UserContextType {
    user: User | null
    profile: Profile | null
    loading: boolean
    avatarUrl: string | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
                const { data: { session } } = await supabase.auth.getSession()

                if (session?.user) {
                    setUser(session.user)

                    // Fetch profile
                    const { data: profileData, error } = await supabase
                        .from('perfiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single()

                    if (profileData) {
                        setProfile(profileData)
                        setAvatarUrl(profileData.avatar_url)
                    } else {
                        console.log("No profile found or error:", error)
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user)
                // Optionally refetch profile here if needed, or just set user
            } else {
                setUser(null)
                setProfile(null)
                setAvatarUrl(null)
            }
            setLoading(false)
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, profile, loading, avatarUrl }}>
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
