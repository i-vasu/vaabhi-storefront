# Vaabhi API Mapping Table

This document summarizes the mapping between the Frontend (Storefront) and the Backend (Modulith).

## Global Configuration
- **Base API URL**: `NEXT_PUBLIC_API_URL` (Proxy) -> `BACKEND_API_URL/api`
- **Versioning Strategy**: Custom Header `Accept: application/vnd.vaabhi.v1+json`
- **Authentication**: Bearer Token in `Authorization` header.

## API Endpoints Mapping

| Feature | Frontend Function | Backend Path (Relative to `/api`) | Backend Controller |
| :--- | :--- | :--- | :--- |
| **Products** | `getProducts` | `/public/products` (or `/public/products/keyword/{kw}`) | `ProductController` |
| **Product Detail** | `getProduct(id)` | `/public/products/{id}` | `ProductController` |
| **Trending** | `getTrendingProducts` | `/personalization/trending` | `PersonalizationController` |
| **Best Sellers** | `getBestSellers` | `/personalization/best-sellers` | `PersonalizationController` |
| **Tracking** | `trackProductView` | `/personalization/track-view/{id}` | `PersonalizationController` |
| **Cart - Get** | `getCart` | `/public/users/{email}/carts/{cartId}` | `CartController` |
| **Cart - Create** | `createCart` | `/public/carts` (POST) | `CartController` |
| **Cart - Add Item** | `addToCart` | `/public/carts/{cartId}/products/{productId}/quantity/{qty}` | `CartController` |
| **Cart - Update** | `updateCart` | `/public/carts/{cartId}/products/{productId}/quantity/{qty}` (PUT) | `CartController` |
| **Cart - Remove** | `removeFromCart` | `/public/carts/{cartId}/product/{productId}` (DELETE) | `CartController` |
| **Coupon - Appy** | `applyCoupon` | `/public/carts/{cartId}/coupon/{code}` | `CartController` |
| **Coupon - Remove**| `removeCoupon` | `/public/carts/{cartId}/coupon` (DELETE) | `CartController` |
| **Auth - Login** | `login` | `/v1/login` | `AuthController` |
| **Auth - Register** | `register` | `/v1/register` | `AuthController` |
| **Auth - Verify** | `verifyEmail` | `/v1/verify-email` | `AuthController` |
| **Auth - Forgot** | `forgotPassword` | `/v1/forgot-password` | `AuthController` |
| **Auth - Reset** | `resetPassword` | `/v1/reset-password` | `AuthController` |
| **Orders - List** | `getOrderHistory` | `/public/users/{email}/orders` | `OrderController` |
| **Orders - Detail**| `getOrderById` | `/public/users/{email}/orders/{id}` | `OrderController` |
| **Orders - Place** | `placeOrder` | `/public/users/{email}/carts/{cartId}/payments/{method}/order` | `OrderController` |
| **Wallet** | `getWalletDetails` | `/v1/user/account/wallet` | `UserAccountController` |
| **Rewards** | `getRewardPoints` | `/v1/user/account/reward-points` | `UserAccountController` |
| **Addresses - Get**| `getAddresses` | `/v1/addresses` | `AddressController` |
| **Addresses - Add**| `createAddress` | `/v1/address` | `AddressController` |
| **Support** | `getUserTickets` | `/v1/support/users/{email}` | `SupportController` |
| **Support - Create**| `createTicket` | `/v1/support/tickets` | `SupportController` |
| **AI Stylist** | `generateDesign` | `/search/custom-design/public/generate` | `CustomDesignController` |
| **Visual Search** | `visualSearchByImage` | `/search/visual` | `VisualSearchController` |
| **Wishlist - Get** | `getWishlist` | `/v1/wishlist` | `WishlistController` |
| **Wishlist - Add** | `addToWishlist` | `/v1/wishlist/{productId}` | `WishlistController` |
| **Wishlist - Remove**| `removeFromWishlist`| `/v1/wishlist/{productId}` | `WishlistController` |
| **Wishlist - Clear** | `clearWishlist` | `/v1/wishlist` (DELETE) | `WishlistController` |
| **User Profile - Me**| `getUserProfile` | `/public/users/me` | `UserController` |

## Data Structure Inconsistencies (Mapping Rules)

| Field | Frontend (Shopify Type) | Backend (DTO) | Mapping Rule |
| :--- | :--- | :--- | :--- |
| **Product ID** | `id` (string) | `productId` (Long) | `id = productId.toString()` |
| **Product Image**| `featuredImage.url` | `image` (string filename) | If not absolute, prepend `/public/products/image/` |
| **Quantity** | `totalQuantity` | `quantity` | Direct map |
| **Price** | `price` | `specialPrice` (if > 0) else `price` | Use `specialPrice` for display |
| **Address Building**| `building` | `buildingName` | Map `buildingName` -> `building` |

## Pending / Under Investigation
- **Inventory Webhooks**: Path `/v1/inventory/webhooks` exists in backend but not yet used by storefront.
