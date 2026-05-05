import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'

const freeFeatures = [
  'Até 50 leads/mês qualificados pela IA',
  'Integração com 1 número de WhatsApp',
  'Cadência automática básica',
  'Dashboard com métricas essenciais',
]

const premiumFeatures = [
  'Leads qualificados ilimitados',
  'Múltiplos números de WhatsApp',
  'Cadência avançada (até 7 pontos de contato)',
  'Dashboard completo com pipeline em tempo real',
  'Suporte prioritário dedicado',
  'Exclusivo para corretores de imóveis',
]

export function PricingSection() {
  return (
    <section
      id="precos"
      className="relative py-20 sm:py-24"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="border-brand-blue/20 bg-brand-blue/5 text-brand-blue inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase">
            Planos
          </span>
          <h2
            id="pricing-heading"
            className="text-foreground mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Comece grátis.{' '}
            <span className="text-brand-orange">Evolua quando quiser.</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed text-pretty">
            Um plano gratuito para começar e um Premium único, exclusivo para
            corretores de imóveis.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Plano Gratuito */}
          <article className="border-border bg-card flex flex-col rounded-2xl border p-8 shadow-sm">
            <header>
              <h3 className="text-brand-blue text-sm font-semibold tracking-wider uppercase">
                Gratuito
              </h3>
              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="text-foreground text-5xl font-semibold tracking-tight">
                  R$ 0
                </span>
                <span className="text-muted-foreground text-sm">/mês</span>
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Para experimentar a IA da Valya sem compromisso.
              </p>
            </header>

            <ul className="text-foreground/90 mt-6 space-y-3 text-sm">
              {freeFeatures.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="bg-brand-blue/10 text-brand-blue mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                    <Check
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                      strokeWidth={3}
                    />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <Link
                href="/registro"
                className="bg-brand-blue hover:bg-brand-blue-hover focus-visible:ring-brand-blue inline-flex h-11 w-full items-center justify-center rounded-md px-5 text-sm font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Criar conta grátis
              </Link>
            </div>
          </article>

          {/* Plano Premium */}
          <article className="border-brand-orange bg-card shadow-brand-orange/10 relative flex flex-col overflow-hidden rounded-2xl border-2 p-8 shadow-lg">
            <div
              aria-hidden="true"
              className="bg-brand-orange/15 pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl"
            />
            <header className="relative">
              <div className="flex items-center justify-between">
                <h3 className="text-brand-orange text-sm font-semibold tracking-wider uppercase">
                  Premium
                </h3>
                <span className="bg-brand-orange inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Para corretores
                </span>
              </div>
              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="text-foreground text-5xl font-semibold tracking-tight">
                  Plano único
                </span>
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Todos os recursos da Valya, exclusivo para corretores de
                imóveis.
              </p>
            </header>

            <ul className="text-foreground/90 relative mt-6 space-y-3 text-sm">
              {premiumFeatures.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="bg-brand-orange mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
                    <Check
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                      strokeWidth={3}
                    />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="relative mt-auto pt-8">
              <Link
                href="/registro"
                className="bg-brand-orange shadow-brand-orange/20 hover:bg-brand-orange-hover focus-visible:ring-brand-orange inline-flex h-11 w-full items-center justify-center rounded-md px-5 text-sm font-semibold text-white shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Quero o Premium
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
