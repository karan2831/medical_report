import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';
import { extractInsights, generateEmbedding } from '@/lib/openai';
import { logClinicalAction } from '@/lib/audit';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
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

    // Get session user securely from server-side cookies
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Auth error in upload API:", authError);
      return NextResponse.json({ error: 'Unauthorized Access: Clinical Session Required' }, { status: 401 });
    }

    const userId = user.id;

    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Only PDF, JPG, and PNG are permitted.' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds clinical ingestion limit (5MB).' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('reports')
      .upload(`${userId}/${fileName}`, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('reports')
      .getPublicUrl(`${userId}/${fileName}`);

    // 4. Record insertion in DB
    const { data: report, error: dbError } = await supabase
      .from('reports')
      .insert([{ 
        user_id: userId, 
        file_url: publicUrl,
        status: 'completed'
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    // Phase 8: Clinical Audit
    await logClinicalAction(userId, 'upload_report', report.id);

    // 5. Automated AI Extraction (OPENAI INTEGRATION WITH MEMORY)
    let extractedText = "";
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const pdf = require('pdf-parse');
        const data = await pdf(buffer);
        extractedText = data.text;
      } else if (file.name.toLowerCase().endsWith('.txt')) {
        extractedText = buffer.toString('utf-8');
      }
    } catch (e) {
      console.error("Parsing Error:", e);
    }

    // Fetch History Context
    const { data: history } = await supabase
      .from('extracted_data')
      .select('disease, summary, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    let aiData;
    let embedding = null;

    if (extractedText && extractedText.length > 5) {
      // Logic-aware extraction
      aiData = await extractInsights(extractedText, history || []);
      // Generate embedding for semantic search
      const embeddingText = `Disease: ${aiData.disease}. Symptoms: ${aiData.symptoms}. Summary: ${aiData.summary}`;
      embedding = await generateEmbedding(embeddingText);
    } else {
      aiData = {
        disease: "Unknown",
        symptoms: [],
        medications: [],
        tests: [],
        differences: [],
        conflicts: [],
        missing_tests: [],
        risk_score: 0,
        risk_level: "Low",
        explanation: "Empty document.",
        summary: "N/A"
      };
    }

    const formatSafe = (val) => Array.isArray(val) ? val.join(', ') : (val || "");

    const { data: extraction, error: insertError } = await supabase
      .from('extracted_data')
      .insert([{
        report_id: report.id,
        disease: aiData.disease || "",
        symptoms: formatSafe(aiData.symptoms),
        medications: formatSafe(aiData.medications),
        tests: formatSafe(aiData.tests),
        differences: formatSafe(aiData.differences),
        conflicts: formatSafe(aiData.conflicts),
        missing_tests: formatSafe(aiData.missing_tests),
        risk_score: aiData.risk_score || 0,
        risk_level: aiData.risk_level || "Low",
        explanation: aiData.explanation || "",
        summary: aiData.summary || "",
        embedding: embedding
      }])
      .select()
      .single();

    if (insertError) console.error("Extraction Insert Error:", insertError);

    // 6. Global Similarity Search
    let similarCases = [];
    if (embedding) {
      const { data: matches } = await supabase.rpc('match_reports', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 5
      });
      similarCases = matches || [];
    }
    // --- END OPENAI PIPELINE ---

    return NextResponse.json({ 
      url: publicUrl, 
      report, 
      id: report.id, 
      analysis: aiData,
      similar_cases: similarCases.filter(c => c.report_id !== report.id) // Filter out current
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
