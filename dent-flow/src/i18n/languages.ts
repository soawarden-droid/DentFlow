export const APP_LANGUAGES = ["en", "ar", "prs"] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export function isAppLanguage(language: string | null): language is AppLanguage {
  return APP_LANGUAGES.some((supportedLanguage) => supportedLanguage === language);
}

export function isRightToLeftLanguage(language: string | null | undefined) {
  return language === "ar" || language === "prs";
}
