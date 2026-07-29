import { DASHBOARD_DEMO_STATE, dashboardMock } from "@/data/dashboard"
import type { DashboardOverview } from "@/types/dashboard"

const MOCK_DELAY_MS = 450

export async function getDashboardOverview(): Promise<DashboardOverview | null> {
  if (DASHBOARD_DEMO_STATE === "loading") {
    return new Promise<DashboardOverview | null>(() => undefined)
  }

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, MOCK_DELAY_MS)
  })

  if (DASHBOARD_DEMO_STATE === "error") {
    throw new Error("Dashboard overview unavailable")
  }

  if (DASHBOARD_DEMO_STATE === "empty") {
    return null
  }

  // Replace this return with the future FastAPI request and response mapping.
  return dashboardMock
}
