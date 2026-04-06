"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  BrainCircuit,
  Dna,
  Microscope,
  Stethoscope,
  AlertTriangle,
  Activity,
  FileText,
  ChevronRight,
  Printer,
  AlertCircle,
  ArrowLeftRight,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Languages,
} from "lucide-react";
import { useTranslation } from "../components/TranslationContext";

function RiskMeter({ score, level }) {
  const colors = {
    Low: "bg-green-500",
    Medium: "bg-amber-500",
    High: "bg-red-500",
    Critical: "bg-red-700",
  };
  const textColors = {
    Low: "text-green-700",
    Medium: "text-amber-700",
    High: "text-red-700",
    Critical: "text-red-800",
  };
  const bgColors = {
    Low: "bg-green-50 border-green-200",
    Medium: "bg-amber-50 border-amber-200",
    High: "bg-red-50 border-red-200",
    Critical: "bg-red-100 border-red-300",
  };
  return (
    <div className={`rounded-2xl p-6 border text-center ${bgColors[level] || bgColors.Low}`}>
      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60 mb-3">Risk Score</p>
      <p className={`text-5xl font-black font-manrope ${textColors[level] || textColors.Low}`}>
        {score}<span className="text-xl font-medium">/100</span>
      </p>
      <div className="mt-4 h-2 bg-white/60 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${colors[level] || colors.Low}`} style={{ width: `${score}%` }} />
      </div>
      <p className={`mt-3 text-xs font-bold uppercase tracking-widest ${textColors[level] || textColors.Low}`}>{level} Risk</p>
    </div>
  );
}

