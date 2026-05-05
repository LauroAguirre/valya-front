'use client'

import { useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { CompanySettingsForm } from '@/components/company/settings/CompanySettingsForm'
import { loadCompanyProfile } from '@/services/api/company'
import { ConstructionCompany } from '@/schemas/constructionCompanySchema'
import { useUserProvider } from '@/providers/userProvider'

export default function CompanySettingsPage() {
  const { currentUser } = useUserProvider()
  const [company, setCompany] = useState<ConstructionCompany | undefined>()

  useEffect(() => {
    const companyId = currentUser?.companyUsers?.[0]?.companyId
    if (!companyId) return

    loadCompanyProfile(companyId).then(data => {
      if (data) setCompany(data)
    })
  }, [currentUser])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie os dados e configurações da construtora
        </p>
      </div>

      <CompanySettingsForm company={company} />

      <Toaster />
    </div>
  )
}
