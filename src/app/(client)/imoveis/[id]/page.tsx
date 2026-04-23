'use client'

import { use, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Upload,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatCurrency } from '@/lib/mock-data'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import {
  BbqType,
  GarageType,
  Property,
  PropertyForm,
  PropertyMode,
  propertySchema,
} from '@/schemas/propertySchema'
import { loadProperty } from '@/services/properties/loadProperty'
import { PropertyImage, propertyImageSchema } from '@/schemas/propertyImages'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  PropertyAdLink,
  propertyAdLinkSchema,
} from '@/schemas/propertyAdLinkSchema'

import { PropertyGeneralTab } from '@/components/client/property/generalTab'
import { saveProperty } from '@/services/properties/saveProperty'
import { useUserProvider } from '@/providers/userProvider'
import { InputNumber } from '@/components/ui/inputNumber'

export interface PropertyFields extends PropertyForm {
  images?: PropertyImage[]
  adLinks?: PropertyAdLink[]
}

const formSchema = propertySchema
  .extend({
    images: propertyImageSchema.array().optional(),
    adLinks: propertyAdLinkSchema.array().optional(),
  })
  .refine(schema => schema.name && schema.name.length > 1, {
    message: 'Informe o nome do imóvel/empreendimento',
    path: ['name'],
  })
  .refine(schema => !!schema.bbqType, {
    message: 'Informe o tipo de churrasqueira.',
    path: ['bbqType'],
  })

