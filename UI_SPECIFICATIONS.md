# Magali — UI Specifications

## 1. Purpose

This document defines the concrete UI structure and visual implementation requirements for Magali.

It complements `design_system.md`:

* `design_system.md` defines **how the interface looks**.
* `ui_specifications.md` defines **what interface elements must exist, where they are located, and how they are structured**.

The Design System remains the authoritative source for colors, typography, spacing, components, radii, shadows, icons, and visual states.

---

## 2. Implementation Scope

UI development must be incremental.

Only implement the screens, sections, and components explicitly specified for the current task.

Do not implement future application pages simply because their routes or folders already exist.

For example, the initial application shell may contain:

* Floating Sidebar
* Topbar
* Global Search
* Calendar / period selector
* Notifications control
* "New Sale" action

The following must **not** be implemented until explicitly requested:

* Dashboard content
* POS interface
* Inventory interface
* Reports
* Activity Log
* Reservations
* Settings screens

Empty routes or existing directories do not constitute UI requirements.

---

## 3. Global Application Shell

The application uses a desktop-oriented shell composed of two main areas:

```text
Application
├── Floating Sidebar
└── Main Column
    ├── Topbar
    └── Page Content
```

### 3.1 Global Layout

* Root: `flex`, `h-screen`, `overflow-hidden`
* Background: `#F5F7F5`
* Sidebar: fixed floating panel
* Main column: positioned beside the Sidebar
* Main column uses `flex-col` and occupies the remaining viewport height

The Design System specifies a `228px` Sidebar positioned `8px` from the left, top, and bottom, with the main content beginning approximately `240px` from the left.

---

## 4. Sidebar

The Sidebar is a persistent floating navigation panel.

### Structure

```text
Sidebar
├── Brand
├── Main Navigation
│   ├── Principal
│   └── Gestion
├── Admin Navigation
├── Spacer
├── Help / Documentation
└── User Profile
```

The Sidebar must follow the exact visual proportions and spacing shown in the reference design.

Required characteristics:

* Width: `228px`
* Position: `fixed`
* Offset: `8px` from viewport edges
* Radius: `16px`
* Glassmorphism treatment
* White translucent surface
* Correct navigation hierarchy
* Active navigation state
* Hover state
* Section labels
* Bottom user area

The exact visual treatment must follow the Design System's Sidebar specification.

---

## 5. Topbar

The Topbar is positioned at the top of the main application column.

Initial structure:

```text
Topbar
├── Global Search
├── Period / Calendar Selector
├── Notifications
└── New Sale Button
```

The Topbar must remain visually lightweight and must use the glassmorphism treatment defined by the Design System. Its approximate height is `57px`.

No additional controls should be introduced without explicit specification.
