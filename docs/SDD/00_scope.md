# 00 — Project Scope

**Project:** *(Nombre por definir)*  
**Version:** 1.0 (Draft)  
**Status:** Team Review  
**Document Type:** Specification-Driven Development (SDD)

---

# 1. Propósito

Este documento define el alcance estratégico del producto y constituye la especificación de mayor nivel dentro del proyecto.

Su objetivo es establecer una visión común sobre el problema que se pretende resolver, el valor que aportará la plataforma, el alcance del Producto Mínimo Viable (MVP) y la dirección de evolución del producto.

Este documento actúa como la **Fuente Única de la Verdad (Single Source of Truth)** para toda la documentación Specification-Driven Development (SDD). Todos los documentos posteriores deberán mantener coherencia y trazabilidad con esta especificación.

---

# 2. Resumen Ejecutivo

El proyecto consiste en desarrollar una **plataforma SaaS de Inteligencia Artificial Responsable** diseñada para ayudar a organizaciones a comprender, anticipar y reducir la pérdida de talento mediante analítica predictiva, modelos explicables e indicadores de equidad.

Como primer caso de uso, la plataforma abordará el fenómeno conocido como **Leaky Pipeline**, analizando dos momentos críticos del ecosistema STEAM:

- la permanencia del alumnado durante su formación;
- la permanencia del talento femenino en organizaciones tecnológicas.

La hipótesis principal del proyecto es que ambos escenarios comparten patrones de riesgo susceptibles de ser identificados mediante Inteligencia Artificial, permitiendo intervenir antes de que el abandono o la rotación lleguen a producirse.

La plataforma se concibe desde su origen como una arquitectura modular preparada para incorporar nuevos dominios de aplicación, nuevos modelos predictivos y futuras capacidades de Inteligencia Artificial conversacional.

---

# 3. Visión

Construir una plataforma SaaS de referencia para la detección temprana de riesgos relacionados con la permanencia del talento, combinando Inteligencia Artificial Responsable, analítica predictiva y apoyo a la toma de decisiones para generar un impacto positivo en instituciones educativas, organizaciones y personas.

---

# 4. Misión

Transformar datos dispersos en conocimiento accionable que permita identificar factores de riesgo, comprender las causas asociadas a la pérdida de talento y facilitar intervenciones preventivas basadas en evidencia.

---

# 5. Problema de Negocio

Las organizaciones generan grandes volúmenes de información, pero la mayor parte de las decisiones relacionadas con la permanencia del talento siguen siendo reactivas.

En la mayoría de los casos, las instituciones detectan el abandono cuando éste ya se ha producido.

Esto genera consecuencias como:

- pérdida de estudiantes;
- rotación del talento;
- incremento de costes;
- disminución de la diversidad;
- pérdida de inversión en formación;
- dificultad para evaluar políticas de inclusión;
- toma de decisiones basada en indicadores tardíos.

Uno de los casos más relevantes es el fenómeno conocido como **Leaky Pipeline**, donde la representación femenina disminuye progresivamente desde la formación hasta el empleo en disciplinas STEAM.

Actualmente existen numerosos datos relacionados con este problema, pero pocas herramientas capaces de transformarlos en información útil para anticipar riesgos y facilitar intervenciones preventivas.

---

# 6. Oportunidad

La Inteligencia Artificial permite analizar grandes volúmenes de información e identificar patrones difíciles de detectar mediante técnicas tradicionales.

La combinación de:

- Machine Learning,
- Inteligencia Artificial Explicable,
- analítica institucional,
- indicadores de equidad,

representa una oportunidad para construir una plataforma capaz de apoyar decisiones más objetivas, transparentes y fundamentadas.

El proyecto busca validar esta propuesta mediante un MVP realista que pueda evolucionar posteriormente hacia nuevos sectores y casos de uso.

---

# 7. Visión del Producto

El producto no pretende convertirse únicamente en un sistema de predicción.

Su propósito es evolucionar hacia una plataforma de Inteligencia Artificial Responsable capaz de integrar distintos servicios relacionados con:

- predicción;
- explicabilidad;
- orientación;
- analítica institucional;
- evaluación de políticas de equidad;
- apoyo a la toma de decisiones.

