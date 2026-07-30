export type ReferenceDimension = "experience" | "age" | "salary" | "profession"

export interface ReferenceSegment {
  id: string
  label: {
    en: string
    es: string
  }
  profiles: number
  lowerSatisfactionRate: number
  highlighted?: boolean
}

export interface ReferenceDimensionData {
  id: ReferenceDimension
  label: {
    en: string
    es: string
  }
  question: {
    en: string
    es: string
  }
  insight: {
    en: string
    es: string
  }
  context: {
    en: string
    es: string
  }
  segments: ReferenceSegment[]
}

/**
 * Descriptive aggregates calculated from
 * data/processed/merged_survey_2024_2025_clean.parquet.
 *
 * lowerSatisfactionRate is the observed share with JobSat < 7.
 * These values are not aggregate predictions from the binary API.
 */
export const workforceReference = {
  source: "Stack Overflow Developer Survey",
  period: "2024–2025",
  profiles: 55_008,
  variables: 15,
  lowerSatisfactionProfiles: 16_686,
  lowerSatisfactionRate: 30.3,
  medianSalaryUsd: 69_814,
  medianYearsCode: 14,
  dimensions: [
    {
      id: "experience",
      label: { en: "Experience", es: "Experiencia" },
      question: {
        en: "How does reported satisfaction vary with experience?",
        es: "¿Cómo varía la satisfacción declarada según la experiencia?",
      },
      insight: {
        en: "Profiles with 0–2 years of coding experience report lower satisfaction 13.4 points more often than profiles with 11+ years.",
        es: "Los perfiles con 0–2 años de experiencia declaran menor satisfacción 13,4 puntos más que los perfiles con 11+ años.",
      },
      context: {
        en: "Career stage, onboarding and development expectations are useful hypotheses to validate. The comparison does not establish a cause.",
        es: "La etapa profesional, el onboarding y las expectativas de desarrollo son hipótesis útiles para validar. La comparación no establece una causa.",
      },
      segments: [
        {
          id: "0-2",
          label: { en: "0–2 years", es: "0–2 años" },
          profiles: 765,
          lowerSatisfactionRate: 41,
          highlighted: true,
        },
        {
          id: "3-5",
          label: { en: "3–5 years", es: "3–5 años" },
          profiles: 5_241,
          lowerSatisfactionRate: 38.9,
        },
        {
          id: "6-10",
          label: { en: "6–10 years", es: "6–10 años" },
          profiles: 14_530,
          lowerSatisfactionRate: 33.2,
        },
        {
          id: "11-plus",
          label: { en: "11+ years", es: "11+ años" },
          profiles: 34_472,
          lowerSatisfactionRate: 27.6,
        },
      ],
    },
    {
      id: "age",
      label: { en: "Age", es: "Edad" },
      question: {
        en: "Where do differences appear across age ranges?",
        es: "¿Dónde aparecen diferencias entre rangos de edad?",
      },
      insight: {
        en: "Profiles aged 18–24 report lower satisfaction 7.9 points more often than profiles aged 45–54.",
        es: "Los perfiles de 18–24 años declaran menor satisfacción 7,9 puntos más que los de 45–54.",
      },
      context: {
        en: "Age can overlap with career stage and employment context. It must not be used as a basis for individual employment decisions.",
        es: "La edad puede solaparse con la etapa profesional y el contexto laboral. No debe utilizarse para decisiones individuales.",
      },
      segments: [
        {
          id: "18-24",
          label: { en: "18–24", es: "18–24" },
          profiles: 7_344,
          lowerSatisfactionRate: 34.4,
          highlighted: true,
        },
        {
          id: "25-34",
          label: { en: "25–34", es: "25–34" },
          profiles: 21_985,
          lowerSatisfactionRate: 32.1,
        },
        {
          id: "35-44",
          label: { en: "35–44", es: "35–44" },
          profiles: 15_958,
          lowerSatisfactionRate: 29.2,
        },
        {
          id: "45-54",
          label: { en: "45–54", es: "45–54" },
          profiles: 6_651,
          lowerSatisfactionRate: 26.5,
        },
        {
          id: "55-64",
          label: { en: "55–64", es: "55–64" },
          profiles: 2_439,
          lowerSatisfactionRate: 23.3,
        },
      ],
    },
    {
      id: "salary",
      label: { en: "Compensation", es: "Compensación" },
      question: {
        en: "How does reported satisfaction vary across salary bands?",
        es: "¿Cómo varía la satisfacción declarada entre tramos salariales?",
      },
      insight: {
        en: "Profiles below USD 30k report lower satisfaction 9.3 points more often than profiles above USD 100k.",
        es: "Los perfiles por debajo de 30.000 USD declaran menor satisfacción 9,3 puntos más que los perfiles por encima de 100.000 USD.",
      },
      context: {
        en: "Compensation may reflect geography, role and seniority. Internal pay equity requires organisational data that is not available here.",
        es: "La compensación puede reflejar geografía, rol y seniority. La equidad salarial interna requiere datos organizativos no disponibles aquí.",
      },
      segments: [
        {
          id: "under-30",
          label: { en: "Below $30k", es: "Menos de 30k $" },
          profiles: 12_219,
          lowerSatisfactionRate: 36.1,
          highlighted: true,
        },
        {
          id: "30-60",
          label: { en: "$30k–$60k", es: "30k–60k $" },
          profiles: 11_333,
          lowerSatisfactionRate: 31.1,
        },
        {
          id: "60-100",
          label: { en: "$60k–$100k", es: "60k–100k $" },
          profiles: 16_060,
          lowerSatisfactionRate: 28.8,
        },
        {
          id: "over-100",
          label: { en: "$100k+", es: "100k+ $" },
          profiles: 15_396,
          lowerSatisfactionRate: 26.8,
        },
      ],
    },
    {
      id: "profession",
      label: { en: "Professional role", es: "Perfil profesional" },
      question: {
        en: "Which professional roles merit additional context?",
        es: "¿Qué perfiles profesionales merecen contexto adicional?",
      },
      insight: {
        en: "System administrators and data or business analysts show the highest observed rates among the selected roles with at least 250 profiles.",
        es: "Administración de sistemas y análisis de datos o negocio muestran las tasas observadas más altas entre los roles seleccionados con al menos 250 perfiles.",
      },
      context: {
        en: "Role comparisons use selected survey categories and are not an organisational department analysis.",
        es: "Las comparaciones utilizan categorías seleccionadas de la encuesta y no constituyen un análisis por departamentos.",
      },
      segments: [
        {
          id: "sysadmin",
          label: { en: "System administrator", es: "Administración de sistemas" },
          profiles: 255,
          lowerSatisfactionRate: 44.7,
          highlighted: true,
        },
        {
          id: "analyst",
          label: {
            en: "Data or business analyst",
            es: "Análisis de datos o negocio",
          },
          profiles: 306,
          lowerSatisfactionRate: 42.2,
        },
        {
          id: "qa",
          label: { en: "QA or test", es: "QA o testing" },
          profiles: 424,
          lowerSatisfactionRate: 37.5,
        },
        {
          id: "student",
          label: { en: "Student", es: "Estudiante" },
          profiles: 507,
          lowerSatisfactionRate: 37.1,
        },
        {
          id: "data-science",
          label: { en: "Data scientist / ML", es: "Data scientist / ML" },
          profiles: 512,
          lowerSatisfactionRate: 34.4,
        },
        {
          id: "backend",
          label: { en: "Back-end developer", es: "Desarrollo back-end" },
          profiles: 10_636,
          lowerSatisfactionRate: 32,
        },
      ],
    },
  ] satisfies ReferenceDimensionData[],
} as const
