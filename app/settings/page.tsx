"use client";

import { useState } from "react";
import { 
  User, Shield, Bell, HardDrive, 
  Fingerprint, Save, CheckCircle, 
  LogOut, ShieldCheck, AlertCircle
} from "lucide-react";
import { logout } from "@/lib/auth";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    {
      title: "Clinician Profile",
      icon: User,
      desc: "Manage your official medical credentials and digital identity.",
      fields: [
        { label: "Full Name", value: "Dr. Alexander Sterling", type: "text" },
        { label: "Medical License ID", value: "MED-9022-AF-2024", type: "text" },
        { label: "Specialization", value: "Neural Diagnostics & Hematology", type: "text" },
        { label: "Clinical Institution", value: "MedAI Clinical Network", type: "text" },
      ],
    },
    {
      title: "Security & Compliance",
      icon: Shield,
      desc: "HIPAA-compliant multi-layer authentication and session controls.",
      fields: [
        { label: "Two-Factor Authentication", value: "Enabled", type: "status" },
        { label: "Biometric Neural Sync", value: "Active", type: "status" },
        { label: "Session Timeout", value: "30 Minutes", type: "select" },
        { label: "Encryption Standard", value: "AES-256 (Supabase)", type: "readonly" },
      ],
    },
    {
      title: "Data Retention",
      icon: HardDrive,
      desc: "Control how long diagnostic logs are retained in the clinical sanctuary.",
      fields: [
        { label: "Auto-Archive Duration", value: "90 Days", type: "select" },
        { label: "Encrypted Backup", value: "Daily at 02:00 AM", type: "readonly" },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">

      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <Fingerprint size={20} />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Account Configuration</span>
          </div>
          <h1 className="text-4xl font-manrope font-bold tracking-tight text-on-surface">Clinical Settings</h1>
          <p className="text-on-surface-variant">Configure your Digital Sanctuary environment and security protocols.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
            saved ? "bg-green-600 text-white shadow-green-600/20" : "primary-gradient text-white shadow-primary/20 hover:shadow-primary/30"
          }`}
        >
          {saved ? <CheckCircle size={18} className="animate-bounce" /> : <Save size={18} />}
          {saved ? "Configuration Saved" : "Save Configuration"}
        </button>
      </div>

      {/* HIPAA Badge */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center gap-3">
        <ShieldCheck className="text-primary shrink-0" size={18} />
        <p className="text-sm text-on-surface-variant font-medium">
          <span className="font-bold text-on-surface">HIPAA Compliant</span> — All configuration changes are audit-logged. Session data is encrypted at rest and in flight.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
            <div className="px-8 py-5 bg-surface-container-low flex items-start gap-5">
              <div className="h-12 w-12 primary-gradient rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-primary/20">
                <section.icon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">{section.title}</h3>
                <p className="text-sm text-on-surface-variant">{section.desc}</p>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.fields.map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                    {field.label}
                  </label>
                  <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-5 py-4 border border-outline-variant/20">
                    {field.type === "text" ? (
                      <input
                        defaultValue={field.value}
                        className="bg-transparent w-full text-on-surface font-semibold text-sm focus:outline-none placeholder:text-outline/40"
                      />
                    ) : (
                      <span className="text-on-surface font-semibold text-sm">{field.value}</span>
                    )}
                    {field.type === "status" && (
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <span className="text-[10px] font-bold uppercase text-green-600">Active</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Notifications Toggle */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
          <div className="px-8 py-5 bg-surface-container-low flex items-start gap-5">
            <div className="h-12 w-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center shrink-0">
              <Bell size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Notifications</h3>
              <p className="text-sm text-on-surface-variant">Manage alerts for analysis completions and clinical updates.</p>
            </div>
          </div>
          <div className="p-8 flex items-center justify-between">
            <div>
              <p className="font-semibold text-on-surface text-sm">Email Notifications</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Receive updates when a new report is processed or compared.</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative h-7 w-13 rounded-full transition-colors ${notifications ? "bg-primary" : "bg-outline-variant/40"}`}
              style={{ width: 52 }}
            >
              <span className={`absolute top-1 h-5 w-5 bg-white rounded-full shadow transition-all ${notifications ? "left-7" : "left-1"}`} />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
              <AlertCircle size={22} />
            </div>
            <div>
              <h4 className="font-bold text-red-700">Terminate Clinical Session</h4>
              <p className="text-xs text-red-500 font-medium mt-0.5 uppercase tracking-wider">Danger Zone — Disconnect from MedAI Network</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-md shadow-red-600/20"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
