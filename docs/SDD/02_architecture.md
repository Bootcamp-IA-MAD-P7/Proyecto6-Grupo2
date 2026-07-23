# Software Design Document (SDD)

# SDD-02 · Arquitectura del sistema

| Campo | Valor |
|---|---|
| Proyecto | Nombre pendiente de definir |
| Documento | Arquitectura del sistema |
| Código | SDD-02 |
| Versión | 1.0 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documentos de origen | SDD-00 · Project Scope, SDD-00A · Use Cases, SDD-01 · Requirements |
| Documentos relacionados | SDD-03 a SDD-09 |

## 1. Propósito

Este documento define la arquitectura lógica del Producto Mínimo Viable.

Describe:

- Los componentes principales del sistema.
- Las responsabilidades de cada componente.
- Las relaciones y flujos de comunicación.
- Los límites entre interfaz, negocio e Inteligencia Artificial.
- La gestión del modelo y del pipeline de inferencia.
- Los principios arquitectónicos.
- Las decisiones y restricciones que condicionarán la implementación.

La arquitectura deberá permitir cumplir los requisitos funcionales y no funcionales definidos en `SDD-01 · Requirements`, sin introducir funcionalidades fuera del alcance aprobado.

## 2. Alcance arquitectónico

La arquitectura cubre el flujo completo del MVP:

```text
Entrada del usuario
        ↓
Validación
        ↓
Solicitud de análisis
        ↓
Preparación de variables
        ↓
Inferencia
        ↓
Explicabilidad
        ↓
Recomendaciones
        ↓
Presentación del resultado
```

El documento no define todavía:

- El código fuente concreto.
- La estructura definitiva de carpetas.
- Los endpoints detallados de la API.
- Las variables finales del modelo.
- El algoritmo definitivo.
- El diseño visual de la interfaz.
- La infraestructura final de producción.

Estos aspectos se desarrollarán en documentos posteriores.

## 3. Objetivos arquitectónicos

La arquitectura deberá:

1. Separar la interfaz de usuario de la lógica de negocio y del modelo de Machine Learning.
2. Mantener un contrato estable entre los distintos componentes.
3. Garantizar que solo se procesen datos válidos.
4. Evitar que la interfaz dependa de detalles internos del modelo.
5. Permitir sustituir o actualizar el modelo sin rediseñar toda la aplicación.
6. Mantener unidas la predicción, su explicación y sus recomendaciones.
7. Gestionar errores parciales sin presentar resultados inválidos.
8. Facilitar las pruebas automatizadas.
9. Permitir una ejecución reproducible mediante entornos aislados.
10. Mantener trazabilidad sobre la versión del modelo utilizada.

## 4. Principios arquitectónicos

### 4.1 Separación de responsabilidades

Cada componente deberá tener una responsabilidad claramente delimitada.

La interfaz no ejecutará directamente el modelo.

El servicio de inferencia no gestionará decisiones de presentación.

El modelo no contendrá lógica de interfaz ni comportamiento específico del cliente.

### 4.2 Contratos explícitos

La comunicación entre componentes deberá utilizar estructuras de entrada y salida definidas.

Los contratos deberán especificar:

- Campos requeridos.
- Tipos de datos.
- Valores admitidos.
- Respuestas válidas.
- Códigos y formatos de error.
- Versión del modelo cuando corresponda.

### 4.3 Pipeline único de procesamiento

Las transformaciones utilizadas durante la inferencia deberán ser compatibles con las aplicadas durante el entrenamiento.

El sistema no deberá duplicar manualmente en la aplicación transformaciones que formen parte del pipeline del modelo.

### 4.4 Diseño modular

La solución se dividirá en módulos independientes:

- Interfaz.
- Validación.
- Orquestación.
- Inferencia.
- Explicabilidad.
- Recomendaciones.
- Observabilidad.

Esta separación permitirá modificar un componente con impacto limitado sobre los demás.

### 4.5 Fail-safe

Cuando una operación crítica falle, el sistema deberá detener el flujo de manera controlada.

No deberá mostrar:

- Predicciones desconocidas.
- Explicaciones incompatibles.
- Recomendaciones no respaldadas.
- Respuestas parciales como resultados completos.

### 4.6 Stateless por defecto

