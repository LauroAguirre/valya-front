'use client'

import { useState } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const mockSalesAbc = [
  { brokerName: 'Ana Paula', quantity: 15, vgv: 7500000, accQtyPercent: 33, accVgvPercent: 40 },
  { brokerName: 'Carlos Silva', quantity: 12, vgv: 4200000, accQtyPercent: 60, accVgvPercent: 62 },
  { brokerName: 'Roberto Gomez', quantity: 8, vgv: 3800000, accQtyPercent: 77, accVgvPercent: 82 },
  { brokerName: 'Mariana Luz', quantity: 6, vgv: 1900000, accQtyPercent: 91, accVgvPercent: 92 },
  { brokerName: 'João Pedro', quantity: 4, vgv: 1500000, accQtyPercent: 100, accVgvPercent: 100 },
]

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)

const formatBRLShort = (value: number) => {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}K`
  return formatBRL(value)
}

type ViewMode = 'quantity' | 'vgv'

export function SalesAbcChart() {
  const [view, setView] = useState<ViewMode>('quantity')

  const isVgv = view === 'vgv'
  const barKey = isVgv ? 'vgv' : 'quantity'
  const accKey = isVgv ? 'accVgvPercent' : 'accQtyPercent'
  const barLabel = isVgv ? 'VGV' : 'Qtd. Vendas'
  const accLabel = isVgv ? '% VGV Acum.' : '% Qtd. Acum.'

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Curva ABC — Vendas por Corretor</CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="quantity">Quantidade</TabsTrigger>
              <TabsTrigger value="vgv">VGV</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={mockSalesAbc}
            margin={{ top: 8, right: 24, left: isVgv ? 16 : 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="brokerName"
              tick={{ fontSize: 11 }}
              angle={-25}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tick={{ fontSize: 11 }}
              tickFormatter={isVgv ? formatBRLShort : undefined}
              label={
                isVgv
                  ? undefined
                  : { value: 'Vendas', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }
              }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === accKey) return [`${value}%`, accLabel]
                if (isVgv) return [formatBRL(value as number), barLabel]
                return [value, barLabel]
              }}
            />
            <Legend
              formatter={(value) => (value === barKey ? barLabel : accLabel)}
              wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
            />
            <Bar
              yAxisId="left"
              dataKey={barKey}
              name={barKey}
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
              isAnimationActive={true}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={accKey}
              name={accKey}
              stroke="#1e40af"
              strokeWidth={2}
              dot={{ r: 4, fill: '#1e40af' }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
