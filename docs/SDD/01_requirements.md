# Software Design Document (SDD)

# SDD-01 · Requirements

| Campo | Valor |
|---|---|
| Proyecto | TalentCare *(nombre provisional)* |
| Documento | Requirements |
| Código | SDD-01 |
| Versión | 1.1 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documento padre | SDD-00 · Project Scope |
| Documento relacionado | SDD-00A · Casos de uso |
| Documentos relacionados | SDD-02 a SDD-09 |

---

## 1. Propósito y alcance

Este documento transforma los casos de uso de TalentCare en requisitos verificables, define el comportamiento esperado del MVP y sirve de referencia para arquitectura, implementación y pruebas. Mantiene trazabilidad con el Scope y los casos de uso sin cerrar detalles técnicos pendientes.

```text
Scope → Use Cases → Requirements → Architecture → Implementation → Testing
```

El catálogo cubre la interacción del usuario profesional, captura y validación de datos, análisis, inferencia, resultados, explicabilidad, recomendaciones, gestión del estado, errores, privacidad, seguridad, fairness y supervisión humana. Los límites generales y usos prohibidos se definen en **SDD-00 · Project Scope**.

Este documento no define arquitectura, tecnologías, contratos concretos de API, diseño visual, pipeline detallado, algoritmos definitivos, infraestructura ni casos de prueba exhaustivos.

---

## 2. Convenciones y fuentes

### 2.1 Fuentes normativas

| Orden | Fuente | Responsabilidad |
|---|---|---|
| 1 | SDD-00 · Project Scope | Alcance, objetivos, límites y usos prohibidos |
| 2 | SDD-00A · Casos de uso | Actores, interacciones y reglas funcionales |
| 3 | Decisiones abiertas de este documento | Aspectos que no pueden asumirse como cerrados |

En caso de contradicción prevalece el orden anterior.

### 2.2 Identificadores

| Prefijo | Categoría |
|---|---|
| FR-XXX | Requisito funcional |
| DR-XXX | Requisito de datos |
| MLR-XXX | Requisito de Machine Learning |
| XR-XXX | Requisito de explicabilidad y recomendaciones |
| HR-XXX | Requisito de supervisión humana |
| NFR-XXX | Requisito no funcional |
| PR-XXX | Requisito de privacidad |
| SEC-XXX | Requisito de seguridad |
| FAIR-XXX | Requisito de fairness |
| OBS-XXX | Requisito de observabilidad |
| OD-XXX | Decisión abierta |

### 2.3 Prioridad y redacción

| Prioridad | Significado |
|---|---|
| Must Have | Obligatorio para aceptar el MVP |
| Should Have | Importante, aplazable con justificación |
| Could Have | Opcional y sujeto a capacidad |

`Deberá` expresa obligación; `no deberá`, prohibición; y `podrá`, únicamente una opción aprobada. Todo requisito incluye fuente y criterio de aceptación observable.

---

## 3. Actores, supuestos, restricciones y dependencias

### 3.1 Actores y responsabilidades

| Actor | Responsabilidades |
|---|---|
| Usuario profesional | Persona autorizada de Recursos Humanos, People Analytics, gestión de talento, management, dirección o diversidad, equidad e inclusión; accede, introduce datos, solicita análisis y consulta resultados, explicaciones y recomendaciones. |
| Sistema | Valida datos, ejecuta o solicita inferencia, presenta resultados, asocia explicaciones y recomendaciones, gestiona errores y mantiene estados coherentes. |
| Supervisión humana | El usuario profesional conserva la responsabilidad sobre la interpretación y cualquier acción posterior. |

El modelo es un componente interno. Una trabajadora individual no se presupone como usuaria directa del MVP.

### 3.2 Supuestos

- El usuario dispone de navegador y conexión.
- El modelo desplegado habrá sido validado antes de ponerse a disposición del MVP.
- El formulario se ajustará al esquema final del modelo.
- El sistema se utilizará como apoyo a la decisión.

### 3.3 Restricciones

- El caso de uso es exclusivamente laboral y se orienta a la retención de mujeres en puestos STEM.
- El sistema no automatizará decisiones laborales ni realizará vigilancia individual continua.
- El MVP no requerirá autenticación, perfil persistente ni histórico obligatorio.
- El sistema no penalizará, excluirá ni clasificará de forma perjudicial a trabajadoras.

### 3.4 Dependencias documentales

| Documento | Responsabilidad |
|---|---|
| SDD-02 · Architecture | Componentes y decisiones arquitectónicas |
| SDD-04 · Data Pipeline | Datos, transformaciones y validaciones |
| SDD-05 · Modeling | Problema, modelos, métricas y explicabilidad |
| SDD-06 · Frontend | Interfaz, accesibilidad y compatibilidad |
| SDD-07 · API | Interfaces y contratos |
| SDD-08 · Testing | Casos, niveles y evidencias de prueba |
| SDD-09 · Deployment | Despliegue y operación |

---

## 4. Requisitos funcionales

### 4.1 Acceso, finalidad y limitaciones — UC-01

#### FR-001 · Acceso

- **Requisito:** El sistema deberá permitir acceder a la aplicación web sin autenticación.
- **Prioridad:** Must Have.
- **Fuente:** UC-01; BR-09.
- **Criterio de aceptación:** Una sesión sin credenciales puede abrir la interfaz inicial y comenzar el recorrido.

#### FR-002 · Finalidad

- **Requisito:** El sistema deberá presentar la finalidad laboral de TalentCare antes de solicitar datos.
- **Prioridad:** Must Have.
- **Fuente:** UC-01; SDD-00.
- **Criterio de aceptación:** La interfaz inicial identifica el apoyo a la retención de mujeres en puestos STEM y el análisis de señales asociadas al riesgo de salida.

#### FR-003 · Limitaciones

- **Requisito:** El sistema deberá comunicar que el resultado es orientativo, requiere supervisión humana, no establece causalidad y no constituye una decisión laboral.
- **Prioridad:** Must Have.
- **Fuente:** UC-01; BR-03; BR-06.
- **Criterio de aceptación:** Las cuatro limitaciones son visibles antes de solicitar el análisis.

