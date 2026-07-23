# Software Design Document (SDD)

# SDD-01 · Requisitos del sistema

| Campo | Valor |
|---|---|
| Proyecto | Nombre pendiente de definir |
| Documento | Requisitos del sistema |
| Código | SDD-01 |
| Versión | 1.0 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documento padre | SDD-00 · Project Scope |
| Documento de origen | SDD-00A · Casos de uso |
| Documentos relacionados | SDD-02 a SDD-09 |

## 1. Propósito

Este documento define los requisitos funcionales, no funcionales y las reglas de negocio del Producto Mínimo Viable.

Su finalidad es traducir el alcance aprobado y los casos de uso identificados en especificaciones verificables que orienten el diseño, la implementación y las pruebas del sistema.

Los requisitos aquí definidos constituyen la referencia funcional para:

- El diseño de la arquitectura.
- El desarrollo del frontend.
- La implementación de la API.
- El desarrollo del servicio de inferencia.
- La integración del modelo de Machine Learning.
- La estrategia de pruebas.
- La validación del MVP.

## 2. Alcance del documento

Este documento especifica:

- Actores del sistema.
- Casos de uso de referencia.
- Requisitos funcionales.
- Requisitos no funcionales.
- Reglas de negocio.
- Criterios generales de aceptación.
- Priorización de requisitos.
- Dependencias y decisiones pendientes.
- Trazabilidad entre alcance, casos de uso y requisitos.

Este documento no especifica:

- Tecnologías concretas.
- Arquitectura física o lógica detallada.
- Contratos definitivos de API.
- Diseño visual de pantallas.
- Pipeline de datos detallado.
- Algoritmos concretos de entrenamiento.
- Infraestructura de despliegue.
- Casos de prueba exhaustivos.

Estos aspectos serán desarrollados en los documentos posteriores del SDD.

## 3. Convenciones

### 3.1 Identificación

Los requisitos funcionales utilizarán el formato:

```text
FR-XXX
```

Los requisitos no funcionales utilizarán el formato:

```text
NFR-XXX
```

Las reglas de negocio utilizarán el formato:

```text
BR-XXX
```

Las decisiones pendientes utilizarán el formato:

```text
OD-XXX
```

### 3.2 Prioridad

Los requisitos se clasificarán siguiendo el método MoSCoW:

| Prioridad | Significado |
|---|---|
| Must Have | Imprescindible para que el MVP sea funcional |
| Should Have | Importante, pero aplazable si existe una limitación justificada |
| Could Have | Deseable si existe capacidad disponible |
| Won't Have | Excluido expresamente del MVP |

### 3.3 Redacción normativa

Los requisitos se redactan utilizando el término **deberá** para indicar una obligación verificable del sistema.

Las expresiones **podrá**, **se evaluará** o **pendiente de decisión** indican una capacidad opcional o todavía no aprobada.

## 4. Actores

### 4.1 Usuario

Persona que accede a la aplicación web, introduce información profesional, solicita una predicción y consulta los resultados, explicaciones y recomendaciones generadas.

El MVP no requiere que el usuario disponga de una cuenta ni de un perfil persistente.

### 4.2 Sistema

Conjunto formado por la aplicación web, la lógica de negocio, los mecanismos de validación, el servicio de inferencia, el modelo predictivo, el módulo de explicabilidad y el mecanismo de recomendaciones.

### 4.3 Administrador

El rol de administrador no forma parte del alcance funcional aprobado para el MVP.

Cualquier funcionalidad administrativa futura deberá incorporarse mediante una revisión formal del Scope y de este documento.

## 5. Casos de uso de referencia

Los requisitos de este documento derivan de los siguientes casos de uso:

| Caso de uso | Descripción |
|---|---|
| UC-01 | Acceder a la plataforma |
| UC-02 | Consultar la finalidad del análisis |
| UC-03 | Introducir información profesional |
| UC-04 | Validar la información introducida |
| UC-05 | Solicitar una predicción |
| UC-06 | Consultar el resultado de la predicción |
| UC-07 | Consultar la explicación de la predicción |
| UC-08 | Consultar recomendaciones |
| UC-09 | Iniciar un nuevo análisis |
| UC-10 | Gestionar indisponibilidad o errores del análisis |

## 6. Requisitos funcionales

### 6.1 Acceso e información inicial

#### FR-001 · Acceso a la aplicación

**Descripción**

El sistema deberá permitir al usuario acceder a la aplicación mediante una interfaz web.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-01.

**Precondiciones**

- La aplicación se encuentra desplegada.
- El usuario dispone de un navegador compatible.
- El servicio está disponible.

**Resultado esperado**

El usuario visualiza la interfaz inicial de la plataforma.

**Criterios de aceptación**

