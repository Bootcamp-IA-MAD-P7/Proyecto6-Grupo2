# Software Design Document (SDD)

# SDD-00 · Project Scope

| Campo | Valor |
|--------|-------|
| Proyecto | TalentCare *(nombre provisional)* |
| Documento | Project Scope |
| Código | SDD-00 |
| Versión | 1.1 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documento padre | Project Charter |
| Documentos relacionados | Todos los documentos del Software Design Document (SDD) |

---

# 1. Propósito

Este documento define el alcance funcional y estratégico del proyecto.

Su objetivo es establecer una visión común del producto, delimitando el problema que se pretende resolver, la solución propuesta, los objetivos, el alcance del Producto Mínimo Viable (MVP), las restricciones del proyecto y los principios que guiarán el diseño y desarrollo del sistema.

Este documento constituye la referencia principal del Software Design Document (SDD) y actúa como la fuente oficial para la definición del alcance del proyecto. Todos los documentos posteriores desarrollarán las especificaciones aquí definidas sin modificar el alcance establecido.

Las decisiones que permanezcan abiertas deberán identificarse y registrarse expresamente en este documento o en el documento SDD responsable. Ninguna decisión pendiente deberá interpretarse ni implementarse como una decisión cerrada sin validación formal del equipo.

---

# 2. Alcance del documento

Este documento describe:

- El contexto del proyecto.
- El problema que se pretende resolver.
- La solución propuesta.
- La visión del producto.
- Los objetivos generales.
- El alcance funcional del MVP.
- La estrategia de datos.
- La estrategia general de Inteligencia Artificial.
- Los principios de diseño.
- La visión de evolución del producto.
- La población objetivo.
- El objetivo de negocio.
- Las decisiones metodológicas pendientes.

Este documento no describe aspectos de implementación, arquitectura, tecnologías específicas o detalles técnicos, los cuales serán desarrollados en los documentos posteriores del SDD.

---

# 3. Contexto

La permanencia y el desarrollo profesional de las mujeres en puestos STEM constituyen un ámbito relevante para la gestión del talento. En determinadas trayectorias STEM persisten situaciones de infrarrepresentación y pérdida de talento femenino que limitan la diversidad de los equipos y la capacidad de las organizaciones para conservar conocimiento y experiencia.

Las organizaciones disponen de datos profesionales, laborales, tecnológicos y de satisfacción, pero continúan encontrando dificultades para transformar esa información en señales tempranas, comprensibles y útiles para apoyar estrategias de retención.

Disponer de grandes volúmenes de información no implica disponer de conocimiento accionable. La interpretación debe considerar la calidad de los datos, la representación de la población objetivo, los posibles sesgos y las limitaciones del fenómeno que se pretende analizar.

TalentCare surge como una demostración práctica de cómo la Inteligencia Artificial Responsable y explicable puede apoyar a People Analytics, Recursos Humanos y managers en la identificación de patrones relevantes, sin sustituir el criterio profesional ni automatizar decisiones laborales.

---

# 4. Problema

Actualmente resulta complejo identificar patrones asociados al riesgo de rotación laboral de mujeres en puestos STEM mediante modelos que sean suficientemente transparentes, explicables y responsables para apoyar decisiones de retención.

El alcance distingue tres niveles que no deben confundirse:

1. **Objetivo de negocio:** contribuir a mejorar la retención y permanencia del talento femenino en puestos STEM.
2. **Fenómeno de interés:** identificar señales asociadas al riesgo de rotación laboral o riesgo de salida.
3. **Posible variable de modelado:** `JobSat`, actualmente en evaluación como variable objetivo o proxy.

La satisfacción laboral y la rotación laboral no son fenómenos equivalentes. La posible relación entre una baja satisfacción y una futura salida constituye una hipótesis de trabajo que deberá validarse mediante análisis de datos, revisión conceptual y comparación con variables más directas cuando estén disponibles.

El proyecto pretende demostrar que es posible combinar Machine Learning, Inteligencia Artificial Responsable y análisis explicable para generar estimaciones útiles como apoyo a la retención, documentando las limitaciones y evitando interpretaciones causales no justificadas.

---

# 5. Visión del producto

Desarrollar TalentCare como una plataforma Software as a Service (SaaS) basada en Inteligencia Artificial Responsable, orientada a apoyar la retención de mujeres en puestos STEM mediante modelos predictivos explicables.

