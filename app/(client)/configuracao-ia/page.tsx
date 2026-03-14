"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, QrCode, Save } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function ConfiguracaoIAPage() {
  const [prompt, setPrompt] = useState(
    "Você é um assistente de vendas imobiliárias. Seja educado, objetivo e sempre ofereça agendar uma visita. Quando o lead demonstrar interesse, colete nome completo, e-mail e telefone."
  )

  function handleSave() {
    toast.success("Prompt salvo com sucesso!")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuração da IA</h1>
        <p className="text-sm text-muted-foreground">Conecte seu WhatsApp e personalize o comportamento da IA</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
              <QrCode className="h-5 w-5 text-primary" />
              Conexão WhatsApp
            </CardTitle>
            <CardDescription>Escaneie o QR Code abaixo com seu WhatsApp para conectar</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="flex h-52 w-52 items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary">
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-7 w-7 rounded-sm ${
                      [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24].includes(i)
                        ? "bg-foreground"
                        : "bg-secondary"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Abra o WhatsApp no seu celular, va em Dispositivos conectados e escaneie o codigo acima.
            </p>

            <Alert variant="destructive" className="border-[#FF8C00]/30 bg-[#FF8C00]/5 text-foreground [&>svg]:text-[#FF8C00]">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-sm font-semibold">Atenção: Use seu telefone comercial</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                A IA irá acompanhar <strong className="text-foreground">todo o tráfego de mensagens</strong> da conta conectada. Recomendamos fortemente que você utilize um número de telefone exclusivo para uso comercial, e não o seu número pessoal.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base text-card-foreground">Prompt personalizado</CardTitle>
            <CardDescription>
              Defina como a IA deve se comportar ao conversar com seus leads. Este prompt sera integrado ao estilo de atendimento da IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={12}
              className="resize-y bg-secondary text-sm"
              placeholder="Descreva como a IA deve se comportar, o tom de voz, regras de atendimento, informações que deve coletar..."
            />
            <p className="text-xs text-muted-foreground">
              Sem limite de caracteres. Quanto mais detalhado, melhor sera o atendimento da IA.
            </p>
            <Button
              onClick={handleSave}
              className="w-full sm:w-auto sm:self-end"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar prompt
            </Button>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}
