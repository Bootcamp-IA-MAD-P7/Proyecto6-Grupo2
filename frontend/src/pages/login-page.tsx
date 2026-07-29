import { useEffect, useState } from "react"
import { Check, HeartHandshake } from "lucide-react"

import { LanguageSelector } from "@/components/layout/language-selector"
import { LoginForm } from "@/components/auth/login-form"
import { translations } from "@/i18n"
import type { LanguageCode } from "@/types/dashboard"

interface LoginPageProps {
  onContinue: () => void
}

export function LoginPage({ onContinue }: LoginPageProps) {
  const [language, setLanguage] = useState<LanguageCode>("en")
  const copy = translations[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const changeLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage)
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.04fr_0.96fr]">
      <section className="flex bg-sidebar px-6 py-7 text-sidebar-foreground sm:px-10 lg:min-h-screen lg:px-12 lg:py-9 xl:px-16">
        <div className="mx-auto flex w-full max-w-2xl flex-col">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-2xl bg-white/10">
                <HeartHandshake className="size-6" aria-hidden="true" />
              </span>
              <p className="text-xl font-semibold tracking-tight">
                {copy.login.brand.name}
              </p>
            </div>
            <LanguageSelector
              language={language}
              onChange={changeLanguage}
              translations={copy}
            />
          </div>

          <div className="pt-12 sm:pt-14 lg:pt-16">
            <p className="text-xs font-semibold tracking-[0.14em] text-sidebar-muted uppercase">
              {copy.login.brand.descriptor}
            </p>
            <p className="font-editorial mt-4 max-w-xl text-4xl leading-tight tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.4rem]">
              {copy.login.brand.tagline}
            </p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-sidebar-muted sm:text-base">
              {copy.login.brand.description}
            </p>

            <ul className="mt-7 hidden space-y-3 sm:block">
              {copy.login.brand.principles.map((principle) => (
                <li
                  key={principle}
                  className="flex items-center gap-3 text-sm text-sidebar-foreground"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {principle}
                </li>
              ))}
            </ul>

            <div className="mt-8 hidden max-w-xl border-t border-white/10 pt-6 sm:block lg:mt-10">
              <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-sidebar-muted uppercase">
                {copy.login.brand.platformPrinciplesTitle}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {copy.login.brand.platformPrinciples.map((principle) => (
                  <li
                    key={principle}
                    className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-sidebar-foreground"
                  >
                    {principle}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-start justify-center px-5 py-8 sm:px-10 lg:px-12 lg:pt-10 xl:pt-12">
        <div className="w-full max-w-md">
          <LoginForm translations={copy.login} onSuccess={onContinue} />
          <aside className="mt-4 rounded-xl border border-border bg-secondary/55 p-4">
            <p className="text-xs font-semibold text-foreground">
              {copy.login.trust.title}
            </p>
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
              {copy.login.trust.demoNotice}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {copy.login.trust.dataUse}
            </p>
          </aside>
        </div>
      </section>
    </main>
  )
}
