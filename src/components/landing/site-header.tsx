import Link from 'next/link'
import { ValyaLogo } from '@/components/images/ValyaLogo'

export function SiteHeader() {
  return (
    <header className="border-border/60 bg-background/80 supports-backdrop-filter:bg-background/70 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Página inicial Valya"
          className="flex items-center"
        >
          <ValyaLogo />
        </Link>

        <nav
          className="flex items-center gap-2 sm:gap-3"
          aria-label="Ações principais"
        >
          <Link
            href="/login"
            className="text-foreground/80 hover:text-foreground inline-flex h-10 items-center rounded-md px-4 text-sm font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            href="/registro"
            className="bg-brand-orange hover:bg-brand-orange-hover focus-visible:ring-brand-orange focus-visible:ring-offset-background inline-flex h-10 items-center rounded-md px-4 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="hidden sm:inline">Criar Conta Grátis</span>
            <span className="sm:hidden">Cadastrar</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
