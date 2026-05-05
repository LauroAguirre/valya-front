import { Bot, Zap, BarChart3, MessageSquare } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'Qualificação com IA',
    description:
      'Nossa IA conversa com seus leads no WhatsApp, qualifica automaticamente e identifica os que estão prontos para comprar. Você não perde mais tempo com leads frios.',
    highlight: 'Resposta em menos de 30 segundos',
  },
  {
    icon: Zap,
    title: 'Cadência Automática',
    description:
      'Sequências de mensagens personalizadas que mantêm seus leads engajados até o momento ideal de contato. Sem esquecer nenhum follow-up.',
    highlight: 'Até 7 pontos de contato automáticos',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Integrado',
    description:
      'Conecte seu WhatsApp em minutos, sem precisar de código. A IA responde 24/7, agenda visitas e encaminha leads qualificados direto para você.',
    highlight: 'Setup em menos de 5 minutos',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Inteligente',
    description:
      'Acompanhe métricas de conversão, pipeline de vendas e performance da IA em tempo real. Tome decisões com dados, não com achismos.',
    highlight: 'Relatórios automáticos',
  },
]

export function Benefits() {
  return (
    <section id="recursos" className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF6600]">
            Recursos
          </p>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-balance text-[#003366] md:text-4xl"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Tudo que você precisa para vender mais
          </h2>
          <p className="mt-4 text-pretty text-gray-500">
            Ferramentas que trabalham por você enquanto você foca no que importa: fechar
            negócios.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {features.map(feature => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-all duration-200 hover:border-[#FF6600]/20 hover:bg-white hover:shadow-lg hover:shadow-gray-100"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6600]/10">
                <feature.icon className="h-6 w-6 text-[#FF6600]" />
              </div>
              <h3
                className="text-lg font-semibold text-[#003366]"
                style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
              >
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#FF6600]/10 px-3 py-1 text-xs font-medium text-[#FF6600]">
                ✓ {feature.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
