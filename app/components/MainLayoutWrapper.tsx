"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../Sidebar";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-[#f8f9ff] pl-72">
        <div className="max-w-7xl mx-auto p-12 animate-fade-in shadow-inner shadow-blue-900/10">
          {children}
        </div>
      </main>
    </div>
  );
}