### 4.2 Captura de datos — UC-02

#### FR-004 · Formulario compatible

- **Requisito:** El formulario deberá mostrar únicamente variables compatibles con el esquema del modelo aprobado.
- **Prioridad:** Must Have.
- **Fuente:** UC-02; BR-02; OD-005.
- **Criterio de aceptación:** La lista de campos coincide con la versión aprobada del esquema de inferencia.

#### FR-005 · Campos obligatorios

- **Requisito:** El formulario deberá diferenciar los campos obligatorios de los opcionales.
- **Prioridad:** Must Have.
- **Fuente:** UC-02.
- **Criterio de aceptación:** Cada campo obligatorio dispone de una identificación visible y determinista.

#### FR-006 · Edición y abandono

- **Requisito:** El sistema deberá permitir introducir, seleccionar y modificar valores antes del envío, así como reiniciar o abandonar la interacción.
- **Prioridad:** Must Have.
- **Fuente:** UC-02.
- **Criterio de aceptación:** El usuario puede realizar cada acción sin ejecutar inferencia.

#### FR-007 · Conservación temporal

- **Requisito:** El sistema deberá conservar los datos únicamente durante la interacción conforme a la política temporal aprobada.
- **Prioridad:** Must Have.
- **Fuente:** UC-02; OD-014.
- **Criterio de aceptación:** Los datos permanecen disponibles durante la interacción y siguen la política definida al finalizarla.

### 4.3 Validación — UC-03

#### FR-008 · Obligatoriedad

- **Requisito:** El sistema deberá detectar campos obligatorios sin valor.
- **Prioridad:** Must Have.
- **Fuente:** UC-03; BR-01.
- **Criterio de aceptación:** Cada campo obligatorio vacío impide el análisis y queda identificado.

#### FR-009 · Tipo y formato

- **Requisito:** El sistema deberá rechazar valores cuyo tipo o formato no coincida con el esquema aprobado.
- **Prioridad:** Must Have.
- **Fuente:** UC-03; BR-02.
- **Criterio de aceptación:** Un valor incompatible produce un error asociado al campo y no alcanza la inferencia.

#### FR-010 · Rango y categoría

- **Requisito:** El sistema deberá rechazar valores fuera de los rangos o categorías admitidos.
- **Prioridad:** Must Have.
- **Fuente:** UC-03; BR-02.
- **Criterio de aceptación:** Los casos fuera del dominio aprobado se rechazan antes de procesarse.

#### FR-011 · Mensajes de validación

- **Requisito:** El sistema deberá asociar a cada error de entrada un mensaje comprensible y una posibilidad de corrección.
- **Prioridad:** Must Have.
- **Fuente:** UC-03.
- **Criterio de aceptación:** El usuario puede identificar y corregir el campo afectado sin reiniciar todo el formulario.

#### FR-012 · Bloqueo de inferencia

- **Requisito:** El sistema no deberá ejecutar inferencia mientras exista un error de validación.
- **Prioridad:** Must Have.
- **Fuente:** UC-03; BR-01.
- **Criterio de aceptación:** Ninguna solicitud inválida alcanza el componente de inferencia.

#### FR-013 · Validación en límites

- **Requisito:** Las entradas deberán validarse en la interfaz y nuevamente en el límite de procesamiento que reciba la solicitud.
- **Prioridad:** Must Have.
- **Fuente:** UC-03; SEC-001.
- **Criterio de aceptación:** Una solicitud manipulada que eluda la interfaz sigue siendo rechazada.

### 4.4 Solicitud y procesamiento — UC-04

#### FR-014 · Solicitud válida

- **Requisito:** El sistema deberá permitir solicitar el análisis únicamente después de validar los datos.
- **Prioridad:** Must Have.
- **Fuente:** UC-04; BR-01.
- **Criterio de aceptación:** La acción inicia el procesamiento con datos válidos y permanece bloqueada en caso contrario.

#### FR-015 · Adaptación al esquema

- **Requisito:** El sistema deberá adaptar los datos validados al esquema de inferencia aprobado.
- **Prioridad:** Must Have.
- **Fuente:** UC-04; BR-02.
- **Criterio de aceptación:** El modelo recibe exclusivamente campos, tipos y transformaciones compatibles.

#### FR-016 · Modelo aprobado

- **Requisito:** La inferencia deberá utilizar una versión identificable del modelo y del procesamiento aprobados.
- **Prioridad:** Must Have.
- **Fuente:** UC-04; MLR-013.
- **Criterio de aceptación:** Cada ejecución permite identificar internamente las versiones utilizadas.

#### FR-017 · Estimación

- **Requisito:** El sistema deberá producir una estimación correspondiente a la variable objetivo y a la estrategia de clases finalmente validadas.
- **Prioridad:** Must Have.
- **Fuente:** UC-04; OD-002; OD-004.
- **Criterio de aceptación:** La salida pertenece al dominio aprobado y una salida desconocida se rechaza.

#### FR-018 · Resultado compuesto

- **Requisito:** El sistema deberá preparar el resultado, obtener una explicación y seleccionar o generar recomendaciones, o indicar de forma explícita su indisponibilidad.
- **Prioridad:** Must Have.
- **Fuente:** UC-04; BR-04; BR-05.
- **Criterio de aceptación:** La respuesta diferencia cada elemento disponible de cualquier estado de indisponibilidad.

#### FR-019 · Estado de procesamiento

- **Requisito:** El sistema deberá mostrar un estado de procesamiento y evitar envíos duplicados mientras una solicitud esté activa.
- **Prioridad:** Should Have.
- **Fuente:** UC-04.
- **Criterio de aceptación:** Una acción iniciada muestra espera, bloquea duplicados y finaliza en resultado o error.

### 4.5 Presentación del resultado — UC-05

#### FR-020 · Presentación comprensible

- **Requisito:** El sistema deberá presentar la estimación mediante una etiqueta comprensible.
- **Prioridad:** Must Have.
- **Fuente:** UC-05.
- **Criterio de aceptación:** La interfaz no expone identificadores internos como sustituto de la etiqueta.

