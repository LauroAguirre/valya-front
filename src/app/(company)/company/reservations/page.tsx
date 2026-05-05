'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Toaster } from '@/components/ui/sonner'
import { ApproveReservationDialog } from '@/components/company/reservations/ApproveReservationDialog'
import { Reservation } from '@/schemas/reservationSchema'
import {
  loadPendingReservations,
  rejectReservation,
} from '@/services/api/reservations'
import { useUserProvider } from '@/providers/userProvider'

export default function ReservationsPage() {
  const { currentUser } = useUserProvider()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [approveTarget, setApproveTarget] = useState<Reservation | null>(null)
  const [approveOpen, setApproveOpen] = useState(false)

  const companyId = currentUser?.companyUsers?.[0]?.companyId ?? ''

  useEffect(() => {
    if (!companyId) return
    loadPendingReservations(companyId).then(data => {
      if (data) setReservations(data)
    })
  }, [companyId])

  function handleApproveClick(r: Reservation) {
    setApproveTarget(r)
    setApproveOpen(true)
  }

  function handleApproved(updated: Reservation) {
    setReservations(prev => prev.filter(r => r.id !== updated.id))
  }

  async function handleReject(id: string) {
    const result = await rejectReservation(id)
    if (result) {
      toast.success('Solicitação rejeitada.')
      setReservations(prev => prev.filter(r => r.id !== id))
    } else {
      toast.error('Erro ao rejeitar solicitação.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Reservas</h1>
        <p className="text-muted-foreground text-sm">
          Solicitações de reserva pendentes de aprovação
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">
            Solicitações pendentes ({reservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unidade</TableHead>
                <TableHead>Empreendimento</TableHead>
                <TableHead>Corretor</TableHead>
                <TableHead>Solicitado em</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground py-8 text-center"
                  >
                    Nenhuma solicitação pendente.
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      {r.unit?.unitName ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.unit?.property?.name ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.agent?.name ?? '—'}
                      {r.agent?.email && (
                        <span className="block text-xs opacity-70">
                          {r.agent.email}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {r.createdAt
                        ? format(new Date(r.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })
                        : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-48 truncate text-sm">
                      {r.notes ? (
                        <span title={r.notes}>{r.notes}</span>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Sem obs.
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-600"
                          onClick={() => handleApproveClick(r)}
                          aria-label="Aprovar"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleReject(r.id ?? '')}
                          aria-label="Rejeitar"
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Rejeitar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {approveTarget && (
        <ApproveReservationDialog
          open={approveOpen}
          onOpenChange={setApproveOpen}
          reservation={approveTarget}
          onApproved={handleApproved}
        />
      )}

      <Toaster />
    </div>
  )
}
