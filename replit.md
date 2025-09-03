# Overview

This is an AI-powered legal document generator application that helps users create compliant legal documents (privacy policies, terms of service, and cookie consent forms) through an interactive chat interface. The application uses Google's Gemini AI to generate customized legal documents based on user-provided business information, integrates with Stripe for payments, and allows users to download generated documents as PDFs.

# User Preferences

Preferred communication style: Simple, everyday language. Professional tone without "creepy" phrases like "I'd love to know" - use direct, business-appropriate language.
Design preferences: Modern dark theme with gradient black background (#0a0a0a to #1a1a1a), system font stack, lime green (#84cc16) for accents and highlights, glass morphism effects with blur and transparency, rounded corners (0.75rem), smooth transitions and hover effects.
Business model: Completely free legal documents supported by AdSense advertising revenue.
Ad placement requirements: Room for horizontal banner ads (top/bottom), 2 square ads, 2 vertical rectangle ads.
Payment model: All payment functionality removed - documents are 100% free to generate and download.
Branding emphasis: TysunMic as guarantee of free services.
Contact email: Tserver@internetclock.com for support and issues.
Navigation: "Free" tab in header with popup message about TysunMic's free commitment.
Accessibility: Full screen reader support, ARIA labels, keyboard navigation, semantic HTML, focus management.
AdSense Integration: Google AdSense script (ca-pub-8305971032153246) implemented in HTML head for monetization. ads.txt file created in client/public/ for AdSense verification and approval.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with support for document type parameters
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS variables for theming and a neutral color scheme
- **Component Structure**: Modular component architecture with reusable UI components
- **Accessibility**: WCAG 2.1 AA compliant with ARIA labels, semantic HTML, keyboard navigation, screen reader support, skip links, focus management, and reduced motion support

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Storage**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful API with structured error handling and request logging middleware
- **AI Integration**: Google Gemini AI for document generation with custom prompts

## Database Schema
- **Users**: Authentication and Stripe customer management
- **Documents**: Generated legal documents with metadata and status tracking
- **Chat Sessions**: Conversational AI sessions with business information collection
- **Payments**: Stripe payment tracking and status management
- **Database**: PostgreSQL with UUID primary keys and JSONB for flexible data storage

## Document Generation & Access
- **Free Access**: All legal documents are 100% free to generate and download
- **Session Management**: Chat session-based workflow for document generation
- **Ad-Supported Model**: Revenue generated through strategic AdSense placement
- **No Payment Required**: Complete removal of Stripe payment infrastructure
- **Ad Placement**: Strategic ad spaces throughout home and generator pages

## Development & Deployment
- **Build System**: Vite for frontend bundling with esbuild for server bundling
- **Development**: Hot module replacement and runtime error overlays
- **Type Safety**: Full TypeScript coverage with shared types between client and server
- **Path Resolution**: Absolute imports with @ prefix for client code and @shared for shared utilities

# External Dependencies

## AI Services
- **Google Gemini AI**: Document content generation using the Gemini 2.5 Pro model
- **API Key**: Requires GEMINI_API_KEY environment variable

## Payment Processing
- **Stripe**: Payment processing with React Stripe.js integration
- **Required Keys**: STRIPE_SECRET_KEY and VITE_STRIPE_PUBLIC_KEY
- **Features**: Payment intents, customer management, and subscription support

## Database
- **Neon Database**: Serverless PostgreSQL with connection pooling
- **Configuration**: Requires DATABASE_URL environment variable
- **Migrations**: Drizzle Kit for schema management and migrations

## UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form validation with Zod schema validation

## Development Tools
- **PDF Generation**: jsPDF for client-side document PDF creation
- **Date Utilities**: date-fns for date formatting and manipulation
- **Build Tools**: PostCSS with Autoprefixer for CSS processing
- **Development**: Replit-specific plugins for development environment integration