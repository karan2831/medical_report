"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session && pathname !== "/login") {
        router.push("/login");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && pathname !== "/login") {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  // If loading or (no session and not on login page), show loader to prevent flicker
  if (loading || (!session && pathname !== "/login")) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-primary">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return children;
}
