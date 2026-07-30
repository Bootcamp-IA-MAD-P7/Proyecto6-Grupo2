import { useEffect, useState } from "react"
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CalendarRange,
  CheckCircle2,
  CircleAlert,
  Database,
  Info,
  Lightbulb,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { dashboardMock } from "@/data/dashboard"
import {
  workforceReference,
  type ReferenceDimension,
} from "@/data/workforce-reference"
import { translations } from "@/i18n"
import type { LanguageCode } from "@/types/dashboard"

const LANGUAGE_STORAGE_KEY = "talentcare-language"

const dashboardCopy = {
  es: {
    demo: "ENTORNO DE DEMOSTRACIÓN",
    sourcePrefix: "Referencia histórica",
    profiles: "perfiles",
    variables: "variables disponibles",
    title: "Entender antes de decidir.",
    subtitle:
      "Una lectura ejecutiva de patrones históricos de satisfacción laboral para orientar investigaciones responsables de People.",
    briefEyebrow: "EXECUTIVE BRIEF",
    briefTitle:
      "La etapa profesional temprana concentra la diferencia más clara del análisis.",
    briefBody:
      "El 41,0% de los perfiles con 0–2 años de experiencia declara una satisfacción inferior a 7, frente al 27,6% entre perfiles con 11+ años.",
    observed: "Evidencia observada",
    notPrediction: "No es una predicción de abandono",
    nextStep: "Siguiente paso responsable",
    nextStepTitle: "Validar la experiencia de carrera temprana",
    nextStepBody:
      "Contrasta el patrón con escucha directa, onboarding y expectativas de desarrollo antes de considerar una intervención.",
    reviewEvidence: "Revisar evidencia",
    exploreProfile: "Explorar Workforce Profile",
    metrics: {
      profiles: "Perfiles históricos",
      lower: "Satisfacción inferior a 7",
      salary: "Compensación mediana",
      experience: "Experiencia mediana",
      observed: "Respuesta observada, no predicción",
      salaryNote: "USD anuales",
      years: "años programando",
    },
    workforce: {
      eyebrow: "UNDERSTAND",
      title: "Workforce Overview",
      subtitle:
        "¿Quién está representado en esta referencia antes de interpretar diferencias de satisfacción?",
      distribution: "Composición por experiencia",
      distributionNote: "Proporción sobre 55.008 perfiles",
      context: "Contexto profesional dominante",
      medianExperience: "Mediana de experiencia",
      commonAge: "Rango de edad más frecuente",
      commonRole: "Perfil profesional más frecuente",
      commonCountry: "País más representado",
      ageValue: "25–34 años",
      roleValue: "Desarrollo full-stack",
      countryValue: "Estados Unidos",
      contextNote:
        "La fuente representa principalmente profesionales tecnológicos. No describe la plantilla de una organización concreta.",
    },
    attention: {
      eyebrow: "DETECT & EXPLAIN",
      title: "Workforce Attention Areas",
      subtitle:
        "Explora dónde aparecen diferencias descriptivas. Cada comparación conserva su muestra y su contexto.",
      selector: "Dimensión de análisis",
      chartLabel: "% con satisfacción declarada inferior a 7",
      evidence: "Qué muestra la evidencia",
      context: "Business Context",
      limitation:
        "La asociación no demuestra una causa ni describe la experiencia actual de una persona.",
      profiles: "perfiles",
    },
    priorities: {
      eyebrow: "PRIORITIZE",
      title: "Segmentos que conviene investigar primero",
      subtitle:
        "La prioridad organiza hipótesis de trabajo; no identifica personas en riesgo.",
      first: "Primero",
      next: "Después",
      monitor: "Contrastar",
      items: [
        {
          label: "Carrera temprana",
          evidence: "0–2 años · 41,0% · 765 perfiles",
          reason: "Mayor diferencia frente al grupo de 11+ años.",
        },
        {
          label: "Compensación inferior a 30k USD",
          evidence: "36,1% · 12.219 perfiles",
          reason: "9,3 puntos por encima del tramo de 100k+ USD.",
        },
        {
          label: "Edad 18–24",
          evidence: "34,4% · 7.344 perfiles",
          reason:
            "Requiere separar edad, experiencia y situación laboral antes de interpretar.",
        },
      ],
    },
    actions: {
      eyebrow: "ACT",
      title: "Preventive Actions",
      subtitle:
        "Convierte la evidencia en preguntas medibles, no en decisiones automáticas.",
      evidenceLabel: "Evidencia de partida",
      measureLabel: "Qué medir",
      items: [
        {
          horizon: "AHORA",
          title: "Escucha de carrera temprana",
          body: "Explora onboarding, expectativas, apoyo y claridad de progresión con perfiles en etapas iniciales.",
          evidence: "Diferencia de 13,4 puntos por experiencia.",
          measure: "Temas recurrentes, participación y necesidades de apoyo.",
        },
        {
          horizon: "30 DÍAS",
          title: "Revisión contextual de compensación",
          body: "Comprueba si las diferencias salariales responden a geografía, rol o experiencia antes de formular una hipótesis interna.",
          evidence: "Gradiente histórico entre tramos salariales.",
          measure: "Comparabilidad de roles, niveles y mercados.",
        },
        {
          horizon: "VALIDAR",
          title: "Contraste con evidencia interna",
          body: "Compara cualquier patrón externo con encuestas, entrevistas o datos organizativos actuales.",
          evidence: "La fuente no contiene empleados del cliente.",
          measure: "Consistencia —o ausencia de ella— con la experiencia real.",
        },
      ],
    },
    responsible: {
      eyebrow: "RESPONSIBLE USE",
      title: "La decisión humana siempre va primero.",
      body: "TalentCare identifica asociaciones históricas de satisfacción. No predice dimisiones, rotación, burnout ni salidas futuras, y no debe utilizarse como única base para decisiones que afecten a una persona.",
    },
    methodology: {
      title: "Metodología y alcance de los datos",
      body: "La referencia combina encuestas 2024–2025. La clasificación binaria considera satisfacción favorable una respuesta JobSat ≥ 7 y menor satisfacción una respuesta inferior a 7.",
      sourceTitle: "Fuente",
      sourceBody: "Stack Overflow Developer Survey 2024–2025.",
      targetTitle: "Objetivo",
      targetBody:
        "Dos clases de satisfacción laboral; no existen niveles de riesgo de abandono.",
      modelTitle: "Capacidad predictiva",
      modelBody:
        "La API evalúa un perfil cada vez. Las comparaciones de esta home son descriptivas y proceden de respuestas observadas.",
      limitsTitle: "Datos no disponibles",
      limitsBody:
        "No hay género, departamento, antigüedad en empresa, promociones, salidas reales ni costes de reemplazo.",
    },
  },
  en: {
    demo: "DEMONSTRATION ENVIRONMENT",
    sourcePrefix: "Historical reference",
    profiles: "profiles",
    variables: "available variables",
    title: "Understand before deciding.",
    subtitle:
      "An executive view of historical job-satisfaction patterns designed to support responsible People investigations.",
    briefEyebrow: "EXECUTIVE BRIEF",
    briefTitle:
      "Early career shows the clearest difference in the current analysis.",
    briefBody:
      "41.0% of profiles with 0–2 years of coding experience report satisfaction below 7, compared with 27.6% among profiles with 11+ years.",
    observed: "Observed evidence",
    notPrediction: "Not an attrition prediction",
    nextStep: "Responsible next step",
    nextStepTitle: "Validate the early-career experience",
    nextStepBody:
      "Contrast the pattern with direct listening, onboarding and development expectations before considering an intervention.",
    reviewEvidence: "Review evidence",
    exploreProfile: "Explore Workforce Profile",
    metrics: {
      profiles: "Historical profiles",
      lower: "Satisfaction below 7",
      salary: "Median compensation",
      experience: "Median experience",
      observed: "Observed response, not prediction",
      salaryNote: "annual USD",
      years: "years coding",
    },
    workforce: {
      eyebrow: "UNDERSTAND",
      title: "Workforce Overview",
      subtitle:
        "Who is represented in this reference before satisfaction differences are interpreted?",
      distribution: "Composition by experience",
      distributionNote: "Share of 55,008 profiles",
      context: "Dominant professional context",
      medianExperience: "Median experience",
      commonAge: "Most common age range",
      commonRole: "Most common professional role",
      commonCountry: "Most represented country",
      ageValue: "25–34 years",
      roleValue: "Full-stack development",
      countryValue: "United States",
      contextNote:
        "The source primarily represents technology professionals. It does not describe one organisation's workforce.",
    },
    attention: {
      eyebrow: "DETECT & EXPLAIN",
      title: "Workforce Attention Areas",
      subtitle:
        "Explore where descriptive differences appear. Every comparison retains its sample and context.",
      selector: "Analysis dimension",
      chartLabel: "% reporting job satisfaction below 7",
      evidence: "What the evidence shows",
      context: "Business Context",
      limitation:
        "The association does not establish a cause or describe a person's current experience.",
      profiles: "profiles",
    },
    priorities: {
      eyebrow: "PRIORITIZE",
      title: "Segments to investigate first",
      subtitle:
        "Priority organises working hypotheses; it does not identify people at risk.",
      first: "First",
      next: "Next",
      monitor: "Contrast",
      items: [
        {
          label: "Early career",
          evidence: "0–2 years · 41.0% · 765 profiles",
          reason: "Largest difference compared with the 11+ year group.",
        },
        {
          label: "Compensation below USD 30k",
          evidence: "36.1% · 12,219 profiles",
          reason: "9.3 points above the USD 100k+ band.",
        },
        {
          label: "Age 18–24",
          evidence: "34.4% · 7,344 profiles",
          reason:
            "Age, experience and employment context must be separated before interpretation.",
        },
      ],
    },
    actions: {
      eyebrow: "ACT",
      title: "Preventive Actions",
      subtitle:
        "Turn evidence into measurable questions, not automated decisions.",
      evidenceLabel: "Starting evidence",
      measureLabel: "What to measure",
      items: [
        {
          horizon: "NOW",
          title: "Early-career listening",
          body: "Explore onboarding, expectations, support and progression clarity with people in earlier career stages.",
          evidence: "13.4-point difference by experience.",
          measure: "Recurring themes, participation and support needs.",
        },
        {
          horizon: "30 DAYS",
          title: "Compensation context review",
          body: "Check whether pay differences reflect geography, role or experience before forming an internal hypothesis.",
          evidence: "Historical gradient across salary bands.",
          measure: "Comparability of roles, levels and markets.",
        },
        {
          horizon: "VALIDATE",
          title: "Contrast with internal evidence",
          body: "Compare every external pattern with current surveys, interviews or organisational evidence.",
          evidence: "The source does not contain client employees.",
          measure: "Consistency—or lack of it—with the real experience.",
        },
      ],
    },
    responsible: {
      eyebrow: "RESPONSIBLE USE",
      title: "Human judgement always comes first.",
      body: "TalentCare identifies historical satisfaction associations. It does not predict resignation, turnover, burnout or future departures and must not be the sole basis for decisions affecting a person.",
    },
    methodology: {
      title: "Methodology and data scope",
      body: "The reference combines 2024–2025 surveys. The binary classification treats JobSat ≥ 7 as favourable satisfaction and responses below 7 as lower satisfaction.",
      sourceTitle: "Source",
      sourceBody: "Stack Overflow Developer Survey 2024–2025.",
      targetTitle: "Objective",
      targetBody:
        "Two job-satisfaction classes; no attrition-risk levels are produced.",
      modelTitle: "Predictive capability",
      modelBody:
        "The API evaluates one profile at a time. Homepage comparisons are descriptive and come from observed responses.",
      limitsTitle: "Unavailable data",
      limitsBody:
        "Gender, department, company tenure, promotion history, actual exits and replacement costs are not available.",
    },
  },
} as const

