'use client'

// import { useState } from 'react'
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
import { AlertTriangle, QrCode, Save } from 'lucide-react'
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
import { useEffect, useState } from 'react'
import { loadAiConfig } from '@/services/aiConfig/loadAiConfig'
import { getEvolutionConnection } from '@/services/evolution/getEvolutionConnection'
import { EvolutionConfig } from '@/schemas/evolutionConfigSchema'
import { formatPhone } from '@/services/generic/formatPhone'

export default function ConfiguracaoIAPage() {
  const ctxUser = useUserProvider()
  const [evolution, setEvolution] = useState<EvolutionConfig>()
  // const [prompt, setPrompt] = useState(
  //   'Voce e um assistente de vendas imobiliarias. Seja educado, objetivo e sempre ofereca agendar uma visita. Quando o lead demonstrar interesse, colete nome completo, email e telefone.',
  // )
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
    form.setValue('userId', ctxUser.currentUser.id)

    const getConfigs = async () => {
      const configs = await loadAiConfig(ctxUser.currentUser?.id as string)
      console.log({ configs })
      if (configs) {
        form.setValue('customPrompt', configs.customPrompt)
        form.setValue('isActive', configs.isActive)
      }
    }

    const getConnection = async () => {
      const evolutionConn = await getEvolutionConnection(
        ctxUser.currentUser?.id as string,
      )
      console.log({ evolutionConnection: evolutionConn })
      setEvolution(evolutionConn)
    }
    getConfigs()
    getConnection()
  }, [ctxUser])

  // const disconnect = async () =>{

  // }

  const save = async (fields: AiConfigForm) => {
    fields.userId = ctxUser.currentUser?.id
    console.log({ fields })
    // toast.success('Cadastro realizado com sucesso.')
    const newProperty = await saveAiConfig(fields)
    console.log({ newProperty })
    if (newProperty?.id) {
      toast.success('Prompt salvo com sucesso.')
    } else {
      toast.error(
        'Falha ao salvar os dados do imóvel. Por favor entre em contato com nosso suporte.',
      )
    }
  }

  const onInvalid = (errors: unknown) => console.error(errors)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          Configuracao da IA
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
              Conexao WhatsApp
            </CardTitle>
            {evolution?.connected && (
              <div className="flex flex-1 flex-col">
                <span>
                  WhatsApp conectado com o número (48) 99824-5335
                  {formatPhone(evolution?.phone)}.
                </span>
              </div>
            )}
            {!evolution?.connected && (
              <CardDescription>
                Escaneie o QR Code abaixo com seu WhatsApp para conectar
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {!evolution?.connected && (
              <div className="border-border bg-secondary flex h-62 w-62 flex-col items-center justify-center rounded-lg border-2 border-dashed p-2">
                <div>
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-7 w-7 rounded-sm ${
                          [
                            0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23,
                            24,
                          ].includes(i)
                            ? 'bg-foreground'
                            : 'bg-secondary'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 text-center text-xs">
                  Abra o WhatsApp no seu celular, vá em Dispositivos conectados
                  e escaneie o código acima.
                </p>
              </div>
            )}

            <Alert
              variant="destructive"
              className="text-foreground border-[#f59e0b]/30 bg-[#f59e0b]/5 [&>svg]:text-[#f59e0b]"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-sm font-semibold">
                Atencao: Use seu telefone comercial
              </AlertTitle>
              <AlertDescription className="text-muted-foreground flex text-xs">
                <span>
                  A IA ira acompanhar{' '}
                  <strong className="text-foreground">
                    todo o trafego de mensagens
                  </strong>{' '}
                  da conta conectada. Recomendamos fortemente que voce utilize
                  um numero de telefone exclusivo para uso comercial, e nao o
                  seu numero pessoal.
                </span>
              </AlertDescription>
            </Alert>
            <div className="flex flex-1">
              <Button>Desconectar</Button>
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
                      {/* <FormLabel>Parâmetros personalizados</FormLabel> */}
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
                      {/* <FormLabel>IA Ativa</FormLabel> */}
                      {/* <FormControl> */}
                      {/* <Switch {...field} /> */}
                      {/* </FormControl> */}
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
                {/* <p className="text-muted-foreground text-xs">
                  Sem limite de caracteres. Quanto mais detalhado, melhor sera o
                  atendimento da IA.
                </p> */}
                <Button className="w-full sm:w-auto sm:self-end">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar prompt
                </Button>
              </form>
            </Form>
            {/* <Textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={12}
              className="bg-secondary resize-y text-sm"
              placeholder="Descreva como a IA deve se comportar, o tom de voz, regras de atendimento, informacoes que deve coletar..."
            /> */}
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}
