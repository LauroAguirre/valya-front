'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { BrokerSearchPanel } from '@/components/company/brokers/BrokerSearchPanel'
import { BrokerPoolList } from '@/components/company/brokers/BrokerPoolList'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'
import { searchBrokers } from '@/services/brokers/searchBrokers'
import { loadPoolBrokers } from '@/services/brokers/loadPoolBrokers'
import { assignBrokerToPool } from '@/services/brokers/assignBrokerToPool'
import { useUserProvider } from '@/providers/userProvider'

const SEARCH_DEBOUNCE_MS = 400

export default function BrokersPage() {
  const { currentUser } = useUserProvider()
  const companyId = currentUser?.companyUsers?.[0]?.companyId ?? ''

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<RealStateAgent[]>([])
  const [pool, setPool] = useState<RealStateAgent[]>([])

  const poolIds = new Set(pool.map(a => a.id ?? ''))

  useEffect(() => {
    if (!companyId) return
    loadPoolBrokers(companyId).then(data => setPool(data))
  }, [companyId])

  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(() => {
      searchBrokers(query).then(setSearchResults)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [query])

  const handleAdd = useCallback(
    async (agent: RealStateAgent) => {
      const result = await assignBrokerToPool(companyId, agent.id ?? '')
      if (result) {
        toast.success(`${agent.user?.name ?? 'Corretor'} adicionado ao pool.`)
        setPool(prev => [...prev, result])
      } else {
        toast.error('Erro ao adicionar corretor.')
      }
    },
    [companyId],
  )

  const handleRemoved = useCallback((agentId: string) => {
    setPool(prev => prev.filter(a => a.id !== agentId))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          Gestão de Corretores
        </h1>
        <p className="text-muted-foreground text-sm">
          Busque e adicione corretores ao pool desta construtora
        </p>
      </div>

      <BrokerSearchPanel
        query={query}
        onQueryChange={setQuery}
        results={searchResults}
        poolIds={poolIds}
        onAdd={handleAdd}
      />

      <BrokerPoolList
        companyId={companyId}
        brokers={pool}
        onRemoved={handleRemoved}
      />

      <Toaster />
    </div>
  )
}
