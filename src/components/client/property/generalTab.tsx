import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'

import { Card, CardContent } from '../../ui/card'
import { PropertyFields } from '@/app/(client)/imoveis/[id]/page'
import { BbqType, GarageType } from '@/schemas/propertySchema'
import { InputNumber } from '../../ui/inputNumber'
import { InputSelect } from '../../inputs/inputSelect'
import { Textarea } from '../../ui/textarea'
import { Input } from '@/components/ui/input'

interface PropertyGeneralTabProps {
  form: UseFormReturn<PropertyFields>
}

export const PropertyGeneralTab = ({ form }: PropertyGeneralTabProps) => {
  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do empreendimento</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-2 sm:col-span-2">
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
          </div>
          <div className="flex flex-col gap-2">
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
          </div>
          <div className="flex flex-col gap-2">
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
          </div>
          <div className="flex flex-col gap-2">
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
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição geral do imóvel</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
