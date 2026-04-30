'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import { Building2, Calendar } from 'lucide-react'
import { LeadSheet } from '@/components/client/leads/leadSheet'
import { Lead, LeadStage } from '@/schemas/leadSchema'
// import { Lead, LeadOrigin, LeadStage } from '@/schemas/leadSchema'
import { format } from 'date-fns'
// import { BbqType, PropertyMode } from '@/schemas/propertySchema'
import { useUserProvider } from '@/providers/userProvider'
import { loadActiveLeads } from '@/services/lead/loadActiveLeads'
import { usePromiseTracker } from 'react-promise-tracker'
import { Spinner } from '@/components/ui/spinner'

interface KanbanColumn {
  id: string
  title: string
  color: string
  cards: Lead[]
}

export default function EsteiraPage() {
  const ctxUser = useUserProvider()
  const [selectedLead, setSelectedLead] = useState<Lead>()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeLeads, setActiveLeads] = useState<Lead[]>([
    // {
    //   id: 'l1',
    //   name: 'Ana Carolina Silva',
    //   email: 'ana.silva@email.com',
    //   phone: '(11) 98765-4321',
    //   origin: LeadOrigin.INSTAGRAM,
    //   messages: [],
    //   userId: 'u1',
    //   properties: [
    //     {
    //       name: 'Casa da praia',
    //       id: 'p1',
    //       bbqType: BbqType.NONE,
    //       mode: PropertyMode.SINGLE,
    //       createdAt: new Date(),
    //     },
    //   ],
    //   stage: LeadStage.QUALIFICATION,
    //   createdAt: new Date('2026-02-20'),
    //   lastReplyAt: new Date('2026-02-24'),
    //   notes: 'Interessada em visita no sabado',
    //   aiEnabled: true,
    // },
  ])
  const { promiseInProgress: loadingActiveLeads } = usePromiseTracker({
    area: 'loadingActiveLeads',
    delay: 0,
  })

  const kanbanColumns = useMemo(() => {
    const columns: KanbanColumn[] = [
      {
        id: 'qualification',
        title: 'Qualificação',
        color: 'bg-[#6366f1]',
        cards: activeLeads.filter(l => l.stage === LeadStage.QUALIFICATION),
      },
      {
        id: 'cadence',
        title: 'Cadência & Alimentação',
        color: 'bg-[#f59e0b]',
        cards: activeLeads.filter(l => l.stage === LeadStage.CADENCE),
      },
      {
        id: 'visitation',
        title: 'Visita',
        color: 'bg-[#06b6d4]',
        cards: activeLeads.filter(l => l.stage === LeadStage.VISITATION),
      },
      {
        id: 'proposal',
        title: 'Proposta',
        color: 'bg-[#10b981]',
        cards: activeLeads.filter(l => l.stage === LeadStage.PROPOSAL),
      },
      {
        id: 'contract',
        title: 'Contrato',
        color: 'bg-[#8b5cf6]',
        cards: activeLeads.filter(l => l.stage === LeadStage.CONTRACT),
      },
      {
        id: 'results',
        title: 'Ganho / Perda',
        color: 'bg-[#737373]',
        cards: activeLeads.filter(
          l => l.stage === LeadStage.WIN || l.stage === LeadStage.LOSS,
        ),
      },
    ]

    return columns
  }, [activeLeads])

  function openLead(lead: Lead) {
    setSelectedLead(lead)
    setSheetOpen(true)
  }

  useEffect(() => {
    if (!ctxUser?.currentUser) return

    const loadLeads = async () => {
      const leads = await loadActiveLeads(ctxUser.currentUser?.id as string)
      setActiveLeads(leads)
    }

    loadLeads()
  }, [ctxUser])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          Esteira de Vendas
        </h1>
        <p className="text-muted-foreground text-sm">
          Gerencie seus leads pelo pipeline de vendas
        </p>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4" style={{ minWidth: '1200px' }}>
          {kanbanColumns.map(column => (
            <div key={column.id} className="flex w-52 shrink-0 flex-col gap-3">
              <div className="bg-secondary flex items-center justify-between rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                  <h3 className="text-foreground text-xs font-medium">
                    {column.title}
                  </h3>
                </div>
                <span className="bg-muted text-muted-foreground flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium">
                  {column.cards.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {column.cards.map(lead => (
                  <Card
                    key={lead.id}
                    className="border-border bg-card hover:border-primary/30 cursor-pointer p-3 transition-colors"
                    onClick={() => openLead(lead)}
                  >
                    <p className="text-card-foreground text-sm font-semibold">
                      {lead.name}
                    </p>
                    {lead.properties && lead.properties.length > 0 && (
                      <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {lead.properties?.map(prop => prop.name).join(', ')}
                        </span>
                      </p>
                    )}
                    <p className="text-muted-foreground mt-2 flex items-center gap-1 text-[10px]">
                      <Calendar className="h-3 w-3" />
                      Ultima resposta:{' '}
                      {lead.lastReplyAt
                        ? format(new Date(lead.lastReplyAt), 'dd/MM/yyyy')
                        : 'Nunca'}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        {loadingActiveLeads && (
          <div className="flex w-full flex-1 shrink-0 items-center justify-center gap-3">
            <div className="flex items-center px-2">
              <Spinner className="size-4" />
            </div>
            <span>Atualizando lista de leads...</span>
          </div>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <LeadSheet
        lead={selectedLead}
        sheetOpen={sheetOpen}
        setSheetOpen={setSheetOpen}
      />
    </div>
  )
}
