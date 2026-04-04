"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto
              flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border 
              animate-fade-in min-w-[320px] backdrop-blur-md
              ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 
                toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600' : 
                'bg-blue-500/10 border-blue-500/20 text-blue-600'}
            `}
          >
            <div>
              {toast.type === 'success' && <CheckCircle2 size={24} />}
              {toast.type === 'error' && <AlertCircle size={24} />}
              {toast.type === 'info' && <Info size={24} />}
            </div>
            <p className="flex-1 font-bold text-sm tracking-tight">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
