"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

export default function TopNavBar() {
  const pathname = usePathname();

  // Basic map for active tab label
  let activeTab = "Dashboard";
  if (pathname.includes("/upload")) activeTab = "Upload";
  if (pathname.includes("/lab")) activeTab = "Analytics"; // Mapping lab to analytics visually
  if (pathname.includes("/compare")) activeTab = "Patient Logs"; // Mapping compare to patient logs visually
  if (pathname.includes("/settings")) activeTab = "Settings";
  if (pathname.includes("/insights")) activeTab = "Insights";
  if (pathname.includes("/reports")) activeTab = "Reports";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-30 h-20 bg-white/70 backdrop-blur-xl flex justify-between items-center px-8 shadow-[0_24px_48px_-12px_rgba(13,28,46,0.08)] no-print">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-black tracking-tight text-blue-700">MedAI</span>
        <div className="hidden lg:flex ml-8 gap-6">
          <span className={`pb-1 text-sm ${activeTab === 'Dashboard' ? 'text-blue-700 font-bold border-b-2 border-blue-700' : 'text-slate-500 font-medium'}`}>
            Dashboard
          </span>
          <span className={`pb-1 text-sm ${activeTab === 'Patient Logs' ? 'text-blue-700 font-bold border-b-2 border-blue-700' : 'text-slate-500 font-medium'}`}>
            Patient Logs
          </span>
          <span className={`pb-1 text-sm ${activeTab === 'Analytics' ? 'text-blue-700 font-bold border-b-2 border-blue-700' : 'text-slate-500 font-medium'}`}>
            Analytics
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center bg-surface-container rounded-xl px-4 py-2 border border-[rgba(195,198,215,0.2)]">
          <span className="material-symbols-outlined text-slate-400 mr-2 text-lg">search</span>
          <input 
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-48 text-on-surface" 
            placeholder="Search patients..." 
            type="text" 
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-blue-50/50 rounded-full transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-blue-50/50 rounded-full transition-all">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          
          <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm relative">
            {/* Using unoptimized remote image from dummy data for now to match UI perfectly */}
            <img 
              alt="Dr. profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOkFRFqXOoVRnQNT8ePYn8WNShhu7aFuRFaRL2nCNK_-Y5bsxAvR4IRZIFwqvSZ_XnPhXtmRwBs49IYp3DduBfRPafjWNwrUR1YLQqgK1LnJAj70xW-4Ve5h98dfaaimMMNuH4Iz4ixwGMkHrRqrlOvccHTDfoW-do-FZeE8qnPJDf_UfaX7MB2eSfTTvBzR6Lg4tS7BOpe-y9OJ0yOEDWUqdINkmQrcg2LObRQzE8auPBWaykgvdiSzTLBNkiHTNOZkqGmk3Nu5AB"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
