# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` - Starts Vinxi development server
- **Build**: `pnpm build` - Creates production build using Vinxi
- **Start production**: `pnpm start` - Runs production server
- **Lint**: `pnpm lint` - Runs ESLint with @antfu/eslint-config
- **Lint fix**: `pnpm lint:fix` - Auto-fixes linting issues

## Tech Stack & Architecture

### Core Framework
- **TanStack Start**: Full-stack React framework with SSR/SSG capabilities
- **TanStack Router**: Type-safe file-based routing system
- **React 19**: Latest React with Concurrent Features
- **TypeScript**: Strict typing with path aliases (`@/*` -> `./app/*`)

### UI & Styling
- **Tailwind CSS v4**: Utility-first CSS with custom design tokens
- **shadcn/ui**: Component library built on Radix UI primitives
- **Lucide React**: Icon library
- **CSS Variables**: Extensive theming system with light/dark mode support

### Form & State Management
- **React Hook Form**: Form validation and state management
- **Built-in React State**: Using useState/useReducer patterns (no external state library detected)

### Development Tools
- **Vinxi**: Build tool and dev server
- **ESLint**: @antfu/eslint-config with React, TypeScript, and stylistic rules
- **PostCSS**: With Tailwind CSS processing

## Project Structure

```
app/
├── routes/                 # File-based routing (TanStack Router)
│   ├── __root.tsx         # Root layout with global styles
│   └── index.tsx          # Authentication page (login/register)
├── components/
│   └── ui/                # shadcn/ui components (Button, Card, Input, etc.)
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
├── styles/
│   └── app.css            # Global styles with CSS variables
└── client.tsx             # Client entry point
```

## Key Architecture Patterns

### Routing System
- Uses TanStack Router's file-based routing
- Route files export a `Route` created with `createFileRoute()`
- Root route (`__root.tsx`) handles global layout and head configuration
- Router configuration in `app/router.tsx` with scroll restoration

### Component Architecture
- shadcn/ui components provide consistent design system
- Components use Tailwind CSS for styling
- Path aliases configured: `@/*` maps to `./app/*`

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

### Authentication Flow
- Current implementation has mock authentication in index route
- Forms include loading states, error handling, and success messages
- Password visibility toggles and validation feedback

## Current Implementation Status

The project currently contains:
- Basic authentication UI (login/register forms)
- shadcn/ui component system setup
- TanStack Router with file-based routing
- Tailwind CSS theming system
- Form validation with React Hook Form

Missing implementations noted in code:
- Actual API integration (currently mocked)
- Navigation after successful auth
- Additional application routes beyond authentication

## Build & Deployment

- Vinxi handles build process and development server
- No specific deployment configuration detected
- CSS is processed through PostCSS with Tailwind
- TypeScript compilation with modern ES targets (ES2022)