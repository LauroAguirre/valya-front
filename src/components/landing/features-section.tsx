import { BarChart3, Bot, Check, MessageCircle, Repeat } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  highlight: string
}

const features: Feature[] = [
  {
    icon: Bot,
    title: 'Qualificação com IA',
    description:
      'Nossa IA conversa com seus leads no WhatsApp, qualifica automaticamente e identifica os que estão prontos para comprar.',
    highlight: 'Resposta em menos de 30 segundos',
  },
  {
    icon: Repeat,
    title: 'Cadência Automática',
    description:
      'Sequências de mensagens personalizadas que mantêm seus leads engajados. Sem esquecer nenhum follow-up.',
    highlight: 'Até 7 pontos de contato',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Integrado',
    description:
      'Conecte seu WhatsApp em minutos, sem precisar de código. A IA responde 24/7 e encaminha leads qualificados.',
    highlight: 'Setup em menos de 5 minutos',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Inteligente',
    description:
      'Acompanhe métricas de conversão e pipeline de vendas em tempo real. Tome decisões com dados.',
    highlight: 'Relatórios automáticos',
  },
]

export function FeaturesSection() {
  return (
    <section
      id="funcionalidades"
      className="border-border/60 relative border-y bg-white py-20 sm:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="border-brand-blue/20 bg-brand-blue/5 text-brand-blue inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase">
            Funcionalidades
          </span>
          <h2
            id="features-heading"
            className="text-foreground mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Tudo que você precisa para{' '}
            <span className="text-brand-orange">vender mais imóveis</span> sem
            perder leads.
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed text-pretty">
            Uma plataforma criada para corretores e imobiliárias que querem
            escalar atendimento sem contratar mais gente.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map(feature => {
            const Icon = feature.icon
            return (
              <li
                key={feature.title}
                className="group border-border bg-card hover:border-brand-orange/40 relative flex flex-col rounded-xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-8"
              >
                <div className="bg-brand-orange/10 text-brand-orange flex h-12 w-12 items-center justify-center rounded-lg">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="text-foreground mt-5 text-lg font-semibold sm:text-xl">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty sm:text-base">
                  {feature.description}
                </p>

                {/* Ponto de destaque */}
                <div className="bg-brand-blue/8 text-brand-blue mt-5 inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-sm font-medium">
                  <span className="bg-brand-orange flex h-5 w-5 items-center justify-center rounded-full text-white">
                    <Check
                      className="h-3 w-3"
                      aria-hidden="true"
                      strokeWidth={3}
                    />
                  </span>
                  {feature.highlight}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