- La interfaz inicial carga correctamente.
- El usuario puede identificar la finalidad general de la plataforma.
- El usuario puede localizar la acción necesaria para iniciar un análisis.
- No se requiere autenticación para acceder al MVP.

---

#### FR-002 · Presentación de la finalidad de la solución

**Descripción**

El sistema deberá explicar de forma comprensible qué analiza la plataforma y qué tipo de resultado puede obtener el usuario.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-02.

**Resultado esperado**

El usuario comprende que la plataforma genera una estimación de satisfacción laboral mediante un modelo de Machine Learning.

**Criterios de aceptación**

- La finalidad del análisis se presenta antes de la solicitud de predicción.
- El sistema informa de que el resultado es una estimación.
- El sistema evita presentar el resultado como un hecho cierto o una decisión definitiva.
- El usuario puede identificar que la predicción estará acompañada de una explicación.

---

#### FR-003 · Información sobre las limitaciones del análisis

**Descripción**

El sistema deberá informar al usuario de las limitaciones generales de la predicción y del carácter orientativo del resultado.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-02.

**Resultado esperado**

El usuario dispone del contexto mínimo necesario para interpretar correctamente la predicción.

**Criterios de aceptación**

- Se indica que el resultado depende de la información introducida.
- Se indica que el resultado se basa en patrones aprendidos de datos históricos.
- No se presenta la predicción como diagnóstico, garantía o decisión automatizada sobre una persona.

### 6.2 Captura de información profesional

#### FR-004 · Presentación del formulario de análisis

**Descripción**

El sistema deberá presentar un formulario con las variables necesarias para que el modelo pueda generar una predicción.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-03.

**Precondiciones**

- El usuario ha accedido al flujo de análisis.
- Se ha definido el conjunto de variables requerido por el modelo desplegado.

**Resultado esperado**

El usuario puede introducir o seleccionar la información necesaria.

**Criterios de aceptación**

- El formulario contiene todos los campos obligatorios.
- Los campos se presentan con etiquetas comprensibles.
- Los tipos de control son coherentes con los datos solicitados.
- Las opciones disponibles coinciden con las categorías admitidas por el modelo.

---

#### FR-005 · Introducción de datos profesionales

**Descripción**

El sistema deberá permitir que el usuario introduzca o seleccione los datos profesionales requeridos para ejecutar el análisis.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-03.

**Resultado esperado**

La información introducida queda disponible temporalmente para su validación.

**Criterios de aceptación**

- El usuario puede completar todos los campos requeridos.
- El usuario puede modificar los valores antes de solicitar el análisis.
- Los datos se mantienen durante la interacción actual.
- El sistema no ejecuta la predicción mientras falten datos obligatorios.

---

#### FR-006 · Identificación de campos obligatorios

**Descripción**

El sistema deberá identificar claramente qué campos son obligatorios para realizar la predicción.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-03.

**Criterios de aceptación**

- Los campos obligatorios se diferencian de los opcionales.
- El usuario puede reconocer qué información falta antes de enviar el formulario.
- La ausencia de un campo obligatorio impide solicitar la predicción.

### 6.3 Validación de datos

#### FR-007 · Validación de campos obligatorios

**Descripción**

El sistema deberá comprobar que todos los campos obligatorios han sido completados antes de solicitar una predicción.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-04.

**Resultado esperado**

Solo se procesan formularios completos.

**Criterios de aceptación**

- El sistema detecta campos obligatorios vacíos.
- El sistema identifica los campos afectados.
- El sistema muestra un mensaje comprensible.
- La predicción no se ejecuta hasta que los errores hayan sido corregidos.

---

#### FR-008 · Validación de formato y tipo

**Descripción**

El sistema deberá verificar que cada dato introducido cumple el tipo y formato esperado.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-04.

**Criterios de aceptación**

- Los valores numéricos solo aceptan formatos compatibles.
- Las variables categóricas solo aceptan opciones reconocidas.
- Los valores no válidos se rechazan antes de ejecutar la inferencia.
- El usuario recibe una indicación clara sobre cómo corregir el error.

---

#### FR-009 · Validación de rangos y categorías

**Descripción**

El sistema deberá validar que los valores introducidos se encuentran dentro de los rangos o categorías aceptados por el modelo.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-04.

**Criterios de aceptación**

- El sistema impide valores fuera de los rangos permitidos.
- El sistema impide categorías desconocidas.
- Las reglas de validación coinciden con el esquema de inferencia.
- Los errores se comunican sin exponer detalles técnicos internos.

---

#### FR-010 · Corrección de datos inválidos

**Descripción**

El sistema deberá permitir al usuario corregir los datos que no hayan superado la validación.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-04.

**Criterios de aceptación**