El MVP se diseñará sin depender de sesiones persistentes ni historiales de usuario.

Cada análisis deberá poder procesarse como una solicitud independiente.

La persistencia futura requerirá una decisión arquitectónica formal.

## 5. Vista lógica de alto nivel

```text
┌──────────────────────────────┐
│        Usuario web           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Aplicación frontend     │
│                              │
│  - Presentación              │
│  - Formulario                │
│  - Validación inicial        │
│  - Gestión de estados        │
└──────────────┬───────────────┘
               │ Contrato HTTP/API
               ▼
┌──────────────────────────────┐
│      Backend / API           │
│                              │
│  - Validación de entrada     │
│  - Orquestación              │
│  - Gestión de errores        │
│  - Construcción de respuesta │
└───────┬──────────┬───────────┘
        │          │
        ▼          ▼
┌─────────────┐  ┌───────────────────┐
│ Inferencia  │  │ Recomendaciones   │
│             │  │                   │
│ - Pipeline  │  │ - Reglas          │
│ - Modelo    │  │ - Contextualización│
│ - Clases    │  │ - Validación      │
└──────┬──────┘  └─────────▲─────────┘
       │                   │
       ▼                   │
┌──────────────────────────┴───┐
│       Explicabilidad          │
│                              │
│ - Factores relevantes        │
│ - Dirección o contribución   │
│ - Datos para presentación    │
└──────────────────────────────┘
```

## 6. Componentes del sistema

### 6.1 Aplicación frontend

Responsable de la interacción con el usuario.

Funciones principales:

- Presentar la finalidad y limitaciones del análisis.
- Mostrar el formulario.
- Capturar los datos profesionales.
- Aplicar validaciones básicas de interfaz.
- Enviar solicitudes al backend.
- Mostrar estados de procesamiento.
- Presentar predicción, explicación y recomendaciones.
- Gestionar errores comprensibles.
- Reiniciar el análisis.

El frontend no deberá:

- Ejecutar el modelo.
- Duplicar el pipeline de transformación.
- Calcular explicaciones.
- Generar recomendaciones.
- Conocer detalles internos del algoritmo.

### 6.2 Backend y API

Actúa como punto de entrada del sistema y capa de orquestación.

Responsabilidades:

- Recibir solicitudes.
- Validar el esquema de entrada.
- Rechazar datos inválidos.
- Coordinar la inferencia.
- Solicitar o recuperar la explicación.
- Coordinar la generación de recomendaciones.
- Construir una respuesta coherente.
- Gestionar errores.
- Registrar información operativa.
- Identificar internamente la versión del modelo.

El backend deberá garantizar que la respuesta final mantenga la relación entre:

```text
Entrada
Predicción
Explicación
Recomendaciones
Versión del modelo
```

### 6.3 Módulo de validación

Responsable de comprobar que los datos cumplen las condiciones necesarias para su procesamiento.

La validación se realizará en dos niveles.

#### Validación de interfaz

Proporciona feedback inmediato al usuario:

- Campos obligatorios.
- Formatos básicos.
- Opciones permitidas.
- Rangos visibles.

#### Validación de servidor

Es la validación autoritativa.

Deberá comprobar:

- Esquema completo.
- Tipos de datos.
- Categorías admitidas.
- Rangos.
- Ausencia de campos desconocidos.
- Compatibilidad con el modelo desplegado.

La validación realizada en el frontend nunca sustituirá la validación del backend.

### 6.4 Pipeline de inferencia

Responsable de transformar la solicitud validada en una entrada compatible con el modelo.

Podrá incluir:

- Selección de variables.
- Conversión de tipos.
- Tratamiento de categorías.
- Imputación, cuando sea aplicable.
- Codificación.
- Escalado.
- Ordenación de características.
- Ejecución del modelo.

Las transformaciones deberán quedar encapsuladas junto al modelo o en un pipeline versionado.

### 6.5 Modelo de Machine Learning

Responsable de generar la clasificación multiclase de satisfacción laboral.

El modelo deberá:

- Recibir únicamente entradas compatibles.
- Devolver una clase perteneciente al conjunto aprobado.
- Permitir identificar su versión.
- Haber sido evaluado antes de su despliegue.
- Mantener compatibilidad con el pipeline asociado.

