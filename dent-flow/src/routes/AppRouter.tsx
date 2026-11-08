import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAutoPageTitle from "../hooks/useAutoPageTitle";
import LanguageHandler from "./LanguageHandler";
import Dashboard from "../pages/Dashboard/Dashboard";
import { isAppLanguage, type AppLanguage } from "../i18n/languages";

/**
 * AppRouter
 * Main SPA router that handles:
 * - Language-based routing (/:lang)
 * - Automatic page title updates
 * - Smart fallback for unknown routes
 */
export default function AppRouter() {
  // Get saved language from localStorage or detect browser language
  const savedLang = localStorage.getItem("app_language");
  const browserLang = navigator.language.toLowerCase();
  const detectedLang: AppLanguage =
    browserLang === "ar" || browserLang.startsWith("ar-")
      ? "ar"
      : browserLang === "prs" ||
          browserLang.startsWith("prs-") ||
          browserLang === "fa-af"
        ? "prs"
        : "en";

  // Determine initial language for routing fallback
  const initialLang = isAppLanguage(savedLang) ? savedLang : detectedLang;

  return (
    <BrowserRouter>
      {/* Automatically manage document.title globally */}
      <TitleManager />

      <Routes>
        {/* Language-based routing */}
        <Route path=":lang" element={<LanguageHandler />}>
          {/* Default route under language */}
          <Route index element={<Dashboard />} />
        </Route>

        {/* Fallback: redirect unknown paths to initial language */}
        <Route
          path="*"
          element={<Navigate to={`/${initialLang}`} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * TitleManager
 * Uses a custom hook to update document.title automatically.
 * Placed globally so all routes inherit page title management.
 */
function TitleManager() {
  useAutoPageTitle({});
  return null;
}