'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { usePromiseTracker } from 'react-promise-tracker'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Sale } from '@/schemas/saleSchema'
import { confirmSale } from '@/services/api/sales'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: Sale
  onConfirmed: (updated: Sale) => void
}

function fmtBRL(value: number | null | undefined) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function ConfirmSaleDialog({
  open,
  onOpenChange,
  sale,
  onConfirmed,
}: Props) {
  const [confirmedSale, setConfirmedSale] = useState<Sale | null>(null)
  const { promiseInProgress: confirming } = usePromiseTracker({
    area: 'confirmingSale',
  })

  function handleOpenChange(value: boolean) {
    if (!value) setConfirmedSale(null)
    onOpenChange(value)
  }

  async function handleConfirm() {
    if (!sale.id) return
    const result = await confirmSale(sale.id)
    if (result) {
      setConfirmedSale(result)
      onConfirmed(result)
    } else {
      toast.error('Erro ao confirmar venda.')
    }
  }

  const unitLabel =
    sale.unit?.unitName ??
    sale.unit?.property?.name ??
    'esta unidade'

  if (confirmedSale) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Venda confirmada!
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              A venda de{' '}
              <span className="text-foreground font-medium">{unitLabel}</span>{' '}
              foi registrada com sucesso.
            </p>

            <div className="bg-muted rounded-lg p-4">
              <p className="text-foreground mb-3 text-sm font-semibold">
                Distribuição financeira
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Valor da venda</span>
                  <span className="text-foreground font-medium">
                    {fmtBRL(confirmedSale.saleValue)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Comissão total</span>
                  <span className="text-foreground font-medium">
                    {fmtBRL(confirmedSale.commissionAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Repasse à construtora
                  </span>
                  <span className="text-foreground font-medium">
                    {fmtBRL(confirmedSale.revenueShareAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Repasse ao corretor
                  </span>
                  <span className="font-semibold text-green-600">
                    {fmtBRL(confirmedSale.brokerAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              onClick={() => handleOpenChange(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar venda</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground text-sm">
          Você tem certeza que deseja confirmar a venda de{' '}
          <span className="text-foreground font-medium">{unitLabel}</span>?
          {sale.agent?.name && (
            <>
              {' '}
              O corretor{' '}
              <span className="text-foreground font-medium">
                {sale.agent.name}
              </span>{' '}
              será notificado.
            </>
          )}
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={confirming}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleConfirm}
          >
            {confirming ? 'Confirmando...' : 'Confirmar venda'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
