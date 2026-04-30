'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import {
  PropertyAdLink,
  propertyAdLinkSchema,
} from '@/schemas/propertyAdLinkSchema'

import { PropertyGeneralTab } from '@/components/client/property/generalTab'
import { saveProperty } from '@/services/properties/saveProperty'
import { useUserProvider } from '@/providers/userProvider'
import { PropertyFinancialTab } from '@/components/client/property/financialTab'
import { PropertyAdsTab } from '@/components/client/property/adsTab'
import { PropertyImagesTab } from '@/components/client/property/imagesTab'

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

  useEffect(() => {
    if (id && id !== '_') {
      loadProperty(id).then(details => {
        if (details) {
          setProperty(details)
          form.reset({
            ...details,
            privateArea: details.privateArea
              ? Number(details.privateArea)
              : undefined,
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
            createdAt: new Date(details.createdAt),
            updatedAt: details.updatedAt
              ? new Date(details.updatedAt)
              : undefined,
          })
        }
      })
    }
  }, [id])

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
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="general">Cadastro Geral</TabsTrigger>
              <TabsTrigger value="financial">Financeiro</TabsTrigger>
              <TabsTrigger value="ads">Anúncios</TabsTrigger>
              <TabsTrigger value="imagens">Imagens</TabsTrigger>
            </TabsList>

            {/* ---- ABA GERAL ---- */}
            <TabsContent value="general" className="mt-6">
              <PropertyGeneralTab form={form} />
            </TabsContent>

            {/* ---- ABA FINANCEIRO ---- */}
            <TabsContent value="financial" className="mt-6">
              <PropertyFinancialTab form={form} property={property} />
            </TabsContent>

            {/* ---- ABA ANUNCIOS ---- */}
            <TabsContent value="ads" className="mt-6">
              <PropertyAdsTab form={form} property={property} />
            </TabsContent>

            {/* ---- ABA IMAGENS ---- */}
            <TabsContent value="imagens" className="mt-6">
              <PropertyImagesTab form={form} />
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
