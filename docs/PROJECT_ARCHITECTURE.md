# AuraVision Auto-Annotation Dashboard - Project Architecture

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [Directory Details](#directory-details)
6. [Routing Structure](#routing-structure)
7. [Code Conventions](#code-conventions)
8. [Critical Rules](#critical-rules)

---

## 🎯 Project Overview

**Project Name:** AuraVision Auto-Annotation Dashboard  
**Type:** Internal Dashboard Application  
**Purpose:** Dataset management and auto-annotation services for machine learning workflows  
**Framework:** Next.js 16.1.1 with App Router  
**Language:** TypeScript  
**Package Manager:** pnpm  

**Key Features:**
- Dataset management and file tracking
- Auto-annotation with AI models (RexOmni, Florence)
- Annotation review and consensus system
- Analytics and performance monitoring
- Team collaboration and workflow tracking

---

## 🛠 Technology Stack

### Core Framework
- **Next.js:** 16.1.1 (with Turbopack)
- **React:** 19.2.3
- **TypeScript:** 5.x
- **Node.js:** 20+

### UI & Styling
- **Tailwind CSS:** 4.x
- **shadcn/ui:** Component library (New York style)
- **Radix UI:** Headless UI primitives
- **Lucide React:** Icon library
- **Framer Motion:** Animation library

### State Management & Data Fetching
- **TanStack Query:** Server state management (planned)
- **Zustand:** Client state management
- **Axios:** HTTP client

### Forms & Validation
- **React Hook Form:** 7.71.1
- **Zod:** 4.3.6 - Schema validation

### Data Visualization
- **Recharts:** 2.15.4 - Charts and analytics

### Canvas & Annotations
- **Fabric.js:** 7.1.0 - Canvas manipulation for annotations

### UI Components
- **Sonner:** Toast notifications
- **Vaul:** Drawer component
- **Date-fns:** Date manipulation
- **cmdk:** Command palette

---

## 📁 Project Structure

```
auto-annotation/
├── src/                          # Source code root
│   ├── app/                      # Next.js App Router directory (ONLY app directory)
│   │   ├── layout.tsx           # Root layout (REQUIRED)
│   │   ├── page.tsx             # Home page (/)
│   │   ├── globals.css          # Global styles & design system
│   │   ├── favicon.ico          # Favicon
│   │   ├── dashboard/           # Dashboard routes
│   │   │   ├── page.tsx        # /dashboard
│   │   │   └── datasets/       
│   │   │       └── [datasetId]/
│   │   │           ├── page.tsx             # /dashboard/datasets/:id
│   │   │           └── files/
│   │   │               └── [fileId]/
│   │   │                   └── review/
│   │   │                       └── page.tsx  # /dashboard/datasets/:id/files/:fileId/review
│   │   └── analytics/
│   │       └── page.tsx         # /analytics
│   │
│   ├── components/               # Shared components
│   │   └── ui/                  # shadcn/ui components (56 components)
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── form.tsx
│   │       ├── table.tsx
│   │       └── ... (52 more)
│   │
│   ├── entities/                 # Domain entities (Feature-Sliced Design inspired)
│   │   ├── annotation/          # Annotation domain
│   │   │   ├── index.ts        # Public API
│   │   │   └── ui/             # Annotation UI components
│   │   │       ├── AnnotationCanvas.tsx
│   │   │       └── AnnotationShape.tsx
│   │   ├── comment/             # Comment domain
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       ├── CommentBubble.tsx
│   │   │       └── CommentThread.tsx
│   │   ├── dataset/             # Dataset domain
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       ├── DatasetCard.tsx
│   │   │       └── DatasetStatus.tsx
│   │   ├── dataset-file/        # Dataset file domain
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       ├── DatasetFileCard.tsx
│   │   │       └── DatasetFileGrid.tsx
│   │   ├── model/               # AI Model domain
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── ModelCard.tsx
│   │   └── statistic/           # Statistics domain
│   │       ├── index.ts
│   │       └── ui/
│   │           └── MetricCard.tsx
│   │
│   ├── features/                 # Feature modules (complex user interactions)
│   │   ├── annotation-comments/ # Annotation commenting feature
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── AnnotationComments.tsx
│   │   ├── auto-annotate/       # Auto-annotation feature
│   │   │   ├── index.ts
│   │   │   ├── model/          # Business logic
│   │   │   │   ├── AutoAnnotateProvider.tsx
│   │   │   │   └── useAutoAnnotate.ts
│   │   │   └── ui/
│   │   ├── dataset-list/        # Dataset listing feature
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── DatasetList.tsx
│   │   ├── draw-annotations/    # Drawing annotations feature
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── DrawAnnotations.tsx
│   │   └── workflow-tracker/    # Workflow tracking feature
│   │       ├── index.ts
│   │       └── ui/
│   │           └── WorkflowTracker.tsx
│   │
│   ├── widgets/                  # Page-level composite components
│   │   ├── annotation-editor/   # Complete annotation editor widget
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       ├── AnnotationEditor.tsx
│   │   │       ├── AnnotationToolbar.tsx
│   │   │       ├── ClassManager.tsx
│   │   │       ├── ConsensusOverlay.tsx
│   │   │       ├── Crosshair.tsx
│   │   │       └── ReviewControls.tsx
│   │   ├── dataset-stats/       # Dataset statistics widget
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── DatasetStats.tsx
│   │   ├── header/              # Application header widget
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── Header.tsx
│   │   ├── model-control-panel/ # AI model control panel widget
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── AIControlPanel.tsx
│   │   ├── sidebar/             # Application sidebar widget
│   │   │   ├── index.ts
│   │   │   └── ui/
│   │   │       └── Sidebar.tsx
│   │   └── team-stats/          # Team statistics widget
│   │       ├── index.ts
│   │       └── ui/
│   │           └── TeamStatsWidget.tsx
│   │
│   ├── shared/                   # Shared utilities and services
│   │   ├── api/                 # API client and services
│   │   │   ├── client.ts       # Axios client configuration
│   │   │   ├── dataset-api.ts  # Dataset API endpoints
│   │   │   ├── model-api.ts    # Model API endpoints
│   │   │   ├── analytics-api.ts # Analytics API endpoints
│   │   │   └── index.ts        # API exports
│   │   ├── store/              # Zustand stores
│   │   │   └── review-store.ts # Review state management
│   │   └── ui/                 # Shared UI components
│   │       └── charts/         # Chart components
│   │           ├── AccuracyTrendChart.tsx
│   │           ├── BurndownChart.tsx
│   │           ├── ChartWrapper.tsx
│   │           ├── ThroughputChart.tsx
│   │           └── index.ts
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── use-mobile.ts       # Mobile detection hook
│   │
│   └── lib/                     # Utility libraries
│       └── utils.ts            # Helper functions (cn, etc.)
│
├── public/                      # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── docs/                        # Documentation
│   ├── PROJECT_ARCHITECTURE.md # This file
│   ├── get-start.md           # Getting started guide
│   ├── step-1.md              # Implementation step 1
│   ├── step-2.md              # Implementation step 2
│   ├── step-3.md              # Implementation step 3
│   ├── step-4.md              # Implementation step 4
│   ├── step-5.md              # Implementation step 5
│   └── postman_collection.json # API collection
│
├── components.json              # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
├── pnpm-lock.yaml             # Lock file
├── postcss.config.mjs         # PostCSS configuration
├── eslint.config.mjs          # ESLint configuration
└── README.md                   # Project README
```

---

## 🏗 Architecture Patterns

### 1. **Feature-Sliced Design (Inspired)**

The project uses a modified Feature-Sliced Design architecture:

**Layer Hierarchy (from low to high):**
```
shared → entities → features → widgets → app
```

**Layer Descriptions:**

- **`shared/`**: Reusable utilities, API clients, stores, and shared components
  - No business logic
  - Can be used by any layer above
  - Should not import from other layers

- **`entities/`**: Business domain entities (single responsibility)
  - Represents domain models (Dataset, Annotation, Comment, etc.)
  - Contains UI components for displaying entities
  - Exports through `index.ts` for clean API

- **`features/`**: User interactions and complex behaviors
  - Implements specific features (auto-annotation, drawing, commenting)
  - Can use entities and shared
  - Contains business logic in `model/` subdirectory
  - UI components in `ui/` subdirectory

- **`widgets/`**: Page-level composite components
  - Combines multiple features and entities
  - Represents complete sections of pages
  - Examples: AnnotationEditor, Header, Sidebar

- **`app/`**: Next.js App Router (pages and layouts)
  - Composes widgets to create pages
  - Handles routing and layouts

### 2. **Component Organization**

Each feature/entity/widget follows this structure:

```
feature-name/
├── index.ts              # Public API (exports only what's needed)
├── model/                # Business logic (hooks, providers, types)
│   ├── useFeature.ts
│   └── FeatureProvider.tsx
└── ui/                   # UI components
    └── FeatureComponent.tsx
```

### 3. **State Management Strategy**

- **Server State**: TanStack Query (React Query) - NOT stored in Zustand
- **Client State**: Zustand stores in `shared/store/`
- **Form State**: React Hook Form with Zod validation
- **URL State**: Next.js App Router (searchParams, dynamic routes)

### 4. **Styling Strategy**

- **Design System**: Centralized in `src/app/globals.css`
- **Component Styles**: Tailwind CSS classes
- **No Inline Colors**: All colors defined in globals.css as CSS variables
- **Theme**: Dark mode by default with `next-themes`

---

## 📂 Directory Details

### `src/app/` - App Router (CRITICAL)

**⚠️ IMPORTANT:** This is the ONLY `app` directory. Never create a parallel `app/` folder in the project root.

```typescript
// src/app/layout.tsx - Root Layout (REQUIRED)
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
```

**Key Files:**
- `layout.tsx`: Root layout, defines HTML structure, fonts, metadata
- `page.tsx`: Home page component
- `globals.css`: Global styles, CSS variables, Tailwind directives

**Routing Pattern:**
```
src/app/
├── page.tsx              → /
├── dashboard/
│   ├── page.tsx         → /dashboard
│   └── datasets/
│       └── [datasetId]/
│           ├── page.tsx → /dashboard/datasets/:datasetId
│           └── files/
│               └── [fileId]/
│                   └── review/
│                       └── page.tsx → /dashboard/datasets/:datasetId/files/:fileId/review
└── analytics/
    └── page.tsx         → /analytics
```

### `src/components/ui/` - shadcn/ui Components

**56 pre-built components** from shadcn/ui library:

**Form Components:**
- `button.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `slider.tsx`, `calendar.tsx`, `form.tsx`, `label.tsx`

**Layout Components:**
- `card.tsx`, `dialog.tsx`, `sheet.tsx`, `drawer.tsx`, `tabs.tsx`, `accordion.tsx`, `separator.tsx`, `scroll-area.tsx`, `resizable.tsx`

**Navigation:**
- `navigation-menu.tsx`, `menubar.tsx`, `dropdown-menu.tsx`, `context-menu.tsx`, `breadcrumb.tsx`, `pagination.tsx`, `sidebar.tsx`

**Feedback:**
- `alert.tsx`, `alert-dialog.tsx`, `toast.tsx`, `sonner.tsx`, `progress.tsx`, `spinner.tsx`, `skeleton.tsx`

**Data Display:**
- `table.tsx`, `badge.tsx`, `avatar.tsx`, `tooltip.tsx`, `hover-card.tsx`, `popover.tsx`, `chart.tsx`

**Others:**
- `command.tsx`, `combobox.tsx`, `carousel.tsx`, `empty.tsx`, `kbd.tsx`, `toggle.tsx`, `toggle-group.tsx`

**Usage:**
```typescript
// Always use shadcn CLI to add components
npx shadcn@latest add button
npx shadcn@latest add dialog
```

### `src/entities/` - Domain Entities

Business entities representing core domain models:

1. **annotation/** - Annotation entity
   - Types: Bounding boxes, polygons, segmentation masks
   - UI: Canvas rendering, shape components

2. **comment/** - Comment entity  
   - Types: Text comments, threads, mentions
   - UI: Comment bubbles, thread display

3. **dataset/** - Dataset entity
   - Types: Dataset metadata, status, progress
   - UI: Dataset cards, status badges

4. **dataset-file/** - Dataset file entity
   - Types: Image files, annotations, metadata
   - UI: File cards, file grid

5. **model/** - AI Model entity
   - Types: Model configs (RexOmni, Florence)
   - UI: Model selection cards

6. **statistic/** - Statistics entity
   - Types: Metrics, analytics data
   - UI: Metric cards

### `src/features/` - Features

Complex user interactions:

1. **annotation-comments/** - Add/view comments on annotations
2. **auto-annotate/** - Trigger AI auto-annotation
3. **dataset-list/** - List and filter datasets
4. **draw-annotations/** - Draw bounding boxes/polygons
5. **workflow-tracker/** - Track annotation workflow progress

### `src/widgets/` - Widgets

Page-level composite components:

1. **annotation-editor/** - Complete annotation interface
   - Toolbar, canvas, class manager, consensus overlay

2. **dataset-stats/** - Dataset statistics dashboard

3. **header/** - Application header with navigation

4. **model-control-panel/** - AI model configuration panel

5. **sidebar/** - Application sidebar navigation

6. **team-stats/** - Team performance metrics

### `src/shared/` - Shared Resources

#### `shared/api/`

API services using Axios:

```typescript
// shared/api/client.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' }
})

// shared/api/dataset-api.ts
export const datasetApi = {
  getAll: () => apiClient.get('/datasets'),
  getById: (id: string) => apiClient.get(`/datasets/${id}`),
  create: (data: any) => apiClient.post('/datasets', data),
  // ...
}
```

**⚠️ IMPORTANT:** API services should NOT be stored in Zustand stores when using TanStack Query.

#### `shared/store/`

Zustand stores for client state:

```typescript
// shared/store/review-store.ts
import { create } from 'zustand'

interface ReviewState {
  selectedAnnotation: string | null
  setSelectedAnnotation: (id: string | null) => void
}

export const useReviewStore = create<ReviewState>((set) => ({
  selectedAnnotation: null,
  setSelectedAnnotation: (id) => set({ selectedAnnotation: id })
}))
```

#### `shared/ui/charts/`

Reusable chart components using Recharts:
- `AccuracyTrendChart.tsx`
- `BurndownChart.tsx`
- `ThroughputChart.tsx`
- `ChartWrapper.tsx`

### `src/hooks/` - Custom Hooks

```typescript
// hooks/use-mobile.ts
import { useState, useEffect } from 'react'

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}
```

### `src/lib/` - Utilities

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 🛣 Routing Structure

### Next.js App Router

**Available Routes:**

| Route | File Path | Description |
|-------|-----------|-------------|
| `/` | `src/app/page.tsx` | Home page / Landing |
| `/dashboard` | `src/app/dashboard/page.tsx` | Dashboard overview |
| `/dashboard/datasets/:datasetId` | `src/app/dashboard/datasets/[datasetId]/page.tsx` | Dataset detail page |
| `/dashboard/datasets/:datasetId/files/:fileId/review` | `src/app/dashboard/datasets/[datasetId]/files/[fileId]/review/page.tsx` | File review & annotation page |
| `/analytics` | `src/app/analytics/page.tsx` | Analytics dashboard |

**Dynamic Routes:**

```typescript
// src/app/dashboard/datasets/[datasetId]/page.tsx
export default async function DatasetPage({
  params
}: {
  params: Promise<{ datasetId: string }>
}) {
  const { datasetId } = await params
  // Fetch dataset data
  return <div>Dataset {datasetId}</div>
}
```

**Layout Hierarchy:**

```
Root Layout (layout.tsx)
└── Home Page (page.tsx)
└── Dashboard Layout (dashboard/layout.tsx - if exists)
    └── Dashboard Page (dashboard/page.tsx)
    └── Dataset Page (dashboard/datasets/[datasetId]/page.tsx)
    └── Review Page (dashboard/datasets/[datasetId]/files/[fileId]/review/page.tsx)
└── Analytics Page (analytics/page.tsx)
```

---

## 📝 Code Conventions

### 1. **Language Rules** ⚠️ CRITICAL

**English ONLY for:**
- All code (variables, functions, classes, types)
- Comments and documentation
- Commit messages
- Technical content

**Persian/Farsi ONLY for:**
- User-facing UI text
- Error messages shown to users
- Placeholder text in forms
- Labels and buttons

```typescript
// ❌ BAD - Persian in code
const دیتاست = 'dataset'
// داشبورد کاربری
function نمایشدیتاست() {}

// ✅ GOOD - English in code, Persian in UI
const datasetName = 'dataset'
// User dashboard component
function DatasetDisplay() {
  return <h1>داشبورد مدیریت دیتاست</h1> // Persian in UI is OK
}
```

### 2. **Component Definition**

**Always use arrow functions:**

```typescript
// ✅ GOOD
export const Button = ({ children }: { children: React.ReactNode }) => {
  return <button>{children}</button>
}

// ❌ BAD
export default function Button({ children }) {
  return <button>{children}</button>
}
```

### 3. **Import Aliases**

Use TypeScript path aliases from `tsconfig.json`:

```typescript
// ✅ GOOD
import { Button } from '@/components/ui/button'
import { datasetApi } from '@/shared/api/dataset-api'
import { cn } from '@/lib/utils'

// ❌ BAD
import { Button } from '../../../components/ui/button'
```

**Available Aliases:**
- `@/*` → `src/*`
- `@/components` → `src/components`
- `@/ui` → `src/components/ui`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`

### 4. **Component Exports**

Use public API exports through `index.ts`:

```typescript
// features/auto-annotate/index.ts
export { AutoAnnotateButton } from './ui/AutoAnnotateButton'
export { useAutoAnnotate } from './model/useAutoAnnotate'
// Don't export internal implementation details

// Usage in other files
import { AutoAnnotateButton, useAutoAnnotate } from '@/features/auto-annotate'
```

### 5. **Styling Conventions**

**Use centralized design system:**

```typescript
// ❌ BAD - Inline colors
<div className="bg-orange-500 text-white">...</div>

// ✅ GOOD - Use CSS variables from globals.css
<div className="bg-primary text-primary-foreground">...</div>
```

**All colors and design tokens** must be defined in `src/app/globals.css`.

### 6. **Forms with Many Fields**

**Use dedicated pages, NOT modals:**

```typescript
// ❌ BAD - Complex form in modal
<Dialog>
  <Form>
    <Input name="field1" />
    <Input name="field2" />
    {/* 10+ more fields */}
  </Form>
