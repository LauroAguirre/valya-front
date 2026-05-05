'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { DevelopmentInfoForm } from '@/components/company/developments/DevelopmentInfoForm'
import { UnitsTable } from '@/components/company/developments/UnitsTable'
import { UnitFormModal } from '@/components/company/developments/UnitFormModal'
import { Property } from '@/schemas/propertySchema'
import { PropertyUnit } from '@/schemas/propertyUnitSchema'
import {
  loadDevelopment,
  loadDevelopmentUnits,
  deleteDevelopment,
} from '@/services/api/developments'

export default function DevelopmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [development, setDevelopment] = useState<Property | null>(null)
  const [units, setUnits] = useState<PropertyUnit[]>([])
  const [unitModalOpen, setUnitModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null)

  useEffect(() => {
    loadDevelopment(id).then(data => {
      if (data) setDevelopment(data)
    })
    loadDevelopmentUnits(id).then(data => {
      if (data) setUnits(data)
    })
  }, [id])

  function handleUnitSuccess(saved: PropertyUnit) {
    setUnits(prev => {
      const exists = prev.some(u => u.id === saved.id)
      return exists
        ? prev.map(u => (u.id === saved.id ? saved : u))
        : [...prev, saved]
    })
  }

  function handleUnitRemoved(unitId: string) {
    setUnits(prev => prev.filter(u => u.id !== unitId))
  }

  function handleAddUnit() {
    setEditingUnit(null)
    setUnitModalOpen(true)
  }

  function handleEditUnit(unit: PropertyUnit) {
    setEditingUnit(unit)
    setUnitModalOpen(true)
  }

  async function handleDelete() {
    if (!development?.id) return
    const ok = await deleteDevelopment(development.id)
    if (ok) {
      toast.success('Empreendimento removido.')
      router.push('/company/developments')
    } else {
      toast.error('Erro ao remover empreendimento.')
    }
  }

  if (!development) {
    return (
      <div className="text-muted-foreground py-16 text-center text-sm">
        Carregando…
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/company/developments')}
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              {development.name ?? 'Empreendimento'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {[development.neighborhood, development.city]
                .filter(Boolean)
                .join(', ') || 'Sem localização'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={handleDelete}
          aria-label="Excluir empreendimento"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="units">
            Unidades ({units.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <DevelopmentInfoForm
            development={development}
            onSaved={setDevelopment}
          />
        </TabsContent>

        <TabsContent value="units" className="mt-4">
          <UnitsTable
            propertyId={id}
            units={units}
            onAdd={handleAddUnit}
            onEdit={handleEditUnit}
            onRemoved={handleUnitRemoved}
          />
        </TabsContent>
      </Tabs>

      <UnitFormModal
        open={unitModalOpen}
        onOpenChange={setUnitModalOpen}
        propertyId={id}
        editingUnit={editingUnit}
        onSuccess={handleUnitSuccess}
      />

      <Toaster />
    </div>
  )
}
