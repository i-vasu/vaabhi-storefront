import { AuthProvider } from 'components/auth-context';
import { CartProvider } from 'components/cart/cart-context';
import ErrorBoundary from 'components/error-boundary';
import { Navbar } from 'components/layout/navbar';
import PageTransition from 'components/page-transition';
import CommandBar from 'components/search/command-bar';
import ThemeInitializer from 'components/theme-initializer';
import { WelcomeToast } from 'components/welcome-toast';
import { WishlistProvider } from 'components/wishlist-context';
import { GeistSans } from 'geist/font/sans';
import { getCart, getTenantConfig } from 'lib/backend';
import { validateEnv } from 'lib/env-check';
import { baseUrl } from 'lib/utils';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const { SITE_NAME } = process.env;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME || 'Vaabhi | Premium Fashion Storefront',
    template: `%s | ${SITE_NAME || 'Vaabhi'}`
  },
  description: 'Experience the future of fashion with Vaabhi. AI-driven styling, visual search, and premium collections.',
  keywords: ['fashion', 'ecommerce', 'AI styling', 'premium clothing', 'vaabhi'],
  robots: {
    follow: true,
    index: true
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME || 'Vaabhi',
    title: SITE_NAME || 'Vaabhi | Premium Fashion Storefront',
    description: 'Experience the future of fashion with Vaabhi.',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: SITE_NAME || 'Vaabhi'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME || 'Vaabhi',
    description: 'Experience the future of fashion with Vaabhi.',
    images: [`${baseUrl}/opengraph-image`]
  }
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  validateEnv();
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();
  const tenant = await getTenantConfig();

  return (
    <html lang="en" className={GeistSans.variable}>
      <ThemeInitializer accentColor={tenant.accentColor} />
      <body className="bg-neutral-50 text-black selection:bg-[var(--accent-color,teal)] dark:bg-neutral-900 dark:text-white dark:selection:bg-[var(--accent-color,pink)] dark:selection:text-white">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider cartPromise={cart}>
              <Navbar />
              <CommandBar />
              <main>
                <ErrorBoundary>
                  <PageTransition>
                    {children}
                  </PageTransition>
                </ErrorBoundary>
              </main>
              <Toaster closeButton position="top-center" />
              <WelcomeToast />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
