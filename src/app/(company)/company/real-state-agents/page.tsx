'use client'

import { useCallback, useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { AgentsList } from '@/components/company/real-state-agents/AgentsList'
import { AddAgentDrawer } from '@/components/company/real-state-agents/AddAgentDrawer'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'
import {
  loadCompanyAgents,
  PaginatedAgents,
} from '@/services/agents/loadCompanyAgents'
import { useUserProvider } from '@/providers/userProvider'

export default function RealStateAgentsPage() {
  const { currentUser } = useUserProvider()
  const companyId = currentUser?.companyUsers?.[0]?.companyId ?? ''

  const [agents, setAgents] = useState<RealStateAgent[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const fetchAgents = useCallback(
    async (p: number) => {
      if (!companyId) return
      const result: PaginatedAgents | undefined = await loadCompanyAgents(
        companyId,
        p,
      )
      if (result) {
        setAgents(result.data)
        setTotalPages(result.totalPages)
        setPage(result.page)
      }
    },
    [companyId],
  )

  useEffect(() => {
    fetchAgents(1)
  }, [fetchAgents])

  function handlePageChange(newPage: number) {
    fetchAgents(newPage)
  }

  function handleRemoved(agentId: string) {
    setAgents(prev => prev.filter(a => a.id !== agentId))
  }

  function handleAgentLinked(agent: RealStateAgent) {
    setAgents(prev => {
      const exists = prev.some(a => a.id === agent.id)
      return exists ? prev : [agent, ...prev]
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Corretores</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie os corretores vinculados a esta construtora
        </p>
      </div>

      <AgentsList
        agents={agents}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onRemoved={handleRemoved}
        onAdd={() => setDrawerOpen(true)}
      />

      <AddAgentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        companyId={companyId}
        onAgentLinked={handleAgentLinked}
      />

      <Toaster />
    </div>
  )
}
