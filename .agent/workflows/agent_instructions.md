# Project Context & Agent Instructions

This repository is part of a **Fashion Store** platform with a headless architecture.

## Architecture
1. **ERPNext (Platform)**: Located at `../erpnext-platform/`. Handles all master data (Items, Customers, Inventory).
2. **Java Middleware (Backend)**: Located at `../ECommerceApplication/`. Processes business logic and acts as an adapter for ERPNext.
3. **Next.js Storefront (Frontend)**: Current directory. The customer-facing UI.

## Working with this project
- **Data Source**: Fetches data from the Java Middleware at `http://localhost:8080/api`.
- **Port Mapping**: DO NOT CHANGE
  - ERPNext: 8000
  - Java: 8080
  - Next.js: 3000
- **Git Strategy**: Follow `.agent/workflows/branching_strategy.md` (shared with backend). Use `develop` for daily work.
- **CI/CD**: GitHub Actions are configured in `.github/workflows/`.

## Critical Pillars (SOPs)

### 1. Visual Integrity & Premium Design
- **Fashion First**: This is a premium brand. Design MUST be elegant and high-end.
- **Aesthetics**: Use Inter/Outfit fonts, smooth micro-animations, and a cohesive color palette.
- **Consistency**: New components must maintain the store's visual language (glassmorphism indices, subtle gradients, etc.).

### 2. "Don't Break the Loop" Rule
- **Verified Integration**: Before committing UI changes, ensure they don't break the connection to the Java API.
- **Mock Fallbacks**: Use sensible mock data or placeholders ONLY if the backend is down during UI-only development.

### 3. API Contract & Type Safety
- **Interface Alignment**: Always ensure TypeScript interfaces (e.g., in `lib/java/index.ts` or types directory) perfectly match the JSON response from the Java backend.
- **Null Safety**: Always handle potentially missing data from the API (especially product images/descriptions) to prevent UI crashes.

### 4. Automated Quality Gates
- **Local Testing**: Agents MUST run `npm test` locally and ensure they pass before pushing.
- **CI/CD Alignment**: Every push triggers a GitHub Action. Code that fails builds or linting will NOT be merged to `main`.

## Change Tracking & Commits
- **Change Log**: For every push to Git, the agent MUST update `CHANGELOG.md` in the root directory.
- **Format**: Include the Date, Branch Name, and a clear bulleted list of changed files/logic.
- **Commit Messages**: Use descriptive conventional commit prefixes (e.g., `feat:`, `fix:`, `refactor:`).

## Important Files
- `CHANGELOG.md`: History of all changes pushed by agents.
- `lib/java/index.ts`: The primary adapter for the Java backend.
- `.env.example`: Template for environment variables.
- `.agent/workflows/agent_instructions.md`: This file.
