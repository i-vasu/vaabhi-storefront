# Fashion Storefront (Next.js)

This is the premium frontend for the fashion e-commerce platform, built with **Next.js 15**, **Tailwind CSS 4**, and **Framer Motion**. It fetches data from a custom **Java Middleware** which bridges to **ERPNext**.

## 🎨 Design Philosophy
- **Premium Experience**: Utilizing Inter/Outfit typography and generous whitespace.
- **Fluid Animations**: Powered by Framer Motion for high-end fashion interactions.
- **Performance**: Leveraging React Server Components for near-instant page loads.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- pnpm or npm
- **Java Backend** running at `http://localhost:8080`

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure your backend URL:
```bash
NEXT_PUBLIC_JAVA_BACKEND_URL=http://localhost:8080/api
```

### 3. Installation & Development
```bash
pnpm install
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## ✨ Premium Components
We've added a set of motion components in `components/premium-motion.tsx` to maintain visual consistency:
- **`<FadeIn>`**: Sophisticated entrance animation with custom bezier easing.
- **`<PremiumHover>`**: Subtle scale and lift effect for product cards.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React & Heroicons
- **Notifications**: Sonner

## 🔗 Architecture Link
This storefront is designed to work with the [Java Middleware](../ECommerceApplication). Ensure the middleware observability stack is active to monitor frontend-to-backend tracing via SkyWalking.
