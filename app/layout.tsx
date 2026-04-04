import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import MainLayoutWrapper from "./components/MainLayoutWrapper";
import AuthGuard from "./components/AuthGuard";
import { ToastProvider } from "./components/ToastContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "MedAI - Clinical Intelligence Portal",
  description: "Next-generation healthcare analytics and report management sanctuary",
};

import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} light`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="font-body bg-surface text-on-surface flex min-h-screen antialiased selection:bg-blue-500/30">
        <ToastProvider>
          <AuthGuard>
            <MainLayoutWrapper>
              {children}
            </MainLayoutWrapper>
          </AuthGuard>
        </ToastProvider>
        {/* Vercel Analytics integration */}
        <Analytics />
      </body>
    </html>
  );
}
