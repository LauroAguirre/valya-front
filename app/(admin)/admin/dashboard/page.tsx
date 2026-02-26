"use client"

import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { KpiCard } from "@/components/client/kpi-card"
import { adminKpis, adminChartData } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Admin</h1>
        <p className="text-sm text-muted-foreground">Visao geral da plataforma Valya</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminKpis.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base text-card-foreground">Faturamento Mensal (MRR)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={adminChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" tick={{ fill: "#737373", fontSize: 12 }} />
                <YAxis tick={{ fill: "#737373", fontSize: 12 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    color: "#0a0a0a",
                  }}
                  formatter={(value: number) =>
                    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
                  }
                />
                <Line
                  type="monotone"
                  dataKey="faturamento"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  name="Faturamento"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base text-card-foreground">Novos Clientes por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adminChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" tick={{ fill: "#737373", fontSize: 12 }} />
                <YAxis tick={{ fill: "#737373", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    color: "#0a0a0a",
                  }}
                />
                <Bar
                  dataKey="leads"
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                  name="Novos Clientes"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
