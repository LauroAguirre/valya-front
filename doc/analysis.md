# Valya Front — Project Analysis

## 1. Tech Stack

### Core Framework & Runtime
- **Next.js 15.1.6** — React meta-framework using App Router
- **React 19.2.4** — UI library
- **TypeScript 5.7.3** — Strict typed JavaScript

### UI & Styling
- **Tailwind CSS 4.2.0** with `@tailwindcss/postcss` — utility-first CSS framework
- **Radix UI** — full suite of headless primitives (accordion, dialog, dropdown, popover, toast, and 20+ more)
- **class-variance-authority 0.7.1** — variant-based component styling
- **clsx 2.1.1** + **tailwind-merge 3.3.1** — conditional and safe class merging via `cn()` utility
- **Lucide React 0.564.0** — icon library
- **tw-animate-css 1.3.3** — Tailwind animation utilities
- **next-themes 0.4.6** — light/dark theme management

### Forms & Validation
- **React Hook Form 7.54.1** — performant form state management
- **@hookform/resolvers 3.10.0** — Zod integration for forms
- **Zod 4.3.5** — TypeScript-first schema validation
- **cpf-cnpj-validator 1.0.3** — Brazilian document (CPF/CNPJ) validation

### Input Utilities
- **react-imask 7.6.1** — input masking (phone, CPF, CNPJ)
- **react-number-format 5.4.5** — currency/number formatting
- **react-day-picker 9.13.2** — date picker
- **input-otp 1.4.2** — OTP/PIN input
- **date-fns 4.1.0** — date utilities

### HTTP & State
- **Axios 1.13.6** — promise-based HTTP client
- **react-promise-tracker 2.1.1** — loading state tracking per async operation
- **nookies 2.5.2** — SSR-compatible cookie management

### Charts & Layout
- **Recharts 2.15.0** — React charting library
- **Embla Carousel React 8.6.0** — carousel component
- **react-resizable-panels 2.1.7** — resizable panel layout

### Notifications
- **Sonner 1.7.1** — toast notification library
- **@vercel/analytics 1.6.1** — Vercel deployment analytics

### Dev Tools
- **ESLint 10.0.3** + `eslint-config-next` + `@typescript-eslint` — linting
- **Prettier 3.8.1** + `prettier-plugin-tailwindcss` — formatting with Tailwind class sorting
- **PostCSS 8.5** + **Autoprefixer 10.4.20** — CSS post-processing

---

## 2. System Purpose

**Valya** is a **SaaS platform for AI-powered real estate sales automation**, targeting Brazilian real estate agents (corretores imobiliarios) and small brokerage firms.

- **Target audience**: CRECI-licensed agents and brokerages operating in Brazil
- **Business model**: Subscription-based SaaS with tiered plans (Starter, Pro, Enterprise)
- **Geography & language**: Brazil — all UI in Portuguese-BR; inputs follow Brazilian formats (CPF, CNPJ, phone masks)

### Core Value Propositions
1. **Lead Pipeline Management** — Kanban board across 7 stages: Qualification > Cadence > Visitation > Proposal > Contract > Win > Loss
2. **AI-Powered WhatsApp Automation** — via Evolution API integration with custom AI prompts per agent
3. **Property Management** — multi-unit real estate listings with images, specs, and ad links
4. **Analytics & KPIs** — agent and admin dashboards with charts for leads, conversions, and revenue
5. **Subscription & Payment Management** — integrated with Asaas (Brazilian payment processor)

---

## 3. Project Structure

