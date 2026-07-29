import { useState } from "react"
import {
  ArrowRight,
  BadgeEuro,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  CircleGauge,
  Database,
  HeartHandshake,
  Home,
  Info,
  Landmark,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  UserRoundSearch,
  Users,
  X,
} from "lucide-react"

type SegmentDimension =
  | "experience"
  | "age"
  | "salary"
  | "profession"
  | "companySize"

interface SegmentItem {
  label: string
  value: number
  profiles: number
  highlighted?: boolean
}

interface SegmentView {
  label: string
  question: string
  insight: string
  items: readonly SegmentItem[]
}

const SEGMENTS: Record<SegmentDimension, SegmentView> = {
  experience: {
    label: "Experiencia",
    question: "¿En qué momento profesional se concentra la señal?",
    insight:
      "Los perfiles con 3–5 años de experiencia muestran 12,2 puntos más de satisfacción baja o media que los perfiles con 11+ años.",
    items: [
      { label: "0–2 años", value: 38.1, profiles: 97 },
      { label: "3–5 años", value: 39.3, profiles: 805, highlighted: true },
      { label: "6–10 años", value: 32.7, profiles: 2217 },
      { label: "11+ años", value: 27.1, profiles: 5133 },
    ],
  },
  age: {
    label: "Edad",
    question: "¿Cómo cambia la señal entre generaciones?",
    insight:
      "El grupo de 18–24 años presenta 10,7 puntos más de satisfacción baja o media que el grupo de 45–54 años.",
    items: [
      { label: "18–24", value: 35.4, profiles: 1094, highlighted: true },
      { label: "25–34", value: 31.0, profiles: 3341 },
      { label: "35–44", value: 29.2, profiles: 2366 },
      { label: "45–54", value: 24.7, profiles: 999 },
      { label: "55–64", value: 25.1, profiles: 358 },
    ],
  },
  salary: {
    label: "Salario",
    question: "¿Qué relación aparece entre compensación y satisfacción?",
    insight:
      "Los salarios por debajo de 30k concentran 8,7 puntos más de satisfacción baja o media que el tramo de 60k–100k.",
    items: [
      { label: "< 30k", value: 36.4, profiles: 1830, highlighted: true },
      { label: "30k–60k", value: 30.6, profiles: 1650 },
      { label: "60k–100k", value: 27.7, profiles: 2470 },
      { label: "100k+", value: 26.6, profiles: 2302 },
    ],
  },
  profession: {
    label: "Profesión",
    question: "¿Qué colectivos profesionales merecen más escucha?",
    insight:
      "Estudiantes, perfiles de I+D y especialistas DevOps presentan las tasas históricas más elevadas entre las profesiones con muestra suficiente.",
    items: [
      { label: "Estudiantes", value: 41.2, profiles: 80, highlighted: true },
      { label: "I+D", value: 32.9, profiles: 85 },
      { label: "DevOps", value: 32.6, profiles: 95 },
      { label: "Data engineer", value: 29.1, profiles: 151 },
      { label: "Front-end", value: 28.8, profiles: 468 },
    ],
  },
  companySize: {
    label: "Tamaño de empresa",
    question: "¿Influye el tamaño de la organización?",
    insight:
      "Las diferencias por tamaño son pequeñas. Conviene buscar contexto interno antes de atribuir la señal a la dimensión de la empresa.",
    items: [
      { label: "10–19", value: 30.8, profiles: 396, highlighted: true },
      { label: "20–99", value: 30.4, profiles: 1565 },
      { label: "100–499", value: 30.0, profiles: 1508 },
      { label: "1.000–4.999", value: 30.3, profiles: 928 },
      { label: "10.000+", value: 29.6, profiles: 956 },
    ],
  },
}

const DIMENSIONS: readonly {
  id: SegmentDimension
  label: string
  icon: typeof Users
}[] = [
  { id: "experience", label: "Experiencia", icon: CalendarDays },
  { id: "age", label: "Edad", icon: Users },
  { id: "salary", label: "Salario", icon: BadgeEuro },
  { id: "profession", label: "Profesión", icon: BriefcaseBusiness },
  { id: "companySize", label: "Empresa", icon: Building2 },
]

