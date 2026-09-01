# Play4Win — Checklist para vender/asociarse con empresas de gaming

Documento vivo. La idea es que cada vez que armemos algo nuevo (un deck, un
demo, un doc legal), lo sumes acá y lo marques — así el día que Steam, Epic,
PlayStation, o un inversor te pidan "mandame todo lo que tengas", ya está
todo junto y no hay que armarlo de apuro.

Organizalo en una carpeta real (Drive, Notion, lo que uses) con esta misma
estructura de secciones.

## 1. Producto

- [x] Pitch deck general (armar — todavía no hecho como deck de producto,
      solo el técnico de abajo)
- [x] Deck de arquitectura de IA (`Play4Win_Plan_IA.pptx`)
- [x] Prototipo funcional navegable (login + dashboard, en React)
- [ ] Video demo corto (60-90s) mostrando el flujo completo
- [ ] Capturas de pantalla en alta resolución de cada pantalla clave
- [ ] Documento de roadmap de producto (qué sigue después del MVP)

## 2. Técnico

- [x] Repositorio de código (git, listo para GitHub)
- [x] Esquema de base de datos (`backend/schema.sql`)
- [x] Documento de arquitectura de backend y seguridad (`backend/SECURITY.md`)
- [ ] Diagrama de arquitectura general (visual, para gente no técnica)
- [ ] Documentación de API (si ya hay endpoints reales corriendo)
- [ ] Resultado de un pentest o auditoría de seguridad básica

## 3. Legal

- [ ] Constitución de la empresa / SRL (si ya está hecho, sumar acá)
- [ ] Búsqueda de antecedentes de marca para "Play4Win" (ya se hizo una
      búsqueda similar para "ConSola!" — replicar el mismo chequeo acá)
- [ ] Términos y Condiciones
- [ ] Política de Privacidad (el contenido ya está pensado en el plan de
      IA — falta el documento legal formal)
- [ ] Acuerdo de procesamiento de datos (DPA) — necesario si una empresa de
      gaming te va a pasar datos de sus usuarios
- [ ] Registro ante la URCDP (si corresponde según volumen de datos)

## 4. Métricas y tracción

- [ ] Usuarios activos (aunque sea de un piloto chico)
- [ ] Retención / frecuencia de uso
- [ ] Tasa de canje de recompensas (¿la gente realmente usa los descuentos?)
- [ ] Cualquier feedback cualitativo de testers reales

## 5. Financiero

- [ ] Modelo de unit economics (¿cuánto cuesta cada descuento otorgado vs.
      qué genera de valor/retención?)
- [ ] Proyecciones a 12-24 meses
- [ ] Cap table (si ya hay socios o inversores)

## 6. Equipo

- [ ] Bio corta tuya y de cualquier colaborador
- [ ] Por qué este equipo es el indicado para este producto

## 7. Mercado y pitch específico para gaming companies

Esto es lo más importante para una conversación con Steam/Epic/PSN
específicamente — no es solo "somos una app de descuentos", es "por qué les
conviene a ELLOS":

- [ ] Análisis de competencia (¿existe algo parecido ya?)
- [ ] Propuesta de valor específica por plataforma: ¿qué gana Steam si te
      deja integrar oficialmente en vez de que scrapees datos públicos?
      (ej: más engagement medible, canal de reactivación de usuarios
      inactivos, datos agregados de comportamiento que hoy no tienen)
- [ ] Tamaño de mercado (TAM/SAM/SOM) — cuántos gamers activos hay en la
      región, cuántos usarían algo así

---

**Estado actual (resumen rápido):** tenés fuerte la parte de producto
técnico y seguridad. Lo que más urge armar antes de golpear puertas de
empresas grandes es la parte legal (sobre todo el DPA, porque sin eso
ninguna empresa de gaming va a integrar datos de sus usuarios con vos) y la
propuesta de valor específica por plataforma de la sección 7.
