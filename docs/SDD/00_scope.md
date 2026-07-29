# Software Design Document (SDD)

# SDD-00 · Project Scope

| Campo | Valor |
|--------|-------|
| Proyecto | TalentCare AI *(nombre provisional)* |
| Documento | Project Scope |
| Código | SDD-00 |
| Versión | 1.0 |
| Estado | Draft |
| Última actualización | Julio 2026 |
| Documento padre | Project Charter |
| Documentos relacionados | Todos los documentos del Software Design Document (SDD) |

---

# 1. Propósito

Este documento define el alcance funcional y estratégico del proyecto.

Su objetivo es establecer una visión común del producto, delimitando el problema que se pretende resolver, la solución propuesta, los objetivos, el alcance del Producto Mínimo Viable (MVP), las restricciones del proyecto y los principios que guiarán el diseño y desarrollo del sistema.

Este documento constituye la referencia principal del Software Design Document (SDD) y actúa como la fuente oficial para la definición del alcance del proyecto. Todos los documentos posteriores desarrollarán las especificaciones aquí definidas sin modificar el alcance establecido.

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

Este documento no describe aspectos de implementación, arquitectura, tecnologías específicas o detalles técnicos, los cuales serán desarrollados en los documentos posteriores del SDD.

---

# 3. Contexto

La Inteligencia Artificial está transformando la forma en que las organizaciones analizan información y toman decisiones.

En el ámbito de la gestión del talento tecnológico existe una gran disponibilidad de datos relacionados con profesionales del desarrollo de software, incluyendo experiencia laboral, tecnologías utilizadas, formación, modalidades de trabajo, satisfacción profesional, adopción de herramientas basadas en Inteligencia Artificial y evolución de sus carreras.

Sin embargo, disponer de grandes volúmenes de información no implica disponer de conocimiento útil.

Las organizaciones necesitan herramientas capaces de transformar esos datos en información interpretable que permita comprender patrones, identificar tendencias y apoyar la toma de decisiones mediante modelos transparentes y explicables.

Este proyecto surge como una demostración práctica de cómo la Inteligencia Artificial Responsable puede convertir datos reales en conocimiento útil mediante técnicas modernas de Machine Learning.

---

# 4. Problema

Actualmente resulta complejo identificar qué factores influyen en la satisfacción profesional de los desarrolladores utilizando modelos predictivos que sean comprensibles para los usuarios y suficientemente transparentes para justificar sus resultados.

La mayoría de soluciones existentes se limitan a ofrecer estadísticas descriptivas o cuadros de mando históricos, proporcionando escasa capacidad predictiva y poca información sobre las razones que justifican una determinada predicción.

El proyecto pretende demostrar que es posible combinar técnicas de Machine Learning, Inteligencia Artificial Responsable y análisis explicable para construir una solución capaz de generar predicciones útiles, transparentes y orientadas al apoyo de la toma de decisiones.

---

# 5. Visión del producto

Desarrollar una plataforma Software as a Service (SaaS) basada en Inteligencia Artificial Responsable capaz de transformar información profesional en conocimiento accionable mediante modelos predictivos explicables.

La plataforma estará diseñada desde su origen para evolucionar de forma modular, permitiendo incorporar nuevos modelos predictivos, nuevas fuentes de información y nuevos casos de uso sin modificar la estructura general del sistema.

---

# 6. Descripción de la solución

TalentCare AI (nombre provisional) es una plataforma SaaS basada en Inteligencia Artificial Responsable diseñada para transformar datos profesionales en conocimiento útil que apoye la toma de decisiones relacionadas con la gestión del talento.

La solución combina análisis de datos, técnicas de Machine Learning y modelos explicables para identificar patrones presentes en información profesional y generar predicciones comprensibles para el usuario.

En su primera versión (MVP), la plataforma permitirá estimar el nivel de satisfacción laboral de profesionales del desarrollo de software utilizando información procedente de la Stack Overflow Annual Developer Survey. Además de generar la predicción, el sistema ofrecerá una explicación de los factores que han influido en el resultado y recomendaciones derivadas del análisis realizado.

