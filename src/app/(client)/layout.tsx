'use client'

// import Link from 'next/link'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ClientSidebar } from '@/components/client/sidebar-nav'
import { SubscriptionBanner } from '@/components/client/subscription-banner'
import { mockSubscription } from '@/lib/mock-data'
// import { UserProvider } from '@/providers/userProvider'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ClientSidebar />
      <SidebarInset>
        <SubscriptionBanner hasCard={mockSubscription.hasCard} />
        {/* Header só no mobile: no desktop a sidebar fica sempre visível, então
            o gatilho do menu só é necessário em telas pequenas. */}
        <header className="border-border bg-background sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-4 md:hidden">
          <SidebarTrigger />
          {/* <Link
            href="/"
            className="text-foreground text-base font-bold tracking-tight"
          > */}
          {/* Valya */}
          {/* </Link> */}
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