export default function ImovelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const ctxUser = useUserProvider()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [property, setProperty] = useState<Property | undefined>(undefined)

  const form = useForm<PropertyFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      userId: undefined,
      name: '',
      address: '',
      bedrooms: undefined,
      garageCount: undefined,
      garageType: GarageType.NONE,
      bathrooms: undefined,
      bbqType: BbqType.NONE,
      description: '',
      privateArea: undefined,
      mode: PropertyMode.SINGLE,
      purpose: undefined,
      type: undefined,
      neighborhood: undefined,
      city: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      totalPrice: undefined,
      minDown: undefined,
      installments: undefined,
      annualBoost: undefined,
      installmentValue: undefined,
      paymentConditions: '',
      paymentOptions: '',
      images: [],
      adLinks: [],
    },
  })

  const { fields: adLinkFields, append: appendAdLink, remove: removeAdLink } =
    useFieldArray({ control: form.control, name: 'adLinks' })

  const { fields: imageFields, append: appendImage, remove: removeImage } =
    useFieldArray({ control: form.control, name: 'images' })

  const propertyMode = form.watch('mode')

  useEffect(() => {
    if (id && id !== '_') {
      loadProperty(id).then(details => {
        if (details) {
          setProperty(details)
          form.reset({
            ...details,
            name: details.name ?? '',
            address: details.address ?? '',
            description: details.description ?? '',
            paymentConditions: details.paymentConditions ?? '',
            paymentOptions: details.paymentOptions ?? '',
            mode: details.mode ?? PropertyMode.SINGLE,
            garageType: details.garageType ?? GarageType.NONE,
            bbqType: details.bbqType ?? BbqType.NONE,
            images: details.images ?? [],
            adLinks: details.adLinks ?? [],
          })
        }
      })
    }
  }, [id])

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file, i) => {
      appendImage({
        id: `new-${Date.now()}-${i}`,
        url: URL.createObjectURL(file),
        description: '',
        createdAt: new Date(),
      })
    })
    toast.success(`${files.length} imagem(ns) adicionada(s)`)
  }

  const save = async (fields: PropertyFields) => {
    fields.userId = ctxUser.currentUser?.id
    const newProperty = await saveProperty(fields)
    if (newProperty?.id) {
      toast.success('Cadastro realizado com sucesso.')
    } else {
      toast.error(
        'Falha ao salvar os dados do imóvel. Por favor entre em contato com nosso suporte.',
      )
    }
  }

  const onInvalid = (errors: unknown) => console.error(errors)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/imoveis">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            {property?.name}
          </h1>
          <p className="text-muted-foreground text-sm">{property?.address}</p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(save, onInvalid)}
          className="flex flex-col gap-4"
        >
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="geral">Cadastro Geral</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              <TabsTrigger value="anuncios">Anuncios</TabsTrigger>
              <TabsTrigger value="imagens">Imagens</TabsTrigger>
            </TabsList>

            {/* ---- ABA GERAL ---- */}
            <TabsContent value="geral" className="mt-6">
              <PropertyGeneralTab form={form} />
            </TabsContent>

            {/* ---- ABA FINANCEIRO ---- */}
            <TabsContent value="financeiro" className="mt-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground text-base">
                    Tipo de empreendimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            value={field.value ?? PropertyMode.SINGLE}
                            onValueChange={field.onChange}
                            className="flex gap-6"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value={PropertyMode.SINGLE}
                                id="unica"
                              />
                              <Label htmlFor="unica" className="cursor-pointer">
                                Unidade unica
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value={PropertyMode.MULTIPLE}
                                id="multipla"
                              />
                              <Label
                                htmlFor="multipla"
                                className="cursor-pointer"
                              >
                                Multiplas unidades
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {propertyMode !== PropertyMode.MULTIPLE ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="totalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor total</FormLabel>
                            <FormControl>
                              <InputNumber
                                value={field.value ?? ''}
                                placeholder="R$ 0"
                                className="bg-secondary"
                                onValueChange={values =>
                                  field.onChange(values.floatValue ?? undefined)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="minDown"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entrada minima</FormLabel>
                            <FormControl>
                              <InputNumber
                                value={field.value ?? ''}
                                placeholder="R$ 0 (opcional)"
                                className="bg-secondary"
                                onValueChange={values =>
                                  field.onChange(values.floatValue ?? undefined)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="installments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parcelas</FormLabel>
                            <FormControl>
                              <InputNumber
                                value={field.value ?? ''}
                                placeholder="Qtd de parcelas (opcional)"
                                className="bg-secondary"
                                decimalScale={0}
                                fixedDecimalScale={false}
                                onValueChange={values =>
                                  field.onChange(values.floatValue ?? undefined)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="annualBoost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reforco anual</FormLabel>
                            <FormControl>
                              <InputNumber
                                value={field.value ?? ''}
                                placeholder="R$ 0 (opcional)"
                                className="bg-secondary"
                                onValueChange={values =>
                                  field.onChange(values.floatValue ?? undefined)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="border-border overflow-x-auto rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border">
                              <TableHead className="text-muted-foreground">
                                Unidade/Apto
                              </TableHead>
                              <TableHead className="text-muted-foreground">
                                Dorms
                              </TableHead>
                              <TableHead className="text-muted-foreground">
                                Garagem
                              </TableHead>
                              <TableHead className="text-muted-foreground">
                                Area Priv.
                              </TableHead>
                              <TableHead className="text-muted-foreground">
                                Area Gar.
                              </TableHead>
                              <TableHead className="text-muted-foreground">
                                Area Total
                              </TableHead>
                              <TableHead className="text-muted-foreground text-right">
                                Entrada
                              </TableHead>
                              <TableHead className="text-muted-foreground text-right">
                                Reforco Anual
                              </TableHead>
                              <TableHead className="text-muted-foreground text-right">
                                Vlr Parcela
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {property?.units?.map(unit => (
                              <TableRow key={unit.id} className="border-border">
                                <TableCell className="text-foreground font-medium">
                                  {unit.unitName}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {unit.bedrooms}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {unit.garage}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {unit.privateArea}m2
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {unit.garageArea}m2
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {unit.totalArea}m2
                                </TableCell>
                                <TableCell className="text-foreground text-right">
                                  {unit.downPayment
                                    ? formatCurrency(unit.downPayment)
                                    : '-'}
                                </TableCell>
                                <TableCell className="text-foreground text-right">
                                  {unit.annualBoost
                                    ? formatCurrency(unit.annualBoost)
                                    : '-'}
                                </TableCell>
                                <TableCell className="text-foreground text-right">
                                  {unit.installmentValue
                                    ? formatCurrency(unit.installmentValue)
                                    : '-'}
                                </TableCell>
                              </TableRow>
                            )) ?? (
                              <TableRow>
                                <TableCell
                                  colSpan={9}
                                  className="text-muted-foreground text-center"
                                >
                                  Nenhuma unidade cadastrada.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="self-start"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar unidade
                      </Button>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="paymentConditions"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Condicoes para pagamento</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              value={field.value ?? ''}
                              className="bg-secondary resize-none"
                              rows={3}
                              placeholder="Descreva as condicoes de pagamento..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentOptions"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Opcoes de pagamento</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              value={field.value ?? ''}
                              className="bg-secondary resize-none"
                              rows={3}
                              placeholder="Descreva as opcoes de pagamento aceitas..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ---- ABA ANUNCIOS ---- */}
            <TabsContent value="anuncios" className="mt-6">
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-card-foreground text-base">
                    Vincular anuncios de redes sociais
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendAdLink({
                        platform: '',
                        adId: '',
                        url: '',
                        createdAt: new Date(),
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar anuncio
                  </Button>
                </CardHeader>
                <CardContent>
                  {adLinkFields.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Nenhum anuncio vinculado. Clique em &quot;Adicionar
                      anuncio&quot; para vincular uma campanha do Facebook,
                      Instagram ou TikTok.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {adLinkFields.map((link, index) => (
                        <div
                          key={link.id}
                          className="border-border flex flex-col gap-3 rounded-lg border p-4"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-foreground text-sm font-medium">
                              Anuncio {index + 1}
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive h-8 w-8"
                              onClick={() => removeAdLink(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <FormField
                              control={form.control}
                              name={`adLinks.${index}.platform`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Plataforma</FormLabel>
                                  <FormControl>
                                    <Select
                                      value={field.value ?? ''}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger className="bg-secondary">
                                        <SelectValue placeholder="Selecione..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="facebook">
                                          Facebook
                                        </SelectItem>
                                        <SelectItem value="instagram">
                                          Instagram
                                        </SelectItem>
                                        <SelectItem value="tiktok">
                                          TikTok
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`adLinks.${index}.adId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome da campanha</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      value={field.value ?? ''}
                                      placeholder="Nome da campanha"
                                      className="bg-secondary"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`adLinks.${index}.url`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>URL do anuncio</FormLabel>
                                  <FormControl>
                                    <div className="flex gap-2">
                                      <Input
                                        {...field}
                                        value={field.value ?? ''}
                                        placeholder="https://..."
                                        className="bg-secondary"
                                      />
                                      {field.value && (
                                        <a
                                          href={field.value}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:text-primary/80 flex items-center"
                                        >
                                          <ExternalLink className="h-4 w-4" />
                                        </a>
                                      )}
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
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
                  <CardTitle className="text-card-foreground text-base">
                    Galeria de imagens do imovel
                  </CardTitle>
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
                    className="border-border hover:border-primary/40 mb-6 flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors"
                  >
                    <div className="text-muted-foreground flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8" />
                      <p className="text-sm font-medium">
                        Arraste imagens ou clique para fazer upload
                      </p>
                      <p className="text-xs">
                        JPG, PNG ou WebP. Multiplas imagens de uma vez.
                      </p>
                    </div>
                  </button>

                  {imageFields.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Nenhuma imagem cadastrada.
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {imageFields.map((img, index) => (
                        <div
                          key={img.id}
                          className="border-border overflow-hidden rounded-lg border"
                        >
                          <div className="bg-secondary relative flex h-36 items-center justify-center overflow-hidden">
                            {img.url && (
                              <img
                                src={img.url}
                                alt={img.description ?? ''}
                                className="h-full w-full object-cover"
                              />
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="bg-card/80 text-muted-foreground hover:text-destructive absolute top-1 right-1 h-7 w-7"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="p-3">
                            <FormField
                              control={form.control}
                              name={`images.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      value={field.value ?? ''}
                                      placeholder="Descricao da imagem..."
                                      className="bg-secondary h-8 text-xs"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
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

          <div className="flex justify-end">
            <Button type="submit">Salvar imovel</Button>
          </div>
        </form>
      </Form>

      <Toaster />
    </div>
  )
}
