# Overview

This is a modern full-stack web application built with React, TypeScript, Express.js, and PostgreSQL. The application features a comprehensive admin dashboard system for managing educational content including scholarships, job opportunities, partner institutions, blog posts, and team members. It includes real-time WebSocket notifications, AI-powered content moderation, file upload capabilities, and role-based access control.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Component-based UI using functional components and hooks
- **Vite**: Modern build tool and development server for fast hot module replacement
- **Wouter**: Lightweight client-side routing library
- **TanStack Query**: Server state management and caching for API calls
- **Shadcn/ui**: Pre-built component library based on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Hook Form + Zod**: Form handling with schema validation

## Backend Architecture
- **Express.js**: RESTful API server with middleware-based request handling
- **TypeScript**: Type-safe server-side development
- **Drizzle ORM**: Type-safe database queries and schema management
- **WebSocket Server**: Real-time bidirectional communication for admin notifications
- **Session-based Authentication**: JWT tokens with role-based access control
- **Middleware Pattern**: Modular request processing for auth, file uploads, and error handling

## Data Storage
- **PostgreSQL**: Primary relational database using Neon serverless
- **Drizzle Schema**: Type-safe database schema definitions with relations
- **Connection Pooling**: Efficient database connection management
- **Database Migrations**: Version-controlled schema changes

## Authentication & Authorization
- **JWT-based Authentication**: Stateless token authentication
- **Role-based Access Control**: User roles (user, moderator, admin, super_admin)
- **Protected Routes**: Middleware guards for API endpoints
- **Session Management**: Secure token handling and validation

## File Management
- **Multer**: Multipart form data handling for file uploads
- **Sharp**: Image processing and optimization
- **Local File Storage**: Server-side file storage with organized directory structure
- **File Type Validation**: Security measures for uploaded content

## Real-time Features
- **WebSocket Integration**: Live notifications and updates
- **Admin Dashboard Updates**: Real-time content management notifications
- **Connection Management**: Automatic reconnection and error handling

# External Dependencies

## Core Technologies
- **Neon Database**: Serverless PostgreSQL hosting and connection pooling
- **OpenAI API**: AI-powered content moderation and text generation
- **TinyMCE**: Rich text editor for content creation (loaded via CDN)

## UI Component Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Comprehensive icon library
- **Embla Carousel**: Touch-friendly carousel component

## Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **TypeScript Compiler**: Type checking and compilation

## Third-party Services
- **Chart.js**: Data visualization and analytics charts (dynamically imported)
- **React Day Picker**: Calendar and date selection components
- **React Dropzone**: Drag-and-drop file upload interface

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class composition
- **nanoid**: Unique identifier generation
- **connect-pg-simple**: PostgreSQL session store for Express