# ConceptFlow

## Overview

ConceptFlow is a React-based visual thinking and project management application. It enables users to create and manage various types of visual projects including mind maps, canvas boards, kanban boards, flowcharts, and whiteboards. The application features user authentication, project management capabilities, and uses a modern React stack with TypeScript.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **React 19** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR
- **React Router v7** for client-side routing with protected routes

### UI Layer
- **Mantine v8** as the primary component library for consistent styling
- **@xyflow/react** for node-based visual editors (flowcharts, mind maps)
- Custom glassmorphism styling with gradient backgrounds throughout the app

### State Management
- **Zustand** for global state management (authentication state in `authStore.ts`)
- Local component state with React hooks for UI-specific state

### Routing Structure
- Public routes: Home (`/`), Login (`/login`), Register (`/register`)
- Protected routes under `/app/*` requiring authentication:
  - Projects list (`/app/projects`)
  - Create project (`/app/createproject`)
  - Individual project view (`/app/projects/:id`)

### Authentication Flow
- Cookie-based authentication with HttpOnly tokens
- `ProtectedRoute` component wraps authenticated routes and redirects to login if unauthenticated
- Auth state persisted in Zustand store with `isAuthenticated` flag

### API Mocking
- **MSW (Mock Service Worker)** for API mocking during development
- Handlers organized by domain: `authHandlers.ts`, `projectHandlers.ts`
- In-memory database simulation in `projectsDb.ts` for project CRUD operations
- Mock endpoints: `/api/login`, `/api/logout`, `/api/projects`, `/api/projects/recent`

### Project Data Model
Projects support multiple types with these fields:
- **projectType**: mindmap, canvas, kanban, flowchart, whiteboard
- **storageType**: local or cloud
- **visibility**: private or public
- **color**: optional hex color code
- **Metadata**: timestamps (createdAt, updatedAt, lastOpenedAt), pinning, descriptions

### Create Project Page
Located at `/app/createproject`, features:
- Project name (required)
- Description (optional)
- Project type selector (dropdown)
- Storage type toggle (local/cloud)
- Visibility toggle (private/public)
- Color picker with swatches
- Responsive design for mobile

## External Dependencies

### Core Libraries
- `react` / `react-dom` (v19) - UI framework
- `react-router` (v7) - Routing
- `zustand` (v5) - State management
- `@mantine/core` / `@mantine/hooks` (v8) - UI components
- `@xyflow/react` (v12) - Node-based visual editor

### Development Tools
- `msw` (v2) - API mocking for development (service worker in `public/mockServiceWorker.js`)
- `typescript` (v5.9) - Type checking
- `vite` (v7) - Build tool and dev server
- `eslint` with React-specific plugins - Code linting

### Icons
- `@tabler/icons-react` - Primary icon set
- `react-icons` - Additional icons

### Notes
- No backend server currently implemented; all API calls are intercepted by MSW
- Environment variable `VITE_API_URL` can override API base URL
- Development server configured for `0.0.0.0:5000` to work in Replit environment