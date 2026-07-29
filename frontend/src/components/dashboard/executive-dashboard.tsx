import { useCallback, useEffect, useState } from "react"

import { AssociatedFactorsSection } from "@/components/dashboard/associated-factors-section"
import { DashboardStateView } from "@/components/dashboard/dashboard-state-view"
import { ExecutiveInsightSection } from "@/components/dashboard/executive-insight-section"
import { HomeHero } from "@/components/dashboard/home-hero"
import { MethodologySection } from "@/components/dashboard/methodology-section"
import { RecommendedActionsSection } from "@/components/dashboard/recommended-actions-section"
import { SegmentExplorationSection } from "@/components/dashboard/segment-exploration-section"
import { WorkforceOutlookSection } from "@/components/dashboard/workforce-outlook-section"
import { AppShell } from "@/components/layout/app-shell"
import { Reveal } from "@/components/ui/reveal"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { translations } from "@/i18n"
import { getDashboardOverview } from "@/services/dashboard-service"
import type {
  DashboardOverview,
  DashboardState,
  LanguageCode,
  SegmentDimension,
} from "@/types/dashboard"

const LANGUAGE_STORAGE_KEY = "talentcare-language"

function getInitialLanguage(): LanguageCode {
  const persisted = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return persisted === "es" ? "es" : "en"
}

export function ExecutiveDashboard() {
  const [language, setLanguage] =
    useState<LanguageCode>(getInitialLanguage)
  const [state, setState] = useState<DashboardState>("loading")
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [activeDimension, setActiveDimension] =
    useState<SegmentDimension>("experience")
  const reducedMotion = useReducedMotion()
  const copy = translations[language]

  const loadDashboard = useCallback(async (): Promise<void> => {
    setState("loading")
    try {
      const response = await getDashboardOverview()
      setOverview(response)
      setState(response ? "success" : "empty")
    } catch {
      setOverview(null)
      setState("error")
    }
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const changeLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage)
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    document.documentElement.lang = nextLanguage
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    })
  }

  const exploreExperience = () => {
    setActiveDimension("experience")
    window.requestAnimationFrame(() => scrollTo("segment-exploration"))
  }

  if (state !== "success" || !overview) {
    return (
      <DashboardStateView
        state={state === "success" ? "empty" : state}
        translations={copy}
        onRetry={() => void loadDashboard()}
      />
    )
  }

  return (
    <AppShell
      language={language}
      onLanguageChange={changeLanguage}
      profile={overview.profile}
      translations={copy}
    >
      <main id="home" className="px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[1180px]">
          <HomeHero translations={copy} />

          <Reveal className="mt-24 sm:mt-32">
            <ExecutiveInsightSection
              insight={overview.executiveInsight}
              language={language}
              translations={copy}
              onExplore={exploreExperience}
            />
          </Reveal>

          <Reveal className="mt-24 sm:mt-32">
            <WorkforceOutlookSection
              metrics={overview.metrics}
              language={language}
              translations={copy}
            />
          </Reveal>

          <Reveal className="mt-24 sm:mt-32">
            <SegmentExplorationSection
              dimensions={overview.segmentDimensions}
              language={language}
              activeDimension={activeDimension}
              onDimensionChange={setActiveDimension}
              translations={copy}
            />
          </Reveal>

          <Reveal className="mt-24 sm:mt-32">
            <AssociatedFactorsSection
              factors={overview.factors}
              translations={copy}
            />
          </Reveal>

          <Reveal className="mt-24 sm:mt-32">
            <RecommendedActionsSection
              actions={overview.actions}
              translations={copy}
              onExplore={exploreExperience}
              onReviewContext={() => scrollTo("associated-factors")}
            />
          </Reveal>

          <Reveal className="mt-24 pb-12 sm:mt-32">
            <MethodologySection
              items={overview.methodology}
              translations={copy}
            />
          </Reveal>
        </div>
      </main>
    </AppShell>
  )
}
