import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';
import { logClinicalAction } from '@/lib/audit';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {}
          },
        },
      }
    );

    // 1. Get session user securely from server-side cookies
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth Error in Reports Route:", authError);
      return NextResponse.json({ error: 'Unauthorized Access: Clinical Session Required.' }, { status: 401 });
    }

    // 2. Fetch authenticated reports with extracted insights
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*, extracted_data(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Phase 8: Clinical Audit
    await logClinicalAction(user.id, 'view_reports');

    return NextResponse.json({ 
      success: true, 
      count: reports.length,
      reports 
    });
  } catch (error) {
    console.error("API Reports Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
