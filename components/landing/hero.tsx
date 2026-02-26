import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#064e3b_0%,transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Automacao com Inteligencia Artificial
        </div>

        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Venda mais imoveis{" "}
          <span className="text-primary">com IA</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          A Valya qualifica seus leads automaticamente, gerencia cadencias de
          contato e fecha negocios mais rapido. Tudo integrado ao WhatsApp.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/registro">
              Comece gratuitamente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#planos">Ver planos</Link>
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          7 dias gratis. Sem necessidade de cartao de credito.
        </p>
      </div>
    </section>
  )
}
