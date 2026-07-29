import { useState } from "react"
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  BrainCircuit,
  ChevronRight,
  CircleGauge,
  Database,
  HeartHandshake,
  Home,
  Info,
  Layers3,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react"

type ModelId = "catboost" | "lightgbm" | "randomForest" | "ensemble"

interface ModelMetric {
  id: ModelId
  name: string
  accuracy: number
  balancedAccuracy: number
  macroF1: number
  insight: string
  color: string
  softColor: string
  recommended?: boolean
}

const MODELS: readonly ModelMetric[] = [
  {
    id: "catboost",
    name: "CatBoost",
    accuracy: 0.444,
    balancedAccuracy: 0.408,
    macroF1: 0.349,
    insight:
      "Detecta más perfiles minoritarios, pero genera demasiadas alertas poco precisas.",
    color: "bg-[#71907c]",
    softColor: "bg-[#edf4ef]",
  },
  {
    id: "lightgbm",
    name: "LightGBM",
    accuracy: 0.701,
    balancedAccuracy: 0.335,
    macroF1: 0.279,
    insight:
      "Su accuracy es alta porque favorece la clase mayoritaria; pierde equilibrio.",
    color: "bg-[#bd8e4b]",
    softColor: "bg-[#f8f0e3]",
  },
  {
    id: "randomForest",
    name: "Random Forest",
    accuracy: 0.591,
    balancedAccuracy: 0.384,
    macroF1: 0.384,
    insight:
      "Ofrece el mejor equilibrio entre las tres clases y es el candidato al piloto.",
    color: "bg-[#bd6547]",
    softColor: "bg-[#faeee9]",
    recommended: true,
  },
  {
    id: "ensemble",
    name: "Ensemble",
    accuracy: 0.448,
    balancedAccuracy: 0.406,
    macroF1: 0.346,
    insight:
      "Mejora el recall de satisfacción baja, pero no supera el F1 de Random Forest.",
    color: "bg-[#526780]",
    softColor: "bg-[#ebeff4]",
  },
]

const NAVIGATION = [
  { href: "#resumen", label: "Resumen", icon: Home },
  { href: "#insights", label: "Insights", icon: Sparkles },
  { href: "#modelos", label: "Modelos", icon: BrainCircuit },
  { href: "#acciones", label: "Acciones", icon: Target },
] as const

const DISTRIBUTION = [
  {
    label: "Satisfacción baja",
    value: 7.23,
    count: "597",
    color: "bg-[#b95f49]",
    text: "text-[#99503e]",
    soft: "bg-[#fff3ef]",
  },
  {
    label: "Satisfacción media",
    value: 22.66,
    count: "1.870",
    color: "bg-[#bd914d]",
    text: "text-[#8f6d35]",
    soft: "bg-[#fff8ec]",
  },
  {
    label: "Satisfacción alta",
    value: 70.11,
    count: "5.785",
    color: "bg-[#63856c]",
    text: "text-[#52715b]",
    soft: "bg-[#f0f7f2]",
  },
] as const

