"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Archive,
  FileText,
  Search,
  ChevronRight,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Upload,
} from "lucide-react";
import { useToast } from "@/app/components/ToastContext";

function RiskChip({ level }) {
  const config = {
    Low:      "bg-green-100 text-green-700 border-green-200",
    Medium:   "bg-amber-100 text-amber-700 border-amber-200",
    High:     "bg-red-100 text-red-700 border-red-200",
    Critical: "bg-red-200 text-red-800 border-red-300",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config[level] || config.Low}`}>
      {level}
    </span>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      if (data.success) {
        setReports(data.reports || []);
      } else {
        throw new Error(data.error || "Failed to load reports");
      }
    } catch (err) {
      addToast("Archive Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = reports.filter((r) => {
    const disease = r.extracted_data?.[0]?.disease || "";
    const id = r.id || "";
    return (
      disease.toLowerCase().includes(search.toLowerCase()) ||
      id.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-10 max-w-5xl mx-auto">

      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <Archive size={20} />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Clinical Records</span>
          </div>
          <h1 className="text-5xl font-manrope font-bold tracking-tight text-on-surface">Archives</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Your complete diagnostic history. Every report, every insight, every analysis.
          </p>
        </div>
        <Link
          href="/upload"
          className="primary-gradient px-7 py-4 rounded-xl text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Upload size={18} /> New Analysis
        </Link>
      </div>

      {/* Stats Row */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 text-center">
            <p className="text-3xl font-black font-manrope text-on-surface">{reports.length}</p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60 mt-1">Total Reports</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 text-center">
            <p className="text-3xl font-black font-manrope text-red-600">
              {reports.filter(r => r.extracted_data?.[0]?.risk_level === "High" || r.extracted_data?.[0]?.risk_level === "Critical").length}
            </p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60 mt-1">High Risk</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 text-center">
            <p className="text-3xl font-black font-manrope text-green-600">
              {reports.filter(r => r.extracted_data?.[0]?.risk_level === "Low").length}
            </p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60 mt-1">Low Risk</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by diagnosis or report ID..."
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-4 pl-13 pr-6 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-outline/50 font-medium"
          style={{ paddingLeft: "3rem" }}
        />
      </div>

      {/* Report List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-on-surface-variant font-medium">Loading clinical archives...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-5 border-2 border-dashed border-outline-variant/30 rounded-2xl">
          <Archive className="text-on-surface-variant/20" size={64} />
          {search ? (
            <>
              <p className="text-xl font-bold text-on-surface">No results for &ldquo;{search}&rdquo;</p>
              <p className="text-on-surface-variant text-sm">Try a different diagnosis name or report ID.</p>
            </>
          ) : (
            <>
              <p className="text-xl font-bold text-on-surface">No clinical records yet</p>
              <p className="text-on-surface-variant text-sm">Upload your first medical report to begin your diagnostic archive.</p>
              <Link href="/upload" className="primary-gradient px-7 py-3 rounded-xl text-white font-bold shadow-md shadow-primary/20 flex items-center gap-2">
                <Upload size={16} /> Upload First Report
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
          <div className="px-8 py-4 bg-surface-container-low grid grid-cols-12 gap-4">
            <span className="col-span-5 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">Diagnosis</span>
            <span className="col-span-3 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">Report ID</span>
            <span className="col-span-2 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">Risk</span>
            <span className="col-span-2 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">Date</span>
          </div>

          <div className="divide-y divide-outline-variant/10">
            {filtered.map((report) => {
              const ext = report.extracted_data?.[0] || {};
              return (
                <Link
                  key={report.id}
                  href={`/insights?id=${report.id}`}
                  className="grid grid-cols-12 gap-4 px-8 py-5 hover:bg-surface-container-low/60 transition-all group items-center"
                >
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="h-10 w-10 primary-gradient rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
                      <FileText className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface group-hover:text-primary transition-colors text-sm">
                        {ext.disease || "Processing..."}
                      </p>
                      <p className="text-xs text-on-surface-variant/60 truncate max-w-xs">{ext.summary?.slice(0, 60) || "—"}</p>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="font-mono text-xs text-on-surface-variant font-medium">{report.id?.slice(0, 12).toUpperCase()}...</p>
                  </div>
                  <div className="col-span-2">
                    <RiskChip level={ext.risk_level || "Low"} />
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <p className="text-xs text-on-surface-variant">
                      {new Date(report.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <ChevronRight size={16} className="text-on-surface-variant/30 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
