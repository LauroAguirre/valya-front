'use client'

import { ChevronLeft, ChevronRight, Loader2, UserMinus } from 'lucide-react'
import { usePromiseTracker } from 'react-promise-tracker'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'
import { removeCompanyAgent } from '@/services/agents/removeCompanyAgent'

interface Props {
  agents: RealStateAgent[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onRemoved: (agentId: string) => void
  onAdd: () => void
}

function getInitials(name?: string) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
}

export function AgentsList({
  agents,
  page,
  totalPages,
  onPageChange,
  onRemoved,
  onAdd,
}: Props) {
  const { promiseInProgress: loading } = usePromiseTracker({
    area: 'loadingCompanyAgents',
    delay: 0,
  })
  const { promiseInProgress: removing } = usePromiseTracker({
    area: 'removingAgent',
    delay: 0,
  })

  async function handleRemove(agentId: string, name: string) {
    const ok = await removeCompanyAgent(agentId)
    if (ok) {
      toast.success(`${name} removido.`)
      onRemoved(agentId)
    } else {
      toast.error('Erro ao remover corretor.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground font-semibold">
            Corretores vinculados
          </h2>
          <p className="text-muted-foreground text-sm">
            {agents.length > 0
              ? `${agents.length} corretor(es) nesta página`
              : 'Nenhum corretor vinculado ainda'}
          </p>
        </div>
        <Button
          onClick={onAdd}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Adicionar Corretor
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <div className="text-muted-foreground border-border rounded-md border border-dashed py-16 text-center text-sm">
          Nenhum corretor vinculado. Clique em &quot;Adicionar Corretor&quot;
          para começar.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map(agent => (
            <Card key={agent.id} className="border-border bg-card">
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="size-10 shrink-0">
                  <AvatarImage
                    src={agent.user?.avatarUrl ?? ''}
                    alt={agent.user?.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {getInitials(agent.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate font-medium">
                    {agent.user?.name ?? '—'}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {[agent.city, agent.uf].filter(Boolean).join('/') || '—'}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive shrink-0"
                  onClick={() =>
                    handleRemove(agent.id ?? '', agent.user?.name ?? 'Corretor')
                  }
                  disabled={removing}
                  aria-label="Remover corretor"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
