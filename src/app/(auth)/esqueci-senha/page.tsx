'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { ArrowLeft, Check } from 'lucide-react'

type Step = 'email' | 'code' | 'password'

export default function EsqueciSenhaPage() {
  const [step, setStep] = useState<Step>('email')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('code')
    }, 800)
  }

  function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('password')
    }, 800)
  }

  function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      window.location.href = '/login'
    }, 800)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-card-foreground text-xl">
          {step === 'email' && 'Recuperar senha'}
          {step === 'code' && 'Verificar codigo'}
          {step === 'password' && 'Nova senha'}
        </CardTitle>
        <CardDescription>
          {step === 'email' &&
            'Insira seu email para receber o codigo de verificacao'}
          {step === 'code' && `Enviamos um codigo de 6 digitos para ${email}`}
          {step === 'password' && 'Defina sua nova senha'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-secondary"
              />
            </div>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar codigo'}
            </Button>
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft className="h-3 w-3" />
              Voltar para login
            </Link>
          </form>
        )}

        {step === 'code' && (
          <form
            onSubmit={handleVerifyCode}
            className="flex flex-col items-center gap-6"
          >
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Verificar codigo'}
            </Button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Reenviar codigo
            </button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
              <Check className="text-primary h-6 w-6" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="********"
                required
                className="bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                required
                className="bg-secondary"
              />
            </div>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              disabled={loading}
            >
              {loading ? 'Redefinindo...' : 'Redefinir senha'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
