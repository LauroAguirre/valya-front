'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Kanban,
  User,
  Users,
  Settings,
  LogOut,
  CalendarCheck2,
  TrendingUp,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUserProvider } from '@/providers/userProvider'
import { CompanyUserRole } from '@/schemas/constructionCompanySchema'

const baseNavItems = [
  { href: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/company/developments', label: 'Empreendimentos', icon: Building2 },
  { href: '/company/brokers', label: 'Corretores', icon: Kanban },
  { href: '/company/reservations', label: 'Reservas', icon: CalendarCheck2 },
  { href: '/company/sales', label: 'Vendas', icon: TrendingUp },
  { href: '/company/settings', label: 'Configurações', icon: Settings },
  { href: '/company/profile', label: 'Perfil', icon: User },
]

const usersNavItem = {
  href: '/company/users',
  label: 'Usuários',
  icon: Users,
}

export function CompanySidebar() {
  const { currentUser } = useUserProvider()
  const pathname = usePathname()

  const canManageUsers =
    currentUser?.companyUsers?.some(
      cu =>
        cu.role === CompanyUserRole.ADMIN ||
        cu.role === CompanyUserRole.MANAGER,
    ) ?? false

  const navItems = canManageUsers
    ? [...baseNavItems, usersNavItem]
    : baseNavItems

  return (
    <Sidebar className="border-sidebar-border">
      <SidebarHeader className="p-4">
        <Link
          href="/"
          className="text-sidebar-foreground text-lg font-bold tracking-tight"
        >
          Valya
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {currentUser?.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="text-sidebar-foreground truncate text-sm font-medium">
              {currentUser?.name}
            </p>
            <p className="text-muted-foreground truncate text-xs">
              {currentUser?.email}
            </p>
          </div>
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
