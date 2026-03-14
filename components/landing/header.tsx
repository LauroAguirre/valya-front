"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          Valya
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#recursos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Recursos
          </a>
          <a href="#planos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Planos
          </a>
          <a href="#sobre" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Sobre
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/registro">Comecar agora</Link>
          </Button>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <a href="#recursos" className="text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>
              Recursos
            </a>
            <a href="#planos" className="text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>
              Planos
            </a>
            <a href="#sobre" className="text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>
              Sobre
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground" asChild>
                <Link href="/registro">Comecar agora</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
