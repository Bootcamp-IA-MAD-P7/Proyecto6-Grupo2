import { useState } from "react"
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleGauge,
  Database,
  HeartHandshake,
  Info,
  Layers3,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react"

type ModelId = "catboost" | "lightgbm" | "randomForest" | "ensemble"

interface ModelEvidence {
  id: ModelId
  name: string
  shortName: string
  accuracy: number
  balancedAccuracy: number
  macroF1: number
  summary: string
  barClass: string
  dotClass: string
  recommended?: boolean
}

const MODEL_EVIDENCE: readonly ModelEvidence[] = [
  {
    id: "catboost",
    name: "CatBoost",
    shortName: "CAT",
    accuracy: 0.444,
    balancedAccuracy: 0.408,
    macroF1: 0.349,
    summary:
      "Buena sensibilidad a la clase minoritaria, con un coste en precisión global.",
    barClass: "bg-[#88a694]",
    dotClass: "bg-[#668474]",
  },
  {
    id: "lightgbm",
    name: "LightGBM",
    shortName: "LGB",
    accuracy: 0.701,
    balancedAccuracy: 0.335,
    macroF1: 0.279,
    summary:
      "Alta exactitud aparente, pero demasiado condicionada por la clase mayoritaria.",
    barClass: "bg-[#d2a66f]",
    dotClass: "bg-[#a67b46]",
  },
  {
    id: "randomForest",
    name: "Random Forest",
    shortName: "RF",
    accuracy: 0.591,
    balancedAccuracy: 0.384,
    macroF1: 0.384,
    summary:
      "El mejor equilibrio actual entre las tres clases; candidato recomendado para el piloto.",
    barClass: "bg-[#c86f4f]",
    dotClass: "bg-[#a84f31]",
    recommended: true,
  },
  {
    id: "ensemble",
    name: "Ensemble",
    shortName: "ENS",
    accuracy: 0.448,
    balancedAccuracy: 0.406,
    macroF1: 0.346,
    summary:
      "Combina los tres modelos, aunque todavía no supera al Random Forest en F1 macro.",
    barClass: "bg-[#596c86]",
    dotClass: "bg-[#40536d]",
  },
]

const OUTCOMES = [
  {
    label: "Satisfacción baja",
    description:
      "Perfiles históricos que requieren contexto humano y revisión prioritaria.",
    tone: "border-[#d9a89a] bg-[#fff6f2] text-[#944c39]",
    marker: "bg-[#b85f48]",
  },
  {
    label: "Satisfacción media",
    description:
      "Señales mixtas que conviene observar antes de tomar cualquier decisión.",
    tone: "border-[#dec9a4] bg-[#fffaf0] text-[#876831]",
    marker: "bg-[#b58a43]",
  },
  {
    label: "Satisfacción alta",
    description:
      "Patrones históricamente asociados a una experiencia laboral favorable.",
    tone: "border-[#aec9b5] bg-[#f4faf5] text-[#4f7458]",
    marker: "bg-[#648b6d]",
  },
] as const

