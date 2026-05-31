'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { parseCookies } from 'nookies'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  QrCode,
  RefreshCw,
  Save,
  Trash2,
  Webhook,
  Wifi,
} from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { AiConfigForm, aiConfigSchema } from '@/schemas/aiConfigSchema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserProvider } from '@/providers/userProvider'
import { saveAiConfig } from '@/services/aiConfig/saveAiConfig'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { usePromiseTracker } from 'react-promise-tracker'
import { loadAiConfig } from '@/services/aiConfig/loadAiConfig'
import { getEvolutionConnection } from '@/services/evolution/getEvolutionConnection'
import { createEvolutionInstance } from '@/services/evolution/createEvolutionInstance'
import { getEvolutionQrCode } from '@/services/evolution/getEvolutionQrCode'
import { EvolutionConfig } from '@/schemas/evolutionConfigSchema'
import { formatPhone } from '@/services/generic/formatPhone'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  MetaConfig,
  MetaConfigInput,
  metaConfigInputSchema,
} from '@/schemas/metaConfigSchema'
import { getMetaConfig } from '@/services/meta/getMetaConfig'
import { saveMetaConfig } from '@/services/meta/saveMetaConfig'
import { deleteMetaConfig } from '@/services/meta/deleteMetaConfig'

const API_URL = process.env.NEXT_PUBLIC_API_URL!
const WEBHOOK_URL = `${API_URL}/api/webhooks/meta`

type ConnectionState =
  | 'loading'
  | 'none'
  | 'inactive'
  | 'transitional'
  | 'active'

function getConnectionState(
  evolution: EvolutionConfig | null | undefined,
): ConnectionState {
  if (evolution === undefined) return 'loading'
  if (evolution === null) return 'none'
  const { status, connected } = evolution
  if (!status) return connected ? 'active' : 'inactive'
  if (status === 'OPEN' || status === 'CONNECTED') return 'active'
  if (status === 'CONNECTING') return 'transitional'
  return 'inactive'
}

function generateVerifyToken(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('')
}