</Dialog>

// ✅ GOOD - Dedicated page
// Navigate to /dashboard/datasets/new
<Link href="/dashboard/datasets/new">
  <Button>Create Dataset</Button>
</Link>
```

### 7. **Toast Notifications**

**Use Sonner library:**

```typescript
import { toast } from 'sonner'

// Success
toast.success('Dataset created successfully')

// Error
toast.error('Failed to create dataset')

// Custom
toast('Processing...', { duration: 2000 })
```

**❌ Don't create custom toast components**

### 8. **State Management**

**Don't put API services in stores:**

```typescript
// ❌ BAD
const useDatasetStore = create((set) => ({
  datasets: [],
  fetchDatasets: async () => {
    const data = await datasetApi.getAll()
    set({ datasets: data })
  }
}))

// ✅ GOOD - Use TanStack Query for server state
import { useQuery } from '@tanstack/react-query'

const { data: datasets } = useQuery({
  queryKey: ['datasets'],
  queryFn: datasetApi.getAll
})
```

### 9. **Complexity Preference**

**Keep solutions simple and straightforward:**

```typescript
// ❌ BAD - Over-engineered
const useComplexDataFetcher = () => {
  const [state, dispatch] = useReducer(complexReducer, initialState)
  // 50 lines of complex logic
}

