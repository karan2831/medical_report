import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';
import { compareReports } from '@/lib/openai';
import { logClinicalAction } from '@/lib/audit';

export async function POST(request) {
  try {
    const { reportIdA, reportIdB } = await request.json();

    if (!reportIdA || !reportIdB) {
      return NextResponse.json({ error: 'Two report IDs are required for comparison.' }, { status: 400 });
    }

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
      console.error("Auth Error in Compare Route:", authError);
      return NextResponse.json({ error: 'Unauthorized Access: Clinical Session Required.' }, { status: 401 });
    }

    // 2. Fetch previously extracted clinical data - with ownership check
    const { data: dataA, error: errA } = await supabase
      .from('extracted_data')
      .select('*, reports!inner(user_id)')
      .eq('report_id', reportIdA)
      .eq('reports.user_id', user.id)
      .single();

    const { data: dataB, error: errB } = await supabase
      .from('extracted_data')
      .select('*, reports!inner(user_id)')
      .eq('report_id', reportIdB)
      .eq('reports.user_id', user.id)
      .single();

    if (errA || errB) {
      return NextResponse.json({ error: 'Clinical Synchronicity Error: Access denied or record missing.' }, { status: 403 });
    }

    // Stringify the core extracted fields to minimize token throughput
    const formatForAI = (d) => `Date: ${d.created_at}\nDisease: ${d.disease}\nSymptoms: ${d.symptoms}\nMedications: ${d.medications}\nTests: ${d.tests}`;

    const syncMetrics = await compareReports(formatForAI(dataA), formatForAI(dataB));

    // Phase 8: Clinical Audit
    await logClinicalAction(user.id, 'compare_reports', reportIdA);
    await logClinicalAction(user.id, 'compare_reports', reportIdB);

    // Return the generated json structure
    return NextResponse.json({ metrics: syncMetrics });
  } catch (error) {
    console.error("Comparison Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
