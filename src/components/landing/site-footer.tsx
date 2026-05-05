import Link from 'next/link'
import { ValyaLogo } from '@/components/images/ValyaLogo'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-border/60 bg-background border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <ValyaLogo />
            <p className="text-muted-foreground max-w-xs text-center text-sm sm:text-left">
              CRM imobiliário com IA no WhatsApp. Atende, qualifica e agenda
              visitas por você.
            </p>
          </div>

          <nav aria-label="Links legais">
            <ul className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <li>
                <Link
                  href="/termos"
                  className="hover:text-foreground transition-colors"
                >
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="hover:text-foreground transition-colors"
                >
                  Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="hover:text-foreground transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-border/60 text-muted-foreground mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row">
          <p>© {year} Valya. Todos os direitos reservados.</p>
          <p>
            Feito para corretores que valorizam{' '}
            <span className="text-brand-blue font-medium">tempo</span> e{' '}
            <span className="text-brand-orange font-medium">resultado</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
