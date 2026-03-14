import type { Metadata } from 'next'
import { Lato, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _lato = Lato({ 
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-sans"
});

const _montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading"
});

export const metadata: Metadata = {
  title: 'Valya - Automação Inteligente para Corretores',
  description: 'Plataforma SaaS de IA para automação de vendas imobiliárias. Qualifique leads, gerencie imóveis e feche negócios mais rápido.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