El algoritmo definitivo no se fija en este documento.

Se evaluarán diferentes modelos y enfoques ensemble en `SDD-05 · Modeling`.

### 6.6 Módulo de explicabilidad

Responsable de producir información que permita interpretar una predicción individual.

Deberá proporcionar una representación estructurada de los factores relevantes.

Ejemplo conceptual:

```json
{
  "feature": "work_experience",
  "display_name": "Experiencia profesional",
  "direction": "positive",
  "importance": 0.24
}
```

La estructura definitiva se establecerá en el contrato de API.

El módulo deberá garantizar que:

- La explicación corresponde a la misma inferencia.
- Los factores pertenecen al conjunto de variables utilizado.
- No se devuelven explicaciones incompatibles.
- Los nombres técnicos puedan transformarse en etiquetas comprensibles.

La técnica concreta de explicabilidad queda pendiente de `SDD-05 · Modeling`.

### 6.7 Módulo de recomendaciones

Responsable de seleccionar o generar recomendaciones relacionadas con el resultado.

Para el MVP se recomienda una aproximación controlada y trazable basada en reglas.

Flujo propuesto:

```text
Predicción
    +
Factores explicativos
    ↓
Reglas de recomendación
    ↓
Recomendaciones contextualizadas
```

Este componente deberá:

- Utilizar únicamente información validada.
- Mantener coherencia con la predicción.
- Relacionar recomendaciones con factores concretos cuando sea posible.
- Evitar diagnósticos o afirmaciones deterministas.
- Poder justificar por qué se ha seleccionado una recomendación.

No se recomienda que el MVP dependa de generación libre mediante un modelo generativo externo, salvo aprobación posterior.

### 6.8 Módulo de observabilidad

Responsable de registrar el funcionamiento del sistema.

Deberá permitir distinguir entre:

- Errores de validación.
- Errores de comunicación.
- Errores de inferencia.
- Errores de explicabilidad.
- Errores de recomendaciones.
- Errores inesperados.

Los registros no deberán incluir datos personales o información sensible innecesaria.

## 7. Flujo principal de predicción

```text
1. El usuario completa el formulario.

2. El frontend valida los campos básicos.

3. El frontend envía la solicitud.

4. El backend valida el esquema completo.

5. El backend entrega los datos al pipeline.

6. El pipeline transforma las variables.

7. El modelo genera una clase.

8. El sistema valida la clase resultante.

9. El módulo de explicabilidad genera los factores relevantes.

10. El módulo de recomendaciones selecciona recomendaciones.

11. El backend construye la respuesta.

12. El frontend presenta:
    - Predicción.
    - Explicación.
    - Recomendaciones.
    - Limitaciones del resultado.
```

## 8. Flujo de errores

```text
Solicitud
    ↓
Validación
    ├── Error de datos
    │       ↓
    │   Respuesta de validación
    │
    ▼
Inferencia
    ├── Modelo no disponible
    ├── Error del pipeline
    ├── Respuesta inválida
    │       ↓
    │   Error de análisis
    │
    ▼
Explicabilidad
    ├── Explicación no disponible
    │       ↓
    │   Resultado parcial controlado
    │
    ▼
Recomendaciones
    ├── Recomendaciones no disponibles
    │       ↓
    │   Resultado parcial controlado
    │
    ▼
Respuesta completa
```

### 8.1 Resultado completo

Contiene:

- Predicción válida.
- Explicación válida.
- Recomendaciones válidas.

### 8.2 Resultado parcial controlado

Puede mostrarse únicamente cuando:

- La predicción es válida.
- El componente no disponible está claramente identificado.
- La ausencia no conduce a una interpretación incorrecta.
- El sistema informa al usuario.

La decisión final sobre qué combinaciones parciales se admitirán deberá quedar definida en Testing y API.

### 8.3 Error completo

Se produce cuando:

- No existe predicción válida.
- La categoría es desconocida.
- El pipeline no puede procesar la entrada.
- La integridad de la respuesta no puede garantizarse.

En este caso no se deberá mostrar ningún resultado predictivo.

## 9. Contrato conceptual de entrada

La solicitud deberá contener únicamente las variables aprobadas para el modelo.

Ejemplo conceptual:

