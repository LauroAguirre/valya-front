'use client'

import {
  SidebarProvider,
  SidebarInset,
  // SidebarTrigger,
} from '@/components/ui/sidebar'
import { SubscriptionBanner } from '@/components/client/subscription-banner'
import { mockSubscription } from '@/lib/mock-data'
import { CompanySidebar } from '@/components/company/sidebar-nav'
// import { UserProvider } from '@/providers/userProvider'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <CompanySidebar />
      <SidebarInset>
        <SubscriptionBanner hasCard={mockSubscription.hasCard} />
        {/* <header className="border-border flex h-14 items-center gap-2 border-b px-6">
          <SidebarTrigger />
        </header> */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
