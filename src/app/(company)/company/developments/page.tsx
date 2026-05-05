'use client'

import { useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { DevelopmentsTable } from '@/components/company/developments/DevelopmentsTable'
import { DevelopmentFormModal } from '@/components/company/developments/DevelopmentFormModal'
import { Property } from '@/schemas/propertySchema'
import { loadDevelopments } from '@/services/api/developments'
import { useUserProvider } from '@/providers/userProvider'

export default function DevelopmentsPage() {
  const { currentUser } = useUserProvider()
  const [developments, setDevelopments] = useState<Property[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  const companyId = currentUser?.companyUsers?.[0]?.companyId ?? ''

  useEffect(() => {
    if (!companyId) return
    loadDevelopments(companyId).then(data => {
      if (data) setDevelopments(data)
    })
  }, [companyId])

  function handleSuccess(dev: Property) {
    setDevelopments(prev => {
      const exists = prev.some(d => d.id === dev.id)
      return exists ? prev.map(d => (d.id === dev.id ? dev : d)) : [...prev, dev]
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Empreendimentos</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie os empreendimentos e unidades da construtora
        </p>
      </div>

      <DevelopmentsTable
        developments={developments}
        onAdd={() => setModalOpen(true)}
      />

      <DevelopmentFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        companyId={companyId}
        onSuccess={handleSuccess}
      />

      <Toaster />
    </div>
  )
}