La solución ha sido concebida como una plataforma modular donde el modelo predictivo representa únicamente uno de sus componentes. Su arquitectura permitirá incorporar nuevos modelos de Machine Learning, nuevas variables objetivo y nuevas fuentes de datos sin modificar la estructura general del sistema.

De este modo, el proyecto no se limita al desarrollo de un único modelo predictivo, sino que establece las bases para una plataforma escalable de Inteligencia Artificial aplicada a la analítica del talento y a la toma de decisiones basada en datos.

---

# 7. Objetivos

Los objetivos generales del proyecto son:

- Desarrollar una solución funcional basada en clasificación multiclase.
- Aplicar técnicas de Ensemble Learning sobre datos reales.
- Incorporar mecanismos de Inteligencia Artificial Explicable (XAI).
- Diseñar una plataforma modular preparada para evolucionar mediante nuevos modelos predictivos.
- Aplicar buenas prácticas de ingeniería de software utilizando Specification-Driven Development (SDD).
- Desarrollar un MVP siguiendo un enfoque profesional de diseño y desarrollo de productos software.

---

# 8. Alcance del proyecto

## Incluido en el MVP

El Producto Mínimo Viable incluirá:

- Una aplicación web.
- Un servicio de predicción basado en Machine Learning.
- Visualización de resultados.
- Explicación de las predicciones generadas.
- Recomendaciones derivadas del análisis realizado.
- Una arquitectura preparada para futuras ampliaciones funcionales.

## Fuera del alcance del MVP

No forman parte del alcance inicial:

- Aplicaciones móviles.
- Agentes conversacionales o asistentes de voz.
- Integraciones con plataformas corporativas.
- Entrenamiento continuo del modelo.
- Automatización completa del ciclo MLOps.
- Gestión simultánea de múltiples modelos predictivos.

Estas capacidades forman parte de la evolución prevista del producto.

---

# 9. Usuarios y Stakeholders

La plataforma está orientada principalmente a:

- Departamentos de Recursos Humanos.
- Equipos de Talent Acquisition.
- Engineering Managers.
- Responsables tecnológicos.
- Consultoras especializadas en talento.
- Investigadores.
- Organizaciones interesadas en la gestión del talento basada en datos.

Durante el desarrollo del proyecto también forman parte de los stakeholders:

- Equipo de desarrollo.
- Equipo de Machine Learning.
- Equipo docente.
- Tribunal evaluador.

---

# 10. Descripción funcional del MVP

Desde la perspectiva del usuario, el funcionamiento general del sistema será el siguiente:

1. El usuario proporciona información profesional.
2. El sistema procesa la información recibida.
3. El modelo predictivo estima la categoría objetivo.
4. El sistema explica los factores que han influido en la predicción.
5. El usuario recibe recomendaciones derivadas del análisis realizado.

Los requisitos funcionales detallados serán definidos en el documento **SDD-01 · Requirements**.

---

# 11. Estrategia de datos

La fuente principal de información será la **Stack Overflow Annual Developer Survey**, una de las mayores encuestas internacionales dirigidas a profesionales del desarrollo de software.

La edición 2025 recopila más de **49.000 respuestas procedentes de 177 países**, distribuidas en **62 preguntas** relacionadas con **314 tecnologías, herramientas y plataformas**, incluyendo nuevas preguntas sobre agentes de IA, modelos de lenguaje y herramientas basadas en Inteligencia Artificial.

La versión definitiva del conjunto de datos será seleccionada durante la fase de Análisis Exploratorio de Datos (EDA).

Las alternativas actualmente consideradas son:

- Stack Overflow Developer Survey 2025.
- Stack Overflow Developer Survey 2024–2025.
- Serie histórica de múltiples ediciones.

La decisión final dependerá de la calidad de los datos, la consistencia de las variables y su adecuación al problema de clasificación definido.

La plataforma se diseñará desacoplada de la fuente de datos utilizada, permitiendo incorporar nuevos conjuntos de datos procedentes de organizaciones, instituciones educativas o sistemas corporativos sin modificar la arquitectura conceptual de la solución.

---

