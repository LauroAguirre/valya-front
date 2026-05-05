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
import { PropertyUnit } from '@/schemas/propertyUnitSchema'
import { requestReservation } from '@/services/api/reservations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: PropertyUnit
  onSuccess?: () => void
}

export function RequestReservationModal({
  open,
  onOpenChange,
  unit,
  onSuccess,
}: Props) {
  const [notes, setNotes] = useState('')
  const { promiseInProgress: submitting } = usePromiseTracker({
    area: 'requestingReservation',
  })

  async function handleSubmit() {
    if (!unit.id) return
    const result = await requestReservation(unit.id, notes.trim() || undefined)
    if (result) {
      toast.success('Solicitação de reserva enviada!')
      setNotes('')
      onOpenChange(false)
      onSuccess?.()
    } else {
      toast.error('Erro ao solicitar reserva.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar reserva</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Você está solicitando a reserva de{' '}
            <span className="text-foreground font-medium">
              {unit.unitName ?? 'esta unidade'}
            </span>
            . A construtora analisará e definirá o período de reserva.
          </p>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Informe qualquer detalhe relevante para a solicitação…"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={submitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSubmit}
          >
            {submitting ? 'Enviando...' : 'Solicitar reserva'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
