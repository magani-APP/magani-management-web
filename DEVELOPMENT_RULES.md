# MAGALI Development Rules

## Purpose

This document defines the mandatory development rules for MAGALI. Every implementation must follow these rules without exception. When a rule conflicts with an assumption, the rule always takes priority.

---

## General Principles

- Build only what is explicitly requested.
- Never anticipate future features or screens.
- Never invent behaviors, layouts, or business logic.
- Follow the existing project structure exactly.
- Reuse existing components before creating new ones.
- Keep components focused, reusable, and easy to maintain.
- Respect the Design System at all times.

---

## Pixel Perfect Policy

Magali is developed with a **Pixel Perfect** approach.

The implementation must match the design as closely as possible. Approximations are not acceptable.

Respect every visual detail, including:

- spacing
- sizing
- alignment
- typography
- colors
- border radius
- shadows
- borders
- opacity
- icons
- component hierarchy
- positioning
- interactions

Do not "improve", reinterpret, or redesign the UI. If something is unclear, ask instead of guessing.

---

## Incremental Development

Only implement the scope of the current task.

Example:

If the task is to build the Sidebar and Topbar, do **not** implement dashboard widgets, charts, tables, navigation pages, or future features.

Every task must remain isolated and independently reviewable.

# Magali Development Rules

## 4. Project Architecture

The existing project structure is authoritative. Do not reorganize it without an explicit architectural decision.

* `app/` — routing, layouts, pages, and API routes only.
* `features/` — feature-specific business logic, actions, hooks, types, and components.
* `components/ui/` — generic reusable UI primitives only.
* `components/layout/` — global application layout components.
* `components/shared/` — reusable cross-feature components.
* `lib/` — integrations, infrastructure, and shared services.
* `types/` — global TypeScript types.
* `constants/` — shared application constants.
* `prisma/` — database schema and seed logic.

Never place feature-specific logic inside generic UI components.

Never create a new architectural pattern when an existing project pattern already covers the requirement.

---

## 5. Mock Data & API Strategy

The backend/database may not be available during frontend development.

Mock data must therefore behave **as if it came from the real backend**.

Never access mock data directly from pages or UI components.

Use this flow:

```text
UI Component
    ↓
Hook / Feature Logic
    ↓
API / Service Layer
    ↓
Mock API Implementation
    ↓
Mock Data
```

Mock data must live separately from application logic.

Example:

```text
src/
├── features/
│   └── inventory/
│       ├── hooks/
│       └── types/
│
├── api/
│   └── inventory.api.ts
│
└── mocks/
    └── inventory.mock.ts
```

The API layer must expose functions that resemble real backend operations:

```ts
getProducts()
getProductById(id)
createProduct(data)
updateProduct(id, data)
```

During mock development, these functions return mock data.

When the real backend becomes available, replace the implementation behind the API/service layer without rewriting the UI.

Never hardcode realistic application data directly inside JSX/TSX components.

---

## 6. Existing Structure Is Not Permission to Implement

The presence of a folder, route, component name, Prisma model, or planned feature does **not** mean that feature should be implemented.

Only implement what the current task explicitly requests.

Do not infer functionality from:

* route names
* folder names
* comments
* future components
* database models
* navigation items
* planned features

If the task concerns the Sidebar and Topbar, do not implement Dashboard, POS, Inventory, Reports, Reservations, or Settings content.

Stop at the defined scope.

7. Code Quality
Use TypeScript in strict mode.
Never use any unless explicitly approved.
Never use @ts-ignore to bypass type errors.
Keep components small and focused on a single responsibility.
Prefer composition over duplication.
Extract reusable logic into hooks or utility functions.
Do not place business logic inside presentational components.
Keep imports organized and remove unused code before considering a task complete.
Write self-explanatory code. Avoid unnecessary comments.
8. Task Completion Checklist

A task is complete only if all the following conditions are satisfied.

UI
The implementation is Pixel Perfect.
The Design System has been fully respected.
No visual approximations have been introduced.
Responsive behavior matches the requested scope.
Architecture
Files are placed in the correct directories.
No unnecessary files or folders were created.
Existing architecture has been respected.
Code
No TypeScript errors.
No ESLint warnings.
No dead code.
No duplicated logic.
Components are reusable whenever applicable.
Scope

Before finishing a task, verify:

Nothing outside the requested scope has been implemented.
No assumptions were made about future features.
No placeholder functionality was added without request.
Every new file has a clear purpose.
9. When in Doubt

Never guess.

If a design detail, behavior, interaction, or business rule is ambiguous:

ask for clarification;
do not invent a solution;
do not make design decisions on behalf of the project.

Accuracy is always preferred over speed.

Core Principle

Every contribution to Magali must satisfy these four requirements:

Pixel Perfect implementation.
Respect the existing architecture.
Build only the requested scope.
Write production-ready code, even when using mock data.

## 10. Task Execution Rules

Before writing code:

- Understand the complete task.
- Review the existing implementation if one already exists.
- Identify reusable components before creating new ones.

While implementing:

- Follow the project architecture.
- Respect the Design System.
- Build incrementally.
- Keep the solution as simple as possible.
- Do not modify unrelated files.
- Do not refactor code unless explicitly requested.

After implementing:

- Verify visual consistency.
- Verify component reusability.
- Verify TypeScript correctness.
- Verify imports and file organization.
- Ensure no unintended changes were introduced.

---

## 11. Design System Compliance

The Design System is the single source of truth for every UI decision.

Never introduce:

- new colors;
- new spacing values;
- new typography scales;
- new border radius values;
- new shadows;
- new animations;
- new component styles.

If a required style is missing from the Design System, stop and request clarification instead of creating a new design pattern.

---

## 12. Final Rule

Do exactly what is requested.

No more.

No less.