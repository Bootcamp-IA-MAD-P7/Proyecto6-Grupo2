import { cn } from "@/lib/utils"
import type { DashboardTranslations, LanguageCode } from "@/types/dashboard"

interface LanguageSelectorProps {
  language: LanguageCode
  onChange: (language: LanguageCode) => void
  translations: DashboardTranslations
}

export function LanguageSelector({
  language,
  onChange,
  translations,
}: LanguageSelectorProps) {
  return (
    <div>
      <p className="mb-2 text-[0.6875rem] font-semibold tracking-[0.12em] text-sidebar-muted uppercase">
        {translations.language.label}
      </p>
      <div className="inline-flex rounded-lg bg-white/8 p-1">
        {(["en", "es"] as const).map((code) => (
          <button
            key={code}
            type="button"
            aria-pressed={language === code}
            aria-label={
              code === "en"
                ? translations.language.english
                : translations.language.spanish
            }
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              language === code
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-muted hover:text-white",
            )}
            onClick={() => onChange(code)}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
