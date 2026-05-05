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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot } from 'lucide-react'
import { useUserProvider } from '@/providers/userProvider'
import { useEffect, useState } from 'react'
import { usePromiseTracker } from 'react-promise-tracker'
import { cn } from '@/lib/utils'
import { loadDashbaordKpis } from '@/services/dashboard/loadDashbaordKpis'
import { loadDashboardLeadsChart } from '@/services/dashboard/loadDashboardLeadsChart'
import type { ChartDataPoint } from '@/lib/types'

export interface ClientKpi {
  label: string
  value: number
  change: number | null
  changeLabel: string | null
}

export default function DashboardPage() {
  const ctxUser = useUserProvider()
  const [kpis, setKpis] = useState<ClientKpi[]>([])
  const [kpisError, setKpisError] = useState(false)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [chartError, setChartError] = useState(false)

  const { promiseInProgress: loadingKpis } = usePromiseTracker({
    area: 'loadingDashboardKpis',
  })
  const { promiseInProgress: loadingChart } = usePromiseTracker({
    area: 'loadingDashboardChart',
  })

  useEffect(() => {
    if (!ctxUser.currentUser) {
      setKpis([])
      return
    }

    const userId = ctxUser.currentUser.id as string

    const loadKpis = async () => {
      const response = await loadDashbaordKpis(userId)
      if (response === undefined) {
        setKpisError(true)
      } else {
        setKpis(response)
      }
    }

    const loadChart = async () => {
      const response = await loadDashboardLeadsChart(userId)
      if (response === undefined) {
        setChartError(true)
      } else {
        setChartData(response)
      }
    }

    loadKpis()
    loadChart()
  }, [ctxUser.currentUser])

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

      <div
        className={cn('grid gap-4 sm:grid-cols-2', loadingKpis && 'opacity-50')}
      >
        {kpisError ? (
          <Card className="border-border bg-card grid-cols-12">
            <CardContent>
              <span>Não foi possível carregar os KPIs.</span>
            </CardContent>
          </Card>
        ) : kpis.length === 0 && !loadingKpis ? (
          <Card className="border-border bg-card grid-cols-12">
            <CardContent>
              <span>Nenhum KPI para exibir</span>
            </CardContent>
          </Card>
        ) : (
          kpis.map(kpi => <KpiCard key={kpi.label} data={kpi} />)
        )}
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base">
            Novos Leads vs Negócios Fechados
          </CardTitle>
        </CardHeader>
        <CardContent className={cn(loadingChart && 'opacity-50')}>
          {chartError ? (
            <p className="text-muted-foreground text-sm">
              Não foi possível carregar os dados do gráfico.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#737373', fontSize: 12 }}
                />
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
