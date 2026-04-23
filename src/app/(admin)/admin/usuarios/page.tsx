'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { mockUsers } from '@/lib/mock-data'
import type { User } from '@/lib/types'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [search, setSearch] = useState('')

  const filtered = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  )

  function toggleUser(userId: string) {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updated = { ...u, isActive: !u.isActive }
          toast.success(
            updated.isActive
              ? `${u.name} ativado com sucesso`
              : `${u.name} desativado com sucesso`,
          )
          return updated
        }
        return u
      }),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground text-sm">
          {users.length} usuarios cadastrados
        </p>
      </div>

      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-secondary pl-10"
        />
      </div>

      <div className="border-border overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Nome</TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Funcao</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">
                Membro desde
              </TableHead>
              <TableHead className="text-muted-foreground text-right">
                Ativo
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(user => (
              <TableRow
                key={user.id}
                className="border-border hover:bg-secondary/50"
              >
                <TableCell className="text-foreground font-medium">
                  {user.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === 'admin' ? 'default' : 'secondary'}
                  >
                    {user.role === 'admin' ? 'Admin' : 'Cliente'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-primary' : 'bg-muted-foreground'}`}
                    />
                    <span className="text-muted-foreground text-sm">
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.createdAt}
                </TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={user.isActive}
                    onCheckedChange={() => toggleUser(user.id)}
                    aria-label={`${user.isActive ? 'Desativar' : 'Ativar'} ${user.name}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Toaster />
    </div>
  )
}
