# Overview

Milos'Shop is a modern car wash booking application designed for Paraguay. The application provides a comprehensive solution for managing car wash services with a clean, mobile-first design inspired by modern service apps like Uber and Rappi. The system features dual interfaces for customers and administrators, supporting both Spanish and Portuguese languages.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for fast development and building
- **UI Library**: Radix UI components with shadcn/ui component system for consistent, accessible interfaces
- **Styling**: Tailwind CSS with custom theme implementing the brand color scheme (black background, white cards, red accent #E10600)
- **Routing**: Wouter for lightweight client-side routing with three main routes: home (`/`), client portal (`/cliente`), and admin panel (`/admin`)
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Design System**: Mobile-first responsive design with Inter/Montserrat typography, consistent spacing units, and comprehensive component library

## Backend Architecture
- **Server**: Express.js with TypeScript running on Node.js
- **API**: RESTful API structure with `/api` prefix for all endpoints
- **Session Management**: Express sessions with PostgreSQL session store using connect-pg-simple
- **Build System**: esbuild for production bundling with ES modules format

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL for cloud hosting
- **Current Schema**: Basic user management with plans for booking, service, and payment entities

## Authentication and Authorization
- **Architecture**: Session-based authentication (current implementation shows basic user schema)
- **User Roles**: Planned support for 'client' and 'admin' roles based on design specifications
- **Security**: Express session middleware with PostgreSQL persistence

## External Dependencies

### Core Infrastructure
- **Database**: Neon Database (@neondatabase/serverless) for PostgreSQL hosting
- **ORM**: Drizzle ORM for database operations with Zod integration for validation

### UI and Design
- **Component Library**: Complete Radix UI ecosystem for accessible, unstyled components
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and formatting
- **Carousels**: Embla Carousel for image galleries and content sliders

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Development**: tsx for TypeScript execution and hot reloading
- **Linting**: PostCSS with Tailwind CSS and Autoprefixer
- **Replit Integration**: Custom plugins for development environment integration

### Planned Integrations (based on specifications)
- **Payment Processing**: Card, PIX, and cash payment methods
- **Push Notifications**: Firebase Cloud Messaging (FCM) for real-time updates
- **File Storage**: Image handling for service galleries
- **Analytics**: Google Analytics for business insights

## Service Management
The application is designed to handle multiple car wash services with dynamic pricing based on vehicle type (auto, SUV, camioneta). Services include basic wash, premium treatments, and specialized detailing with estimated duration tracking.

## Internationalization
Built-in support for Spanish and Portuguese languages with a comprehensive translation system and locale-aware formatting for currency (Paraguayan Guaraní) and dates.