export default function AiConfigsPage() {
  const ctxUser = useUserProvider()
  const socketRef = useRef<Socket | null>(null)

  // Evolution state
  const [evolution, setEvolution] = useState<
    EvolutionConfig | null | undefined
  >(undefined)
  const [qrCode, setQrCode] = useState<string | null>(null)

  const { promiseInProgress: isCreatingInstance } = usePromiseTracker({
    area: 'creatingEvolutionInstance',
  })
  const { promiseInProgress: isGeneratingQrCode } = usePromiseTracker({
    area: 'loadingEvolutionQrCode',
  })

  const aiForm = useForm<AiConfigForm>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: {
      userId: undefined,
      customPrompt:
        'Voce e um assistente de vendas imobiliarias. Seja educado, objetivo e sempre ofereca agendar uma visita. Quando o lead demonstrar interesse, colete nome completo, email e telefone.',
    },
  })

  // Meta state
  const [metaConfig, setMetaConfig] = useState<MetaConfig | null | undefined>(
    undefined,
  )
  const [showToken, setShowToken] = useState(false)

  const { promiseInProgress: isMetaLoading } = usePromiseTracker({
    area: 'loadingMetaConfig',
  })
  const { promiseInProgress: isMetaSaving } = usePromiseTracker({
    area: 'savingMetaConfig',
  })
  const { promiseInProgress: isMetaDeleting } = usePromiseTracker({
    area: 'deletingMetaConfig',
  })

  const metaForm = useForm<MetaConfigInput>({
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

  const verifyToken = metaForm.watch('verifyToken')

  // Evolution socket
  useEffect(() => {
    if (!ctxUser.currentUser) return
    const { 'valya-auth': token } = parseCookies()
    const socket = io(API_URL, { auth: { token } })
    socketRef.current = socket

    socket.on(
      'connection_update',
      (data: { status: string; connected: boolean }) => {
        setEvolution(
          prev =>
            ({
              ...(prev ?? {}),
              status: data.status,
              connected: data.connected,
            }) as EvolutionConfig,
        )
        if (data.connected) {
          setQrCode(null)
        }
      },
    )

    socket.on('logout_instance', () => {
      setEvolution(null)
    })

    socket.on('qrCode', (data: { qrcode: { base64: string } }) => {
      setQrCode(data.qrcode.base64)
    })

    socket.on('qr_code_v2', (data: { qrcode: { base64: string } }) => {
      setQrCode(data.qrcode.base64)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [ctxUser.currentUser?.id])

  // Load Evolution + AI config
  useEffect(() => {
    if (!ctxUser.currentUser) return

    aiForm.setValue('userId', ctxUser.currentUser.id)

    const getConfigs = async () => {
      const configs = await loadAiConfig(ctxUser.currentUser?.id as string)
      if (configs) {
        aiForm.setValue('customPrompt', configs.customPrompt)
        aiForm.setValue('isActive', configs.isActive)
      }
    }

    const getConnection = async () => {
      const conn = await getEvolutionConnection(
        ctxUser.currentUser?.id as string,
      )
      console.log({ conn })
      setEvolution(conn ?? null)
    }

    getConfigs()
    getConnection()
  }, [ctxUser])

  // Load Meta config
  useEffect(() => {
    const load = async () => {
      const result = await getMetaConfig()
      setMetaConfig(result ?? null)
    }
    load()
  }, [])

  const handleActivateIntegration = async () => {
    const result = await createEvolutionInstance()
    console.log({ result })
    if (!result) {
      toast.error('Falha ao ativar a integração. Por favor, tente novamente.')
      return
    }
    setEvolution(result)
  }

  const handleGenerateQrCode = async () => {
    const result = await getEvolutionQrCode()
    if (!result) {
      toast.error('Falha ao gerar QR Code. Por favor, tente novamente.')
    }
  }

  const saveAi = async (fields: AiConfigForm) => {
    fields.userId = ctxUser.currentUser?.id
    const newConfig = await saveAiConfig(fields)
    if (newConfig?.id) {
      toast.success('Prompt salvo com sucesso.')
    } else {
      toast.error(
        'Falha ao salvar os dados. Por favor entre em contato com nosso suporte.',
      )
    }
  }

  const handleMetaSave = async (data: MetaConfigInput) => {
    const result = await saveMetaConfig(data)
    if (result?.id) {
      setMetaConfig(result)
      toast.success('Configuração Meta salva com sucesso.')
    } else {
      toast.error('Falha ao salvar. Verifique os dados e tente novamente.')
    }
  }

  const handleMetaDelete = async () => {
    const ok = await deleteMetaConfig()
    if (ok) {
      setMetaConfig(null)
      metaForm.reset({
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

  const onInvalid = (errors: unknown) => console.error(errors)

  const connState = useMemo(() => {
    const status = getConnectionState(evolution)
    return status
  }, [evolution])

  const isQrVisible = !!qrCode
  const isActionDisabled = isCreatingInstance || isGeneratingQrCode

  const qrCodeSrc = qrCode
    ? qrCode.startsWith('data:')
      ? qrCode
      : `data:image/png;base64,${qrCode}`
    : null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          Configuração da IA
        </h1>
        <p className="text-muted-foreground text-sm">
          Conecte seu WhatsApp e personalize o comportamento da IA
        </p>
      </div>

      <Tabs defaultValue="evolution">
        <TabsList>
          <TabsTrigger value="evolution">API Whatsapp</TabsTrigger>
          {/* <TabsTrigger value="meta">API Oficial Meta</TabsTrigger> */}
        </TabsList>

        {/* ── Aba Evolution ───────────────────────────────────────── */}
        <TabsContent value="evolution">
          <div className="grid gap-6 pt-4 lg:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2 text-base">
                  <QrCode className="text-primary h-5 w-5" />
                  Conexão WhatsApp
                </CardTitle>

                {connState === 'loading' && (
                  <CardDescription className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Carregando...
                  </CardDescription>
                )}

                {connState === 'none' && (
                  <CardDescription>
                    Ative a integração para conectar seu WhatsApp
                  </CardDescription>
                )}

                {connState === 'transitional' && !isQrVisible && (
                  <CardDescription className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Conectando...
                  </CardDescription>
                )}

                {connState === 'inactive' && !isQrVisible && (
                  <CardDescription>
                    Escaneie o QR Code abaixo com seu WhatsApp para conectar
                  </CardDescription>
                )}

                {isQrVisible && (
                  <CardDescription className="flex items-center gap-2">
                    {connState === 'transitional' ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Sincronizando...
                      </>
                    ) : (
                      'Escaneie o QR Code com seu WhatsApp para conectar'
                    )}
                  </CardDescription>
                )}

                {connState === 'active' && (
                  <div className="flex items-center gap-2">
                    <Badge className="gap-1.5 border-green-500/30 bg-green-500/15 text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Conectado
                    </Badge>
                    {evolution?.phone && (
                      <span className="text-muted-foreground text-sm">
                        {formatPhone(evolution.phone)}
                      </span>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex flex-col items-center gap-4">
                {isQrVisible && qrCodeSrc && (
                  <div className="border-border bg-secondary flex h-64 w-64 items-center justify-center rounded-lg border-2 p-2">
                    <img
                      src={qrCodeSrc}
                      alt="QR Code WhatsApp"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}

                {connState === 'active' && evolution?.instanceName && (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span>Instância: {evolution.instanceName}</span>
                  </div>
                )}

                <Alert
                  variant="destructive"
                  className="text-foreground border-[#f59e0b]/30 bg-[#f59e0b]/5 [&>svg]:text-[#f59e0b]"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="text-sm font-semibold">
                    Atenção: Use seu telefone comercial
                  </AlertTitle>
                  <AlertDescription className="text-muted-foreground flex text-xs">
                    <span>
                      A IA irá acompanhar{' '}
                      <strong className="text-foreground">
                        todo o tráfego de mensagens
                      </strong>{' '}
                      da conta conectada. Recomendamos fortemente que você
                      utilize um número de telefone exclusivo para uso
                      comercial, e não o seu número pessoal.
                    </span>
                  </AlertDescription>
                </Alert>

                <div className="flex w-full flex-col gap-2">
                  {connState === 'none' && (
                    <Button
                      onClick={handleActivateIntegration}
                      disabled={isActionDisabled}
                      className="w-full"
                    >
                      {isCreatingInstance ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Ativando integração...
                        </>
                      ) : (
                        'Ativar Integração'
                      )}
                    </Button>
                  )}

                  {(connState === 'inactive' || connState === 'transitional') &&
                    !isQrVisible && (
                      <Button
                        onClick={handleGenerateQrCode}
                        disabled={isActionDisabled}
                        className="w-full"
                      >
                        {isGeneratingQrCode ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Gerando QR Code...
                          </>
                        ) : (
                          <>
                            <QrCode className="mr-2 h-4 w-4" />
                            Gerar QR Code
                          </>
                        )}
                      </Button>
                    )}

                  {isQrVisible && (
                    <>
                      <p className="text-muted-foreground text-center text-xs">
                        Abra o WhatsApp no seu celular, vá em Dispositivos
                        conectados e escaneie o código acima.
                      </p>
                      <p className="text-muted-foreground text-center text-xs">
                        Se der erro na primeira tentativa, aguarde alguns
                        segundos até que o QR Code da tela seja atualizado e
                        tente novamente.
                      </p>
                    </>
                  )}

                  {connState === 'active' && (
                    <Button variant="outline" className="w-full">
                      Desconectar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground text-base">
                  Configuração da sua IA
                </CardTitle>
                <CardDescription>
                  Defina como a IA deve se comportar ao conversar com seus
                  leads. Este prompt sera integrado ao estilo de atendimento da
                  IA.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Form {...aiForm}>
                  <form
                    onSubmit={aiForm.handleSubmit(saveAi, onInvalid)}
                    className="flex flex-col gap-4"
                  >
                    <FormField
                      {...aiForm.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem hidden>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      {...aiForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch
                              onCheckedChange={field.onChange}
                              defaultChecked={field.value}
                              checked={field.value}
                              {...field}
                            />
                          </FormControl>
                          <FormLabel className="h-full cursor-pointer">
                            IA Ativa
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      {...aiForm.control}
                      name="customPrompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parâmetros personalizados</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className="w-full sm:w-auto sm:self-end">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar prompt
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Aba API Oficial Meta ─────────────────────────────────── */}
        <TabsContent value="meta">
          {metaConfig === undefined ? (
            <div className="text-muted-foreground flex items-center gap-2 pt-4 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando configuração...
            </div>
          ) : (
            <div className="grid gap-6 pt-4 lg:grid-cols-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2 text-base">
                    <Webhook className="text-primary h-5 w-5" />
                    Configuração da integração
                  </CardTitle>

                  {metaConfig?.connected ? (
                    <div className="flex items-center gap-2">
                      <Badge className="gap-1.5 border-green-500/30 bg-green-500/15 text-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Conectado
                      </Badge>
                      {metaConfig.phone && (
                        <span className="text-muted-foreground text-sm">
                          {metaConfig.phone}
                        </span>
                      )}
                      {metaConfig.displayName && (
                        <span className="text-muted-foreground text-sm">
                          — {metaConfig.displayName}
                        </span>
                      )}
                    </div>
                  ) : metaConfig !== null ? (
                    <CardDescription>
                      Configurado — aguardando validação da Meta
                    </CardDescription>
                  ) : (
                    <CardDescription>
                      Preencha os dados abaixo para conectar seu número oficial
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  {metaConfig !== null ? (
                    <div className="flex flex-col gap-3">
                      <div className="border-border flex flex-col gap-2 rounded-lg border p-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Phone Number ID
                          </span>
                          <span className="text-foreground font-mono">
                            {metaConfig.phoneNumberId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">WABA ID</span>
                          <span className="text-foreground font-mono">
                            {metaConfig.wabaId}
                          </span>
                        </div>
                        {metaConfig.displayName && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nome</span>
                            <span className="text-foreground">
                              {metaConfig.displayName}
                            </span>
                          </div>
                        )}
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            disabled={isMetaDeleting}
                          >
                            {isMetaDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Removendo...
                              </>
                            ) : (
                              <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Desconectar integração
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remover integração Meta?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Isso removerá as credenciais salvas. Mensagens em
                              andamento via Meta serão interrompidas. Esta ação
                              não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleMetaDelete}>
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ) : (
                    <Form {...metaForm}>
                      <form
                        onSubmit={metaForm.handleSubmit(handleMetaSave)}
                        className="flex flex-col gap-4"
                      >
                        <FormField
                          control={metaForm.control}
                          name="phoneNumberId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID do Número de Telefone</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123456789012345"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={metaForm.control}
                          name="wabaId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                ID da Conta WhatsApp Business
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123456789012345"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={metaForm.control}
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
                                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                  >
                                    {showToken ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={metaForm.control}
                          name="verifyToken"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Token de Verificação do Webhook
                              </FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input
                                    className="font-mono text-xs"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      metaForm.setValue(
                                        'verifyToken',
                                        generateVerifyToken(),
                                      )
                                    }
                                    title="Gerar novo token"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      copyToClipboard(
                                        verifyToken,
                                        'Token de verificação',
                                      )
                                    }
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
                          control={metaForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Número de telefone (exibição)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+55 11 99999-9999"
                                  {...field}
                                  value={field.value ?? ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={metaForm.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome da conta</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Imobiliária Exemplo"
                                  {...field}
                                  value={field.value ?? ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isMetaSaving || isMetaLoading}
                        >
                          {isMetaSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            'Salvar configuração'
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>

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
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">URL do Webhook</p>
                    <div className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2">
                      <code className="flex-1 font-mono text-xs break-all">
                        {WEBHOOK_URL}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() =>
                          copyToClipboard(WEBHOOK_URL, 'URL do webhook')
                        }
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Cole esta URL e o Token de Verificação gerado acima no
                      painel da Meta ao configurar o webhook.
                    </p>
                  </div>

                  <ol className="flex flex-col gap-3">
                    {[
                      <>
                        Acesse <strong>developers.facebook.com</strong> e faça
                        login com sua conta Meta Business.
                      </>,
                      <>
                        Crie um novo App (tipo <strong>Business</strong>) e
                        adicione o produto <strong>WhatsApp</strong>.
                      </>,
                      <>
                        Em <strong>Configuração da API</strong>, copie o{' '}
                        <strong>Phone Number ID</strong> e o{' '}
                        <strong>WhatsApp Business Account ID (WABA ID)</strong>.
                      </>,
                      <>
                        Gere um <strong>Access Token permanente</strong> via{' '}
                        <em>System User</em> no Business Manager (Configurações
                        &rsaquo; Usuários do sistema).
                      </>,
                      <>
                        Em <strong>Webhooks</strong>, adicione a URL acima e
                        cole o Token de Verificação gerado. Inscreva-se no campo{' '}
                        <code>messages</code>.
                      </>,
                      <>Cole os dados no formulário ao lado e salve.</>,
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                          {i + 1}
                        </span>
                        <span className="text-foreground leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <Alert className="text-foreground border-[#f59e0b]/30 bg-[#f59e0b]/5 [&>svg]:text-[#f59e0b]">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-sm font-semibold">
                      Importante
                    </AlertTitle>
                    <AlertDescription className="text-muted-foreground text-xs">
                      O token de sistema (<em>System User Token</em>) não
                      expira. Tokens gerados temporariamente nas configurações
                      da API expiram em 24 h. Use o token permanente para
                      garantir o funcionamento contínuo.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}