La plataforma estará diseñada desde su origen para evolucionar de forma modular, permitiendo incorporar nuevos modelos predictivos, nuevas fuentes de información y nuevos casos de uso sin modificar la estructura general del sistema.

TalentCare proporcionará apoyo a la decisión. No generará ni ejecutará decisiones laborales automatizadas sobre personas.

---

# 6. Descripción de la solución

TalentCare (nombre provisional) es una plataforma SaaS basada en Inteligencia Artificial Responsable diseñada para apoyar a Recursos Humanos, People Analytics, managers y dirección en la retención del talento femenino en puestos STEM.

La solución combina análisis de datos, técnicas de Machine Learning y mecanismos de explicabilidad para identificar patrones y generar una estimación relacionada con el riesgo de rotación laboral, de acuerdo con el caso de uso y la variable objetivo que finalmente sean validados.

`JobSat` está siendo evaluada como posible variable objetivo o proxy, pero todavía no se ha aprobado como representación definitiva de la rotación laboral. El MVP deberá ofrecer explicaciones de los factores relevantes y recomendaciones generales de apoyo, nunca instrucciones automáticas o prescriptivas sobre trabajadoras.

La solución ha sido concebida como una plataforma modular donde el modelo predictivo representa únicamente uno de sus componentes. Su arquitectura permitirá incorporar nuevos modelos de Machine Learning, nuevas variables objetivo y nuevas fuentes de datos sin modificar la estructura general del sistema.

De este modo, el proyecto establece las bases para una plataforma escalable de Inteligencia Artificial aplicada a People Analytics y a la toma de decisiones de retención basada en datos, con supervisión humana y prevención de usos discriminatorios.

---

# 7. Objetivos

Los objetivos generales del proyecto son:

- Contribuir a la retención y permanencia de mujeres en puestos STEM.
- Identificar señales o factores asociados al riesgo de rotación laboral.
- Desarrollar una solución funcional de clasificación multiclase, siempre que la variable objetivo finalmente validada mantenga esta formulación.
- Aplicar técnicas de Ensemble Learning sobre datos reales.
- Incorporar mecanismos de Inteligencia Artificial Explicable (XAI).
- Evaluar riesgos de sesgo, discriminación y uso fuera de contexto.
- Diseñar una plataforma modular preparada para evolucionar mediante nuevos modelos predictivos.
- Aplicar buenas prácticas de ingeniería de software utilizando Specification-Driven Development (SDD).
- Desarrollar un MVP siguiendo un enfoque profesional de diseño y desarrollo de productos software.

---

# 8. Alcance del proyecto

## Incluido en el MVP

El Producto Mínimo Viable incluirá:

- Una aplicación web.
- Un servicio de inferencia basado en Machine Learning.
- Entrada de información profesional relevante.
- Una estimación predictiva vinculada al caso de uso aprobado y a la variable objetivo finalmente validada.
- Visualización de resultados y de los factores relevantes.
- Explicación de las predicciones generadas.
- Recomendaciones generales, no prescriptivas y orientadas al apoyo a la decisión.
- Una arquitectura modular preparada para futuras ampliaciones funcionales.

## Fuera del alcance del MVP

No forman parte del alcance inicial:

- Aplicaciones móviles.
- Agentes conversacionales o asistentes de voz.
- Decisiones automatizadas sobre contratación, promoción, despido, evaluación o cualquier otra medida laboral.
- Penalización, exclusión o clasificación perjudicial de trabajadoras.
- Sustitución del criterio de profesionales de Recursos Humanos.
- Vigilancia individual continua.
- Integraciones con plataformas corporativas o sistemas de Recursos Humanos.
- Entrenamiento continuo del modelo.
- Automatización completa del ciclo MLOps.
- Gestión simultánea de múltiples modelos predictivos.

Estas capacidades forman parte de la evolución prevista del producto.

---

# 9. Usuarios y Stakeholders

La plataforma está orientada principalmente a:

- Departamentos de Recursos Humanos.
- Equipos de People Analytics.
- Responsables de retención y desarrollo de talento.
- Engineering Managers.
- Responsables tecnológicos.
- Responsables de diversidad, equidad e inclusión.
- Dirección.
- Consultoras especializadas en talento.

Durante el desarrollo del proyecto también forman parte de los stakeholders:

