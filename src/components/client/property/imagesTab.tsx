'use client'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

import { PropertyFields } from '@/app/(client)/imoveis/[id]/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRef } from 'react'

interface PropertyImagesTabProps {
  form: UseFormReturn<PropertyFields>
}

export const PropertyImagesTab = ({ form }: PropertyImagesTabProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control: form.control, name: 'images' })

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

  return (
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
  )
}
