import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0D1F3C] px-6 pb-16 pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#1A4D8C2A_0%,transparent_100%)]" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-[480px] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FF6600]/40 to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center">
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FF6600]/30 bg-[#FF6600]/10 px-4 py-1.5 text-xs text-[#FF6600]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6600]" />
            IA especializada no mercado imobiliário
          </div>

          <h1
            className="text-balance text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Qualifique leads no WhatsApp.{' '}
            <span className="text-[#FF6600]">Venda mais.</span>{' '}
            Trabalhe menos.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 text-pretty lg:mx-0 md:text-lg">
            A Valya conecta IA ao seu WhatsApp e qualifica leads automaticamente
            — 24h por dia. Você só fala com quem está realmente pronto para
            comprar.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF6600] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF6600]/25 transition-colors hover:bg-[#e55a00]"
            >
              Testar grátis por 30 dias
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#como-funciona"
              className="rounded-xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Ver como funciona
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            {['Sem cartão de crédito', 'Setup em 5 minutos', 'Cancele quando quiser'].map(
              item => (
                <span key={item} className="flex items-center gap-1.5 text-sm text-white/50">
                  <CheckCircle className="h-3.5 w-3.5 text-[#FF6600]" />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="w-full max-w-sm flex-shrink-0">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#576381]">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Valya IA</p>
                <p className="flex items-center gap-1 text-xs text-green-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                  online agora
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#FF6600]/20 px-3.5 py-2.5 text-sm text-white/90">
                  Oi! Vi o apê nos Jardins. Tenho interesse 🏠
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-3.5 py-2.5 text-sm text-white/90">
                  Olá! O apartamento tem 3 suítes e 120m². Qual é seu
                  orçamento? Assim encontro as melhores opções 😊
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#FF6600]/20 px-3.5 py-2.5 text-sm text-white/90">
                  Em torno de R$ 1,8M. Financiamento ok 👍
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-3.5 py-2.5 text-sm text-white/90">
                  Perfeito! Esse imóvel encaixa no seu perfil. Posso agendar
                  uma visita para sábado? 📅
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FF6600]/10 px-3 py-2">
              <span className="text-xs text-[#FF6600]">Lead qualificado automaticamente</span>
              <span className="rounded-full bg-[#FF6600] px-2 py-0.5 text-xs font-semibold text-white">
                Quente
              </span>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-white/30">
            IA respondendo 24h · Sem intervenção do corretor
          </p>
        </div>
      </div>
    </section>
  )
}
