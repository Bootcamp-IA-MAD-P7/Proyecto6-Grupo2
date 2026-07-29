import type { DashboardTranslations, UserProfile } from "@/types/dashboard"

interface UserProfileSummaryProps {
  profile: UserProfile
  translations: DashboardTranslations
}

export function UserProfileSummary({
  profile,
  translations,
}: UserProfileSummaryProps) {
  return (
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
  )
}
