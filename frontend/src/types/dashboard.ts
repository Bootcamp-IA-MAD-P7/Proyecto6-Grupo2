import type { AssessmentTranslations } from "@/types/prediction-form"

export type LanguageCode = "en" | "es"

export type DashboardState = "loading" | "error" | "empty" | "success"

export type MetricId = "profiles" | "review" | "lowerSatisfaction" | "segments"

export type SegmentDimension =
  | "experience"
  | "education"
  | "employment"
  | "companySize"
  | "country"
  | "professionalRole"
  | "age"

export type SegmentStatus = "available" | "pending"

export interface UserProfile {
  id: string
  name: string
  role: string
  email?: string
  initials: string
  avatarUrl?: string
}

export interface WorkforceMetric {
  id: MetricId
  value: number
  format: "integer" | "percentage"
  highlighted?: boolean
}

export interface EvidenceData {
  segments: Array<{
    id: string
    value: number
    highlighted: boolean
  }>
  seniorRateMultiplier: number
  nextCohortDifference: number
}

export interface ExecutiveInsight {
  id: string
  evidence: EvidenceData
}

export interface SegmentData {
  dimension: SegmentDimension
  status: SegmentStatus
  items: Array<{
    id: string
    value: number
  }>
  highlightedSegmentId?: string
}

export interface AssociatedFactor {
  id: string
  value: number
}

export interface RecommendedAction {
  id: "earlyCareer" | "internalContext" | "listening"
  priority: "high" | "recommended" | "consider"
}

export interface MethodologyItem {
  id:
    | "prediction"
    | "source"
    | "target"
    | "limitations"
    | "oversight"
    | "privacy"
}

export interface DashboardOverview {
  isDemo: true
  profile: UserProfile
  metrics: WorkforceMetric[]
  executiveInsight: ExecutiveInsight
  segmentDimensions: SegmentData[]
  factors: AssociatedFactor[]
  actions: RecommendedAction[]
  methodology: MethodologyItem[]
}

export interface TranslationSection {
  title: string
  subtitle: string
}

export interface LoginTranslations {
  brand: {
    name: string
    descriptor: string
    tagline: string
    description: string
    principles: readonly string[]
    platformPrinciplesTitle: string
    platformPrinciples: readonly string[]
  }
  form: {
    title: string
    description: string
    emailLabel: string
    emailPlaceholder: string
    passwordLabel: string
    passwordPlaceholder: string
    rememberMe: string
    forgotPassword: string
    forgotPasswordUnavailable: string
    showPassword: string
    hidePassword: string
    submit: string
    submitting: string
    demoAccess: string
    newUserTitle: string
    newUserDescription: string
    futureAvailability: string
    emailRequired: string
    emailInvalid: string
    passwordRequired: string
  }
  trust: {
    title: string
    demoNotice: string
    dataUse: string
  }
}

export interface DashboardTranslations {
  common: {
    retry: string
    comingSoon: string
    close: string
    percentage: string
  }
  navigation: {
    productCategory: string
    overview: string
    assessment: string
    people: string
    insights: string
    actions: string
    methodology: string
    mainLabel: string
    openMenu: string
    closeMenu: string
  }
  language: {
    label: string
    english: string
    spanish: string
  }
  profile: {
    label: string
    role: string
  }
  legal: {
    copyright: string
    rights: string
  }
  hero: {
    eyebrow: string
    greeting: string
    subtitle: string
    context: string
  }
  insight: TranslationSection & {
    statement: string
    note: string
    explore: string
    evidenceTitle: string
    seniorRate: string
    nextCohort: string
    help: string
  }
  outlook: TranslationSection & {
    metricLabels: Record<MetricId, string>
    metricHelp: Partial<Record<MetricId, string>>
  }
  segments: TranslationSection & {
    selectorLabel: string
    dimensionLabels: Record<SegmentDimension, string>
    itemLabels: Record<string, string>
    contextTitles: Record<SegmentDimension, string>
    experienceInterpretation: string
    pendingTitle: string
    pendingDescription: string
    help: string
  }
  factors: TranslationSection & {
    labels: Record<string, string>
    helpLabel: string
    help: string
    interpretation: string
  }
  actions: TranslationSection & {
    priorityLabels: Record<RecommendedAction["priority"], string>
    items: Record<
      RecommendedAction["id"],
      { title: string; description: string; cta: string }
    >
    comingNext: string
  }
  methodology: TranslationSection & {
    viewMethodology: string
    items: Record<MethodologyItem["id"], { title: string; body: string }>
    responsibleLabel: string
    responsibleText: string
  }
  states: {
    loading: string
    loadingDescription: string
    error: string
    errorDescription: string
    empty: string
    emptyDescription: string
  }
  assessment: AssessmentTranslations
  login: LoginTranslations
}
