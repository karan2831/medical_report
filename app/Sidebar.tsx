"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/auth";

const navItems = [
  { name: "Dashboard", href: "/", icon: "dashboard" },
  { name: "Upload", href: "/upload", icon: "cloud_upload" },
  { name: "Lab Analyzer", href: "/lab", icon: "science" },
  { name: "Nearby Care", href: "/hospitals", icon: "location_on" },
  { name: "Compare", href: "/compare", icon: "compare_arrows" },
  { name: "Settings", href: "/settings", icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="mb-8 px-2 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-blue-700 tracking-tight">Clinical Portal</h1>
          <p className="text-xs text-on-surface-variant font-medium">Digital Sanctuary</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-on-surface-variant hover:text-blue-700">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          
          if (isActive) {
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-white text-blue-700 rounded-2xl shadow-sm font-semibold transition-colors duration-200"
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label">{item.name}</span>
              </Link>
            )
          }

          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors duration-200"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <button className="mt-4 mb-8 bg-gradient-to-br from-primary to-primary-container text-white py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
        <span className="material-symbols-outlined text-sm">add</span>
        New Analysis
      </button>

      <div className="pt-6 border-t border-slate-200 flex flex-col gap-y-2">
        <a className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-blue-700 transition-colors" href="#">
          <span className="material-symbols-outlined text-[20px]">contact_support</span>
          <span className="text-xs font-medium">Support</span>
        </a>
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-blue-700 transition-colors w-full text-left"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-xs font-medium">Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[60] bg-white p-2 rounded-xl text-blue-700 shadow-sm border border-slate-100"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <aside className="hidden md:flex flex-col p-6 gap-y-4 h-screen w-64 bg-surface-container border-r-0 fixed left-0 top-0 z-40 no-print">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm z-[70] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-surface-container flex-col p-6 gap-y-4 z-[80] transform transition-transform duration-300 md:hidden flex no-print ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>
    </>
  );
}