La arquitectura deberá permitir incorporar nuevos modelos y nuevas capacidades sin rediseñar la plataforma.

---

# 8. Pilares del Producto

## Predicción

Identificar tempranamente situaciones de riesgo mediante modelos de Inteligencia Artificial.

## Explicabilidad

Permitir comprender las razones que justifican cada predicción.

## Equidad

Analizar diferencias entre colectivos para apoyar políticas de inclusión y permanencia.

## Acción

Facilitar información útil que ayude a planificar intervenciones preventivas.

## Evolución

Diseñar una plataforma preparada para incorporar nuevos modelos, nuevos dominios y nuevas capacidades.

---

# 9. Definición del Producto

La solución propuesta es una plataforma SaaS de Inteligencia Artificial Responsable compuesta por distintos módulos especializados.

Inicialmente contará con dos grandes áreas funcionales.

## Analítica Institucional (B2B)

Dirigida a:

- universidades;
- centros de formación;
- bootcamps;
- departamentos de Recursos Humanos;
- equipos de People Analytics.

Permitirá:

- analizar indicadores;
- identificar colectivos con riesgo;
- interpretar predicciones;
- monitorizar métricas de equidad;
- evaluar políticas de permanencia.

## Asistencia Individual (B2C)

Dirigida inicialmente a estudiantes y, posteriormente, a profesionales.

Permitirá ofrecer herramientas de orientación y evolucionará hacia asistentes conversacionales capaces de interactuar mediante texto y voz.

La plataforma nunca sustituirá la decisión humana.

Su finalidad será proporcionar información que facilite mejores decisiones.

---

# 10. Propuesta de Valor

La plataforma combina en una única solución:

- Inteligencia Artificial Responsable;
- analítica predictiva;
- modelos explicables;
- indicadores de equidad;
- análisis del pipeline STEAM;
- arquitectura SaaS modular;
- futura integración de agentes conversacionales.

Más que generar predicciones, el objetivo consiste en facilitar decisiones preventivas basadas en evidencia.

---

# 11. Objetivos

## Objetivos de Negocio

- Reducir el impacto asociado a la pérdida de talento.
- Facilitar políticas de permanencia.
- Apoyar estrategias de diversidad e inclusión.
- Validar un producto SaaS con potencial comercial.

## Objetivos Tecnológicos

- Desarrollar una arquitectura modular.
- Aplicar Inteligencia Artificial Responsable.
- Incorporar modelos explicables.
- Diseñar una plataforma escalable.

## Objetivos Sociales

- Favorecer la permanencia del alumnado.
- Apoyar la reducción de la brecha de género en STEAM.
- Facilitar decisiones más justas y fundamentadas.

---

# 12. Alcance del MVP

La primera versión incluirá:

- plataforma SaaS funcional;
- modelos supervisados de clasificación multiclase;
- panel institucional;
- indicadores de riesgo;
- explicabilidad de resultados;
- métricas de equidad;
- API de inferencia;
- documentación técnica;
- despliegue reproducible.

No forma parte del MVP la incorporación de asistentes conversacionales, aunque la arquitectura deberá facilitar su integración futura.

---

# 13. Datos y Dominios de Aplicación

La plataforma ha sido concebida para trabajar con múltiples dominios de información mediante una arquitectura modular y escalable.

El objetivo del MVP es validar la solución utilizando conjuntos de datos públicos y abiertos representativos de los dominios seleccionados.

La selección definitiva de los datasets se realizará durante la fase de **Análisis Exploratorio de Datos (EDA)**, aplicando criterios objetivos que garanticen la calidad y viabilidad del proyecto.

Entre los criterios de evaluación se considerarán:

- Calidad e integridad de los datos.
- Disponibilidad y licencia de uso.
- Relevancia de las variables.
- Definición de la variable objetivo.
- Balance entre clases.
- Adecuación para modelos supervisados de Machine Learning.
- Consideraciones éticas y legales sobre el tratamiento de los datos.

De forma preliminar, el proyecto contempla evaluar conjuntos de datos pertenecientes a los siguientes dominios:

- Permanencia y abandono académico.
- Retención y rotación del talento en organizaciones.
- Diversidad, inclusión y participación de mujeres en disciplinas STEAM.