// ✅ GOOD - Simple and clear
const { data, isLoading } = useQuery(['key'], fetchFn)
```

---

## ⚠️ Critical Rules

### 1. **NEVER Create Parallel `app/` Directory**

**❌ FATAL ERROR:**
```
project-root/
├── app/              ← NEVER create this
└── src/
    └── app/          ← ONLY this should exist
```

**Reason:** Next.js will try to use the root `app/` folder, but it lacks `layout.tsx`, causing 404 errors.

**✅ CORRECT:**
```
project-root/
└── src/
    └── app/          ← ONLY app directory
        ├── layout.tsx  ← Required
        └── page.tsx
```

### 2. **Database: Prisma + SQLite**

The project uses **Prisma ORM with SQLite** database, NOT PostgreSQL.

```prisma
// prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### 3. **Use shadcn CLI for Components**

**Always use CLI to add UI components:**

```bash
# ✅ GOOD
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu

# ❌ BAD - Manual creation
# Don't manually create components in src/components/ui/
```

### 4. **Custom React Hook for User Session**

**Use a single custom hook** for all user-related behaviors:

```typescript
// hooks/useUser.ts
export const useUser = () => {
  const session = useSession() // Get login status and user data
  const logout = useLogout()   // Logout functionality
  
  return {
    user: session.data?.user,
    isAuthenticated: !!session.data,
    isLoading: session.isLoading,
    logout,
    LoginButton: !session.data ? <LoginButton /> : null,
    RegisterButton: !session.data ? <RegisterButton /> : null
  }
}
```