function getInitialLanguage(): LanguageCode {
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "es" ? "es" : "en"
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
        {subtitle}
      </p>
    </div>
  )
}

export function ExecutiveDashboard() {
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage)
  const [activeDimension, setActiveDimension] =
    useState<ReferenceDimension>("experience")
  const copy = dashboardCopy[language]
  const sharedCopy = translations[language]
  const dimension =
    workforceReference.dimensions.find((item) => item.id === activeDimension) ??
    workforceReference.dimensions[0]
  const locale = language === "es" ? "es-ES" : "en-GB"
  const maxRate = Math.max(
    ...dimension.segments.map((segment) => segment.lowerSatisfactionRate),
  )

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    const anchor = window.location.hash.slice(1)
    if (
      ["workforce-overview", "attention-areas", "preventive-actions", "methodology"].includes(
        anchor,
      )
    ) {
      window.requestAnimationFrame(() => {
        document.getElementById(anchor)?.scrollIntoView({ block: "start" })
      })
    }
  }, [])

  const changeLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage)
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const formatInteger = (value: number) =>
    new Intl.NumberFormat(locale).format(value)

  return (
    <AppShell
      language={language}
      onLanguageChange={changeLanguage}
      profile={dashboardMock.profile}
      translations={sharedCopy}
    >
      <main id="home" className="px-5 py-7 sm:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[1280px]">
          <section
            aria-label={copy.demo}
            className="flex flex-col gap-3 rounded-xl border border-[#d7c7a8] bg-[#fffaf0] px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-2.5 text-[#68593e]">
              <Database className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p className="leading-5">
                <strong>{copy.sourcePrefix}</strong> ·{" "}
                {workforceReference.source} {workforceReference.period} ·{" "}
                {formatInteger(workforceReference.profiles)} {copy.profiles}
              </p>
            </div>
            <span className="self-start rounded-full border border-[#c9a973]/40 bg-white px-3 py-1 text-[0.625rem] font-bold tracking-[0.12em] text-[#80683f] sm:self-auto">
              {copy.demo}
            </span>
          </section>

          <header className="flex flex-col gap-5 py-9 sm:flex-row sm:items-end sm:justify-between sm:py-11">
            <div className="max-w-3xl">
              <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-primary uppercase">
                WORKFORCE INTELLIGENCE
              </p>
              <h1 className="mt-3 font-editorial text-4xl leading-[1.08] tracking-[-0.045em] text-foreground sm:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {copy.subtitle}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => scrollTo("workforce-overview")}
              >
                {copy.exploreProfile}
              </Button>
            </div>
          </header>

          <section className="grid gap-4 xl:grid-cols-[1.45fr_0.55fr]">
            <article className="relative overflow-hidden rounded-2xl bg-[#1f3329] p-6 text-white sm:p-8">
              <div className="relative z-10 max-w-3xl">
                <p className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.14em] text-[#c3d0c9] uppercase">
                  <Sparkles className="size-4 text-[#e0a086]" aria-hidden="true" />
                  {copy.briefEyebrow}
                </p>
                <h2 className="mt-6 font-editorial text-3xl leading-tight tracking-[-0.035em] sm:text-[2.45rem]">
                  {copy.briefTitle}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#c2cec7]">
                  {copy.briefBody}
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                    {copy.observed}
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-[#c2cec7]">
                    {copy.notPrediction}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => scrollTo("attention-areas")}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#efb39b] hover:text-white"
                >
                  {copy.reviewEvidence}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </article>

            <aside className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-7">
              <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary">
                <Target className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-6 text-[0.6875rem] font-bold tracking-[0.14em] text-primary uppercase">
                {copy.nextStep}
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em]">
                {copy.nextStepTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {copy.nextStepBody}
              </p>
              <div className="mt-auto pt-7">
                <div className="border-t border-border pt-5">
                  <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                    <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {copy.notPrediction}
                  </p>
                </div>
              </div>
            </aside>
          </section>

          <section
            aria-label="Workforce metrics"
            className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 xl:grid-cols-4"
          >
            {[
              {
                label: copy.metrics.profiles,
                value: formatInteger(workforceReference.profiles),
                note: `${workforceReference.variables} ${copy.variables}`,
              },
              {
                label: copy.metrics.lower,
                value: `${workforceReference.lowerSatisfactionRate.toLocaleString(locale)}%`,
                note: copy.metrics.observed,
              },
              {
                label: copy.metrics.salary,
                value: `$${formatInteger(workforceReference.medianSalaryUsd)}`,
                note: copy.metrics.salaryNote,
              },
              {
                label: copy.metrics.experience,
                value: `${workforceReference.medianYearsCode}`,
                note: copy.metrics.years,
              },
            ].map((metric) => (
              <article key={metric.label} className="bg-card p-5 sm:p-6">
                <p className="text-xs font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                  {metric.value}
                </p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {metric.note}
                </p>
              </article>
            ))}
          </section>

          <section
            id="workforce-overview"
            className="scroll-mt-8 border-b border-border py-16 sm:py-20"
          >
            <SectionHeading
              eyebrow={copy.workforce.eyebrow}
              title={copy.workforce.title}
              subtitle={copy.workforce.subtitle}
            />

            <div className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-2xl border border-border bg-card p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold">
                      {copy.workforce.distribution}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {copy.workforce.distributionNote}
                    </p>
                  </div>
                  <BarChart3 className="size-5 text-primary" aria-hidden="true" />
                </div>
                <div className="mt-7 space-y-5">
                  {workforceReference.dimensions[0].segments.map((segment) => {
                    const share =
                      (segment.profiles / workforceReference.profiles) * 100
                    return (
                      <div key={segment.id}>
                        <div className="flex items-center justify-between gap-4 text-sm">
                          <span className="font-medium">
                            {segment.label[language]}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {share.toLocaleString(locale, {
                              maximumFractionDigits: 1,
                            })}
                            % · {formatInteger(segment.profiles)}
                          </span>
                        </div>
                        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-[#789181]"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </article>

              <aside className="rounded-2xl bg-[#f1eee8] p-6 sm:p-7">
                <h3 className="text-base font-semibold">
                  {copy.workforce.context}
                </h3>
                <dl className="mt-6 space-y-4">
                  {[
                    {
                      label: copy.workforce.medianExperience,
                      value: `${workforceReference.medianYearsCode} ${copy.metrics.years}`,
                    },
                    {
                      label: copy.workforce.commonAge,
                      value: copy.workforce.ageValue,
                    },
                    {
                      label: copy.workforce.commonRole,
                      value: copy.workforce.roleValue,
                    },
                    {
                      label: copy.workforce.commonCountry,
                      value: copy.workforce.countryValue,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start justify-between gap-4 border-b border-[#2b3d33]/10 pb-4 last:border-0"
                    >
                      <dt className="text-xs leading-5 text-muted-foreground">
                        {item.label}
                      </dt>
                      <dd className="max-w-[55%] text-right text-sm font-semibold">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 flex items-start gap-2 rounded-xl bg-white/75 p-4 text-xs leading-5 text-muted-foreground">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {copy.workforce.contextNote}
                </p>
              </aside>
            </div>
          </section>

          <section
            id="attention-areas"
            className="scroll-mt-8 border-b border-border py-16 sm:py-20"
          >
            <SectionHeading
              eyebrow={copy.attention.eyebrow}
              title={copy.attention.title}
              subtitle={copy.attention.subtitle}
            />

            <div className="mt-7">
              <p className="text-xs font-semibold text-muted-foreground">
                {copy.attention.selector}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {workforceReference.dimensions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={item.id === activeDimension}
                    onClick={() => setActiveDimension(item.id)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                      item.id === activeDimension
                        ? "bg-[#24382e] text-white"
                        : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {item.label[language]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-2xl border border-border bg-card p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold">
                      {dimension.question[language]}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {copy.attention.chartLabel}
                    </p>
                  </div>
                  <SearchCheck
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                </div>

                <div className="mt-7 space-y-5">
                  {dimension.segments.map((segment) => (
                    <div key={segment.id}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          {segment.highlighted && (
                            <span
                              className="size-2 rounded-full bg-primary"
                              aria-hidden="true"
                            />
                          )}
                          {segment.label[language]}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {segment.lowerSatisfactionRate.toLocaleString(locale)}%
                          {" · "}
                          {formatInteger(segment.profiles)}{" "}
                          {copy.attention.profiles}
                        </span>
                      </div>
                      <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-[width] duration-300 ${
                            segment.highlighted ? "bg-primary" : "bg-[#7b9484]"
                          }`}
                          style={{
                            width: `${(segment.lowerSatisfactionRate / maxRate) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <aside className="flex flex-col rounded-2xl bg-[#20352b] p-6 text-white sm:p-7">
                <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-[#efb39b]">
                  <Lightbulb className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-6 text-[0.6875rem] font-bold tracking-[0.12em] text-[#bdcbc4] uppercase">
                  {copy.attention.evidence}
                </p>
                <p className="mt-3 text-xl font-semibold leading-7">
                  {dimension.insight[language]}
                </p>
                <div className="mt-6 rounded-xl bg-white/7 p-4">
                  <p className="text-[0.6875rem] font-bold tracking-[0.1em] text-[#efb39b] uppercase">
                    {copy.attention.context}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#c8d3cd]">
                    {dimension.context[language]}
                  </p>
                </div>
                <p className="mt-6 flex items-start gap-2 border-t border-white/10 pt-5 text-xs leading-5 text-[#b8c6bf]">
                  <ShieldCheck
                    className="mt-0.5 size-3.5 shrink-0 text-[#efb39b]"
                    aria-hidden="true"
                  />
                  {copy.attention.limitation}
                </p>
              </aside>
            </div>
          </section>

          <section className="border-b border-border py-16 sm:py-20">
            <SectionHeading
              eyebrow={copy.priorities.eyebrow}
              title={copy.priorities.title}
              subtitle={copy.priorities.subtitle}
            />
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
              {copy.priorities.items.map((item, index) => {
                const priority = [
                  copy.priorities.first,
                  copy.priorities.next,
                  copy.priorities.monitor,
                ][index]
                return (
                  <article
                    key={item.label}
                    className="grid gap-4 border-b border-border p-5 last:border-0 sm:grid-cols-[110px_1fr_1.2fr] sm:items-center sm:p-6"
                  >
                    <span className="w-fit rounded-full bg-accent px-3 py-1 text-[0.625rem] font-bold tracking-[0.1em] text-primary uppercase">
                      {priority}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{item.label}</h3>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {item.evidence}
                      </p>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.reason}
                    </p>
                  </article>
                )
              })}
            </div>
          </section>

          <section
            id="preventive-actions"
            className="scroll-mt-8 border-b border-border py-16 sm:py-20"
          >
            <SectionHeading
              eyebrow={copy.actions.eyebrow}
              title={copy.actions.title}
              subtitle={copy.actions.subtitle}
            />
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {copy.actions.items.map((action, index) => {
                const icons = [
                  UsersRound,
                  BadgeDollarSign,
                  BriefcaseBusiness,
                ]
                const Icon = icons[index]
                return (
                  <article
                    key={action.title}
                    className="flex flex-col rounded-2xl border border-border bg-card p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-[0.625rem] font-bold tracking-[0.12em] text-muted-foreground">
                        {action.horizon}
                      </span>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em]">
                      {action.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {action.body}
                    </p>
                    <dl className="mt-6 space-y-4 border-t border-border pt-5">
                      <div>
                        <dt className="text-[0.625rem] font-bold tracking-[0.1em] text-primary uppercase">
                          {copy.actions.evidenceLabel}
                        </dt>
                        <dd className="mt-1.5 text-xs leading-5 text-muted-foreground">
                          {action.evidence}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.625rem] font-bold tracking-[0.1em] text-primary uppercase">
                          {copy.actions.measureLabel}
                        </dt>
                        <dd className="mt-1.5 text-xs leading-5 text-muted-foreground">
                          {action.measure}
                        </dd>
                      </div>
                    </dl>
                  </article>
                )
              })}
            </div>
          </section>

          <section
            id="methodology"
            className="scroll-mt-8 py-16 sm:py-20"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
                <div className="bg-[#20352b] p-6 text-white sm:p-8">
                  <p className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.14em] text-[#efb39b] uppercase">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    {copy.responsible.eyebrow}
                  </p>
                  <h2 className="mt-5 font-editorial text-3xl leading-tight tracking-[-0.035em]">
                    {copy.responsible.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#c3d0c9]">
                    {copy.responsible.body}
                  </p>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-primary">
                      <BookOpen className="size-4.5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold tracking-[-0.025em]">
                        {copy.methodology.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {copy.methodology.body}
                      </p>
                    </div>
                  </div>
                  <dl className="mt-7 grid gap-5 sm:grid-cols-2">
                    {[
                      {
                        title: copy.methodology.sourceTitle,
                        body: copy.methodology.sourceBody,
                        icon: Database,
                      },
                      {
                        title: copy.methodology.targetTitle,
                        body: copy.methodology.targetBody,
                        icon: Target,
                      },
                      {
                        title: copy.methodology.modelTitle,
                        body: copy.methodology.modelBody,
                        icon: CheckCircle2,
                      },
                      {
                        title: copy.methodology.limitsTitle,
                        body: copy.methodology.limitsBody,
                        icon: CircleAlert,
                      },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.title}>
                          <dt className="flex items-center gap-2 text-sm font-semibold">
                            <Icon
                              className="size-4 text-primary"
                              aria-hidden="true"
                            />
                            {item.title}
                          </dt>
                          <dd className="mt-2 text-xs leading-5 text-muted-foreground">
                            {item.body}
                          </dd>
                        </div>
                      )
                    })}
                  </dl>
                </div>
              </div>
            </div>
          </section>

          <footer className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 TalentCare</p>
            <p className="flex items-center gap-2">
              <CalendarRange className="size-3.5" aria-hidden="true" />
              {workforceReference.source} · {workforceReference.period}
            </p>
          </footer>
        </div>
      </main>
    </AppShell>
  )
}
