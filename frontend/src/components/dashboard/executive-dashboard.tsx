import { DepartmentRiskTable } from "@/components/dashboard/department-risk-table"
import { InfluenceFactorsCard } from "@/components/dashboard/influence-factors-card"
import { InsightCard } from "@/components/dashboard/insight-card"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { ModelStatusCard } from "@/components/dashboard/model-status-card"
import { PageHeader } from "@/components/dashboard/page-header"
import { ResponsibleUseNotice } from "@/components/dashboard/responsible-use-notice"
import { RiskDistribution } from "@/components/dashboard/risk-distribution"
import { RiskTrendChart } from "@/components/dashboard/risk-trend-chart"
import { AppShell } from "@/components/layout/app-shell"
import { dashboardKpis } from "@/data/dashboard"

export function ExecutiveDashboard() {
  return (
    <AppShell>
      <main className="px-4 py-7 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        <div className="mx-auto max-w-[1440px] space-y-7">
          <PageHeader />

          <InsightCard />

          <section
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="Indicadores principales"
          >
            {dashboardKpis.map((item) => (
              <KpiCard key={item.id} item={item} />
            ))}
          </section>

          <section
            className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]"
            aria-label="Análisis de riesgo"
          >
            <RiskTrendChart />
            <RiskDistribution />
          </section>

          <section
            className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,1fr)]"
            aria-label="Áreas y factores prioritarios"
          >
            <DepartmentRiskTable />
            <InfluenceFactorsCard />
          </section>

          <section className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <ModelStatusCard />
            <ResponsibleUseNotice />
          </section>
        </div>
      </main>
    </AppShell>
  )
}