- Los valores válidos permanecen disponibles cuando se detecta otro error.
- Los campos incorrectos se identifican visualmente.
- El usuario puede corregirlos sin reiniciar todo el formulario.
- El sistema vuelve a validar los datos tras la corrección.

### 6.4 Predicción

#### FR-011 · Solicitud de análisis

**Descripción**

El sistema deberá permitir al usuario solicitar una predicción cuando la información introducida haya sido validada correctamente.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-05.

**Precondiciones**

- Los datos requeridos están completos.
- Los datos han superado las validaciones.
- El modelo está disponible.

**Resultado esperado**

El sistema inicia el proceso de inferencia.

**Criterios de aceptación**

- La acción de análisis solo está disponible cuando los datos son válidos.
- El sistema evita solicitudes duplicadas accidentales.
- El usuario recibe una indicación de que la solicitud está siendo procesada.

---

#### FR-012 · Preparación de datos para inferencia

**Descripción**

El sistema deberá transformar la información validada al esquema esperado por el modelo desplegado.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-05.

**Resultado esperado**

El modelo recibe un conjunto de variables compatible con el pipeline de inferencia.

**Criterios de aceptación**

- Las variables se envían en el orden y formato esperado.
- Se aplican las mismas transformaciones requeridas por el pipeline validado.
- No se incluyen variables desconocidas.
- La inferencia se bloquea si el esquema no es compatible.

---

#### FR-013 · Ejecución de inferencia

**Descripción**

El sistema deberá ejecutar el modelo de Machine Learning sobre los datos validados y preparados.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-05.

**Resultado esperado**

El modelo devuelve una categoría válida de satisfacción laboral.

**Criterios de aceptación**

- La inferencia utiliza el modelo aprobado para el MVP.
- La respuesta contiene una categoría reconocida.
- El sistema detecta respuestas vacías, incompletas o inválidas.
- Los errores de inferencia se gestionan de forma controlada.

---

#### FR-014 · Obtención de la categoría predicha

**Descripción**

El sistema deberá recuperar y procesar la categoría de satisfacción laboral estimada por el modelo.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-05 y UC-06.

**Criterios de aceptación**

- La categoría pertenece al conjunto de clases definido durante el modelado.
- La categoría se transforma a una etiqueta comprensible para el usuario.
- El sistema no muestra identificadores internos del modelo.
- Una categoría desconocida genera un error controlado.

---

#### FR-015 · Presentación del estado de procesamiento

**Descripción**

El sistema deberá informar al usuario mientras la predicción se encuentra en proceso.

**Prioridad**

Should Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-05.

**Criterios de aceptación**

- El usuario recibe una señal visual de procesamiento.
- El formulario no se envía repetidamente durante la espera.
- El sistema recupera el control de la interfaz al finalizar o fallar la solicitud.

### 6.5 Presentación del resultado

#### FR-016 · Visualización de la predicción

**Descripción**

El sistema deberá mostrar al usuario la categoría de satisfacción laboral estimada.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-06.

**Precondiciones**

- La inferencia se ha completado correctamente.
- La categoría devuelta es válida.

**Resultado esperado**

El usuario visualiza el resultado principal del análisis.

**Criterios de aceptación**

- La categoría predicha se presenta de forma destacada.
- La etiqueta es comprensible.
- El resultado se identifica como una estimación del modelo.
- La predicción se diferencia claramente de los datos introducidos.

---

#### FR-017 · Contextualización del resultado

**Descripción**

El sistema deberá acompañar la predicción con información que facilite su interpretación.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-06.

**Criterios de aceptación**

- Se explica brevemente qué representa la categoría mostrada.
- Se evita lenguaje determinista.
- El resultado se vincula con su explicación.
- El resultado se vincula con las recomendaciones disponibles.

---

#### FR-018 · Presentación de probabilidades o confianza

**Descripción**

El sistema podrá mostrar probabilidades por clase o un nivel de confianza cuando esta funcionalidad haya sido aprobada y validada por el equipo.

**Prioridad**

Pendiente de decisión.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-06.

**Estado**

Decisión abierta.

**Condiciones para su inclusión**

- El modelo debe producir valores interpretables.
- Las probabilidades deben estar suficientemente calibradas.
- La presentación no debe inducir a una interpretación errónea.
- El equipo debe aprobar formalmente su inclusión en el MVP.

### 6.6 Explicabilidad

#### FR-019 · Generación de explicación

**Descripción**

El sistema deberá obtener una explicación asociada a cada predicción válida.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-07.

**Resultado esperado**

Existe información que permite identificar los factores más relevantes de la predicción.

**Criterios de aceptación**

