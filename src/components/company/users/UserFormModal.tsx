'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePromiseTracker } from 'react-promise-tracker'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  constructionCompanyUsersSchema,
  ConstructionCompanyUsersForm,
  ConstructionCompanyUsers,
  CompanyUserRole,
} from '@/schemas/constructionCompanySchema'
import { upsertCompanyUser } from '@/services/api/company'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  editingUser: ConstructionCompanyUsers | null
  onSuccess: (user: ConstructionCompanyUsers) => void
}

const roleLabels: Record<CompanyUserRole, string> = {
  [CompanyUserRole.ADMIN]: 'Admin',
  [CompanyUserRole.MANAGER]: 'Gerente',
  [CompanyUserRole.STANDARD]: 'Padrão',
}

export function UserFormModal({
  open,
  onOpenChange,
  companyId,
  editingUser,
  onSuccess,
}: Props) {
  const { promiseInProgress: saving } = usePromiseTracker({
    area: 'upsertingCompanyUser',
  })

  const form = useForm<ConstructionCompanyUsersForm>({
    resolver: zodResolver(constructionCompanyUsersSchema),
    defaultValues: {
      companyId,
      userId: '',
      role: CompanyUserRole.STANDARD,
      active: true,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        editingUser
          ? {
              companyId: editingUser.companyId,
              userId: editingUser.userId,
              role: editingUser.role,
              active: editingUser.active,
            }
          : { companyId, userId: '', role: CompanyUserRole.STANDARD, active: true },
      )
    }
  }, [open, editingUser, companyId, form])

  async function onSubmit(data: ConstructionCompanyUsersForm) {
    const result = await upsertCompanyUser(companyId, data)
    if (result) {
      toast.success(editingUser ? 'Usuário atualizado!' : 'Usuário adicionado!')
      onSuccess(result)
      onOpenChange(false)
    } else {
      toast.error('Erro ao salvar usuário.')
    }
  }

  const isEditing = !!editingUser

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar usuário' : 'Adicionar usuário'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail do usuário</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="usuario@email.com"
                      disabled={isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil de acesso</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CompanyUserRole.MANAGER}>
                        {roleLabels[CompanyUserRole.MANAGER]}
                      </SelectItem>
                      <SelectItem value={CompanyUserRole.STANDARD}>
                        {roleLabels[CompanyUserRole.STANDARD]}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="user-form"
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? 'Salvando...' : isEditing ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
