# Magali Mock Data Strategy

## 1. Purpose

The backend and database are not yet available. Until they are implemented, Magali must use mock data without creating a fake architecture.

Mock data must simulate the behavior of a real backend as closely as reasonably possible.

The frontend must **never depend directly on mock data files**.

---

## 2. API-First Data Flow

All application data must follow this flow:

```text
UI Component
    ↓
Hook / Feature Logic
    ↓
API / Service Layer
    ↓
Mock API
    ↓
Mock Data
```

Components must never import mock data directly.

### Forbidden

```ts
import { products } from "@/mocks/products";
```

inside a component, page, or UI component.

### Required

```ts
const { data } = useProducts();
```

The hook communicates with the API/service layer, which currently returns mock data.

---

## 3. Mock Data Location

Mock data must remain isolated from application logic.

Use a dedicated mock structure when needed:

```text
src/
├── mocks/
│   ├── auth/
│   ├── pos/
│   ├── inventory/
│   ├── analytics/
│   ├── audit-log/
│   ├── reservations/
│   └── settings/
```

Mock files must contain **data only**.

They must not contain UI logic, business logic, React components, or database logic.

---

## 4. API Simulation

Mock APIs must expose functions that resemble future real API operations.

Example:

```ts
getProducts()
getProductById(id)
createProduct(data)
updateProduct(id, data)
deleteProduct(id)
```

The implementation may currently return local mock data, but the interface must represent the future backend contract.

When Prisma/backend integration becomes available, the implementation of the service can be replaced without requiring UI components to be rewritten.

---

## 5. No Direct Database Assumptions

The frontend must not assume that mock data represents the final database implementation.

Mock data exists only to reproduce realistic application states and API responses during frontend development.

## 6. Realistic Data

Mock data must look and behave like real production data.

Avoid:

* `Product 1`
* `User A`
* `Test Product`
* unrealistic prices
* incomplete objects
* arbitrary placeholder values

Use realistic pharmacy data, including:

* product names
* SKU / references
* categories
* prices
* stock quantities
* expiration dates
* suppliers
* customer information
* timestamps
* statuses
* user roles

Mock datasets must be sufficiently varied to represent normal, empty, loading, warning, critical, and error states.

---

## 7. Shared Data Models

Mock data must respect the TypeScript types defined by the corresponding feature.

Do not create a mock object with a structure different from the application's expected type.

When a type changes, its related mock data must be updated accordingly.

Where the same entity is used by multiple features, avoid creating inconsistent copies of that entity.

For example, the same product should not have different prices or stock quantities depending on which screen displays it.

---

## 8. Simulate API States

The mock API layer should be capable of reproducing realistic API states when required:

* successful response
* empty response
* loading state
* validation error
* not found
* unauthorized / forbidden
* server error

Do not hardcode these states directly into UI components.

The UI must react to the state returned by the data layer, exactly as it would with a real backend.

---

## 9. Replaceability

Mock implementations must be designed to be replaced by real backend implementations with minimal changes.

The following layers must remain independent:

```text
Mock Data
   ↓
Mock API / Service
   ↓
Hooks
   ↓
Features
   ↓
UI
```

Replacing the mock API with Prisma/API calls must not require rewriting presentation components.

---

## 10. Scope Control

Only create mock data required by the current development task.

Do not populate the entire Magali database before the corresponding features are being developed.

If the current task is the Sidebar and Topbar, only create the minimal mock data required for elements such as:

* current user
* pharmacy information
* navigation permissions
* date/time information

Do not create mock products, sales, reports, reservations, or inventory data unless the task requires them.

