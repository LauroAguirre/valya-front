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
import { Textarea } from '@/components/ui/textarea'
import {
  propertySchema,
  PropertyForm,
  Property,
  PropertyMode,
} from '@/schemas/propertySchema'
import { upsertDevelopment } from '@/services/api/developments'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  onSuccess: (dev: Property) => void
}

export function DevelopmentFormModal({
  open,
  onOpenChange,
  companyId,
  onSuccess,
}: Props) {
  const { promiseInProgress: saving } = usePromiseTracker({
    area: 'upsertingDevelopment',
  })

  const form = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      companyId,
      name: '',
      address: '',
      neighborhood: '',
      city: '',
      type: '',
      mode: PropertyMode.MULTIPLE,
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        companyId,
        name: '',
        address: '',
        neighborhood: '',
        city: '',
        type: '',
        mode: PropertyMode.MULTIPLE,
        description: '',
      })
    }
  }, [open, companyId, form])

  async function onSubmit(data: PropertyForm) {
    const result = await upsertDevelopment(data)
    if (result) {
      toast.success('Empreendimento criado!')
      onSuccess(result)
      onOpenChange(false)
    } else {
      toast.error('Erro ao criar empreendimento.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo empreendimento</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="development-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nome do empreendimento</FormLabel>
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        rows={3}
                      />
                    </FormControl>
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
            form="development-form"
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? 'Criando...' : 'Criar empreendimento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
