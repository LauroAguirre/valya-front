'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Camera, Save } from 'lucide-react'
import { currentUser } from '@/lib/mock-data'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

export default function PerfilPage() {
  const [user, setUser] = useState(currentUser)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    toast.success('Perfil atualizado com sucesso!')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie suas informacoes pessoais e comerciais
        </p>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-card lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="border-border bg-card text-muted-foreground hover:text-foreground absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-foreground font-semibold">{user.name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
            <Separator />
            <div className="w-full text-sm">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">CRECI</span>
                <span className="text-foreground">{user.creci}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Membro desde</span>
                <span className="text-foreground">{user.createdAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground text-base">
                Dados pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Nome completo</Label>
                  <Input
                    value={user.name}
                    onChange={e => setUser({ ...user, name: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Telefone</Label>
                  <Input
                    value={user.phone}
                    onChange={e => setUser({ ...user, phone: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground text-base">
                Dados comerciais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>CRECI</Label>
                  <Input
                    value={user.creci ?? ''}
                    onChange={e => setUser({ ...user, creci: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Imobiliaria</Label>
                  <Input
                    value={user.agency ?? ''}
                    onChange={e => setUser({ ...user, agency: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={user.bio ?? ''}
                    onChange={e => setUser({ ...user, bio: e.target.value })}
                    className="bg-secondary resize-none"
                    rows={4}
                    placeholder="Conte um pouco sobre voce e sua experiencia..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto sm:self-end"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar alteracoes
          </Button>
        </div>
      </form>

      <Toaster />
    </div>
  )
}