```
valya-front/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group (unauthenticated layout)
│   │   │   ├── login/page.tsx
│   │   │   ├── registro/page.tsx
│   │   │   └── esqueci-senha/page.tsx
│   │   ├── (client)/                 # Client (agent) route group
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── imoveis/page.tsx
│   │   │   ├── imoveis/[id]/page.tsx
│   │   │   ├── esteira/page.tsx
│   │   │   ├── configuracao-ia/page.tsx
│   │   │   └── perfil/page.tsx
│   │   ├── (admin)/                  # Admin route group
│   │   │   └── admin/
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── clientes/page.tsx
│   │   │       └── usuarios/page.tsx
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Public landing page
│   │   └── globals.css               # Global CSS variables and base styles
│   ├── components/
│   │   ├── ui/                       # Shadcn-style wrapped Radix UI components
│   │   ├── client/                   # Components scoped to the agent area
│   │   ├── admin/                    # Components scoped to the admin area
│   │   ├── landing/                  # Landing page section components
│   │   ├── inputs/                   # Custom input components (masked, formatted)
│   │   ├── generic/                  # Shared/utility components
│   │   └── theme-provider.tsx        # next-themes wrapper
│   ├── hooks/
│   │   ├── use-mobile.ts             # Viewport breakpoint detection
│   │   └── use-toast.ts              # Toast notification hook
│   ├── lib/
│   │   ├── types.ts                  # Global TypeScript interfaces
│   │   ├── utils.ts                  # cn() and generic utilities
│   │   └── mock-data.ts              # Dev-time mock data
│   ├── providers/
│   │   └── userProvider.tsx          # React Context for authenticated user state
│   ├── schemas/                      # Zod schemas (one file per domain entity)
│   │   ├── userSchema.ts
│   │   ├── propertySchema.ts
│   │   ├── leadSchema.ts
│   │   ├── planSchema.ts
│   │   ├── subscriptionSchema.ts
│   │   ├── aiConfigSchema.ts
│   │   ├── evolutionConfigSchema.ts
│   │   └── [15+ more schemas]
│   └── services/
│       ├── api/
│       │   ├── backendApi.ts         # Client-side Axios instance
│       │   └── ssrAPI.ts             # SSR-compatible API client
│       ├── user/                     # Auth & profile service calls
│       ├── properties/               # Property CRUD service calls
│       ├── aiConfig/                 # AI configuration service calls
│       ├── evolution/                # Evolution API integration calls
│       ├── cookies/                  # Cookie read/write helpers
│       └── generic/                  # Formatting utilities (phone, currency)
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
└── .env
```

### Directory Conventions
- Route groups `(auth)`, `(client)`, `(admin)` separate layout boundaries without affecting URL paths
- `components/ui/` holds only Radix UI wrappers — never domain logic
- `schemas/` is strictly for Zod — types are derived from schemas via `z.infer<>`
- `services/` owns all external communication — pages and components never call Axios directly

---

## 4. Data Architecture

This is a **frontend-only** application. There is no Prisma schema, no direct database access, and no backend runtime code. All data access is via REST API calls to a separate backend (`NEXT_PUBLIC_API_URL`, default: `http://localhost:3021`).

### Main Entities (from Zod schemas)

#### User & Auth
| Field | Type | Notes |
|---|---|---|
| id | string | |
| name | string | |
| email | string | |
| cpf | string | Brazilian taxpayer ID |
| phone | string | Masked input |
| role | UserRole | CLIENT or ADMIN |
| provider | AuthProvider | LOCAL, GOOGLE, or FACEBOOK |
| isActive | boolean | |
| avatarUrl | string? | |

Relations: subscription, properties, leads, aiConfig, evolutionConfig, asaasCustomer

#### Property
- Single or multi-unit listing (`PropertyMode`: SINGLE or MULTIPLE)
- Key fields: address, city, neighborhood, type, purpose, totalPrice, privateArea, bedrooms, bathrooms, garageCount, garageType, bbqType
- Relations: units (`PropertyUnit[]`), images (`PropertyImage[]`), adLinks (`PropertyAdLink[]`), leadProperties

#### Lead
- Pipeline stage tracked via `LeadStage` enum: QUALIFICATION > CADENCE > VISITATION > PROPOSAL > CONTRACT > WIN or LOSS
- Origin tracked via `LeadOrigin`: FACEBOOK, INSTAGRAM, TIKTOK, GOOGLE, WHATSAPP, OTHER
- Relations: messages (`Message[]`), properties (`Property[]`)

#### Subscription & Payments
- `Plan`: name, value, features list
- `Subscription`: status (TRIAL, ACTIVE, EXPIRED, CANCELLED), linked to agent/company
- `Payment`: date, amount, status, method

#### Integrations
- `AiConfig`: customPrompt, isActive
- `EvolutionConfig`: instanceName, instanceId, qrCode, connected, phone
- `AsaasCustomer`: Asaas payment processor link
- `RealStateAgent`: creci (license number), cnpj

