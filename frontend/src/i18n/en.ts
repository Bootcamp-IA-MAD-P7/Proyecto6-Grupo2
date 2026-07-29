import type { DashboardTranslations } from "@/types/dashboard"

export const en: DashboardTranslations = {
  common: {
    retry: "Retry",
    comingSoon: "Coming soon",
    close: "Close",
    percentage: "percentage",
  },
  navigation: {
    productCategory: "PEOPLE ANALYTICS",
    overview: "Overview",
    people: "People",
    insights: "Insights",
    methodology: "Methodology",
    mainLabel: "Main navigation",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
  },
  language: {
    label: "Language",
    english: "English",
    spanish: "Español",
  },
  profile: { label: "Signed-in user", role: "HR Director" },
  legal: {
    copyright: "© 2026 TalentCare",
    rights: "All rights reserved.",
  },
  hero: {
    eyebrow: "WORKFORCE SATISFACTION INTELLIGENCE",
    greeting: "Good morning, Julián.",
    subtitle: "Your latest workforce analysis is ready.",
    context:
      "1,248 profiles analysed · 130 profiles requiring review · 4 workforce segments compared",
  },
  insight: {
    title: "What deserves HR’s attention today?",
    subtitle: "The most relevant pattern identified in the current analysis.",
    statement:
      "Early-career professionals show the highest concentration of profiles associated with predicted lower job satisfaction.",
    note:
      "This historical pattern can help prioritise further review, but it does not represent a conclusion about individual employees.",
    explore: "Explore this segment",
    evidenceTitle: "Evidence",
    seniorRate: "Higher rate than senior profiles",
    nextCohort: "Above the next cohort",
    help:
      "Predicted lower satisfaction is a model output derived from historical survey patterns. It is not a measure of an individual employee’s actual satisfaction.",
  },
  outlook: {
    title: "What is the current workforce satisfaction outlook?",
    subtitle:
      "A concise view of the profiles and signals included in this analysis.",
    metricLabels: {
      profiles: "Profiles analysed",
      review: "Profiles requiring review",
      lowerSatisfaction: "Predicted lower satisfaction",
      segments: "Segments compared",
    },
    metricHelp: {
      review:
        "Profiles associated with the model output that merit contextual human review.",
      lowerSatisfaction:
        "The share of analysed profiles associated with predicted lower satisfaction. It is not observed employee sentiment.",
      segments:
        "Groups created from compatible survey attributes for comparative analysis.",
    },
  },
  segments: {
    title: "Where should HR focus first?",
    subtitle:
      "Compare professional segments to identify where historical lower-satisfaction patterns appear more frequently.",
    selectorLabel: "Segment dimension",
    dimensionLabels: {
      experience: "Experience",
      education: "Education",
      employment: "Employment",
      companySize: "Company size",
      country: "Country",
      professionalRole: "Professional role",
      age: "Age",
    },
    itemLabels: {
      "0-2": "0–2 years",
      "3-5": "3–5 years",
      "6-10": "6–10 years",
      "11-plus": "11+ years",
    },
    contextTitles: {
      experience: "Predicted lower satisfaction by experience",
      education: "Predicted lower satisfaction by education",
      employment: "Predicted lower satisfaction by employment",
      companySize: "Predicted lower satisfaction by company size",
      country: "Predicted lower satisfaction by country",
      professionalRole: "Predicted lower satisfaction by professional role",
      age: "Predicted lower satisfaction by age",
    },
    experienceInterpretation:
      "The historical signal appears most frequently among profiles with 0–2 years of professional experience. Review this pattern alongside onboarding, development and manager feedback data.",
    pendingTitle: "Validated comparison data is not available yet",
    pendingDescription:
      "This dimension is prepared for integration, but no percentages are shown until a validated data source is connected.",
    help:
      "Segment comparisons show how frequently the model output appears within each historical survey group. They do not describe teams or individual employees.",
  },
  factors: {
    title: "What factors influence this prediction?",
    subtitle:
      "The variables that contribute most strongly to the current model output. Association does not imply causation.",
    labels: {
      experience: "Years of professional experience",
      salary: "Annual salary",
      employment: "Employment type",
      education: "Education level",
      role: "Professional role",
      companySize: "Company size",
      country: "Country",
      age: "Age",
    },
    helpLabel: "Feature importance",
    help:
      "Feature importance indicates how strongly a variable contributes to the model output across the analysed data. It does not show direction or causation.",
    interpretation:
      "Years of professional experience and annual salary show the strongest association with the model output. These variables reflect structural aspects of a professional’s career stage and do not imply that salary alone causes dissatisfaction.",
  },
  actions: {
    title: "What actions should HR consider?",
    subtitle:
      "Suggested next steps to validate the observed pattern before making organisational decisions.",
    priorityLabels: {
      high: "High priority",
      recommended: "Recommended",
      consider: "Consider",
    },
    items: {
      earlyCareer: {
        title: "Review the early-career segment",
        description:
          "Compare the signal with onboarding, development and manager feedback data.",
        cta: "Explore segment",
      },
      internalContext: {
        title: "Contrast the pattern with internal context",
        description:
          "Validate whether the historical association is also visible in the organisation.",
        cta: "Review context",
      },
      listening: {
        title: "Prepare a focused listening action",
        description:
          "Use surveys, interviews or focus groups to understand the professional experience behind the signal.",
        cta: "Prepare action",
      },
    },
    comingNext: "Coming next: this workflow will connect to an HR action plan.",
  },
  methodology: {
    title: "How should these insights be interpreted?",
    subtitle:
      "Understand the model, data source and limitations before using the results.",
    viewMethodology: "View methodology",
    items: {
      prediction: {
        title: "What the model predicts",
        body:
          "The model estimates whether a historical survey profile is associated with lower job satisfaction. It does not measure current employee sentiment.",
      },
      source: {
        title: "Data source",
        body:
          "The demonstration uses historical Stack Overflow Developer Survey data. Survey respondents are not employees of the organisation.",
      },
      target: {
        title: "Target definition",
        body:
          "The target is a binary model output derived from survey responses. Intermediate risk levels are not produced.",
      },
      limitations: {
        title: "Model limitations",
        body:
          "Results depend on the coverage, representativeness and quality of historical data and should not be generalised without validation.",
      },
      oversight: {
        title: "Human oversight",
        body:
          "Qualified HR professionals must review the organisational context before considering any action.",
      },
      privacy: {
        title: "Privacy and ethical use",
        body:
          "Use only the minimum necessary data, communicate limitations clearly and avoid decisions based solely on a prediction.",
      },
    },
    responsibleLabel: "RESPONSIBLE USE",
    responsibleText:
      "TalentCare supports professional HR judgement. Predictions must not be used as the sole basis for decisions affecting individuals.",
  },
  states: {
    loading: "Preparing your workforce analysis",
    loadingDescription: "Reviewing the latest demonstration data.",
    error: "The analysis could not be loaded",
    errorDescription: "Please try again. No data has been changed.",
    empty: "No analysis is available yet",
    emptyDescription:
      "Connect a validated data source to display workforce insights.",
  },
}
