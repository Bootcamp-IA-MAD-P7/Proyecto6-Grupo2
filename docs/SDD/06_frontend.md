# Frontend Design

**Versión:** 1.0
**Estado:** Draft

---

# 1. Descripción

El frontend es la interfaz que permite al Profesional de Talento Humano interactuar con la plataforma. Cubre el ciclo completo de interacción definido en el SDD-00A: desde el acceso inicial hasta la visualización de resultados y recomendaciones.

---

# 2. Stack Tecnológico

| Tecnología | Decisión |
|---|---|
| Framework | React |
| Lenguaje | TypeScript |
| Build tool | Vite |
| Comunicación | REST API (fetch) |

---

# 3. Estructura de la Interfaz

La interfaz se organiza en una única pantalla principal dividida en bloques secuenciales, sin navegación compleja ni autenticación (fuera del alcance del MVP).

## Bloque 1 — Información de la plataforma (UC2)
Descripción breve del propósito del análisis para contextualizar al usuario antes de introducir datos.

## Bloque 2 — Formulario de entrada (UC3, UC4)
Formulario limpio con los campos clave del entorno profesional del empleado:

| Campo | Variable del dataset | Tipo de input |
|---|---|---|
| Años de experiencia | `YearsCodePro` | Numérico |
| Nivel educativo | `EdLevel` | Desplegable |
| Modalidad de trabajo | `RemoteWork` | Desplegable |
| Lenguaje principal | `LanguageHaveWorkedWith` | Desplegable |
| Salario anual | `ConvertedCompYearly` | Numérico |

El formulario incluye validación de datos antes de enviar la petición (UC4, UC10).

## Bloque 3 — Resultado de la predicción (UC5, UC6)
Muestra la clasificación obtenida de forma visual y clara:
- Indicador de satisfacción (Satisfecho / No satisfecho)
- Probabilidad asociada a la predicción

## Bloque 4 — Explicación (UC7)
Visualización de los factores del entorno profesional que más han influido en la predicción.

## Bloque 5 — Recomendaciones (UC8)
Recomendaciones accionables para el profesional de Talento Humano basadas en el resultado obtenido.

## Bloque 6 — Nuevo análisis (UC9)
Botón para reiniciar el formulario y comenzar un nuevo análisis.

---

# 4. Comunicación con el Backend

- Protocolo: REST
- Endpoint principal: `POST /predict`
- Formato: JSON
- Implementación: `frontend/src/services/`

---

# 5. Estructura de Ficheros

```
frontend/
└── src/
    ├── components/   — piezas reutilizables de UI
    ├── pages/        — vistas completas
    ├── services/     — llamadas a la API
    └── assets/       — imágenes e iconos
```

---

# 6. Decisiones Pendientes

- Librería de estilos: pendiente de decidir (Tailwind CSS, CSS Modules u otra).
- Diseño visual detallado: pendiente de wireframes definitivos.
- Formato exacto de visualización de la explicación (UC7): pendiente de decisión del equipo.
