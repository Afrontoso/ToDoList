import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    }
    setLoading(false)
  }
  
  const handleSignUp = async () => {
    setError(null)
    if (!email || !password) {
      setError("Por favor, preencha o e-mail e a senha para se cadastrar.")
      return
    }
    
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta.')
    }
    setLoading(false)
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }
  
  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'github' })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Bem-vindo!</CardTitle>
          <CardDescription>Faça login ou cadastre-se para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Carregando...' : 'Login'}
            </Button>
          </form>
          
          <Button variant="secondary" className="w-full mt-2" onClick={handleSignUp} disabled={loading}>
            Cadastrar
          </Button>

          {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={signInWithGoogle} disabled={loading}>
              Google
            </Button>
            <Button variant="outline" onClick={signInWithGitHub} disabled={loading}>
              GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}