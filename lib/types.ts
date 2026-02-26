export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  source: string
  status: "novo" | "qualificado" | "em_cadencia" | "visita" | "proposta" | "contrato" | "ganho" | "perda"
  propertyId?: string
  propertyTitle?: string
  createdAt: string
  lastInteraction: string
  notes?: string
}

export interface Property {
  id: string
  title: string
  type: "apartamento" | "casa" | "terreno" | "comercial" | "cobertura"
  description: string
  address: string
  city: string
  state: string
  neighborhood: string
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  area: number
  salePrice?: number
  rentPrice?: number
  isMultiUnit: boolean
  units?: PropertyUnit[]
  status: "ativo" | "inativo" | "vendido" | "alugado"
  images: PropertyImage[]
  announcements: Announcement[]
  createdAt: string
}

export interface PropertyUnit {
  id: string
  name: string
  area: number
  bedrooms: number
  salePrice?: number
  rentPrice?: number
  status: "disponivel" | "reservado" | "vendido"
}

export interface PropertyImage {
  id: string
  url: string
  description: string
}

export interface Announcement {
  id: string
  portal: string
  url: string
  status: "ativo" | "pausado" | "expirado"
  publishedAt: string
}

export interface KanbanColumn {
  id: string
  title: string
  color: string
  cards: Lead[]
}

export interface ChatMessage {
  id: string
  sender: "lead" | "ai" | "agent"
  content: string
  timestamp: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "admin" | "client"
  creci?: string
  agency?: string
  bio?: string
  avatar?: string
  isActive: boolean
  createdAt: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  creci: string
  agency: string
  plan: Plan
  subscriptionStatus: "ativo" | "trial" | "expirado" | "cancelado"
  daysToExpire: number
  hasCard: boolean
  leadsCount: number
  propertiesCount: number
  createdAt: string
  payments: Payment[]
}

export interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  isPopular?: boolean
}

export interface Payment {
  id: string
  date: string
  amount: number
  status: "pago" | "pendente" | "falhou"
  method: string
}

export interface KpiData {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
}

export interface ChartDataPoint {
  month: string
  leads: number
  fechados: number
  faturamento?: number
}