const NAVIGATION = [
  { href: "#resumen", label: "Resumen", icon: Home },
  { href: "#personas", label: "Personas", icon: Users },
  { href: "#compensacion", label: "Compensación", icon: BadgeEuro },
  { href: "#retencion", label: "Retención", icon: UserRoundSearch },
  { href: "#igualdad", label: "Igualdad", icon: Landmark },
] as const

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
          <ShieldCheck className="size-4 text-[#dc987a]" aria-hidden="true" />
          Señal preventiva
        </div>
        <p className="mt-2 text-xs leading-5 text-[#9eada5]">
          Ayuda a priorizar colectivos para su revisión. No predice dimisiones
          ni sustituye el criterio de People.
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
  const [selectedDimension, setSelectedDimension] =
    useState<SegmentDimension>("experience")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const segment = SEGMENTS[selectedDimension]
  const maxSegmentValue = Math.max(...segment.items.map((item) => item.value))

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
                Inteligencia de personas
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
                  placeholder="Buscar colectivo"
                  className="h-10 w-44 rounded-xl border border-[#22352b]/10 bg-white pr-3 pl-9 text-sm outline-none placeholder:text-[#8b958f] focus:border-[#a75a3e]/40 xl:w-56"
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
              <button
                type="button"
                className="hidden items-center gap-2 rounded-xl border border-[#22352b]/10 bg-white px-3 py-2.5 text-xs font-semibold sm:flex"
              >
                Datos históricos 2024–2025
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </button>
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
                  ¿Dónde necesita actuar People?
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#69746e]">
                  Señales históricas para priorizar escucha, retención y equidad.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start rounded-full border border-[#63856c]/20 bg-[#f2f8f3] px-3 py-1.5 text-xs font-semibold text-[#52715b]">
                <span className="size-2 rounded-full bg-[#63856c]" />
                55.008 perfiles analizados
              </div>
            </div>

            <section className="client-rise mt-8 grid gap-5 xl:grid-cols-[1.42fr_0.58fr]">
              <article className="relative overflow-hidden rounded-[1.5rem] bg-[#20352b] p-6 text-white shadow-[0_20px_55px_rgba(31,52,42,0.14)] sm:p-8">
                <div
                  className="pointer-events-none absolute -top-28 -right-24 size-72 rounded-full border border-white/8 bg-white/4"
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[#c1cec7] uppercase">
                    <Sparkles className="size-4 text-[#dc9679]" aria-hidden="true" />
                    Insight prioritario
                  </div>
                  <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
                    <div>
                      <p className="font-editorial max-w-2xl text-3xl leading-tight tracking-[-0.035em] sm:text-[2.6rem]">
                        La etapa de 3–5 años de experiencia concentra la mayor
                        señal de menor satisfacción.
                      </p>
                      <p className="mt-5 max-w-xl text-sm leading-6 text-[#b8c6bf]">
                        El 39,3% presenta satisfacción histórica baja o media,
                        frente al 27,1% entre perfiles con más de 11 años.
                      </p>
                      <a
                        href="#retencion"
                        className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#efb39b]"
                      >
                        Ver acciones de retención
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </a>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-5">
                      <p className="text-xs text-[#b8c6bf]">
                        Diferencia frente a perfiles sénior
                      </p>
                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-4xl font-semibold tracking-[-0.04em]">
                          +12,2
                        </span>
                        <span className="mb-1 text-xs text-[#b8c6bf]">
                          puntos
                        </span>
                      </div>
                      <div className="mt-5 space-y-3">
                        <div>
                          <div className="flex justify-between text-[0.66rem] text-[#c5d0ca]">
                            <span>3–5 años</span>
                            <span>39,3%</span>
                          </div>
                          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[78.6%] rounded-full bg-[#dc9679]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[0.66rem] text-[#c5d0ca]">
                            <span>11+ años</span>
                            <span>27,1%</span>
                          </div>
                          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[54.2%] rounded-full bg-[#7fa08a]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <aside className="client-rise-delayed flex flex-col rounded-[1.5rem] border border-[#22352b]/9 bg-white p-6 shadow-[0_14px_45px_rgba(38,57,47,0.06)]">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-2xl bg-[#faeee9] text-[#a7563a]">
                    <Target className="size-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-[#fff4ef] px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.08em] text-[#a7563a] uppercase">
                    Atención
                  </span>
                </div>
                <h2 className="mt-6 text-xl font-semibold tracking-[-0.025em]">
                  Qué puede hacer People
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[#68746d]">
                  {[
                    "Activar entrevistas de permanencia.",
                    "Revisar progresión y expectativas.",
                    "Comparar compensación interna.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#bd6547]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto border-t border-[#22352b]/9 pt-5">
                  <p className="flex items-start gap-2 text-xs leading-5 text-[#68746d]">
                    <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    Analizar a nivel de colectivo; nunca convertir la señal en
                    una decisión automática sobre una persona.
                  </p>
                </div>
              </aside>
            </section>

            <section
              aria-label="Métricas de personas"
              className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4"
            >
              {[
                {
                  label: "Satisfacción baja o media",
                  value: "29,9%",
                  note: "2.467 de 8.252 perfiles de test",
                  icon: CircleGauge,
                  tone: "bg-[#fff3ef] text-[#aa5840]",
                },
                {
                  label: "Experiencia 3–5 años",
                  value: "39,3%",
                  note: "Segmento con mayor señal observada",
                  icon: CalendarDays,
                  tone: "bg-[#f8f0e3] text-[#9b733b]",
                },
                {
                  label: "Salario inferior a 30k",
                  value: "36,4%",
                  note: "+8,7 puntos vs. tramo 60k–100k",
                  icon: BadgeEuro,
                  tone: "bg-[#edf4ef] text-[#5d7b66]",
                },
                {
                  label: "Edad 18–24",
                  value: "35,4%",
                  note: "+10,7 puntos vs. 45–54",
                  icon: Users,
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

            <section id="personas" className="scroll-mt-24 pt-14">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#a7563a] uppercase">
                    Análisis de colectivos
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                    ¿Dónde se concentra la señal?
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-[#69746e]">
                  Explora variables disponibles en la fuente histórica.
                </p>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-[#22352b]/9 bg-white p-5 sm:p-7">
                <div className="flex flex-wrap gap-2">
                  {DIMENSIONS.map(({ id, label, icon: Icon }) => {
                    const selected = id === selectedDimension
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedDimension(id)}
                        aria-pressed={selected}
                        className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                          selected
                            ? "bg-[#24382e] text-white"
                            : "border border-[#22352b]/9 bg-[#f7f5f1] text-[#5f6b64] hover:bg-[#efede8]"
                        }`}
                      >
                        <Icon className="size-3.5" aria-hidden="true" />
                        {label}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{segment.question}</p>
                        <p className="mt-1 text-xs text-[#748078]">
                          % con satisfacción histórica baja o media
                        </p>
                      </div>
                      <BarChart3 className="size-5 text-[#a7563a]" aria-hidden="true" />
                    </div>

                    <div className="mt-7 space-y-5">
                      {segment.items.map((item) => (
                        <div key={item.label}>
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-2 text-sm font-medium">
                              {item.highlighted && (
                                <span className="size-2 rounded-full bg-[#bd6547]" />
                              )}
                              {item.label}
                            </span>
                            <span className="font-mono text-xs text-[#68746d]">
                              {item.value.toLocaleString("es-ES")}% ·{" "}
                              {item.profiles.toLocaleString("es-ES")} perfiles
                            </span>
                          </div>
                          <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-[#efede8]">
                            <div
                              className={`h-full rounded-full ${
                                item.highlighted ? "bg-[#bd6547]" : "bg-[#829b89]"
                              }`}
                              style={{
                                width: `${(item.value / maxSegmentValue) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <aside className="flex flex-col rounded-2xl bg-[#f2efe9] p-6">
                    <span className="grid size-11 place-items-center rounded-xl bg-white text-[#a7563a] shadow-sm">
                      <Sparkles className="size-5" aria-hidden="true" />
                    </span>
                    <p className="mt-6 text-[0.64rem] font-bold tracking-[0.12em] text-[#78827c] uppercase">
                      Insight de {segment.label.toLowerCase()}
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-7">
                      {segment.insight}
                    </p>
                    <div className="mt-5 rounded-xl bg-white p-3.5">
                      <p className="flex items-start gap-2 text-xs leading-5 text-[#526359]">
                        <Target
                          className="mt-0.5 size-3.5 shrink-0 text-[#a7563a]"
                          aria-hidden="true"
                        />
                        La señal predictiva también sitúa este colectivo entre
                        los grupos que conviene revisar primero.
                      </p>
                    </div>
                    <div className="mt-auto border-t border-[#22352b]/10 pt-5">
                      <p className="text-xs leading-5 text-[#68746d]">
                        La señal identifica una asociación, no una causa. Antes
                        de actuar, contrástala con datos internos y escucha directa.
                      </p>
                    </div>
                  </aside>
                </div>
              </div>
            </section>

            <section id="compensacion" className="scroll-mt-24 pt-14">
              <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                <article className="rounded-[1.5rem] border border-[#22352b]/9 bg-white p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-[#edf4ef] text-[#5d7b66]">
                      <BadgeEuro className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-[0.62rem] font-bold tracking-[0.1em] text-[#78827c] uppercase">
                      Compensación
                    </span>
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">
                    El tramo salarial más bajo merece una revisión específica.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#68746d]">
                    El 36,4% de los perfiles por debajo de 30k presenta
                    satisfacción baja o media. La diferencia se reduce a 27,7%
                    entre 60k y 100k.
                  </p>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#fff4ef] p-4">
                      <p className="text-xs text-[#8b695d]">Menos de 30k</p>
                      <p className="mt-1 text-2xl font-semibold text-[#9f533a]">
                        36,4%
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#f0f6f1] p-4">
                      <p className="text-xs text-[#68786d]">60k–100k</p>
                      <p className="mt-1 text-2xl font-semibold text-[#56725e]">
                        27,7%
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-[1.5rem] bg-[#20352b] p-6 text-white sm:p-8">
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#c3cec8] uppercase">
                    Preguntas para People
                  </p>
                  <ul className="mt-6 space-y-5">
                    {[
                      "¿Existen brechas salariales dentro del mismo rol y nivel?",
                      "¿La progresión compensa el aumento de responsabilidad?",
                      "¿Qué colectivos tienen menor acceso a promoción o bonus?",
                    ].map((question, index) => (
                      <li key={question} className="flex gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-[0.65rem] font-bold text-[#efb39b]">
                          {index + 1}
                        </span>
                        <span className="pt-1 text-sm leading-6 text-[#d1dcd6]">
                          {question}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </section>

            <section id="retencion" className="scroll-mt-24 pt-14">
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] text-[#a7563a] uppercase">
                  Plan de retención
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                  De la señal preventiva a una acción medible
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#68746d]">
                  La menor satisfacción puede preceder una desvinculación, pero
                  este modelo no predice la salida. Utiliza la señal para abrir
                  conversaciones y medir intervenciones.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    priority: "Ahora",
                    title: "Escucha de carrera temprana",
                    body: "Entrevistas de permanencia con perfiles de 0–5 años de experiencia.",
                    measure: "Medir expectativas, movilidad y apoyo.",
                    icon: UserRoundSearch,
                  },
                  {
                    priority: "30 días",
                    title: "Revisión de compensación",
                    body: "Analizar equidad interna en salarios inferiores a 30k por rol y nivel.",
                    measure: "Medir brechas ajustadas y promociones.",
                    icon: BadgeEuro,
                  },
                  {
                    priority: "90 días",
                    title: "Seguimiento de la señal",
                    body: "Cruzar satisfacción con salidas reales para construir un indicador de rotación.",
                    measure: "Medir dimisiones y tiempo hasta salida.",
                    icon: TrendingDown,
                  },
                ].map(({ priority, title, body, measure, icon: Icon }) => (
                  <article
                    key={priority}
                    className="rounded-2xl border border-[#22352b]/9 bg-white p-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-11 place-items-center rounded-xl bg-[#f5eee8] text-[#a7563a]">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-[#f4f2ed] px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.1em] text-[#6f7973] uppercase">
                        {priority}
                      </span>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#68746d]">{body}</p>
                    <p className="mt-5 border-t border-[#22352b]/8 pt-4 text-xs font-medium text-[#526359]">
                      {measure}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section id="igualdad" className="scroll-mt-24 pt-14">
              <div className="overflow-hidden rounded-[1.5rem] border border-[#22352b]/9 bg-white">
                <div className="grid xl:grid-cols-[0.94fr_1.06fr]">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-[#ebeff4] text-[#526780]">
                        <Landmark className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-semibold tracking-[0.1em] text-[#66726a] uppercase">
                        Planes de igualdad
                      </span>
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">
                      Para analizar igualdad faltan dos variables esenciales.
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[#68746d]">
                      La fuente histórica no contiene género ni departamento.
                      No es posible medir brechas salariales o de satisfacción
                      por esos ejes sin integrar el HRIS del cliente.
                    </p>

                    <div className="mt-7 rounded-xl border border-[#d9ad9e] bg-[#fff5f1] p-4">
                      <p className="flex gap-2 text-xs leading-5 text-[#87584a]">
                        <CircleAlert
                          className="mt-0.5 size-4 shrink-0"
                          aria-hidden="true"
                        />
                        No deben inferirse género ni departamento a partir de
                        nombres, profesiones u otras variables proxy.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#f2efe9] p-6 sm:p-8">
                    <p className="text-xs font-semibold tracking-[0.1em] text-[#6f7973] uppercase">
                      Preparación de datos
                    </p>
                    <div className="mt-5 space-y-3">
                      {[
                        { field: "Edad", status: "Disponible", ready: true },
                        { field: "Salario", status: "Disponible", ready: true },
                        { field: "Profesión", status: "Disponible", ready: true },
                        { field: "Tamaño de empresa", status: "Disponible", ready: true },
                        { field: "Género", status: "Conectar HRIS", ready: false },
                        { field: "Departamento", status: "Conectar HRIS", ready: false },
                        { field: "Salida / rotación", status: "Conectar HRIS", ready: false },
                      ].map(({ field, status, ready }) => (
                        <div
                          key={field}
                          className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3"
                        >
                          <span className="text-sm font-medium">{field}</span>
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                              ready ? "text-[#55745f]" : "text-[#a2583f]"
                            }`}
                          >
                            {ready && <Check className="size-3.5" aria-hidden="true" />}
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-8">
              <div className="flex items-start gap-3 rounded-xl border border-[#d8c5a3] bg-[#fffaf0] p-4">
                <Info
                  className="mt-0.5 size-4 shrink-0 text-[#9b733b]"
                  aria-hidden="true"
                />
                <p className="text-xs leading-5 text-[#766446]">
                  <strong>Alcance:</strong> el dashboard muestra asociaciones
                  históricas con satisfacción laboral. Para anticipar abandono
                  y estimar su coste económico deben incorporarse salidas reales,
                  antigüedad, departamento, género y costes de reemplazo del cliente.
                </p>
              </div>
            </section>

            <footer className="mt-10 flex flex-col gap-3 border-t border-[#22352b]/9 py-7 text-xs text-[#748078] sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2 font-semibold text-[#35453d]">
                <HeartHandshake className="size-4" aria-hidden="true" />
                TalentCare · People intelligence
              </span>
              <span>
                Fuente histórica: Stack Overflow Developer Survey 2024–2025
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
