'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { toast } from 'sonner'
import { usePromiseTracker } from 'react-promise-tracker'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
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
import { RowFormFields } from '@/components/generic/rowFormFields'
import { InputMask } from '@/components/inputs/inputMask'
import { InputPassword } from '@/components/inputs/inputPassword'
import { BRAZILIAN_STATES } from '@/lib/brazilianStates'
import {
  AgentRegisterForm,
  agentRegisterSchema,
} from '@/schemas/agentRegisterSchema'
import { registerAgent } from '@/services/user/registerAgent'
import { TermsDialog } from './termsDialog'

export type StepOneData = {
  name: string
  email: string
  cnpj?: string
}

interface RegisterStepOneProps {
  onAdvance: (token: string, data: StepOneData, password: string) => void
}

export function RegisterStepOne({ onAdvance }: RegisterStepOneProps) {
  const [termsOpen, setTermsOpen] = useState(false)

  const { promiseInProgress: registering } = usePromiseTracker({
    area: 'registerAgent',
    delay: 0,
  })

  const form = useForm<AgentRegisterForm>({
    resolver: zodResolver(agentRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      creci: '',
      uf: '',
      cnpj: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  const enteredPassword = form.watch('password') || ''
  const acceptedTerms = form.watch('acceptTerms')

  const passwordRules = useMemo(
    () => ({
      length: enteredPassword.length > 7,
      upperCase: /[A-Z]/.test(enteredPassword),
      lowerCase: /[a-z]/.test(enteredPassword),
      number: /[0-9]/.test(enteredPassword),
      specialCharacter: /[^A-Za-z0-9]/.test(enteredPassword),
    }),
    [enteredPassword],
  )

  const submit = async (fields: AgentRegisterForm) => {
    const result = await registerAgent(fields)

    if (result.success) {
      toast.success('Pré-cadastro realizado. Vamos confirmar sua assinatura.')
      onAdvance(
        result.token,
        {
          name: fields.name,
          email: fields.email,
          cnpj: fields.cnpj?.trim() ? fields.cnpj : undefined,
        },
        fields.password,
      )
      return
    }

    if (result.details?.length) {
      result.details.forEach(({ field, message }) => {
        if (field in form.getValues()) {
          form.setError(field as keyof AgentRegisterForm, { message })
        } else {
          toast.error(message)
        }
      })
      return
    }

    toast.error(
      result.message ||
        'Não foi possível concluir o cadastro. Tente novamente.',
    )
  }

  const onInvalid = (errors: unknown) => console.error(errors)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit, onInvalid)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <RowFormFields>
          <FormField
            control={form.control}
            name="creci"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>CRECI</FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    {...field}
                    onChange={e =>
                      field.onChange(e.target.value.replace(/\D/g, ''))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uf"
            render={({ field }) => (
              <FormItem className="w-24 shrink-0">
                <FormLabel>UF</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BRAZILIAN_STATES.map(uf => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </RowFormFields>
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <InputMask mask={'00.000.000/0000-00'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <InputPassword {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmação da senha</FormLabel>
              <FormControl>
                <InputPassword {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div style={{ fontSize: '11px' }}>
          <p>A senha precisa ter ao menos:</p>
          <p
            className={clsx(
              'm-0',
              passwordRules.length ? 'text-green-600' : 'text-red-500',
            )}
          >
            8 caracteres
          </p>
          <p
            className={clsx(
              'm-0',
              passwordRules.upperCase ? 'text-green-600' : 'text-red-500',
            )}
          >
            1 letra maiúscula
          </p>
          <p
            className={clsx(
              'm-0',
              passwordRules.lowerCase ? 'text-green-600' : 'text-red-500',
            )}
          >
            1 letra minúscula
          </p>
          <p
            className={clsx(
              'm-0',
              passwordRules.number ? 'text-green-600' : 'text-red-500',
            )}
          >
            1 número
          </p>
          <p
            className={clsx(
              'm-0',
              passwordRules.specialCharacter
                ? 'text-green-600'
                : 'text-red-500',
            )}
          >
            1 caracter especial
          </p>
        </div>

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                </FormControl>
                <FormLabel className="text-sm leading-snug font-normal">
                  Aceito os{' '}
                  <button
                    type="button"
                    className="text-primary underline underline-offset-2 hover:opacity-80"
                    onClick={e => {
                      e.preventDefault()
                      setTermsOpen(true)
                    }}
                  >
                    termos de uso e políticas
                  </button>{' '}
                  da Valya
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 w-full"
          disabled={!acceptedTerms || registering}
          loading={registering}
        >
          {registering ? 'Enviando...' : 'Continuar'}
        </Button>
      </form>

      <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} />
    </Form>
  )
}
