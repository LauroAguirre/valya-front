'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatCurrency } from '@/lib/mock-data'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InputNumber } from '@/components/ui/inputNumber'
import { Plus } from 'lucide-react'

import { PropertyFields } from '@/app/(client)/properties/[id]/page'
import { Property, PropertyMode } from '@/schemas/propertySchema'
import { PropertyUnit, PropertyUnitStatus } from '@/schemas/propertyUnitSchema'
import { RequestReservationModal } from './RequestReservationModal'

interface PropertyFinancialTabProps {
  form: UseFormReturn<PropertyFields>
  property?: Property
}

const unitStatusConfig: Record<
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

function formatExpiry(unit: PropertyUnit): string | null {
  const expiry = unit.activeReservation?.expiresAt
  if (!expiry) return null
  try {
    return format(new Date(expiry as string), 'dd/MM/yyyy')
  } catch {
    return null
  }
}

export const PropertyFinancialTab = ({
  form,
  property,
}: PropertyFinancialTabProps) => {
  const propertyMode = form.watch('mode')
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null)
  const [reserveModalOpen, setReserveModalOpen] = useState(false)

  function handleRequestReservation(unit: PropertyUnit) {
    setSelectedUnit(unit)
    setReserveModalOpen(true)
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">
            Tipo de empreendimento
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value ?? PropertyMode.SINGLE}
                    onValueChange={field.onChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={PropertyMode.SINGLE} id="unica" />
                      <Label htmlFor="unica" className="cursor-pointer">
                        Unidade unica
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value={PropertyMode.MULTIPLE}
                        id="multipla"
                      />
                      <Label htmlFor="multipla" className="cursor-pointer">
                        Multiplas unidades
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {propertyMode !== PropertyMode.MULTIPLE ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor total</FormLabel>
                    <FormControl>
                      <InputNumber
                        value={field.value ?? ''}
                        placeholder="R$ 0"
                        onValueChange={values =>
                          field.onChange(values.floatValue ?? undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minDown"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entrada minima</FormLabel>
                    <FormControl>
                      <InputNumber
                        value={field.value ?? ''}
                        placeholder="R$ 0 (opcional)"
                        onValueChange={values =>
                          field.onChange(values.floatValue ?? undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="installments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcelas</FormLabel>
                    <FormControl>
                      <InputNumber
                        value={field.value ?? ''}
                        placeholder="Qtd de parcelas (opcional)"
                        decimalScale={0}
                        fixedDecimalScale={false}
                        onValueChange={values =>
                          field.onChange(values.floatValue ?? undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="annualBoost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reforco anual</FormLabel>
                    <FormControl>
                      <InputNumber
                        value={field.value ?? ''}
                        placeholder="R$ 0 (opcional)"
                        onValueChange={values =>
                          field.onChange(values.floatValue ?? undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="border-border overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">
                        Unidade/Apto
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Dorms
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Garagem
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Area Priv.
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Area Gar.
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Area Total
                      </TableHead>
                      <TableHead className="text-muted-foreground text-right">
                        Entrada
                      </TableHead>
                      <TableHead className="text-muted-foreground text-right">
                        Reforco Anual
                      </TableHead>
                      <TableHead className="text-muted-foreground text-right">
                        Vlr Parcela
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Expira em
                      </TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {property?.units?.map(unit => {
                      const status = unit.status ?? PropertyUnitStatus.AVAILABLE
                      const { label, className } = unitStatusConfig[status]
                      const expiry = formatExpiry(unit)
                      return (
                        <TableRow key={unit.id} className="border-border">
                          <TableCell className="text-foreground font-medium">
                            {unit.unitName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {unit.bedrooms}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {unit.garage}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {unit.privateArea}m2
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {unit.garageArea}m2
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {unit.totalArea}m2
                          </TableCell>
                          <TableCell className="text-foreground text-right">
                            {unit.downPayment
                              ? formatCurrency(unit.downPayment)
                              : '-'}
                          </TableCell>
                          <TableCell className="text-foreground text-right">
                            {unit.annualBoost
                              ? formatCurrency(unit.annualBoost)
                              : '-'}
                          </TableCell>
                          <TableCell className="text-foreground text-right">
                            {unit.installmentValue
                              ? formatCurrency(unit.installmentValue)
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={className}
                            >
                              {label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {expiry ?? (
                              status === PropertyUnitStatus.RESERVED
                                ? 'Aguardando'
                                : '—'
                            )}
                          </TableCell>
                          <TableCell>
                            {status === PropertyUnitStatus.AVAILABLE && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleRequestReservation(unit)
                                }
                              >
                                Solicitar reserva
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    }) ?? (
                      <TableRow>
                        <TableCell
                          colSpan={12}
                          className="text-muted-foreground text-center"
                        >
                          Nenhuma unidade cadastrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar unidade
              </Button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="paymentConditions"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Condições para pagamento</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      className="resize-none"
                      rows={3}
                      placeholder="Descreva as condicoes de pagamento..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentOptions"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Opções de pagamento</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      className="resize-none"
                      rows={3}
                      placeholder="Descreva as opcoes de pagamento aceitas..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {selectedUnit && (
        <RequestReservationModal
          open={reserveModalOpen}
          onOpenChange={setReserveModalOpen}
          unit={selectedUnit}
        />
      )}
    </>
  )
}
