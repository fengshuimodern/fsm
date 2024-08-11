import type { Metadata } from "next";
import { Inter, Playfair_Display, DM_Sans, Space_Mono } from "next/font/google";
import { cn } from '@/lib/utils'
import "./globals.css";

const fontHeading = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '700']
})

export const metadata: Metadata = {
  title: "FengShuiModern",
  description: "Optimize your space with AI-powered Feng Shui analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}