function formatMetric(value: number): string {
  return value.toLocaleString("es-ES", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
}

function DashboardSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen flex-col bg-[#1f2e27] px-5 py-6 text-white lg:flex">
      <a href="#resumen" className="flex items-center gap-3 px-2">
        <span className="grid size-11 place-items-center rounded-xl bg-white/10">
          <HeartHandshake className="size-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-lg font-semibold tracking-[-0.025em]">
            TalentCare
          </span>
          <span className="block text-[0.62rem] font-semibold tracking-[0.14em] text-[#aebbb4] uppercase">
            People intelligence
          </span>
        </span>
      </a>

      <nav className="mt-12 space-y-1" aria-label="Navegación principal">
        {NAVIGATION.map(({ href, label, icon: Icon }, index) => (
          <a
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
              index === 0
                ? "bg-white/10 font-semibold text-white"
                : "text-[#b4c0ba] hover:bg-white/6 hover:text-white"
            }`}
          >
            <Icon className="size-4.5" aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#d2ddd7]">
          <ShieldCheck className="size-4 text-[#d99275]" aria-hidden="true" />
          Entorno experimental
        </div>
        <p className="mt-2 text-xs leading-5 text-[#9eada5]">
          Los resultados orientan una revisión humana. No automatizan decisiones.
        </p>
      </div>

      <div className="mt-auto border-t border-white/10 pt-5">
        <div className="flex items-center gap-3 px-2">
          <span className="grid size-9 place-items-center rounded-full bg-[#d5a38e] text-xs font-bold text-[#49342c]">
            TC
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              Equipo de Personas
            </span>
            <span className="block truncate text-xs text-[#9eada5]">
              Vista ejecutiva
            </span>
          </span>
        </div>
      </div>
    </aside>
  )
}

export function EnsembleClientPage() {
  const [selectedModelId, setSelectedModelId] =
    useState<ModelId>("randomForest")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const selectedModel =
    MODELS.find((model) => model.id === selectedModelId) ?? MODELS[2]

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-[#17211c] lg:grid lg:grid-cols-[250px_1fr]">
      <DashboardSidebar />

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-[#22352b]/8 bg-[#f6f5f2]/92 backdrop-blur">
          <div className="flex h-17 items-center justify-between gap-4 px-5 sm:px-8 xl:px-10">
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="grid size-10 place-items-center rounded-xl border border-[#22352b]/10 bg-white"
                aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="size-5" aria-hidden="true" />
                ) : (
                  <Menu className="size-5" aria-hidden="true" />
                )}
              </button>
              <span className="font-semibold">TalentCare</span>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <CircleGauge className="size-4 text-[#a75a3e]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-[0.08em] text-[#68746d] uppercase">
                Dashboard ejecutivo
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative hidden sm:block">
                <span className="sr-only">Buscar en el dashboard</span>
                <Search
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7d8881]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Buscar"
                  className="h-10 w-40 rounded-xl border border-[#22352b]/10 bg-white pr-3 pl-9 text-sm outline-none placeholder:text-[#8b958f] focus:border-[#a75a3e]/40 xl:w-52"
                />
              </label>
              <button
                type="button"
                className="relative grid size-10 place-items-center rounded-xl border border-[#22352b]/10 bg-white"
                aria-label="Notificaciones"
              >
                <Bell className="size-4.5" aria-hidden="true" />
                <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-[#bd6547]" />
              </button>
              <a
                href="#assessment"
                className="hidden rounded-xl bg-[#24382e] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#18271f] sm:inline-flex"
              >
                Flujo actual
              </a>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav
              className="border-t border-[#22352b]/8 bg-white px-5 py-3 lg:hidden"
              aria-label="Navegación móvil"
            >
              <div className="grid grid-cols-2 gap-2">
                {NAVIGATION.map(({ href, label, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg bg-[#f5f3ef] px-3 py-2.5 text-sm font-medium"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </a>
                ))}
              </div>
            </nav>
          )}
        </header>

        <main className="px-5 py-8 sm:px-8 xl:px-10 xl:py-9">
          <div id="resumen" className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-[#69746e]">
                  Miércoles, 30 de julio
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                  Buenos días, equipo.
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#69746e]">
                  Esta es la lectura prioritaria del modelo de satisfacción.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start rounded-full border border-[#bd6547]/20 bg-[#fff8f4] px-3 py-1.5 text-xs font-semibold text-[#9c4f35]">
                <span className="size-2 animate-pulse rounded-full bg-[#bd6547]" />
                Modelo experimental · Test 2024–2025
              </div>
            </div>

            <section className="client-rise mt-8 grid gap-5 xl:grid-cols-[1.45fr_0.55fr]">
              <article className="relative overflow-hidden rounded-[1.5rem] bg-[#20352b] p-6 text-white shadow-[0_20px_55px_rgba(31,52,42,0.14)] sm:p-8">
                <div
                  className="pointer-events-none absolute -top-28 -right-24 size-72 rounded-full border border-white/8 bg-white/4"
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[#c1cec7] uppercase">
                    <Sparkles className="size-4 text-[#dc9679]" aria-hidden="true" />
                    Insight principal
                  </div>
                  <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
                    <div>
                      <p className="font-editorial max-w-2xl text-3xl leading-tight tracking-[-0.035em] sm:text-4xl">
                        3 de cada 10 perfiles históricos muestran señales bajas
                        o medias de satisfacción.
                      </p>
                      <p className="mt-5 max-w-xl text-sm leading-6 text-[#b8c6bf]">
                        No es una medida de la plantilla actual. Es una señal
                        para decidir dónde conviene escuchar con más atención.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-5">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs text-[#b8c6bf]">
                            Perfiles para revisión contextual
                          </p>
                          <p className="mt-1 text-4xl font-semibold tracking-[-0.04em]">
                            29,9%
                          </p>
                        </div>
                        <TrendingUp
                          className="mb-1 size-5 text-[#dc9679]"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-white/10">
                        {DISTRIBUTION.map((item) => (
                          <span
                            key={item.label}
                            className={`h-full ${item.color}`}
                            style={{ width: `${item.value}%` }}
                          />
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[0.66rem] text-[#b8c6bf]">
                        {DISTRIBUTION.map((item) => (
                          <span key={item.label} className="flex items-center gap-1.5">
                            <span className={`size-2 rounded-full ${item.color}`} />
                            {item.label.replace("Satisfacción ", "")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <aside className="client-rise-delayed flex flex-col rounded-[1.5rem] border border-[#22352b]/9 bg-white p-6 shadow-[0_14px_45px_rgba(38,57,47,0.06)]">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-2xl bg-[#faeee9] text-[#a7563a]">
                    <Info className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-[0.65rem] font-semibold tracking-[0.1em] text-[#758078] uppercase">
                    Lectura ejecutiva
                  </span>
                </div>
                <h2 className="mt-6 text-xl font-semibold tracking-[-0.025em]">
                  Qué significa
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#68746d]">
                  La distribución está muy concentrada en satisfacción alta.
                  Por eso la accuracy, por sí sola, puede dar una falsa sensación
                  de rendimiento.
                </p>
                <div className="mt-auto border-t border-[#22352b]/9 pt-5">
                  <p className="text-xs font-semibold text-[#263a30]">
                    Decisión recomendada
                  </p>
                  <p className="mt-1.5 text-xs leading-5 text-[#68746d]">
                    Priorizar F1 macro y supervisión humana durante el piloto.
                  </p>
                </div>
              </aside>
            </section>

            <section
              aria-label="Métricas principales"
              className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4"
            >
              {[
                {
                  label: "Perfiles analizados",
                  value: "55.008",
                  note: "Train, validación y test",
                  icon: Database,
                  tone: "bg-[#edf4ef] text-[#5d7b66]",
                },
                {
                  label: "Señal baja + media",
                  value: "29,9%",
                  note: "Sobre el conjunto de test",
                  icon: Activity,
                  tone: "bg-[#fff3ef] text-[#aa5840]",
                },
                {
                  label: "Mejor F1 macro",
                  value: "0,384",
                  note: "Random Forest",
                  icon: CircleGauge,
                  tone: "bg-[#f8f0e3] text-[#9b733b]",
                },
                {
                  label: "Recall clase baja",
                  value: "46%",
                  note: "Ensemble · test",
                  icon: Target,
                  tone: "bg-[#ebeff4] text-[#526780]",
                },
              ].map(({ label, value, note, icon: Icon, tone }) => (
                <article
                  key={label}
                  className="rounded-2xl border border-[#22352b]/9 bg-white p-5 shadow-[0_10px_35px_rgba(38,57,47,0.045)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-[#748078]">{label}</p>
                      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                        {value}
                      </p>
                    </div>
                    <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>
                      <Icon className="size-4.5" aria-hidden="true" />
                    </span>
                  </div>
                  <p className="mt-4 border-t border-[#22352b]/8 pt-3 text-xs text-[#748078]">
                    {note}
                  </p>
                </article>
              ))}
            </section>

            <section id="insights" className="scroll-mt-24 pt-14">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#a7563a] uppercase">
                    Narrativa de datos
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                    De la señal a la decisión
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-[#69746e]">
                  Tres lecturas conectadas para evitar conclusiones aisladas.
                </p>
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <article className="rounded-[1.4rem] border border-[#22352b]/9 bg-white p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        Distribución de satisfacción
                      </p>
                      <p className="mt-1 text-xs text-[#748078]">
                        Conjunto de test · 8.252 perfiles
                      </p>
                    </div>
                    <BarChart3 className="size-5 text-[#a7563a]" aria-hidden="true" />
                  </div>

                  <div className="mt-8 space-y-6">
                    {DISTRIBUTION.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between gap-4 text-sm">
                          <span className="font-medium">{item.label}</span>
                          <span className="font-mono text-xs text-[#69746e]">
                            {item.count} · {item.value.toLocaleString("es-ES")}%
                          </span>
                        </div>
                        <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-[#efede8]">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-xl bg-[#f5f3ee] p-4">
                    <p className="text-xs leading-5 text-[#5f6b64]">
                      <strong className="text-[#263a30]">Insight:</strong> siete
                      de cada diez perfiles pertenecen a la clase alta. Una
                      métrica global puede ocultar fallos en los grupos menos
                      frecuentes.
                    </p>
                  </div>
                </article>

                <div className="space-y-4">
                  {[
                    {
                      number: "01",
                      eyebrow: "Qué vemos",
                      title: "La clase alta domina el conjunto.",
                      body: "LightGBM alcanza 70,1% de accuracy, pero su F1 macro cae a 0,279.",
                      tone: "border-[#d7bf91] bg-[#fffaf0]",
                    },
                    {
                      number: "02",
                      eyebrow: "Qué significa",
                      title: "Acertar la mayoría no basta.",
                      body: "El modelo debe mantener utilidad también para las señales bajas y medias.",
                      tone: "border-[#d8a797] bg-[#fff6f2]",
                    },
                    {
                      number: "03",
                      eyebrow: "Qué hacemos",
                      title: "Pilotar Random Forest con contexto humano.",
                      body: "Es el candidato con mejor F1 macro y una complejidad operativa razonable.",
                      tone: "border-[#aac4b1] bg-[#f3f8f4]",
                    },
                  ].map((item) => (
                    <article
                      key={item.number}
                      className={`rounded-2xl border p-5 ${item.tone}`}
                    >
                      <div className="flex gap-4">
                        <span className="font-mono text-xs font-bold text-[#8a5d49]">
                          {item.number}
                        </span>
                        <div>
                          <p className="text-[0.64rem] font-bold tracking-[0.12em] text-[#737e77] uppercase">
                            {item.eyebrow}
                          </p>
                          <h3 className="mt-1.5 text-base font-semibold">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-xs leading-5 text-[#657169]">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section id="modelos" className="scroll-mt-24 pt-14">
              <div className="rounded-[1.5rem] border border-[#22352b]/9 bg-white p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-[#a7563a] uppercase">
                      Comparativa de modelos
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                      El equilibrio cambia la decisión.
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-[#f4f2ed] px-3 py-1.5 text-xs text-[#66726a]">
                    <Info className="size-3.5" aria-hidden="true" />
                    Métricas sobre test
                  </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-3">
                    {MODELS.map((model) => {
                      const selected = model.id === selectedModelId

                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => setSelectedModelId(model.id)}
                          aria-pressed={selected}
                          className={`w-full rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-[#bd6547]/30 bg-[#fff9f6] shadow-sm"
                              : "border-[#22352b]/7 hover:bg-[#f8f7f4]"
                          }`}
                        >
                          <span className="flex items-center gap-4">
                            <span className="w-30 shrink-0 text-sm font-semibold">
                              {model.name}
                              {model.recommended && (
                                <span className="mt-1 block text-[0.58rem] font-bold tracking-[0.1em] text-[#aa583e] uppercase">
                                  Recomendado
                                </span>
                              )}
                            </span>
                            <span className="flex-1">
                              <span className="block h-2.5 overflow-hidden rounded-full bg-[#eceae5]">
                                <span
                                  className={`block h-full rounded-full ${model.color}`}
                                  style={{ width: `${model.macroF1 * 100}%` }}
                                />
                              </span>
                            </span>
                            <span className="w-13 text-right font-mono text-sm font-semibold">
                              {formatMetric(model.macroF1)}
                            </span>
                            <ChevronRight
                              className={`size-4 transition ${selected ? "text-[#aa583e]" : "text-[#a1aaa4]"}`}
                              aria-hidden="true"
                            />
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <aside className={`rounded-2xl p-6 ${selectedModel.softColor}`}>
                    <div className="flex items-center justify-between">
                      <span className={`grid size-11 place-items-center rounded-xl text-white ${selectedModel.color}`}>
                        <BrainCircuit className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-[0.62rem] font-bold tracking-[0.1em] text-[#66726a] uppercase">
                        Modelo seleccionado
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">
                      {selectedModel.name}
                    </h3>
                    <p className="mt-3 min-h-16 text-sm leading-6 text-[#5f6b64]">
                      {selectedModel.insight}
                    </p>
                    <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-[#22352b]/10 pt-5">
                      <div>
                        <dt className="text-[0.6rem] font-semibold text-[#748078] uppercase">
                          Accuracy
                        </dt>
                        <dd className="mt-1.5 text-lg font-semibold">
                          {formatMetric(selectedModel.accuracy)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.6rem] font-semibold text-[#748078] uppercase">
                          Balanced
                        </dt>
                        <dd className="mt-1.5 text-lg font-semibold">
                          {formatMetric(selectedModel.balancedAccuracy)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.6rem] font-semibold text-[#748078] uppercase">
                          F1 macro
                        </dt>
                        <dd className="mt-1.5 text-lg font-semibold">
                          {formatMetric(selectedModel.macroF1)}
                        </dd>
                      </div>
                    </dl>
                  </aside>
                </div>
              </div>
            </section>

            <section id="acciones" className="scroll-mt-24 pt-14">
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] text-[#a7563a] uppercase">
                  Acciones recomendadas
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                  Qué conviene hacer ahora
                </h2>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    priority: "Prioridad 1",
                    title: "Validar con contexto real",
                    body: "Contrastar las señales con entrevistas, escucha activa y conocimiento del equipo.",
                    icon: Users,
                  },
                  {
                    priority: "Prioridad 2",
                    title: "Medir errores por clase",
                    body: "Seguir precision, recall y F1 de cada grupo; no solo la accuracy global.",
                    icon: Activity,
                  },
                  {
                    priority: "Prioridad 3",
                    title: "Definir límites de uso",
                    body: "Acordar responsables, umbrales y situaciones en las que el modelo no debe intervenir.",
                    icon: ShieldCheck,
                  },
                ].map(({ priority, title, body, icon: Icon }) => (
                  <article
                    key={priority}
                    className="group rounded-2xl border border-[#22352b]/9 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(38,57,47,0.07)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-11 place-items-center rounded-xl bg-[#f4eee8] text-[#a7563a]">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-[0.62rem] font-bold tracking-[0.1em] text-[#78827c] uppercase">
                        {priority}
                      </span>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#68746d]">{body}</p>
                    <a
                      href="#modelos"
                      className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#9f5339]"
                    >
                      Revisar evidencia
                      <ArrowRight
                        className="size-3.5 transition group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </article>
                ))}
              </div>
            </section>

            <footer className="mt-14 flex flex-col gap-3 border-t border-[#22352b]/9 py-7 text-xs text-[#748078] sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2 font-semibold text-[#35453d]">
                <Layers3 className="size-4" aria-hidden="true" />
                TalentCare · Dashboard experimental
              </span>
              <span>
                Fuente: Stack Overflow Developer Survey 2024–2025
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