#### FR-021 · Separación de información

- **Requisito:** El sistema deberá diferenciar visual y semánticamente los datos de entrada de la estimación.
- **Prioridad:** Must Have.
- **Fuente:** UC-05.
- **Criterio de aceptación:** Una revisión de la interfaz identifica ambas categorías de información sin ambigüedad.

#### FR-022 · Interpretación

- **Requisito:** El resultado deberá mostrarse como estimación no causal, sin lenguaje determinista, diagnóstico o garantía.
- **Prioridad:** Must Have.
- **Fuente:** UC-05; BR-03.
- **Criterio de aceptación:** El contenido visible incluye la limitación y no contiene afirmaciones deterministas.

#### FR-023 · Probabilidad o confianza

- **Requisito:** El sistema podrá mostrar probabilidades o confianza solo después de aprobar y validar su interpretación y presentación.
- **Prioridad:** Could Have.
- **Fuente:** UC-05; OD-013.
- **Criterio de aceptación:** Mientras OD-013 siga Pending no se presenta este valor; tras su aprobación se verifica contra el criterio definido.

#### FR-024 · Vínculo con explicación

- **Requisito:** El resultado deberá vincularse con la explicación de la misma ejecución.
- **Prioridad:** Must Have.
- **Fuente:** UC-05; BR-04.
- **Criterio de aceptación:** No puede asociarse una explicación de otra solicitud o versión.

### 4.6 Explicación — UC-06

#### FR-025 · Explicación local

- **Requisito:** El sistema deberá proporcionar una explicación local asociada a cada predicción válida o un estado explícito de indisponibilidad.
- **Prioridad:** Must Have.
- **Fuente:** UC-06; BR-04.
- **Criterio de aceptación:** Cada predicción válida contiene una explicación vinculada o el estado indicado.

#### FR-026 · Factores relevantes

- **Requisito:** La explicación deberá presentar factores relevantes y, cuando proceda, sus contribuciones positivas o negativas.
- **Prioridad:** Must Have.
- **Fuente:** UC-06.
- **Criterio de aceptación:** Los factores pertenecen a la entrada procesada y su dirección solo aparece cuando el método la sustenta.

#### FR-027 · Comunicación de la explicación

- **Requisito:** La explicación deberá usar lenguaje comprensible, evitar causalidad y no contradecir la predicción.
- **Prioridad:** Must Have.
- **Fuente:** UC-06.
- **Criterio de aceptación:** La revisión funcional confirma las tres condiciones y rechaza explicaciones incoherentes.

### 4.7 Recomendaciones — UC-07

#### FR-028 · Recomendaciones

- **Requisito:** Las recomendaciones deberán ser generales, contextualizadas, no prescriptivas y coherentes con el resultado y la explicación disponible.
- **Prioridad:** Must Have.
- **Fuente:** UC-07; BR-05.
- **Criterio de aceptación:** Cada recomendación supera las reglas de contenido y trazabilidad aprobadas.

#### FR-029 · Indisponibilidad de recomendaciones

- **Requisito:** El sistema no deberá inventar recomendaciones y deberá mostrar un estado controlado cuando no existan recomendaciones válidas.
- **Prioridad:** Must Have.
- **Fuente:** UC-07.
- **Criterio de aceptación:** Un caso sin recomendación válida conserva el resultado y muestra la indisponibilidad.

### 4.8 Nuevo análisis — UC-08

#### FR-030 · Reinicio independiente

- **Requisito:** El sistema deberá permitir iniciar un análisis independiente, limpiar el estado temporal y volver al formulario; podrá pedir confirmación si hay datos no enviados.
- **Prioridad:** Should Have.
- **Fuente:** UC-08; BR-08.
- **Criterio de aceptación:** El nuevo formulario no reutiliza datos, resultados, explicaciones ni recomendaciones anteriores.

### 4.9 Errores e indisponibilidad — UC-09

#### FR-031 · Gestión funcional de errores

- **Requisito:** El sistema deberá interrumpir de forma controlada una operación fallida, mantener un estado coherente, evitar resultados inválidos, informar sin detalles internos y ofrecer reintento o retorno cuando proceda.
- **Prioridad:** Must Have.
- **Fuente:** UC-09; BR-07.
- **Criterio de aceptación:** Los fallos de validación, inferencia, explicación y recomendaciones cumplen todas las condiciones y generan registro técnico.

---

## 5. Requisitos de datos y Machine Learning

### 5.1 Contexto de datos

| Hecho verificado | Implicación |
|---|---|
| Gabriela realizó el EDA de la edición 2021. | El notebook de 2021 conserva la evidencia exploratoria. |
| La edición 2021 contiene 83.439 registros y 48 variables. | Su estructura deberá documentarse sin convertirla en dataset final. |
| La edición 2021 no contiene `JobSat`. | No permite por sí sola entrenar un modelo supervisado con esa variable. |
| La edición 2025 contiene `JobSat`. | Su idoneidad como fuente y la de la variable siguen pendientes de validación. |
| El equipo evalúa ediciones hasta 2025. | La edición o combinación final permanece en OD-001. |

### 5.2 Requisitos de datos

#### DR-001 · Correspondencia de esquema

- **Requisito:** Los datos de entrenamiento e inferencia deberán compartir definiciones compatibles para las variables utilizadas.
- **Prioridad:** Must Have.
- **Fuente:** SDD-00; BR-02.
- **Criterio de aceptación:** Una comparación versionada no detecta diferencias no tratadas de nombre, tipo, categoría o significado.

#### DR-002 · Diccionario de datos

- **Requisito:** El dataset seleccionado deberá disponer de un diccionario con significado, tipo, dominio, nulabilidad y sensibilidad de cada variable utilizada.
- **Prioridad:** Must Have.
- **Fuente:** SDD-04; SDD-05.
- **Criterio de aceptación:** Toda variable incluida en entrenamiento o inferencia aparece documentada.

#### DR-003 · Calidad

