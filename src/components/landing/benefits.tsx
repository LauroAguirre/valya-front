import { Bot, Zap, BarChart3, MessageSquare } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

const benefits = [
  {
    icon: Bot,
    title: 'Qualificação com IA',
    description:
      'Nossa IA conversa com seus leads no WhatsApp, qualifica automaticamente e identifica os que estão prontos para comprar.',
  },
  {
    icon: Zap,
    title: 'Cadência Automática',
    description:
      'Sequências de mensagens personalizadas que mantêm seus leads engajados até o momento ideal de contato.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Integrado',
    description:
      'Conecte seu WhatsApp em minutos. A IA responde 24/7, agenda visitas e encaminha leads quentes para você.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Inteligente',
    description:
      'Acompanhe métricas de conversão, pipeline de vendas e performance da IA em tempo real.',
  },
]

export function Benefits() {
  return (
    <section id="recursos" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Tudo que você precisa para vender mais
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty">
            Ferramentas poderosas que trabalham por você enquanto você foca no
            que importa: fechar negócios.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(benefit => (
            <Card
              key={benefit.title}
              className="border-border bg-card hover:border-primary/30 transition-colors"
            >
              <CardHeader>
                <div className="bg-primary/10 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <benefit.icon className="text-primary h-5 w-5" />
                </div>
                <CardTitle className="text-card-foreground text-base">
                  {benefit.title}
                </CardTitle>
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
