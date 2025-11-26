import type { Metadata } from "next";
import { Poppins, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { cn } from "./lib/utils";
import Providers from "./components/Providers";
import { AuthProvider } from "./lib/context/AuthContext";
// 1. ToastProvider বাদ দিয়ে Toaster ইম্পোর্ট করুন (Shadcn Sonner থেকে)
import { Toaster } from "@/components/ui/sonner"; 

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
  title: "Shotej Foods - Grameen & Organic Products",
  description: "Authentic rural and organic products from Bangladesh, delivered to your doorstep.",
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
          "min-h-screen bg-background font-sans antialiased",
          poppins.variable,
          hindSiliguri.variable
        )}
      >
        <AuthProvider>
          <Providers>
            {children}
            {/* 2. এখানে Toaster কম্পোনেন্টটি যুক্ত করুন */}
            <Toaster position="top-right" richColors />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}