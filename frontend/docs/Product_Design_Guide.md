# TalentCare – Guía de Diseño del Producto

**Versión:** 1.0  
**Estado:** Borrador  
**Propietario:** Equipo de Producto  
**Documentos relacionados:** Product Scope, SDD, Frontend SDD

---

# Índice

1. Introducción
2. Visión del producto
3. Principios de UX
4. Identidad visual
5. Sistema de diseño
6. Pantallas principales
7. Reglas de desarrollo Frontend
8. Manifiesto de diseño

---

# 1. Introducción

## Objetivo

Esta guía establece los principios de diseño que deben seguirse durante el desarrollo de TalentCare.

No pretende documentar cada componente o detalle técnico del frontend. Su objetivo es servir como referencia común para que todas las decisiones de Producto, UX y Frontend sean coherentes.

Cuando exista una duda sobre una decisión de diseño, este documento tendrá prioridad antes de comenzar cualquier implementación.

---

## Alcance

Esta guía define:

- La filosofía del producto.
- La experiencia de usuario.
- La identidad visual.
- Los patrones principales de interfaz.
- Las reglas de diseño.
- Los criterios de consistencia del frontend.

Los detalles técnicos de implementación se documentan en los SDD.

---

# 2. Visión del producto

## ¿Qué es TalentCare?

TalentCare es una plataforma de **People Analytics** que utiliza Inteligencia Artificial Explicable para ayudar a los profesionales de Recursos Humanos a identificar riesgos de abandono laboral y tomar mejores decisiones de retención.

La Inteligencia Artificial ayuda a tomar decisiones, pero nunca sustituye el criterio profesional.

---

## ¿Qué NO es TalentCare?

TalentCare no es:

- Un HRIS.
- Un ATS.
- Una herramienta de vigilancia de empleados.
- Un sistema que toma decisiones automáticamente.

Es una plataforma de apoyo para la toma de decisiones.

---

## Usuarios principales

- Directores de RRHH.
- HR Business Partners.
- Especialistas en People Analytics.
- Responsables de Talento.

---

## Principios del producto

Todas las decisiones del producto deben seguir estos principios:

- Las personas están en el centro.
- La IA debe ser explicable.
- Las decisiones deben basarse en datos.
- La ética es un requisito.
- La experiencia debe ser consistente.
- La plataforma debe ser accesible.
- La privacidad y la seguridad forman parte del diseño (*Privacy & Security by Design*).
- El producto debe facilitar el cumplimiento normativo (RGPD, AI Act y normativa aplicable).

---

# 3. Principios de UX

## 1. La IA ayuda, las personas deciden

La plataforma proporciona información para ayudar a decidir, pero la decisión siempre pertenece al profesional de RRHH.

---

## 2. Todo debe poder explicarse

Las predicciones deben indicar por qué se han generado.

No debe existir el efecto "caja negra".

---

## 3. Reducir la carga cognitiva

La interfaz debe simplificar la información, no complicarla.

Cada pantalla debe tener un objetivo claro.

---

## 4. Los datos antes que las opiniones

Los gráficos y métricas deben ayudar a responder preguntas de negocio.

No se añaden elementos únicamente por estética.

---

## 5. Consistencia

Los mismos problemas deben resolverse siempre de la misma manera.

Botones, tablas, filtros y navegación deben comportarse igual en toda la aplicación.

---

## 6. Accesibilidad

La plataforma debe ser utilizable por cualquier persona.

Como mínimo se seguirá el estándar WCAG AA.

---

## 7. Información progresiva

Primero se muestra un resumen.

Después, el usuario profundiza únicamente cuando necesita más información.

---

## 8. Confianza antes que espectacularidad

Nuestro objetivo no es impresionar.

Nuestro objetivo es generar confianza.

---

## 9. Seguridad y privacidad por diseño

La protección de los datos personales forma parte de la experiencia de usuario.

La interfaz debe mostrar únicamente la información necesaria, respetar los permisos de acceso y minimizar la exposición de datos sensibles.

---

# 4. Identidad visual

## Personalidad

TalentCare debe transmitir:

- Profesionalidad.
- Confianza.
- Calma.
- Modernidad.
- Cercanía.

---

## Colores

Los colores comunican significado.

- Verde → Riesgo bajo.
- Ámbar → Riesgo medio.
- Rojo → Riesgo alto.
- Azul → Información.
- Gris → Contenido neutro.

Nunca se utilizará el color como único indicador.

---

## Tipografía

Se utilizará una tipografía limpia y fácilmente legible (Inter).

