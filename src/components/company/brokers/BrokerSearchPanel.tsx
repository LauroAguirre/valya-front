'use client'

import { Search, UserPlus, Loader2 } from 'lucide-react'
import { usePromiseTracker } from 'react-promise-tracker'

import { Input } from '@/components/ui/input'
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

interface Props {
  query: string
  onQueryChange: (q: string) => void
  results: RealStateAgent[]
  poolIds: Set<string>
  onAdd: (agent: RealStateAgent) => void
}

export function BrokerSearchPanel({
  query,
  onQueryChange,
  results,
  poolIds,
  onAdd,
}: Props) {
  const { promiseInProgress: searching } = usePromiseTracker({
    area: 'searchingBrokers',
    delay: 0,
  })
  const { promiseInProgress: assigning } = usePromiseTracker({
    area: 'assigningBroker',
    delay: 0,
  })

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground text-base">
          Buscar corretores
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative">
          {searching ? (
            <Loader2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 animate-spin" />
          ) : (
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          )}
          <Input
            placeholder="Buscar por nome, CRECI ou CNPJ..."
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            className="bg-secondary pl-10"
          />
        </div>

        {query.length >= 2 && (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Nome</TableHead>
                <TableHead className="text-muted-foreground">CRECI</TableHead>
                <TableHead className="text-muted-foreground">CNPJ</TableHead>
                <TableHead className="text-muted-foreground text-right">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 && !searching ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground py-6 text-center"
                  >
                    Nenhum corretor encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                results.map(agent => {
                  const inPool = poolIds.has(agent.id ?? '')
                  return (
                    <TableRow
                      key={agent.id}
                      className="border-border hover:bg-secondary/50"
                    >
                      <TableCell className="font-medium">
                        {agent.user?.name ?? '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {agent.creci ?? '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {agent.cnpj ?? '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          disabled={inPool || assigning}
                          onClick={() => onAdd(agent)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          {inPool ? 'No pool' : 'Adicionar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