# 12. Estrategia de Inteligencia Artificial

El MVP implementará un problema supervisado de clasificación multiclase.

Como primer caso de uso, la variable objetivo seleccionada será:

**Job Satisfaction (JobSat)**

Esta selección se fundamenta en:

- Su relevancia para la gestión del talento.
- Su adecuación a un problema de clasificación multiclase.
- Su potencial para generar explicaciones interpretables mediante técnicas de Inteligencia Artificial Responsable.

Durante la fase de diseño también fueron evaluadas otras variables disponibles en el conjunto de datos, entre ellas:

- NewRole.
- DevType.
- Nivel de experiencia profesional.
- Otras variables relacionadas con la evolución profesional.

La plataforma ha sido diseñada para incorporar nuevos modelos predictivos sin modificar la estructura general del sistema.

---

# 13. Principios de diseño

El proyecto se desarrollará siguiendo los siguientes principios:

- Arquitectura modular y escalable.
- Diseño orientado a la evolución.
- Inteligencia Artificial Responsable.
- Explicabilidad de las predicciones.
- Separación entre lógica de negocio, datos y modelos predictivos.
- Reutilización de componentes.
- Mantenibilidad del software.
- Specification-Driven Development (SDD) como fuente única de verdad para el desarrollo del sistema.

---

# 14. Roadmap

## MVP

La primera versión del producto incluirá:

- Aplicación web.
- Predicción mediante Machine Learning.
- Explicación de las predicciones.
- Generación de recomendaciones.
- Arquitectura modular preparada para crecer.

## Evolución futura

La visión a medio y largo plazo contempla la incorporación de nuevas capacidades como:

- Aplicación móvil.
- Agentes conversacionales o de voz.
- Integración con plataformas de Recursos Humanos.
- Gestión de múltiples modelos predictivos.
- Automatización del ciclo MLOps.
- Incorporación de nuevas fuentes de datos.
- Nuevos casos de uso relacionados con la analítica del talento.

---

# 15. Restricciones

Las principales restricciones identificadas son:

- Tiempo limitado de desarrollo.
- Equipo reducido.
- Desarrollo orientado a un MVP.
- Utilización inicial de conjuntos de datos públicos.
- Calendario académico del proyecto.

---

# 16. Riesgos

Los principales riesgos identificados son:

- Calidad insuficiente del conjunto de datos.
- Distribución desequilibrada de clases.
- Valores ausentes o inconsistentes.
- Limitaciones temporales del proyecto.
- Incremento no controlado del alcance.
- Complejidad del entrenamiento y validación del modelo.

Estos riesgos serán mitigados mediante un desarrollo iterativo, validación continua y priorización de las funcionalidades esenciales del MVP.

---

# 17. Criterios de éxito

El proyecto se considerará satisfactorio si consigue:

- Desarrollar un MVP completamente funcional.
- Implementar un modelo de clasificación multiclase sobre datos reales.
- Proporcionar predicciones explicables.
- Generar recomendaciones basadas en evidencia.
- Mantener una arquitectura preparada para evolucionar.
- Disponer de documentación técnica completa y trazable.
- Garantizar la coherencia entre todos los documentos del Software Design Document.

---

# 18. Trazabilidad

Este documento constituye el punto de partida del Software Design Document (SDD).

Los documentos posteriores desarrollarán las especificaciones del sistema respetando el alcance definido en este documento.

| Documento | Propósito |
|------------|-----------|
| SDD-01 · Requirements | Definición de requisitos funcionales y no funcionales |
| SDD-02 · Architecture | Arquitectura lógica y conceptual del sistema |
| SDD-03 · Implementation Structure | Organización del proyecto y estructura del software |
| SDD-04 · Data Pipeline | Ciclo de vida y procesamiento de los datos |
| SDD-05 · Modeling | Diseño de la solución de Machine Learning |
| SDD-06 · Frontend | Especificación de la interfaz de usuario |
| SDD-07 · API | Definición de las interfaces del sistema |
| SDD-08 · Testing | Estrategia de validación y pruebas |
| SDD-09 · Deployment | Estrategia de despliegue y operación |