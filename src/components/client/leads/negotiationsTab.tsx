'use client'

import { Dispatch, SetStateAction } from 'react'
import { format } from 'date-fns'
import { Building2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { usePromiseTracker } from 'react-promise-tracker'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

import { LeadStage } from '@/schemas/leadSchema'
import { Negotiation, NegotiationStatus } from '@/schemas/negotiationSchema'
import { createNegotiation } from '@/services/negotiation/createNegotiation'
import { moveNegotiationStage } from '@/services/negotiation/moveNegotiationStage'
import { closeNegotiation } from '@/services/negotiation/closeNegotiation'

const STAGE_LABELS: Record<LeadStage, string> = {
  [LeadStage.QUALIFICATION]: 'Qualificação',
  [LeadStage.CADENCE]: 'Cadência & Alimentação',
  [LeadStage.VISITATION]: 'Visita',
  [LeadStage.PROPOSAL]: 'Proposta',
  [LeadStage.CONTRACT]: 'Contrato',
  [LeadStage.WIN]: 'Ganho',
  [LeadStage.LOSS]: 'Perda',
}

// Etapas selecionáveis no funil (WIN/LOSS são alcançados via "fechar negociação").
const SELECTABLE_STAGES: LeadStage[] = [
  LeadStage.QUALIFICATION,
  LeadStage.CADENCE,
  LeadStage.VISITATION,
  LeadStage.PROPOSAL,
  LeadStage.CONTRACT,
]

const STATUS_LABELS: Record<NegotiationStatus, string> = {
  [NegotiationStatus.OPEN]: 'Em andamento',
  [NegotiationStatus.WON]: 'Ganha',
  [NegotiationStatus.LOST]: 'Perdida',
}

const STATUS_VARIANT: Record<
  NegotiationStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  [NegotiationStatus.OPEN]: 'default',
  [NegotiationStatus.WON]: 'secondary',
  [NegotiationStatus.LOST]: 'destructive',
}

interface NegotiationsTabProps {
  leadId: string
  negotiations: Negotiation[]
  setNegotiations: Dispatch<SetStateAction<Negotiation[]>>
}

export const NegotiationsTab = ({
  leadId,
  negotiations,
  setNegotiations,
}: NegotiationsTabProps) => {
  const { promiseInProgress: loading } = usePromiseTracker({
    area: 'loadingLeadNegotiations',
  })
  const { promiseInProgress: creating } = usePromiseTracker({
    area: 'creatingNegotiation',
  })

  const activeNegotiation = negotiations.find(
    n => n.status === NegotiationStatus.OPEN,
  )

  // Substitui a negociação atualizada na lista mantendo a ordem.
  function upsert(updated: Negotiation) {
    setNegotiations(prev =>
      prev.map(n => (n.id === updated.id ? updated : n)),
    )
  }

  async function handleCreate() {
    const result = await createNegotiation(leadId)
    if (result.ok) {
      setNegotiations(prev => [result.negotiation, ...prev])
      toast.success('Nova negociação aberta!')
    } else {
      toast.error(result.message)
    }
  }

  async function handleStageChange(negotiationId: string, stage: LeadStage) {
    const updated = await moveNegotiationStage(negotiationId, stage)
    if (updated) {
      upsert(updated)
      toast.success('Etapa atualizada.')
    } else {
      toast.error('Não foi possível mover a etapa.')
    }
  }

  async function handleClose(negotiationId: string, outcome: 'WON' | 'LOST') {
    const updated = await closeNegotiation(negotiationId, outcome)
    if (updated) {
      upsert(updated)
      toast.success(
        outcome === 'WON'
          ? 'Negociação marcada como ganha!'
          : 'Negociação marcada como perdida.',
      )
    } else {
      toast.error('Não foi possível fechar a negociação.')
    }
  }

  if (loading && negotiations.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-10">
        <Spinner className="size-4" />
        <span className="text-muted-foreground text-sm">
          Carregando negociações...
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-foreground text-sm font-medium">
          {negotiations.length} negociaç{negotiations.length === 1 ? 'ão' : 'ões'}
        </p>
        {!activeNegotiation && (
          <Button size="sm" onClick={handleCreate} disabled={creating}>
            <Plus className="h-4 w-4" />
            {creating ? 'Abrindo...' : 'Nova negociação'}
          </Button>
        )}
      </div>

      {negotiations.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Este lead ainda não possui negociações.
        </p>
      )}

      {negotiations.map(negotiation => {
        const isOpen = negotiation.status === NegotiationStatus.OPEN
        return (
          <div
            key={negotiation.id}
            className="border-border flex flex-col gap-3 rounded-lg border p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-foreground text-sm font-medium">
                  {negotiation.title ?? 'Negociação'}
                </p>
                <p className="text-muted-foreground text-xs">
                  Aberta em{' '}
                  {format(new Date(negotiation.createdAt), 'dd/MM/yyyy')}
                  {negotiation.closedAt &&
                    ` • Fechada em ${format(new Date(negotiation.closedAt), 'dd/MM/yyyy')}`}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[negotiation.status]}>
                {STATUS_LABELS[negotiation.status]}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs">Etapa</Label>
              {isOpen ? (
                <Select
                  value={negotiation.stage}
                  onValueChange={value =>
                    handleStageChange(negotiation.id, value as LeadStage)
                  }
                >
                  <SelectTrigger className="w-full" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SELECTABLE_STAGES.map(stage => (
                      <SelectItem key={stage} value={stage}>
                        {STAGE_LABELS[stage]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-foreground text-sm">
                  {STAGE_LABELS[negotiation.stage]}
                </p>
              )}
            </div>

            {negotiation.properties && negotiation.properties.length > 0 && (
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground text-xs">
                  Imóveis de interesse
                </Label>
                {negotiation.properties.map(np => (
                  <p
                    key={np.id}
                    className="text-foreground flex items-center gap-2 text-sm"
                  >
                    <Building2 className="text-muted-foreground h-4 w-4 shrink-0" />
                    {np.property.name}
                    {np.interest && (
                      <span className="text-muted-foreground text-xs">
                        — {np.interest}
                      </span>
                    )}
                  </p>
                ))}
              </div>
            )}

            {isOpen && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleClose(negotiation.id, 'WON')}
                >
                  Marcar ganho
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleClose(negotiation.id, 'LOST')}
                >
                  Marcar perda
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
