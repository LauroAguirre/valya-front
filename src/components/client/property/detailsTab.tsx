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
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InputNumber } from '@/components/ui/inputNumber'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'

import { InputSelect } from '@/components/inputs/inputSelect'
import { PropertyFields } from '@/app/(client)/properties/[id]/page'
import {
  BbqType,
  GarageType,
  Property,
  PropertyMode,
} from '@/schemas/propertySchema'
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
    className: 'border-red-500/30 bg-red-500/20 text-red-700 dark:text-red-400',
  },
}

type UnitNumberField =
  | 'bedrooms'
  | 'garage'
  | 'privateArea'
  | 'garageArea'
  | 'totalArea'
  | 'downPayment'
  | 'annualBoost'
  | 'installmentValue'

const unitNumberColumns: {
  key: UnitNumberField
  kind: 'int' | 'area' | 'currency'
  placeholder: string
}[] = [
  { key: 'bedrooms', kind: 'int', placeholder: '0' },
  { key: 'garage', kind: 'int', placeholder: '0' },
  { key: 'privateArea', kind: 'area', placeholder: '0' },
  { key: 'garageArea', kind: 'area', placeholder: '0' },
  { key: 'totalArea', kind: 'area', placeholder: '0' },
  { key: 'downPayment', kind: 'currency', placeholder: 'R$ 0' },
  { key: 'annualBoost', kind: 'currency', placeholder: 'R$ 0' },
  { key: 'installmentValue', kind: 'currency', placeholder: 'R$ 0' },
]

function formatExpiry(unit: PropertyUnit): string | null {
  const expiry = unit.activeReservation?.expiresAt
  if (!expiry) return null
  try {
    return format(new Date(expiry as string), 'dd/MM/yyyy')
  } catch {
    return null
  }
}

export const PropertyDetailslTab = ({
  form,
  property,
}: PropertyFinancialTabProps) => {
  const propertyMode = form.watch('mode')
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null)
  const [reserveModalOpen, setReserveModalOpen] = useState(false)

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'units',
  })

  function handleRequestReservation(unit: PropertyUnit) {
    setSelectedUnit(unit)
    setReserveModalOpen(true)
  }

  function handleAddUnit() {
    append({
      unitName: '',
      bedrooms: undefined,
      garage: undefined,
      privateArea: undefined,
      garageArea: undefined,
      totalArea: undefined,
      downPayment: undefined,
      annualBoost: undefined,
      installmentValue: undefined,
      status: PropertyUnitStatus.AVAILABLE,
    })
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
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dormitórios</FormLabel>
                    <FormControl>
                      <InputNumber
                        value={field.value ?? ''}
                        min={1}
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
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banheiros</FormLabel>
                    <FormControl>
                      <InputNumber
                        value={field.value ?? ''}
                        min={1}
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
                name="garageCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garagens (quantidade)</FormLabel>
                    <FormControl>
                      <InputNumber
                        value={field.value ?? ''}
                        min={1}
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
                name="garageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garagens (tipo)</FormLabel>
                    <FormControl>
                      <InputSelect
                        defaultValue={GarageType.NONE}
                        selectChange={field.onChange}
                        selectName={field.name}
                        value={field.value ?? undefined}
                        items={[
                          { label: 'Nenhum', value: GarageType.NONE },
                          { label: 'Coberta', value: GarageType.COVERED },
                          { label: 'Descoberta', value: GarageType.UNCOVERED },
                          { label: 'Mista', value: GarageType.MIXED },
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bbqType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Churrasqueira</FormLabel>
                    <FormControl>
                      <InputSelect
                        defaultValue={BbqType.NONE}
                        selectChange={field.onChange}
                        selectName={field.name}
                        value={field.value ?? undefined}
                        items={[
                          { label: 'Nenhum', value: BbqType.NONE },
                          { label: 'Carvão', value: BbqType.COAL },
                          { label: 'Elétrica', value: BbqType.ELETRIC },
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="privateArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área privativa (m2)</FormLabel>
                    <FormControl>
                      <InputNumber
                        value={field.value ?? ''}
                        min={1}
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
                    {fields.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={12}
                          className="text-muted-foreground text-center"
                        >
                          Nenhuma unidade cadastrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      fields.map((unitField, index) => {
                        const savedUnit = property?.units?.find(
                          u => u.id && u.id === unitField.id,
                        )
                        const status =
                          savedUnit?.status ?? PropertyUnitStatus.AVAILABLE
                        const { label, className } = unitStatusConfig[status]
                        const expiry = savedUnit
                          ? formatExpiry(savedUnit)
                          : null
                        return (
                          <TableRow
                            key={unitField.id || index}
                            className="border-border"
                          >
                            <TableCell className="min-w-32">
                              <FormField
                                control={form.control}
                                name={`units.${index}.unitName`}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    placeholder="Apto 101"
                                  />
                                )}
                              />
                            </TableCell>
                            {unitNumberColumns.map(col => (
                              <TableCell key={col.key} className="min-w-24">
                                <FormField
                                  control={form.control}
                                  name={`units.${index}.${col.key}`}
                                  render={({ field }) => (
                                    <InputNumber
                                      value={field.value ?? ''}
                                      placeholder={col.placeholder}
                                      decimalScale={col.kind === 'int' ? 0 : 2}
                                      fixedDecimalScale={col.kind !== 'int'}
                                      onValueChange={values =>
                                        field.onChange(
                                          values.floatValue ?? undefined,
                                        )
                                      }
                                    />
                                  )}
                                />
                              </TableCell>
                            ))}
                            <TableCell>
                              <Badge variant="outline" className={className}>
                                {label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {expiry ??
                                (status === PropertyUnitStatus.RESERVED
                                  ? 'Aguardando'
                                  : '—')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {savedUnit &&
                                  status === PropertyUnitStatus.AVAILABLE && (
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleRequestReservation(savedUnit)
                                      }
                                    >
                                      Solicitar reserva
                                    </Button>
                                  )}
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() => remove(index)}
                                  aria-label="Remover unidade"
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
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="self-start"
                onClick={handleAddUnit}
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