La prioridad es la lectura, no la personalidad.

---

## Iconografía

Los iconos deben ser:

- Simples.
- Consistentes.
- Funcionales.

Los iconos nunca sustituyen al texto.

---

## Imágenes

Las imágenes deben mostrar personas y entornos de trabajo reales.

Se evitarán:

- Robots.
- Cerebros digitales.
- Hologramas.
- Estética futurista.
- Clichés corporativos.

La tecnología queda en segundo plano.

Las personas son el centro del producto.

---

# 5. Sistema de diseño

## Componentes principales

Todo el frontend debe construirse reutilizando componentes.

Componentes principales:

- Botón
- Tarjeta
- KPI Card
- Tabla
- Formulario
- Modal
- Indicador de riesgo
- Buscador
- Panel de filtros

---

## Regla principal

Antes de crear un componente nuevo debemos preguntarnos:

1. ¿Ya existe uno parecido?
2. ¿Podemos reutilizarlo?
3. ¿Podemos ampliarlo?

Solo si la respuesta es **no** se creará un componente nuevo.

---

## Estructura de pantalla

La mayoría de pantallas seguirán este orden:

- Título
- Acciones principales
- Filtros
- Contenido principal
- Información adicional

---

## Responsive

La experiencia principal está diseñada para escritorio.

Tablet y móvil ofrecerán una experiencia simplificada.

---

## Diseño para sistemas seguros

El diseño debe favorecer la seguridad del producto.

Siempre que sea posible:

- Mostrar únicamente la información necesaria.
- Evitar datos personales innecesarios.
- Diferenciar claramente la información confidencial.
- Diseñar pensando en permisos y roles de usuario.

---

# 6. Pantallas principales

## Dashboard Ejecutivo

**Objetivo**

Ofrecer una visión rápida del estado general de la organización.

**Incluye**

- KPIs.
- Gráficos.
- Alertas.
- Resumen ejecutivo.

---

## Lista de empleados

**Objetivo**

Buscar, filtrar y comparar empleados.

**Incluye**

- Buscador.
- Filtros.
- Tabla.
- Paginación.

---

## Perfil del empleado

**Objetivo**

Entender la situación concreta de un empleado.

**Incluye**

- Resumen.
- Nivel de riesgo.
- Evolución.
- Recomendaciones.

---

## Detalle de la predicción

**Objetivo**

Explicar por qué el modelo ha generado esa predicción.

**Incluye**

- Nivel de riesgo.
- Probabilidad.
- Variables más importantes.
- Nivel de confianza.

---

# 7. Reglas de desarrollo Frontend

## Reutilizar antes de crear

Siempre se reutilizarán componentes existentes antes de crear nuevos.

---

## Seguir esta guía

Las decisiones no deben basarse en gustos personales.

Si existe una regla en este documento, debe respetarse.

---

## Accesibilidad

Todas las pantallas deben cumplir como mínimo:

- Navegación mediante teclado.
- Contraste adecuado.
- Estados de foco visibles.

---

## Seguridad y cumplimiento

Toda nueva funcionalidad debe revisarse también desde el punto de vista de:

- Protección de datos (RGPD).
- Seguridad de la información.
- Control de accesos.
- Trazabilidad.
- Cumplimiento del AI Act cuando resulte aplicable.

La experiencia de usuario nunca debe comprometer la seguridad del sistema.

---

## Definition of Done

Una funcionalidad solo estará terminada cuando:

- Cumpla el objetivo de negocio.
- Respete los principios de UX.
- Utilice componentes aprobados.
- Sea responsive.
- Sea accesible.
- Cumpla los requisitos de seguridad y privacidad.
- La documentación esté actualizada.

---

# 8. Manifiesto de diseño

TalentCare no pretende sustituir a las personas.

Pretende ayudarles a tomar mejores decisiones.

Por ello creemos que:

- La simplicidad es mejor que la complejidad.
- La consistencia es mejor que la creatividad sin criterio.
- La transparencia es mejor que la opacidad.
- Los datos son mejores que las suposiciones.
- La accesibilidad es una obligación.
- La seguridad y la privacidad forman parte del diseño.
- El cumplimiento legal debe estar integrado desde el inicio del producto.
- Un buen sistema es mejor que muchas pantallas diferentes.

Cada decisión de diseño debe aumentar la confianza del usuario, proteger la información y facilitar que los profesionales de RRHH comprendan los datos y actúen con criterio, siempre dentro de un marco de seguridad, ética y cumplimiento normativo.