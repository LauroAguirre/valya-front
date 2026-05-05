'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
import { ConfirmSaleDialog } from '@/components/company/sales/ConfirmSaleDialog'
import { RejectSaleDialog } from '@/components/company/sales/RejectSaleDialog'
import { Sale } from '@/schemas/saleSchema'
import { loadContractSigningSales } from '@/services/api/sales'
import { useUserProvider } from '@/providers/userProvider'

function fmtBRL(value: number | null | undefined) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function SalesPage() {
  const { currentUser } = useUserProvider()
  const [sales, setSales] = useState<Sale[]>([])
  const [confirmTarget, setConfirmTarget] = useState<Sale | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<Sale | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)

  const companyId = currentUser?.companyUsers?.[0]?.companyId ?? ''

  useEffect(() => {
    if (!companyId) return
    loadContractSigningSales(companyId).then(data => {
      if (data) setSales(data)
    })
  }, [companyId])

  function handleConfirmClick(sale: Sale) {
    setConfirmTarget(sale)
    setConfirmOpen(true)
  }

  function handleRejectClick(sale: Sale) {
    setRejectTarget(sale)
    setRejectOpen(true)
  }

  function handleConfirmed(updated: Sale) {
    setSales(prev => prev.filter(s => s.id !== updated.id))
  }

  function handleRejected(updated: Sale) {
    setSales(prev => prev.filter(s => s.id !== updated.id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          Pipeline de Vendas
        </h1>
        <p className="text-muted-foreground text-sm">
          Contratos em assinatura aguardando confirmação ou rejeição
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">
            Em assinatura de contrato ({sales.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unidade</TableHead>
                <TableHead>Empreendimento</TableHead>
                <TableHead>Corretor</TableHead>
                <TableHead>Valor da venda</TableHead>
                <TableHead>Entrada em contrato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground py-8 text-center"
                  >
                    Nenhum contrato em andamento.
                  </TableCell>
                </TableRow>
              ) : (
                sales.map(sale => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">
                      {sale.unit?.unitName ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sale.unit?.property?.name ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sale.agent?.name ?? '—'}
                      {sale.agent?.email && (
                        <span className="block text-xs opacity-70">
                          {sale.agent.email}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      {fmtBRL(sale.saleValue)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {sale.signedAt
                        ? format(
                            new Date(sale.signedAt as unknown as string),
                            "dd/MM/yyyy",
                            { locale: ptBR },
                          )
                        : sale.createdAt
                          ? format(
                              new Date(sale.createdAt as unknown as string),
                              "dd/MM/yyyy",
                              { locale: ptBR },
                            )
                          : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-600"
                          onClick={() => handleConfirmClick(sale)}
                          aria-label="Confirmar venda"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRejectClick(sale)}
                          aria-label="Rejeitar venda"
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

      {confirmTarget && (
        <ConfirmSaleDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          sale={confirmTarget}
          onConfirmed={handleConfirmed}
        />
      )}

      {rejectTarget && (
        <RejectSaleDialog
          open={rejectOpen}
          onOpenChange={setRejectOpen}
          sale={rejectTarget}
          onRejected={handleRejected}
        />
      )}

      <Toaster />
    </div>
  )
}
