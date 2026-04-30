'use client'

import Link from 'next/link'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { KpiCard } from '@/components/client/kpi-card'
import { clientKpis, clientChartData } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot } from 'lucide-react'

// interface ClientKpi {
//   label: string
//   value: number
//   change: number
//   changeLabel: string
// }

export default function DashboardPage() {
  // const [kpis, setKpis] = useState<ClientKpi[]>([])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Visão geral do seu desempenho
          </p>
        </div>
        <Button asChild>
          <Link href="/configuracao-ia">
            <Bot className="mr-2 h-4 w-4" />
            Configuração da IA
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {clientKpis.map(kpi => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">
            Novos Leads vs Negócios Fechados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={clientChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" tick={{ fill: '#737373', fontSize: 12 }} />
              <YAxis tick={{ fill: '#737373', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  color: '#0a0a0a',
                }}
              />
              <Legend wrapperStyle={{ color: '#737373', fontSize: 12 }} />
              <Bar
                dataKey="leads"
                fill="#586381"
                radius={[4, 4, 0, 0]}
                name="Novos Leads"
              />
              <Bar
                dataKey="fechados"
                fill="#eb7303"
                radius={[4, 4, 0, 0]}
                name="Negócios Fechados"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
