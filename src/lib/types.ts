export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  source: string
  status:
    | 'qualificacao'
    | 'cadencia'
    | 'visita'
    | 'proposta'
    | 'contrato'
    | 'ganho'
    | 'perda'
  propertyId?: string
  propertyTitle?: string
  createdAt: string
  lastInteraction: string
  notes?: string
  aiEnabled: boolean
}

// export interface Property {
//   id: string
//   title: string
//   type: 'apartamento' | 'casa' | 'terreno' | 'comercial' | 'cobertura'
//   description: string
//   address: string
//   city: string
//   state: string
//   neighborhood: string
//   bedrooms: number
//   bathrooms: number
//   parkingSpaces: number
//   parkingType: 'coberta' | 'descoberta' | 'mista'
//   bbqType: 'nenhuma' | 'carvao' | 'eletrica'
//   area: number
//   privateArea?: number
//   salePrice?: number
//   rentPrice?: number
//   isMultiUnit: boolean
//   units?: PropertyUnit[]
//   financialNotes?: string
//   paymentOptions?: string
//   status: 'ativo' | 'inativo' | 'vendido' | 'alugado'
//   images: PropertyImage[]
//   announcements: Announcement[]
//   adLinks: AdLink[]
//   createdAt: string
// }

export interface PropertyUnit {
  id: string
  name: string
  bedrooms: number
  parkingSpaces: number
  privateArea: number
  parkingArea: number
  totalArea: number
  downPayment?: number
  annualBonus?: number
  installmentValue?: number
  status: 'disponivel' | 'reservado' | 'vendido'
}

// export interface PropertyImage {
//   id: string
//   url: string
//   description: string
// }

export interface Announcement {
  id: string
  portal: string
  url: string
  status: 'ativo' | 'pausado' | 'expirado'
  publishedAt: string
}

// export interface AdLink {
//   id: string
//   platform: 'facebook' | 'instagram' | 'tiktok'
//   campaignName: string
//   url: string
// }

export interface KanbanColumn {
  id: string
  title: string
  color: string
  cards: Lead[]
}

export interface ChatMessage {
  id: string
  sender: 'lead' | 'ai' | 'agent'
  content: string
  timestamp: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'client'
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
  subscriptionStatus: 'ativo' | 'trial' | 'expirado' | 'cancelado'
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
  status: 'pago' | 'pendente' | 'falhou'
  method: string
}

export interface KpiData {
  label: string
  value: string | number
  change?: number | null
  changeLabel?: string | null
}

export interface ChartDataPoint {
  month: string
  leads: number
  fechados: number
  faturamento?: number
}
