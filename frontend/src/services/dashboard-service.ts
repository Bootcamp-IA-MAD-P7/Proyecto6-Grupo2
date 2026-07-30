import { useApiClient } from "./api-client"
import type { DashboardOverview } from "@/types/dashboard"

export function useDashboardService() {
  const { apiFetch } = useApiClient()

  async function getDashboardOverview(): Promise<DashboardOverview | null> {
    try {
      const data = await apiFetch("/api/v1/dashboard/overview")
      return data as DashboardOverview
    } catch {
      return null
    }
  }

  return { getDashboardOverview }
}