- La explicación corresponde a la predicción concreta.
- Los factores explicativos pertenecen a las variables utilizadas por el modelo.
- El sistema detecta explicaciones vacías o incompatibles.
- La explicación no contradice el resultado mostrado.

---

#### FR-020 · Presentación de factores relevantes

**Descripción**

El sistema deberá mostrar al usuario los factores que más han influido en la predicción.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-07.

**Criterios de aceptación**

- Los factores se presentan con nombres comprensibles.
- La información técnica se traduce a lenguaje accesible.
- Se diferencia, cuando proceda, entre contribuciones favorables y desfavorables.
- La explicación se vincula claramente al resultado concreto.

---

#### FR-021 · Visualización comprensible de la explicación

**Descripción**

El sistema deberá presentar la explicación mediante texto, recursos visuales o una combinación de ambos.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-07.

**Criterios de aceptación**

- La explicación puede comprenderse sin conocimientos avanzados de Machine Learning.
- Los elementos visuales incluyen etiquetas.
- El sistema evita exponer valores técnicos sin contexto.
- La representación utilizada es coherente con los datos explicativos.

---

#### FR-022 · Gestión de indisponibilidad de la explicación

**Descripción**

El sistema deberá gestionar de forma controlada los casos en los que la explicación no pueda generarse.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-07 y UC-10.

**Criterios de aceptación**

- El sistema no presenta explicaciones inventadas o incompletas como válidas.
- El usuario recibe un mensaje comprensible.
- La predicción se identifica como parcialmente disponible.
- El sistema registra el error para su diagnóstico.

### 6.7 Recomendaciones

#### FR-023 · Generación o selección de recomendaciones

**Descripción**

El sistema deberá generar o seleccionar recomendaciones relacionadas con la predicción y con la información explicativa disponible.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-08.

**Resultado esperado**

El usuario recibe recomendaciones contextualizadas con el análisis.

**Criterios de aceptación**

- Las recomendaciones mantienen relación con el resultado.
- Las recomendaciones utilizan la información explicativa cuando esta se encuentra disponible.
- El sistema evita recomendaciones incompatibles con la predicción.
- La lógica aplicada puede ser trazada y validada.

---

#### FR-024 · Presentación de recomendaciones

**Descripción**

El sistema deberá mostrar las recomendaciones de forma clara, estructurada y comprensible.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-08.

**Criterios de aceptación**

- Las recomendaciones se diferencian del resultado predictivo.
- El contenido utiliza lenguaje no determinista.
- No se presentan como órdenes, diagnósticos o garantías.
- El usuario puede identificar su relación con el análisis.

---

#### FR-025 · Gestión de recomendaciones no disponibles

**Descripción**

El sistema deberá informar de manera controlada cuando no existan recomendaciones válidas para un resultado.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-08 y UC-10.

**Criterios de aceptación**

- El sistema no inventa recomendaciones.
- Se informa al usuario de la indisponibilidad.
- La ausencia de recomendaciones no modifica la categoría predicha.
- El error se registra cuando corresponda.

### 6.8 Reinicio del análisis

#### FR-026 · Inicio de un nuevo análisis

**Descripción**

El sistema deberá permitir que el usuario inicie un nuevo análisis después de consultar un resultado.

**Prioridad**

Should Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-09.

**Criterios de aceptación**

- El usuario dispone de una acción para iniciar un nuevo análisis.
- La aplicación vuelve al formulario.
- El resultado anterior deja de mostrarse como resultado activo.
- Los datos del análisis previo no se reutilizan accidentalmente.

---

#### FR-027 · Limpieza del estado temporal

**Descripción**

El sistema deberá eliminar del estado activo los datos temporales del análisis anterior cuando el usuario inicie uno nuevo.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-09.

**Criterios de aceptación**

- Los campos del nuevo formulario no contienen valores anteriores salvo decisión explícita.
- Las explicaciones anteriores no se vinculan a la nueva predicción.
- Las recomendaciones anteriores no se reutilizan.
- La nueva solicitud se procesa como una interacción independiente.

### 6.9 Gestión de errores

#### FR-028 · Detección de errores funcionales

**Descripción**

El sistema deberá detectar errores que impidan completar la validación, inferencia, explicación o generación de recomendaciones.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-10.

**Criterios de aceptación**

- Los errores se detectan antes de presentar resultados inválidos.
- El sistema diferencia entre errores de validación y errores internos.
- Los componentes afectados se identifican internamente.
- El sistema conserva un estado coherente.

---

#### FR-029 · Mensajes de error comprensibles

**Descripción**

El sistema deberá mostrar mensajes de error comprensibles para el usuario sin exponer detalles técnicos internos.

**Prioridad**

Must Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-10.

**Criterios de aceptación**

