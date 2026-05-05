'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePromiseTracker } from 'react-promise-tracker'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  propertySchema,
  PropertyForm,
  Property,
  PropertyMode,
  GarageType,
  BbqType,
} from '@/schemas/propertySchema'
import { upsertDevelopment } from '@/services/api/developments'

interface Props {
  development: Property
  onSaved: (updated: Property) => void
}

const garageTypeLabels: Record<GarageType, string> = {
  [GarageType.NONE]: 'Nenhuma',
  [GarageType.COVERED]: 'Coberta',
  [GarageType.UNCOVERED]: 'Descoberta',
  [GarageType.MIXED]: 'Mista',
}

const bbqTypeLabels: Record<BbqType, string> = {
  [BbqType.NONE]: 'Nenhuma',
  [BbqType.COAL]: 'Carvão',
  [BbqType.ELETRIC]: 'Elétrica',
}

export function DevelopmentInfoForm({ development, onSaved }: Props) {
  const { promiseInProgress: saving } = usePromiseTracker({
    area: 'upsertingDevelopment',
  })

  const form = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      id: development.id ?? undefined,
      companyId: development.companyId ?? undefined,
      name: development.name ?? '',
      type: development.type ?? '',
      address: development.address ?? '',
      neighborhood: development.neighborhood ?? '',
      city: development.city ?? '',
      mode: development.mode ?? PropertyMode.MULTIPLE,
      bedrooms: development.bedrooms ?? undefined,
      bathrooms: development.bathrooms ?? undefined,
      garageCount: development.garageCount ?? undefined,
      garageType: development.garageType ?? GarageType.NONE,
      bbqType: development.bbqType ?? BbqType.NONE,
      privateArea: development.privateArea ?? undefined,
      totalPrice: development.totalPrice ?? undefined,
      minDown: development.minDown ?? undefined,
      installments: development.installments ?? undefined,
      annualBoost: development.annualBoost ?? undefined,
      installmentValue: development.installmentValue ?? undefined,
      paymentConditions: development.paymentConditions ?? '',
      paymentOptions: development.paymentOptions ?? '',
      description: development.description ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      id: development.id ?? undefined,
      companyId: development.companyId ?? undefined,
      name: development.name ?? '',
      type: development.type ?? '',
      address: development.address ?? '',
      neighborhood: development.neighborhood ?? '',
      city: development.city ?? '',
      mode: development.mode ?? PropertyMode.MULTIPLE,
      bedrooms: development.bedrooms ?? undefined,
      bathrooms: development.bathrooms ?? undefined,
      garageCount: development.garageCount ?? undefined,
      garageType: development.garageType ?? GarageType.NONE,
      bbqType: development.bbqType ?? BbqType.NONE,
      privateArea: development.privateArea ?? undefined,
      totalPrice: development.totalPrice ?? undefined,
      minDown: development.minDown ?? undefined,
      installments: development.installments ?? undefined,
      annualBoost: development.annualBoost ?? undefined,
      installmentValue: development.installmentValue ?? undefined,
      paymentConditions: development.paymentConditions ?? '',
      paymentOptions: development.paymentOptions ?? '',
      description: development.description ?? '',
    })
  }, [development, form])

  async function onSubmit(data: PropertyForm) {
    const result = await upsertDevelopment(data)
    if (result) {
      toast.success('Empreendimento salvo!')
      onSaved(result)
    } else {
      toast.error('Erro ao salvar empreendimento.')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base">
              Dados gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        placeholder="Apartamento, Casa…"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modo</FormLabel>
                    <Select
                      value={field.value ?? PropertyMode.MULTIPLE}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PropertyMode.MULTIPLE}>
                          Multi-unidades
                        </SelectItem>
                        <SelectItem value={PropertyMode.SINGLE}>
                          Unidade única
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base">
              Características
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
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
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(
                            e.target.value === ''
                              ? null
                              : e.target.valueAsNumber,
                          )
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
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(
                            e.target.value === ''
                              ? null
                              : e.target.valueAsNumber,
                          )
                        }
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
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(
                            e.target.value === ''
                              ? null
                              : e.target.valueAsNumber,
                          )
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
                    <FormLabel>Vagas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(
                            e.target.value === ''
                              ? null
                              : e.target.valueAsNumber,
                          )
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
                    <FormLabel>Tipo de garagem</FormLabel>
                    <Select
                      value={field.value ?? GarageType.NONE}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(GarageType).map(v => (
                          <SelectItem key={v} value={v}>
                            {garageTypeLabels[v]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      value={field.value ?? BbqType.NONE}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(BbqType).map(v => (
                          <SelectItem key={v} value={v}>
                            {bbqTypeLabels[v]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base">
              Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço total (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(
                            e.target.value === ''
                              ? null
                              : e.target.valueAsNumber,
                          )
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
                    <FormLabel>Entrada mínima (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(
                            e.target.value === ''
                              ? null
                              : e.target.valueAsNumber,
                          )
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
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(
                            e.target.value === ''
                              ? null
                              : e.target.valueAsNumber,
                          )
                        }
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
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(
                            e.target.value === ''
                              ? null
                              : e.target.valueAsNumber,
                          )
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
                    <FormLabel>Reajuste anual (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={e =>
                          field.onChange(
                            e.target.value === ''
                              ? null
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condições de pagamento</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
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
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base">
              Descrição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      rows={5}
                      placeholder="Descreva o empreendimento…"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={saving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto sm:self-end"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>
    </Form>
  )
}
