'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Trash2,
  Webhook,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Toaster } from '@/components/ui/sonner'
import { usePromiseTracker } from 'react-promise-tracker'
import { MetaConfig, MetaConfigInput, metaConfigInputSchema } from '@/schemas/metaConfigSchema'
import { getMetaConfig } from '@/services/meta/getMetaConfig'
import { saveMetaConfig } from '@/services/meta/saveMetaConfig'
import { deleteMetaConfig } from '@/services/meta/deleteMetaConfig'

const API_URL = process.env.NEXT_PUBLIC_API_URL!
const WEBHOOK_URL = `${API_URL}/api/webhooks/meta`

function generateVerifyToken(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('')
}

export default function WhatsappMetaPage() {
  const [config, setConfig] = useState<MetaConfig | null | undefined>(undefined)
  const [showToken, setShowToken] = useState(false)

  const { promiseInProgress: isLoading } = usePromiseTracker({ area: 'loadingMetaConfig' })
  const { promiseInProgress: isSaving } = usePromiseTracker({ area: 'savingMetaConfig' })
  const { promiseInProgress: isDeleting } = usePromiseTracker({ area: 'deletingMetaConfig' })

  const form = useForm<MetaConfigInput>({
    resolver: zodResolver(metaConfigInputSchema),
    defaultValues: {
      phoneNumberId: '',
      wabaId: '',
      accessToken: '',
      verifyToken: generateVerifyToken(),
      phone: '',
      displayName: '',
    },
  })

  const verifyToken = form.watch('verifyToken')

  useEffect(() => {
    const load = async () => {
      const result = await getMetaConfig()
      setConfig(result ?? null)
    }
    load()
  }, [])

  const handleSave = async (data: MetaConfigInput) => {
    const result = await saveMetaConfig(data)
    if (result?.id) {
      setConfig(result)
      toast.success('Configuração Meta salva com sucesso.')
    } else {
      toast.error('Falha ao salvar. Verifique os dados e tente novamente.')
    }
  }

  const handleDelete = async () => {
    const ok = await deleteMetaConfig()
    if (ok) {
      setConfig(null)
      form.reset({
        phoneNumberId: '',
        wabaId: '',
        accessToken: '',
        verifyToken: generateVerifyToken(),
        phone: '',
        displayName: '',
      })
      toast.success('Configuração Meta removida.')
    } else {
      toast.error('Falha ao remover. Tente novamente.')
    }
  }

  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    toast.success(`${label} copiado!`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          WhatsApp Business API (Meta)
        </h1>
        <p className="text-muted-foreground text-sm">
          Conecte seu número oficial da Meta para envio e recebimento via API oficial
        </p>
      </div>

      {config === undefined && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando configuração...
        </div>
      )}

      {config !== undefined && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Status / formulário */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2 text-base">
                <Webhook className="text-primary h-5 w-5" />
                Configuração da integração
              </CardTitle>

              {config?.connected ? (
                <div className="flex items-center gap-2">
                  <Badge className="gap-1.5 border-green-500/30 bg-green-500/15 text-green-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Conectado
                  </Badge>
                  {config.phone && (
                    <span className="text-muted-foreground text-sm">{config.phone}</span>
                  )}
                  {config.displayName && (
                    <span className="text-muted-foreground text-sm">— {config.displayName}</span>
                  )}
                </div>
              ) : config !== null ? (
                <CardDescription>Configurado — aguardando validação da Meta</CardDescription>
              ) : (
                <CardDescription>Preencha os dados abaixo para conectar seu número oficial</CardDescription>
              )}
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {/* Configuração existente: exibe resumo + botão de remover */}
              {config !== null ? (
                <div className="flex flex-col gap-3">
                  <div className="border-border rounded-lg border p-4 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone Number ID</span>
                      <span className="text-foreground font-mono">{config.phoneNumberId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">WABA ID</span>
                      <span className="text-foreground font-mono">{config.wabaId}</span>
                    </div>
                    {config.displayName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nome</span>
                        <span className="text-foreground">{config.displayName}</span>
                      </div>
                    )}
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full" disabled={isDeleting}>
                        {isDeleting ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Removendo...</>
                        ) : (
                          <><Trash2 className="mr-2 h-4 w-4" />Desconectar integração</>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover integração Meta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Isso removerá as credenciais salvas. Mensagens em andamento via Meta serão interrompidas. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                /* Formulário de configuração */
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSave)}
                    className="flex flex-col gap-4"
                  >
                    <FormField
                      control={form.control}
                      name="phoneNumberId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID do Número de Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789012345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="wabaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID da Conta WhatsApp Business</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789012345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accessToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Token de Acesso</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showToken ? 'text' : 'password'}
                                placeholder="EAAxxxxxxxxxxxxxxxx..."
                                className="pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowToken(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="verifyToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Token de Verificação do Webhook</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input className="font-mono text-xs" {...field} />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => form.setValue('verifyToken', generateVerifyToken())}
                                title="Gerar novo token"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => copyToClipboard(verifyToken, 'Token de verificação')}
                                title="Copiar token"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
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
                          <FormLabel>Número de telefone (exibição)</FormLabel>
                          <FormControl>
                            <Input placeholder="+55 11 99999-9999" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da conta</FormLabel>
                          <FormControl>
                            <Input placeholder="Imobiliária Exemplo" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isSaving || isLoading}>
                      {isSaving ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                      ) : (
                        'Salvar configuração'
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          {/* Instruções */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground text-base">
                Como obter as credenciais
              </CardTitle>
              <CardDescription>
                Siga os passos abaixo no painel de desenvolvedores da Meta
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {/* URL do Webhook */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">URL do Webhook</p>
                <div className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2">
                  <code className="flex-1 break-all font-mono text-xs">{WEBHOOK_URL}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => copyToClipboard(WEBHOOK_URL, 'URL do webhook')}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  Cole esta URL e o Token de Verificação gerado acima no painel da Meta ao configurar o webhook.
                </p>
              </div>

              {/* Passo a passo */}
              <ol className="flex flex-col gap-3">
                {[
                  <>Acesse <strong>developers.facebook.com</strong> e faça login com sua conta Meta Business.</>,
                  <>Crie um novo App (tipo <strong>Business</strong>) e adicione o produto <strong>WhatsApp</strong>.</>,
                  <>Em <strong>Configuração da API</strong>, copie o <strong>Phone Number ID</strong> e o <strong>WhatsApp Business Account ID (WABA ID)</strong>.</>,
                  <>Gere um <strong>Access Token permanente</strong> via <em>System User</em> no Business Manager (Configurações &rsaquo; Usuários do sistema).</>,
                  <>Em <strong>Webhooks</strong>, adicione a URL acima e cole o Token de Verificação gerado. Inscreva-se no campo <code>messages</code>.</>,
                  <>Cole os dados no formulário ao lado e salve.</>,
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-foreground leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>

              <Alert className="border-[#f59e0b]/30 bg-[#f59e0b]/5 text-foreground [&>svg]:text-[#f59e0b]">
                <AlertTitle className="text-sm font-semibold">Importante</AlertTitle>
                <AlertDescription className="text-muted-foreground text-xs">
                  O token de sistema (<em>System User Token</em>) não expira. Tokens gerados temporariamente nas configurações da API expiram em 24 h. Use o token permanente para garantir o funcionamento contínuo.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}

      <Toaster />
    </div>
  )
}
