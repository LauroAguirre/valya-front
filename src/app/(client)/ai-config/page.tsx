'use client'

import { useEffect, useRef, useState } from 'react'
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
  Loader2,
  QrCode,
  Save,
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

const API_URL = process.env.NEXT_PUBLIC_API_URL!

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

export default function AiConfigsPage() {
  const ctxUser = useUserProvider()
  const socketRef = useRef<Socket | null>(null)

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

  const form = useForm<AiConfigForm>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: {
      userId: undefined,
      customPrompt:
        'Voce e um assistente de vendas imobiliarias. Seja educado, objetivo e sempre ofereca agendar uma visita. Quando o lead demonstrar interesse, colete nome completo, email e telefone.',
    },
  })

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
      console.log({ data })
      setQrCode(data.qrcode.base64)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [ctxUser.currentUser?.id])

  useEffect(() => {
    if (!ctxUser.currentUser) return

    form.setValue('userId', ctxUser.currentUser.id)

    const getConfigs = async () => {
      const configs = await loadAiConfig(ctxUser.currentUser?.id as string)
      if (configs) {
        form.setValue('customPrompt', configs.customPrompt)
        form.setValue('isActive', configs.isActive)
      }
    }

    const getConnection = async () => {
      const conn = await getEvolutionConnection(
        ctxUser.currentUser?.id as string,
      )
      setEvolution(conn ?? null)
    }

    getConfigs()
    getConnection()
  }, [ctxUser])

  const handleActivateIntegration = async () => {
    const result = await createEvolutionInstance()
    console.log({ result })
    if (!result) {
      toast.error('Falha ao ativar a integração. Por favor, tente novamente.')
      return
    }
    setEvolution(result)
    // QR Code will arrive via socket 'wppCommunication' event (type: 'qrCode')
  }

  const handleGenerateQrCode = async () => {
    const result = await getEvolutionQrCode()
    if (!result) {
      toast.error('Falha ao gerar QR Code. Por favor, tente novamente.')
    }
    // QR Code will arrive via socket 'wppCommunication' event (type: 'qrCode')
  }

  const save = async (fields: AiConfigForm) => {
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

  const onInvalid = (errors: unknown) => console.error(errors)

  const connState = getConnectionState(evolution)
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

      <div className="grid gap-6 lg:grid-cols-2">
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
                  da conta conectada. Recomendamos fortemente que você utilize
                  um número de telefone exclusivo para uso comercial, e não o
                  seu número pessoal.
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
                    Se der erro na primeira tentativa, aguarde alguns segundos
                    até que o QR Code da tela seja atualizado e tente novamente.
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
              Defina como a IA deve se comportar ao conversar com seus leads.
              Este prompt sera integrado ao estilo de atendimento da IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(save, onInvalid)}
                className="flex flex-col gap-4"
              >
                <FormField
                  {...form.control}
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
                  {...form.control}
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
                  {...form.control}
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

      <Toaster />
    </div>
  )
}
