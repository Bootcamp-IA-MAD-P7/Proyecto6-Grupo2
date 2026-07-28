import {
  BriefcaseBusiness,
  CalendarCheck2,
  CheckCircle2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const reviewPoints = [
  "Satisfacción laboral",
  "Carga de trabajo y horas extra",
  "Oportunidades de desarrollo",
]

export function InsightCard() {
  return (
    <Card className="overflow-hidden border-primary/20">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge className="bg-primary text-primary-foreground">
              Prioridad 01
            </Badge>
            <Badge variant="warning">Revisión humana recomendada</Badge>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary sm:grid">
              <BriefcaseBusiness className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                Prioridades para RR. HH.
              </p>
              <h2 className="mt-2 max-w-3xl text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Ingeniería de Datos requiere atención antes del próximo ciclo
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
                Durante los dos últimos periodos, el área ha mostrado un incremento
                sostenido del riesgo alto. El patrón coincide con señales menos
                favorables en satisfacción laboral y horas extra. Conviene
                contrastar estos indicadores con el equipo antes de definir
                cualquier intervención.
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarCheck2 className="size-4 text-primary" aria-hidden="true" />
                Revisar antes del siguiente ciclo de evaluación
              </div>
            </div>
          </div>
        </div>

        <aside className="border-t border-border bg-secondary/45 p-6 lg:border-t-0 lg:border-l sm:p-8">
          <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Indicadores a contrastar
          </p>
          <ul className="mt-5 space-y-4">
            {reviewPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm leading-5 text-foreground"
              >
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
            Estas señales orientan la revisión. No establecen una relación causal
            ni sustituyen el criterio profesional.
          </p>
        </aside>
      </div>
    </Card>
  )
}
