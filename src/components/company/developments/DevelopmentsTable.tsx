'use client'

import { useRouter } from 'next/navigation'
import { Eye, Plus } from 'lucide-react'

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
import { Property, PropertyMode } from '@/schemas/propertySchema'

interface Props {
  developments: Property[]
  onAdd: () => void
}

const modeLabels: Record<PropertyMode, string> = {
  [PropertyMode.SINGLE]: 'Unidade única',
  [PropertyMode.MULTIPLE]: 'Multi-unidades',
}

export function DevelopmentsTable({ developments, onAdd }: Props) {
  const router = useRouter()

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground text-base">
          Empreendimentos ({developments.length})
        </CardTitle>
        <Button
          size="sm"
          onClick={onAdd}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo empreendimento
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Modo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {developments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground py-8 text-center"
                >
                  Nenhum empreendimento cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              developments.map(dev => (
                <TableRow key={dev.id}>
                  <TableCell className="font-medium">
                    {dev.name ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dev.address ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dev.city ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dev.type ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        dev.mode === PropertyMode.MULTIPLE
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {modeLabels[dev.mode ?? PropertyMode.SINGLE]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        router.push(`/company/developments/${dev.id}`)
                      }
                      aria-label="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
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
