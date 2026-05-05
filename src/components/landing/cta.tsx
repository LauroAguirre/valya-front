import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="bg-[#003366] px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="text-3xl font-bold tracking-tight text-balance text-white md:text-4xl lg:text-5xl"
          style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
        >
          Pronto para ter uma IA trabalhando por você?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
          Comece agora com 30 dias grátis. Sem cartão de crédito. Cancele quando
          quiser.
        </p>
        <Link
          href="/register"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-[#FF6600] px-10 py-4 text-base font-semibold text-white shadow-lg shadow-[#FF6600]/25 transition-colors hover:bg-[#e55a00]"
        >
          Testar grátis por 30 dias
          <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="mt-4 text-sm text-white/40">
          Mais de 500 corretores já estão usando a Valya
        </p>
      </div>
    </section>
  )
}
