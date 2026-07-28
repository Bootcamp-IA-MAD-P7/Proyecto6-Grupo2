export type KpiId = "employees" | "low" | "medium" | "high"

export interface DashboardKpi {
  id: KpiId
  title: string
  value: string
  context: string
  comparison?: string
}

export interface RiskTrendPoint {
  month: string
  high: number
  medium: number
}

export interface RiskDistributionItem {
  level: "Bajo" | "Medio" | "Alto"
  value: number
  percentage: number
  color: string
}

export type DepartmentTrend = "Al alza" | "Estable" | "A la baja"

export interface DepartmentRisk {
  department: string
  high: number
  medium: number
  trend: DepartmentTrend
}

export interface InfluenceFactor {
  label: string
  value: number
}

export interface ModelStatus {
  version: string
  lastTraining: string
  dataPeriod: string
  status: string
}
