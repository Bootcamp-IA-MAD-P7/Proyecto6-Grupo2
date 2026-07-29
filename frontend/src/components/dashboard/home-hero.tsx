import type { DashboardTranslations } from "@/types/dashboard"

interface HomeHeroProps {
  translations: DashboardTranslations
}

export function HomeHero({ translations }: HomeHeroProps) {
  return (
    <header className="hero-enter border-b border-border pb-16 pt-6 sm:pb-20">
      <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
        {translations.hero.eyebrow}
      </p>
      <h1 className="font-editorial mt-8 text-6xl leading-[0.98] font-normal tracking-[-0.055em] text-foreground sm:text-7xl xl:text-[5.5rem]">
        {translations.hero.greeting}
      </h1>
      <p className="mt-8 text-xl leading-8 text-muted-foreground sm:text-2xl">
        {translations.hero.subtitle}
      </p>
      <p className="mt-10 text-sm leading-6 text-foreground">
        {translations.hero.context}
      </p>
    </header>
  )
}
