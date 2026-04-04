"use client";

import { useState, useRef, useEffect } from "react";
import { sendOTP, verifyOTP, loginWithGoogle } from "@/lib/auth";
import { Mail, ArrowRight, Loader2, KeyRound, RefreshCcw, ShieldAlert } from "lucide-react";

export default function AuthForm({ onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);

  // Timer logic for Resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e?.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid clinical ID (email).");
      return;
    }

    setLoading(true);
    setError(null);
    
    const { error: reqError } = await sendOTP(email);
    
    setLoading(false);
    
    if (reqError) {
      setError(reqError.message);
    } else {
      setStep(2);
      setCountdown(60); // 60s cooldown
      // Auto-focus the first OTP input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const handleVerifyOTP = async () => {
    const token = otp.join("");
    if (token.length !== 6) {
      setError("Please enter the full 6-digit synchronization code.");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: reqError } = await verifyOTP(email, token);
    
    setLoading(false);

    if (reqError) {
      setError(reqError.message);
    } else if (data?.session) {
      if (onLoginSuccess) onLoginSuccess(data.session);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "Enter" && index === 5) {
      handleVerifyOTP();
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    handleSendOTP(undefined);
  };

  return (
    <div className="space-y-6 relative">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium animate-fade-in">
          <ShieldAlert size={18} />
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-6 animate-fade-in relative">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-2">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-5 top-5 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-3xl py-5 pl-14 pr-6 text-on-surface focus:outline-none focus:border-primary/50 transition-all placeholder:text-outline/40 font-medium shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full primary-gradient text-white py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-primary/30"
           >
            {loading ? <Loader2 className="animate-spin" /> : <>
               {isLoginMode ? "Continue" : "Initialize New Sanctuary"} <ArrowRight size={20}/>
            </>}
          </button>

          <div className="flex items-center my-6 opacity-40">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="px-4 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Or authenticate via</span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          <button 
            type="button"
            onClick={async () => {
              setLoading(true);
              const { error } = await loginWithGoogle();
              if (error) {
                setError(error.message);
                setLoading(false);
              }
            }}
            disabled={loading}
            className="w-full bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 text-on-surface py-4 rounded-[24px] font-bold text-base flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin text-primary" size={20} /> : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                <path d="M1 1h22v22H1z" fill="none"></path>
              </svg>
            )}
            {loading ? "Routing to Google..." : "Continue with Google"}
          </button>

          <div className="text-center pt-2">
             <button 
               type="button"
               onClick={() => setIsLoginMode(!isLoginMode)}
               className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 hover:text-primary font-bold transition-colors"
             >
                {isLoginMode ? "New User? Create Clinical ID" : "Already Registered? Secure Login"}
             </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="p-6 bg-primary/5 border border-primary/10 rounded-[32px] text-center space-y-3">
             <KeyRound className="mx-auto text-primary opacity-30" size={32} />
             <p className="text-on-surface-variant/60 font-medium text-sm">A 6-digit synchronization code has been dispatched to:</p>
             <div className="font-bold text-primary tracking-wider">
               {email}
             </div>
             <button onClick={() => setStep(1)} className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 hover:text-primary font-bold transition-colors">Change Designation</button>
          </div>

          <div className="flex justify-between gap-2 max-w-sm mx-auto">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="w-14 h-16 text-center text-2xl font-bold bg-surface-container-lowest border border-outline-variant/50 rounded-2xl text-on-surface focus:outline-none focus:border-primary/50 transition-all shadow-sm"
              />
            ))}
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full primary-gradient text-white py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-primary/30"
             >
              {loading ? <Loader2 className="animate-spin" /> : <>Verify Identity <ArrowRight size={20}/></>}
            </button>
            
            <button 
              onClick={handleResend}
              disabled={countdown > 0 || loading}
              className={`w-full flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest transition-colors ${countdown > 0 ? "text-on-surface-variant/20" : "text-on-surface-variant/40 hover:text-primary"}`}
            >
              <RefreshCcw size={14} className={loading && countdown === 0 ? "animate-spin" : ""} /> 
              {countdown > 0 ? `Resend Dispatch in ${countdown}s` : "Resend Dispatch"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
