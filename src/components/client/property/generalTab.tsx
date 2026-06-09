import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'

import { Card, CardContent } from '../../ui/card'
import { PropertyFields } from '@/app/(client)/properties/[id]/page'
import { Textarea } from '../../ui/textarea'
import { Input } from '@/components/ui/input'

interface PropertyGeneralTabProps {
  form: UseFormReturn<PropertyFields>
}

export const PropertyGeneralTab = ({ form }: PropertyGeneralTabProps) => {
  const propertyId = form.watch('id')
  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {(!propertyId || propertyId.length < 2) && (
            <div className="flex rounded-md border border-amber-600 bg-amber-400/40 px-4 py-1 text-sm text-orange-500 sm:col-span-2">
              <span>
                Salve os dados do imóvel para habilitar as outras abas.
              </span>
            </div>
          )}
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
