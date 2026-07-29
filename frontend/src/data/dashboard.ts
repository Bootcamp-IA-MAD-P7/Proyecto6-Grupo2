import type { DashboardOverview, DashboardState } from "@/types/dashboard"

// Demonstration-only values approved for the validated prototype.
export const dashboardMock: DashboardOverview = {
  isDemo: true,
  profile: {
    id: "demo-hr-director",
    name: "Julián Álvarez",
    role: "HR Director",
    email: "julian.alvarez@talentcare.demo",
    initials: "JA",
  },
  metrics: [
    { id: "profiles", value: 1248, format: "integer" },
    { id: "review", value: 130, format: "integer" },
    {
      id: "lowerSatisfaction",
      value: 10.4,
      format: "percentage",
      highlighted: true,
    },
    { id: "segments", value: 4, format: "integer" },
  ],
  executiveInsight: {
    id: "early-career-concentration",
    evidence: {
      segments: [
        { id: "0-2", value: 18.4, highlighted: true },
        { id: "3-5", value: 11.2, highlighted: false },
        { id: "6-10", value: 8.7, highlighted: false },
        { id: "11-plus", value: 6.1, highlighted: false },
      ],
      seniorRateMultiplier: 3,
      nextCohortDifference: 7.2,
    },
  },
  segmentDimensions: [
    {
      dimension: "experience",
      status: "available",
      highlightedSegmentId: "0-2",
      items: [
        { id: "0-2", value: 18.4 },
        { id: "3-5", value: 11.2 },
        { id: "6-10", value: 8.7 },
        { id: "11-plus", value: 6.1 },
      ],
    },
    { dimension: "education", status: "pending", items: [] },
    { dimension: "employment", status: "pending", items: [] },
    { dimension: "companySize", status: "pending", items: [] },
    { dimension: "country", status: "pending", items: [] },
    { dimension: "professionalRole", status: "pending", items: [] },
    { dimension: "age", status: "pending", items: [] },
  ],
  factors: [
    { id: "experience", value: 28 },
    { id: "salary", value: 22 },
    { id: "employment", value: 16 },
    { id: "education", value: 13 },
    { id: "role", value: 10 },
    { id: "companySize", value: 6 },
    { id: "country", value: 3 },
    { id: "age", value: 2 },
  ],
  actions: [
    { id: "earlyCareer", priority: "high" },
    { id: "internalContext", priority: "recommended" },
    { id: "listening", priority: "consider" },
  ],
  methodology: [
    { id: "prediction" },
    { id: "source" },
    { id: "target" },
    { id: "limitations" },
    { id: "oversight" },
    { id: "privacy" },
  ],
}

// Change only during development to exercise interface states.
export const DASHBOARD_DEMO_STATE: DashboardState = "success"