### 5. **File Organization**

```
feature-name/
├── index.ts              # Public API exports
├── model/                # Business logic, hooks, providers
│   ├── types.ts
│   ├── useFeature.ts
│   └── FeatureProvider.tsx
└── ui/                   # React components
    └── FeatureComponent.tsx
```

### 6. **Imports Flow**

**Layers can only import from lower layers:**

```
app → can import from → widgets, features, entities, shared
widgets → can import from → features, entities, shared
features → can import from → entities, shared
entities → can import from → shared
shared → can import from → nothing (self-contained)
```

### 7. **Environment Variables**

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
DATABASE_URL=file:./dev.db
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm installed globally

### Installation

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Open browser
http://localhost:3000
```

### Development Commands

```bash
# Development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start

# Lint code
pnpm run lint

# Add shadcn component
npx shadcn@latest add <component-name>
```

### Clean Restart

If you encounter issues:

```bash
# Stop dev server (Ctrl+C)

# Remove cache
rm -rf .next

# Restart
pnpm run dev
```

---

## 📊 Project Statistics

- **Framework:** Next.js 16.1.1 (Turbopack)
- **React Version:** 19.2.3
- **TypeScript:** 5.x
- **Total UI Components:** 56 (shadcn/ui)
- **Total Dependencies:** 48
- **Total Dev Dependencies:** 10
- **Package Manager:** pnpm
- **Architecture:** Feature-Sliced Design (modified)
- **Styling:** Tailwind CSS 4.x
- **State Management:** Zustand + TanStack Query

---

## 🎨 Design System

### Color Palette (globals.css)

All colors are defined in `src/app/globals.css` using CSS variables:

```css
:root {
  --primary: #FF6300;        /* Orange accent */
  --background: #0A0A0A;     /* Dark background */
  --foreground: #FFFFFF;     /* White text */
  --card: #1A1A1A;          /* Card background */
  --border: #2A2A2A;        /* Border color */
  /* ... more variables */
}
```

**Usage:**
```typescript
<div className="bg-background text-foreground border-border">
  <h1 className="text-primary">AuraVision</h1>
