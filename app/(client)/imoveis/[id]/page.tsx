"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, ImageIcon, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockProperties, formatCurrency } from "@/lib/mock-data"

export default function ImovelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const property = mockProperties.find((p) => p.id === id) ?? mockProperties[0]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/imoveis">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{property.title}</h1>
          <p className="text-sm text-muted-foreground">
            {property.neighborhood}, {property.city} - {property.state}
          </p>
        </div>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="w-full justify-start bg-secondary">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="anuncios">Anuncios</TabsTrigger>
          <TabsTrigger value="imagens">Imagens</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-6">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Titulo</Label>
                  <Input defaultValue={property.title} className="bg-secondary" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Tipo</Label>
                  <Select defaultValue={property.type}>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="cobertura">Cobertura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Descricao</Label>
                  <Textarea defaultValue={property.description} className="resize-none bg-secondary" rows={3} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Endereco</Label>
                  <Input defaultValue={property.address} className="bg-secondary" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Bairro</Label>
                  <Input defaultValue={property.neighborhood} className="bg-secondary" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Cidade</Label>
                  <Input defaultValue={property.city} className="bg-secondary" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Estado</Label>
                  <Input defaultValue={property.state} className="bg-secondary" />
                </div>
                <div className="grid grid-cols-3 gap-3 sm:col-span-2">
                  <div className="flex flex-col gap-2">
                    <Label>Quartos</Label>
                    <Input type="number" defaultValue={property.bedrooms} className="bg-secondary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Banheiros</Label>
                    <Input type="number" defaultValue={property.bathrooms} className="bg-secondary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Area (m2)</Label>
                    <Input type="number" defaultValue={property.area} className="bg-secondary" />
                  </div>
                </div>
              </div>
              <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                Salvar alteracoes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-card-foreground">
                {property.isMultiUnit ? "Multiplas unidades" : "Unidade unica"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {property.isMultiUnit && property.units ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">Unidade</TableHead>
                        <TableHead className="text-muted-foreground">Area</TableHead>
                        <TableHead className="text-muted-foreground">Quartos</TableHead>
                        <TableHead className="text-right text-muted-foreground">Preco Venda</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {property.units.map((unit) => (
                        <TableRow key={unit.id} className="border-border">
                          <TableCell className="font-medium text-foreground">{unit.name}</TableCell>
                          <TableCell className="text-muted-foreground">{unit.area}m2</TableCell>
                          <TableCell className="text-muted-foreground">{unit.bedrooms}</TableCell>
                          <TableCell className="text-right text-foreground">
                            {unit.salePrice ? formatCurrency(unit.salePrice) : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={unit.status === "vendido" ? "outline" : unit.status === "reservado" ? "secondary" : "default"}>
                              {unit.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>Preco de venda</Label>
                    <Input
                      defaultValue={property.salePrice ?? ""}
                      placeholder="R$ 0"
                      className="bg-secondary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Preco de aluguel</Label>
                    <Input
                      defaultValue={property.rentPrice ?? ""}
                      placeholder="R$ 0/mes"
                      className="bg-secondary"
                    />
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 sm:col-span-2 sm:w-auto sm:justify-self-start">
                    Salvar valores
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anuncios" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-card-foreground">Anuncios em portais</CardTitle>
            </CardHeader>
            <CardContent>
              {property.announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum anuncio cadastrado.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {property.announcements.map((ann) => (
                    <div key={ann.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{ann.portal}</p>
                        <p className="text-xs text-muted-foreground">Publicado em {ann.publishedAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={ann.status === "ativo" ? "default" : "secondary"}>{ann.status}</Badge>
                        <a href={ann.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imagens" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-card-foreground">Fotos do imovel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/40">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-8 w-8" />
                  <p className="text-sm">Arraste imagens ou clique para fazer upload</p>
                  <p className="text-xs">JPG, PNG ou WebP. Max 5MB por imagem.</p>
                </div>
              </div>

              {property.images.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma imagem cadastrada.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {property.images.map((img) => (
                    <div key={img.id} className="overflow-hidden rounded-lg border border-border">
                      <div className="flex h-32 items-center justify-center bg-secondary">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-muted-foreground">{img.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
