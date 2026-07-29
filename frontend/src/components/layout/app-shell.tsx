import { useState, type ReactNode } from "react"
import { Menu } from "lucide-react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { Button } from "@/components/ui/button"
import type {
  DashboardTranslations,
  LanguageCode,
  UserProfile,
} from "@/types/dashboard"

interface AppShellProps {
  children: ReactNode
  language: LanguageCode
  onLanguageChange: (language: LanguageCode) => void
  profile: UserProfile
  translations: DashboardTranslations
}

export function AppShell({
  children,
  language,
  onLanguageChange,
  profile,
  translations,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        language={language}
        onLanguageChange={onLanguageChange}
        profile={profile}
        translations={translations}
      />
      <div className="min-h-screen lg:pl-72">
        <div className="flex h-16 items-center border-b border-border px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label={translations.navigation.openMenu}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <span className="ml-2 text-sm font-semibold">TalentCare</span>
        </div>
        {children}
      </div>
    </div>
  )
}
