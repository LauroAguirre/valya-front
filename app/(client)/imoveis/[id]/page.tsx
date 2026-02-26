"use client"

import { use, useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Upload, ImageIcon, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { mockProperties, formatCurrency } from "@/lib/mock-data"
import type { PropertyImage, AdLink } from "@/lib/types"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function ImovelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const property = mockProperties.find((p) => p.id === id) ?? mockProperties[0]

  const [unitType, setUnitType] = useState(property.isMultiUnit ? "multipla" : "unica")
  const [images, setImages] = useState<PropertyImage[]>(property.images)
  const [adLinks, setAdLinks] = useState<AdLink[]>(property.adLinks)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    const newImages: PropertyImage[] = Array.from(files).map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      description: "",
    }))
    setImages([...images, ...newImages])
    toast.success(`${files.length} imagem(ns) adicionada(s)`)
  }

  function removeImage(imgId: string) {
    setImages(images.filter((img) => img.id !== imgId))
  }

  function updateImageDescription(imgId: string, description: string) {
    setImages(images.map((img) => (img.id === imgId ? { ...img, description } : img)))
  }

  function addAdLink() {
    setAdLinks([
      ...adLinks,
      { id: `ad-${Date.now()}`, platform: "facebook", campaignName: "", url: "" },
    ])
  }

  function removeAdLink(linkId: string) {
    setAdLinks(adLinks.filter((l) => l.id !== linkId))
  }

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
        <TabsList className="w-full justify-start">
          <TabsTrigger value="geral">Cadastro Geral</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="anuncios">Anuncios</TabsTrigger>
          <TabsTrigger value="imagens">Imagens</TabsTrigger>
        </TabsList>

        {/* ---- ABA GERAL ---- */}
        <TabsContent value="geral" className="mt-6">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Nome do empreendimento</Label>
                  <Input defaultValue={property.title} className="bg-secondary" />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Endereco</Label>
                  <Input defaultValue={property.address} className="bg-secondary" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Quantidade de dormitorios</Label>
                  <Input type="number" defaultValue={property.bedrooms} className="bg-secondary" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Garagens (quantidade)</Label>
                  <Input type="number" defaultValue={property.parkingSpaces} className="bg-secondary" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Garagem tipo</Label>
                  <Select defaultValue={property.parkingType}>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coberta">Coberta</SelectItem>
                      <SelectItem value="descoberta">Descoberta</SelectItem>
                      <SelectItem value="mista">Mista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Nro banheiros</Label>
                  <Input type="number" defaultValue={property.bathrooms} className="bg-secondary" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Churrasqueira</Label>
                  <Select defaultValue={property.bbqType}>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nenhuma">Nenhuma</SelectItem>
                      <SelectItem value="carvao">Carvao</SelectItem>
                      <SelectItem value="eletrica">Eletrica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Area privativa (m2)</Label>
                  <Input type="number" defaultValue={property.privateArea ?? property.area} className="bg-secondary" />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Descricao geral do imovel</Label>
                  <Textarea defaultValue={property.description} className="resize-none bg-secondary" rows={4} />
                </div>
              </div>
              <Button className="mt-6">
                Salvar alteracoes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- ABA FINANCEIRO ---- */}
        <TabsContent value="financeiro" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-card-foreground">Tipo de empreendimento</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <RadioGroup value={unitType} onValueChange={setUnitType} className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="unica" id="unica" />
                  <Label htmlFor="unica" className="cursor-pointer">Unidade unica</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="multipla" id="multipla" />
                  <Label htmlFor="multipla" className="cursor-pointer">Multiplas unidades</Label>
                </div>
              </RadioGroup>

              {unitType === "unica" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>Valor total</Label>
                    <Input defaultValue={property.salePrice ?? ""} placeholder="R$ 0" className="bg-secondary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Entrada minima</Label>
                    <Input placeholder="R$ 0 (opcional)" className="bg-secondary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Parcelas</Label>
                    <Input placeholder="Qtd de parcelas (opcional)" className="bg-secondary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Reforco anual</Label>
                    <Input placeholder="R$ 0 (opcional)" className="bg-secondary" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground">Unidade/Apto</TableHead>
                          <TableHead className="text-muted-foreground">Dorms</TableHead>
                          <TableHead className="text-muted-foreground">Garagem</TableHead>
                          <TableHead className="text-muted-foreground">Area Priv.</TableHead>
                          <TableHead className="text-muted-foreground">Area Gar.</TableHead>
                          <TableHead className="text-muted-foreground">Area Total</TableHead>
                          <TableHead className="text-right text-muted-foreground">Entrada</TableHead>
                          <TableHead className="text-right text-muted-foreground">Reforco Anual</TableHead>
                          <TableHead className="text-right text-muted-foreground">Vlr Parcela</TableHead>
                          <TableHead className="text-muted-foreground">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {property.units?.map((unit) => (
                          <TableRow key={unit.id} className="border-border">
                            <TableCell className="font-medium text-foreground">{unit.name}</TableCell>
                            <TableCell className="text-muted-foreground">{unit.bedrooms}</TableCell>
                            <TableCell className="text-muted-foreground">{unit.parkingSpaces}</TableCell>
                            <TableCell className="text-muted-foreground">{unit.privateArea}m2</TableCell>
                            <TableCell className="text-muted-foreground">{unit.parkingArea}m2</TableCell>
                            <TableCell className="text-muted-foreground">{unit.totalArea}m2</TableCell>
                            <TableCell className="text-right text-foreground">
                              {unit.downPayment ? formatCurrency(unit.downPayment) : "-"}
                            </TableCell>
                            <TableCell className="text-right text-foreground">
                              {unit.annualBonus ? formatCurrency(unit.annualBonus) : "-"}
                            </TableCell>
                            <TableCell className="text-right text-foreground">
                              {unit.installmentValue ? formatCurrency(unit.installmentValue) : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={unit.status === "vendido" ? "outline" : unit.status === "reservado" ? "secondary" : "default"}>
                                {unit.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )) ?? (
                          <TableRow>
                            <TableCell colSpan={10} className="text-center text-muted-foreground">
                              Nenhuma unidade cadastrada.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <Button variant="outline" size="sm" className="self-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar unidade
                  </Button>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Condicoes para pagamento</Label>
                  <Textarea
                    defaultValue={property.financialNotes ?? ""}
                    className="resize-none bg-secondary"
                    rows={3}
                    placeholder="Descreva as condicoes de pagamento..."
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Opcoes de pagamento</Label>
                  <Textarea
                    defaultValue={property.paymentOptions ?? ""}
                    className="resize-none bg-secondary"
                    rows={3}
                    placeholder="Descreva as opcoes de pagamento aceitas..."
                  />
                </div>
              </div>

              <Button className="self-start">
                Salvar financeiro
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- ABA ANUNCIOS ---- */}
        <TabsContent value="anuncios" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base text-card-foreground">Vincular anuncios de redes sociais</CardTitle>
              <Button variant="outline" size="sm" onClick={addAdLink}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar anuncio
              </Button>
            </CardHeader>
            <CardContent>
              {adLinks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum anuncio vinculado. Clique em &quot;Adicionar anuncio&quot; para vincular uma campanha do Facebook, Instagram ou TikTok.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {adLinks.map((link, index) => (
                    <div key={link.id} className="flex flex-col gap-3 rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">Anuncio {index + 1}</p>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeAdLink(link.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="flex flex-col gap-2">
                          <Label>Plataforma</Label>
                          <Select defaultValue={link.platform}>
                            <SelectTrigger className="bg-secondary">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="tiktok">TikTok</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>Nome da campanha</Label>
                          <Input defaultValue={link.campaignName} placeholder="Nome da campanha" className="bg-secondary" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>URL do anuncio</Label>
                          <div className="flex gap-2">
                            <Input defaultValue={link.url} placeholder="https://..." className="bg-secondary" />
                            {link.url && (
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:text-primary/80">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- ABA IMAGENS ---- */}
        <TabsContent value="imagens" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-card-foreground">Galeria de imagens do imovel</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mb-6 flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-8 w-8" />
                  <p className="text-sm font-medium">Arraste imagens ou clique para fazer upload</p>
                  <p className="text-xs">JPG, PNG ou WebP. Multiplas imagens de uma vez.</p>
                </div>
              </button>

              {images.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma imagem cadastrada.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((img) => (
                    <div key={img.id} className="overflow-hidden rounded-lg border border-border">
                      <div className="relative flex h-36 items-center justify-center bg-secondary">
                        {img.url.startsWith("blob:") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img.url} alt={img.description || "Imagem do imovel"} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-7 w-7 bg-card/80 text-muted-foreground hover:text-destructive"
                          onClick={() => removeImage(img.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="p-3">
                        <Input
                          value={img.description}
                          onChange={(e) => updateImageDescription(img.id, e.target.value)}
                          placeholder="Descricao da imagem..."
                          className="h-8 bg-secondary text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}
