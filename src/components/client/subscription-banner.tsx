'use client'

import { useState } from 'react'
import { AlertTriangle, CreditCard, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserProvider } from '@/providers/userProvider'

interface SubscriptionBannerProps {
  hasCard: boolean
}

export function SubscriptionBanner({ hasCard }: SubscriptionBannerProps) {
  const ctxUser = useUserProvider()
  const { daysToExpire } = ctxUser
  const [dismissed, setDismissed] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  if (dismissed || daysToExpire >= 10 || hasCard) return null

  return (
    <>
      <div className="bg-warning text-warning-foreground flex items-center justify-between gap-4 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">
            Sua assinatura expira em {daysToExpire} dias. Cadastre um cartao
            para continuar usando.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-7 text-xs"
            onClick={() => setSheetOpen(true)}
          >
            <CreditCard className="mr-1.5 h-3 w-3" />
            Cadastrar cartao
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="bg-card">
          <SheetHeader>
            <SheetTitle className="text-card-foreground">
              Cadastrar cartao de credito
            </SheetTitle>
            <SheetDescription>
              Adicione seu cartao para renovar sua assinatura automaticamente.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Nome no cartao</Label>
              <Input
                placeholder="Nome como esta no cartao"
                className="bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Numero do cartao</Label>
              <Input
                placeholder="0000 0000 0000 0000"
                className="bg-secondary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label>Validade</Label>
                <Input placeholder="MM/AA" className="bg-secondary" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>CVV</Label>
                <Input placeholder="123" className="bg-secondary" />
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
              Salvar cartao
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
