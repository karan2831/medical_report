"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UploadCloud, 
  SearchCode, 
  ArrowLeftRight, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Stethoscope,
  Menu,
  X,
  AlertCircle,
  FlaskConical,
  Archive
} from "lucide-react";
import { useState } from "react";
import { logout } from "@/lib/auth";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Upload Report", href: "/upload", icon: UploadCloud },
  { name: "Lab Analyzer", href: "/lab", icon: FlaskConical },
  { name: "AI Insights", href: "/insights", icon: SearchCode },
  { name: "Compare Diagnoses", href: "/compare", icon: ArrowLeftRight },
  { name: "Archives", href: "/reports", icon: Archive },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 primary-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Stethoscope className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-on-surface">MedAI</h1>
            <p className="text-primary/60 font-bold text-[10px] uppercase tracking-[0.3em] leading-none">Clinical Sanctuary</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-on-surface-variant hover:text-primary">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                isActive 
                  ? "bg-primary/10 text-primary border-l-4 border-primary" 
                  : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
              }`}
            >
              <item.icon size={22} className={isActive ? "text-primary" : "group-hover:text-primary"} />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 space-y-4">
        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl flex gap-3">
          <AlertCircle className="text-amber-600 shrink-0" size={16} />
          <p className="text-[9px] text-amber-700/80 leading-relaxed font-medium">
            <span className="font-bold uppercase block mb-0.5">Clinical Disclaimer</span>
            MedAI provides analysis support only. It is not a substitute for professional medical judgment.
          </p>
        </div>
        <div className="bg-primary/5 p-4 rounded-2xl mb-6 flex items-center gap-3 border border-primary/10">
          <div className="h-8 w-8 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <p className="text-[10px] text-on-surface-variant/70 leading-tight font-medium">HIPAA Compliant & Encrypted Ecosystem</p>
        </div>
        
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={22} />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-[60] bg-blue-600 p-2 rounded-xl text-white shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/30 flex-col z-50 no-print">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-surface-container-low border-r border-outline-variant/30 z-[80] transform transition-transform duration-300 lg:hidden flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>
    </>
  );
}
