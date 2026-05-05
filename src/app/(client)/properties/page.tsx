'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Toaster } from '@/components/ui/sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/mock-data'
import { Property } from '@/schemas/propertySchema'
import { loadPropertiesPage } from '@/services/properties/loadProperties'
import { optOutProperty } from '@/services/properties/optOutProperty'
import { usePromiseTracker } from 'react-promise-tracker'
import { Spinner } from '@/components/ui/spinner'

export default function PropertiesPage() {
  const [search, setSearch] = useState('')
  const [properties, setProperties] = useState<Property[]>([])
  const { promiseInProgress: loadingProperties } = usePromiseTracker({
    area: 'loadingProperties',
    delay: 0,
  })

  const filtered = properties.filter(
    p =>
      (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
      (p.address && p.address.toLowerCase().includes(search.toLowerCase())),
  )

  useEffect(() => {
    getProperties(1, search)
  }, [search])

  useEffect(() => {
    getProperties(1)
  }, [])

  const getProperties = async (page: number, search?: string) => {
    const prop = await loadPropertiesPage(page, search)
    setProperties(prop.data as Property[])
  }

  async function handleOptOut(property: Property, checked: boolean) {
    const id = property.id
    if (!id) return

    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, optedOut: !checked } : p)),
    )

    const ok = await optOutProperty(id, !checked)
    if (!ok) {
      setProperties(prev =>
        prev.map(p => (p.id === id ? { ...p, optedOut: checked } : p)),
      )
      toast.error('Erro ao atualizar visibilidade do imóvel.')
    }
  }

  const hasConstructorProperties = filtered.some(p => !!p.companyId)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Imoveis / Empreendimentos
          </h1>
          <p className="text-muted-foreground text-sm">
            {properties.length} imoveis cadastrados
          </p>
        </div>
        <Button asChild>
          <Link
            href="/properties/_"
            className="bg-secondary text-primary-foreground flex items-center gap-1 rounded-md p-2 text-sm font-medium transition-all hover:opacity-80"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Imóvel
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nome, bairro ou cidade..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border-border overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">
                Empreendimento
              </TableHead>
              <TableHead className="text-muted-foreground">Dorms</TableHead>
              <TableHead className="text-muted-foreground">
                Localizacao
              </TableHead>
              <TableHead className="text-muted-foreground text-right">
                Preco
              </TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              {hasConstructorProperties && (
                <TableHead className="text-muted-foreground text-center">
                  Visível
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(property => (
              <TableRow
                key={property.id}
                className="border-border hover:bg-secondary/50"
              >
                <TableCell>
                  <Link
                    href={`/properties/${property.id}`}
                    className="text-foreground hover:text-primary font-medium"
                  >
                    {property.name}
                  </Link>
                  {property.units && property.units.length > 1 && (
                    <Badge variant="secondary" className="ml-2 text-[10px]">
                      Multiplas unid.
                    </Badge>
                  )}
                  {property.companyId && (
                    <Badge variant="outline" className="ml-2 text-[10px]">
                      Construtora
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {property.bedrooms || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {property.neighborhood}, {property.city}
                </TableCell>
                <TableCell className="text-foreground text-right">
                  {property.totalPrice
                    ? formatCurrency(property.totalPrice)
                    : 'Consultar'}
                </TableCell>
                <TableCell />
                {hasConstructorProperties && (
                  <TableCell className="text-center">
                    {property.companyId ? (
                      <Switch
                        checked={!property.optedOut}
                        onCheckedChange={checked =>
                          handleOptOut(property, checked)
                        }
                        aria-label={
                          property.optedOut
                            ? 'Reativar imóvel'
                            : 'Ocultar imóvel'
                        }
                      />
                    ) : null}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loadingProperties && (
          <div className="flex justify-center gap-2">
            <div className="flex items-center px-2">
              <Spinner className="size-4" />
            </div>
            <span>Carregando lista de propriedades </span>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  )
}
