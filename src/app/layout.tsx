import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { UserProvider } from '@/providers/userProvider'
import { Toaster } from 'sonner'

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Valya — CRM imobiliário com IA no WhatsApp',
  description:
    'A IA da Valya atende, qualifica e agenda visitas pelo WhatsApp em menos de 30 segundos. Pare de perder leads e foque em quem está pronto para comprar.',
  generator: 'CoopTeam',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      //     // { url: '/valya-mark.svg', type: 'image/svg+xml' },
      //     // { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      //     // { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
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
    <html lang="pt-BR" className={`${rubik.variable} bg-background`}>
      <UserProvider>
        <body className="font-sans antialiased">
          <Toaster richColors expand={false} />
          {children}
          {/* {process.env.NODE_ENV === 'production' && <Analytics />} */}
        </body>
      </UserProvider>
    </html>
  )
}

// import type { Metadata } from 'next'
// import { Open_Sans, Montserrat, Rubik } from 'next/font/google'
// // import { Analytics } from '@vercel/analytics/next'
// import './globals.css'
// import { UserProvider } from '../providers/userProvider'
// import { Toaster } from 'sonner'

// const openSans = Open_Sans({
//   subsets: ['latin'],
//   variable: '--font-open-sans',
//   display: 'swap',
// })

// const montserrat = Montserrat({
//   subsets: ['latin'],
//   variable: '--font-montserrat',
//   display: 'swap',
// })

// const rubik = Rubik({
//   subsets: ['latin'],
//   variable: '--font-rubik',
//   display: 'swap',
// })

// export const metadata: Metadata = {
//   title: 'Valya - Automação Inteligente para Corretores',
//   description:
//     'Plataforma SaaS de IA para automação de vendas imobiliárias. Qualifique leads, gerencie imóveis e feche negócios mais rápido.',
//   generator: 'v0.app',
//   icons: {
//     icon: [
//       {
//         url: '/icon-light-32x32.png',
//         media: '(prefers-color-scheme: light)',
//       },
//       {
//         url: '/icon-dark-32x32.png',
//         media: '(prefers-color-scheme: dark)',
//       },
//       {
//         url: '/icon.svg',
//         type: 'image/svg+xml',
//       },
//     ],
//     apple: '/apple-icon.png',
//   },
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html
//       lang="pt-BR"
//       className={`${openSans.variable} ${montserrat.variable} ${rubik.variable}`}
//     >
//       <UserProvider>
//         <body className="font-sans antialiased">
//           <Toaster richColors expand={false} />
//           {children}
//           {/* <Analytics /> */}
//         </body>
//       </UserProvider>
//     </html>
//   )
// }
