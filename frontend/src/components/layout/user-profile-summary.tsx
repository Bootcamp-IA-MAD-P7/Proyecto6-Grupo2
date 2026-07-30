import { LogOut } from "lucide-react"

import type { DashboardTranslations, UserProfile } from "@/types/dashboard"

interface UserProfileSummaryProps {
  profile: UserProfile
  translations: DashboardTranslations
  onLogout: () => void
}

export function UserProfileSummary({
  profile,
  translations,
  onLogout,
}: UserProfileSummaryProps) {
  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-3"
        aria-label={translations.profile.label}
      >
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white/12 text-xs font-semibold text-white">
          {profile.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{profile.name}</p>
          <p className="truncate text-xs text-sidebar-muted">
            {translations.profile.role}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-sidebar-muted transition-colors hover:bg-white/10 hover:text-white"
      >
        <LogOut className="size-4" aria-hidden="true" />
        {translations.profile.logout}
      </button>
    </div>
  )
}