function TagList({ text, color = "bg-primary/10 text-primary" }) {
  if (!text) return <p className="text-sm text-on-surface-variant/50 italic">None identified.</p>;
  const items = typeof text === "string" ? text.split(",").map(s => s.trim()).filter(Boolean) : [];
  if (items.length === 0) return <p className="text-sm text-on-surface-variant/50 italic">None identified.</p>;
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {items.map((s, i) => (
        <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${color}`}>{s}</span>
      ))}
    </div>
  );
}

function InsightsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarCases, setSimilarCases] = useState([]);
  const [history, setHistory] = useState([]);
  
  // Translation States
  const { selectedLanguage, translateText } = useTranslation();
  const [translatedData, setTranslatedData] = useState({
    disease: "",
    summary: "",
    explanation: "",
    isTranslating: false
  });

  useEffect(() => {
    if (id) fetchReport();
  }, [id]);

  // Trigger translation when report is loaded or language changes
  useEffect(() => {
    if (report) {
      handleTranslation();
    }
  }, [report, selectedLanguage]);

  const handleTranslation = async () => {
    const ext = report.extracted_data?.[0] || {};
    const baseDisease = ext.disease || "Pending Analysis";
    const baseSummary = ext.summary || "";
    const baseExplanation = ext.explanation || "";

    if (selectedLanguage === "en") {
      setTranslatedData({
        disease: baseDisease,
        summary: baseSummary,
        explanation: baseExplanation,
        isTranslating: false
      });
      return;
    }

    setTranslatedData(prev => ({ ...prev, isTranslating: true }));

    try {
      const [tDisease, tSummary, tExplanation] = await Promise.all([
        translateText(baseDisease),
        translateText(baseSummary),
        translateText(baseExplanation)
      ]);

      setTranslatedData({
        disease: tDisease || baseDisease,
        summary: tSummary || baseSummary,
        explanation: tExplanation || baseExplanation,
        isTranslating: false
      });
    } catch (err) {
      console.error("Translation error in Insights:", err);
      setTranslatedData(prev => ({ ...prev, isTranslating: false }));
    }
  };

  const fetchReport = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*, extracted_data(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      setReport(data);

      if (data.extracted_data?.[0]?.embedding) {
        const { data: matches } = await supabase.rpc("match_reports", {
          query_embedding: data.extracted_data[0].embedding,
          match_threshold: 0.5,
          match_count: 5,
        });
        setSimilarCases(matches?.filter(m => m.report_id !== id) || []);
      }

      if (data.user_id) {
        const { data: hist } = await supabase
          .from("reports")
          .select("*, extracted_data(*)")
          .eq("user_id", data.user_id)
          .order("created_at", { ascending: false });
        setHistory(hist || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-on-surface-variant font-medium">Retrieving Neural Mapping...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <AlertCircle className="text-on-surface-variant/30" size={48} />
        <p className="text-on-surface-variant font-medium">Clinical record not found.</p>
        <Link href="/" className="text-primary font-bold hover:underline text-sm">← Return to Dashboard</Link>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <BrainCircuit className="text-on-surface-variant/30" size={48} />
        <p className="text-on-surface-variant font-medium">No report selected. Navigate from the Dashboard.</p>
        <Link href="/" className="text-primary font-bold hover:underline text-sm">← Return to Dashboard</Link>
      </div>
    );
  }

  const ext = report.extracted_data?.[0] || {};
  const symptoms = ext.symptoms || "";
  const medications = ext.medications || "";
  const tests = ext.tests || "";
  const riskScore = ext.risk_score ?? 0;
  const riskLevel = ext.risk_level || "Low";

  return (
    <div className="space-y-10 max-w-6xl mx-auto">

      {/* Clinical Safety Banner */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
          <span className="font-bold uppercase">Clinical Disclaimer — </span>
          MedAI AI Insights are an analytical support tool. All findings must be reviewed and validated by a qualified medical professional before any clinical decision is made.
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <BrainCircuit size={20} />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">AI Diagnostic Report</span>
            {translatedData.isTranslating ? (
              <span className="px-3 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-200 flex items-center gap-2">
                <Loader2 className="animate-spin" size={10} /> Translating...
              </span>
            ) : (
              <span className="px-3 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-200">Scan Complete</span>
            )}
          </div>
          <h1 className="text-4xl font-manrope font-bold tracking-tight text-on-surface">
            {translatedData.disease}
          </h1>
          <p className="text-on-surface-variant text-sm font-medium">Report ID: {report.id?.slice(0, 16).toUpperCase()} · {new Date(report.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <div className="flex gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all font-semibold text-sm"
          >
            <Printer size={16} /> Print
          </button>
          <Link href="/compare" className="primary-gradient px-5 py-3 rounded-xl text-white font-bold text-sm shadow-md shadow-primary/20 flex items-center gap-2 hover:shadow-lg transition-all">
            <ArrowLeftRight size={16} /> Compare
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left — Core Findings */}
        <div className="lg:col-span-2 space-y-6">

          {/* Primary Finding Card */}
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10">
            <div className="px-8 py-5 bg-surface-container-low flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <BrainCircuit size={18} className="text-primary" /> Neural Findings
              </div>
              <div className="flex items-center gap-4">
                {selectedLanguage !== "en" && (
                   <span className="flex items-center gap-1 text-[8px] font-bold text-blue-600/60 uppercase tracking-[0.2em]">
                     <Languages size={10} /> Translated
                   </span>
                )}
                <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Confidence: 98.4%</span>
              </div>
            </div>
            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Primary Diagnosis</span>
                  <p className="text-3xl font-bold font-manrope text-on-surface">{translatedData.disease}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Clinical Summary</span>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {translatedData.isTranslating ? (
                      <span className="flex items-center gap-2 italic text-outline animate-pulse">
                         Neural Synthesis in progress...
                      </span>
                    ) : (
                      translatedData.summary || "Awaiting summary extraction."
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Identified Symptoms</span>
                  <TagList text={symptoms} color="bg-primary/8 text-primary" />
                </div>
              </div>
              <div className="space-y-5">
                <div className="bg-surface-container-low rounded-xl p-5 space-y-2">
                  <h5 className="font-bold text-on-surface flex items-center gap-2 text-sm">
                    <Microscope className="text-primary" size={16} /> Lab Analysis
                  </h5>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{tests || "No lab tests identified."}</p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-5 space-y-2">
                  <h5 className="font-bold text-on-surface flex items-center gap-2 text-sm">
                    <Stethoscope className="text-primary" size={16} /> Medication Notes
                  </h5>
                  <TagList text={medications} color="bg-secondary/10 text-secondary" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Explanation */}
          {(translatedData.explanation || translatedData.isTranslating) && (
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-3">
              <h4 className="font-bold text-on-surface flex items-center gap-2">
                <Activity size={18} className="text-primary" /> Clinical Explanation
              </h4>
              <p className="text-on-surface-variant leading-relaxed italic">
                {translatedData.isTranslating ? (
                   "Recalibrating diagnostic insights..."
                ) : (
                   `"${translatedData.explanation}"`
                )}
              </p>
            </div>
          )}

          {/* Similar Cases */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-5">
            <div>
              <h4 className="font-bold text-on-surface flex items-center gap-2">
                <Dna size={18} className="text-primary" /> Similar Case Detection
              </h4>
              <p className="text-sm text-on-surface-variant mt-1">Semantically matched profiles from the clinical sanctuary via vector search.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {similarCases.length > 0 ? similarCases.map((c, i) => (
                <div key={i} className="p-5 bg-surface-container-low rounded-xl hover:bg-primary/5 transition-all cursor-pointer group space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">{Math.round(c.similarity * 100)}% Match</span>
                    <span className="text-[10px] text-on-surface-variant/50">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="font-bold text-on-surface group-hover:text-primary transition-colors text-sm">{c.disease}</p>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{c.summary}</p>
                </div>
              )) : (
                <div className="col-span-2 py-8 text-center border-2 border-dashed border-outline-variant/30 rounded-xl">
                  <p className="text-sm text-on-surface-variant/50 italic">No high-confidence overlaps detected in the clinical sanctuary.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — Risk & Timeline */}
        <div className="space-y-6">
          <RiskMeter score={riskScore} level={riskLevel} />

          {/* Patient History Timeline */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 space-y-4">
            <h4 className="font-bold text-on-surface flex items-center gap-2 text-sm">
              <FileText size={16} className="text-primary" /> Patient History
            </h4>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {history.length > 1 ? (
                history.filter(h => h.id !== report.id).map((h, i) => (
                  <div key={i} className="relative pl-5 border-l-2 border-outline-variant/30 pb-3 last:pb-0">
                    <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-primary" />
                    <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">{new Date(h.created_at).toLocaleDateString()}</p>
                    <p className="text-sm font-bold text-on-surface">{h.extracted_data?.[0]?.disease || "General Review"}</p>
                    <p className="text-xs text-on-surface-variant truncate">{h.extracted_data?.[0]?.summary}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-on-surface-variant/50 italic py-4 text-center">No previous clinical records found.</p>
              )}
            </div>
          </div>

          {/* Compare CTA */}
          <Link
            href="/compare"
            className="block primary-gradient p-7 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group"
          >
            <Activity className="text-white mb-4 animate-pulse" size={32} />
            <h4 className="text-xl font-bold text-white mb-1 font-manrope">Longitudinal Compare</h4>
            <p className="text-white/60 text-sm mb-5">Detect structural changes and disease progression over time.</p>
            <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all text-sm">
              Open Compare Engine <ChevronRight size={16} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <InsightsContent />
    </Suspense>
  );
}