```json
{
  "input_data": {
    "feature_1": "value",
    "feature_2": 10,
    "feature_3": "category"
  }
}
```

La estructura definitiva dependerá de:

- Las variables seleccionadas.
- Los tipos definidos durante el EDA.
- El pipeline de transformación.
- Las clases finales del modelo.

El contrato detallado se desarrollará en `SDD-07 · API`.

## 10. Contrato conceptual de salida

La respuesta de análisis deberá tratarse como una unidad coherente.

```json
{
  "prediction": {
    "class": "predicted_class",
    "label": "Etiqueta comprensible"
  },
  "explanation": {
    "factors": []
  },
  "recommendations": [],
  "metadata": {
    "model_version": "version"
  }
}
```

Cuando el equipo apruebe la visualización de probabilidades, el contrato podrá incorporar:

```json
{
  "probabilities": {
    "class_a": 0.20,
    "class_b": 0.65,
    "class_c": 0.15
  }
}
```

La inclusión de esta información sigue pendiente de decisión.

## 11. Gestión del modelo

El artefacto desplegado deberá incluir o referenciar:

- Pipeline de transformación.
- Modelo entrenado.
- Clases de salida.
- Variables esperadas.
- Metadatos de versión.
- Fecha o identificador del entrenamiento.
- Métricas de evaluación relevantes.

El modelo no deberá cargarse de nuevo en cada solicitud si la tecnología utilizada permite mantenerlo disponible de manera segura durante la ejecución.

La estrategia concreta de carga y versionado se definirá durante la implementación.

## 12. Gestión de datos

### 12.1 Datos de entrenamiento

Los datos de entrenamiento se procesarán fuera del flujo de inferencia de la aplicación.

El pipeline de entrenamiento y el pipeline de inferencia deberán estar relacionados, pero no ejecutarse como una única operación en producción.

### 12.2 Datos de entrada del usuario

Por defecto:

- Se procesarán únicamente durante la solicitud.
- No se asociarán a una identidad.
- No se almacenarán como historial.
- No se incorporarán automáticamente al dataset.
- No se utilizarán automáticamente para reentrenar.

### 12.3 Persistencia

El MVP no requiere una base de datos funcional para usuarios o predicciones.

Podría ser necesaria persistencia técnica limitada para:

- Versiones de modelos.
- Configuración.
- Artefactos.
- Registros operativos.

La necesidad de una base de datos deberá justificarse en función de los requisitos reales y no introducirse únicamente por complejidad tecnológica.

## 13. Seguridad y privacidad arquitectónica

La arquitectura deberá aplicar:

- Validación de entradas.
- Restricción de campos admitidos.
- Gestión segura de configuración.
- Ausencia de secretos en el repositorio.
- Separación entre configuración y código.
- Mensajes de error no técnicos.
- Logs sin datos sensibles innecesarios.
- Limitación de acceso entre componentes cuando sea aplicable.
- Dependencias actualizadas y controladas.

El MVP no deberá solicitar nombres, correos electrónicos ni identificadores personales salvo modificación formal de los requisitos.

## 14. Escalabilidad

El MVP deberá diseñarse para permitir una evolución progresiva, sin implementar infraestructura innecesaria.

La arquitectura deberá permitir en el futuro:

- Múltiples instancias del backend.
- Sustitución del modelo.
- Nuevos modelos predictivos.
- Nuevas variables objetivo.
- Persistencia de análisis.
- Autenticación.
- Integraciones corporativas.
- Monitorización avanzada.

Estas capacidades no se implementarán en el MVP salvo aprobación expresa.

## 15. Despliegue conceptual

La solución deberá poder desplegarse mediante componentes aislados.

```text
┌──────────────────┐
│     Frontend     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Backend / API  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Modelo + Pipeline│
└──────────────────┘
```

El modelo podrá estar:

1. Integrado dentro del backend.
2. Expuesto mediante un servicio de inferencia independiente.

### Opción A · Modelo integrado en backend

Ventajas:

- Menor complejidad.
- Menos comunicación entre servicios.
- Adecuado para un MVP pequeño.

Riesgos:

- Mayor acoplamiento.
- Despliegue conjunto de aplicación y modelo.
- Menor independencia para escalar inferencia.

