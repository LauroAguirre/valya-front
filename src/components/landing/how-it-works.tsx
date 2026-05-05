import { Smartphone, Bot, TrendingUp } from 'lucide-react'

const steps = [
  {
    icon: Smartphone,
    title: 'Conecte seu WhatsApp',
    description:
      'Em menos de 5 minutos, sem código. Basta escanear um QR code e a IA já está pronta para trabalhar.',
  },
  {
    icon: Bot,
    title: 'A IA qualifica seus leads',
    description:
      'Cada lead que chegar recebe atenção imediata: a IA conversa, entende o perfil de compra, tira dúvidas e agenda visitas.',
  },
  {
    icon: TrendingUp,
    title: 'Você foca em fechar',
    description:
      'Você é acionado apenas quando o lead está qualificado e pronto para avançar. Chega de perder tempo com curiosos.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="overflow-hidden bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF6600]">
            Como funciona
          </p>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-balance text-[#003366] md:text-4xl"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Simples de configurar. Poderoso no resultado.
          </h2>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-1/2 hidden h-px w-full bg-linear-to-r from-[#FF6600]/40 to-transparent md:block" />
              )}

              <div className="relative mx-auto inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-[#003366]">
                <step.icon className="h-9 w-9 text-white" />
                <span className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#FF6600] text-xs font-bold text-white">
                  {index + 1}
                </span>
              </div>

              <h3
                className="mt-6 text-lg font-semibold text-[#003366]"
                style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
              >
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
