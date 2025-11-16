import { useState, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useAuthStore } from '@/shared/stores'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'

export function LoginPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/login' })
  const { login, isLoading, error, clearError, isAuthenticated, isAdmin } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [localError, setLocalError] = useState<string | null>(null)

  // Redirect if already authenticated and is admin (only once)
  useEffect(() => {
    if (isAuthenticated && isAdmin && !isLoading) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate])

  // Check for error query param
  useEffect(() => {
    if (search.error === 'forbidden') {
      setLocalError('Acesso negado. Apenas administradores podem acessar este painel.')
    }
  }, [search.error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    clearError()

    try {
      await login(formData)
      // Redirect to dashboard after successful login
      navigate({ to: '/dashboard' })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login. Verifique suas credenciais.'
      setLocalError(errorMessage)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear errors when user starts typing
    if (localError || error) {
      setLocalError(null)
      clearError()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Painel Administrativo</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais de administrador
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {(error || localError) && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {error || localError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@olivebeauty.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Apenas administradores autorizados podem acessar este painel
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