- **Requisito:** La calidad deberá evaluarse para valores nulos, duplicados, tipos, rangos, categorías y consistencia.
- **Prioridad:** Must Have.
- **Fuente:** SDD-04.
- **Criterio de aceptación:** Existe un informe reproducible con resultados y tratamiento decidido para cada dimensión.

#### DR-004 · Transformaciones

- **Requisito:** Las transformaciones y codificaciones deberán ser deterministas, reproducibles y compartidas entre entrenamiento e inferencia.
- **Prioridad:** Must Have.
- **Fuente:** SDD-04; SDD-05.
- **Criterio de aceptación:** La misma entrada y versión de pipeline producen la misma representación.

#### DR-005 · Versionado y linaje

- **Requisito:** El dataset y sus transformaciones deberán identificarse mediante versión y linaje.
- **Prioridad:** Must Have.
- **Fuente:** SDD-04.
- **Criterio de aceptación:** Un artefacto entrenado puede vincularse a la fuente y transformación que lo generaron.

#### DR-006 · Separación de capas

- **Requisito:** Los datos brutos deberán mantenerse diferenciados de los datos procesados.
- **Prioridad:** Must Have.
- **Fuente:** SDD-04.
- **Criterio de aceptación:** El pipeline no sobrescribe la fuente bruta y permite reconstruir la capa procesada.

#### DR-007 · Prevención de leakage

- **Requisito:** Las variables y transformaciones deberán auditarse para impedir información no disponible en el momento de inferencia o derivada indebidamente del objetivo.
- **Prioridad:** Must Have.
- **Fuente:** SDD-00; SDD-05.
- **Criterio de aceptación:** La revisión de leakage documenta variables excluidas y no detecta fugas no resueltas.

#### DR-008 · Variables descartadas

- **Requisito:** Toda variable descartada deberá registrar el motivo y la etapa de exclusión.
- **Prioridad:** Must Have.
- **Fuente:** SDD-04; SDD-05.
- **Criterio de aceptación:** La configuración o documentación de selección permite reconstruir la decisión.

#### DR-009 · Variables sensibles

- **Requisito:** Las variables sensibles y sus posibles proxies deberán identificarse y someterse a revisión de finalidad, privacidad y fairness.
- **Prioridad:** Must Have.
- **Fuente:** SDD-00; FAIR-003.
- **Criterio de aceptación:** Existe un inventario revisado antes del entrenamiento final.

#### DR-010 · Representatividad

- **Requisito:** La representatividad del dataset para mujeres en puestos STEM deberá evaluarse y documentarse.
- **Prioridad:** Must Have.
- **Fuente:** SDD-00.
- **Criterio de aceptación:** El informe cuantifica la población disponible y documenta limitaciones relevantes.

#### DR-011 · Selección de dataset

- **Requisito:** Ninguna edición o combinación deberá declararse dataset final hasta resolver OD-001 y documentar comparabilidad, calidad, volumen, población y cambios de esquema.
- **Prioridad:** Must Have.
- **Fuente:** SDD-00; OD-001.
- **Criterio de aceptación:** La selección aprobada incluye evidencia para cada criterio y una decisión registrada.

### 5.3 Requisitos de Machine Learning

#### MLR-001 · Definición del problema

- **Requisito:** El diseño deberá diferenciar el problema de negocio, el fenómeno observado y la variable de modelado.
- **Prioridad:** Must Have.
- **Fuente:** SDD-00.
- **Criterio de aceptación:** SDD-05 documenta por separado riesgo de rotación laboral, señal observada y objetivo seleccionado.

#### MLR-002 · Variable objetivo

- **Requisito:** La variable objetivo deberá justificarse y aprobarse antes del entrenamiento final.
- **Prioridad:** Must Have.
- **Fuente:** OD-002.
- **Criterio de aceptación:** Existe una decisión aprobada con definición, limitaciones y relación con el fenómeno de interés.

#### MLR-003 · Validación de JobSat

- **Requisito:** La idoneidad de `JobSat` como variable objetivo directa o como proxy deberá validarse antes de cerrar el diseño del modelo.
- **Prioridad:** Must Have.
- **Fuente:** SDD-00; OD-003.
- **Criterio de aceptación:** La evaluación distingue satisfacción laboral de rotación laboral y registra una conclusión aprobada.

#### MLR-004 · Estrategia de clases

- **Requisito:** La estrategia de clases deberá justificarse según la variable objetivo, su escala y distribución.
- **Prioridad:** Must Have.
- **Fuente:** OD-004.
- **Criterio de aceptación:** SDD-05 registra clases, reglas de construcción y evidencia; mientras OD-004 siga Pending no se presupone formulación multiclase.

#### MLR-005 · Baseline

- **Requisito:** El modelado deberá establecer un baseline reproducible antes de comparar modelos candidatos.
- **Prioridad:** Must Have.
- **Fuente:** OD-008.
- **Criterio de aceptación:** El baseline aprobado, configuración y resultados quedan registrados.

#### MLR-006 · Modelos candidatos y ensemble

- **Requisito:** Los modelos candidatos y cualquier ensemble deberán compararse bajo el mismo protocolo de evaluación.
- **Prioridad:** Must Have.
- **Fuente:** OD-009; OD-010.
- **Criterio de aceptación:** La tabla comparativa utiliza las mismas particiones, métricas y reglas de validación.

#### MLR-007 · Particiones

- **Requisito:** Los datos deberán separarse en conjuntos de entrenamiento, validación y prueba sin contaminación entre ellos.
- **Prioridad:** Must Have.
- **Fuente:** SDD-05.
- **Criterio de aceptación:** La partición es reproducible y la prueba no interviene en selección ni ajuste.

#### MLR-008 · Validación cruzada

- **Requisito:** La comparación de modelos deberá utilizar validación cruzada cuando sea compatible con los datos y documentar cualquier excepción.
- **Prioridad:** Must Have.
- **Fuente:** SDD-05.
- **Criterio de aceptación:** Los resultados incluyen particiones reproducibles o una justificación aprobada de la excepción.

#### MLR-009 · Hiperparámetros

