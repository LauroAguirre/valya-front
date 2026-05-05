'use client'

import { useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { UsersTable } from '@/components/company/users/UsersTable'
import { UserFormModal } from '@/components/company/users/UserFormModal'
import {
  ConstructionCompanyUsers,
} from '@/schemas/constructionCompanySchema'
import { loadCompanyUsers } from '@/services/api/company'
import { useUserProvider } from '@/providers/userProvider'

export default function CompanyUsersPage() {
  const { currentUser } = useUserProvider()
  const [users, setUsers] = useState<ConstructionCompanyUsers[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<ConstructionCompanyUsers | null>(null)

  const companyId = currentUser?.companyUsers?.[0]?.companyId ?? ''

  useEffect(() => {
    if (!companyId) return
    loadCompanyUsers(companyId).then(data => {
      if (data) setUsers(data)
    })
  }, [companyId])

  function handleAdd() {
    setEditingUser(null)
    setModalOpen(true)
  }

  function handleEdit(user: ConstructionCompanyUsers) {
    setEditingUser(user)
    setModalOpen(true)
  }

  function handleSuccess(saved: ConstructionCompanyUsers) {
    setUsers(prev => {
      const exists = prev.some(u => u.userId === saved.userId)
      return exists
        ? prev.map(u => (u.userId === saved.userId ? saved : u))
        : [...prev, saved]
    })
  }

  function handleRemoved(userId: string) {
    setUsers(prev => prev.filter(u => u.userId !== userId))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Usuários</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie os usuários da construtora e seus perfis de acesso
        </p>
      </div>

      <UsersTable
        companyId={companyId}
        users={users}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onRemoved={handleRemoved}
      />

      <UserFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        companyId={companyId}
        editingUser={editingUser}
        onSuccess={handleSuccess}
      />

      <Toaster />
    </div>
  )
}
