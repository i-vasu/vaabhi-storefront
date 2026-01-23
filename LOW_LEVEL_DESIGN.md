# Low Level Design: Vaabhi Storefront

## 1. Introduction
This document details the low-level design for the **Vaabhi Storefront**, a Next.js 15 application serving as the premium frontend for the Vasu E-Commerce Platform. It connects to the Modulith Service (Java/Spring Boot) via a dedicated adaptation layer.

## 2. Architecture Overview
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **State Management**: React Server Components (RSC) for fetching, specialized Context for Cart/UI state.
- **Backend Communication**: REST API (via `lib/vasu`) adapting Backend DTOs to internal UI interfaces.

```mermaid
graph TD
    Client[Browser] -->|RSC/SSR| NextServer[Next.js Server]
    Client -->|Client Interactions| NextClient[Client Components]
    
    subgraph "Data Layer (lib/vasu)"
        NextServer -->|vasuFetch| Backend[Java Modulith Service]
        NextClient -->|Server Actions| Backend
    end
    
    Backend -->|read| ParadeDB[ParadeDB (Search)]
    Backend -->|read/write| DragonflyDB[DragonflyDB (Cart/Cache)]
```

## 3. Directory Structure
```
vaabhi-storefront/
├── app/                  # App Router
│   ├── [page]/           # Dynamic CMS pages
│   ├── product/          # Product details ([handle])
│   ├── search/           # Search & Category listing
│   └── layout.tsx        # Root layout (Navbar, Footer)
├── components/           # UI Components
│   ├── cart/             # Cart modal, actions, context
│   ├── grid/             # Product grid layout
│   ├── layout/           # Shared layout components
│   └── premium-motion/   # Framer Motion animations
└── lib/                  # Logic & Utilities
    ├── vasu/             # Backend Adapter (THE key integration point)
    │   ├── index.ts      # API Client & Mapper Functions
    │   └── types.ts      # (Implicit) UI Interfaces
    └── utils.ts          # General helpers
```

## 4. Data Layer Design (`lib/vasu`)
The storefront uses a **Adapter Pattern** to isolate the UI from Backend API changes. The backend returns DTOs (Data Transfer Objects) which are mapped to "Shopify-style" interfaces favored by the UI template.

### 4.1. Core Mappers
Located in `lib/vasu/index.ts`:
- `mapProductToShopify(dto: ProductDTO): Product`
- `mapCartToShopify(dto: CartDTO): Cart`

### 4.2. API Client (`vasuFetch`)
A typically shared fetch wrapper ensuring:
- Base URL injection (`NEXT_PUBLIC_API_URL`)
- Default Headers (`Content-Type: application/json`)
- Error Handling (Non-200 throws Error)

### 4.3. Key Entities
| Entity | Backend DTO Field | Frontend UI Field | Notes |
|--------|-------------------|-------------------|-------|
| **Product** | `productName` | `title` | Mapped for display |
| | `productId` | `id` | ID converted to string |
| | `price` | `priceRange.maxVariantPrice` | Formatted as money object |
| **Cart** | `cartId` | `id` | Cookie-persisted ID |
| | `products` | `lines` | Flattens backend list to lines |

## 5. State Management Strategy

### 5.1. Server State (Products, Collections)
- **Pattern**: React Server Components (RSC).
- **Caching**: Relies on Next.js `fetch` cache (configurable via `revalidate`).
- **Flow**: `Page` -> `await getProducts()` -> `ProductGrid` (Prop drilling).

### 5.2. Client State (Cart)
- **Pattern**: Optimistic UI with Server Actions.
- **Actions**: `addItem`, `updateItemQuantity`, `removeItem` (in `components/cart/actions.ts`).
- **Context**: `CartContext` matches local state with server state to provide instant feedback (e.g., opening cart drawer immediately).

## 6. Detailed User Flows

### 6.1. Product Discovery (PLP/PDP)
1. User visits `/search` or `/product/[handle]`.
2. **Next.js Server**: Calls `lib/vasu.getProducts` or `getProduct`.
3. **Adapter**: Calls Backend `/api/products`.
4. **Backend**: Queries ParadeDB (Search) or Postgres.
5. **Adapter**: Maps `ProductDTO[]` -> `Product[]`.
6. **UI**: Renders `Grid` of `ProductCard` components.

### 6.2. Add to Cart
1. User clicks "Add to Cart".
2. **Client**: Triggers `addItem` (Server Action).
3. **Server Action**:
   - Checks for `cartId` cookie.
   - If missing, calls `createCart` -> Sets cookie.
   - Calls `addToCart(cartId, variantId)`.
   - Revalidates tag `cart`.
4. **UI**: Optimistically updates Cart UI via `useFormStatus` or Context.

### 6.3. Checkout
1. User clicks "Proceed to Checkout" in Cart.
2. **Frontend**: Redirects to `checkoutUrl` (provided by `mapCartToShopify`).
   - *Current Implementation*: Placeholder `/checkout`.
   - *Future*: Backend should return a Stripe/Payment Gateway URL.

## 7. Error Handling & Edge Cases
- **API Failures**: `vasuFetch` throws standard Errors.
  - *Server Side*: `error.tsx` catches and shows "Something went wrong".
  - *Client Side*: `sonner` toasts for failed actions (e.g., "Failed to add item").
- **Missing Images**: Mappers provide placeholders (`https://placehold.co/...`) if DTO `image` is null.
- **Empty Search**: Returns empty array, UI shows "No results found".

## 8. Development & Extension Guide
- **Adding a Field**: 
  1. Update `ProductDTO` interface in `lib/vasu/index.ts`.
  2. Update `mapProductToShopify` to include the field.
  3. Consume field in React Component.
- **Changing Backend URL**: Update `.env.local` -> `NEXT_PUBLIC_API_URL`.

## 9. Security
- **Cookies**: `cartId` stored as HTTP-only (preferred, though currently client-accessible for ID).
- **Environment**: API URL exposed to client; Secrets (API Keys) must NOT be exposed if moving to server-to-server auth.
