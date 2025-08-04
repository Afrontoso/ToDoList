import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { Auth } from './pages/Auth'
import { TodoListPage } from './pages/TodoListPage'
import { Session } from '@supabase/supabase-js'

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div>
      {!session ? <Auth /> : <TodoListPage key={session.user.id} session={session} />}
    </div>
  )
}

export default App