- **Requisito:** El ajuste de hiperparámetros deberá excluir el conjunto de prueba.
- **Prioridad:** Must Have.
- **Fuente:** SDD-05.
- **Criterio de aceptación:** La configuración de búsqueda solo utiliza entrenamiento y validación.

#### MLR-010 · Métricas

- **Requisito:** Los modelos deberán evaluarse con las métricas y umbrales aprobados para el problema y por clase o subgrupo cuando corresponda.
- **Prioridad:** Must Have.
- **Fuente:** OD-006; OD-007.
- **Criterio de aceptación:** No se selecciona modelo final mientras métricas o umbrales permanezcan sin aprobar.

#### MLR-011 · Sobreajuste y errores

- **Requisito:** La evaluación deberá incluir análisis de sobreajuste y de patrones de error.
- **Prioridad:** Must Have.
- **Fuente:** SDD-00; SDD-05.
- **Criterio de aceptación:** El informe compara particiones y documenta errores relevantes y mitigaciones.

#### MLR-012 · Reproducibilidad

- **Requisito:** El entrenamiento y la evaluación deberán registrar datos, código, configuración, semillas y entorno necesarios para reproducir resultados.
- **Prioridad:** Must Have.
- **Fuente:** SDD-05.
- **Criterio de aceptación:** Una ejecución controlada reproduce el protocolo y resultados dentro de la variación documentada.

#### MLR-013 · Artefacto versionado

- **Requisito:** El modelo, preprocesamiento y esquema de inferencia aprobados deberán persistirse y versionarse como una unidad compatible.
- **Prioridad:** Must Have.
- **Fuente:** SDD-05.
- **Criterio de aceptación:** La carga de una versión recupera los tres elementos y rechaza combinaciones incompatibles.

#### MLR-014 · Selección y limitaciones

- **Requisito:** La selección final deberá justificar la comparación de modelos y documentar limitaciones, población aplicable y usos no permitidos.
- **Prioridad:** Must Have.
- **Fuente:** SDD-00; SDD-05.
- **Criterio de aceptación:** La aprobación del modelo incluye evidencia comparativa y ficha de limitaciones.

#### MLR-015 · Consistencia de inferencia

- **Requisito:** La inferencia deberá aplicar el mismo procesamiento aprobado que la evaluación del modelo.
- **Prioridad:** Must Have.
- **Fuente:** BR-02; DR-004.
- **Criterio de aceptación:** Una prueba de paridad confirma representaciones y salidas coherentes entre ambos flujos.

---

## 6. Explicabilidad, recomendaciones y supervisión humana

### 6.1 Explicabilidad y recomendaciones

| ID | Requisito | Prioridad | Fuente | Criterio de aceptación |
|---|---|---|---|---|
| XR-001 | El método de explicabilidad deberá aprobarse en SDD-05 antes de integrarse. | Must Have | OD-011 | La implementación corresponde al método y versión registrados. |
| XR-002 | La explicación deberá corresponder a la predicción concreta y a los factores efectivamente utilizados. | Must Have | UC-06 | La trazabilidad vincula entrada, versión de modelo, salida y explicación. |
| XR-003 | El sistema deberá rechazar explicaciones vacías, incompatibles o contradictorias. | Must Have | UC-06; BR-07 | Los tres casos producen indisponibilidad controlada y no una explicación válida. |
| XR-004 | Una explicación deberá ser reproducible para la misma entrada, modelo, configuración y condiciones documentadas. | Must Have | SDD-05 | La prueba definida para el método cumple la tolerancia aprobada. |
| XR-005 | La explicación deberá usar nombres comprensibles, contextualizar contribuciones y advertir que asociación no implica causalidad. | Must Have | UC-06; SDD-00 | La revisión de contenido confirma las tres condiciones. |
| XR-006 | La lógica de recomendaciones deberá ser trazable, validable y aprobada antes de su uso. | Must Have | OD-012 | Cada recomendación se vincula a una regla, versión o fuente aprobada. |
| XR-007 | Las recomendaciones deberán revisarse para excluir contenido discriminatorio, perjudicial, prescriptivo, diagnóstico o garantista. | Must Have | UC-07; SDD-00 | El conjunto publicado supera una revisión documentada de las categorías prohibidas. |
| XR-008 | Las recomendaciones deberán relacionarse con el resultado y la explicación disponible, o mostrar indisponibilidad explícita. | Must Have | UC-07; BR-05 | Una recomendación incoherente se rechaza sin alterar la predicción. |

### 6.2 Supervisión humana y uso responsable

| ID | Requisito | Prioridad | Fuente | Criterio de aceptación |
|---|---|---|---|---|
| HR-001 | TalentCare deberá presentarse y operar como herramienta de apoyo a la decisión. | Must Have | SDD-00; BR-06 | La interfaz y documentación no atribuyen al sistema autoridad decisoria. |
| HR-002 | El usuario profesional deberá conservar la interpretación y decisión final. | Must Have | UC-01; SDD-00 | Las advertencias asignan explícitamente la decisión a una persona responsable. |
| HR-003 | Ninguna predicción deberá activar automáticamente contratación, despido, promoción, sanción, evaluación u otra acción laboral. | Must Have | SDD-00; BR-06 | No existe un flujo que ejecute automáticamente esas acciones. |
| HR-004 | El sistema no deberá sustituir el criterio de profesionales de Recursos Humanos, People Analytics o gestión de talento. | Must Have | SDD-00 | Ningún resultado se presenta como instrucción obligatoria. |
| HR-005 | El sistema no deberá utilizarse para vigilancia individual continua. | Must Have | SDD-00 | El MVP carece de seguimiento continuo o perfil histórico individual. |
| HR-006 | Los resultados no deberán utilizarse para penalizar, excluir o clasificar de forma perjudicial a trabajadoras. | Must Have | UC-07; SDD-00 | La limitación es visible y no existen acciones de penalización o exclusión. |
| HR-007 | Los resultados deberán mostrar sus limitaciones y requerir interpretación dentro del contexto profesional aplicable. | Must Have | UC-01; UC-05 | Resultado, explicación y recomendaciones mantienen visibles las limitaciones. |

---

## 7. Requisitos no funcionales

