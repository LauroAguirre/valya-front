'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePromiseTracker } from 'react-promise-tracker'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { IMaskInput } from 'react-imask'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  UserPlus,
} from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { newAgentSchema, NewAgentForm } from '@/schemas/newAgentSchema'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'
import {
  searchAgents,
  PaginatedAgentSearch,
} from '@/services/agents/searchAgents'
import { linkAgent } from '@/services/agents/linkAgent'
import { createAndLinkAgent } from '@/services/agents/createAndLinkAgent'

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS',
  'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC',
  'SE', 'SP', 'TO',
]

const IMASK_INPUT_CLASS =
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]'

function getInitials(name?: string) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
}

function toWhatsAppUrl(phone?: string | null) {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/55${digits}`
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  onAgentLinked: (agent: RealStateAgent) => void
}

export function AddAgentDrawer({
  open,
  onOpenChange,
  companyId,
  onAgentLinked,
}: Props) {
  const [view, setView] = useState<'search' | 'new'>('search')

  const [filterText, setFilterText] = useState('')
  const [filterUf, setFilterUf] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [searchResult, setSearchResult] = useState<PaginatedAgentSearch | null>(
    null,
  )
  const [searchPage, setSearchPage] = useState(1)
  const [hasSearched, setHasSearched] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAgent, setPendingAgent] = useState<RealStateAgent | null>(null)

  const { promiseInProgress: searching } = usePromiseTracker({
    area: 'searchingAgents',
    delay: 0,
  })
  const { promiseInProgress: linking } = usePromiseTracker({
    area: 'linkingAgent',
    delay: 0,
  })
  const { promiseInProgress: creating } = usePromiseTracker({
    area: 'creatingAgent',
    delay: 0,
  })

  const form = useForm<NewAgentForm>({
    resolver: zodResolver(newAgentSchema),
    defaultValues: { name: '', phone: '', email: '', cpfCnpj: '' },
  })

  function handleClose() {
    onOpenChange(false)
    setTimeout(() => {
      setView('search')
      setFilterText('')
      setFilterUf('')
      setFilterCity('')
      setSearchResult(null)
      setHasSearched(false)
      form.reset()
    }, 300)
  }

  async function handleSearch(page = 1) {
    const result = await searchAgents({
      filters: filterText || undefined,
      uf: filterUf || undefined,
      city: filterCity || undefined,
      page,
    })
    setSearchResult(result ?? null)
    setSearchPage(page)
    setHasSearched(true)
  }

  async function handleLink(agent: RealStateAgent) {
    const result = await linkAgent(companyId, agent.id ?? '')
    if (result) {
      toast.success(`${agent.user?.name ?? 'Corretor'} adicionado.`)
      onAgentLinked(result)
      handleClose()
    } else {
      toast.error('Erro ao adicionar corretor.')
    }
  }

  async function onNewAgentSubmit(data: NewAgentForm) {
    try {
      const result = await createAndLinkAgent(companyId, data)
      toast.success('Corretor cadastrado e vinculado.')
      onAgentLinked(result)
      handleClose()
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 422) {
        const byCpfCnpj = await searchAgents({ filters: data.cpfCnpj })
        const duplicate =
          byCpfCnpj?.data?.[0] ??
          (await searchAgents({ filters: data.email }))?.data?.[0]

        if (duplicate) {
          setPendingAgent(duplicate)
          setConfirmOpen(true)
        } else {
          toast.error(
            'Este CPF/CNPJ ou e-mail já está em uso. Não foi possível localizar o corretor.',
          )
        }
      } else {
        toast.error('Erro ao cadastrar corretor.')
      }
    }
  }

  async function handleConfirmLink() {
    if (!pendingAgent) return
    const result = await linkAgent(companyId, pendingAgent.id ?? '')
    if (result) {
      toast.success(`${pendingAgent.user?.name ?? 'Corretor'} vinculado.`)
      onAgentLinked(result)
      setConfirmOpen(false)
      handleClose()
    } else {
      toast.error('Erro ao vincular corretor.')
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-lg">
          <SheetHeader className="border-border border-b p-4">
            <div className="flex items-center gap-2">
              {view === 'new' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => setView('search')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <SheetTitle>
                {view === 'search' ? 'Adicionar Corretor' : 'Novo Corretor'}
              </SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {view === 'search' ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Nome, CPF, CNPJ, telefone ou e-mail"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch(1)}
                  />
                  <div className="flex gap-2">
                    <Select value={filterUf} onValueChange={setFilterUf}>
                      <SelectTrigger className="w-24 shrink-0">
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        {BRAZILIAN_STATES.map(s => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Cidade"
                      value={filterCity}
                      onChange={e => setFilterCity(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch(1)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleSearch(1)}
                      disabled={searching}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                    >
                      {searching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      <span className="ml-1.5">Buscar</span>
                    </Button>
                  </div>
                </div>

                {hasSearched && (
                  <div className="flex flex-col gap-2">
                    {searching ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                      </div>
                    ) : searchResult?.data?.length === 0 ? (
                      <p className="text-muted-foreground py-6 text-center text-sm">
                        Nenhum corretor encontrado.
                      </p>
                    ) : (
                      searchResult?.data?.map(agent => {
                        const waUrl = toWhatsAppUrl(agent.user?.phone)
                        return (
                          <div
                            key={agent.id}
                            className="border-border bg-card flex items-center gap-3 rounded-md border p-3"
                          >
                            <Avatar className="size-9 shrink-0">
                              <AvatarImage
                                src={agent.user?.avatarUrl ?? ''}
                                alt={agent.user?.name}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {getInitials(agent.user?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="text-foreground truncate text-sm font-medium">
                                {agent.user?.name ?? '—'}
                              </p>
                              <p className="text-muted-foreground truncate text-xs">
                                {agent.user?.email ?? '—'}
                              </p>
                              {waUrl ? (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary truncate text-xs hover:underline"
                                >
                                  {agent.user?.phone}
                                </a>
                              ) : (
                                <p className="text-muted-foreground text-xs">
                                  —
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              disabled={linking}
                              onClick={() => handleLink(agent)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                            >
                              <UserPlus className="mr-1 h-3.5 w-3.5" />
                              Adicionar
                            </Button>
                          </div>
                        )
                      })
                    )}

                    {(searchResult?.totalPages ?? 0) > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSearch(searchPage - 1)}
                          disabled={searchPage <= 1 || searching}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-muted-foreground text-xs">
                          {searchPage} / {searchResult?.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSearch(searchPage + 1)}
                          disabled={
                            searchPage >= (searchResult?.totalPages ?? 1) ||
                            searching
                          }
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="border-border mt-2 border-t pt-4">
                      <p className="text-muted-foreground mb-2 text-xs">
                        Não encontrou o corretor desejado?
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setView('new')}
                      >
                        Novo corretor
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Form {...form}>
                <form
                  id="new-agent-form"
                  onSubmit={form.handleSubmit(onNewAgentSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="João da Silva" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <IMaskInput
                            mask={[
                              { mask: '(00) 0000-0000' },
                              { mask: '(00) 00000-0000' },
                            ]}
                            dispatch={(appended, dynamicMasked) => {
                              const digits = (
                                dynamicMasked.value + appended
                              ).replace(/\D/g, '')
                              return dynamicMasked.compiledMasks[
                                digits.length > 10 ? 1 : 0
                              ]
                            }}
                            unmask={false}
                            value={field.value}
                            onAccept={val => field.onChange(val)}
                            onBlur={field.onBlur}
                            placeholder="(11) 99999-9999"
                            className={IMASK_INPUT_CLASS}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="joao@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpfCnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF / CNPJ</FormLabel>
                        <FormControl>
                          <IMaskInput
                            mask={[
                              { mask: '000.000.000-00' },
                              { mask: '00.000.000/0000-00' },
                            ]}
                            dispatch={(appended, dynamicMasked) => {
                              const digits = (
                                dynamicMasked.value + appended
                              ).replace(/\D/g, '')
                              return dynamicMasked.compiledMasks[
                                digits.length > 11 ? 1 : 0
                              ]
                            }}
                            unmask={false}
                            value={field.value}
                            onAccept={val => field.onChange(val)}
                            onBlur={field.onBlur}
                            placeholder="000.000.000-00"
                            className={IMASK_INPUT_CLASS}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}
          </div>

          {view === 'new' && (
            <div className="border-border border-t p-4">
              <Button
                type="submit"
                form="new-agent-form"
                disabled={creating || linking}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              >
                {creating ? 'Salvando...' : 'Salvar e vincular'}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Corretor já cadastrado</DialogTitle>
            <DialogDescription>
              Este CPF/CNPJ ou e-mail já pertence ao corretor abaixo. Deseja
              vinculá-lo à sua construtora?
            </DialogDescription>
          </DialogHeader>

          {pendingAgent && (
            <div className="border-border flex items-center gap-3 rounded-md border p-3">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={pendingAgent.user?.avatarUrl ?? ''}
                  alt={pendingAgent.user?.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {getInitials(pendingAgent.user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{pendingAgent.user?.name}</p>
                <p className="text-muted-foreground text-sm">
                  {pendingAgent.user?.email}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={linking}
              onClick={handleConfirmLink}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {linking ? 'Vinculando...' : 'Confirmar vínculo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
