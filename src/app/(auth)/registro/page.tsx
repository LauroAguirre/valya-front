'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { UserForm, userSchema } from '@/schemas/userSchema'
import { RowFormFields } from '@/components/generic/rowFormFields'
import { InputPassword } from '@/components/inputs/inputPassword'
import clsx from 'clsx'
import { usePromiseTracker } from 'react-promise-tracker'
import { formatPhone } from '@/services/generic/formatPhone'
import { saveRealStateAgent as saveRealStateAgent } from '@/services/user/saveRealStateAgent'
import { toast } from 'sonner'
import { useUserProvider } from '@/providers/userProvider'
import { InputMask } from '@/components/inputs/inputMask'
import z from 'zod'

export default function RegistroPage() {
  const ctxUser = useUserProvider()
  const form = useForm<
    UserForm & {
      passwordConfirm?: string
      realStateAgent: {
        creci: string
        cnpj: string
      }
    }
  >({
    resolver: zodResolver(
      userSchema.extend({
        passwordConfirm: userSchema.shape.password,
        realStateAgent: z.object({
          creci: z.string().min(1, 'CRECI é obrigatório'),
          cnpj: z.string().optional(),
        }),
      }),
    ),
    defaultValues: {
      name: undefined,
      email: undefined,
      cpf: undefined,
      realStateAgent: {
        creci: undefined,
        cnpj: undefined,
      },
      phone: undefined,
      password: undefined,
      passwordConfirm: undefined,
    },
  })
  const enteredNewPassword = form.watch('password')

  const { promiseInProgress: savingNewAgent } = usePromiseTracker({
    area: 'savingNewAgent',
    delay: 0,
  })

  const passwordRules = useMemo(() => {
    return {
      length: enteredNewPassword && enteredNewPassword.length > 7,
      lowerCase: /[A-Z]/.test(enteredNewPassword),
      upperCase: /[a-z]/.test(enteredNewPassword),
      number: /[0-9]/.test(enteredNewPassword),
      specialCharacter: /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/.test(
        enteredNewPassword,
      ),
    }
  }, [enteredNewPassword])

  const save = async (fields: UserForm) => {
    console.log({ fields })
    const newAgent = await saveRealStateAgent(fields)
    console.log({ newAgent })
    if (newAgent?.id) {
      ctxUser.login(fields.email, fields.password, true)

      toast.success('Cadastro realizado com sucesso.')
    } else {
      toast.error(
        'Falha ao salvar seus dados. Por favor entre em contato com nosso suporte.',
      )
    }
  }

  const onInvalid = (errors: unknown) => console.error(errors)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-card-foreground text-xl">
          Criar sua conta
        </CardTitle>
        <CardDescription>Preencha os dados para comecar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(save, onInvalid)}
            className="flex flex-col gap-4"
          >
            <FormField
              {...form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <InputMask mask={'000.000.000-00'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              {...form.control}
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
              {...form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              {...form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fone/whats</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={e => {
                        const { value } = e.target
                        e.target.value = formatPhone(value)
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <RowFormFields>
              <FormField
                {...form.control}
                name="realStateAgent.creci"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CRECI</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                {...form.control}
                name={'realStateAgent.cnpj'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ (opcional)</FormLabel>
                    <FormControl>
                      <InputMask mask={'00.000.000/0000-00'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </RowFormFields>
            <FormField
              {...form.control}
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
              {...form.control}
              name="passwordConfirm"
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
              <p className="">A senha precisa ter ao menos:</p>
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
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 w-full"
              loading={savingNewAgent}
            >
              {savingNewAgent ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
        </Form>

        {/* <div className="relative my-6">
          <Separator />
          <span className="bg-card text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs">
            ou continue com
          </span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" type="button">
            Google
          </Button>
          <Button variant="outline" className="flex-1" type="button">
            Facebook
          </Button>
        </div> */}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          Ja tem conta?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