- El mensaje explica qué operación no pudo completarse.
- El mensaje evita trazas, nombres internos o datos sensibles.
- El usuario recibe una acción posible para continuar.
- Los mensajes mantienen un lenguaje coherente en toda la aplicación.

---

#### FR-030 · Reintento de una operación

**Descripción**

El sistema deberá permitir al usuario volver a intentar una predicción cuando el error sea recuperable.

**Prioridad**

Should Have.

**Actor principal**

Usuario.

**Caso de uso relacionado**

UC-10.

**Criterios de aceptación**

- El usuario puede volver al formulario o repetir la solicitud.
- Los datos válidos pueden conservarse cuando sea seguro.
- El sistema evita solicitudes duplicadas no controladas.
- El nuevo intento no reutiliza respuestas inválidas.

---

#### FR-031 · Prevención de resultados parciales inválidos

**Descripción**

El sistema no deberá presentar como resultado completo una respuesta incompleta, inconsistente o técnicamente inválida.

**Prioridad**

Must Have.

**Actor principal**

Sistema.

**Caso de uso relacionado**

UC-10.

**Criterios de aceptación**

- Una categoría desconocida no se muestra como válida.
- Una explicación incompatible no se presenta.
- Las recomendaciones no se muestran si no cumplen las reglas definidas.
- El sistema diferencia entre resultado completo, resultado parcial controlado y error.

## 7. Requisitos no funcionales

### 7.1 Rendimiento

#### NFR-001 · Tiempo de respuesta de la interfaz

La aplicación deberá responder a las interacciones locales del usuario sin bloqueos perceptibles durante el uso normal.

**Prioridad:** Must Have.

**Métrica definitiva:** pendiente de definir en función de la arquitectura y las pruebas.

---

#### NFR-002 · Tiempo de respuesta de la predicción

El sistema deberá devolver el resultado de una solicitud de predicción dentro de un tiempo compatible con una experiencia interactiva.

**Prioridad:** Must Have.

**Valor objetivo:** pendiente de aprobación.

La métrica definitiva deberá establecerse antes de aprobar el documento de Testing.

---

#### NFR-003 · Estado de espera visible

Cuando una operación no sea inmediata, el sistema deberá mostrar un estado de procesamiento.

**Prioridad:** Should Have.

### 7.2 Disponibilidad y resiliencia

#### NFR-004 · Disponibilidad para demostración

El sistema deberá encontrarse operativo durante las sesiones planificadas de evaluación y demostración.

**Prioridad:** Must Have.

---

#### NFR-005 · Gestión controlada de fallos

Los fallos de un componente no deberán provocar que el sistema presente resultados inválidos como correctos.

**Prioridad:** Must Have.

---

#### NFR-006 · Recuperación de la interfaz

Después de un error recuperable, la interfaz deberá permitir al usuario volver a un estado funcional.

**Prioridad:** Must Have.

### 7.3 Usabilidad

#### NFR-007 · Claridad de la interfaz

La interfaz deberá utilizar textos, controles y mensajes comprensibles para usuarios sin conocimientos técnicos especializados.

**Prioridad:** Must Have.

---

#### NFR-008 · Consistencia de interacción

Los formularios, mensajes, acciones y resultados deberán mantener criterios de interacción consistentes.

**Prioridad:** Must Have.

---

#### NFR-009 · Prevención de errores

La interfaz deberá reducir la probabilidad de errores mediante controles adecuados, opciones limitadas y validaciones visibles.

**Prioridad:** Must Have.

---

#### NFR-010 · Diseño adaptable

La aplicación deberá ser utilizable en los tamaños de pantalla definidos para el MVP.

**Prioridad:** Should Have.

Los dispositivos y resoluciones objetivo deberán especificarse en `SDD-06 · Frontend`.

### 7.4 Accesibilidad

#### NFR-011 · Navegación comprensible

La estructura y los componentes de la interfaz deberán seguir una jerarquía comprensible.

**Prioridad:** Should Have.

---

#### NFR-012 · Alternativas textuales

Los elementos visuales que transmitan información relevante deberán disponer de etiquetas o alternativas textuales.

**Prioridad:** Should Have.

---

#### NFR-013 · No dependencia exclusiva del color

El sistema no deberá utilizar únicamente el color para comunicar estados, errores o diferencias entre factores.

**Prioridad:** Should Have.

El nivel concreto de conformidad de accesibilidad queda pendiente de definición.

### 7.5 Seguridad y privacidad

#### NFR-014 · Minimización de datos

El sistema solo deberá solicitar los datos necesarios para realizar la predicción y presentar el resultado.

**Prioridad:** Must Have.

---

#### NFR-015 · Ausencia de datos identificativos innecesarios

El MVP no deberá solicitar datos personales identificativos que no sean necesarios para la inferencia.

