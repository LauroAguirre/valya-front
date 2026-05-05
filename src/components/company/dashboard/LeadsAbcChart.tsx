'use client'

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

const mockLeadsAbc = [
  { brokerName: 'Carlos Silva', leads: 120, accPercent: 31 },
  { brokerName: 'Ana Paula', leads: 85, accPercent: 53 },
  { brokerName: 'Roberto Gomez', leads: 60, accPercent: 68 },
  { brokerName: 'Mariana Luz', leads: 45, accPercent: 80 },
  { brokerName: 'João Pedro', leads: 40, accPercent: 90 },
  { brokerName: 'Outros (5)', leads: 37, accPercent: 100 },
]

function getAbcColor(accPercent: number) {
  if (accPercent <= 80) return '#f97316'
  if (accPercent <= 95) return '#fb923c'
  return '#fdba74'
}

export function LeadsAbcChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Curva ABC — Leads por Corretor</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={mockLeadsAbc}
            margin={{ top: 8, right: 24, left: 0, bottom: 40 }}
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
              label={{ value: 'Leads', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }}
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
                if (name === 'accPercent') return [`${value}%`, '% Acumulado']
                return [value, 'Leads']
              }}
            />
            <Legend
              formatter={(value) =>
                value === 'leads' ? 'Volume de Leads' : '% Acumulado'
              }
              wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
            />
            <Bar
              yAxisId="left"
              dataKey="leads"
              name="leads"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="accPercent"
              name="accPercent"
              stroke="#1e40af"
              strokeWidth={2}
              dot={{ r: 4, fill: '#1e40af' }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
