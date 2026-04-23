import { DashboardFilters } from '@/schemas/dashboard/dashboardFilterSchema'
import { MaintenanceFilters } from '@/schemas/maintenance/maintenanceFilterSchema'
import { SOPanelFilters } from '@/schemas/soPanel/soPanelFilterSchema'
import { setCookie, parseCookies, destroyCookie } from 'nookies'

interface CookiesProps {
  filters?: DashboardFilters
  maintenanceFilters?: MaintenanceFilters
  collapsedMenu?: boolean
  companyUrl?: string
  soPanelFilters?: SOPanelFilters
}

export const setPropsCookie = (data: CookiesProps) => {
  const currentCookie = getPropsCookie()

  setCookie(
    undefined,
    'taris-props',
    // JSON.stringify(data)
    JSON.stringify({
      ...currentCookie,
      ...data,
    }),
    {
      maxAge: 24 * 60 * 60 * 7,
      path: '/',
    },
  )
}

export const getPropsCookie = (): CookiesProps => {
  const { 'taris-props': tokenDashboard } = parseCookies()
  return tokenDashboard ? JSON.parse(tokenDashboard) : undefined
}

export const destroyPropsCookie = () => {
  destroyCookie(undefined, 'taris-props', { path: '/' })
}
