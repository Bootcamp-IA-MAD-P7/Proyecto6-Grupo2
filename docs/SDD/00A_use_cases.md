# Software Design Document (SDD)

# SDD-00A · Casos de uso

| Campo | Valor |
|---|---|
| Proyecto | TalentCare *(nombre provisional)* |
| Documento | Casos de uso |
| Código | SDD-00A |
| Versión | 1.1 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documento padre | SDD-00 · Project Scope |
| Documento relacionado | SDD-01 · Requirements |

---

## 1. Propósito

Este documento identifica las interacciones funcionales del MVP de TalentCare y conecta el alcance aprobado con los requisitos del sistema.

Los casos de uso sirven como base para definir requisitos, arquitectura, interfaz, API y pruebas, sin establecer detalles de implementación.

La trazabilidad documental sigue este recorrido:

```text
Scope → Use Cases → Requirements → Architecture → Implementation → Testing
```

---

## 2. Alcance

Este documento describe:

- Los actores que interactúan con el MVP.
- Los objetivos de dichos actores.
- El recorrido funcional principal.
- Los flujos alternativos relevantes.
- Los errores funcionales.
- La relación de las interacciones con el alcance aprobado.

Este documento no define:

- Arquitectura técnica.
- Tecnologías.
- Contratos concretos de API.
- Diseño visual.
- Algoritmos de Machine Learning.
- Casos de prueba detallados.
- Funcionalidades futuras.

Los límites funcionales, usos prohibidos y capacidades futuras se definen en **SDD-00 · Project Scope**.

---

## 3. Actores

### Usuario profesional

Actor principal que representa a una persona autorizada perteneciente a alguno de estos perfiles:

- Recursos Humanos.
- People Analytics.
- Gestión de talento.
- Management.
- Dirección.
- Diversidad, equidad e inclusión.

El usuario puede introducir información profesional, solicitar un análisis y consultar resultados, explicaciones y recomendaciones.

El MVP:

- No requiere una cuenta de usuario.
- No exige un perfil persistente.
- No exige un histórico de análisis.
- No define necesariamente a una trabajadora individual como usuaria directa.

### Sistema

Actor funcional interno responsable de validar datos, ejecutar el flujo de análisis y mantener un estado coherente. El sistema de Machine Learning es un componente interno, no un actor externo.

### Sistemas externos

No existen sistemas externos obligatorios para el MVP.

---

## 4. Recorrido funcional

El objetivo principal del usuario es obtener una estimación explicable relacionada con el caso de uso laboral y la variable objetivo finalmente validados, con el fin de identificar señales asociadas al riesgo de salida y apoyar decisiones de retención de mujeres en puestos STEM.

`JobSat` permanece en evaluación como posible variable objetivo o proxy. La satisfacción laboral no equivale a la rotación laboral.

El recorrido funcional del MVP es:

```text
Acceso
  ↓
Finalidad y limitaciones
  ↓
Entrada de datos
  ↓
Validación
  ├─ Error → Corrección
  ↓
Análisis
  ↓
Resultado
  ↓
Explicación
  ↓
Recomendaciones
  ↓
Nuevo análisis o fin
```

El flujo mantiene un enfoque Human-in-the-loop, con supervisión humana, y no automatiza decisiones laborales sobre personas.

---

## 5. Catálogo de casos de uso

| ID | Caso de uso | Actor principal | Prioridad |
|---|---|---|---|
| UC-01 | Acceder y comprender la finalidad | Usuario | Must Have |
| UC-02 | Introducir información profesional | Usuario | Must Have |
| UC-03 | Validar datos de entrada | Sistema | Must Have |
| UC-04 | Solicitar análisis | Usuario | Must Have |
| UC-05 | Consultar resultado | Usuario | Must Have |
| UC-06 | Consultar explicación | Usuario | Must Have |
| UC-07 | Consultar recomendaciones | Usuario | Must Have |
| UC-08 | Iniciar un nuevo análisis | Usuario | Should Have |
| UC-09 | Gestionar errores e indisponibilidad | Sistema | Must Have |

---

## 6. Casos de uso

### UC-01 · Acceder y comprender la finalidad