**Prioridad:** Must Have.

---

#### NFR-016 · Validación de entradas

Toda información recibida por el sistema deberá ser validada antes de su procesamiento.

**Prioridad:** Must Have.

---

#### NFR-017 · Protección de detalles internos

Los mensajes dirigidos al usuario no deberán exponer trazas, configuraciones, rutas internas, secretos ni detalles técnicos sensibles.

**Prioridad:** Must Have.

---

#### NFR-018 · Persistencia limitada

Los datos introducidos por el usuario no deberán almacenarse de forma persistente salvo que esta capacidad sea aprobada y documentada expresamente.

**Prioridad:** Must Have.

La gestión exacta del estado temporal se definirá en los documentos de Arquitectura y Data Pipeline.

### 7.6 Inteligencia Artificial Responsable

#### NFR-019 · Explicabilidad

Toda predicción válida deberá estar acompañada de una explicación o de un estado explícito que informe de la indisponibilidad de dicha explicación.

**Prioridad:** Must Have.

---

#### NFR-020 · Transparencia

El sistema deberá informar al usuario de que el resultado ha sido generado mediante un modelo de Machine Learning.

**Prioridad:** Must Have.

---

#### NFR-021 · No determinismo comunicativo

El lenguaje utilizado no deberá presentar la predicción como una verdad absoluta, diagnóstico o garantía.

**Prioridad:** Must Have.

---

#### NFR-022 · Coherencia entre predicción y explicación

La información explicativa deberá corresponder a la misma ejecución de inferencia que generó el resultado.

**Prioridad:** Must Have.

---

#### NFR-023 · Coherencia de recomendaciones

Las recomendaciones deberán estar vinculadas a la predicción y a los factores disponibles.

**Prioridad:** Must Have.

---

#### NFR-024 · Evaluación del modelo

El modelo deberá evaluarse mediante métricas adecuadas para clasificación multiclase antes de integrarse en el MVP.

**Prioridad:** Must Have.

Las métricas concretas y sus umbrales se definirán en `SDD-05 · Modeling`.

---

#### NFR-025 · Evaluación de clases

La evaluación del modelo deberá considerar el comportamiento por clase y no únicamente una métrica agregada.

**Prioridad:** Must Have.

---

#### NFR-026 · Trazabilidad del modelo

La versión del modelo utilizada por el sistema deberá poder identificarse internamente.

**Prioridad:** Should Have.

### 7.7 Mantenibilidad

#### NFR-027 · Modularidad

El sistema deberá mantener separados los componentes de interfaz, lógica de negocio, inferencia, explicabilidad y recomendaciones.

**Prioridad:** Must Have.

---

#### NFR-028 · Desacoplamiento del modelo

La aplicación no deberá depender de detalles internos del algoritmo más allá del contrato de inferencia definido.

**Prioridad:** Must Have.

---

#### NFR-029 · Calidad del código

El código deberá mantener criterios homogéneos de estructura, legibilidad y documentación.

**Prioridad:** Must Have.

---

#### NFR-030 · Configuración externa

Los valores de configuración que puedan variar entre entornos no deberán quedar codificados directamente en el código fuente cuando puedan gestionarse de forma externa.

**Prioridad:** Must Have.

---

#### NFR-031 · Documentación sincronizada

Las decisiones implementadas deberán mantenerse alineadas con los documentos del SDD.

**Prioridad:** Must Have.

### 7.8 Testabilidad

#### NFR-032 · Requisitos verificables

Cada requisito Must Have deberá disponer de uno o más criterios de aceptación verificables.

**Prioridad:** Must Have.

---

#### NFR-033 · Pruebas automatizadas

Los componentes críticos deberán disponer de pruebas automatizadas adecuadas a su naturaleza.

**Prioridad:** Must Have.

---

#### NFR-034 · Validación de integración

El flujo completo desde la entrada de datos hasta la presentación del resultado deberá ser probado de forma integrada.

**Prioridad:** Must Have.

---

#### NFR-035 · Reproducibilidad del modelo

El proceso de entrenamiento y evaluación deberá poder reproducirse dentro de las condiciones definidas por el proyecto.

**Prioridad:** Must Have.

### 7.9 Observabilidad

#### NFR-036 · Registro de errores

El sistema deberá registrar los errores técnicos necesarios para facilitar su diagnóstico.

**Prioridad:** Must Have.

---

#### NFR-037 · No inclusión de datos sensibles en logs

Los registros no deberán contener información sensible o identificativa innecesaria.

**Prioridad:** Must Have.

---

#### NFR-038 · Identificación del origen del fallo

Los registros deberán permitir distinguir, cuando sea posible, entre errores de validación, inferencia, explicación, recomendaciones e infraestructura.

