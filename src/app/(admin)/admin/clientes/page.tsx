'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { mockClients, formatCurrency } from '@/lib/mock-data'
import type { Client } from '@/lib/types'

const statusVariant: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  ativo: 'default',
  trial: 'secondary',
  expirado: 'destructive',
  cancelado: 'outline',
}

export default function ClientesPage() {
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = mockClients.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  )

  function openClient(client: Client) {
    setSelectedClient(client)
    setSheetOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Clientes</h1>
        <p className="text-muted-foreground text-sm">
          {mockClients.length} clientes cadastrados
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
              <TableHead className="text-muted-foreground">Cliente</TableHead>
              <TableHead className="text-muted-foreground">
                Imobiliaria
              </TableHead>
              <TableHead className="text-muted-foreground">Plano</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">
                Leads
              </TableHead>
              <TableHead className="text-muted-foreground text-right">
                Imoveis
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(client => (
              <TableRow
                key={client.id}
                className="border-border hover:bg-secondary/50 cursor-pointer"
                onClick={() => openClient(client)}
              >
                <TableCell>
                  <div>
                    <p className="text-foreground font-medium">{client.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {client.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {client.agency}
                </TableCell>
                <TableCell>
                  <span className="text-foreground text-sm">
                    {client.plan.name}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      statusVariant[client.subscriptionStatus] ?? 'secondary'
                    }
                  >
                    {client.subscriptionStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground text-right">
                  {client.leadsCount}
                </TableCell>
                <TableCell className="text-foreground text-right">
                  {client.propertiesCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="bg-card w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle className="text-card-foreground">
              {selectedClient?.name}
            </SheetTitle>
            <SheetDescription>{selectedClient?.email}</SheetDescription>
          </SheetHeader>

          {selectedClient && (
            <Tabs defaultValue="cadastro" className="mt-4">
              <TabsList className="bg-secondary w-full">
                <TabsTrigger value="cadastro" className="flex-1">
                  Cadastro
                </TabsTrigger>
                <TabsTrigger value="plano" className="flex-1">
                  Plano
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cadastro" className="mt-4">
                <Card className="border-border bg-card">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground text-xs">Nome</p>
                          <p className="text-foreground text-sm font-medium">
                            {selectedClient.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Email</p>
                          <p className="text-foreground text-sm">
                            {selectedClient.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Telefone
                          </p>
                          <p className="text-foreground text-sm">
                            {selectedClient.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">CRECI</p>
                          <p className="text-foreground text-sm">
                            {selectedClient.creci}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Imobiliaria
                          </p>
                          <p className="text-foreground text-sm">
                            {selectedClient.agency}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Membro desde
                          </p>
                          <p className="text-foreground text-sm">
                            {selectedClient.createdAt}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Total de Leads
                          </p>
                          <p className="text-foreground text-lg font-bold">
                            {selectedClient.leadsCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Total de Imoveis
                          </p>
                          <p className="text-foreground text-lg font-bold">
                            {selectedClient.propertiesCount}
                          </p>
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
                          <p className="text-foreground text-sm font-medium">
                            Plano {selectedClient.plan.name}
                          </p>
                          <p className="text-foreground text-2xl font-bold">
                            {formatCurrency(selectedClient.plan.price)}
                            <span className="text-muted-foreground text-sm font-normal">
                              /mes
                            </span>
                          </p>
                        </div>
                        <Badge
                          variant={
                            statusVariant[selectedClient.subscriptionStatus] ??
                            'secondary'
                          }
                        >
                          {selectedClient.subscriptionStatus}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground mt-3 flex items-center gap-4 text-sm">
                        <span>
                          Expira em {selectedClient.daysToExpire} dias
                        </span>
                        <span>
                          Cartao:{' '}
                          {selectedClient.hasCard
                            ? 'Cadastrado'
                            : 'Nao cadastrado'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card">
                    <CardContent className="pt-6">
                      <p className="text-card-foreground mb-4 text-sm font-medium">
                        Historico de Pagamentos
                      </p>
                      {selectedClient.payments.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                          Nenhum pagamento registrado.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border">
                                <TableHead className="text-muted-foreground">
                                  Data
                                </TableHead>
                                <TableHead className="text-muted-foreground">
                                  Metodo
                                </TableHead>
                                <TableHead className="text-muted-foreground text-right">
                                  Valor
                                </TableHead>
                                <TableHead className="text-muted-foreground">
                                  Status
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedClient.payments.map(payment => (
                                <TableRow
                                  key={payment.id}
                                  className="border-border"
                                >
                                  <TableCell className="text-foreground">
                                    {payment.date}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {payment.method}
                                  </TableCell>
                                  <TableCell className="text-foreground text-right">
                                    {formatCurrency(payment.amount)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        payment.status === 'pago'
                                          ? 'default'
                                          : payment.status === 'pendente'
                                            ? 'secondary'
                                            : 'destructive'
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
