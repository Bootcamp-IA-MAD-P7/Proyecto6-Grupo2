import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  HeartHandshake,
  LayoutDashboard,
  UsersRound,
  X,
} from "lucide-react"

import { LanguageSelector } from "@/components/layout/language-selector"
import { UserProfileSummary } from "@/components/layout/user-profile-summary"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type {
  DashboardTranslations,
  LanguageCode,
  UserProfile,
} from "@/types/dashboard"

interface AppSidebarProps {
  open: boolean
  onClose: () => void
  language: LanguageCode
  onLanguageChange: (language: LanguageCode) => void
  profile: UserProfile
  translations: DashboardTranslations
}

export function AppSidebar({
  open,
  onClose,
  language,
  onLanguageChange,
  profile,
  translations,
}: AppSidebarProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    onClose()
  }

  const assessmentActive = window.location.hash === "#assessment"

  const navigation = [
    {
      id: "overview",
      label: translations.navigation.overview,
      icon: LayoutDashboard,
      active: !assessmentActive,
      available: true,
    },
    {
      id: "assessment",
      label: translations.navigation.assessment,
      icon: ClipboardCheck,
      active: assessmentActive,
      available: true,
    },
    {
      id: "people",
      label: translations.navigation.people,
      icon: UsersRound,
      active: false,
      available: false,
    },
    {
      id: "insights",
      label: translations.navigation.insights,
      icon: BarChart3,
      active: false,
      available: false,
    },
    {
      id: "methodology",
      label: translations.navigation.methodology,
      icon: BookOpen,
      active: false,
      available: true,
    },
  ]

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          aria-label={translations.navigation.closeMenu}
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-24 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/10">
              <HeartHandshake className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-semibold tracking-tight">TalentCare</p>
              <p className="mt-0.5 text-[0.625rem] font-semibold tracking-[0.14em] text-sidebar-muted">
                {translations.navigation.productCategory}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-muted hover:bg-white/10 hover:text-white lg:hidden"
            aria-label={translations.navigation.closeMenu}
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav
          className="flex-1 px-4 py-8"
          aria-label={translations.navigation.mainLabel}
        >
          <ul className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={!item.available}
                    aria-current={item.active ? "page" : undefined}
                    title={
                      item.available ? undefined : translations.common.comingSoon
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                      item.active
                        ? "bg-white/10 font-medium text-white"
                        : item.available
                          ? "text-sidebar-muted hover:bg-white/6 hover:text-white"
                          : "cursor-not-allowed text-sidebar-muted/55",
                    )}
                    onClick={() => {
                      if (item.id === "assessment") {
                        window.location.hash = "assessment"
                        onClose()
                        return
                      }

                      if (assessmentActive) {
                        window.location.hash =
                          item.id === "overview" ? "home" : item.id
                        onClose()
                        return
                      }

                      scrollTo(item.id === "overview" ? "home" : item.id)
                    }}
                  >
                    <Icon className="size-4.5" aria-hidden="true" />
                    <span>{item.label}</span>
                    {!item.available && (
                      <span className="ml-auto text-[0.625rem] uppercase">
                        {translations.common.comingSoon}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="space-y-6 border-t border-white/10 p-6">
          <LanguageSelector
            language={language}
            onChange={onLanguageChange}
            translations={translations}
          />
          <UserProfileSummary
            profile={profile}
            translations={translations}
          />
          <p className="text-[0.6875rem] leading-5 text-sidebar-muted">
            {translations.legal.copyright}
            <br />
            {translations.legal.rights}
          </p>
        </div>
      </aside>
    </>
  )
}
