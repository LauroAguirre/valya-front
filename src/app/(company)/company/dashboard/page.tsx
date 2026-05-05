import { SummaryCards } from '@/components/company/dashboard/SummaryCards'
import { LeadsAbcChart } from '@/components/company/dashboard/LeadsAbcChart'
import { SalesAbcChart } from '@/components/company/dashboard/SalesAbcChart'

export default function CompanyDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Visão geral do desempenho comercial
        </p>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <LeadsAbcChart />
        <SalesAbcChart />
      </div>
    </div>
  )
}
