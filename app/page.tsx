"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Microscope,
  ArrowUpRight,
  FlaskConical,
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";

function RiskPill({ level }) {
  const styles = {
    Low:      "bg-green-100 text-green-700 border-green-200",
    Medium:   "bg-amber-100 text-amber-700 border-amber-200",
    High:     "bg-red-100 text-red-700 border-red-200",
    Critical: "bg-red-200 text-red-900 border-red-300",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[level] || styles.Low}`}>
      {level}
    </span>
  );
}

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      if (data.success) setReports(data.reports || []);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalReports = reports.length;
  const extractions = reports.filter(r => r.extracted_data?.length > 0).length;
  const criticalCount = reports.filter(r => ["High", "Critical"].includes(r.extracted_data?.[0]?.risk_level)).length;
  const avgRisk = totalReports > 0
    ? Math.round(reports.reduce((acc, r) => acc + (r.extracted_data?.[0]?.risk_score || 0), 0) / totalReports)
    : 0;

  const metricCards = [
    { label: "Total Reports", value: totalReports, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "AI Extractions", value: extractions, icon: Microscope, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Critical Alerts", value: criticalCount, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Avg Risk Score", value: `${avgRisk}/100`, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const filtered = reports.filter(r => {
    const q = searchQuery.toLowerCase();
    return r.id.toLowerCase().includes(q) || r.extracted_data?.[0]?.disease?.toLowerCase().includes(q);
  });

  const highRiskReports = reports.filter(r => ["High", "Critical"].includes(r.extracted_data?.[0]?.risk_level));

  return (
    <div className="space-y-10">

      {/* Clinical Safety Banner */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
          <span className="font-bold uppercase">Clinical Disclaimer — </span>
          MedAI provides diagnostic analysis support only. Results are not a substitute for professional medical judgment, direct examination, or laboratory confirmation.
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-2">Clinical Intelligence Portal</p>
          <h1 className="text-4xl font-manrope font-bold tracking-tight text-on-surface">Welcome, Clinician</h1>
          <p className="text-on-surface-variant mt-1">
            Neural Engine has analyzed <span className="font-bold text-on-surface">{totalReports}</span> clinical records.
          </p>
        </div>
        <Link
          href="/upload"
          className="primary-gradient flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] group shrink-0"
        >
          New Analysis <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((m) => (
          <div key={m.label} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 hover:shadow-md transition-all group">
            <div className={`h-12 w-12 ${m.bg} ${m.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
              <m.icon size={24} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">{m.label}</p>
            <p className="text-3xl font-black font-manrope text-on-surface">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/upload", icon: FileText, label: "Upload Report", desc: "Ingest a new clinical document for AI extraction" },
          { href: "/lab", icon: FlaskConical, label: "Lab Analyzer", desc: "Analyze numerical lab metrics for metabolic insights" },
          { href: "/compare", icon: Activity, label: "Compare Diagnoses", desc: "Run a longitudinal differential analysis" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 flex items-center gap-4 hover:border-primary/30 hover:bg-primary/3 transition-all group"
          >
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:primary-gradient group-hover:text-white transition-all">
              <action.icon size={22} />
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{action.label}</p>
              <p className="text-xs text-on-surface-variant/70 mt-0.5">{action.desc}</p>
            </div>
            <ChevronRight size={16} className="text-on-surface-variant/30 group-hover:text-primary ml-auto shrink-0 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Feed + Alerts */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Recent Activity
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={14} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-52 placeholder:text-outline/50"
              />
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-primary" size={28} />
                <p className="text-sm text-on-surface-variant">Loading clinical records...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3 text-center px-8">
                <FileText className="text-on-surface-variant/20" size={48} />
                <p className="text-on-surface-variant font-medium">
                  {searchQuery ? `No records matching "${searchQuery}"` : "No clinical records yet. Upload your first report."}
                </p>
                {!searchQuery && (
                  <Link href="/upload" className="text-primary font-bold text-sm hover:underline mt-1">
                    Upload Report →
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/10">
                {filtered.map((report) => {
                  const ext = report.extracted_data?.[0];
                  return (
                    <Link
                      key={report.id}
                      href={`/insights?id=${report.id}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low/60 transition-all group"
                    >
                      <div className="h-11 w-11 primary-gradient rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm shadow-primary/20">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">
                            {ext?.disease || "Processing..."}
                          </p>
                          {ext?.risk_level && <RiskPill level={ext.risk_level} />}
                        </div>
                        <p className="text-xs text-on-surface-variant/60 mt-0.5">
                          #{report.id.slice(0, 8).toUpperCase()} · {new Date(report.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-on-surface-variant/30 group-hover:text-primary shrink-0 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {reports.length > 0 && (
            <div className="text-right">
              <Link href="/reports" className="text-primary text-sm font-bold hover:underline">
                View all in Archives →
              </Link>
            </div>
          )}
        </div>

        {/* Critical Alerts Sidebar */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Activity size={18} className="text-red-500" /> Critical Alerts
          </h3>

          {highRiskReports.length > 0 ? (
            <div className="space-y-3">
              {highRiskReports.slice(0, 4).map(r => (
                <Link
                  key={r.id}
                  href={`/insights?id=${r.id}`}
                  className="block bg-red-50 border border-red-200 rounded-2xl p-5 relative overflow-hidden hover:border-red-400 transition-all group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-2xl" />
                  <div className="pl-2">
                    <p className="font-bold text-red-700 text-sm group-hover:text-red-800 transition-colors">
                      {r.extracted_data?.[0]?.disease || "Unknown Pathology"}
                    </p>
                    <p className="text-xs text-red-500/80 mt-1 line-clamp-2 leading-relaxed">
                      {r.extracted_data?.[0]?.summary || "Immediate clinical review advised."}
                    </p>
                    <p className="text-[10px] text-red-400 font-bold mt-2 uppercase tracking-wider">
                      Risk Score: {r.extracted_data?.[0]?.risk_score}/100
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-2">
              <CheckCircle2 className="mx-auto text-green-500" size={32} />
              <p className="text-sm text-green-700 font-medium">All records within safe clinical parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
