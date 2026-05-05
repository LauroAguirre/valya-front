'use client'

import { Building2, Users, Handshake } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const mockSummary = {
  availableUnits: 142,
  activeLeads: 387,
  closedDeals6Months: 45,
}

const cards = [
  {
    title: 'Unidades Disponíveis',
    value: mockSummary.availableUnits,
    description: 'Total no portfólio ativo',
    icon: Building2,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    title: 'Leads Ativos',
    value: mockSummary.activeLeads,
    description: 'Leads em acompanhamento',
    icon: Users,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    title: 'Negócios Fechados',
    value: mockSummary.closedDeals6Months,
    description: 'Últimos 6 meses',
    icon: Handshake,
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
]

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map(card => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{card.value.toLocaleString('pt-BR')}</p>
            <p className="text-muted-foreground mt-1 text-xs">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