La selección final de los datasets, así como la justificación técnica de dicha elección, se documentará durante la fase de EDA y pasará a formar parte de la documentación técnica del proyecto.

Esta aproximación permite desacoplar la definición estratégica del producto de una fuente de datos concreta, garantizando la flexibilidad necesaria para incorporar nuevos conjuntos de datos conforme evolucione la plataforma.
---

# 14. Gobernanza del Dato

El tratamiento de datos constituye uno de los pilares del producto.

La plataforma será diseñada siguiendo principios de gobernanza responsable del dato, incorporando desde su origen:

- minimización de datos;
- privacidad desde el diseño;
- privacidad por defecto;
- trazabilidad;
- transparencia;
- anonimización o seudonimización cuando resulte posible.

Las predicciones generadas por la plataforma tendrán carácter asistencial y nunca sustituirán el criterio profesional.

---

# 15. Cumplimiento Normativo

La plataforma deberá desarrollarse considerando la normativa aplicable.

Entre ella:

- Reglamento General de Protección de Datos (RGPD);
- Reglamento Europeo de Inteligencia Artificial (AI Act);
- normativa sobre accesibilidad digital;
- buenas prácticas en seguridad de la información.

El cumplimiento normativo será un requisito transversal durante todo el ciclo de vida del producto.

---

# 16. Evolución del Producto

La evolución prevista seguirá un enfoque incremental.

**Release 1**

Predicción del abandono académico.

**Release 2**

Predicción de la permanencia del talento en organizaciones.

**Release 3**

Integración de nuevos dominios predictivos.

**Release 4**

Incorporación de asistentes conversacionales basados en Inteligencia Artificial.

**Release 5**

Incorporación de interacción por voz, agentes inteligentes y nuevos servicios de apoyo a la decisión.

---

# 17. Stakeholders

## Instituciones

- Universidades.
- Centros de formación.
- Bootcamps.

## Empresas

- Recursos Humanos.
- People Analytics.
- Diversidad e Inclusión.

## Usuarios

- Estudiantes.
- Profesionales.

## Equipo del Proyecto

- Product Owner.
- Arquitectura.
- Machine Learning.
- Backend.
- Frontend.
- DevOps.
- QA.

---

# 18. Fuera del Alcance

Esta primera versión no contempla:

- decisiones completamente automatizadas;
- sustitución del criterio profesional;
- diagnósticos médicos o psicológicos;
- entrenamiento continuo automático;
- integraciones complejas con ERP, LMS o HRIS;
- agentes conversacionales completamente autónomos.

---

# 19. Principios Éticos

La plataforma se desarrollará conforme a los principios de la Inteligencia Artificial Responsable.

En particular:

- Human-in-the-Loop.
- Transparencia.
- Explicabilidad.
- Equidad.
- Privacidad.
- Responsabilidad.
- Supervisión humana.

---

# 20. Objetivos de Desarrollo Sostenible

La plataforma contribuye principalmente a:

- **ODS 4** — Educación de Calidad.
- **ODS 5** — Igualdad de Género.
- **ODS 8** — Trabajo Decente y Crecimiento Económico.
- **ODS 9** — Industria, Innovación e Infraestructura.
- **ODS 10** — Reducción de las Desigualdades.

---

# 21. Criterios de Éxito

El producto se considerará exitoso cuando demuestre:

- viabilidad técnica;
- utilidad para instituciones educativas y organizaciones;
- capacidad para apoyar la toma de decisiones;
- arquitectura preparada para evolucionar;
- cumplimiento de principios de Inteligencia Artificial Responsable;
- alineación con RGPD y AI Act;
- potencial de convertirse en un producto SaaS comercializable.

---

# 22. Trazabilidad

Este documento constituye la especificación de mayor nivel del proyecto.

Toda la documentación SDD deberá mantener coherencia con este Scope.

Los siguientes documentos derivarán directamente de esta especificación:

- 01_requirements.md
- 02_architecture.md
- 03_implementation_structure.md
- 04_data_pipeline.md
- 05_modeling.md
- 06_frontend.md
- 07_api.md
- 08_testing.md
- 09_deployment.md

Cualquier modificación del alcance, la visión o los objetivos deberá reflejarse en el resto de la documentación para mantener una única fuente de verdad del producto.