# CLAUDE.md — Valya Front

## 1. Project Overview

Valya Front is a Next.js 15 (App Router) + React 19 + TypeScript SaaS dashboard for AI-powered real estate sales automation targeting Brazilian agents. The UI is built with Radix UI primitives styled via Tailwind CSS 4, forms are managed by React Hook Form + Zod, and all backend communication goes through Axios instances in `src/services/api/`. The app is frontend-only — there is no database or ORM in this repository.

---

## 2. Architecture & Directory Structure

```
src/
├── app/            # Next.js App Router — pages only, no business logic
│   ├── (auth)/     # Unauthenticated layout group
│   ├── (client)/   # Authenticated agent layout group
│   └── (admin)/    # Authenticated admin layout group
├── components/
│   ├── ui/         # Radix UI wrappers (shadcn-style) — no domain logic here
│   ├── client/     # Components used only in the (client) area
│   ├── admin/      # Components used only in the (admin) area
│   ├── landing/    # Public landing page sections
│   ├── inputs/     # Masked/formatted input components
│   └── generic/    # Truly shared components
├── hooks/          # Custom React hooks
├── lib/            # cn() utility, global TypeScript interfaces, mock data
├── providers/      # React Context providers (UserProvider)
├── schemas/        # Zod schemas — one file per domain entity
└── services/       # All Axios calls and business logic — pages never call Axios directly
    └── api/        # Axios instance definitions (backendApi.ts, ssrAPI.ts)
```

- Route groups `(auth)`, `(client)`, `(admin)` exist purely for layout separation — they do not appear in URLs.
- `components/ui/` is a boundary: never add domain logic or API calls inside it.
- `schemas/` is the source of truth for types — always derive types with `z.infer<typeof schema>`, never hand-write duplicate interfaces.
- `services/` is the only place Axios is imported or called.

---

## 3. Development Guidelines

### Running locally
```bash
npm run dev       # starts Next.js dev server
npm run build     # production build
npm run start     # runs the production build
npm run lint      # ESLint check
```

### Environment variables
Copy `.env` and set:
```
NEXT_PUBLIC_API_URL=http://localhost:3021
```
The app will not function without a running backend at the configured URL.

### No test framework is present in this project.

---

## 4. Coding Standards

### File naming
| Artifact | Convention | Example |
|---|---|---|
| Page | `page.tsx` (Next.js) | `app/(client)/dashboard/page.tsx` |
| Component | PascalCase | `KpiCard.tsx`, `ClientSidebar.tsx` |
| Hook | `use-kebab-case.ts` | `use-mobile.ts` |
| Schema | `camelCaseSchema.ts` | `propertySchema.ts` |
| Service | `load*.ts` / `save*.ts` / `action*.ts` | `loadAiConfig.ts`, `saveProperty.ts` |

### TypeScript
- Derive all entity types from Zod: `type PropertyForm = z.infer<typeof propertySchema>`
- Enums are Zod enums (`z.enum([...])`), re-exported as TypeScript types — do not use native `enum`
- Add `"use client"` only when the component uses hooks, event handlers, or browser APIs
- Shared non-schema interfaces live in `src/lib/types.ts`
- Target: `ES2017`, moduleResolution: `bundler` (see `tsconfig.json`)

### Import ordering (enforced by ESLint + Prettier)
1. React / Next.js
2. Third-party libraries
3. Internal aliases (`@/components/...`, `@/lib/...`, `@/services/...`)
4. Relative imports

### Path aliases
`@/` maps to `src/` — always use aliases, never `../../..` relative chains.

---

## 5. API & Data Fetching Patterns

### Axios instances
```typescript
// Client-side (backendApi.ts):
// Reads valya-auth cookie on the client and sets Authorization header automatically.
import api from '@/services/api/backendApi'

// SSR-compatible (ssrAPI.ts):
// Uses nookies.get(ctx) to read the cookie server-side.
import { getAPIClient } from '@/services/api/ssrAPI'
const api = getAPIClient(ctx)
```

- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- Auth header: `Authorization: Bearer <token>` (token from `valya-auth` cookie)
- HTTP 420 interceptor: auto-clears cookie and redirects to `/login` on token expiry

### Service module pattern
Every domain area has its own folder under `src/services/`. Each operation is a named export in its own file:
```typescript
// src/services/aiConfig/loadAiConfig.ts
export async function loadAiConfig(): Promise<AiConfig | undefined> {
  return trackPromise(
    api.get('/api/aiConfig').then(res => res.data),
    'loadAiConfig'
  )
}
```

