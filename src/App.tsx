import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { Auth } from './pages/Auth'
import { TodoListPage } from './pages/TodoListPage'
import { Session } from '@supabase/supabase-js'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [isGuestMode, setIsGuestMode] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])
  
  const handleSignOut = () => {
    if (session) {
        supabase.auth.signOut()
    }
    setIsGuestMode(false)
  }

  if (!session && !isGuestMode) {
    return <Auth onEnterAsGuest={() => setIsGuestMode(true)} />
  }

  return <TodoListPage key={session?.user.id || 'guest'} session={session} onSignOut={handleSignOut} />
}

export default App