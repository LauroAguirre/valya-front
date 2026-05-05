import Link from 'next/link'
import { ValyaLogo } from '@/components/images/ValyaLogo'

export function Footer() {
  return (
    <footer className="bg-[#0D1F3C] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <Link href="/" className="flex items-center">
              <ValyaLogo fill="#576381" wordmarkColor="#FFFFFF" className="h-8 w-8" />
            </Link>
            <p className="mt-2 text-sm text-white/40">
              Automação inteligente para corretores de imóveis.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="#recursos"
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              Recursos
            </a>
            <a
              href="#como-funciona"
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              Como funciona
            </a>
            <a
              href="#planos"
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              Planos
            </a>
            <Link
              href="/login"
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              Entrar
            </Link>
          </div>

          <p className="text-xs text-white/30">© 2026 Valya. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
