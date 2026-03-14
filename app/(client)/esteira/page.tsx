"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Building2, Calendar, Phone } from "lucide-react"
import { mockKanbanColumns, mockChatMessages } from "@/lib/mock-data"
import type { Lead, ChatMessage } from "@/lib/types"

export default function EsteiraPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [newMessage, setNewMessage] = useState("")

  function openLead(lead: Lead) {
    setSelectedLead(lead)
    setSheetOpen(true)
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim()) return
    const msg: ChatMessage = {
      id: `c${Date.now()}`,
      sender: "agent",
      content: newMessage,
      timestamp: new Date().toLocaleString("pt-BR"),
    }
    setMessages([...messages, msg])
    setNewMessage("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Esteira de Vendas</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus leads pelo pipeline de vendas</p>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4" style={{ minWidth: "1200px" }}>
          {mockKanbanColumns.map((column) => (
            <div key={column.id} className="flex w-52 shrink-0 flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                  <h3 className="text-xs font-medium text-foreground">{column.title}</h3>
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">{column.cards.length}</span>
              </div>

              <div className="flex flex-col gap-2">
                {column.cards.map((lead) => (
                  <Card
                    key={lead.id}
                    className="cursor-pointer border-border bg-card p-3 transition-colors hover:border-primary/30"
                    onClick={() => openLead(lead)}
                  >
                    <p className="text-sm font-semibold text-card-foreground">{lead.name}</p>
                    {lead.propertyTitle && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">{lead.propertyTitle}</span>
                      </p>
                    )}
                    <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Última resposta: {lead.lastInteraction}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full bg-card sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-card-foreground">{selectedLead?.name}</SheetTitle>
            <SheetDescription>Detalhes do lead e historico de atendimento</SheetDescription>
          </SheetHeader>

          {selectedLead && (
            <Tabs defaultValue="geral" className="mt-4">
              <TabsList className="w-full">
                <TabsTrigger value="geral" className="flex-1">Geral</TabsTrigger>
                <TabsTrigger value="atendimento" className="flex-1">Atendimento</TabsTrigger>
              </TabsList>

              <TabsContent value="geral" className="mt-4">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-sm text-primary">
                        {selectedLead.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{selectedLead.name}</p>
                      <p className="text-xs text-muted-foreground">Lead desde {selectedLead.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs text-muted-foreground">Nome completo</Label>
                      <p className="text-sm text-foreground">{selectedLead.name}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label className="text-xs text-muted-foreground">Origem</Label>
                      <p className="text-sm text-foreground">
                        {selectedLead.source.includes("Instagram") || selectedLead.source.includes("Google") || selectedLead.source.includes("Portal")
                          ? selectedLead.source
                          : selectedLead.source || "Não identificada"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label className="text-xs text-muted-foreground">Fone / WhatsApp</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-foreground">{selectedLead.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Atendimento IA</p>
                        <p className="text-xs text-muted-foreground">Controle se a IA responde as mensagens deste lead</p>
                      </div>
                      <Switch defaultChecked={selectedLead.aiEnabled} />
                    </div>
                  </div>

                  {selectedLead.propertyTitle && (
                    <div className="rounded-lg border border-border p-4">
                      <Label className="text-xs text-muted-foreground">Empreendimento em negociação</Label>
                      <p className="mt-1 flex items-center gap-2 text-sm text-foreground">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {selectedLead.propertyTitle}
                      </p>
                    </div>
                  )}

                  {selectedLead.notes && (
                    <div className="rounded-lg border border-border p-4">
                      <Label className="text-xs text-muted-foreground">Notas</Label>
                      <p className="mt-1 text-sm text-foreground">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="atendimento" className="mt-4">
                <div className="flex h-[60vh] flex-col">
                  <div className="flex-1 overflow-auto">
                    <div className="flex flex-col gap-3 p-2">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === "lead" ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                              msg.sender === "lead"
                                ? "bg-secondary text-secondary-foreground"
                                : msg.sender === "ai"
                                  ? "border border-primary/20 bg-primary/5 text-foreground"
                                  : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <div className="mb-1 flex items-center gap-1">
                              <span className="text-[10px] font-semibold opacity-70">
                                {msg.sender === "lead" ? "Lead" : msg.sender === "ai" ? "IA Valya" : "Você"}
                              </span>
                            </div>
                            <p>{msg.content}</p>
                            <p className="mt-1 text-right text-[10px] opacity-50">{msg.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-border pt-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite uma mensagem..."
                      className="bg-secondary"
                    />
                    <Button type="submit" size="icon" className="shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
