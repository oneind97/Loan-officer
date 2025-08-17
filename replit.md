# Overview

This is a complete full-stack mortgage lending application built for Eddie Hernandez Mortgage. The application features a beautiful React frontend with a professional dark-themed mortgage landing page that captures leads, and a robust Express backend with PostgreSQL database for comprehensive lead management. It includes an advanced admin dashboard for managing mortgage applications, client communications, lead notes, and status tracking, with email notifications for new leads and confirmations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for the main application
- **Vite** as the build tool and development server
- **Tailwind CSS** with **shadcn/ui** components for styling using the "new-york" style
- **TanStack Query** for server state management and API communication
- **Wouter** for client-side routing
- **Framer Motion** for animations on the landing page
- Component structure follows modern React patterns with hooks and functional components

## Backend Architecture
- **Express.js** server with TypeScript
- **Session-based authentication** using Replit's OpenID Connect integration
- **RESTful API** design with organized route handlers
- **Middleware** for request logging, JSON parsing, and authentication
- **Email service** using Nodemailer for lead notifications and confirmations
- Database operations abstracted through a storage layer pattern

## Database Design
- **PostgreSQL** database with Neon as the provider
- **Drizzle ORM** for type-safe database operations and migrations
- Schema includes:
  - Users table for admin authentication
  - Leads table for mortgage applications with status tracking
  - Contact forms table for general inquiries  
  - Lead notes table for admin comments
  - Sessions table for authentication state

## Authentication & Authorization
- **Replit Auth** integration using OpenID Connect
- Session management with PostgreSQL storage using connect-pg-simple
- Protected admin routes requiring authentication
- Public lead submission endpoints for the mortgage form

## API Structure
- `/api/auth/*` - Authentication endpoints (login, user info)
- `/api/leads` - Lead management (create, read, update, delete)
- `/api/admin/leads/*` - Admin-only lead operations and statistics
- `/api/contact` - Contact form submissions
- Error handling with proper HTTP status codes and JSON responses

# External Dependencies

## Database & ORM
- **@neondatabase/serverless** - Neon PostgreSQL serverless driver
- **drizzle-orm** - Type-safe ORM with PostgreSQL adapter
- **connect-pg-simple** - PostgreSQL session store

## Authentication
- **openid-client** - OpenID Connect client for Replit auth
- **passport** - Authentication middleware

## Email Service
- **nodemailer** - Email sending capabilities for lead notifications

## UI Framework
- **@radix-ui** - Headless UI components (30+ components)
- **tailwindcss** - Utility-first CSS framework
- **class-variance-authority** - Utility for managing component variants

## Development Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Type safety across frontend and backend
- **tsx** - TypeScript execution for Node.js development
- **esbuild** - Fast JavaScript bundler for production builds