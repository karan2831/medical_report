"use client";

import { useState } from "react";
import { 
  FlaskConical, 
  Activity, 
  Droplets, 
  Heart, 
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  AlertCircle,
  Loader2,
  RotateCcw,
  CheckCircle,
  XCircle,
  ChevronRight
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import { useToast } from "@/app/components/ToastContext";

function StatusBadge({ status }) {
  const config = {
    Normal: { color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle },
    Low:    { color: "text-blue-700 bg-blue-50 border-blue-200",   icon: TrendingDown },
    High:   { color: "text-amber-700 bg-amber-50 border-amber-200", icon: TrendingUp },
    Critical: { color: "text-red-700 bg-red-50 border-red-200",    icon: XCircle },
  };
  const { color, icon: Icon } = config[status] || config.Normal;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${color}`}>
      <Icon size={10} />
      {status}
    </span>
  );
}

export default function LabAnalyzerPage() {
  const [step, setStep] = useState("input");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    systolic: "", diastolic: "",
    glucose: "", hba1c: "",
    cholesterol: "", ldl: "", hdl: "", triglycerides: ""
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const hasAnyValue = Object.values(form).some(v => v.trim() !== "");

  const handleAnalyze = async () => {
    if (!hasAnyValue) {
      addToast("Please enter at least one lab value.", "error");
      return;
    }
    setLoading(true);
    addToast("Orchestrating Neural Lab Analysis...", "info");
    try {
      // Get auth token for API call
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
      );
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      const res = await fetch("/api/analyze-labs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Analysis failed.");
      setAnalysis(data.analysis);
      setStep("results");
      addToast("Lab analysis complete.", "success");
    } catch (err) {
      addToast("Lab Engine Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("input");
    setAnalysis(null);
    setForm({ systolic: "", diastolic: "", glucose: "", hba1c: "", cholesterol: "", ldl: "", hdl: "", triglycerides: "" });
  };

  const fields = [
    { label: "Systolic BP", name: "systolic", unit: "mmHg", placeholder: "e.g. 120" },
    { label: "Diastolic BP", name: "diastolic", unit: "mmHg", placeholder: "e.g. 80" },
    { label: "Fasting Glucose", name: "glucose", unit: "mg/dL", placeholder: "e.g. 95" },
    { label: "HbA1c", name: "hba1c", unit: "%", placeholder: "e.g. 5.7" },
    { label: "Total Cholesterol", name: "cholesterol", unit: "mg/dL", placeholder: "e.g. 185" },
    { label: "LDL Cholesterol", name: "ldl", unit: "mg/dL", placeholder: "e.g. 110" },
    { label: "HDL Cholesterol", name: "hdl", unit: "mg/dL", placeholder: "e.g. 55" },
    { label: "Triglycerides", name: "triglycerides", unit: "mg/dL", placeholder: "e.g. 140" },
  ];

  const riskColors = {
    Low: "text-green-600", Medium: "text-amber-600",
    High: "text-red-600", Critical: "text-red-700"
  };
  const riskBg = {
    Low: "bg-green-50 border-green-200", Medium: "bg-amber-50 border-amber-200",
    High: "bg-red-50 border-red-200", Critical: "bg-red-100 border-red-300"
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">

      {/* Clinical Safety Banner */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
          <span className="font-bold uppercase">Clinical Disclaimer — </span>
          MedAI Lab Analyzer is an AI-assisted support tool. All results must be reviewed and validated by a qualified medical professional before any clinical decision is made.
        </p>
      </div>

      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-primary">
          <FlaskConical size={20} className={loading ? "animate-pulse" : ""} />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Quantitative Diagnostic Module</span>
        </div>
        <h1 className="text-5xl font-manrope font-bold tracking-tight text-on-surface">Lab Analyzer</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Transform raw laboratory values into structured clinical insights. Enter your metrics below to engage the Neural Diagnostic Engine.
        </p>
      </div>

      {step === "input" ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/10 space-y-6">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                Enter Laboratory Values
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {fields.map(({ label, name, unit, placeholder }) => (
                  <div key={name} className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/70">
                      {label} <span className="text-outline normal-case tracking-normal">({unit})</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full bg-surface-container-low px-5 py-4 pr-16 rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 transition-all font-semibold text-on-surface placeholder:text-outline/50"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant/40">{unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-on-surface-variant/50 italic">
                Leave fields blank if unavailable. The engine will analyze only the values provided.
              </p>

              <button
                onClick={handleAnalyze}
                disabled={loading || !hasAnyValue}
                className="w-full mt-4 primary-gradient text-white py-5 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" /> Analyzing Clinical Streams...</>
                ) : (
                  <><TrendingUp size={20} /> Execute Lab Analysis</>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-5">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Privacy Secured</span>
              </div>
              <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                Lab values are processed transiently. No numerical patient data is permanently stored without your explicit consent.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 space-y-4">
              <h4 className="text-sm font-bold text-on-surface">Reference Ranges</h4>
              <div className="space-y-2 text-xs text-on-surface-variant">
                {[
                  ["Systolic BP", "< 120 mmHg"],
                  ["Fasting Glucose", "70–99 mg/dL"],
                  ["HbA1c", "< 5.7%"],
                  ["Total Cholesterol", "< 200 mg/dL"],
                  ["LDL", "< 100 mg/dL"],
                  ["HDL", "> 60 mg/dL"],
                  ["Triglycerides", "< 150 mg/dL"],
                ].map(([name, range]) => (
                  <div key={name} className="flex justify-between">
                    <span className="font-medium">{name}</span>
                    <span className="text-on-surface-variant/60 font-mono text-[10px]">{range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">

          {/* Risk Score Header */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className={`rounded-2xl p-8 border text-center ${riskBg[analysis?.risk_level] || riskBg.Low}`}>
              <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60 mb-3">Metabolic Risk Score</p>
              <p className={`text-6xl font-black font-manrope ${riskColors[analysis?.risk_level] || "text-green-600"}`}>
                {analysis?.risk_score}<span className="text-2xl font-medium">/100</span>
              </p>
              <div className={`mt-4 inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${riskBg[analysis?.risk_level]}`}>
                <span className={riskColors[analysis?.risk_level]}>{analysis?.risk_level} Risk</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 col-span-2 border border-outline-variant/10 space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary">Clinical Summary</p>
              <p className="text-on-surface text-lg leading-relaxed font-medium">{analysis?.summary}</p>
            </div>
          </div>

          {/* Per-Metric Interpretations */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
            <div className="px-8 py-5 bg-surface-container-low">
              <h3 className="font-bold text-on-surface text-lg flex items-center gap-2">
                <Droplets size={18} className="text-primary" />
                Metric-by-Metric Interpretation
              </h3>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {(analysis?.interpretations || []).map((item, i) => (
                <div key={i} className="px-8 py-5 flex items-start justify-between gap-4 hover:bg-surface-container-low/50 transition-colors">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-on-surface">{item.metric}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{item.insight}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold font-mono text-on-surface text-lg">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Recommendations */}
          {analysis?.recommendations?.length > 0 && (
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-5">
              <h3 className="font-bold text-on-surface text-lg flex items-center gap-2">
                <Heart size={18} className="text-primary" />
                Clinical Observations
              </h3>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                    <ChevronRight size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-surface-container-low rounded-2xl p-5 flex items-start gap-3 border border-outline-variant/10">
            <ShieldCheck className="text-primary shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {analysis?.disclaimer}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
              <RotateCcw size={16} /> New Analysis
            </button>
            <button className="primary-gradient px-8 py-3 rounded-xl text-white font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all">
              Export Report (PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