**Prioridad:** Should Have.

### 7.10 Compatibilidad

#### NFR-039 · Navegadores compatibles

La aplicación deberá funcionar en los navegadores definidos como objetivo para el MVP.

**Prioridad:** Must Have.

La lista definitiva se especificará en `SDD-06 · Frontend`.

---

#### NFR-040 · Contratos estables

La comunicación entre componentes deberá utilizar contratos definidos y documentados.

**Prioridad:** Must Have.

## 8. Reglas de negocio

| ID | Regla |
|---|---|
| BR-001 | El sistema solo deberá ejecutar una predicción cuando todos los datos obligatorios hayan sido validados. |
| BR-002 | El modelo solo deberá recibir variables compatibles con su esquema de inferencia. |
| BR-003 | La variable objetivo del MVP será Job Satisfaction, salvo modificación formal del Scope. |
| BR-004 | La salida principal deberá corresponder a una de las categorías definidas y aprobadas durante el modelado. |
| BR-005 | Toda predicción válida deberá vincularse a una explicación o a un estado explícito de indisponibilidad. |
| BR-006 | Las recomendaciones deberán mantener coherencia con la predicción y con la explicación disponible. |
| BR-007 | El sistema no deberá presentar las recomendaciones como diagnósticos, garantías ni decisiones obligatorias. |
| BR-008 | El sistema no deberá presentar predicciones técnicamente inválidas, incompletas o desconocidas como resultados correctos. |
| BR-009 | El MVP no dependerá de autenticación, cuentas de usuario ni perfiles persistentes. |
| BR-010 | El MVP no almacenará un histórico de análisis salvo modificación formal del alcance. |
| BR-011 | Un nuevo análisis deberá tratarse como una interacción independiente. |
| BR-012 | El sistema no deberá reutilizar accidentalmente datos, explicaciones o recomendaciones de una interacción anterior. |
| BR-013 | Los campos del formulario deberán derivar de las variables utilizadas por el pipeline aprobado. |
| BR-014 | Las transformaciones aplicadas en inferencia deberán ser compatibles con las utilizadas durante el entrenamiento. |
| BR-015 | La predicción se comunicará como una estimación probabilística o estadística, no como una certeza sobre el usuario. |
| BR-016 | La lógica de recomendaciones deberá ser trazable y validable. |
| BR-017 | Las decisiones pendientes no deberán ser asumidas unilateralmente por agentes o componentes de implementación. |
| BR-018 | Cualquier funcionalidad fuera del MVP deberá aprobarse primero mediante una actualización del Scope y de los requisitos. |

## 9. Requisitos excluidos del MVP

Las siguientes capacidades no forman parte de la primera versión:

| ID | Capacidad excluida |
|---|---|
| EX-001 | Registro y autenticación de usuarios |
| EX-002 | Perfiles persistentes |
| EX-003 | Histórico de predicciones |
| EX-004 | Comparación de análisis |
| EX-005 | Exportación de informes, salvo aprobación posterior |
| EX-006 | Panel administrativo |
| EX-007 | Gestión de múltiples modelos |
| EX-008 | Selección de diferentes variables objetivo |
| EX-009 | Integración con plataformas corporativas |
| EX-010 | Aplicación móvil |
| EX-011 | Agente conversacional |
| EX-012 | Interacción por voz |
| EX-013 | Reentrenamiento automático |
| EX-014 | Automatización completa de MLOps |
| EX-015 | Decisiones automatizadas sobre personas |

## 10. Decisiones pendientes

| ID | Decisión | Impacto |
|---|---|---|
| OD-001 | Edición o combinación de ediciones del dataset | Data Pipeline y Modeling |
| OD-002 | Variables finales del formulario | Frontend, API y Modeling |
| OD-003 | Clases finales de JobSat | Modeling, Frontend y Testing |
| OD-004 | Técnica concreta de explicabilidad | Modeling y Frontend |
| OD-005 | Lógica concreta de recomendaciones | Requirements, Modeling y Testing |
| OD-006 | Mostrar solo categoría o también probabilidades/confianza | Modeling y Frontend |
| OD-007 | Umbral máximo de respuesta de inferencia | Architecture, API y Testing |
| OD-008 | Idiomas disponibles en el MVP | Frontend y Testing |
| OD-009 | Navegadores y tamaños de pantalla objetivo | Frontend y Testing |
| OD-010 | Nivel concreto de accesibilidad | Frontend y Testing |
| OD-011 | Persistencia exclusivamente en memoria o ausencia total de estado en backend | Architecture y Data Pipeline |
| OD-012 | Inclusión de exportación de resultados | Scope y Requirements |
| OD-013 | Métricas mínimas de aceptación del modelo | Modeling y Testing |
| OD-014 | Tecnología o mecanismo de generación de recomendaciones | Architecture y Modeling |

