"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { KpiCard } from "@/components/client/kpi-card"
import { clientKpis, clientChartData, mockLeads } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const recentLeads = mockLeads.slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visao geral do seu desempenho</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {clientKpis.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-card-foreground">Leads vs Fechamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
                <XAxis dataKey="month" tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                <YAxis tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.13 0 0)",
                    border: "1px solid oklch(0.22 0 0)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                />
                <Legend wrapperStyle={{ color: "oklch(0.6 0 0)", fontSize: 12 }} />
                <Bar dataKey="leads" fill="oklch(0.7 0.15 165)" radius={[4, 4, 0, 0]} name="Novos Leads" />
                <Bar dataKey="fechados" fill="oklch(0.45 0 0)" radius={[4, 4, 0, 0]} name="Fechados" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base text-card-foreground">Ultimos leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{lead.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{lead.source}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {lead.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
