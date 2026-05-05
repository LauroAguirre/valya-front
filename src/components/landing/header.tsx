'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ValyaLogo } from '@/components/images/ValyaLogo'

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-[#0D1F3C]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <ValyaLogo fill="#576381" wordmarkColor="#FFFFFF" className="h-8 w-8" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#recursos"
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            Recursos
          </a>
          <a
            href="#como-funciona"
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            Como funciona
          </a>
          <a
            href="#planos"
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            Planos
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#FF6600] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e55a00]"
          >
            Teste grátis 30 dias
          </Link>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0D1F3C] px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <a
              href="#recursos"
              className="text-sm text-white/70"
              onClick={() => setMenuOpen(false)}
            >
              Recursos
            </a>
            <a
              href="#como-funciona"
              className="text-sm text-white/70"
              onClick={() => setMenuOpen(false)}
            >
              Como funciona
            </a>
            <a
              href="#planos"
              className="text-sm text-white/70"
              onClick={() => setMenuOpen(false)}
            >
              Planos
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                className="rounded-lg border border-white/20 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-white/10"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#FF6600] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#e55a00]"
              >
                Teste grátis 30 dias
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