### Loading state
Use `react-promise-tracker` — wrap every async call with `trackPromise(promise, 'areaKey')` and read loading state with `usePromiseTracker({ area: 'areaKey' })`. Use a unique area key per operation so multiple loaders can coexist on the same page.

### Error handling
```typescript
try {
  const data = await loadSomething()
  toast.success('Saved successfully')
} catch {
  toast.error('Something went wrong')
}
```
Errors are surfaced via Sonner toasts. Service functions catch errors internally and return `undefined` on failure; callers must handle the undefined case.

---

## 6. UI & Styling Conventions

### Component library
All interactive components are Radix UI primitives wrapped in `src/components/ui/`. They follow the shadcn/ui pattern: the wrapper file contains the styled export and CVA variants where needed. Never install pre-built shadcn components over existing ones without reviewing the wrapper.

### Class composition
Always use the `cn()` utility from `src/lib/utils.ts` for conditional or merged class names:
```typescript
import { cn } from '@/lib/utils'
className={cn('base-classes', condition && 'conditional-class', className)}
```

### Tailwind CSS 4
- Configuration is in `postcss.config.mjs` (no `tailwind.config.ts` — Tailwind 4 uses CSS-based config)
- Theme tokens (colors, radius, fonts) are defined as CSS custom properties in `src/app/globals.css`
- Primary color: `#FF6600` (orange), exposed as `--primary`
- Class sorting is enforced by `prettier-plugin-tailwindcss` — run Prettier before committing

### Responsive design
Breakpoints follow Tailwind defaults. Mobile-first: base styles target mobile, `sm:` and `lg:` override for larger viewports. Use the `useMobile()` hook for JS-side breakpoint detection.

### Reusable components
Domain-specific reusable components go in `components/client/` or `components/admin/` (not in `components/ui/`). Generic cross-area components go in `components/generic/`.

---

## 7. State Management

### Global state
`UserProvider` (`src/providers/userProvider.tsx`) is the single global state store — it holds the authenticated user and exposes:
- `currentUser: User | null`
- `login(token: string): Promise<void>`
- `logout(): void`
- `refreshProfile(): Promise<void>`

Access it via: `const { currentUser } = useUserProvider()`

### Form state
React Hook Form manages all form state. Always integrate with Zod:
```typescript
const form = useForm<FormType>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
})
```

### Async / loading state
`react-promise-tracker` per operation area key (see Section 5). Do not use ad-hoc `isLoading` booleans when a tracker key can be used instead.

### Local UI state
Component-level `useState` for transient UI concerns: open/close modals, active tab, current page index. Do not lift these to context.

---

## 8. Tactical Architecture Notes

- **HTTP 420 is a custom code**: The backend uses 420 (not 401) to signal token expiry. The Axios interceptor in `ssrAPI.ts` handles this. If you add a new Axios instance, replicate this interceptor.
- **`valya-auth` cookie name is load-bearing**: The cookie name is hardcoded in both `backendApi.ts` and `ssrAPI.ts` and in the logout logic of `UserProvider`. Change it in all three places simultaneously.
- **Tailwind 4 has no config file**: There is no `tailwind.config.ts`. All theme customization lives in `globals.css` as CSS variables. Do not create a `tailwind.config.ts` — it will conflict.
- **`"use client"` boundary**: Layouts under route groups are server components. Adding state or hooks to a layout requires splitting it into a server shell + a `"use client"` inner component.
- **Brazilian input masks are in `components/inputs/`**: Do not use plain `<input>` for CPF, CNPJ, or phone fields. Use the masked components from `components/inputs/` to ensure consistent format and validation.
- **Zod enums drive the UI**: Dropdown options for LeadStage, LeadOrigin, GarageType, etc. are derived from the Zod schema enum values. If the backend adds a new enum value, update the schema and the UI will reflect it automatically.
- **`mock-data.ts` is dev-only**: `src/lib/mock-data.ts` exists for UI development without a backend. Never import it in production service files or pages that are not explicitly guarded.
- **Vercel Analytics is disabled**: The `@vercel/analytics` import in `app/layout.tsx` is commented out. Re-enable it only after confirming the Vercel project is linked.
- **No test suite**: There are no tests in this project. Manual testing is the current practice.