- Equipo de desarrollo.
- Equipo de Machine Learning.
- Equipo docente.
- Tribunal evaluador.

---

# 10. Descripción funcional del MVP

Desde la perspectiva del usuario, el funcionamiento general del sistema será el siguiente:

1. El usuario introduce información profesional relevante.
2. El sistema valida y procesa los datos.
3. El modelo genera una estimación correspondiente a la variable objetivo finalmente validada.
4. El sistema muestra la predicción y su nivel o categoría.
5. El sistema explica los factores que influyen en el resultado.
6. El usuario recibe recomendaciones generales de apoyo a la decisión.

El resultado no constituye una decisión laboral automática y deberá interpretarse con supervisión humana y dentro de las limitaciones documentadas.

Los requisitos funcionales detallados serán definidos en el documento **SDD-01 · Requirements**.

---

# 11. Estrategia de datos

La fuente principal candidata es la **Stack Overflow Annual Developer Survey**.

Gabriela realizó el EDA completo de la edición 2021. Este conjunto contiene **83.439 registros y 48 variables**, y su análisis cubrió calidad de datos, valores nulos, perfil de población, perfil profesional, compensación, tecnologías, variables sensibles y viabilidad para Machine Learning.

La edición 2021 no contiene `JobSat`. Por tanto, es válida para EDA, documentación y análisis descriptivo, pero no puede utilizarse de forma aislada para entrenar un modelo supervisado que emplee `JobSat` como objetivo.

Se verificó que la edición 2025 sí contiene `JobSat`. Los demás integrantes del equipo están analizando otras ediciones disponibles hasta 2025. Todavía no se ha decidido si el entrenamiento utilizará un único año o una combinación multianual.

Antes de seleccionar el conjunto de entrenamiento deberán evaluarse:

- Los años en los que aparece `JobSat`.
- La consistencia de su definición y escala entre ediciones.
- Las variables comunes disponibles.
- La calidad y el volumen de datos.
- La estrategia de combinación de ediciones.
- La identificación de mujeres en cada conjunto de datos.
- La delimitación de roles STEM.
- Los cambios de esquema entre años.

La plataforma se diseñará desacoplada de la fuente utilizada. Como posibles fuentes futuras se contemplan únicamente datos corporativos laborales, sistemas de Recursos Humanos y otras fuentes laborales autorizadas.

---

# 12. Estrategia de Inteligencia Artificial

Se pretende desarrollar un problema supervisado de clasificación multiclase, sujeto a la validación final de la variable objetivo y de la estrategia de clases.

## Variable objetivo pendiente de validación

`JobSat` es actualmente una variable candidata y un posible proxy del riesgo de rotación laboral. Su selección no es definitiva.

La satisfacción laboral y la rotación laboral no son equivalentes. La relación deberá validarse mediante:

- Análisis de los datos disponibles.
- Revisión conceptual del fenómeno de rotación.
- Comparación con variables más directas, si existen.
- Investigación de variables relacionadas con intención de cambio de empleo, permanencia, riesgo de salida o evolución profesional.

La formulación multiclase solo se mantendrá si la variable objetivo definitiva, su escala y la distribución de clases justifican este enfoque.

La plataforma ha sido diseñada para incorporar nuevos modelos predictivos sin modificar la estructura general del sistema.

---

# 13. Principios de diseño

El proyecto se desarrollará siguiendo los siguientes principios:

- Arquitectura modular y escalable.
- Diseño orientado a la evolución.
- Inteligencia Artificial Responsable.
- Human-in-the-loop.
- Fairness by Design.
- Explainability by Default.
- Minimización de datos.
- Prevención de usos discriminatorios.
- Separación entre predicción y decisión laboral.
- Trazabilidad de datos, modelos y resultados.
- Separación entre lógica de negocio, datos y modelos predictivos.
- Reutilización de componentes.
- Mantenibilidad del software.
- Specification-Driven Development (SDD) como fuente única de verdad para el desarrollo del sistema.

---

# 14. Decisiones abiertas

Las siguientes decisiones deberán mantenerse abiertas hasta que exista evidencia suficiente y una aprobación formal del equipo:

