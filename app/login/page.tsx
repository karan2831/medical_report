"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Stethoscope, Sparkles } from "lucide-react";
import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/");
      } else {
        setIsChecking(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (isChecking) return null;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract design elements */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />

      <div className="w-full max-w-xl animate-fade-in relative z-10 mx-auto">
        <div className="bg-surface-container-lowest rounded-[48px] p-12 border border-outline-variant/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="text-center space-y-4 mb-12">
              <div className="h-20 w-20 primary-gradient rounded-[28px] flex items-center justify-center mx-auto shadow-2xl shadow-primary/30 transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <Stethoscope className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tighter text-on-surface">Clinical Sanctuary</h1>
                <p className="text-primary/60 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Next-Gen Intelligence Portal</p>
              </div>
          </div>

          <div className="space-y-6 relative">
            {/* The onLoginSuccess relies on onAuthStateChange hook, so no need to pass state up unless local */}
            <AuthForm onLoginSuccess={() => router.push("/")} />

            <div className="pt-8 border-t border-outline-variant/30 text-center space-y-4">
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">End-to-End Encryption Active</p>
                <div className="flex justify-center gap-2">
                  <div className="px-3 py-1 bg-primary/5 rounded-full border border-primary/10 flex items-center gap-2 text-[9px] font-bold text-primary/60 uppercase tracking-widest">
                    <Sparkles size={10} /> Neural Sync Ready
                  </div>
                  <div className="px-3 py-1 bg-green-500/5 rounded-full border border-green-500/10 flex items-center gap-2 text-[9px] font-bold text-green-500/60 uppercase tracking-widest text-[10px]">
                    HIPAA SECURE
                  </div>
                </div>
            </div>
          </div>
        </div>
        <p className="text-center mt-12 text-on-surface-variant/40 text-xs font-medium">
          Authorized health professionals only. Continuous AI monitoring active.
        </p>
      </div>
    </div>
  );
}