### Opción B · Servicio de inferencia independiente

Ventajas:

- Separación clara de responsabilidades.
- Modelo desplegable de forma independiente.
- Mayor facilidad para sustituir modelos.
- Mejor preparación para múltiples modelos.

Riesgos:

- Mayor complejidad.
- Más contratos de comunicación.
- Más puntos de fallo.
- Mayor esfuerzo de despliegue y pruebas.

La decisión deberá tomarse considerando el tiempo disponible, la capacidad del equipo y la rúbrica académica.

## 16. Tecnologías candidatas

Las siguientes tecnologías se consideran candidatas, pero no se congelan en este documento:

| Capa | Tecnología candidata |
|---|---|
| Frontend | React con Vite |
| Backend / API | FastAPI |
| Machine Learning | Python, scikit-learn y librerías compatibles |
| Explicabilidad | Técnica por determinar durante Modeling |
| Contenedores | Docker |
| Pruebas backend | Pytest |
| Pruebas frontend | Framework compatible con el stack elegido |
| Control de versiones | Git y GitHub |

La aprobación definitiva deberá documentarse mediante decisiones arquitectónicas o ADR.

## 17. Decisiones arquitectónicas pendientes

| ID | Decisión |
|---|---|
| AD-001 | Confirmar la separación entre backend y servicio de inferencia |
| AD-002 | Aprobar el framework de frontend |
| AD-003 | Aprobar el framework de backend |
| AD-004 | Definir las variables del contrato de entrada |
| AD-005 | Definir las clases del contrato de salida |
| AD-006 | Decidir si se mostrarán probabilidades |
| AD-007 | Seleccionar el método de explicabilidad |
| AD-008 | Definir la lógica de recomendaciones |
| AD-009 | Determinar si existe alguna persistencia técnica |
| AD-010 | Definir la estrategia de versionado del modelo |
| AD-011 | Definir el comportamiento de resultados parciales |
| AD-012 | Aprobar la estrategia de despliegue |
| AD-013 | Definir si el MVP requiere monitorización visual |
| AD-014 | Definir límites de tiempo y tamaño de solicitud |

Las decisiones deberán registrarse en documentos ADR cuando afecten de forma significativa a la implementación.

## 18. Matriz de responsabilidades

| Componente | Responsabilidad principal |
|---|---|
| Frontend | Interacción y presentación |
| Backend/API | Validación autoritativa y orquestación |
| Pipeline | Transformación reproducible |
| Modelo | Clasificación multiclase |
| Explicabilidad | Interpretación de la predicción |
| Recomendaciones | Orientaciones contextualizadas |
| Observabilidad | Registro y diagnóstico |
| Infraestructura | Ejecución y comunicación entre componentes |

## 19. Trazabilidad con requisitos

| Área arquitectónica | Requisitos relacionados |
|---|---|
| Frontend | FR-001 a FR-010, FR-015 a FR-018, FR-020, FR-021, FR-024, FR-026, FR-029 |
| Validación | FR-007 a FR-012 |
| Inferencia | FR-012 a FR-014 |
| Explicabilidad | FR-019 a FR-022 |
| Recomendaciones | FR-023 a FR-025 |
| Gestión de estado | FR-026 y FR-027 |
| Gestión de errores | FR-028 a FR-031 |
| Seguridad y privacidad | NFR-014 a NFR-018 |
| IA Responsable | NFR-019 a NFR-026 |
| Mantenibilidad | NFR-027 a NFR-031 |
| Testing | NFR-032 a NFR-035 |
| Observabilidad | NFR-036 a NFR-038 |

## 20. Criterios de aprobación

El documento podrá aprobarse cuando el equipo confirme:

- Que los componentes representan correctamente el MVP.
- Que las responsabilidades no están duplicadas.
- Que el frontend no depende directamente del modelo.
- Que existe una estrategia clara de validación.
- Que predicción, explicación y recomendaciones permanecen vinculadas.
- Que los errores parciales se gestionan de forma controlada.
- Que no se ha introducido persistencia o infraestructura innecesaria.
- Que las tecnologías se mantienen como candidatas hasta su aprobación.
- Que las decisiones pendientes están identificadas.
- Que la arquitectura puede traducirse en estructura de implementación y contratos de API.