"use client";

import { ShieldCheck, Mail, ArrowRight, Loader2, RefreshCcw } from "lucide-react";
import { useState } from "react";

export default function VerificationUI({ onComplete }) {
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="w-full max-w-xl animate-fade-in">
        <div className="glass-card rounded-[48px] p-12 border border-blue-500/20 shadow-[0_0_100px_rgba(59,130,246,0.1)] relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 bg-blue-600/10 rounded-full blur-[80px]" />
          
          <div className="text-center space-y-6 mb-12">
             <div className="h-24 w-24 bg-blue-600/20 text-blue-500 rounded-[32px] flex items-center justify-center mx-auto border border-blue-500/30">
               <ShieldCheck size={48} />
             </div>
             <div>
               <h1 className="text-4xl font-bold tracking-tighter text-white italic">Identity Consensus</h1>
               <p className="text-blue-400/60 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">Sanctuary Verification Required</p>
             </div>
          </div>

          <div className="space-y-8 relative">
            <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[32px] text-center space-y-4">
              <Mail className="mx-auto text-blue-400 opacity-50" size={32} />
              <p className="text-gray-300 font-medium">A neural synchronization link has been dispatched to your clinical mailbox.</p>
              <div className="text-sm font-bold text-blue-500 bg-blue-500/10 py-2 px-4 rounded-full inline-block">
                doctor@medai.com
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={handleVerify}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-900/40"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Synchronize Identity <ArrowRight size={20}/></>}
              </button>
              
              <button className="text-gray-600 hover:text-blue-400 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                <RefreshCcw size={14} /> Resend Dispatch
              </button>
            </div>

            <div className="pt-8 border-t border-gray-800/50 text-center">
               <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest leading-relaxed">
                 Encryption standard: AES-256 Multi-Layer <br/>
                 HIPAA Compliance baseline: EXCEEDED
               </p>
            </div>
          </div>
        </div>
        <p className="text-center mt-12 text-gray-700 text-xs font-bold uppercase tracking-[0.4em]">
          MedAI Terminal v4.0.12
        </p>
      </div>
    </div>
  );
}
