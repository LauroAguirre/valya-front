'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { Building2, Calendar, Search } from 'lucide-react'
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
  const [search, setSearch] = useState('')
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
    // Cada card do funil é uma NEGOCIAÇÃO ativa de um lead. A etapa vive em
    // lead.activeNegotiation.stage. Leads sem negociação aberta não aparecem
    // aqui (só na lista de contatos).
    const term = search.trim().toLowerCase()
    const negotiatingLeads = activeLeads
      .filter(l => !!l.activeNegotiation)
      .filter(l => !term || l.name?.toLowerCase().includes(term))
      // Ordena pela última resposta, da mais recente para a mais antiga.
      // Leads sem lastReplyAt vão para o fim da lista.
      .sort((a, b) => {
        const aTime = a.lastReplyAt ? new Date(a.lastReplyAt).getTime() : 0
        const bTime = b.lastReplyAt ? new Date(b.lastReplyAt).getTime() : 0
        return bTime - aTime
      })
    const byStage = (stage: LeadStage) =>
      negotiatingLeads.filter(l => l.activeNegotiation?.stage === stage)

    const columns: KanbanColumn[] = [
      {
        id: 'qualification',
        title: 'Qualificação',
        color: 'bg-[#6366f1]',
        cards: byStage(LeadStage.QUALIFICATION),
      },
      {
        id: 'cadence',
        title: 'Cadência & Alimentação',
        color: 'bg-[#f59e0b]',
        cards: byStage(LeadStage.CADENCE),
      },
      {
        id: 'visitation',
        title: 'Visita',
        color: 'bg-[#06b6d4]',
        cards: byStage(LeadStage.VISITATION),
      },
      {
        id: 'proposal',
        title: 'Proposta',
        color: 'bg-[#10b981]',
        cards: byStage(LeadStage.PROPOSAL),
      },
      {
        id: 'contract',
        title: 'Contrato',
        color: 'bg-[#8b5cf6]',
        cards: byStage(LeadStage.CONTRACT),
      },
      {
        id: 'results',
        title: 'Ganho / Perda',
        color: 'bg-[#737373]',
        cards: negotiatingLeads.filter(
          l =>
            l.activeNegotiation?.stage === LeadStage.WIN ||
            l.activeNegotiation?.stage === LeadStage.LOSS,
        ),
      },
    ]

    return columns
  }, [activeLeads, search])

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
  }, [ctxUser.currentUser])

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="shrink-0">
        <h1 className="text-foreground text-2xl font-bold">
          Esteira de Vendas
        </h1>
        <p className="text-muted-foreground text-sm">
          Gerencie seus leads pelo pipeline de vendas
        </p>
      </div>

      <div className="relative shrink-0">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Procurar lead..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Board: rola horizontalmente quando não cabem todas as etapas; o scroll
          vertical fica dentro de cada coluna (overflow-y-auto abaixo), não na
          tela toda. overflow-y-hidden aqui evita que o eixo vertical "vaze"
          para o container do board (efeito colateral do overflow-x). */}
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-4" style={{ minWidth: '1200px' }}>
          {kanbanColumns.map(column => (
            <div
              key={column.id}
              className="flex h-full w-52 shrink-0 flex-col gap-3"
            >
              <div className="flex shrink-0 items-center justify-between rounded-lg bg-slate-300 px-3 py-2">
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

              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
                {column.cards.map(lead => (
                  <Card
                    key={lead.id}
                    className="border-border bg-card hover:border-primary/30 cursor-pointer p-3 transition-colors"
                    onClick={() => openLead(lead)}
                  >
                    <p className="text-card-foreground text-sm font-semibold">
                      {lead.name}
                    </p>
                    {lead.activeNegotiation?.properties &&
                      lead.activeNegotiation.properties.length > 0 && (
                        <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {lead.activeNegotiation.properties
                              .map(p => p.property.name)
                              .join(', ')}
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
      </div>

      {loadingActiveLeads && (
        <div className="flex shrink-0 items-center justify-center gap-3">
          <div className="flex items-center px-2">
            <Spinner className="size-4" />
          </div>
          <span>Atualizando lista de leads...</span>
        </div>
      )}
      <LeadSheet
        lead={selectedLead}
        sheetOpen={sheetOpen}
        setSheetOpen={setSheetOpen}
      />
    </div>
  )
}
