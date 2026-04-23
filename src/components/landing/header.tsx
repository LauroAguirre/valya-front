'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-border bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-foreground text-xl font-bold tracking-tight"
        >
          Valya
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#recursos"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Recursos
          </a>
          <a
            href="#planos"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Planos
          </a>
          <a
            href="#sobre"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Sobre
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/registro">Começar agora</Link>
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
        <div className="border-border bg-background border-t px-6 pt-4 pb-6 md:hidden">
          <nav className="flex flex-col gap-4">
            <a
              href="#recursos"
              className="text-muted-foreground text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Recursos
            </a>
            <a
              href="#planos"
              className="text-muted-foreground text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Planos
            </a>
            <a
              href="#sobre"
              className="text-muted-foreground text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Sobre
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                asChild
              >
                <Link href="/registro">Começar agora</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
