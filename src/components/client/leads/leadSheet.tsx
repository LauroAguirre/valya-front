import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { Lead } from '@/schemas/leadSchema'
import { format, isSameDay, isToday, isYesterday } from 'date-fns'
import { Label } from '@/components/ui/label'
import { ChevronUp, Phone, Zap } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Message, MessageSender } from '@/schemas/messageSchema'
import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { loadChatHistory } from '@/services/lead/loadChatHistory'
import { usePromiseTracker } from 'react-promise-tracker'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Negotiation } from '@/schemas/negotiationSchema'
import { loadLeadNegotiations } from '@/services/negotiation/loadLeadNegotiations'
import { NegotiationsTab } from './negotiationsTab'

// Valor do filtro de conversa que mostra a thread completa do lead.
const ALL_MESSAGES = 'all'

// Rótulo do separador de dia exibido entre blocos de mensagens.
function formatDayLabel(date: Date) {
  if (isToday(date)) return 'Hoje'
  if (isYesterday(date)) return 'Ontem'
  return format(date, 'dd/MM/yyyy')
}

interface LeadSheetProps {
  sheetOpen: boolean
  lead?: Lead
  setSheetOpen: (value: boolean) => void
}

export const LeadSheet = ({
  sheetOpen,
  lead,
  setSheetOpen,
}: LeadSheetProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState('geral')
  const [negotiations, setNegotiations] = useState<Negotiation[]>([])
  // Filtro da aba de conversa: ALL_MESSAGES mostra a thread completa do lead;
  // um id de negociação mostra só as mensagens daquele ciclo de compra.
  const [conversationFilter, setConversationFilter] = useState(ALL_MESSAGES)
  const { promiseInProgress: loadingChat } = usePromiseTracker({
    area: 'loadingChatHistory',
  })
  const scrollRef = useRef<HTMLDivElement>(null)
  // Altura do scroll capturada antes de prepender mensagens antigas, usada
  // para manter a posição de leitura ao clicar em "Carregar mais".
  const prependAnchorRef = useRef<number | null>(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    }, 50)
  }

  useEffect(() => {
    setMessages([])
    setPage(1)
    setTotalPages(1)
    setConversationFilter(ALL_MESSAGES)
    setNegotiations([])
    if (lead?.id) loadLeadNegotiations(lead.id).then(setNegotiations)
  }, [lead?.id])

  useEffect(() => {
    if (!lead?.id) return

    const fetchPage = async () => {
      const result = await loadChatHistory({ page, leadId: lead.id as string })
      if (page === 1) {
        setMessages(result.data)
        scrollToBottom()
      } else {
        setMessages(prev => [...result.data, ...prev])
      }
      setTotalPages(result.pagination.totalPages)
    }

    fetchPage()
  }, [lead?.id, page])

  // Mensagens legadas (negotiationId === null) pertencem à conversa geral do
  // lead e nunca são escondidas — só somem ao filtrar por uma negociação.
  const filteredMessages = useMemo(() => {
    if (conversationFilter === ALL_MESSAGES) return messages
    return messages.filter(m => m.negotiationId === conversationFilter)
  }, [messages, conversationFilter])

  // Rola para a mensagem mais recente ao abrir a aba de chat (o conteúdo é
  // montado só quando a aba fica ativa) e ao trocar o filtro de conversa.
  // NÃO depende da quantidade de mensagens para não puxar o scroll de volta
  // ao fim quando mensagens antigas são carregadas via "Carregar mais".
  useEffect(() => {
    if (activeTab === 'chat') scrollToBottom()
  }, [activeTab, conversationFilter])

  // Após prepender mensagens antigas, reposiciona o scroll para manter a
  // mesma mensagem visível (ancoragem pelo delta de altura).
  useLayoutEffect(() => {
    if (prependAnchorRef.current === null) return
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight - prependAnchorRef.current
    prependAnchorRef.current = null
  }, [messages])

  const handleLoadMore = () => {
    // Captura a altura atual antes do fetch para ancorar o scroll depois.
    prependAnchorRef.current = scrollRef.current?.scrollHeight ?? 0
    setPage(prev => prev + 1)
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent className="bg-card w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-card-foreground">{lead?.name}</SheetTitle>
          <SheetDescription>
            Detalhes do lead e histórico de atendimento
          </SheetDescription>
        </SheetHeader>

        {lead && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="geral" className="flex-1">
                Geral
              </TabsTrigger>
              <TabsTrigger value="negociacoes" className="flex-1">
                Negociações
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1">
                Atendimento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="mt-4">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {lead.name &&
                        lead.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground font-medium">{lead.name}</p>
                    <p className="text-muted-foreground text-xs">
                      Lead desde{' '}
                      {format(new Date(lead.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>

                <div className="border-border flex flex-col gap-4 rounded-lg border p-4">
                  <div className="flex flex-col gap-1">
                    <Label className="text-muted-foreground text-xs">
                      Nome completo
                    </Label>
                    <p className="text-foreground text-sm">{lead.name}</p>
                  </div>

                  {/* <div className="flex flex-col gap-1">
                      <Label className="text-muted-foreground text-xs">
                        Origem
                      </Label>
                      <p className="text-foreground text-sm">
                        {lead.source.includes('Instagram') ||
                        lead.source.includes('Google') ||
                        lead.source.includes('Portal')
                          ? lead.source
                          : lead.source || 'Nao identificada'}
                      </p>
                    </div> */}

                  <div className="flex flex-col gap-1">
                    <Label className="text-muted-foreground text-xs">
                      Fone / WhatsApp
                    </Label>
                    <div className="flex items-center gap-2">
                      <Phone className="text-muted-foreground h-4 w-4" />
                      <p className="text-foreground text-sm">{lead.phone}</p>
                    </div>
                  </div>

                  <div className="border-border flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-foreground text-sm font-medium">
                        Atendimento IA
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Controle se a IA responde as mensagens deste lead
                      </p>
                    </div>
                    <Switch defaultChecked={lead.aiEnabled} />
                  </div>
                </div>

                {/* {lead.propertyTitle && (
                    <div className="border-border rounded-lg border p-4">
                      <Label className="text-muted-foreground text-xs">
                        Empreendimento em negociação
                      </Label>
                      <p className="text-foreground mt-1 flex items-center gap-2 text-sm">
                        <Building2 className="text-muted-foreground h-4 w-4" />
                        {lead.propertyTitle}
                      </p>
                    </div>
                  )} */}

                {lead.notes && (
                  <div className="border-border rounded-lg border p-4">
                    <Label className="text-muted-foreground text-xs">
                      Notas
                    </Label>
                    <p className="text-foreground mt-1 text-sm">{lead.notes}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="negociacoes" className="mt-4">
              {lead.id && (
                <NegotiationsTab
                  leadId={lead.id}
                  negotiations={negotiations}
                  setNegotiations={setNegotiations}
                />
              )}
            </TabsContent>

            <TabsContent value="chat" className="mt-4">
              <div className="flex h-[80vh] flex-col">
                {negotiations.length > 0 && (
                  <div className="mb-3 flex flex-col gap-1.5">
                    <Label className="text-muted-foreground text-xs">
                      Filtrar conversa
                    </Label>
                    <Select
                      value={conversationFilter}
                      onValueChange={setConversationFilter}
                    >
                      <SelectTrigger className="w-full" size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL_MESSAGES}>
                          Conversa completa
                        </SelectItem>
                        {negotiations.map(negotiation => (
                          <SelectItem
                            key={negotiation.id}
                            value={negotiation.id}
                          >
                            {negotiation.title ??
                              `Negociação de ${format(new Date(negotiation.createdAt), 'dd/MM/yyyy')}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {/* <div className="flex h-[60vh] flex-col"> */}
                <div ref={scrollRef} className="flex-1 overflow-auto">
                  {page < totalPages && (
                    <div className="flex justify-center py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLoadMore}
                        disabled={loadingChat}
                        className="text-muted-foreground gap-1 text-xs"
                      >
                        <ChevronUp className="h-3 w-3" />
                        {loadingChat ? 'Carregando...' : 'Carregar mais'}
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-col gap-3 p-2">
                    {filteredMessages.length === 0 && (
                      <p className="text-muted-foreground py-6 text-center text-xs">
                        Nenhuma mensagem nesta negociação.
                      </p>
                    )}
                    {filteredMessages.map((msg, index) => {
                      const prev = filteredMessages[index - 1]
                      const showDayDivider =
                        !prev ||
                        !isSameDay(
                          new Date(prev.createdAt),
                          new Date(msg.createdAt),
                        )
                      return (
                        <Fragment key={msg.id}>
                          {showDayDivider && (
                            <div className="my-1 flex justify-center">
                              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                                {formatDayLabel(new Date(msg.createdAt))}
                              </span>
                            </div>
                          )}
                          <div
                            className={`flex ${msg.sender === MessageSender.enum.LEAD ? 'justify-start' : 'justify-end'}`}
                          >
                        <div
                          className={`flex max-w-[80%] flex-col rounded-lg px-3 py-2 text-sm ${
                            msg.sender === MessageSender.enum.LEAD
                              ? 'bg-secondary text-secondary-foreground'
                              : msg.sender === MessageSender.enum.AI
                                ? 'border-primary/20 bg-primary/5 text-foreground border'
                                : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <div className="mb-1 flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold opacity-70">
                              {msg.sender === MessageSender.enum.LEAD
                                ? 'Lead'
                                : msg.sender === MessageSender.enum.AI
                                  ? 'Aalya IA'
                                  : 'Você'}
                            </span>
                            {msg.channel === 'META' && (
                              <span className="flex items-center gap-0.5 rounded bg-blue-500/15 px-1 py-0.5 text-[9px] font-semibold text-blue-600">
                                <Zap className="h-2.5 w-2.5" />
                                API Oficial
                              </span>
                            )}
                          </div>
                          <p className="wrap-break-word whitespace-pre-wrap">
                            {msg.content}
                          </p>
                          <p className="mt-1 text-right text-[10px] opacity-50">
                            {format(new Date(msg.createdAt), 'HH:mm')}
                          </p>
                            </div>
                          </div>
                        </Fragment>
                      )
                    })}
                  </div>
                </div>

                {/* <Form {...messageForm}>
                    <form
                      onSubmit={messageForm.handleSubmit(handleSendMessage)}
                      className="border-border flex gap-2 border-t pt-3"
                    >
                      <FormField
                        control={messageForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Digite uma mensagem..."
                                className="bg-secondary"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" size="icon" className="shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </Form> */}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  )
}
