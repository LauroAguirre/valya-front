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
import { format } from 'date-fns'
import { Label } from '@/components/ui/label'
import { Building2, ChevronUp, Phone } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Message, MessageSender } from '@/schemas/messageSchema'
import { useEffect, useRef, useState } from 'react'
import { loadChatHistory } from '@/services/lead/loadChatHistory'
import { usePromiseTracker } from 'react-promise-tracker'
import { Button } from '@/components/ui/button'

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
  const { promiseInProgress: loadingChat } = usePromiseTracker({
    area: 'loadingChatHistory',
  })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([])
    setPage(1)
    setTotalPages(1)
  }, [lead?.id])

  useEffect(() => {
    if (!lead?.id) return

    const fetchPage = async () => {
      const result = await loadChatHistory({ page, leadId: lead.id as string })
      if (page === 1) {
        setMessages(result.data)
        setTimeout(() => bottomRef.current?.scrollIntoView(), 50)
      } else {
        setMessages(prev => [...result.data, ...prev])
      }
      setTotalPages(result.pagination.totalPages)
    }

    fetchPage()
  }, [lead?.id, page])

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent className="bg-card w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-card-foreground">{lead?.name}</SheetTitle>
          <SheetDescription>
            Detalhes do lead e historico de atendimento
          </SheetDescription>
        </SheetHeader>

        {lead && (
          <Tabs defaultValue="geral" className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="geral" className="flex-1">
                Geral
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

                {lead.properties && lead.properties.length > 0 && (
                  <div className="border-border rounded-lg border p-4">
                    <Label className="text-muted-foreground text-xs">
                      Empreendimento em negociação
                    </Label>
                    <hr />
                    {lead.properties.map(property => {
                      return (
                        <p className="text-foreground mt-1 flex items-center gap-2 text-sm">
                          <Building2 className="text-muted-foreground h-4 w-4" />
                          {property.name}
                        </p>
                      )
                    })}
                  </div>
                )}

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

            <TabsContent value="chat" className="mt-4">
              <div className="flex h-[60vh] flex-col">
                <div className="flex-1 overflow-auto">
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
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === MessageSender.LEAD ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            msg.sender === MessageSender.LEAD
                              ? 'bg-secondary text-secondary-foreground'
                              : msg.sender === MessageSender.AI
                                ? 'border-primary/20 bg-primary/5 text-foreground border'
                                : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <div className="mb-1 flex items-center gap-1">
                            <span className="text-[10px] font-semibold opacity-70">
                              {msg.sender === MessageSender.LEAD
                                ? 'Lead'
                                : msg.sender === MessageSender.AI
                                  ? 'IA Valya'
                                  : 'Voce'}
                            </span>
                          </div>
                          <p>{msg.content}</p>
                          <p className="mt-1 text-right text-[10px] opacity-50">
                            {format(new Date(msg.createdAt), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
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
