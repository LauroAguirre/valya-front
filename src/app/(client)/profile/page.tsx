'use client'

import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Camera, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { profileSchema, ProfileForm } from '@/schemas/profileSchema'
import { useUserProvider } from '@/providers/userProvider'

export default function PerfilPage() {
  const { currentUser } = useUserProvider()

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      creci: '',
      agency: '',
      bio: '',
    },
  })

  useEffect(() => {
    if (!currentUser) return
    form.reset({
      name: currentUser.name ?? '',
      email: currentUser.email ?? '',
      phone: currentUser.phone ?? '',
      creci: currentUser.realStateAgent?.creci ?? '',
      agency: '',
      bio: '',
    })
  }, [currentUser, form])

  const name = form.watch('name')
  const email = form.watch('email')

  const initials = name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .join('')

  const memberSince = useMemo(() => {
    console.log({ currentUser })
    return currentUser?.createdAt
      ? new Date(currentUser.createdAt).toLocaleDateString('pt-BR')
      : 'Sem data'
  }, [currentUser])

  function handleSave(data: ProfileForm) {
    console.log(data)
    toast.success('Perfil atualizado com sucesso!')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie suas informações pessoais e comerciais
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="grid gap-6 lg:grid-cols-3"
        >
          <Card className="border-border bg-card lg:col-span-1">
            <CardContent className="flex flex-col items-center gap-4 pt-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="border-border bg-card text-muted-foreground hover:text-foreground absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center">
                <p className="text-foreground font-semibold">{name}</p>
                <p className="text-muted-foreground text-sm">{email}</p>
              </div>
              <Separator />
              <div className="w-full text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">CRECI</span>
                  <span className="text-foreground">
                    {form.watch('creci') ?? ''}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Membro desde</span>
                  <span className="text-foreground">{memberSince}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground text-base">
                  Dados pessoais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
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
                        <FormLabel>Telefone</FormLabel>
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
                  Dados comerciais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="creci"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CRECI</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="agency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imobiliária</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ''}
                            rows={4}
                            placeholder="Conte um pouco sobre você e sua experiência..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto sm:self-end"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar alterações
            </Button>
          </div>
        </form>
      </Form>

      <Toaster />
    </div>
  )
}