function formatMetric(value: number): string {
  return value.toLocaleString("es-ES", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
}

export function EnsembleClientPage() {
  const [selectedModelId, setSelectedModelId] =
    useState<ModelId>("randomForest")
  const selectedModel =
    MODEL_EVIDENCE.find((model) => model.id === selectedModelId) ??
    MODEL_EVIDENCE[2]

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#17211c]">
      <header className="border-b border-[#24372d]/10 bg-[#f7f4ef]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-12">
          <a
            href="#ensemble-client"
            className="flex items-center gap-3"
            aria-label="TalentCare, inicio de la propuesta ensemble"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#21372d] text-white shadow-sm">
              <HeartHandshake className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-semibold tracking-[-0.02em]">
                TalentCare
              </span>
              <span className="block text-[0.66rem] font-semibold tracking-[0.13em] text-[#68736d] uppercase">
                Modelo experimental
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-[#536159] md:flex">
            <a href="#modelo" className="transition-colors hover:text-[#17211c]">
              El modelo
            </a>
            <a
              href="#evidencia"
              className="transition-colors hover:text-[#17211c]"
            >
              Evidencia
            </a>
            <a
              href="#siguiente-paso"
              className="transition-colors hover:text-[#17211c]"
            >
              Siguiente paso
            </a>
          </nav>

          <a
            href="#assessment"
            className="inline-flex items-center gap-2 rounded-full border border-[#263b30]/15 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Ver versión actual
            <ChevronRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
        >
          <div className="absolute -top-36 right-[-7rem] size-[32rem] rounded-full bg-[#d9ad91]/25 blur-3xl" />
          <div className="absolute bottom-[-15rem] left-[-9rem] size-[30rem] rounded-full bg-[#9cb4a2]/25 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-[1240px] gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:px-12 lg:py-24">
          <div className="client-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a9583b]/20 bg-[#fff9f5] px-3 py-1.5 text-xs font-semibold text-[#974c31]">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Nueva propuesta para evaluación
            </div>

            <h1 className="font-editorial mt-7 max-w-3xl text-5xl leading-[0.98] tracking-[-0.045em] text-[#16261e] sm:text-6xl lg:text-[4.55rem]">
              Entender mejor las señales antes de actuar.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#58635d] sm:text-lg">
              Una lectura multiclase de la satisfacción laboral que distingue
              entre señales bajas, medias y altas. Diseñada para orientar
              conversaciones, no para automatizar decisiones sobre personas.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#evidencia"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#bd6547] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(136,68,43,0.2)] transition hover:-translate-y-0.5 hover:bg-[#aa573c]"
              >
                Explorar la evidencia
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#siguiente-paso"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#263b30]/15 bg-white/75 px-6 py-3.5 text-sm font-semibold transition hover:bg-white"
              >
                Revisar recomendación
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-[#657069]">
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-[#5d8067]" aria-hidden="true" />
                55.008 perfiles históricos
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-[#5d8067]" aria-hidden="true" />
                Validación estratificada
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-[#5d8067]" aria-hidden="true" />
                Supervisión humana
              </span>
            </div>
          </div>

          <div className="client-rise-delayed relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-3 rounded-[2rem] border border-white/80 bg-white/25" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-[#24372d]/10 bg-[#20372c] p-6 text-white shadow-[0_28px_80px_rgba(31,50,41,0.22)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.67rem] font-semibold tracking-[0.14em] text-[#b8c8bf] uppercase">
                    Candidato recomendado
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em]">
                    Random Forest
                  </h2>
                </div>
                <span className="grid size-11 place-items-center rounded-2xl bg-white/10">
                  <BrainCircuit className="size-5" aria-hidden="true" />
                </span>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/7 p-4">
                  <p className="text-xs text-[#b8c8bf]">F1 macro en test</p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
                    0,384
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#aebfb5]">
                    Mejor equilibrio entre clases
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/7 p-4">
                  <p className="text-xs text-[#b8c8bf]">Accuracy en test</p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
                    59,1%
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#aebfb5]">
                    Sobre 8.252 perfiles
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between text-xs text-[#b8c8bf]">
                  <span>Distribución real de test</span>
                  <span>8.252 perfiles</span>
                </div>
                <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="h-full bg-[#c56d55]"
                    style={{ width: "7.23%" }}
                    title="Satisfacción baja: 7,23%"
                  />
                  <span
                    className="h-full bg-[#c9a05d]"
                    style={{ width: "22.66%" }}
                    title="Satisfacción media: 22,66%"
                  />
                  <span
                    className="h-full bg-[#7fa089]"
                    style={{ width: "70.11%" }}
                    title="Satisfacción alta: 70,11%"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-[0.68rem] text-[#b8c8bf]">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#c56d55]" />
                    Baja
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#c9a05d]" />
                    Media
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#7fa089]" />
                    Alta
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-5 text-xs leading-5 text-[#b8c8bf]">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>
                  El rendimiento aún es experimental. La propuesta recomienda
                  un piloto controlado antes de cualquier uso operativo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modelo" className="border-y border-[#24372d]/10 bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#a75236] uppercase">
                Una lectura más matizada
              </p>
              <h2 className="font-editorial mt-4 text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
                Tres señales. Una conversación más útil.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#637068] lg:justify-self-end">
              El modelo no diagnostica satisfacción real. Reconoce patrones
              históricos y los agrupa para ayudar a priorizar dónde puede
              aportar valor una revisión cualitativa.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {OUTCOMES.map((outcome, index) => (
              <article
                key={outcome.label}
                className={`rounded-2xl border p-6 ${outcome.tone}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`size-2.5 rounded-full ${outcome.marker}`}
                    aria-hidden="true"
                  />
                  <span className="text-[0.65rem] font-bold tracking-[0.14em] opacity-65">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-semibold">{outcome.label}</h3>
                <p className="mt-3 text-sm leading-6 opacity-80">
                  {outcome.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="evidencia">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#a75236] uppercase">
              Evidencia comparada
            </p>
            <h2 className="font-editorial mt-4 text-4xl tracking-[-0.035em] sm:text-5xl">
              Elegimos equilibrio, no solo una cifra grande.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#637068]">
              La accuracy de LightGBM parece superior, pero cae al comparar las
              tres clases de forma equilibrada. Por eso priorizamos F1 macro
              para decidir qué modelo merece avanzar.
            </p>
          </div>

          <div className="mt-11 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[1.5rem] border border-[#24372d]/10 bg-white p-5 shadow-[0_18px_60px_rgba(39,58,48,0.07)] sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">F1 macro en test</p>
                  <p className="mt-1 text-xs text-[#738078]">
                    Haz clic en un modelo para explorar sus resultados
                  </p>
                </div>
                <BarChart3
                  className="size-5 text-[#9f5a41]"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-8 space-y-4">
                {MODEL_EVIDENCE.map((model) => {
                  const isSelected = selectedModelId === model.id

                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setSelectedModelId(model.id)}
                      aria-pressed={isSelected}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? "border-[#9f5a41]/35 bg-[#fff9f5] shadow-sm"
                          : "border-transparent hover:border-[#24372d]/10 hover:bg-[#faf9f6]"
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <span className="w-28 shrink-0">
                          <span className="block text-sm font-semibold">
                            {model.name}
                          </span>
                          {model.recommended && (
                            <span className="mt-1 block text-[0.62rem] font-bold tracking-[0.1em] text-[#a75236] uppercase">
                              Recomendado
                            </span>
                          )}
                        </span>
                        <span className="flex-1">
                          <span className="block h-2.5 overflow-hidden rounded-full bg-[#edeae4]">
                            <span
                              className={`block h-full rounded-full transition-all duration-500 ${model.barClass}`}
                              style={{ width: `${model.macroF1 * 100}%` }}
                            />
                          </span>
                        </span>
                        <span className="w-12 text-right font-mono text-sm font-semibold">
                          {formatMetric(model.macroF1)}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-[#24372d]/10 bg-[#efeae2] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span
                  className={`grid size-12 place-items-center rounded-2xl text-white ${selectedModel.dotClass}`}
                >
                  <CircleGauge className="size-5" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-[#24372d]/10 bg-white/70 px-3 py-1 text-[0.67rem] font-bold tracking-[0.1em] uppercase">
                  {selectedModel.shortName}
                </span>
              </div>

              <h3 className="mt-8 text-2xl font-semibold tracking-[-0.025em]">
                {selectedModel.name}
              </h3>
              <p className="mt-3 min-h-18 text-sm leading-6 text-[#606c65]">
                {selectedModel.summary}
              </p>

              <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-[#24372d]/10 pt-6">
                <div>
                  <dt className="text-[0.65rem] font-semibold tracking-[0.08em] text-[#6f7b74] uppercase">
                    Accuracy
                  </dt>
                  <dd className="mt-2 text-xl font-semibold">
                    {formatMetric(selectedModel.accuracy)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-semibold tracking-[0.08em] text-[#6f7b74] uppercase">
                    Balanced
                  </dt>
                  <dd className="mt-2 text-xl font-semibold">
                    {formatMetric(selectedModel.balancedAccuracy)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-semibold tracking-[0.08em] text-[#6f7b74] uppercase">
                    F1 macro
                  </dt>
                  <dd className="mt-2 text-xl font-semibold">
                    {formatMetric(selectedModel.macroF1)}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#20372c] text-white">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-3 lg:px-12 lg:py-20">
          {[
            {
              icon: Database,
              title: "Base histórica",
              body: "Encuestas de Stack Overflow 2024–2025, tratadas como contexto de investigación.",
            },
            {
              icon: ShieldCheck,
              title: "Uso responsable",
              body: "Nunca sustituye entrevistas, escucha activa ni criterio profesional de RR. HH.",
            },
            {
              icon: Users,
              title: "Piloto humano",
              body: "La siguiente fase debe validar utilidad, sesgos y comprensión con equipos reales.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <article key={title} className="border-t border-white/15 pt-6">
              <Icon className="size-5 text-[#d59072]" aria-hidden="true" />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#b7c5bd]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="siguiente-paso" className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="overflow-hidden rounded-[1.75rem] border border-[#24372d]/10 bg-[#f1ede7]">
            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              <div className="p-7 sm:p-10 lg:p-12">
                <p className="text-xs font-semibold tracking-[0.14em] text-[#a75236] uppercase">
                  Recomendación
                </p>
                <h2 className="font-editorial mt-4 max-w-2xl text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
                  Avanzar con un piloto pequeño y medible.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[#637068]">
                  Random Forest es el mejor candidato actual por F1 macro. Antes
                  de conectarlo al flujo del cliente, proponemos validar tres
                  aspectos con un grupo controlado.
                </p>

                <ol className="mt-8 space-y-4">
                  {[
                    "Revisar las variables disponibles y su calidad.",
                    "Contrastar resultados con contexto cualitativo.",
                    "Definir umbrales, responsables y criterios de parada.",
                  ].map((item, index) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-[#9f5a41] shadow-sm">
                        {index + 1}
                      </span>
                      <span className="pt-1 text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#assessment"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#bd6547] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#aa573c]"
                  >
                    Comparar con el flujo actual
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#modelo"
                    className="inline-flex items-center justify-center rounded-full border border-[#24372d]/15 bg-white px-6 py-3.5 text-sm font-semibold transition hover:bg-[#faf9f6]"
                  >
                    Volver al modelo
                  </a>
                </div>
              </div>

              <div className="flex min-h-80 items-center justify-center bg-[#dbc4b5] p-8 sm:p-12">
                <div className="w-full max-w-sm rounded-[1.5rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(75,54,42,0.12)] backdrop-blur sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[#20372c] text-white">
                      <Target className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs text-[#6d756f]">Decisión sugerida</p>
                      <p className="font-semibold">Piloto controlado</p>
                    </div>
                  </div>

                  <div className="mt-7 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#24372d]/10 pb-3 text-sm">
                      <span className="text-[#69746d]">Modelo inicial</span>
                      <span className="font-semibold">Random Forest</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#24372d]/10 pb-3 text-sm">
                      <span className="text-[#69746d]">Uso</span>
                      <span className="font-semibold">Orientativo</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#69746d]">Supervisión</span>
                      <span className="font-semibold text-[#52715c]">
                        Obligatoria
                      </span>
                    </div>
                  </div>

                  <div className="mt-7 flex items-center gap-2 rounded-xl bg-[#eff5f0] px-4 py-3 text-xs font-medium text-[#4f6e58]">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    Sin decisiones automatizadas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#24372d]/10 bg-[#f7f4ef]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-7 text-xs text-[#69746e] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <span className="flex items-center gap-2 font-semibold text-[#314039]">
            <Layers3 className="size-4" aria-hidden="true" />
            TalentCare · Propuesta experimental
          </span>
          <span>
            Evidencia histórica para apoyar conversaciones responsables.
          </span>
        </div>
      </footer>
    </main>
  )
}
