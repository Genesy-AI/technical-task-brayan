# Improvements & Roadmap

## Summary

The current codebase is functional and covers the core lead management flows: CSV import, email verification, phone enrichment, and message generation. However, as the product grows, several structural and UX improvements are needed to keep the codebase maintainable, testable, and scalable. This document outlines five areas of improvement with a proposed roadmap.

---

## Areas of Improvement

### 1. Backend Architecture — Router / Controller / Service / Repository

**Current state:** All route definitions, business logic, and database queries live in a single `index.ts` file (~340 lines). This makes it hard to test individual layers, onboard new contributors, or add features without risking regressions.

**Proposed change:** Split the backend into four layers:
- **Router** — declares HTTP routes and delegates to controllers
- **Controller** — handles request/response, calls services
- **Service** — contains business logic (e.g. dedup logic, workflow orchestration)
- **Repository** — all Prisma queries, isolated from business logic

**Impact:** Each layer becomes independently testable. Adding a new feature (e.g. a new enrichment type) follows a clear, predictable pattern.

---

### 2. Request Validation — Zod Schemas

**Current state:** Input validation is done manually with `if/typeof` checks scattered across route handlers. Edge cases (wrong types, missing nested fields) can slip through.

**Proposed change:** Define Zod schemas per endpoint and validate at the controller boundary before any business logic runs. Return structured 400 errors on validation failure.

**Impact:** Removes boilerplate validation code, catches malformed requests early, and provides a single source of truth for input shape that can be shared with generated API docs.

---

### 3. Testing — Unit & Integration Tests

**Current state:** The backend has a test file for `messageGenerator` but no coverage for endpoints, workflows, or the import pipeline. The frontend has no tests.

**Proposed change:**
- **Unit tests** — service and utility functions (message generator, country code validator, CSV parser)
- **Integration tests** — endpoint tests using a real SQLite test database, asserting full request/response cycles
- **Workflow tests** — Temporal's testing framework (`@temporalio/testing`) for `enrichPhoneWorkflow` and `verifyEmailWorkflow`

**Impact:** Prevents regressions during refactors, gives confidence when merging new features, and documents expected behavior.

---

### 4. Frontend Internationalization (i18n)

**Current state:** All UI strings are hardcoded in English directly in JSX.

**Proposed change:** Introduce a lightweight i18n library (e.g. `react-i18next`) with a single `en.json` locale file to start. All visible strings — labels, toasts, error messages, table headers — move to the locale file.

**Impact:** Enables adding new languages without touching component code. Even if only English is ever shipped, it enforces a discipline that keeps UI strings organized and easy to audit.

---

### 5. Message Generator UX — Inline Field Search & Recent Fields

**Current state:** Available template fields are shown as a flat list of buttons. Finding a specific field requires scanning the full list, and there is no way to know which fields are commonly used.

**Proposed change:**
- Add an inline search input above the field list to filter fields as the user types
- Show a "Most used" section at the top (tracked in `localStorage`) with the fields the user inserts most frequently, surfaced before the full list

**Impact:** Reduces friction for power users who work with many fields, and makes the template editor feel like a first-class tool rather than a utility panel.

---

## Roadmap

| Priority | Item | Effort |
|----------|------|--------|
| 1 | Zod validation on all endpoints | Small |
| 2 | Router / Controller / Service / Repository refactor | Medium |
| 3 | Unit + integration tests for backend | Medium |
| 4 | Message generator inline search & recent fields | Small |
| 5 | Frontend i18n setup + `en.json` extraction | Medium |

**Suggested order of execution:** Start with Zod (1) as it pairs naturally with the architecture refactor (2) — both can ship together as a single backend overhaul. Tests (3) follow immediately after to lock in the new structure. The frontend items (4, 5) can be done in parallel by a separate workstream.
