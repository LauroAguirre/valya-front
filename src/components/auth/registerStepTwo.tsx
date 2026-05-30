'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { usePromiseTracker } from 'react-promise-tracker'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RowFormFields } from '@/components/generic/rowFormFields'
import { InputMask } from '@/components/inputs/inputMask'
import {
  AgentActivateForm,
  agentActivateSchema,
} from '@/schemas/agentActivateSchema'
import {
  ActivateAgentPayload,
  activateAgentSubscription,
} from '@/services/user/activateAgentSubscription'
import { StepOneData } from './registerStepOne'

const STARTER_FEATURES = [
  'Leads qualificados ilimitados',
  'Múltiplos números de WhatsApp',
  'Cadência avançada (até 7 pontos de contato)',
  'Dashboard completo com pipeline em tempo real',
  'Suporte prioritário dedicado',
]

const onlyDigits = (value?: string) => (value || '').replace(/\D/g, '')

interface RegisterStepTwoProps {
  token: string
  stepOneData: StepOneData
  onSuccess: () => void
  onSessionExpired: () => void
}

export function RegisterStepTwo({
  token,
  stepOneData,
  onSuccess,
  onSessionExpired,
}: RegisterStepTwoProps) {
  const { promiseInProgress: activating } = usePromiseTracker({
    area: 'activateAgent',
    delay: 0,
  })

  const form = useForm<AgentActivateForm>({
    resolver: zodResolver(agentActivateSchema),
    defaultValues: {
      cpfCnpj: stepOneData.cnpj ?? '',
      phone: '',
      postalCode: '',
      address: '',
      addressNumber: '',
      billingType: 'CREDIT_CARD',
      creditCard: {
        holderName: '',
        number: '',
        expiryMonth: '',
        expiryYear: '',
        ccv: '',
      },
    },
  })

  const billingType = form.watch('billingType')
  const isCreditCard = billingType === 'CREDIT_CARD'

  const submit = async (fields: AgentActivateForm) => {
    const cpfCnpj = onlyDigits(fields.cpfCnpj)
    const phone = onlyDigits(fields.phone)
    const postalCode = onlyDigits(fields.postalCode)

    console.log({ cpfCnpj, phone, postalCode })

    const payload: ActivateAgentPayload = {
      cpfCnpj,
      phone: phone || undefined,
      postalCode: postalCode || undefined,
      address: fields.address?.trim() || undefined,
      addressNumber: fields.addressNumber?.trim() || undefined,
      billingType: fields.billingType,
    }

    if (fields.billingType === 'CREDIT_CARD' && fields.creditCard) {
      payload.creditCard = {
        holderName: fields.creditCard.holderName!.trim(),
        number: onlyDigits(fields.creditCard.number),
        expiryMonth: fields.creditCard.expiryMonth!.trim(),
        expiryYear: fields.creditCard.expiryYear!.trim(),
        ccv: fields.creditCard.ccv!.trim(),
      }
      payload.creditCardHolderInfo = {
        name: stepOneData.name,
        email: stepOneData.email,
        cpfCnpj,
        postalCode,
        addressNumber: fields.addressNumber?.trim() || '',
        phone,
      }
    }

    const result = await activateAgentSubscription(payload, token)

    if (result.success) {
      onSuccess()
      return
    }

    if (result.status === 401) {
      toast.error('Sua sessão de cadastro expirou. Refaça o cadastro.')
      onSessionExpired()
      return
    }

    if (result.details?.length) {
      result.details.forEach(({ field, message }) => {
        form.setError(field as keyof AgentActivateForm, { message })
      })
      return
    }

    toast.error(
      result.message ||
        'Não foi possível ativar a assinatura. Tente novamente.',
    )
  }

  const onInvalid = (errors: unknown) => console.error(errors)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit, onInvalid)}
        className="flex flex-col gap-5"
      >
        {/* Resumo do plano Starter */}
        <div className="border-primary/40 bg-primary/5 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Plano Starter
            </span>
            <span className="text-muted-foreground text-xs">
              Assinatura mensal recorrente
            </span>
          </div>
          <ul className="text-foreground/90 mt-3 space-y-2 text-sm">
            {STARTER_FEATURES.map(item => (
              <li key={item} className="flex items-start gap-2">
                <Check
                  className="text-primary mt-0.5 size-4 shrink-0"
                  strokeWidth={3}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-3 text-xs">
            A primeira cobrança é programada para o dia seguinte ao cadastro.
          </p>
        </div>

        {/* Forma de pagamento */}
        <FormField
          control={form.control}
          name="billingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma de pagamento</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="gap-2"
                >
                  <label className="border-input flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm">
                    <RadioGroupItem value="CREDIT_CARD" />
                    <span>
                      <span className="font-medium">Cartão de crédito</span>
                      <span className="text-muted-foreground block text-xs">
                        Cobrança automática recorrente
                      </span>
                    </span>
                  </label>
                  <label className="border-input flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm">
                    <RadioGroupItem value="BOLETO" />
                    <span>
                      <span className="font-medium">Boleto ou PIX</span>
                      <span className="text-muted-foreground block text-xs">
                        Você escolhe a forma a cada fatura
                      </span>
                    </span>
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpfCnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF ou CNPJ do titular</FormLabel>
              <FormControl>
                <InputMask
                  inputMode="numeric"
                  mask={[
                    { mask: '000.000.000-00' },
                    { mask: '00.000.000/0000-00' },
                  ]}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone {isCreditCard ? '' : '(opcional)'}</FormLabel>
              <FormControl>
                <InputMask
                  inputMode="numeric"
                  mask={[
                    { mask: '(00) 0000-0000' },
                    { mask: '(00) 00000-0000' },
                  ]}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <RowFormFields>
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>CEP {isCreditCard ? '' : '(opcional)'}</FormLabel>
                <FormControl>
                  {/* <Input inputMode="numeric" {...field} /> */}
                  <InputMask
                    inputMode="numeric"
                    mask={[{ mask: '00000-000' }]}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressNumber"
            render={({ field }) => (
              <FormItem className="w-28 shrink-0">
                <FormLabel>Nº {isCreditCard ? '' : '(opcional)'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </RowFormFields>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço (opcional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isCreditCard && (
          <div className="border-border flex flex-col gap-4 rounded-xl border p-4">
            <p className="text-sm font-medium">Dados do cartão</p>
            <FormField
              control={form.control}
              name="creditCard.holderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome impresso no cartão</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creditCard.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do cartão</FormLabel>
                  <FormControl>
                    <InputMask
                      inputMode="numeric"
                      mask="0000 0000 0000 0000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <RowFormFields>
              <FormField
                control={form.control}
                name="creditCard.expiryMonth"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Mês (MM)</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        maxLength={2}
                        placeholder="MM"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="creditCard.expiryYear"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Ano (AAAA)</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="AAAA"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="creditCard.ccv"
                render={({ field }) => (
                  <FormItem className="w-24 shrink-0">
                    <FormLabel>CCV</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" maxLength={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </RowFormFields>
          </div>
        )}

        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-1 w-full"
          disabled={activating}
          loading={activating}
        >
          {activating ? 'Processando...' : 'Confirmar assinatura'}
        </Button>
      </form>
    </Form>
  )
}