| Campo | Descripción |
|---|---|
| Objetivo | Acceder a TalentCare y comprender su finalidad, alcance y limitaciones. |
| Actor | Usuario |
| Prioridad | Must Have |
| Precondiciones | La aplicación está disponible. |
| Resultado | El usuario dispone del contexto necesario para decidir si continúa. |

**Flujo principal**

1. El usuario accede a la aplicación.
2. El sistema presenta la finalidad del análisis.
3. El sistema explica el carácter orientativo de los resultados y sus limitaciones.
4. El sistema informa de la necesidad de supervisión humana.
5. El usuario continúa hacia la entrada de datos.

**Alternativas y errores**

- Si la aplicación no está disponible, se activa UC-09.
- El usuario puede abandonar sin iniciar un análisis.

**Relaciones**

- Precede a UC-02.
- Aplica las limitaciones de SDD-00 · Project Scope.

### UC-02 · Introducir información profesional

| Campo | Descripción |
|---|---|
| Objetivo | Recoger la información profesional necesaria para solicitar un análisis. |
| Actor | Usuario |
| Prioridad | Must Have |
| Precondiciones | El usuario ha comprendido la finalidad y las limitaciones. |
| Resultado | Los datos quedan disponibles temporalmente para su validación. |

**Flujo principal**

1. El sistema presenta el formulario.
2. El usuario introduce o selecciona información profesional.
3. El sistema conserva temporalmente los datos durante la interacción.
4. El usuario revisa la información antes de enviarla.

Las variables definitivas del formulario permanecen pendientes de validación.

**Alternativas y errores**

- El usuario puede corregir los datos antes de enviarlos.
- El usuario puede reiniciar el formulario o abandonar.
- Los datos incompletos o incompatibles se gestionan en UC-03.

**Relaciones**

- Continúa en UC-03.
- Puede reiniciarse mediante UC-08.

### UC-03 · Validar datos de entrada

| Campo | Descripción |
|---|---|
| Objetivo | Comprobar que los datos cumplen las condiciones necesarias para el análisis. |
| Actor | Sistema |
| Prioridad | Must Have |
| Precondiciones | El usuario ha introducido información profesional. |
| Resultado | Los datos se aceptan como válidos o se devuelven errores corregibles. |

**Flujo principal**

1. El sistema valida obligatoriedad, tipo y formato.
2. El sistema valida rangos y categorías admitidas.
3. El sistema comprueba la compatibilidad con el esquema del modelo.
4. Si los datos son válidos, habilita la solicitud de análisis.

**Alternativas y errores**

- Si existe un error, el sistema identifica el dato que debe corregirse.
- No se ejecuta inferencia con datos inválidos.
- Un fallo técnico de validación se gestiona mediante UC-09.

**Relaciones**

- Recibe datos de UC-02.
- Habilita UC-04.

### UC-04 · Solicitar análisis

| Campo | Descripción |
|---|---|
| Objetivo | Ejecutar el análisis con datos válidos y preparar un resultado interpretable. |
| Actor | Usuario |
| Prioridad | Must Have |
| Precondiciones | Los datos han superado UC-03. |
| Resultado | El resultado, su explicación y las recomendaciones quedan preparados o se informa de un error controlado. |

**Flujo principal**

1. El usuario solicita el análisis.
2. El sistema recibe los datos válidos.
3. El sistema adapta los datos al esquema aprobado del modelo.
4. El modelo genera una estimación correspondiente a la variable objetivo y a la estrategia de clases finalmente validadas.
5. El sistema genera o recupera una explicación.
6. El sistema genera o selecciona recomendaciones.
7. El sistema prepara el resultado para su consulta.

**Alternativas y errores**

- Si la adaptación o inferencia falla, no se presenta un resultado parcial como válido.
- Si la explicación o las recomendaciones no están disponibles, se muestra un estado controlado.
- Los errores se gestionan mediante UC-09.

**Relaciones**

- Requiere UC-03.
- Habilita UC-05, UC-06 y UC-07.

### UC-05 · Consultar resultado

| Campo | Descripción |
|---|---|
| Objetivo | Presentar la estimación de forma comprensible y vinculada al análisis realizado. |
| Actor | Usuario |
| Prioridad | Must Have |
| Precondiciones | UC-04 ha producido un resultado válido. |
| Resultado | El usuario comprende la estimación y su carácter orientativo. |

