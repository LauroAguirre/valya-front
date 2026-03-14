import { Bot, Zap, BarChart3, MessageSquare } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const benefits = [
  {
    icon: Bot,
    title: "Qualificacao com IA",
    description:
      "Nossa IA conversa com seus leads no WhatsApp, qualifica automaticamente e identifica os que estao prontos para comprar.",
  },
  {
    icon: Zap,
    title: "Cadencia Automatica",
    description:
      "Sequencias de mensagens personalizadas que mantem seus leads engajados ate o momento ideal de contato.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Integrado",
    description:
      "Conecte seu WhatsApp em minutos. A IA responde 24/7, agenda visitas e encaminha leads quentes para voce.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Inteligente",
    description:
      "Acompanhe metricas de conversao, pipeline de vendas e performance da IA em tempo real.",
  },
]

export function Benefits() {
  return (
    <section id="recursos" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Tudo que voce precisa para vender mais
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Ferramentas poderosas que trabalham por voce enquanto voce foca no que importa: fechar negocios.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              className="border-border bg-card transition-colors hover:border-primary/30"
            >
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base text-card-foreground">{benefit.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {benefit.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
