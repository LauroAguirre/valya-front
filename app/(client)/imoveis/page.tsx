"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockProperties, formatCurrency } from "@/lib/mock-data"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ativo: { label: "Ativo", variant: "default" },
  inativo: { label: "Inativo", variant: "secondary" },
  vendido: { label: "Vendido", variant: "outline" },
  alugado: { label: "Alugado", variant: "outline" },
}

export default function ImoveisPage() {
  const [search, setSearch] = useState("")

  const filtered = mockProperties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Imóveis / Empreendimentos</h1>
          <p className="text-sm text-muted-foreground">{mockProperties.length} imóveis cadastrados</p>
        </div>
        <Button asChild>
          <Link href="/imoveis/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Imóvel
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, bairro ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-secondary pl-10"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Empreendimento</TableHead>
              <TableHead className="text-muted-foreground">Dorms</TableHead>
              <TableHead className="text-muted-foreground">Localização</TableHead>
              <TableHead className="text-right text-muted-foreground">Preço</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((property) => (
              <TableRow key={property.id} className="border-border hover:bg-secondary/50">
                <TableCell>
                  <Link href={`/imoveis/${property.id}`} className="font-medium text-foreground hover:text-primary">
                    {property.title}
                  </Link>
                  {property.isMultiUnit && (
                    <Badge variant="secondary" className="ml-2 text-[10px]">Múltiplas unid.</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{property.bedrooms || "-"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {property.neighborhood}, {property.city}
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {property.salePrice
                    ? formatCurrency(property.salePrice)
                    : property.rentPrice
                      ? `${formatCurrency(property.rentPrice)}/mes`
                      : "Consultar"}
                </TableCell>
                <TableCell>
                  <Badge variant={statusMap[property.status]?.variant ?? "secondary"}>
                    {statusMap[property.status]?.label ?? property.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
