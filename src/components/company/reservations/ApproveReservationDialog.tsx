'use client'

import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { usePromiseTracker } from 'react-promise-tracker'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Reservation } from '@/schemas/reservationSchema'
import { approveReservation } from '@/services/api/reservations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  reservation: Reservation
  onApproved: (updated: Reservation) => void
}

export function ApproveReservationDialog({
  open,
  onOpenChange,
  reservation,
  onApproved,
}: Props) {
  const [range, setRange] = useState<DateRange | undefined>()
  const { promiseInProgress: approving } = usePromiseTracker({
    area: 'approvingReservation',
  })

  const canConfirm = !!range?.from && !!range?.to && !approving

  async function handleConfirm() {
    if (!range?.from || !range?.to || !reservation.id) return
    const result = await approveReservation(reservation.id, {
      reservedAt: range.from,
      expiresAt: range.to,
    })
    if (result) {
      toast.success('Reserva aprovada!')
      setRange(undefined)
      onOpenChange(false)
      onApproved(result)
    } else {
      toast.error('Erro ao aprovar reserva.')
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) setRange(undefined)
    onOpenChange(value)
  }

  const unitLabel =
    reservation.unit?.unitName ??
    reservation.unit?.property?.name ??
    'esta unidade'
  const brokerLabel = reservation.agent?.name ?? 'o corretor'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Definir período de reserva</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Selecione o período de reserva de{' '}
            <span className="text-foreground font-medium">{unitLabel}</span>{' '}
            para <span className="text-foreground font-medium">{brokerLabel}</span>.
          </p>

          {reservation.notes && (
            <div className="bg-muted rounded-md px-3 py-2 text-sm">
              <span className="text-muted-foreground">Observação: </span>
              {reservation.notes}
            </div>
          )}

          <div className="flex justify-center">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              disabled={{ before: new Date() }}
              locale={ptBR}
            />
          </div>

          {range?.from && range?.to && (
            <p className="text-muted-foreground text-center text-sm">
              De{' '}
              <span className="text-foreground font-medium">
                {format(range.from, "dd 'de' MMMM", { locale: ptBR })}
              </span>{' '}
              até{' '}
              <span className="text-foreground font-medium">
                {format(range.to, "dd 'de' MMMM", { locale: ptBR })}
              </span>
            </p>
          )}
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
            disabled={!canConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleConfirm}
          >
            {approving ? 'Aprovando...' : 'Confirmar reserva'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
