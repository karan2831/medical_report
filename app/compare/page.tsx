"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeftRight, 
  FileText, 
  Activity, 
  AlertCircle,
  TrendingUp,
  Plus,
  Scale,
  Brain,
  ShieldCheck,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useToast } from "@/app/components/ToastContext";

export default function ComparePage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([null, null]);
  const [syncing, setSyncing] = useState(false);
  const [syncData, setSyncData] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.success) setReports(data.reports || []);
    } catch (err) {
      console.error("Compare Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectReport = (index, report) => {
    const newSelected = [...selected];
    newSelected[index] = report;
    setSelected(newSelected);
    setSyncData(null);
  };

  const calculateSync = async () => {
    if (!selected[0] || !selected[1]) return;
    setSyncing(true);
    addToast("Initializing Neural Differential Engine...", "info");
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportIdA: selected[0].id, reportIdB: selected[1].id })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSyncData(data.metrics);
      addToast("Differential analysis complete.", "success");
    } catch (err) {
      addToast("Sync Failure: " + err.message, "error");
    } finally {
      setSyncing(false);
    }
  };

  const ReportSlot = ({ index, accentColor }) => {
    const report = selected[index];
    const isAlpha = index === 0;

    if (report) {
      return (
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/10 animate-fade-in flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white ${isAlpha ? 'primary-gradient' : 'bg-secondary'}`}>
                {isAlpha ? <FileText size={22} /> : <Activity size={22} />}
              </div>
              <div>
                <h5 className="font-bold text-on-surface text-lg">{isAlpha ? "Report Alpha" : "Report Omega"}</h5>
                <p className="text-on-surface-variant text-xs font-medium tracking-widest uppercase">
                  {new Date(report.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
                </p>
              </div>
            </div>
            <button
              onClick={() => selectReport(index, null)}
              className="text-xs font-bold text-on-surface-variant hover:text-primary uppercase tracking-widest transition-colors"
            >
              Change
            </button>
          </div>

          <div className="bg-surface-container-low rounded-xl p-5 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Primary Diagnosis</p>
            <p className="text-2xl font-bold font-manrope text-on-surface">{report.extracted_data?.[0]?.disease || "Not Extracted"}</p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Risk Indicators</p>
            <div className="space-y-2">
              {(report.extracted_data?.[0]?.symptoms || []).slice(0, 3).map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <ChevronRight size={14} className="text-primary shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
              {(!report.extracted_data?.[0]?.symptoms?.length) && (
                <p className="text-sm text-on-surface-variant/50 italic">No symptom data available</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-surface-container-lowest rounded-2xl p-8 border-2 border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center gap-4 min-h-[280px] hover:border-primary/30 hover:bg-primary/5 transition-all group">
        <div className="h-14 w-14 bg-surface-container rounded-xl flex items-center justify-center text-on-surface-variant/40 group-hover:text-primary transition-colors">
          <Plus size={28} />
        </div>
        <div>
          <h4 className="font-bold text-on-surface-variant">{isAlpha ? "Select Baseline Report" : "Select Comparative Report"}</h4>
          <p className="text-xs text-on-surface-variant/60 mt-1 max-w-xs">
            {isAlpha ? "Choose the earlier record to anchor the comparison." : "Choose the target record to diff against the baseline."}
          </p>
        </div>
        {loading ? (
          <Loader2 className="animate-spin text-primary" size={20} />
        ) : (
          <div className="w-full max-h-52 overflow-y-auto space-y-2">
            {reports.length === 0 ? (
              <p className="text-xs text-on-surface-variant/40 italic">No clinical reports found.</p>
            ) : reports.map(r => (
              <button
                key={r.id}
                onClick={() => selectReport(index, r)}
                className="w-full p-4 bg-surface-container-low hover:bg-primary/5 rounded-xl text-left transition-all flex justify-between items-center group/btn"
              >
                <div>
                  <p className="font-bold text-on-surface text-sm">Report #{r.id.slice(0,8).toUpperCase()}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight size={16} className="text-on-surface-variant/30 group-hover/btn:text-primary transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">

      {/* Clinical Safety Banner */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
          <span className="font-bold uppercase">Clinical Disclaimer — </span>
          MedAI Differential Analysis is an AI-assisted support tool. Results must be reviewed and validated by a qualified medical professional before any clinical decision is made.
        </p>
      </div>

      {/* Editorial Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-primary">
          <Scale size={20} />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Longitudinal Intelligence</span>
        </div>
        <h1 className="text-5xl font-manrope font-bold tracking-tight text-on-surface">Compare Diagnoses</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Synchronize dual diagnostic records to detect structural changes, trend deviations, and clinical progression metrics.
        </p>
      </div>

      {/* Dual Report Selection */}
      <div className="grid lg:grid-cols-2 gap-6 relative">
        <ReportSlot index={0} accentColor="primary" />

        {/* Divider Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center">
          <div className="h-12 w-12 primary-gradient rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <ArrowLeftRight size={20} />
          </div>
        </div>

        <ReportSlot index={1} accentColor="secondary" />
      </div>

      {/* Sync Action */}
      {selected[0] && selected[1] && !syncData && (
        <div className="bg-surface-container-lowest rounded-2xl p-10 flex flex-col items-center text-center gap-6 border border-outline-variant/10 animate-fade-in">
          <div className="h-16 w-16 primary-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Brain size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-manrope text-on-surface">Ready to Synchronize</h3>
            <p className="text-on-surface-variant mt-2 max-w-md">
              Both diagnostic logs are loaded. Engage the Neural Engine to generate a longitudinal differential analysis.
            </p>
          </div>
          <button
            onClick={calculateSync}
            disabled={syncing}
            className="primary-gradient px-10 py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center gap-3 disabled:opacity-60"
          >
            {syncing ? (
              <><Loader2 size={20} className="animate-spin" /> Analyzing Clinical Streams...</>
            ) : (
              <><TrendingUp size={20} /> Run Longitudinal Analysis</>
            )}
          </button>
        </div>
      )}

      {/* Placeholder when no two reports are selected */}
      {(!selected[0] || !selected[1]) && (
        <div className="bg-surface-container-low rounded-2xl p-10 flex flex-col items-center text-center gap-4 opacity-60">
          <Brain className="text-on-surface-variant/30" size={40} />
          <p className="text-on-surface-variant font-medium">Select two diagnostic records above to unlock the synchronization engine.</p>
        </div>
      )}

      {/* Results */}
      {syncData && (
        <div className="space-y-8 animate-fade-in">

          {/* Risk Score */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className={`bg-surface-container-lowest rounded-2xl p-8 border text-center col-span-1 ${syncData.risk_level === 'High' ? 'border-red-200 bg-red-50' : syncData.risk_level === 'Medium' ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'}`}>
              <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60 mb-3">Aggregated Risk</p>
              <p className={`text-6xl font-black font-manrope ${syncData.risk_level === 'High' ? 'text-red-600' : syncData.risk_level === 'Medium' ? 'text-amber-600' : 'text-green-600'}`}>
                {syncData.risk_score}<span className="text-2xl font-medium">/100</span>
              </p>
              <div className={`mt-4 inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${syncData.risk_level === 'High' ? 'bg-red-100 text-red-700' : syncData.risk_level === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                {syncData.risk_level} Risk
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-8 col-span-2 border border-outline-variant/10">
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-4">Clinical Summary</p>
              <p className="text-on-surface leading-relaxed text-lg">{syncData.summary || "Comparison successfully completed."}</p>
              <p className="mt-4 text-sm text-on-surface-variant leading-relaxed">{syncData.explanation}</p>
            </div>
          </div>

          {/* Detected Changes */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-7 border border-outline-variant/10 space-y-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-600">Detected Discrepancies</p>
              <ul className="space-y-3">
                {syncData.differences?.length > 0 ? syncData.differences.map((diff, i) => (
                  <li key={i} className="flex gap-3 text-sm text-on-surface-variant">
                    <AlertCircle size={15} className="text-indigo-500 shrink-0 mt-0.5" />
                    <span>{diff}</span>
                  </li>
                )) : <li className="text-sm text-on-surface-variant/50 italic">No significant variance detected.</li>}
              </ul>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-7 border border-outline-variant/10 space-y-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-red-600">Pharmaceutical Conflicts</p>
              <ul className="space-y-3">
                {syncData.conflicts?.length > 0 ? syncData.conflicts.map((conf, i) => (
                  <li key={i} className="flex gap-3 text-sm text-on-surface-variant">
                    <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                    <span>{conf}</span>
                  </li>
                )) : <li className="text-sm text-on-surface-variant/50 italic">No contraindications detected.</li>}
              </ul>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-7 border border-outline-variant/10 space-y-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-amber-600">Suggested Tests</p>
              <ul className="space-y-3">
                {syncData.missing_tests?.length > 0 ? syncData.missing_tests.map((test, i) => (
                  <li key={i} className="flex gap-3 text-sm text-on-surface-variant">
                    <FileText size={15} className="text-amber-500 shrink-0 mt-0.5" />
                    <span>{test}</span>
                  </li>
                )) : <li className="text-sm text-on-surface-variant/50 italic">Coverage is sufficient.</li>}
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button onClick={() => { setSyncData(null); setSelected([null, null]); }} className="px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
              Reset
            </button>
            <button className="primary-gradient px-8 py-3 rounded-xl text-white font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all">
              Export Report (PDF)
            </button>
          </div>
        </div>
      )}

      {/* Footer Attestations */}
      <div className="flex justify-center gap-10 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.25em] py-6">
        <span className="flex items-center gap-2"><ShieldCheck size={14} /> Encrypted Sanctuary</span>
        <span className="flex items-center gap-2"><Activity size={14} /> Real-Time Analysis</span>
        <span className="flex items-center gap-2"><FileText size={14} /> HIPAA Compliant</span>
      </div>
    </div>
  );
}
