'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export function useRequireAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function check() {
      const { data, error } = await supabase.auth.getUser()

      if (cancelled) return

      if (error || !data.user) {
        router.replace('/login')
      } else {
        setUser(data.user)
      }

      setLoading(false)
    }

    check()

    return () => {
      cancelled = true
    }
  }, [router])

  return { user, loading }
}