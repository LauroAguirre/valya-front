'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
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
import {
  PropertyUnit,
  PropertyUnitStatus,
} from '@/schemas/propertyUnitSchema'
import { deleteDevelopmentUnit } from '@/services/api/developments'

interface Props {
  propertyId: string
  units: PropertyUnit[]
  onAdd: () => void
  onEdit: (unit: PropertyUnit) => void
  onRemoved: (unitId: string) => void
}

const statusConfig: Record<
  PropertyUnitStatus,
  { label: string; className: string }
> = {
  [PropertyUnitStatus.AVAILABLE]: {
    label: 'Disponível',
    className:
      'border-green-500/30 bg-green-500/20 text-green-700 dark:text-green-400',
  },
  [PropertyUnitStatus.RESERVED]: {
    label: 'Reservado',
    className:
      'border-amber-500/30 bg-amber-500/20 text-amber-700 dark:text-amber-400',
  },
  [PropertyUnitStatus.CONTRACT_SIGNING]: {
    label: 'Contrato',
    className:
      'border-blue-500/30 bg-blue-500/20 text-blue-700 dark:text-blue-400',
  },
  [PropertyUnitStatus.SOLD]: {
    label: 'Vendido',
    className:
      'border-red-500/30 bg-red-500/20 text-red-700 dark:text-red-400',
  },
}

function fmt(value: number | null | undefined, prefix = '') {
  if (value == null) return '—'
  return `${prefix}${value.toLocaleString('pt-BR')}`
}

export function UnitsTable({
  propertyId,
  units,
  onAdd,
  onEdit,
  onRemoved,
}: Props) {
  async function handleDelete(unitId: string) {
    const ok = await deleteDevelopmentUnit(propertyId, unitId)
    if (ok) {
      toast.success('Unidade removida.')
      onRemoved(unitId)
    } else {
      toast.error('Erro ao remover unidade.')
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground text-base">
          Unidades ({units.length})
        </CardTitle>
        <Button
          size="sm"
          onClick={onAdd}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova unidade
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unidade</TableHead>
              <TableHead>Quartos</TableHead>
              <TableHead>Vagas</TableHead>
              <TableHead>Área priv. (m²)</TableHead>
              <TableHead>Área total (m²)</TableHead>
              <TableHead>Entrada (R$)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-muted-foreground py-8 text-center"
                >
                  Nenhuma unidade cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              units.map(unit => {
                const status =
                  unit.status ?? PropertyUnitStatus.AVAILABLE
                const { label, className } = statusConfig[status]
                return (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">
                      {unit.unitName ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {unit.bedrooms ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {unit.garage ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fmt(unit.privateArea)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fmt(unit.totalArea)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fmt(unit.downPayment, 'R$ ')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={className}>
                        {label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(unit)}
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(unit.id ?? '')}
                          aria-label="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