| Decisión | Estado |
|----------|--------|
| Variable objetivo definitiva | Pending |
| Validez de `JobSat` como target o proxy | Pending |
| Dataset final de entrenamiento | Pending |
| Selección de uno o varios años | Pending |
| Estrategia de integración multianual | Pending |
| Definición operativa de mujer en el dataset | Pending |
| Definición de roles STEM | Pending |
| Variables predictoras definitivas | Pending |
| Estrategia de clases | Pending |
| Estrategia de Ensemble Learning | Pending |
| Métricas de fairness | Pending |
| Estrategia de explicabilidad | Pending |

---

# 15. Roadmap

El documento específico de roadmap todavía no existe y se creará como **SDD-10 · Roadmap**. Esta sección presenta únicamente una visión resumida de evolución.

## MVP

La primera versión del producto contempla:

- Aplicación web.
- Estimación predictiva vinculada al caso de uso aprobado.
- Explicación de resultados y factores relevantes.
- Recomendaciones generales de apoyo a la decisión.
- Arquitectura modular preparada para crecer.

## Evolución futura

La visión a medio y largo plazo contempla:

- Incorporación de datasets corporativos laborales autorizados.
- Integración con sistemas de Recursos Humanos.
- Monitorización del rendimiento y de posibles sesgos.
- Gestión de múltiples modelos predictivos.
- Automatización progresiva del ciclo MLOps.
- Nuevos casos de uso laborales relacionados con la retención y People Analytics.

---

# 16. Restricciones

Las principales restricciones identificadas son:

- Tiempo limitado de desarrollo.
- Equipo reducido.
- Desarrollo orientado a un MVP.
- Dependencia inicial de datasets públicos y autodeclarados.
- Disponibilidad y consistencia de variables entre ediciones.
- Calendario académico del desarrollo.
- Ausencia inicial de datos corporativos reales.

---

# 17. Riesgos

Los principales riesgos identificados son:

- Calidad insuficiente, valores ausentes o inconsistentes.
- Distribución desequilibrada de clases.
- Sesgos de representación.
- Baja representación de mujeres en determinados subconjuntos.
- Uso de un proxy insuficiente para representar la rotación laboral.
- Cambios de esquema entre años.
- Fuga de información.
- Sobreajuste.
- Interpretaciones causales incorrectas.
- Uso discriminatorio o fuera de contexto.
- Recomendaciones demasiado prescriptivas.
- Limitaciones temporales e incremento no controlado del alcance.
- Complejidad del entrenamiento y validación del modelo.

Las medidas generales de mitigación incluirán:

- Validación iterativa.
- Auditoría de variables.
- Análisis de fairness.
- Explicabilidad de resultados.
- Documentación de limitaciones.
- Revisión humana.
- Priorización de las funcionalidades esenciales del MVP.

---

# 18. Criterios de éxito

El proyecto se considerará satisfactorio si consigue:

- Desarrollar un MVP funcional.
- Implementar y validar un modelo supervisado sobre datos reales.
- Justificar y documentar la variable objetivo.
- Proporcionar predicciones explicables.
- Evaluar sesgos, riesgos y limitaciones.
- Demostrar utilidad como apoyo a decisiones de retención de talento femenino en puestos STEM.
- Evitar la automatización de decisiones laborales.
- Generar recomendaciones generales y no prescriptivas.
- Mantener una arquitectura modular preparada para evolucionar.
- Disponer de documentación técnica completa, trazable y coherente.

---

# 19. Trazabilidad

Este documento constituye el punto de partida del Software Design Document (SDD).

Los documentos posteriores desarrollarán las especificaciones del sistema respetando el alcance definido en este documento.

| Documento | Propósito |
|------------|-----------|
| SDD-00A · Use Cases | Definición de actores, interacciones y casos de uso del MVP |
| SDD-01 · Requirements | Definición de requisitos funcionales y no funcionales |
| SDD-02 · Architecture | Arquitectura lógica y conceptual del sistema |
| SDD-03 · Implementation Structure | Organización del proyecto y estructura del software |
| SDD-04 · Data Pipeline | Ciclo de vida y procesamiento de los datos |
| SDD-05 · Modeling | Diseño de la solución de Machine Learning |
| SDD-06 · Frontend | Especificación de la interfaz de usuario |
| SDD-07 · API | Definición de las interfaces del sistema |
| SDD-08 · Testing | Estrategia de validación y pruebas |
| SDD-09 · Deployment | Estrategia de despliegue y operación |
| SDD-10 · Roadmap | Evolución funcional y técnica del producto — pendiente de creación |
