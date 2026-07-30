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
    assessment: "Profile comparison",
    people: "Workforce Profile",
    insights: "Attention Areas",
    actions: "Preventive Actions",
    methodology: "Methodology & Data",
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
  assessment: {
    form: {
      title: "Workforce Assessment",
      description:
        "Review how a professional profile aligns with historical workforce satisfaction patterns.",
      intro: {
        purpose:
          "Use this assessment to identify where additional HR context may be valuable.",
        estimatedTime: "Takes less than 1 minute",
      },
      fields: {
        YearsCodeNum: {
          label: "Professional coding experience",
          description: "Total years of coding experience.",
          placeholder: "e.g. 5",
        },
        ConvertedCompYearly: {
          label: "Annual salary (USD)",
          description: "Annual compensation before deductions, in US dollars.",
          placeholder: "e.g. 75000",
        },
        MainBranch: {
          label: "Professional role",
          placeholder: "Select a professional role",
        },
        Employment: {
          label: "Employment status",
          placeholder: "Select an employment status",
        },
        EdLevel: {
          label: "Education level",
          placeholder: "Select an education level",
        },
        Age: {
          label: "Age range",
          placeholder: "Select an age range",
        },
        OrgSize: {
          label: "Organisation size",
          placeholder: "Select an organisation size",
        },
        Country: {
          label: "Country of employment",
          placeholder: "Select a country of employment",
        },
      },
      validation: {
        required: "This field is required.",
        invalidNumber: "Enter a valid number.",
        minimum: (minimum) => `Enter a value of ${minimum} or more.`,
        maximum: (maximum) =>
          `Enter a value no greater than ${maximum.toLocaleString("en-US")}.`,
      },
      errorSummaryTitle: "Review the highlighted fields",
      submit: "Run assessment",
      submitting: "Running assessment…",
      responsibleUse: {
        title: "Responsible AI",
        items: [
          "Supports HR professionals.",
          "Human review is always required.",
          "Historical patterns do not replace professional judgement.",
        ],
      },
      privacy: {
        title: "Privacy notice",
        noIdentifiers: "No personal identifiers are collected.",
        assessmentUse:
          "The information entered is used only to generate this assessment.",
      },
    },
    options: {
      MainBranch: [
        {
          value: "I am a developer by profession",
          label: "Developer by profession",
        },
      ],
      Employment: [
        {
          value: "Employed, full-time",
          label: "Employed, full-time",
        },
      ],
      EdLevel: [
        {
          value: "Bachelor's degree",
          label: "Bachelor's degree",
        },
      ],
      Age: [
        {
          value: "25-34 years old",
          label: "25–34 years old",
        },
      ],
      OrgSize: [
        {
          value: "100 to 499 employees",
          label: "100 to 499 employees",
        },
      ],
      Country: [{ value: "Spain", label: "Spain" }],
    },
    loading: {
      title: "Running assessment…",
      description:
        "Analysing workforce patterns and preparing a concise assessment.",
    },
    result: {
      eyebrow: "WORKFORCE ASSESSMENT",
      labels: {
        satisfied: {
          badge: "No elevated signal identified",
          title: "The analysis indicates a more favourable pattern",
          description:
            "The information provided aligns more closely with historical profiles reporting favourable job satisfaction. This insight describes a pattern and does not establish the person’s current experience.",
          recommendation:
            "Use this result as supporting context. Continue to review current employee feedback and organisational evidence before deciding whether any action is needed.",
        },
        not_satisfied: {
          badge: "Review recommended",
          title: "The analysis indicates that additional review is appropriate",
          description:
            "The information provided aligns more closely with historical profiles reporting lower job satisfaction. This insight is a prompt for contextual review, not a conclusion about an individual.",
          recommendation:
            "Contrast this result with current feedback, working conditions and relevant organisational context before considering any response.",
        },
      },
      summaryTitle: "Executive summary",
      recommendationTitle: "Recommendation",
      probabilityTitle: "Historical pattern alignment",
      probabilityDescription:
        "These percentages show the relative alignment with each historical pattern. They indicate analytical confidence, not certainty or current employee sentiment.",
      satisfiedProbability: "Satisfied pattern",
      notSatisfiedProbability: "Lower-satisfaction pattern",
      humanReviewTitle: "Human review is required",
      humanReviewDescription:
        "TalentCare supports professional HR judgement. This assessment must not be used as the sole basis for decisions affecting a person.",
      newAssessment: "Start a new assessment",
    },
    error: {
      title: "Unable to complete the assessment",
      messages: {
        validation:
          "Some information needs your attention. Review the highlighted fields and run the assessment again.",
        timeout:
          "The assessment is taking longer than expected. Your information is still available. Please try again in a few moments.",
        network:
          "We could not reach the assessment service. Check your connection and try again in a few moments.",
        server:
          "The assessment service is temporarily unavailable. Your information is still available. Please try again in a few moments.",
        generic:
          "Something unexpected happened while preparing the assessment. Your information is still available. Please try again.",
      },
      retry: "Try again",
    },
  },
  login: {
    brand: {
      name: "TalentCare",
      descriptor: "PEOPLE ANALYTICS PLATFORM",
      tagline: "Workforce Intelligence for preventive decisions.",
      description:
        "Understand historical job-satisfaction patterns and prepare evidence-based People decisions.",
      principles: [
        "Human-centred workforce analytics.",
        "Responsible use of organisational data.",
        "Professional judgement remains essential.",
      ],
      platformPrinciplesTitle: "Platform principles",
      platformPrinciples: [
        "Evidence-based insights",
        "Responsible analysis",
        "Human oversight",
      ],
    },
    form: {
      title: "Sign in to TalentCare",
      description:
        "Already have an account? Access your TalentCare workspace.",
      emailLabel: "Work email",
      emailPlaceholder: "name@company.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      forgotPasswordUnavailable:
        "Password recovery is not available in the demo environment.",
      showPassword: "Show password",
      hidePassword: "Hide password",
      submit: "Sign in",
      submitting: "Signing in…",
      demoAccess: "Open demo workspace",
      newUserTitle: "New to TalentCare?",
      newUserDescription:
        "Explore how TalentCare helps teams examine satisfaction patterns and prepare responsible investigations.",
      futureAvailability:
        "Demo requests and account creation will be available in a future version.",
      emailRequired: "Enter your work email.",
      emailInvalid: "Enter a valid email address.",
      passwordRequired: "Enter your password.",
    },
    trust: {
      title: "Demo environment",
      demoNotice:
        "Do not enter real credentials. This demonstration does not store login information.",
      dataUse:
        "TalentCare supports professional analysis and human decision-making.",
    },
  },
}
