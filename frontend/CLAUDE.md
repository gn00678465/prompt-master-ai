# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` - Starts Vite development server on port 3000
- **Build**: `pnpm build` - Creates production build using Vite
- **Start production**: `pnpm start` - Runs production server
- **Lint**: `pnpm lint` - Runs ESLint with @antfu/eslint-config
- **Lint fix**: `pnpm lint:fix` - Auto-fixes linting issues

## Tech Stack & Architecture

### Core Framework
- **TanStack Start**: Full-stack React framework with SSR/SSG capabilities
- **TanStack Router**: Type-safe file-based routing system
- **React 19**: Latest React with Concurrent Features
- **TypeScript**: Strict typing with path aliases (`@/*` -> `./src/*`)

### UI & Styling
- **Tailwind CSS v4**: Utility-first CSS with custom design tokens
- **shadcn/ui**: Component library built on Radix UI primitives
- **Lucide React**: Icon library
- **CSS Variables**: Extensive theming system with light/dark mode support

### Form & State Management
- **React Hook Form**: Form validation and state management (implemented)
- **Built-in React State**: Using useState/useReducer patterns
- **Missing**: TanStack Query for server state, Zustand for client state, Zod for validation

### Development Tools
- **Vite**: Build tool and dev server with TanStack Start plugin
- **ESLint**: @antfu/eslint-config with React, TypeScript, and stylistic rules
- **PostCSS**: With Tailwind CSS processing
- **React Compiler**: Babel plugin for React 19 compiler optimizations

## Project Structure

```
src/
├── routes/                 # File-based routing (TanStack Router)
│   ├── __root.tsx         # Root layout with global styles
│   ├── index.tsx          # Authentication page (login/register tabs)
│   ├── prompt/
│   │   └── index.tsx      # Prompt optimization page
│   ├── templates/
│   │   └── index.tsx      # Template management page
│   └── history/
│       └── index.tsx      # History viewing page
├── components/
│   ├── ui/                # shadcn/ui components (13 components)
│   │   ├── button.tsx, card.tsx, input.tsx, etc.
│   ├── api-key-input.tsx
│   ├── frequently-asked-questions.tsx
│   ├── prompt-optimizer.tsx
│   ├── template-form.tsx
│   ├── template-manager.tsx
│   └── template-selector.tsx
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
├── styles/
│   └── app.css            # Global styles with CSS variables
├── router.tsx             # Router configuration
└── routeTree.gen.ts       # Auto-generated route tree
```

## Key Architecture Patterns

### Routing System
- Uses TanStack Router's file-based routing
- Route files export a `Route` created with `createFileRoute()`
- Root route (`__root.tsx`) handles global layout and head configuration
- Router configuration in `src/router.tsx` with scroll restoration

### Component Architecture
- shadcn/ui components provide consistent design system
- Components use Tailwind CSS for styling
- Path aliases configured: `@/*` maps to `./src/*`

### Styling Approach
- Tailwind CSS v4 with extensive CSS custom properties
- Dark/light theme support via CSS variables
- Design tokens defined in `:root` and `.dark` selectors
- Uses OKLCH color space for consistent color handling

### Form Handling
- React Hook Form for complex forms with validation
- TypeScript interfaces for form data types
- Error handling with field-level validation messages

## Development Guidelines

### Code Style
- Uses @antfu/eslint-config (2-space indentation, single quotes)
- React/TypeScript/JSX support with stylistic rules
- Route generation files (`routeTree.gen.ts`) are ignored

### Component Patterns
- Functional components with TypeScript interfaces
- Form components use React Hook Form patterns
- UI components follow shadcn/ui conventions
- Icon usage via Lucide React

### Authentication & Data Flow
- Authentication UI implemented as tabs on index route (login/register)
- All API calls currently mocked with setTimeout (no real backend integration)
- Form handling with React Hook Form but missing Zod validation
- Mock data used throughout application for templates, history, and optimization
- Missing protected routes and proper authentication state management

## Current Implementation Status

The project currently contains:
- Complete authentication UI with login/register tabs on index route
- Full application routes: `/prompt/` (optimization), `/templates/` (management), `/history/` (viewing)
- Comprehensive shadcn/ui component system (13 UI components)
- Business components: prompt-optimizer, template-manager, template-selector, api-key-input, FAQ
- TanStack Router with file-based routing
- Tailwind CSS v4 theming system with extensive CSS variables
- Form handling with React Hook Form

Missing implementations noted in code:
- TanStack Query for server state management (not in dependencies)
- Zustand for client state management (not in dependencies)
- Zod validation schemas (not in dependencies)
- Actual API integration (currently mocked with setTimeout)
- Protected routes and proper authentication flow
- Error boundaries and loading states
- Settings page (`/settings` route missing)

## Mock Data & Current Features

### Implemented Features with Mock Data
- **Template Management**: Full CRUD with mock templates including "程式碼優化", "內容創作", "問題解決"
- **Prompt Optimization**: UI complete with template selection, model/temperature controls, mock optimization results
- **History Page**: List view with filtering, search, and mock optimization history
- **API Key Input**: Component for user API key management
- **FAQ Component**: Collapsible questions about the service

### Mock Data Patterns
- All API calls use `setTimeout()` to simulate network delays
- Mock authentication returns hardcoded success responses
- Template data includes realistic Chinese prompts and descriptions
- History data includes timestamp, model info, and optimization results
- Error handling simulated with random failures in some mock calls

## Build & Deployment

- Vite handles build process and development server with TanStack Start integration
- No specific deployment configuration detected
- CSS is processed through PostCSS with Tailwind CSS v4
- TypeScript compilation with modern ES targets (ES2022)
- React Compiler optimizations enabled for production builds

## Next Development Priorities

When working on this codebase, prioritize in this order:

### 1. State Management & API Integration (High Priority)
- Add TanStack Query for server state: `pnpm add @tanstack/react-query`
- Add Zustand for client state: `pnpm add zustand`
- Replace all mock API calls with real backend integration
- Implement proper error handling and loading states

### 2. Form Validation (High Priority)
- Add Zod validation: `pnpm add zod @hookform/resolvers`
- Create validation schemas for login, register, template forms
- Replace basic form validation with proper Zod schemas

### 3. Authentication Flow (Medium Priority)
- Implement protected routes wrapper
- Add proper authentication state management
- Handle token storage and refresh
- Redirect logic after login/logout

### 4. Missing Features (Medium Priority)
- Create `/settings` route and page
- Add error boundaries for better error handling
- Implement proper navigation between authenticated routes
- Add toast notifications for user feedback

### 5. Code Quality (Low Priority)
- Add proper TypeScript interfaces for all API responses
- Implement proper loading skeletons
- Add accessibility improvements
- Performance optimizations
