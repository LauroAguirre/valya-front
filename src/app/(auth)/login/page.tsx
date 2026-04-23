'use client'

import Link from 'next/link'
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
import z from 'zod'
import { useUserProvider } from '@/providers/userProvider'
import { usePromiseTracker } from 'react-promise-tracker'
import { InputPassword } from '@/components/inputs/inputPassword'

export default function LoginPage() {
  const ctxUser = useUserProvider()
  const { promiseInProgress: authenticating } = usePromiseTracker({
    area: 'authenticating',
    delay: 0,
  })
  const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
  })

  type LoginForm = z.infer<typeof loginSchema>

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: undefined,
      password: undefined,
    },
  })

  const login = async (fields: LoginForm) => {
    ctxUser.login(fields.email, fields.password, true)
  }

  const onInvalid = (errors: unknown) => console.error(errors)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-card-foreground text-xl">
          Entrar na sua conta
        </CardTitle>
        <CardDescription>Use seu email e senha para acessar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(login, onInvalid)}
            className="flex flex-col gap-4"
          >
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Senha</FormLabel>
                    <Link
                      href="/esqueci-senha"
                      className="text-primary text-xs hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <FormControl>
                    <InputPassword {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 w-full"
              loading={authenticating}
            >
              {authenticating ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          Nao tem conta?{' '}
          <Link href="/registro" className="text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
