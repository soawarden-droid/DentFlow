import { useEffect, useContext } from "react";
import { useParams, Outlet, Navigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { FontContext } from "../context/FontContext";
import {
  APP_LANGUAGES,
  isAppLanguage,
  isRightToLeftLanguage,
  type AppLanguage,
} from "../i18n/languages";

/**
 * Map each language to its default font family
 */
const fonts: Record<AppLanguage, string> = {
  ar: "'Cairo', sans-serif",
  en: "'Inter', sans-serif",
  prs: "'Noto Sans Arabic', sans-serif",
};

/**
 * LanguageHandler
 * Handles dynamic language changes for routes.
 * Responsibilities:
 * - Validate route language
 * - Update i18n and context language
 * - Persist language in localStorage
 * - Update font family based on language
 * - Set HTML dir and lang attributes for accessibility & RTL support
 * - Redirect invalid routes to last saved language
 */
export default function LanguageHandler() {
  const { lang } = useParams<{ lang: AppLanguage }>();

  const { changeLanguage } = useContext(LanguageContext);
  const { setFontFamily } = useContext(FontContext);

  // Check if the language in route is valid
  const currentLang =
    APP_LANGUAGES.find((supportedLanguage) => supportedLanguage === lang) ??
    null;
  const isValidLang = currentLang !== null;

  /**
   * Effect: run whenever the route language changes
   */
  useEffect(() => {
    if (!currentLang) return;

    // Update language in context/i18n
    changeLanguage(currentLang);

    // Persist language for future visits
    localStorage.setItem("app_language", currentLang);

    // Update font for the selected language
    setFontFamily(fonts[currentLang]);

    // Update HTML attributes: dir (for RTL/LTR) and lang (accessibility)
    document.documentElement.dir = isRightToLeftLanguage(currentLang) ? "rtl" : "ltr";
    document.documentElement.lang = currentLang === "prs" ? "prs-AF" : currentLang;
  }, [currentLang, changeLanguage, setFontFamily]);

  /**
   * Smart redirect if the route language is invalid
   * - Redirects to last saved language or default "en"
   */
  if (!isValidLang) {
    const savedLang = localStorage.getItem("app_language");
    const redirectLang = isAppLanguage(savedLang) ? savedLang : "en";

    return <Navigate to={`/${redirectLang}`} replace />;
  }

  // Render child routes
  return <Outlet />;
}