"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Camera, Save } from "lucide-react"
import { currentUser } from "@/lib/mock-data"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function PerfilPage() {
  const [user, setUser] = useState(currentUser)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    toast.success("Perfil atualizado com sucesso!")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais e comerciais</p>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-card lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/20 text-2xl text-primary">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
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
              <CardTitle className="text-base text-card-foreground">Dados pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Nome completo</Label>
                  <Input
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Telefone</Label>
                  <Input
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-card-foreground">Dados comerciais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>CRECI</Label>
                  <Input
                    value={user.creci ?? ""}
                    onChange={(e) => setUser({ ...user, creci: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Imobiliária</Label>
                  <Input
                    value={user.agency ?? ""}
                    onChange={(e) => setUser({ ...user, agency: e.target.value })}
                    className="bg-secondary"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={user.bio ?? ""}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    className="resize-none bg-secondary"
                    rows={4}
                    placeholder="Conte um pouco sobre você e sua experiência..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto sm:self-end">
            <Save className="mr-2 h-4 w-4" />
            Salvar alterações
          </Button>
        </div>
      </form>

      <Toaster />
    </div>
  )
}
