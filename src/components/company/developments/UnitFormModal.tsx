'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  propertyUnitSchema,
  PropertyUnitForm,
  PropertyUnit,
  PropertyUnitStatus,
} from '@/schemas/propertyUnitSchema'
import { upsertDevelopmentUnit } from '@/services/api/developments'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  propertyId: string
  editingUnit: PropertyUnit | null
  onSuccess: (unit: PropertyUnit) => void
}

const statusLabels: Record<PropertyUnitStatus, string> = {
  [PropertyUnitStatus.AVAILABLE]: 'Disponível',
  [PropertyUnitStatus.RESERVED]: 'Reservado',
  [PropertyUnitStatus.CONTRACT_SIGNING]: 'Assinando contrato',
  [PropertyUnitStatus.SOLD]: 'Vendido',
}

function numericField(
  field: { value: number | null | undefined; onChange: (v: number | null) => void },
) {
  return {
    value: field.value ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      field.onChange(e.target.value === '' ? null : e.target.valueAsNumber),
  }
}

export function UnitFormModal({
  open,
  onOpenChange,
  propertyId,
  editingUnit,
  onSuccess,
}: Props) {
  const { promiseInProgress: saving } = usePromiseTracker({
    area: 'upsertingDevelopmentUnit',
  })

  const isEditing = !!editingUnit

  const form = useForm<PropertyUnitForm>({
    resolver: zodResolver(propertyUnitSchema),
    defaultValues: {
      propertyId,
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
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        editingUnit
          ? {
              id: editingUnit.id ?? undefined,
              propertyId,
              unitName: editingUnit.unitName ?? '',
              bedrooms: editingUnit.bedrooms ?? undefined,
              garage: editingUnit.garage ?? undefined,
              privateArea: editingUnit.privateArea ?? undefined,
              garageArea: editingUnit.garageArea ?? undefined,
              totalArea: editingUnit.totalArea ?? undefined,
              downPayment: editingUnit.downPayment ?? undefined,
              annualBoost: editingUnit.annualBoost ?? undefined,
              installmentValue: editingUnit.installmentValue ?? undefined,
              status: editingUnit.status ?? PropertyUnitStatus.AVAILABLE,
            }
          : {
              propertyId,
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
            },
      )
    }
  }, [open, editingUnit, propertyId, form])

  async function onSubmit(data: PropertyUnitForm) {
    const result = await upsertDevelopmentUnit(propertyId, data)
    if (result) {
      toast.success(isEditing ? 'Unidade atualizada!' : 'Unidade adicionada!')
      onSuccess(result)
      onOpenChange(false)
    } else {
      toast.error('Erro ao salvar unidade.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar unidade' : 'Nova unidade'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="unit-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="unitName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Identificação da unidade</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        placeholder="Ex: Apto 101, Torre A…"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        {...numericField(field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vagas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        {...numericField(field)}
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
                    <FormLabel>Área privativa (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        {...numericField(field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garageArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área garagem (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        {...numericField(field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área total (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        {...numericField(field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="downPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entrada (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        {...numericField(field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="installmentValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da parcela (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        {...numericField(field)}
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
                    <FormLabel>Reajuste anual (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        {...numericField(field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={field.value ?? PropertyUnitStatus.AVAILABLE}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PropertyUnitStatus).map(v => (
                          <SelectItem key={v} value={v}>
                            {statusLabels[v]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="unit-form"
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? 'Salvando...' : isEditing ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
