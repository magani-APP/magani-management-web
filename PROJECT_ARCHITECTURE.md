# Project Architecture

## Architecture Principles

Magali follows a modular, feature-driven architecture built on the Next.js App Router.

Each directory has a single responsibility. Respect the existing structure and never move files or create new architectural patterns unless explicitly requested.

---

## Directory Responsibilities

### `src/app`

Responsible **only** for routing, layouts, route groups, pages, API routes, and route protection.

Do not place business logic or reusable UI components here.

---

### `src/features`

Contains all business-related modules.

Each feature owns its:

- components
- hooks
- actions
- types
- utilities (when needed)

Business logic must remain inside its feature.

---

### `src/components`

Contains reusable UI shared across the application.

- `ui/` → generic Design System components
- `layout/` → application shell (Sidebar, Topbar, Mobile Navigation, etc.)
- `shared/` → reusable business-agnostic components

Never place feature-specific components here.

---

### `src/lib`

Global services and integrations.

Examples:

- database client
- authentication
- payment providers
- PDF generation
- external SDKs

This folder should never contain UI.

---

### `src/constants`

Static application constants.

Examples:

- navigation
- roles
- currencies
- labels

Never store business data here.

---

### `src/types`

Global TypeScript definitions shared across multiple features.

Feature-specific types belong inside their respective feature.

---

## Development Rules

- Respect the current folder structure.
- Never duplicate an existing responsibility.
- Create files only inside the appropriate module.
- Prefer extending an existing feature over creating a new one.
- If the correct location is unclear, stop and ask instead of making assumptions.

The architecture is intentionally strict to keep the codebase scalable, predictable, and easy to maintain.