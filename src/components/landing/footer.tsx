import Link from "next/link"

export function Footer() {
  return (
    <footer id="sobre" className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <Link href="/" className="text-lg font-bold text-foreground">
            Valya
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            Automação inteligente para corretores de imóveis.
          </p>
        </div>

        <div className="flex gap-8">
          <a href="#recursos" className="text-sm text-muted-foreground hover:text-foreground">
            Recursos
          </a>
          <a href="#planos" className="text-sm text-muted-foreground hover:text-foreground">
            Planos
          </a>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Entrar
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          2026 Valya. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