### 7.1 Rendimiento, disponibilidad y resiliencia

#### NFR-001 · Medición de rendimiento

- **Requisito:** El sistema deberá medir los tiempos de las interacciones y del análisis contra los umbrales aprobados.
- **Prioridad:** Must Have.
- **Fuente:** OD-017.
- **Criterio de aceptación:** SDD-08 registra resultados contra los umbrales; no se presupone un valor mientras OD-017 siga Pending.

#### NFR-002 · Espera visible

- **Requisito:** Una operación no inmediata deberá mostrar un estado de procesamiento hasta terminar o fallar.
- **Prioridad:** Should Have.
- **Fuente:** UC-04.
- **Criterio de aceptación:** El indicador aparece durante la operación y desaparece en ambos estados terminales.

#### NFR-003 · Estado coherente

- **Requisito:** Un fallo total o parcial no deberá dejar la interfaz ni el procesamiento en un estado incoherente.
- **Prioridad:** Must Have.
- **Fuente:** UC-09.
- **Criterio de aceptación:** Las pruebas de fallo finalizan en resultado válido, indisponibilidad controlada o error recuperable.

#### NFR-004 · Recuperación

- **Requisito:** Después de un error recuperable, el sistema deberá permitir reintentar o regresar a un estado funcional.
- **Prioridad:** Must Have.
- **Fuente:** UC-09.
- **Criterio de aceptación:** Cada error recuperable probado ofrece al menos una ruta de recuperación operativa.

### 7.2 Usabilidad, accesibilidad y compatibilidad

#### NFR-005 · Lenguaje y consistencia

- **Requisito:** Controles, etiquetas, mensajes, resultados y acciones deberán utilizar lenguaje comprensible y patrones consistentes.
- **Prioridad:** Must Have.
- **Fuente:** UC-01 a UC-09.
- **Criterio de aceptación:** La revisión de interfaz no encuentra términos técnicos sin contexto ni acciones equivalentes con comportamiento contradictorio.

#### NFR-006 · Identificación de errores

- **Requisito:** La interfaz deberá identificar cada error y la acción necesaria para corregirlo o continuar.
- **Prioridad:** Must Have.
- **Fuente:** UC-03; UC-09.
- **Criterio de aceptación:** Los casos de error previstos muestran ubicación, causa funcional y siguiente acción.

#### NFR-007 · Teclado y etiquetas

- **Requisito:** Los controles interactivos deberán poder operarse con teclado y disponer de etiquetas programáticamente asociadas.
- **Prioridad:** Should Have.
- **Fuente:** SDD-06; OD-018.
- **Criterio de aceptación:** El recorrido principal se completa con teclado y los controles exponen nombre accesible.

#### NFR-008 · Percepción

- **Requisito:** El sistema no deberá depender solo del color y deberá mantener contraste y semántica conforme al nivel de accesibilidad aprobado.
- **Prioridad:** Should Have.
- **Fuente:** SDD-06; OD-018.
- **Criterio de aceptación:** Las pruebas del nivel aprobado verifican color, contraste y estructura semántica.

#### NFR-009 · Diseño adaptable

- **Requisito:** La interfaz deberá ser utilizable en los tamaños de pantalla incluidos en la matriz aprobada.
- **Prioridad:** Should Have.
- **Fuente:** OD-019.
- **Criterio de aceptación:** El recorrido crítico funciona en todos los tamaños registrados.

#### NFR-010 · Compatibilidad

- **Requisito:** La aplicación deberá funcionar en la matriz mínima de navegadores y entornos aprobada.
- **Prioridad:** Must Have.
- **Fuente:** OD-019.
- **Criterio de aceptación:** SDD-08 registra el resultado del recorrido crítico para cada elemento de la matriz.

### 7.3 Mantenibilidad, testabilidad y evolución

#### NFR-011 · Modularidad

- **Requisito:** La solución deberá separar responsabilidades de interfaz, negocio, datos, inferencia, explicabilidad y recomendaciones.
- **Prioridad:** Must Have.
- **Fuente:** SDD-00; SDD-02.
- **Criterio de aceptación:** SDD-02 asigna cada responsabilidad a límites identificables sin ciclos no justificados.

#### NFR-012 · Configuración

- **Requisito:** La configuración variable entre entornos deberá gestionarse fuera de la lógica de negocio y sin secretos en el código.
- **Prioridad:** Must Have.
- **Fuente:** SDD-02; SEC-004.
- **Criterio de aceptación:** La revisión del repositorio no encuentra valores sensibles ni configuración de entorno codificados en la lógica.

#### NFR-013 · Calidad y documentación

- **Requisito:** El código, artefactos y documentación deberán mantenerse versionados y alineados con las decisiones SDD aprobadas.
- **Prioridad:** Must Have.
- **Fuente:** BR-10.
- **Criterio de aceptación:** La revisión de una entrega no detecta divergencias no registradas entre implementación y SDD.

#### NFR-014 · Pruebas

- **Requisito:** Los componentes críticos y el recorrido completo deberán disponer de pruebas automatizadas o evidencia reproducible de validación.
- **Prioridad:** Must Have.
- **Fuente:** SDD-08.
- **Criterio de aceptación:** La ejecución definida en SDD-08 cubre unidades críticas e integración desde entrada hasta resultado.

#### NFR-015 · Evolución proporcional

- **Requisito:** La solución deberá permitir sustituir datasets o modelos aprobados sin exigir una arquitectura distribuida para el MVP.
- **Prioridad:** Should Have.
- **Fuente:** SDD-00; SDD-02.
- **Criterio de aceptación:** La arquitectura documenta puntos de sustitución sin imponer componentes fuera del alcance.

---

## 8. Privacidad, seguridad y fairness

### 8.1 Privacidad

