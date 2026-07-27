import {
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
  type LucideIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { DashboardKpi, KpiId } from "@/types/dashboard"

const iconMap: Record<KpiId, LucideIcon> = {
  employees: UsersRound,
  low: ShieldCheck,
  high: ShieldAlert,
  medium: TriangleAlert,
}

const toneMap: Record<KpiId, string> = {
  employees: "bg-secondary text-primary",
  low: "bg-risk-low-soft text-risk-low",
  high: "bg-risk-high-soft text-risk-high",
  medium: "bg-risk-medium-soft text-amber-800",
}

interface KpiCardProps {
  item: DashboardKpi
}

export function KpiCard({ item }: KpiCardProps) {
  const Icon = iconMap[item.id]

  return (
    <Card className="h-full transition-shadow hover:shadow-[0_10px_30px_rgba(15,35,60,0.06)]">
      <CardContent className="pt-5 sm:pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
            <p className="mt-2.5 text-3xl font-semibold tracking-[-0.025em] text-foreground">
              {item.value}
            </p>
          </div>
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-lg",
              toneMap[item.id],
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-5 border-t border-border/80 pt-3.5">
          <p className="text-xs leading-5 text-muted-foreground">{item.context}</p>
          {item.comparison && (
            <p className="mt-1 text-xs font-medium text-foreground">
              {item.comparison}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