**Flujo principal**

1. El sistema presenta el resultado.
2. Distingue los datos de entrada de la predicción.
3. Comunica que la estimación no constituye un hecho cierto ni una interpretación causal.
4. Presenta una probabilidad o nivel de confianza solo si su uso ha sido validado.
5. Vincula el resultado con su explicación.

**Alternativas y errores**

- Si el resultado no es válido, se activa UC-09.
- Si la confianza no está validada, no se presenta.

**Relaciones**

- Depende de UC-04.
- Se complementa con UC-06 y UC-07.

### UC-06 · Consultar explicación

| Campo | Descripción |
|---|---|
| Objetivo | Explicar los factores relevantes de una predicción concreta. |
| Actor | Usuario |
| Prioridad | Must Have |
| Precondiciones | Existe una predicción válida. |
| Resultado | El usuario dispone de una explicación local comprensible o de un estado explícito de indisponibilidad. |

**Flujo principal**

1. El usuario consulta la explicación.
2. El sistema muestra los factores relevantes para la predicción.
3. Cuando procede, identifica contribuciones positivas o negativas.
4. El sistema utiliza lenguaje comprensible y evita atribuir causalidad.
5. La explicación permanece vinculada a la predicción concreta.

**Alternativas y errores**

- Si la explicación no está disponible, el sistema lo comunica explícitamente.
- La ausencia de explicación no se oculta ni se sustituye por una interpretación causal.

**Relaciones**

- Complementa UC-05.
- Puede preceder a UC-07.

### UC-07 · Consultar recomendaciones

| Campo | Descripción |
|---|---|
| Objetivo | Ofrecer orientación general y contextualizada para apoyar la decisión humana. |
| Actor | Usuario |
| Prioridad | Must Have |
| Precondiciones | Existe un análisis válido. |
| Resultado | El usuario recibe recomendaciones no prescriptivas o un estado controlado de indisponibilidad. |

**Flujo principal**

1. El usuario consulta las recomendaciones.
2. El sistema presenta recomendaciones generales y contextualizadas.
3. El sistema comunica que no constituyen diagnósticos ni garantías.
4. El sistema recuerda que requieren interpretación y supervisión humana.

**Alternativas y errores**

- Si no es posible generar recomendaciones, el sistema muestra un estado controlado.
- Las recomendaciones no pueden utilizarse para penalizar, excluir o tomar decisiones automáticas sobre trabajadoras.

**Relaciones**

- Complementa UC-05 y UC-06.
- Los errores se gestionan mediante UC-09.

### UC-08 · Iniciar un nuevo análisis

| Campo | Descripción |
|---|---|
| Objetivo | Finalizar la interacción anterior y comenzar un análisis independiente. |
| Actor | Usuario |
| Prioridad | Should Have |
| Precondiciones | Existe una interacción iniciada o un análisis finalizado. |
| Resultado | El formulario queda disponible sin reutilizar datos temporales anteriores. |

**Flujo principal**

1. El usuario solicita un nuevo análisis.
2. El sistema finaliza el estado del análisis anterior.
3. El sistema limpia los datos temporales.
4. El sistema devuelve al usuario al formulario.

**Alternativas y errores**

- Si existen datos introducidos y no enviados, el sistema puede solicitar confirmación.
- Si la limpieza falla, se activa UC-09 y no se inicia un nuevo análisis con estado inconsistente.

**Relaciones**

- Reinicia el recorrido desde UC-02.
- Puede seguir a UC-04, UC-05, UC-06 o UC-07.

### UC-09 · Gestionar errores e indisponibilidad

| Campo | Descripción |
|---|---|
| Objetivo | Gestionar fallos sin presentar información incompleta o inválida como resultado. |
| Actor | Sistema |
| Prioridad | Must Have |
| Precondiciones | Se detecta un error o una capacidad necesaria no está disponible. |
| Resultado | La interacción permanece en un estado coherente y el usuario recibe opciones seguras. |

**Flujo principal**

1. El sistema detecta el error.
2. Interrumpe de forma segura la operación afectada.
3. Mantiene o restablece un estado coherente.
4. Evita mostrar resultados incompletos como válidos.
5. Presenta un mensaje comprensible.
6. Ofrece reintentar o regresar a un punto seguro.
7. Registra información técnica para diagnóstico.

