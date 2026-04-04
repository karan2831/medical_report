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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-manrope antialiased selection:bg-blue-500/30 text-slate-900 bg-[#f8f9ff]">
        <ToastProvider>
          <AuthGuard>
            <MainLayoutWrapper>
              {children}
            </MainLayoutWrapper>
          </AuthGuard>
        </ToastProvider>
      </body>
    </html>
  );
}
