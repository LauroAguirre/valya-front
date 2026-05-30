'use client'

import { useState } from 'react'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useUserProvider } from '@/providers/userProvider'
import { RegisterStepOne, StepOneData } from './registerStepOne'
import { RegisterStepTwo } from './registerStepTwo'

type WizardStep = 'form' | 'payment'

export function RegisterWizard() {
  const ctxUser = useUserProvider()
  const [step, setStep] = useState<WizardStep>('form')
  const [token, setToken] = useState<string | null>(null)
  const [stepOneData, setStepOneData] = useState<StepOneData | null>(null)
  const [password, setPassword] = useState('')
  const [finishing, setFinishing] = useState(false)

  const handleStepOneAdvance = (
    jwt: string,
    data: StepOneData,
    pwd: string,
  ) => {
    setToken(jwt)
    setStepOneData(data)
    setPassword(pwd)
    setStep('payment')
  }

  // Assinatura criada com sucesso: autentica o corretor automaticamente
  // (o login redireciona para o dashboard em caso de sucesso).
  const handleSubscriptionCreated = async () => {
    if (!stepOneData) return
    setFinishing(true)
    await ctxUser.login(stepOneData.email, password, true)
    setFinishing(false)
  }

  const handleSessionExpired = () => {
    setToken(null)
    setStepOneData(null)
    setPassword('')
    setStep('form')
  }

  if (finishing) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center gap-3 py-12">
          <Spinner className="text-primary size-8" />
          <p className="text-muted-foreground text-sm">Entrando...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Etapa {step === 'form' ? 1 : 2} de 2
        </p>
        <CardTitle className="text-card-foreground text-xl">
          {step === 'form' ? 'Criar sua conta' : 'Confirmar assinatura'}
        </CardTitle>
        <CardDescription>
          {step === 'form'
            ? 'Preencha os dados e aceite os termos para continuar'
            : 'Revise o plano Starter e informe os dados de pagamento'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'form' && (
          <RegisterStepOne onAdvance={handleStepOneAdvance} />
        )}
        {step === 'payment' && token && stepOneData && (
          <RegisterStepTwo
            token={token}
            stepOneData={stepOneData}
            onSuccess={handleSubscriptionCreated}
            onSessionExpired={handleSessionExpired}
          />
        )}
      </CardContent>
      {step === 'form' && (
        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-sm">
            Já tem conta?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  )
}
