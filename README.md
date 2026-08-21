# Corporacity

> A modern, real-time team status management platform built for organizations requiring strict access control, CEO approval workflows, and instant updates.

## Overview
**Corporacity** is a full-stack MVP designed to streamline internal team tracking. It replaces messy check-ins with real-time status visibility (Present, Late, On Leave, etc.) paired with enterprise-grade security rules and executive approval gates.

## Tech Stack
* **Frontend:** Next.js (Pages router / React)
* **Styling:** Tailwind CSS
* **Backend & Database:** Supabase (PostgreSQL, Realtime, and Auth)
* **Authentication:** Google OAuth via Supabase Auth
* **Testing:** Jest & React Testing Library

## Core Architecture & Features
* **Real-Time Presence Tracking:** Live status management across active team members using Supabase real-time channels.
* **Executive Approval Loops:** Structured workflows allowing company creation via unique access codes and mandatory CEO sign-off for member join requests.
* **Hardened Security:** Built with strict PostgreSQL Row Level Security (RLS) policies, input sanitization, API rate limiting, and structured error boundaries.
* **Tested Reliability:** Comprehensive unit and integration test suites using Jest.

## Project Structure
```text
corporacity-mvp/
├── components/         # Reusable UI primitives and ErrorBoundary
├── lib/                # Core modules (Supabase client, API security, validation, analytics)
├── pages/              # Next.js routes and API endpoints (including /api/approve and health checks)
├── supabase/           # SQL schemas and RLS security policies
├── __tests__/          # Jest test suites
└── public/             # Static assets