| ID | Requisito | Prioridad | Fuente | Criterio de aceptación |
|---|---|---|---|---|
| PR-001 | El sistema deberá solicitar únicamente datos necesarios para la finalidad aprobada. | Must Have | SDD-00 | Cada campo dispone de justificación y los no justificados se excluyen. |
| PR-002 | El MVP no deberá solicitar identificadores personales innecesarios. | Must Have | SDD-00 | El formulario y esquema no contienen identificadores sin finalidad aprobada. |
| PR-003 | Los datos de una interacción no deberán persistirse ni reutilizarse en otra salvo aprobación expresa. | Must Have | BR-08; BR-09; OD-014 | El ciclo de vida cumple la política temporal aprobada. |
| PR-004 | Los datos no deberán utilizarse para una finalidad distinta del análisis solicitado. | Must Have | SDD-00 | Los flujos no incluyen usos secundarios sin decisión aprobada. |
| PR-005 | El almacenamiento de entradas, predicciones o feedback deberá aprobarse y documentar finalidad, datos, acceso, retención y eliminación. | Must Have | OD-022 | Mientras OD-022 siga Pending no existe almacenamiento persistente; si se aprueba, constan los cinco elementos. |

### 8.2 Seguridad

| ID | Requisito | Prioridad | Fuente | Criterio de aceptación |
|---|---|---|---|---|
| SEC-001 | Toda entrada recibida deberá validarse antes de su procesamiento. | Must Have | UC-03 | Se rechazan entradas ausentes, malformadas, fuera de dominio o no previstas. |
| SEC-002 | Los errores no deberán exponer trazas, rutas, configuración, secretos ni detalles internos. | Must Have | UC-09 | Las respuestas de error no contienen ninguna categoría prohibida. |
| SEC-003 | Los secretos y valores sensibles deberán mantenerse fuera del repositorio y del contenido entregado al cliente. | Must Have | SDD-02; SDD-09 | La revisión no encuentra secretos en código, historial entregado ni respuestas. |
| SEC-004 | Las dependencias deberán declararse, versionarse y revisarse para detectar vulnerabilidades conocidas. | Must Have | SDD-03; SDD-09 | La entrega incluye inventario reproducible y resultado de revisión. |
| SEC-005 | Las interfaces expuestas deberán aceptar solo operaciones y datos previstos por sus contratos aprobados. | Must Have | SDD-07 | Las pruebas rechazan entradas no admitidas sin revelar información interna. |
| SEC-006 | Las vulnerabilidades deberán registrarse, evaluarse y resolverse o aceptarse antes del despliegue. | Must Have | SDD-08; SDD-09 | Ninguna vulnerabilidad relevante carece de estado, responsable y decisión. |

### 8.3 Fairness y evaluación responsable

| ID | Requisito | Prioridad | Fuente | Criterio de aceptación |
|---|---|---|---|---|
| FAIR-001 | El rendimiento deberá evaluarse por los subgrupos relevantes definidos en el plan responsable. | Must Have | SDD-00; OD-015 | El informe presenta métricas aprobadas por subgrupo cuando los datos permiten una evaluación válida. |
| FAIR-002 | Las diferencias entre subgrupos deberán cuantificarse y contextualizarse sin asumir que una métrica garantiza equidad. | Must Have | SDD-00; OD-016 | El informe incluye diferencias, limitación muestral y evaluación frente a criterios aprobados. |
| FAIR-003 | Las variables sensibles y posibles proxies deberán revisarse antes de seleccionar variables predictoras. | Must Have | DR-009 | Cada variable dispone de decisión de inclusión, exclusión o uso para auditoría. |
| FAIR-004 | La evaluación deberá documentar la representación de mujeres en puestos STEM y sus limitaciones. | Must Have | SDD-00; DR-010 | El informe incluye tamaños, cobertura y advertencias de generalización. |
| FAIR-005 | Los sesgos y riesgos relevantes deberán documentarse con mitigaciones y riesgos residuales. | Must Have | SDD-00 | Ningún riesgo identificado queda sin evaluación, mitigación o aceptación explícita. |
| FAIR-006 | Las métricas y umbrales de fairness deberán aprobarse antes de aceptar el modelo. | Must Have | OD-015; OD-016 | El modelo no se acepta mientras alguna decisión siga Pending. |
| FAIR-007 | El despliegue deberá bloquearse si no están documentados los riesgos relevantes y su revisión humana. | Must Have | SDD-00; HR-002 | La evidencia de despliegue incluye aprobación responsable y evaluación de riesgos. |

---

## 9. Errores y observabilidad

| ID | Requisito | Prioridad | Fuente | Criterio de aceptación |
|---|---|---|---|---|
| OBS-001 | El sistema deberá registrar información para diagnosticar errores de validación, inferencia, explicación, recomendaciones e infraestructura. | Must Have | UC-09 | Cada fallo previsto identifica etapa, estado y resultado. |
| OBS-002 | Los registros no deberán contener datos personales, sensibles, secretos ni entradas completas innecesarias. | Must Have | PR-001; SEC-003 | La inspección de logs no encuentra categorías prohibidas. |
| OBS-003 | Las operaciones deberán correlacionarse para diagnóstico sin identificar innecesariamente a personas. | Should Have | UC-09 | Una solicitud se sigue mediante un identificador técnico no personal. |
| OBS-004 | El sistema deberá gestionar los tiempos de espera agotados como errores controlados. | Must Have | UC-09; OD-017 | La operación termina sin resultado inválido y ofrece recuperación. |
| OBS-005 | El sistema deberá recopilar las métricas aprobadas de disponibilidad, errores y tiempos. | Should Have | SDD-09; OD-017 | Los indicadores pueden consultarse sin exponer datos sensibles. |
| OBS-006 | Los componentes deberán permitir una comprobación de estado cuando SDD-02 y SDD-09 lo determinen. | Should Have | SDD-02; SDD-09 | Cada componente señalado distingue operación e indisponibilidad. |

---

## 10. Exclusiones y usos prohibidos

### 10.1 Capacidades fuera del MVP

Las capacidades siguientes se remiten a **SDD-00 · Project Scope** y, cuando proceda, a **SDD-10 · Roadmap**:

- Autenticación y perfiles persistentes.
- Histórico y exportación.
- Integraciones corporativas.
- Aplicación móvil y agentes conversacionales.
- Entrenamiento continuo y automatización completa de MLOps.
- Gestión administrable de múltiples modelos.

