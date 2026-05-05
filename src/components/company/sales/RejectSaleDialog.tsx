'use client'

import { useState } from 'react'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Sale } from '@/schemas/saleSchema'
import { rejectSale } from '@/services/api/sales'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: Sale
  onRejected: (updated: Sale) => void
}

export function RejectSaleDialog({ open, onOpenChange, sale, onRejected }: Props) {
  const [reason, setReason] = useState('')
  const { promiseInProgress: submitting } = usePromiseTracker({
    area: 'rejectingSale',
  })

  function handleOpenChange(value: boolean) {
    if (!value) setReason('')
    onOpenChange(value)
  }

  async function handleSubmit() {
    const trimmed = reason.trim()
    if (!trimmed || !sale.id) return
    const result = await rejectSale(sale.id, trimmed)
    if (result) {
      toast.success('Venda rejeitada.')
      setReason('')
      onOpenChange(false)
      onRejected(result)
    } else {
      toast.error('Erro ao rejeitar venda.')
    }
  }

  const unitLabel =
    sale.unit?.unitName ??
    sale.unit?.property?.name ??
    'esta unidade'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rejeitar venda</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Informe o motivo da rejeição da venda de{' '}
            <span className="text-foreground font-medium">{unitLabel}</span>.
          </p>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reject-reason">
              Motivo da rejeição{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Descreva o motivo pelo qual esta venda está sendo rejeitada…"
              rows={4}
            />
          </div>
        </div>

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
            variant="destructive"
            disabled={!reason.trim() || submitting}
            onClick={handleSubmit}
          >
            {submitting ? 'Rejeitando...' : 'Rejeitar venda'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
