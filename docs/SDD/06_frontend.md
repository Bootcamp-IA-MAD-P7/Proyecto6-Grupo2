# Software Design Document (SDD)

# SDD-06 · Frontend

| Campo | Valor |
|---|---|
| Proyecto | TalentCare AI |
| Documento | Frontend |
| Código | SDD-06 |
| Versión | 2.0 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documentos de origen | SDD-00, SDD-00A, SDD-01, SDD-02, SDD-03 |
| Documentos relacionados | SDD-07 |

---

## 1. Stack

| Tecnología | Decisión | Estado |
|---|---|---|
| Framework | React | Confirmado |
| Lenguaje | TypeScript | Confirmado |
| Build tool | Vite | Confirmado |
| Comunicación | REST / fetch | Confirmado |
| Estilos | Pendiente de decisión | Pendiente |

---

## 2. Estructura de módulos

```text
frontend/src/
├── main.tsx
├── app.tsx
├── pages/
├── components/
│   ├── form/
│   ├── prediction/
│   ├── explanation/
│   └── recommendations/
├── services/        — comunicación con la API
├── hooks/
├── types/
├── validation/
└── constants/
```

> La estructura actual del repositorio contiene únicamente `app.tsx` y `main.tsx`. El resto es previsto.

---

## 3. Vistas y casos de uso

La interfaz del MVP es una única página con bloques secuenciales. No requiere autenticación ni navegación compleja.

| Bloque | Casos de uso | Contenido | Estado |
|---|---|---|---|
| 1 — Información | UC-01, UC-02 | Finalidad del análisis y limitaciones | Previsto |
| 2 — Formulario | UC-03, UC-04 | Campos de entrada y validación | Previsto |
| 3 — Resultado | UC-05, UC-06 | Categoría predicha | Previsto |
| 4 — Explicación | UC-07 | Factores relevantes de la predicción | Previsto |
| 5 — Recomendaciones | UC-08 | Recomendaciones contextualizadas | Previsto |
| 6 — Nuevo análisis | UC-09 | Reinicio del formulario | Previsto |

---

## 4. Formulario de entrada

Los campos definitivos dependen del EDA y de la selección de variables del modelo (OD-002 en SDD-01).

Propuesta inicial:

| Campo | Variable | Tipo | Estado |
|---|---|---|---|
| Años de experiencia | `YearsCodePro` | Numérico | Pendiente de EDA |
| Nivel educativo | `EdLevel` | Desplegable | Pendiente de EDA |
| Modalidad de trabajo | `RemoteWork` | Desplegable | Pendiente de EDA |
| Lenguaje principal | `LanguageHaveWorkedWith` | Desplegable | Pendiente de EDA |
| Salario anual | `ConvertedCompYearly` | Numérico | Pendiente de EDA |

---

## 5. Validación

La validación de interfaz cubre:

- Campos obligatorios vacíos.
- Formatos básicos.
- Opciones fuera de rango.

No sustituye la validación del backend (ver SDD-07).

Implementación prevista: `frontend/src/validation/`

---

## 6. Comunicación con el backend

```text
POST /api/v1/predictions
Content-Type: application/json

Payload → PredictionRequest
Response → PredictionResponse (predicción + explicación + recomendaciones)
```

El contrato detallado se define en SDD-07.

---

## 7. Decisiones pendientes

| ID | Decisión |
|---|---|
| OD-002 | Variables definitivas del formulario (tras EDA) |
| OD-003 | Clases finales de JobSat |
| OD-006 | Mostrar solo categoría o también probabilidades |
| OD-008 | Idiomas disponibles en el MVP |
| OD-009 | Navegadores y tamaños de pantalla objetivo |
| OD-010 | Nivel de accesibilidad |
| ID-001 | Librería de estilos |

---

## 8. Trazabilidad

| Documento | Relación |
|---|---|
| SDD-01 · Requirements | FR-001 a FR-031, NFR-007 a NFR-013 |
| SDD-02 · Architecture | Sección 6.1 Aplicación frontend |
| SDD-03 · Implementation Structure | Sección 5 Frontend |
| SDD-07 · API | Contrato de comunicación |
| SDD-08 · Testing | Tests de componentes y flujo frontend |
