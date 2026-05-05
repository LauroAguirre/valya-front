'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { usePromiseTracker } from 'react-promise-tracker'

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
  constructionCompanySchema,
  ConstructionCompanyForm,
  ConstructionCompany,
} from '@/schemas/constructionCompanySchema'
import { upsertCompanyProfile } from '@/services/api/company'

interface Props {
  company: ConstructionCompany | undefined
}

export function CompanySettingsForm({ company }: Props) {
  const { promiseInProgress: saving } = usePromiseTracker({
    area: 'upsertingCompanyProfile',
  })

  const form = useForm<ConstructionCompanyForm>({
    resolver: zodResolver(constructionCompanySchema),
    defaultValues: {
      responsibleName: '',
      customPrompt: '',
      commissionRate: undefined,
      monthlyFee: undefined,
      isActive: true,
    },
  })

  useEffect(() => {
    if (!company) return
    form.reset({
      id: company.id ?? undefined,
      userId: company.userId ?? undefined,
      responsibleName: company.responsibleName ?? '',
      customPrompt: company.customPrompt ?? '',
      commissionRate: company.commissionRate ?? undefined,
      monthlyFee: company.monthlyFee ?? undefined,
      isActive: company.isActive,
    })
  }, [company, form])

  async function onSubmit(data: ConstructionCompanyForm) {
    const result = await upsertCompanyProfile(data)
    if (result) {
      toast.success('Configurações salvas com sucesso!')
    } else {
      toast.error('Erro ao salvar configurações.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground text-base">
              Dados da construtora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="responsibleName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nome do responsável</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de comissão (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        max={100}
                        {...field}
                        value={field.value ?? ''}
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensalidade (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                      />
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
              Configuração de IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="customPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt personalizado</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      rows={5}
                      placeholder="Descreva o perfil da empresa, empreendimentos e diferenciais para a IA..."
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
