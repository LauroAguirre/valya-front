import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const features = [
  'IA de qualificação de leads no WhatsApp',
  'Cadência automática de mensagens',
  'Dashboard de conversão em tempo real',
]

// #24313d

export function Pricing() {
  return (
    <section id="planos" className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          {/* <p className="text-sm font-semibold tracking-widest text-[#FF6600] uppercase">
            Plano
          </p> */}
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-balance text-[#003366] md:text-4xl"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Comece com 30 dias grátis
          </h2>
          <p className="mt-4 text-gray-500">
            Sem cartão de crédito. Sem burocracia. Cancele quando quiser.
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-md">
          <div className="relative rounded-2xl border-2 border-[#FF6600] bg-white p-8 shadow-xl shadow-[#FF6600]/10">
            {/* <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#FF6600] px-5 py-1.5 text-sm font-semibold text-white">
              30 dias grátis
            </div> */}

            <div className="pt-2 text-center">
              <h3
                className="text-xl font-bold text-[#003366]"
                style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
              >
                Plano Premium
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Acesso completo a todos os recursos
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {features.map(feature => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <Check className="h-4 w-4 shrink-0 text-[#FF6600]" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6600] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#e55a00]"
            >
              Começar trial gratuito
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-3 text-center text-xs text-gray-400">
              Pague apenas após os 30 dias, se quiser continuar
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
