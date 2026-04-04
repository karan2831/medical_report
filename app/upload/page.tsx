"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/api";
import {
  Upload,
  FileText,
  Loader2,
  X,
  CheckCircle2,
  ShieldCheck,
  CloudLightning,
  Sparkles,
  AlertCircle,
  Lock,
  Cpu,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ToastContext";

const STEPS = [
  { icon: Lock, label: "AES-256 Encrypted Storage", desc: "Document is securely uploaded to your isolated clinical storage bucket." },
  { icon: Cpu, label: "Neural Extraction Engine", desc: "GPT-4o extracts ICD-10 codes, symptoms, vitals, and medications." },
  { icon: BarChart3, label: "Insight Generation", desc: "Findings are cross-referenced with your history and similar cases." },
];

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setExtractionStatus("Securing connection to Neural Engine...");
    try {
      setExtractionStatus("Uploading to encrypted clinical storage...");
      const data = await uploadFile(file);
      setExtractionStatus("Identifying clinical tokens & symptoms...");
      addToast("Analysis complete. Medical intelligence synchronized.", "success");
      router.push(`/insights?id=${data.id}`);
    } catch (err) {
      setExtractionStatus("");
      addToast("Sanctuary Error: " + err.message, "error");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Clinical Safety Banner */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
          <span className="font-bold uppercase">Clinical Disclaimer — </span>
          AI extraction is a support tool only. All findings must be reviewed by a qualified medical professional. Do not use for urgent clinical decisions.
        </p>
      </div>

      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-primary">
          <Sparkles size={18} className="animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">AI Nexus Core Active</span>
        </div>
        <h1 className="text-5xl font-manrope font-bold tracking-tight text-on-surface">Upload Clinical Document</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Scan medical reports, imaging logs, or hematology results for real-time AI extraction and diagnostic mapping.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Drop Zone */}
        <div className="lg:col-span-2">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative min-h-[380px] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-12 text-center ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 hover:bg-primary/3"
            }`}
          >
            {file ? (
              <div className="animate-fade-in space-y-6 w-full max-w-sm mx-auto">
                <div className="h-20 w-20 primary-gradient rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                  <FileText className="text-white" size={36} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-on-surface">{file.name}</h4>
                  <p className="text-on-surface-variant text-sm mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB · Ready for ingestion</p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setFile(null)}
                    className="p-3 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
                  >
                    <X size={20} />
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="primary-gradient px-8 py-3.5 text-white rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-60 min-w-[220px] justify-center"
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Loader2 className="animate-spin" size={18} /> Ingesting...
                        </div>
                        <span className="text-[10px] text-white/70 animate-pulse">{extractionStatus}</span>
                      </div>
                    ) : (
                      <><CloudLightning size={18} /> Start AI Analysis</>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer space-y-5 flex flex-col items-center group">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="h-20 w-20 bg-surface-container rounded-2xl flex items-center justify-center group-hover:primary-gradient group-hover:scale-105 transition-all duration-300">
                  <Upload className="text-on-surface-variant group-hover:text-white transition-colors" size={36} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-on-surface">Drop clinical scans here</h4>
                  <p className="text-on-surface-variant text-sm mt-1">PDF, PNG, JPEG supported · Max 5MB</p>
                </div>
                <span className="px-6 py-3 bg-primary/10 text-primary rounded-xl text-sm font-bold group-hover:bg-primary group-hover:text-white transition-all">
                  Browse Local Storage
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-5">

          {/* Ingestion Protocol */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
            <div className="px-6 py-4 bg-surface-container-low">
              <h5 className="font-bold text-on-surface text-sm">Ingestion Protocol</h5>
            </div>
            <div className="p-5 space-y-5">
              {STEPS.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <step.icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{step.label}</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HIPAA Badge */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
            <ShieldCheck className="text-green-600 shrink-0" size={20} />
            <div>
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider">HIPAA Validated</p>
              <p className="text-xs text-green-600/80 mt-0.5">Encrypted transport · Isolated storage · Audit-logged</p>
            </div>
          </div>

          {/* Accepted Formats */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5 space-y-3">
            <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">Accepted Formats</p>
            {[["PDF", "Medical reports, discharge summaries"], ["PNG / JPEG", "Clinical imaging, lab result scans"]].map(([fmt, desc]) => (
              <div key={fmt} className="flex items-start gap-3">
                <div className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold shrink-0">{fmt}</div>
                <p className="text-xs text-on-surface-variant">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
