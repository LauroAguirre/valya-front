import Link from 'next/link'
import { ArrowRight, Bot, MessageCircle, Zap } from 'lucide-react'

/**
 * Hero principal da Valya. Fundo composto por gradiente sutil,
 * grid geométrico e blobs nas cores da marca (laranja + azul).
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Camadas de fundo geométrico */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(87,99,129,0.06)_0%,rgba(244,245,247,0)_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(87,99,129,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(87,99,129,0.08)_1px,transparent_1px)] mask-[radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)] bg-size-[48px_48px]"
      />
      <div
        aria-hidden="true"
        className="bg-brand-orange/20 pointer-events-none absolute -top-32 -right-24 h-105 w-105 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-brand-blue/25 pointer-events-none absolute -bottom-24 -left-24 h-95 w-95 rounded-full blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="border-brand-blue/20 text-brand-blue inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            CRM imobiliário com IA no WhatsApp
          </span>

          <h1 className="text-foreground mt-6 text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Sua imobiliária aberta 24/7.{' '}
            <span className="text-brand-orange">
              A IA que atende, qualifica
            </span>{' '}
            e agenda visitas para você.
          </h1>

          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
            O lead esfria em 5 minutos, a Valya responde em 30 segundos. Pare de
            perder tempo com curiosos e foque em quem está pronto para comprar.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/registro"
              className="bg-brand-orange shadow-brand-orange/20 hover:bg-brand-orange-hover focus-visible:ring-brand-orange inline-flex h-12 w-full items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold text-white shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
            >
              Começar Gratuitamente
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="#funcionalidades"
              className="bg-brand-blue hover:bg-brand-blue-hover focus-visible:ring-brand-blue inline-flex h-12 w-full items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
            >
              Entender a Plataforma
            </Link>
          </div>

          {/* Pontos de destaque com ícones */}
          <ul className="text-muted-foreground mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Bot className="text-brand-orange h-4 w-4" aria-hidden="true" />
              IA treinada para corretores
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle
                className="text-brand-orange h-4 w-4"
                aria-hidden="true"
              />
              WhatsApp oficial integrado
            </li>
            <li className="flex items-center gap-2">
              <Zap className="text-brand-orange h-4 w-4" aria-hidden="true" />
              Resposta em 30 segundos
            </li>
          </ul>
        </div>

        {/* Mock visual de conversa */}
        <div className="relative mx-auto mt-14 max-w-3xl">
          <div
            className="bg-brand-blue/20 absolute inset-x-8 -bottom-6 h-12 rounded-full blur-2xl"
            aria-hidden="true"
          />
          <div className="border-border shadow-brand-blue/10 relative rounded-2xl border bg-white p-5 shadow-xl sm:p-6">
            <div className="border-border flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-brand-blue flex h-10 w-10 items-center justify-center rounded-full text-white">
                  <Bot className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-foreground text-sm font-semibold">
                    Valya IA
                  </p>
                  <p className="text-muted-foreground text-xs">
                    online · qualificando lead
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                ao vivo
              </span>
            </div>

            <div className="space-y-3 pt-5 text-left">
              <div className="bg-muted text-foreground ml-auto max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
                Oi! Vi o anúncio do apto na Vila Mariana, ainda está disponível?
              </div>
              <div className="bg-brand-blue mr-auto max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white">
                Olá! Sim, está disponível. Posso te ajudar a agendar uma visita
                ainda hoje. Você busca para morar ou investir?
              </div>
              <div className="bg-muted text-foreground ml-auto max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
                Para morar, com a família. Tem 3 quartos?
              </div>
              <div className="bg-brand-blue mr-auto max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white">
                Tem sim, 3 quartos sendo 1 suíte. Posso reservar 18h ou 19h para
                a visita?
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