</div>
```

### Typography

- **Font Sans:** Geist Sans (Google Fonts)
- **Font Mono:** Geist Mono (Google Fonts)

### Spacing & Sizing

Follow Tailwind's default spacing scale:
- `p-4` (1rem / 16px)
- `m-8` (2rem / 32px)
- `gap-6` (1.5rem / 24px)

---

## 🔗 API Integration

### Base URL

```typescript
// shared/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
```

### API Structure

```typescript
// shared/api/dataset-api.ts
export const datasetApi = {
  // GET /api/datasets
  getAll: () => apiClient.get('/datasets'),
  
  // GET /api/datasets/:id
  getById: (id: string) => apiClient.get(`/datasets/${id}`),
  
  // POST /api/datasets
  create: (data: CreateDatasetDto) => apiClient.post('/datasets', data),
  
  // PUT /api/datasets/:id
  update: (id: string, data: UpdateDatasetDto) => 
    apiClient.put(`/datasets/${id}`, data),
  
  // DELETE /api/datasets/:id
  delete: (id: string) => apiClient.delete(`/datasets/${id}`)
}
```

---

## 📚 Additional Documentation

- **Getting Started:** `docs/get-start.md`
- **Implementation Steps:**
  - Step 1: `docs/step-1.md`
  - Step 2: `docs/step-2.md`
  - Step 3: `docs/step-3.md`
  - Step 4: `docs/step-4.md`
  - Step 5: `docs/step-5.md`
- **API Collection:** `docs/postman_collection.json`

---

## 🎯 Key Takeaways for LLMs

When working with this project, remember:

1. **ONLY ONE `app/` directory** exists at `src/app/` - NEVER create one at project root
2. **All code in English**, UI text in Persian/Farsi
3. **Use arrow functions** for components
4. **Use shadcn CLI** to add components, don't create manually
5. **Centralized styles** in globals.css, no inline colors
6. **TanStack Query** for server state, Zustand for client state
7. **Feature-Sliced Design** architecture (shared → entities → features → widgets → app)
8. **Simple solutions** preferred over complex ones
9. **Prisma + SQLite** for database
10. **Dedicated pages** for complex forms, not modals

---

## 📞 Contact & Support

For questions or issues, refer to:
- Project documentation in `docs/`
- This architecture guide
- Component examples in `src/`

---

**Last Updated:** February 1, 2026  
**Version:** 0.1.0  
**Author:** AuraVision Team
