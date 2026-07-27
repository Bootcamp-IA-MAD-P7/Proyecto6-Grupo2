import type {
  DashboardKpi,
  DepartmentRisk,
  InfluenceFactor,
  ModelStatus,
  RiskDistributionItem,
  RiskTrendPoint,
} from "@/types/dashboard"

export const dashboardMeta = {
  period: "Febrero – julio de 2026",
  lastUpdated: "26 de julio de 2026, 09:30",
}

export const dashboardKpis: DashboardKpi[] = [
  {
    id: "employees",
    title: "Empleadas analizadas",
    value: "1.248",
    context: "Cobertura actual del análisis",
  },
  {
    id: "low",
    title: "Riesgo bajo",
    value: "842",
    context: "67,5 % del total analizado",
  },
  {
    id: "medium",
    title: "Riesgo medio",
    value: "276",
    context: "22,1 % del total analizado",
    comparison: "+7 frente a junio",
  },
  {
    id: "high",
    title: "Riesgo alto",
    value: "130",
    context: "10,4 % del total analizado",
    comparison: "+6 frente a junio",
  },
]

export const riskTrend: RiskTrendPoint[] = [
  { month: "Feb", high: 96, medium: 238 },
  { month: "Mar", high: 102, medium: 245 },
  { month: "Abr", high: 108, medium: 252 },
  { month: "May", high: 117, medium: 261 },
  { month: "Jun", high: 124, medium: 269 },
  { month: "Jul", high: 130, medium: 276 },
]

export const riskDistribution: RiskDistributionItem[] = [
  { level: "Bajo", value: 842, percentage: 67.5, color: "var(--risk-low)" },
  { level: "Medio", value: 276, percentage: 22.1, color: "var(--risk-medium)" },
  { level: "Alto", value: 130, percentage: 10.4, color: "var(--risk-high)" },
]

export const departmentRisks: DepartmentRisk[] = [
  { department: "Ingeniería de Datos", high: 36, medium: 72, trend: "Al alza" },
  { department: "Desarrollo de Producto", high: 29, medium: 61, trend: "Estable" },
  { department: "Ciberseguridad", high: 24, medium: 48, trend: "Al alza" },
  { department: "Ciencia de Datos", high: 22, medium: 51, trend: "Estable" },
  { department: "Infraestructura", high: 19, medium: 44, trend: "A la baja" },
]

export const influenceFactors: InfluenceFactor[] = [
  { label: "Satisfacción laboral", value: 88 },
  { label: "Horas extra", value: 74 },
  { label: "Oportunidades de desarrollo", value: 69 },
  { label: "Conciliación", value: 58 },
  { label: "Antigüedad en el puesto", value: 46 },
]

export const modelStatus: ModelStatus = {
  version: "1.2",
  lastTraining: "12 de julio de 2026",
  dataPeriod: "2021–2025",
  status: "Operativo",
}