---

## 5. Implemented Features

### Public
- `/` — Landing page: hero, benefits, pricing sections with plan cards

### Authentication
- `/login` — Email + password login
- `/registro` — Full registration form: name, email, CPF, CRECI, CNPJ, phone, password
- `/esqueci-senha` — Password reset flow

### Client (Agent) Area
- `/dashboard` — KPI cards (total leads, active leads, properties, conversions) + Recharts bar chart
- `/imoveis` — Property listing with search and pagination
- `/imoveis/[id]` — Property detail with tabs: general info, units, images, ad links
- `/esteira` — Sales pipeline: Kanban board with lead cards, stage progression, and embedded chat panel
- `/configuracao-ia` — AI assistant configuration (custom system prompt) + Evolution API (WhatsApp) QR code connection
- `/perfil` — User profile editing: name, email, phone, CRECI, CNPJ

### Admin Area
- `/admin/dashboard` — System-wide KPIs and revenue charts
- `/admin/clientes` — Client management table with subscription status and payment details
- `/admin/usuarios` — User management for agents and admins

---

## 6. External Integrations

### Axios Instances (`src/services/api/`)
- **`ssrAPI.ts`**: SSR-compatible client using `nookies.get()` to read the `valya-auth` cookie server-side
- **`backendApi.ts`**: Client-side Axios instance; sets `Authorization: Bearer <token>` header from cookie
- **Base URL**: `process.env.NEXT_PUBLIC_API_URL`
- **Response interceptor**: catches HTTP 420 (custom token-expired code) — clears cookie and redirects to `/login`

### Backend REST API Endpoints Called
- `POST /api/user/login`
- `GET /api/user/profile`
- `POST /api/user/agent/register`
- `GET /api/properties` (paginated)
- `GET /api/properties/:id`
- `POST /api/properties`, `PUT /api/properties`
- `GET /api/aiConfig`, `POST/PUT /api/aiConfig`
- `GET /api/evolution/:userId`

### Third-Party Services
| Service | Purpose |
|---|---|
| **Evolution API** | WhatsApp automation; QR code auth; instance-based multi-number support |
| **Asaas** | Brazilian payment processor for subscriptions and billing |
| **Vercel Analytics** | Deployment analytics (currently commented out) |

### Environment Variables
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (default: `http://localhost:3021`) |

---

## 7. Coding Patterns

### File Naming
- Pages: `page.tsx` per Next.js App Router convention
- Components: PascalCase exported functions (`KpiCard`, `ClientSidebar`)
- Hooks: `use-kebab-case.ts` (`use-mobile.ts`, `use-toast.ts`)
- Schemas: `camelCaseSchema.ts` (`propertySchema.ts`, `leadSchema.ts`)
- Services: `load*.ts` / `save*.ts` / `action*.ts` per operation type

### TypeScript
- All entity types derived from Zod schemas: `type UserForm = z.infer<typeof userSchema>`
- Enums defined in Zod (`z.enum([...])`) and re-exported as TypeScript types
- `"use client"` directive only on components that use browser APIs, hooks, or event handlers
- `lib/types.ts` holds non-schema interfaces for shared data shapes

### Forms
```typescript
const form = useForm<FormType>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
})
// Submit: form.handleSubmit(onValid, onInvalid)
```

### API Calls
```typescript
// Wrapped in react-promise-tracker for per-operation loading state:
await trackPromise(api.get('/endpoint'), 'trackerKey')

// Consumption:
const { promiseInProgress } = usePromiseTracker({ area: 'trackerKey' })
```

### UI Components
- `cn()` utility always used for className composition
- CVA variants for multi-variant components (Button, Badge)
- Radix UI primitives wrapped in `components/ui/` — never modified directly

### State Management
- `UserProvider` (Context API) for global auth state: `currentUser`, `login()`, `logout()`, `refreshProfile()`
- React Hook Form for all form state
- Component-level `useState` for local UI state (modals, tabs, pagination)

### Input Masking Patterns
- Phone: `(XX) 9XXXX-XXXX`
- CPF: `XXX.XXX.XXX-XX`
- CNPJ: `XX.XXX.XXX/XXXX-##`

### Notifications
- `toast.success('...')` / `toast.error('...')` via Sonner after every async operation