### 10.2 Usos permanentemente prohibidos

- Decisiones laborales automatizadas.
- Penalización, exclusión o clasificación perjudicial.
- Sustitución de profesionales.
- Vigilancia individual continua.

Los usos prohibidos no constituyen funcionalidades futuras.

---

## 11. Decisiones abiertas

Todas las decisiones de esta sección permanecen en estado `Pending` y no deberán asumirse como cerradas durante diseño o implementación.

| ID | Decisión | Impacto | Documento responsable | Estado |
|---|---|---|---|---|
| OD-001 | Edición o combinación de datasets | Datos, reproducibilidad y modelado | SDD-04 / SDD-05 | Pending |
| OD-002 | Variable objetivo definitiva | Modelo, interfaz y evaluación | SDD-05 | Pending |
| OD-003 | Uso de `JobSat` como target o proxy | Validez del problema | SDD-05 | Pending |
| OD-004 | Estrategia de clases | Modelado, interfaz y pruebas | SDD-05 | Pending |
| OD-005 | Variables definitivas del formulario | Datos, frontend, API y modelo | SDD-04 / SDD-05 / SDD-06 | Pending |
| OD-006 | Métricas de evaluación | Comparación de modelos | SDD-05 / SDD-08 | Pending |
| OD-007 | Umbrales de aceptación del modelo | Aprobación y despliegue | SDD-05 / SDD-08 | Pending |
| OD-008 | Modelo baseline | Comparación inicial | SDD-05 | Pending |
| OD-009 | Modelos candidatos | Experimentación | SDD-05 | Pending |
| OD-010 | Uso y composición de ensemble | Complejidad y rendimiento | SDD-05 | Pending |
| OD-011 | Método de explicabilidad | Interpretación y frontend | SDD-05 / SDD-06 | Pending |
| OD-012 | Lógica de recomendaciones | Contenido y validación | SDD-01 / SDD-05 | Pending |
| OD-013 | Presentación de probabilidades o confianza | Interpretación y calibración | SDD-05 / SDD-06 | Pending |
| OD-014 | Persistencia temporal de datos | Privacidad y arquitectura | SDD-02 / SDD-04 / SDD-07 | Pending |
| OD-015 | Métricas de fairness | Evaluación responsable | SDD-05 / SDD-08 | Pending |
| OD-016 | Umbrales de fairness | Aceptación responsable | SDD-05 / SDD-08 | Pending |
| OD-017 | Umbrales de rendimiento y espera | Experiencia y operación | SDD-02 / SDD-07 / SDD-08 | Pending |
| OD-018 | Nivel objetivo de accesibilidad | Frontend y pruebas | SDD-06 / SDD-08 | Pending |
| OD-019 | Matriz de compatibilidad | Frontend y pruebas | SDD-06 / SDD-08 | Pending |
| OD-020 | Idiomas disponibles | Contenido e interfaz | SDD-01 / SDD-06 | Pending |
| OD-021 | Exportación de resultados | Alcance y privacidad | SDD-00 / SDD-01 / SDD-10 | Pending |
| OD-022 | Almacenamiento de predicciones o feedback | Privacidad y operación | SDD-00 / SDD-02 / SDD-07 | Pending |
| OD-023 | Definición operativa de mujer en los datos | Población y fairness | SDD-04 / SDD-05 | Pending |
| OD-024 | Definición operativa de roles STEM | Población y generalización | SDD-04 / SDD-05 | Pending |

---

## 12. Trazabilidad y aprobación

### 12.1 Casos de uso y requisitos

| Caso de uso | Dominio | Requisitos principales |
|---|---|---|
| UC-01 | Acceso, finalidad, transparencia y limitaciones | FR-001 a FR-003; HR-001; HR-002; HR-007 |
| UC-02 | Captura y tratamiento temporal de datos | FR-004 a FR-007; PR-001 a PR-005 |
| UC-03 | Validación y esquema | FR-008 a FR-013; DR-001; SEC-001 |
| UC-04 | Inferencia y procesamiento | FR-014 a FR-019; MLR-013; MLR-015 |
| UC-05 | Presentación e interpretación | FR-020 a FR-024; HR-007 |
| UC-06 | Explicabilidad | FR-025 a FR-027; XR-001 a XR-005 |
| UC-07 | Recomendaciones y uso responsable | FR-028; FR-029; XR-006 a XR-008; HR-003 a HR-006 |
| UC-08 | Gestión del estado | FR-030; PR-003 |
| UC-09 | Errores, resiliencia y observabilidad | FR-031; NFR-003; NFR-004; OBS-001 a OBS-006 |

### 12.2 Trazabilidad documental

| Fuente o destino | Trazabilidad |
|---|---|
| SDD-00 · Project Scope | Define objetivos, límites, población y usos prohibidos |
| SDD-00A · Casos de uso | Origina los requisitos funcionales UC-01 a UC-09 |
| SDD-02 a SDD-07 | Desarrollan las decisiones técnicas sin ampliar el alcance |
| SDD-08 · Testing | Convertirá requisitos y criterios de aceptación en pruebas detalladas |
| SDD-09 · Deployment | Verificará requisitos de operación, seguridad y observabilidad |

No es necesario mapear cada requisito con archivos de código en esta fase. La trazabilidad detallada con pruebas se completará en **SDD-08 · Testing**.

### 12.3 Criterios de aprobación

El documento podrá aprobarse cuando:

- Esté alineado con SDD-00 y SDD-00A.
- Todos los requisitos tengan identificador único y criterio verificable.
- No existan contradicciones ni requisitos duplicados.
- Ninguna decisión abierta se presente como cerrada.
- Exista trazabilidad con UC-01 a UC-09.
- Estén cubiertos datos, ML, interfaz, API, seguridad, privacidad y fairness.
- El problema y la terminología sean exclusivamente laborales.
- `JobSat` no se presente como objetivo definitivo ni como equivalente de rotación laboral.
- No exista automatización de decisiones laborales.
- Los usos prohibidos estén separados de las capacidades futuras.
- Las referencias cruzadas sean válidas.
