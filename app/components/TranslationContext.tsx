"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Language {
  code: string;
  name: string;
}

interface TranslationContextType {
  languages: Language[];
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  translateText: (text: string | null | undefined, targetLang?: string) => Promise<string | null | undefined>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguageState] = useState<string>("en"); // Default is English

  // Load languages and saved preference on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch("http://localhost:5000/languages");
        if (res.ok) {
          const data = await res.json();
          setLanguages(data);
        }
      } catch (err) {
        console.error("Failed to fetch LibreTranslate languages:", err);
      }
    };

    fetchLanguages();

    const savedLang = localStorage.getItem("preferredLanguage");
    if (savedLang) {
      setSelectedLanguageState(savedLang);
    }
  }, []);

  const setSelectedLanguage = (lang: string) => {
    setSelectedLanguageState(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  const translateText = async (text: string | null | undefined, targetLang?: string): Promise<string | null | undefined> => {
    if (!text) return text;
    const target = targetLang || selectedLanguage;
    if (target === "en") return text; // Assuming base text is English

    try {
      const res = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: target,
          format: "text",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.translatedText;
      }
    } catch (err) {
      console.error("Translation failed:", err);
    }
    return text; // Fallback to original
  };

  return (
    <TranslationContext.Provider value={{ languages, selectedLanguage, setSelectedLanguage, translateText }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
