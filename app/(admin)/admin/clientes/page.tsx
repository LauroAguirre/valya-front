"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { mockClients, formatCurrency } from "@/lib/mock-data"
import type { Client } from "@/lib/types"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ativo: "default",
  trial: "secondary",
  expirado: "destructive",
  cancelado: "outline",
}

export default function ClientesPage() {
  const [search, setSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = mockClients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  function openClient(client: Client) {
    setSelectedClient(client)
    setSheetOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground">{mockClients.length} clientes cadastrados</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-secondary pl-10"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Cliente</TableHead>
              <TableHead className="text-muted-foreground">Imobiliaria</TableHead>
              <TableHead className="text-muted-foreground">Plano</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-right text-muted-foreground">Leads</TableHead>
              <TableHead className="text-right text-muted-foreground">Imoveis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((client) => (
              <TableRow
                key={client.id}
                className="cursor-pointer border-border hover:bg-secondary/50"
                onClick={() => openClient(client)}
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{client.agency}</TableCell>
                <TableCell>
                  <span className="text-sm text-foreground">{client.plan.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[client.subscriptionStatus] ?? "secondary"}>
                    {client.subscriptionStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-foreground">{client.leadsCount}</TableCell>
                <TableCell className="text-right text-foreground">{client.propertiesCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto bg-card sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle className="text-card-foreground">{selectedClient?.name}</SheetTitle>
            <SheetDescription>{selectedClient?.email}</SheetDescription>
          </SheetHeader>

          {selectedClient && (
            <Tabs defaultValue="cadastro" className="mt-4">
              <TabsList className="w-full bg-secondary">
                <TabsTrigger value="cadastro" className="flex-1">Cadastro</TabsTrigger>
                <TabsTrigger value="plano" className="flex-1">Plano</TabsTrigger>
              </TabsList>

              <TabsContent value="cadastro" className="mt-4">
                <Card className="border-border bg-card">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Nome</p>
                          <p className="text-sm font-medium text-foreground">{selectedClient.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm text-foreground">{selectedClient.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Telefone</p>
                          <p className="text-sm text-foreground">{selectedClient.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">CRECI</p>
                          <p className="text-sm text-foreground">{selectedClient.creci}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Imobiliaria</p>
                          <p className="text-sm text-foreground">{selectedClient.agency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Membro desde</p>
                          <p className="text-sm text-foreground">{selectedClient.createdAt}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Total de Leads</p>
                          <p className="text-lg font-bold text-foreground">{selectedClient.leadsCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total de Imoveis</p>
                          <p className="text-lg font-bold text-foreground">{selectedClient.propertiesCount}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="plano" className="mt-4">
                <div className="flex flex-col gap-4">
                  <Card className="border-border bg-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Plano {selectedClient.plan.name}</p>
                          <p className="text-2xl font-bold text-foreground">
                            {formatCurrency(selectedClient.plan.price)}
                            <span className="text-sm font-normal text-muted-foreground">/mes</span>
                          </p>
                        </div>
                        <Badge variant={statusVariant[selectedClient.subscriptionStatus] ?? "secondary"}>
                          {selectedClient.subscriptionStatus}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Expira em {selectedClient.daysToExpire} dias</span>
                        <span>Cartao: {selectedClient.hasCard ? "Cadastrado" : "Nao cadastrado"}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card">
                    <CardContent className="pt-6">
                      <p className="mb-4 text-sm font-medium text-card-foreground">Historico de Pagamentos</p>
                      {selectedClient.payments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhum pagamento registrado.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border">
                                <TableHead className="text-muted-foreground">Data</TableHead>
                                <TableHead className="text-muted-foreground">Metodo</TableHead>
                                <TableHead className="text-right text-muted-foreground">Valor</TableHead>
                                <TableHead className="text-muted-foreground">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedClient.payments.map((payment) => (
                                <TableRow key={payment.id} className="border-border">
                                  <TableCell className="text-foreground">{payment.date}</TableCell>
                                  <TableCell className="text-muted-foreground">{payment.method}</TableCell>
                                  <TableCell className="text-right text-foreground">
                                    {formatCurrency(payment.amount)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        payment.status === "pago"
                                          ? "default"
                                          : payment.status === "pendente"
                                            ? "secondary"
                                            : "destructive"
                                      }
                                    >
                                      {payment.status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