Las decisiones pendientes deberán resolverse en el documento responsable o mediante una decisión formal del equipo antes de su implementación.

## 11. Priorización del MVP

### Must Have

- Acceso web sin autenticación.
- Información sobre la finalidad y limitaciones.
- Formulario de entrada.
- Validación de datos.
- Ejecución del modelo.
- Presentación de la categoría predicha.
- Explicación de la predicción.
- Recomendaciones.
- Gestión de errores.
- Protección frente a resultados inválidos.
- Minimización de datos.
- Pruebas del flujo crítico.
- Documentación sincronizada.

### Should Have

- Estado visible de procesamiento.
- Inicio directo de un nuevo análisis.
- Reintento de operaciones recuperables.
- Diseño adaptable.
- Medidas básicas de accesibilidad.
- Identificación interna de la versión del modelo.
- Clasificación detallada del origen de errores.

### Could Have

No se han aprobado todavía requisitos Could Have para el MVP.

Las mejoras adicionales deberán evaluarse después de garantizar todos los requisitos Must Have.

### Won't Have

- Autenticación.
- Histórico.
- Panel administrativo.
- Múltiples modelos.
- Integraciones corporativas.
- Aplicación móvil.
- Voz.
- Agente conversacional.
- Reentrenamiento automático.
- MLOps completo.

## 12. Criterios generales de aceptación del MVP

El MVP podrá considerarse funcionalmente aceptado cuando:

1. El usuario pueda acceder a la aplicación sin autenticación.
2. El sistema explique la finalidad y las limitaciones del análisis.
3. El usuario pueda completar el formulario con las variables definidas.
4. El sistema detecte y comunique los datos inválidos.
5. El sistema pueda ejecutar una inferencia con datos válidos.
6. El sistema muestre una categoría reconocida de satisfacción laboral.
7. El usuario pueda consultar una explicación asociada a la predicción.
8. El usuario pueda consultar recomendaciones coherentes con el análisis.
9. El sistema gestione de forma controlada los fallos de inferencia, explicación o recomendaciones.
10. El sistema no presente respuestas incompletas como resultados válidos.
11. Los componentes críticos dispongan de pruebas.
12. La implementación se mantenga alineada con el Scope, los casos de uso y este documento.

## 13. Trazabilidad de requisitos funcionales

| Caso de uso | Requisitos |
|---|---|
| UC-01 | FR-001 |
| UC-02 | FR-002, FR-003 |
| UC-03 | FR-004, FR-005, FR-006 |
| UC-04 | FR-007, FR-008, FR-009, FR-010 |
| UC-05 | FR-011, FR-012, FR-013, FR-014, FR-015 |
| UC-06 | FR-014, FR-016, FR-017, FR-018 |
| UC-07 | FR-019, FR-020, FR-021, FR-022 |
| UC-08 | FR-023, FR-024, FR-025 |
| UC-09 | FR-026, FR-027 |
| UC-10 | FR-022, FR-025, FR-028, FR-029, FR-030, FR-031 |

## 14. Dependencias documentales

| Documento | Relación con Requirements |
|---|---|
| SDD-00 · Project Scope | Define el alcance que los requisitos deben respetar |
| SDD-00A · Casos de uso | Define las interacciones de las que derivan los requisitos |
| SDD-02 · Architecture | Diseñará los componentes necesarios para satisfacer los requisitos |
| SDD-03 · Implementation Structure | Organizará el código según las responsabilidades definidas |
| SDD-04 · Data Pipeline | Especificará datos, transformaciones y validaciones |
| SDD-05 · Modeling | Definirá clases, modelo, métricas, explicabilidad y recomendaciones |
| SDD-06 · Frontend | Convertirá los requisitos de interacción en interfaces |
| SDD-07 · API | Definirá los contratos necesarios para el flujo funcional |
| SDD-08 · Testing | Convertirá requisitos y criterios de aceptación en pruebas |
| SDD-09 · Deployment | Definirá cómo operar el sistema en los entornos previstos |

## 15. Criterios de aprobación del documento

Este documento podrá aprobarse cuando el equipo confirme:

- Que todos los casos de uso del MVP están cubiertos por requisitos.
- Que cada requisito funcional tiene un comportamiento verificable.
- Que no se han introducido funcionalidades fuera del Scope.
- Que las decisiones abiertas están claramente identificadas.
- Que los requisitos Must Have representan el mínimo necesario para la demostración.
- Que los requisitos de IA Responsable están incluidos.
- Que los requisitos pueden transformarse en tareas, componentes y pruebas.
- Que los distintos agentes del proyecto pueden interpretar el documento sin asumir decisiones no aprobadas.