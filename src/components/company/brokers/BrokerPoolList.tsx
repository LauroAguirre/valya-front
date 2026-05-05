'use client'

import { UserMinus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'
import { removeBrokerFromPool } from '@/services/brokers/assignBrokerToPool'

interface Props {
  companyId: string
  brokers: RealStateAgent[]
  onRemoved: (agentId: string) => void
}

export function BrokerPoolList({ companyId, brokers, onRemoved }: Props) {
  async function handleRemove(agentId: string) {
    const ok = await removeBrokerFromPool(companyId, agentId)
    if (ok) {
      toast.success('Corretor removido do pool.')
      onRemoved(agentId)
    } else {
      toast.error('Erro ao remover corretor.')
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground text-base">
          Pool de corretores ({brokers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Nome</TableHead>
              <TableHead className="text-muted-foreground">E-mail</TableHead>
              <TableHead className="text-muted-foreground">CRECI</TableHead>
              <TableHead className="text-muted-foreground text-right">
                Ação
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brokers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground py-8 text-center"
                >
                  Nenhum corretor no pool. Use a busca acima para adicionar.
                </TableCell>
              </TableRow>
            ) : (
              brokers.map(agent => (
                <TableRow
                  key={agent.id}
                  className="border-border hover:bg-secondary/50"
                >
                  <TableCell className="font-medium">
                    {agent.user?.name ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {agent.user?.email ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {agent.creci ?? '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemove(agent.id ?? '')}
                      aria-label="Remover do pool"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
