'use client'

import { Pencil, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ConstructionCompanyUsers,
  CompanyUserRole,
} from '@/schemas/constructionCompanySchema'
import { removeCompanyUser } from '@/services/api/company'

interface Props {
  companyId: string
  users: ConstructionCompanyUsers[]
  onEdit: (user: ConstructionCompanyUsers) => void
  onAdd: () => void
  onRemoved: (userId: string) => void
}

const roleLabels: Record<CompanyUserRole, string> = {
  [CompanyUserRole.ADMIN]: 'Admin',
  [CompanyUserRole.MANAGER]: 'Gerente',
  [CompanyUserRole.STANDARD]: 'Padrão',
}

const roleVariants: Record<
  CompanyUserRole,
  'default' | 'secondary' | 'outline'
> = {
  [CompanyUserRole.ADMIN]: 'default',
  [CompanyUserRole.MANAGER]: 'secondary',
  [CompanyUserRole.STANDARD]: 'outline',
}

export function UsersTable({ companyId, users, onEdit, onAdd, onRemoved }: Props) {
  async function handleRemove(userId: string) {
    const ok = await removeCompanyUser(companyId, userId)
    if (ok) {
      toast.success('Usuário removido.')
      onRemoved(userId)
    } else {
      toast.error('Erro ao remover usuário.')
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground text-base">
          Usuários da construtora
        </CardTitle>
        <Button
          size="sm"
          onClick={onAdd}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar usuário
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-8 text-center"
                >
                  Nenhum usuário cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map(u => (
                <TableRow key={u.userId}>
                  <TableCell className="font-medium">
                    {u.user?.name ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.user?.email ?? u.userId}
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleVariants[u.role]}>
                      {roleLabels[u.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.active ? 'default' : 'outline'}>
                      {u.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(u)}
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {u.role !== CompanyUserRole.ADMIN && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemove(u.userId)}
                          aria-label="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
