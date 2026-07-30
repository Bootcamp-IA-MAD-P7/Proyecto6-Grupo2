import type { DashboardTranslations } from "@/types/dashboard"

export const es: DashboardTranslations = {
  common: {
    retry: "Reintentar",
    comingSoon: "Próximamente",
    close: "Cerrar",
    percentage: "porcentaje",
  },
  navigation: {
    productCategory: "PEOPLE ANALYTICS",
    overview: "Resumen",
    assessment: "Comparación de perfil",
    people: "Workforce Profile",
    insights: "Áreas de atención",
    actions: "Acciones preventivas",
    methodology: "Metodología y datos",
    mainLabel: "Navegación principal",
    openMenu: "Abrir navegación",
    closeMenu: "Cerrar navegación",
  },
  language: {
    label: "Idioma",
    english: "English",
    spanish: "Español",
  },
  profile: {
    label: "Usuario autenticado",
    role: "Director de RR. HH.",
    logout: "Cerrar sesión",
  },
  legal: {
    copyright: "© 2026 TalentCare",
    rights: "Todos los derechos reservados.",
  },
  hero: {
    eyebrow: "WORKFORCE SATISFACTION INTELLIGENCE",
    greeting: "Buenos días, Julián.",
    subtitle: "Tu último análisis de la plantilla está listo.",
    context:
      "1.248 perfiles analizados · 130 perfiles requieren revisión · 4 segmentos comparados",
  },
  insight: {
    title: "¿Qué merece la atención de RR. HH. hoy?",
    subtitle: "El patrón más relevante identificado en el análisis actual.",
    statement:
      "Los profesionales al inicio de su carrera concentran más perfiles asociados con una satisfacción laboral prevista más baja.",
    note:
      "Este patrón histórico puede ayudar a priorizar una revisión adicional, pero no representa una conclusión sobre empleados individuales.",
    explore: "Explorar este segmento",
    evidenceTitle: "Evidencia",
    seniorRate: "Tasa superior a la de perfiles sénior",
    nextCohort: "Por encima del siguiente segmento",
    help:
      "La satisfacción prevista más baja es una salida del modelo derivada de patrones históricos de encuesta. No mide la satisfacción real de una persona.",
  },
  outlook: {
    title: "¿Cuál es la perspectiva actual de satisfacción de la plantilla?",
    subtitle:
      "Una visión concisa de los perfiles y señales incluidos en este análisis.",
    metricLabels: {
      profiles: "Perfiles analizados",
      review: "Perfiles que requieren revisión",
      lowerSatisfaction: "Satisfacción prevista más baja",
      segments: "Segmentos comparados",
    },
    metricHelp: {
      review:
        "Perfiles asociados con la salida del modelo que requieren una revisión humana contextual.",
      lowerSatisfaction:
        "Proporción de perfiles analizados asociados con una satisfacción prevista más baja. No representa sentimiento observado.",
      segments:
        "Grupos creados a partir de atributos compatibles de la encuesta para realizar comparaciones.",
    },
  },
  segments: {
    title: "¿Dónde debería centrarse RR. HH. primero?",
    subtitle:
      "Compara segmentos profesionales para identificar dónde aparecen con más frecuencia los patrones históricos de menor satisfacción.",
    selectorLabel: "Dimensión del segmento",
    dimensionLabels: {
      experience: "Experiencia",
      education: "Educación",
      employment: "Empleo",
      companySize: "Tamaño de empresa",
      country: "País",
      professionalRole: "Perfil profesional",
      age: "Edad",
    },
    itemLabels: {
      "0-2": "0–2 años",
      "3-5": "3–5 años",
      "6-10": "6–10 años",
      "11-plus": "11+ años",
    },
    contextTitles: {
      experience: "Satisfacción prevista más baja por experiencia",
      education: "Satisfacción prevista más baja por educación",
      employment: "Satisfacción prevista más baja por empleo",
      companySize: "Satisfacción prevista más baja por tamaño de empresa",
      country: "Satisfacción prevista más baja por país",
      professionalRole: "Satisfacción prevista más baja por perfil profesional",
      age: "Satisfacción prevista más baja por edad",
    },
    experienceInterpretation:
      "La señal histórica aparece con más frecuencia en perfiles con 0–2 años de experiencia profesional. Contrasta este patrón con datos de onboarding, desarrollo y feedback de responsables.",
    pendingTitle: "Todavía no hay datos comparativos validados",
    pendingDescription:
      "Esta dimensión está preparada para integrarse, pero no muestra porcentajes hasta conectar una fuente validada.",
    help:
      "Las comparaciones muestran con qué frecuencia aparece la salida del modelo dentro de cada grupo histórico de la encuesta. No describen equipos ni empleados individuales.",
  },
  factors: {
    title: "¿Qué factores influyen en esta predicción?",
    subtitle:
      "Las variables que más contribuyen a la salida actual del modelo. Asociación no implica causalidad.",
    labels: {
      experience: "Años de experiencia profesional",
      salary: "Salario anual",
      employment: "Tipo de empleo",
      education: "Nivel educativo",
      role: "Perfil profesional",
      companySize: "Tamaño de empresa",
      country: "País",
      age: "Edad",
    },
    helpLabel: "Importancia de variables",
    help:
      "La importancia indica cuánto contribuye una variable a la salida del modelo en los datos analizados. No muestra dirección ni causalidad.",
    interpretation:
      "Los años de experiencia profesional y el salario anual muestran la asociación más fuerte con la salida del modelo. Estas variables reflejan aspectos estructurales de la etapa profesional y no implican que el salario por sí solo cause insatisfacción.",
  },
  actions: {
    title: "¿Qué acciones debería considerar RR. HH.?",
    subtitle:
      "Próximos pasos sugeridos para validar el patrón observado antes de tomar decisiones organizativas.",
    priorityLabels: {
      high: "Prioridad alta",
      recommended: "Recomendado",
      consider: "A considerar",
    },
    items: {
      earlyCareer: {
        title: "Revisar el segmento al inicio de su carrera",
        description:
          "Compara la señal con datos de onboarding, desarrollo y feedback de responsables.",
        cta: "Explorar segmento",
      },
      internalContext: {
        title: "Contrastar el patrón con el contexto interno",
        description:
          "Valida si la asociación histórica también resulta visible en la organización.",
        cta: "Revisar contexto",
      },
      listening: {
        title: "Preparar una acción de escucha focalizada",
        description:
          "Utiliza encuestas, entrevistas o grupos focales para entender la experiencia profesional tras la señal.",
        cta: "Preparar acción",
      },
    },
    comingNext:
      "Próximamente: este flujo se conectará con un plan de acción de RR. HH.",
  },
  methodology: {
    title: "¿Cómo deben interpretarse estos insights?",
    subtitle:
      "Comprende el modelo, la fuente de datos y sus limitaciones antes de utilizar los resultados.",
    viewMethodology: "Ver metodología",
    items: {
      prediction: {
        title: "Qué predice el modelo",
        body:
          "El modelo estima si un perfil histórico de encuesta está asociado con una satisfacción laboral más baja. No mide el sentimiento actual de empleados.",
      },
      source: {
        title: "Fuente de datos",
        body:
          "La demostración utiliza datos históricos del Stack Overflow Developer Survey. Las personas encuestadas no son empleados de la organización.",
      },
      target: {
        title: "Definición del objetivo",
        body:
          "El objetivo es una salida binaria derivada de respuestas de encuesta. El modelo no produce niveles intermedios de riesgo.",
      },
      limitations: {
        title: "Limitaciones del modelo",
        body:
          "Los resultados dependen de la cobertura, representatividad y calidad de los datos históricos y no deben generalizarse sin validación.",
      },
      oversight: {
        title: "Supervisión humana",
        body:
          "Profesionales cualificados de RR. HH. deben revisar el contexto organizativo antes de considerar cualquier acción.",
      },
      privacy: {
        title: "Privacidad y uso ético",
        body:
          "Utiliza solo los datos mínimos necesarios, comunica las limitaciones y evita decisiones basadas únicamente en una predicción.",
      },
    },
    responsibleLabel: "USO RESPONSABLE",
    responsibleText:
      "TalentCare apoya el criterio profesional de RR. HH. Las predicciones no deben utilizarse como única base para decisiones que afecten a las personas.",
  },
  states: {
    loading: "Preparando el análisis de la plantilla",
    loadingDescription: "Revisando los últimos datos demostrativos.",
    error: "No se pudo cargar el análisis",
    errorDescription:
      "Inténtalo de nuevo. No se ha modificado ningún dato.",
    empty: "Todavía no hay un análisis disponible",
    emptyDescription:
      "Conecta una fuente de datos validada para mostrar insights de la plantilla.",
  },
  assessment: {
    form: {
      title: "Evaluación de la plantilla",
      description:
        "Revisa cómo se relaciona un perfil profesional con patrones históricos de satisfacción laboral.",
      intro: {
        purpose:
          "Utiliza esta evaluación para identificar dónde puede aportar valor un contexto adicional de RR. HH.",
        estimatedTime: "Menos de 1 minuto",
      },
      fields: {
        YearsCodeNum: {
          label: "Experiencia profesional programando",
          description: "Años totales de experiencia programando.",
          placeholder: "p. ej., 5",
        },
        ConvertedCompYearly: {
          label: "Salario anual (USD)",
          description:
            "Compensación anual antes de deducciones, en dólares estadounidenses.",
          placeholder: "p. ej., 75000",
        },
        MainBranch: {
          label: "Rol profesional",
          placeholder: "Selecciona un rol profesional",
        },
        Employment: {
          label: "Situación laboral",
          placeholder: "Selecciona una situación laboral",
        },
        EdLevel: {
          label: "Nivel educativo",
          placeholder: "Selecciona un nivel educativo",
        },
        Age: {
          label: "Rango de edad",
          placeholder: "Selecciona un rango de edad",
        },
        OrgSize: {
          label: "Tamaño de la organización",
          placeholder: "Selecciona un tamaño de organización",
        },
        Country: {
          label: "País de empleo",
          placeholder: "Selecciona un país de empleo",
        },
      },
      validation: {
        required: "Este campo es obligatorio.",
        invalidNumber: "Introduce un número válido.",
        minimum: (minimum) => `Introduce un valor igual o superior a ${minimum}.`,
        maximum: (maximum) =>
          `Introduce un valor no superior a ${maximum.toLocaleString("es-ES")}.`,
      },
      errorSummaryTitle: "Revisa los campos destacados",
      submit: "Realizar evaluación",
      submitting: "Realizando evaluación…",
      responsibleUse: {
        title: "Uso responsable",
        items: [
          "Apoya a profesionales de RR. HH.",
          "La revisión humana siempre es necesaria.",
          "Los patrones históricos no sustituyen el criterio profesional.",
        ],
      },
      privacy: {
        title: "Aviso de privacidad",
        noIdentifiers: "No se recopilan identificadores personales.",
        assessmentUse:
          "La información introducida se utiliza únicamente para generar esta evaluación.",
      },
    },
    options: {
      MainBranch: [
        {
          value: "I am a developer by profession",
          label: "Profesional del desarrollo",
        },
      ],
      Employment: [
        {
          value: "Employed, full-time",
          label: "Empleado a jornada completa",
        },
      ],
      EdLevel: [
        {
          value: "Bachelor's degree",
          label: "Grado universitario",
        },
      ],
      Age: [
        {
          value: "25-34 years old",
          label: "Entre 25 y 34 años",
        },
      ],
      OrgSize: [
        {
          value: "100 to 499 employees",
          label: "Entre 100 y 499 empleados",
        },
      ],
      Country: [{ value: "Spain", label: "España" }],
    },
    loading: {
      title: "Realizando evaluación…",
      description:
        "Analizando patrones de la plantilla y preparando una evaluación concisa.",
    },
    result: {
      eyebrow: "EVALUACIÓN DE LA PLANTILLA",
      labels: {
        satisfied: {
          badge: "Sin señal elevada identificada",
          title: "El análisis indica un patrón más favorable",
          description:
            "La información facilitada se aproxima más a perfiles históricos que declararon una satisfacción laboral favorable. Este insight describe un patrón y no determina la experiencia actual de una persona.",
          recommendation:
            "Utiliza este resultado como contexto de apoyo. Revisa el feedback actual y las evidencias de la organización antes de decidir si es necesaria alguna acción.",
        },
        not_satisfied: {
          badge: "Revisión recomendada",
          title: "El análisis indica que conviene una revisión adicional",
          description:
            "La información facilitada se aproxima más a perfiles históricos que declararon menor satisfacción laboral. Este insight invita a revisar el contexto y no constituye una conclusión sobre una persona.",
          recommendation:
            "Contrasta este resultado con feedback actual, condiciones de trabajo y contexto relevante de la organización antes de considerar cualquier respuesta.",
        },
      },
      summaryTitle: "Resumen ejecutivo",
      recommendationTitle: "Recomendación",
      probabilityTitle: "Relación con patrones históricos",
      probabilityDescription:
        "Estos porcentajes muestran la relación relativa con cada patrón histórico. Indican confianza analítica, no certeza ni el sentimiento actual de una persona.",
      satisfiedProbability: "Patrón de satisfacción favorable",
      notSatisfiedProbability: "Patrón de menor satisfacción",
      humanReviewTitle: "Se requiere revisión humana",
      humanReviewDescription:
        "TalentCare apoya el criterio profesional de RR. HH. Esta evaluación no debe utilizarse como única base para decisiones que afecten a una persona.",
      newAssessment: "Iniciar una nueva evaluación",
    },
    error: {
      title: "No hemos podido completar la evaluación",
      messages: {
        validation:
          "Hay información que requiere tu atención. Revisa los campos destacados y vuelve a realizar la evaluación.",
        timeout:
          "La evaluación está tardando más de lo esperado. Tu información sigue disponible. Inténtalo de nuevo en unos instantes.",
        network:
          "No hemos podido contactar con el servicio de evaluación. Comprueba tu conexión e inténtalo de nuevo en unos instantes.",
        server:
          "El servicio de evaluación no está disponible temporalmente. Tu información sigue disponible. Inténtalo de nuevo en unos instantes.",
        generic:
          "Ha ocurrido algo inesperado al preparar la evaluación. Tu información sigue disponible. Inténtalo de nuevo.",
      },
      retry: "Intentar de nuevo",
    },
  },
  login: {
    brand: {
      name: "TalentCare",
      descriptor: "PLATAFORMA DE PEOPLE ANALYTICS",
      tagline: "Workforce Intelligence para decisiones preventivas.",
      description:
        "Comprende patrones históricos de satisfacción laboral y prepara decisiones de People basadas en evidencias.",
      principles: [
        "Analítica de la plantilla centrada en las personas.",
        "Uso responsable de los datos de la organización.",
        "El criterio profesional sigue siendo esencial.",
      ],
      platformPrinciplesTitle: "Principios de la plataforma",
      platformPrinciples: [
        "Insights basados en evidencias",
        "Análisis responsable",
        "Supervisión humana",
      ],
    },
    form: {
      title: "Inicia sesión en TalentCare",
      description:
        "¿Ya tienes una cuenta? Accede a tu espacio de trabajo de TalentCare.",
      emailLabel: "Correo profesional",
      emailPlaceholder: "nombre@empresa.com",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Introduce tu contraseña",
      rememberMe: "Recordarme",
      forgotPassword: "¿Has olvidado tu contraseña?",
      forgotPasswordUnavailable:
        "La recuperación de contraseña no está disponible en el entorno de demostración.",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      submit: "Iniciar sesión",
      submitting: "Iniciando sesión…",
      demoAccess: "Abrir espacio de demostración",
      newUserTitle: "¿Es tu primera vez en TalentCare?",
      newUserDescription:
        "Descubre cómo TalentCare ayuda a explorar patrones de satisfacción y a preparar investigaciones responsables.",
      futureAvailability:
        "La solicitud de demos y la creación de cuentas estarán disponibles en una versión futura.",
      emailRequired: "Introduce tu correo profesional.",
      emailInvalid: "Introduce una dirección de correo válida.",
      passwordRequired: "Introduce tu contraseña.",
    },
    trust: {
      title: "Entorno de demostración",
      demoNotice:
        "No introduzcas credenciales reales. Esta demostración no almacena información de acceso.",
      dataUse:
        "TalentCare apoya el análisis profesional y la toma de decisiones humanas.",
    },
  },
}