**Alternativas y errores**

- Si no es posible reintentar, se ofrece volver al inicio o finalizar.
- La información técnica interna no se expone al usuario.

**Relaciones**

- Puede activarse desde cualquier caso de uso.
- El retorno seguro puede conducir a UC-01 o UC-08.

### Casos de uso futuros

Las capacidades futuras —autenticación, históricos, exportación, múltiples modelos, integraciones corporativas, asistentes y aplicación móvil— se gestionarán en **SDD-10 · Roadmap** y requerirán revisión previa de **SDD-00 · Project Scope**.

---

## 7. Reglas funcionales derivadas

| ID | Regla |
|---|---|
| BR-01 | El sistema no ejecutará inferencia con datos inválidos. |
| BR-02 | Los datos enviados al modelo deberán respetar el esquema de inferencia aprobado. |
| BR-03 | El resultado deberá presentarse como una estimación, no como un hecho cierto ni una decisión definitiva. |
| BR-04 | Toda predicción válida deberá incluir una explicación o un estado explícito de indisponibilidad. |
| BR-05 | Las recomendaciones deberán ser generales, contextualizadas y no prescriptivas. |
| BR-06 | El sistema no automatizará decisiones laborales sobre personas. |
| BR-07 | Los resultados parciales o técnicamente inválidos no deberán mostrarse como válidos. |
| BR-08 | Un nuevo análisis no reutilizará datos temporales del análisis anterior. |
| BR-09 | El MVP no requerirá autenticación, perfiles persistentes ni histórico obligatorio. |
| BR-10 | La implementación deberá respetar las limitaciones y decisiones abiertas definidas en los SDD. |

---

## 8. Decisiones abiertas

| ID | Decisión | Documento responsable | Estado |
|---|---|---|---|
| OD-01 | Variable objetivo definitiva | SDD-05 · Modeling | Pending |
| OD-02 | Validez de `JobSat` como target o proxy | SDD-05 · Modeling | Pending |
| OD-03 | Variables definitivas del formulario | SDD-04 / SDD-05 / SDD-06 | Pending |
| OD-04 | Estrategia de clases | SDD-05 · Modeling | Pending |
| OD-05 | Método de explicabilidad | SDD-05 · Modeling | Pending |
| OD-06 | Lógica de recomendaciones | SDD-01 / SDD-05 | Pending |
| OD-07 | Presentación de probabilidades o confianza | SDD-05 / SDD-06 | Pending |
| OD-08 | Persistencia temporal de los datos | SDD-02 / SDD-04 / SDD-07 | Pending |
| OD-09 | Idiomas disponibles | SDD-01 / SDD-06 | Pending |
| OD-10 | Exportación de resultados | SDD-00 / SDD-01 / SDD-10 | Pending |

Estas decisiones no deben asumirse como cerradas durante la implementación.

---

## 9. Trazabilidad

| Caso de uso | Dominio de requisitos |
|---|---|
| UC-01 | Acceso, transparencia y limitaciones |
| UC-02 | Captura de datos |
| UC-03 | Validación |
| UC-04 | Inferencia |
| UC-05 | Presentación de resultados |
| UC-06 | Explicabilidad |
| UC-07 | Recomendaciones |
| UC-08 | Gestión del estado |
| UC-09 | Errores y resiliencia |

- La matriz detallada entre casos de uso y requisitos se desarrollará en **SDD-01 · Requirements**.
- La trazabilidad con pruebas se desarrollará en **SDD-08 · Testing**.
- La trazabilidad técnica se ampliará en los documentos de arquitectura, frontend y API.

---

## 10. Criterios de aprobación

El documento podrá aprobarse cuando:

- Los actores estén correctamente definidos.
- El recorrido sea coherente con SDD-00.
- Se hayan incluido todos los casos esenciales.
- No existan funcionalidades fuera del alcance.
- Las decisiones abiertas estén registradas.
- Los casos de uso permitan derivar requisitos.
- La terminología sea coherente.
- No exista automatización de decisiones laborales.
- Todos los identificadores y referencias cruzadas sean consistentes.
