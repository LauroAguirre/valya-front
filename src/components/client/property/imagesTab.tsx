'use client'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import Image from 'next/image'

import { PropertyFields } from '@/app/(client)/properties/[id]/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, RefreshCw, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { uploadPropertyImage } from '@/services/properties/uploadPropertyImage'

interface PropertyImagesTabProps {
  form: UseFormReturn<PropertyFields>
}

const THUMB_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

/**
 * Miniatura que mostra um efeito de loading (skeleton) enquanto a imagem
 * é carregada da rede, dando feedback claro ao usuário.
 */
function ImageThumb({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  // Reseta o estado de loading caso a fonte da imagem mude.
  useEffect(() => {
    setLoaded(false)
  }, [src])

  return (
    <>
      {!loaded && (
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={THUMB_SIZES}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={cn(
          'object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </>
  )
}

interface PendingUpload {
  id: string
  file: File
  previewUrl: string
  status: 'uploading' | 'error'
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const PropertyImagesTab = ({ form }: PropertyImagesTabProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([])

  // Previews locais (blob) das imagens recém-enviadas, usados como fallback
  // de exibição enquanto o backend ainda não devolve a `url` definitiva.
  const localPreviewsRef = useRef<Record<string, string>>({})

  const propertyId = form.getValues('id')

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control,
    name: 'images',
    keyName: 'fieldId',
  })

  // Revoga todos os blobs de preview ao desmontar para evitar vazamento.
  useEffect(() => {
    const previews = localPreviewsRef.current
    return () => {
      Object.values(previews).forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  async function uploadFile(pending: PendingUpload) {
    if (!propertyId) return

    const uploaded = await uploadPropertyImage(propertyId, pending.file)

    if (uploaded) {
      // Se o backend não retornou a `url` na resposta do upload, mantemos o
      // preview local como fallback (indexado pela id da imagem criada) para
      // não exibir um quadro vazio. Caso a `url` venha, descartamos o blob.
      if (!uploaded.url && uploaded.id) {
        localPreviewsRef.current[uploaded.id] = pending.previewUrl
      } else {
        URL.revokeObjectURL(pending.previewUrl)
      }

      appendImage({
        ...uploaded,
        description: uploaded.description ?? '',
        // createdAt: uploaded.createdAt ?? new Date(),
      })
      setPendingUploads(prev => prev.filter(p => p.id !== pending.id))
    } else {
      setPendingUploads(prev =>
        prev.map(p => (p.id === pending.id ? { ...p, status: 'error' } : p)),
      )
      toast.error(`Falha ao enviar a imagem "${pending.file.name}"`)
    }
  }

  function retryUpload(pending: PendingUpload) {
    setPendingUploads(prev =>
      prev.map(p => (p.id === pending.id ? { ...p, status: 'uploading' } : p)),
    )
    uploadFile({ ...pending, status: 'uploading' })
  }

  function removePending(pending: PendingUpload) {
    URL.revokeObjectURL(pending.previewUrl)
    setPendingUploads(prev => prev.filter(p => p.id !== pending.id))
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return

    if (!propertyId) {
      toast.error('Salve o imóvel antes de adicionar imagens')
      return
    }

    const files = Array.from(fileList).filter(file =>
      ACCEPTED_IMAGE_TYPES.includes(file.type),
    )
    if (files.length === 0) {
      toast.error('Apenas imagens JPG, PNG ou WebP são aceitas')
      return
    }

    files.forEach((file, i) => {
      const pending: PendingUpload = {
        id: `upload-${Date.now()}-${i}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'uploading',
      }
      setPendingUploads(prev => [...prev, pending])
      uploadFile(pending)
    })
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(e.target.files)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  function handleDragOver(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsDragging(false)
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
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-border hover:border-primary/40 mb-6 flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
            isDragging && 'border-primary bg-primary/5',
          )}
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

        {imageFields.length === 0 && pendingUploads.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma imagem cadastrada.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingUploads.map(pending => (
              <div
                key={pending.id}
                className="border-border overflow-hidden rounded-lg border"
              >
                <div className="bg-secondary relative flex h-36 items-center justify-center overflow-hidden">
                  <Image
                    src={pending.previewUrl}
                    alt={pending.file.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={cn(
                      'object-cover',
                      pending.status === 'uploading' && 'opacity-40',
                    )}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    {pending.status === 'uploading' ? (
                      <Loader2 className="text-primary h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <p className="text-xs font-medium text-white drop-shadow">
                          Falha no envio
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => retryUpload(pending)}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removePending(pending)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-muted-foreground truncate text-xs">
                    {pending.file.name}
                  </p>
                </div>
              </div>
            ))}
            {imageFields.map((img, index) => {
              const thumbSrc =
                img.url || (img.id ? localPreviewsRef.current[img.id] : '')

              return (
                <div
                  key={img.fieldId}
                  className="border-border overflow-hidden rounded-lg border"
                >
                  <div className="bg-secondary relative flex h-36 items-center justify-center overflow-hidden">
                    {thumbSrc && (
                      <ImageThumb src={thumbSrc} alt={img.description ?? ''} />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="bg-card text-muted-foreground absolute top-1 right-1 h-7 w-7 hover:text-white"
                      onClick={() => {
                        if (img.id && localPreviewsRef.current[img.id]) {
                          URL.revokeObjectURL(localPreviewsRef.current[img.id])
                          delete localPreviewsRef.current[img.id]
                        }
                        removeImage(index)
                      }}
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
                              placeholder="Detalhes sobre a imagem"
                              className="h-8 text-xs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
