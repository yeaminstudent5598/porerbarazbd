// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { cn } from "./lib/utils";
// TODO: Import Providers (Auth, Cart, Theme, QueryClient etc.)

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: "Porer Bazar BD - Grameen & Organic Products",
  description: "Authentic rural and organic products from Bangladesh, delivered to your doorstep.",
  // Add favicon link here if not in public folder root
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased", // font-sans maps to your tailwind config
          poppins.variable,
          hindSiliguri.variable
        )}
      >
        {/*
        TODO: Wrap children with Providers
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <CartProvider>
        */}
                {children}
        {/*
              </CartProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
        */}
      </body>
    </html>
  );
}