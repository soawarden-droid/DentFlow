import React, { createContext, useState } from "react";
import i18n from "../i18n/i18n";
import { isAppLanguage, type AppLanguage } from "../i18n/languages";

/* -----------------------------
   Context Type Definition
----------------------------- */
interface LanguageContextType {
  language: AppLanguage;                 // Current app language
  changeLanguage: (lang: AppLanguage) => void; // Function to switch language
}

/* -----------------------------
   Language Context with default values
   Used when no provider is present
----------------------------- */
export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  changeLanguage: () => {},
});

/* -----------------------------
   Detect language based on domain
   Fallback for first-time users if no language saved
----------------------------- */
function detectLanguageFromDomain(): AppLanguage {
  try {
    const hostname = window.location.hostname.toLowerCase();

    const domainLangMap: Record<string, AppLanguage> = {
      "ae.web.app": "ar",
      "us.web.app": "en",
    };

    for (const key in domainLangMap) {
      if (hostname.includes(key)) return domainLangMap[key];
    }

    return "en"; // Default fallback
  } catch {
    return "en"; // Default fallback in case of errors
  }
}

/* -----------------------------
   LanguageProvider Component
   Wraps the app to provide language state globally
----------------------------- */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize language from localStorage or domain detection
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const savedLanguage = localStorage.getItem("app-language");
    return isAppLanguage(savedLanguage)
      ? savedLanguage
      : detectLanguageFromDomain();
  });

  /* -----------------------------
     Switch language handler
     Updates state, localStorage, and i18n instance
  ----------------------------- */
  const changeLanguage = (lang: AppLanguage) => {
    setLanguage(lang);
    localStorage.setItem("app-language", lang);
    i18n.changeLanguage(lang);
  };

  /* -----------------------------
     Provide context values to all children
  ----------------------------- */
  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}