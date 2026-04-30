import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

import { PropertyFields } from '@/app/(client)/imoveis/[id]/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Property } from '@/schemas/propertySchema'
import { ExternalLink, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PropertyAdsTabProps {
  form: UseFormReturn<PropertyFields>
  property?: Property
}

export const PropertyAdsTab = ({ form, property }: PropertyAdsTabProps) => {
  const {
    fields: adLinkFields,
    append: appendAdLink,
    remove: removeAdLink,
  } = useFieldArray({ control: form.control, name: 'adLinks' })

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground text-base">
          Vincular anúncios de redes sociais
        </CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            appendAdLink({
              propertyId: property?.id,
              platform: '',
              adId: '',
              url: '',
              createdAt: new Date(),
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar anúncio
        </Button>
      </CardHeader>
      <CardContent>
        {adLinkFields.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum anúncio vinculado. Clique em &quot;Adicionar anúncio&quot;
            para vincular uma campanha do Facebook, Instagram ou TikTok.
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
                    Anúncio {index + 1}
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
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="instagram">
                                Instagram
                              </SelectItem>
                              <SelectItem value="tiktok">TikTok</SelectItem>
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
                        <FormLabel>URL do anúncio</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...field}
                              value={field.value ?? ''}
                              placeholder="https://..."
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
  )
}
