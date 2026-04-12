/**
 * Spanish SEO blog content — LATAM nurses preparing for NCLEX-RN
 * 30 topics (es-1 through es-30) + 5 full blog posts (1,200–1,500 words)
 *
 * Target markets: Mexico, Colombia, Latin America
 * Tone: neutral LATAM Spanish (no regional slang, accessible across countries)
 * Region: "us" (NCLEX destination country)
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";

export type ESSSection = { heading: string; body: string };
export type ESSFaq = { question: string; answer: string };
export type ESSRef = { text: string };
export type ESSTopic = {
  id: string; region: GlobalRegionSlug; locale: GlobalLocaleCode; profession: string; exam: string;
  title: string; metaTitle: string; metaDescription: string; slug: string; primaryKeyword: string;
  searchIntent: "transactional" | "informational" | "comparison";
};
export type ESSPost = ESSTopic & { wordCount: number; sections: ESSSection[]; faq: ESSFaq[]; references: ESSRef[] };

function L() {
  const base = "/es/us/rn/nclex-rn";
  return {
    lessons: `${base}/lessons`, questions: `${base}/questions`, cat: `${base}/cat`,
    pricing: `${base}/pricing`,
    lesson: (s: string) => `${base}/lessons/${s}`,
  };
}
const lnk = L();

// ═════════════════════════════════════════════════════════════════════════════
// 30 TOPICS  (es-1 → es-30)
// ═════════════════════════════════════════════════════════════════════════════

export const ESS_TOPICS: ESSTopic[] = [

  // ── Preparación y planes de estudio (10) ──────────────────────────────────
  { id: "es-1", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Cómo aprobar el NCLEX-RN en el primer intento: guía completa para enfermeras latinas",
    metaTitle: "Cómo aprobar NCLEX primer intento | NurseNest",
    metaDescription: "Guía paso a paso para aprobar el NCLEX-RN en el primer intento. Plan de estudio, errores comunes y estrategias probadas para enfermeras de Latinoamérica.",
    slug: "como-aprobar-nclex-rn-primer-intento-guia-enfermeras-latinas",
    primaryKeyword: "cómo aprobar NCLEX primer intento", searchIntent: "transactional" },

  { id: "es-2", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Plan de estudio NCLEX de 8 semanas: cronograma día por día para enfermeras latinas",
    metaTitle: "Plan de estudio NCLEX 8 semanas | NurseNest",
    metaDescription: "Plan de estudio estructurado de 8 semanas para el NCLEX-RN. Objetivos diarios, temas prioritarios y cantidad de preguntas de práctica por semana.",
    slug: "plan-de-estudio-nclex-8-semanas-cronograma-dia-por-dia",
    primaryKeyword: "plan de estudio NCLEX 8 semanas", searchIntent: "transactional" },

  { id: "es-3", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "NCLEX en 30 días: plan acelerado para enfermeras con poco tiempo",
    metaTitle: "NCLEX en 30 días plan acelerado | NurseNest",
    metaDescription: "¿Solo tienes 30 días antes del NCLEX? Plan de estudio acelerado con prioridades diarias, metas de preguntas y estrategias de revisión rápida.",
    slug: "nclex-en-30-dias-plan-acelerado-enfermeras-poco-tiempo",
    primaryKeyword: "NCLEX 30 días plan acelerado", searchIntent: "transactional" },

  { id: "es-4", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Plan de estudio NCLEX para enfermeras que trabajan tiempo completo",
    metaTitle: "Plan estudio NCLEX trabajando tiempo completo | NurseNest",
    metaDescription: "¿Trabajas y estudias al mismo tiempo? Horario de estudio realista para el NCLEX con bloques de 60-90 minutos diarios adaptados a enfermeras ocupadas.",
    slug: "plan-estudio-nclex-enfermeras-trabajan-tiempo-completo",
    primaryKeyword: "plan estudio NCLEX trabajando tiempo completo", searchIntent: "transactional" },

  { id: "es-5", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Cómo crear un plan de estudio NCLEX personalizado según tus debilidades",
    metaTitle: "Plan estudio NCLEX personalizado debilidades | NurseNest",
    metaDescription: "Un plan genérico no funciona para todos. Cómo identificar tus áreas débiles, priorizar temas y crear un plan de estudio NCLEX a tu medida.",
    slug: "crear-plan-estudio-nclex-personalizado-segun-debilidades",
    primaryKeyword: "plan estudio NCLEX personalizado", searchIntent: "transactional" },

  { id: "es-6", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "¿Cuántas horas al día estudiar para el NCLEX? El mínimo efectivo",
    metaTitle: "Cuántas horas estudiar NCLEX al día | NurseNest",
    metaDescription: "¿6 horas? ¿2 horas? La ciencia del aprendizaje revela cuántas horas al día son realmente efectivas para preparar el NCLEX sin agotamiento.",
    slug: "cuantas-horas-dia-estudiar-nclex-minimo-efectivo",
    primaryKeyword: "cuántas horas estudiar NCLEX al día", searchIntent: "informational" },

  { id: "es-7", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Plan de estudio NCLEX después de reprobar: cómo reestructurar tu preparación",
    metaTitle: "Plan estudio NCLEX después de reprobar | NurseNest",
    metaDescription: "Reprobaste el NCLEX y necesitas un nuevo plan. No repitas los mismos errores. Plan de recuperación estructurado basado en tu reporte de desempeño.",
    slug: "plan-estudio-nclex-despues-reprobar-reestructurar-preparacion",
    primaryKeyword: "plan estudio NCLEX después reprobar", searchIntent: "transactional" },

  { id: "es-8", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Las últimas 2 semanas antes del NCLEX: qué hacer y qué evitar",
    metaTitle: "2 semanas antes NCLEX qué hacer | NurseNest",
    metaDescription: "Los últimos 14 días antes del NCLEX son críticos. Qué intensificar, qué dejar de hacer y cómo llegar al día del examen en óptimas condiciones.",
    slug: "ultimas-2-semanas-antes-nclex-que-hacer-evitar",
    primaryKeyword: "2 semanas antes NCLEX", searchIntent: "transactional" },

  { id: "es-9", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Estudio activo vs lectura pasiva para el NCLEX: cuál funciona mejor",
    metaTitle: "Estudio activo vs lectura pasiva NCLEX | NurseNest",
    metaDescription: "Releer apuntes es el método menos efectivo. El estudio activo (preguntas de práctica, simulaciones) multiplica la retención por 3. Guía práctica para el NCLEX.",
    slug: "estudio-activo-vs-lectura-pasiva-nclex-cual-funciona-mejor",
    primaryKeyword: "estudio activo vs lectura pasiva NCLEX", searchIntent: "comparison" },

  { id: "es-10", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Cómo estudiar para el NCLEX con hijos: plan para mamás enfermeras",
    metaTitle: "Estudiar NCLEX con hijos mamás enfermeras | NurseNest",
    metaDescription: "Hijos, trabajo y NCLEX: el triple desafío. Plan de estudio realista con bloques de 20-30 minutos para mamás enfermeras que preparan el NCLEX.",
    slug: "estudiar-nclex-con-hijos-plan-mamas-enfermeras",
    primaryKeyword: "estudiar NCLEX con hijos mamás enfermeras", searchIntent: "transactional" },

  // ── Preguntas y formato del examen (10) ───────────────────────────────────
  { id: "es-11", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Preguntas de práctica NCLEX gratis en español: evalúa tu nivel ahora",
    metaTitle: "Preguntas práctica NCLEX gratis español | NurseNest",
    metaDescription: "Prueba preguntas de práctica NCLEX gratuitas con justificaciones detalladas. Evalúa tu razonamiento clínico e identifica tus áreas débiles.",
    slug: "preguntas-practica-nclex-gratis-espanol-evalua-nivel",
    primaryKeyword: "preguntas práctica NCLEX gratis español", searchIntent: "transactional" },

  { id: "es-12", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "¿Cómo funciona el NCLEX CAT? El formato adaptativo explicado en español",
    metaTitle: "NCLEX CAT formato adaptativo explicado | NurseNest",
    metaDescription: "El NCLEX usa Computer Adaptive Testing (CAT). Cómo funciona, cuántas preguntas hay, cuándo se detiene — todo explicado claramente en español.",
    slug: "como-funciona-nclex-cat-formato-adaptativo-explicado-espanol",
    primaryKeyword: "NCLEX CAT formato adaptativo español", searchIntent: "informational" },

  { id: "es-13", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Tipos de preguntas del NCLEX: SATA, drag-and-drop, hot spot y más",
    metaTitle: "Tipos preguntas NCLEX SATA drag drop | NurseNest",
    metaDescription: "Los diferentes tipos de preguntas del NCLEX — selección múltiple, SATA, ordenamiento, hot spot — y la estrategia sistemática para cada tipo.",
    slug: "tipos-preguntas-nclex-sata-drag-drop-hot-spot",
    primaryKeyword: "tipos preguntas NCLEX SATA", searchIntent: "informational" },

  { id: "es-14", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Next Generation NCLEX (NGN): los nuevos tipos de preguntas que debes conocer",
    metaTitle: "Next Generation NCLEX NGN preguntas nuevas | NurseNest",
    metaDescription: "El NGN introdujo preguntas de caso, bowtie y matriz que no existen en los exámenes de enfermería de Latinoamérica. Explicación y estrategia para cada tipo.",
    slug: "next-generation-nclex-ngn-nuevos-tipos-preguntas-conocer",
    primaryKeyword: "Next Generation NCLEX NGN preguntas", searchIntent: "informational" },

  { id: "es-15", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "¿El NCLEX se detuvo en 85 preguntas? ¿Es buena o mala señal?",
    metaTitle: "NCLEX 85 preguntas buena mala señal | NurseNest",
    metaDescription: "Tu examen se detuvo en 85 preguntas y estás en pánico. Entiende por qué el CAT se detiene pronto, qué significa y por qué no siempre es malo.",
    slug: "nclex-detuvo-85-preguntas-buena-mala-senal",
    primaryKeyword: "NCLEX 85 preguntas buena mala señal", searchIntent: "informational" },

  { id: "es-16", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Juicio clínico en el NCLEX: la habilidad que tu programa no enseñó suficiente",
    metaTitle: "Juicio clínico NCLEX guía español | NurseNest",
    metaDescription: "El juicio clínico es la base del NCLEX-RN. Qué es, cómo difiere de la memorización y cómo desarrollarlo — guía en español para enfermeras latinas.",
    slug: "juicio-clinico-nclex-habilidad-programa-no-enseno-suficiente",
    primaryKeyword: "juicio clínico NCLEX español", searchIntent: "informational" },

  { id: "es-17", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Exámenes de práctica adaptativos: por qué son indispensables antes del NCLEX",
    metaTitle: "Exámenes práctica adaptativos NCLEX | NurseNest",
    metaDescription: "Los exámenes de práctica adaptativos simulan el verdadero NCLEX. Por qué son más efectivos que los tests fijos y cómo usarlos estratégicamente.",
    slug: "examenes-practica-adaptativos-indispensables-antes-nclex",
    primaryKeyword: "exámenes práctica adaptativos NCLEX", searchIntent: "transactional" },

  { id: "es-18", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "¿Cuántas preguntas de práctica hacer antes del NCLEX? El número óptimo",
    metaTitle: "Cuántas preguntas práctica NCLEX óptimo | NurseNest",
    metaDescription: "¿1,000? ¿2,000? Cuántas preguntas de práctica necesitas completar antes del NCLEX según los datos de rendimiento y la investigación.",
    slug: "cuantas-preguntas-practica-hacer-antes-nclex-numero-optimo",
    primaryKeyword: "cuántas preguntas práctica NCLEX", searchIntent: "informational" },

  { id: "es-19", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "El truco de las dos respuestas correctas en el NCLEX: cómo elegir la mejor",
    metaTitle: "Dos respuestas correctas NCLEX elegir mejor | NurseNest",
    metaDescription: "Cuando dos opciones parecen correctas en el NCLEX, ¿cómo elegir? Técnica sistemática para identificar la MEJOR respuesta entre opciones plausibles.",
    slug: "truco-dos-respuestas-correctas-nclex-como-elegir-mejor",
    primaryKeyword: "dos respuestas correctas NCLEX elegir", searchIntent: "informational" },

  { id: "es-20", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Cómo interpretar tus resultados de práctica NCLEX: ¿estás lista para el examen?",
    metaTitle: "Interpretar resultados práctica NCLEX | NurseNest",
    metaDescription: "Tus puntajes están en 60% — ¿es suficiente? Cómo interpretar tus resultados de preguntas de práctica e identificar si estás lista para el NCLEX.",
    slug: "interpretar-resultados-practica-nclex-lista-para-examen",
    primaryKeyword: "interpretar resultados práctica NCLEX", searchIntent: "informational" },

  // ── Errores, dificultades y temas clínicos (10) ──────────────────────────
  { id: "es-21", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Las 7 errores más comunes al preparar el NCLEX (y cómo corregirlos)",
    metaTitle: "7 errores comunes preparar NCLEX | NurseNest",
    metaDescription: "Estudiar demasiada teoría, descuidar las preguntas de práctica, ignorar las justificaciones — los 7 errores más comunes y cómo corregirlos inmediatamente.",
    slug: "7-errores-comunes-preparar-nclex-como-corregirlos",
    primaryKeyword: "errores comunes preparar NCLEX", searchIntent: "informational" },

  { id: "es-22", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "¿Por qué el NCLEX es tan difícil? Lo que lo hace diferente de los exámenes latinos",
    metaTitle: "Por qué NCLEX tan difícil diferente exámenes | NurseNest",
    metaDescription: "El NCLEX es más difícil que cualquier examen de enfermería en Latinoamérica. Entiende por qué — formato CAT, juicio clínico, preguntas ambiguas.",
    slug: "por-que-nclex-tan-dificil-diferente-examenes-latinos",
    primaryKeyword: "por qué NCLEX tan difícil", searchIntent: "informational" },

  { id: "es-23", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "NCLEX Farmacología: medicamentos de alto riesgo que toda enfermera debe conocer",
    metaTitle: "NCLEX Farmacología medicamentos alto riesgo | NurseNest",
    metaDescription: "Insulina, heparina, warfarina, digoxina — los medicamentos de alto riesgo más evaluados en el NCLEX. Reglas de administración, efectos adversos e intervenciones.",
    slug: "nclex-farmacologia-medicamentos-alto-riesgo-enfermera-conocer",
    primaryKeyword: "NCLEX farmacología medicamentos alto riesgo", searchIntent: "informational" },

  { id: "es-24", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "NCLEX Líquidos y electrolitos: el tema más temido simplificado",
    metaTitle: "NCLEX líquidos electrolitos simplificado | NurseNest",
    metaDescription: "Hiperkalemia, hiponatremia, soluciones IV — líquidos y electrolitos es el tema más desafiante del NCLEX. Guía simplificada en español.",
    slug: "nclex-liquidos-electrolitos-tema-temido-simplificado",
    primaryKeyword: "NCLEX líquidos electrolitos español", searchIntent: "informational" },

  { id: "es-25", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Delegación en el NCLEX: el modelo estadounidense que no enseñan en Latinoamérica",
    metaTitle: "Delegación NCLEX modelo estadounidense | NurseNest",
    metaDescription: "Las preguntas de delegación del NCLEX usan el modelo de práctica de EE.UU., completamente diferente al de Latinoamérica. Los Five Rights y las trampas comunes.",
    slug: "delegacion-nclex-modelo-estadounidense-no-ensenan-latinoamerica",
    primaryKeyword: "delegación NCLEX modelo estadounidense", searchIntent: "informational" },

  { id: "es-26", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Reprobé el NCLEX: qué hacer ahora y cómo aprobar la próxima vez",
    metaTitle: "Reprobé NCLEX qué hacer aprobar próxima vez | NurseNest",
    metaDescription: "Reprobar el NCLEX no es el fin del mundo. Analiza tu desempeño, cambia tu enfoque y aprueba la próxima vez — guía completa de recuperación.",
    slug: "reprobe-nclex-que-hacer-ahora-aprobar-proxima-vez",
    primaryKeyword: "reprobé NCLEX qué hacer aprobar", searchIntent: "transactional" },

  { id: "es-27", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Cómo aplicar al NCLEX-RN desde México: proceso paso a paso",
    metaTitle: "Aplicar NCLEX desde México paso a paso | NurseNest",
    metaDescription: "Guía completa para aplicar al NCLEX-RN desde México. CGFNS, requisitos del state board, registro en Pearson VUE, y cronograma estimado.",
    slug: "como-aplicar-nclex-rn-desde-mexico-proceso-paso-a-paso",
    primaryKeyword: "aplicar NCLEX desde México", searchIntent: "informational" },

  { id: "es-28", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Cómo aplicar al NCLEX-RN desde Colombia: guía para enfermeras colombianas",
    metaTitle: "Aplicar NCLEX desde Colombia guía | NurseNest",
    metaDescription: "Proceso completo para enfermeras colombianas que quieren presentar el NCLEX-RN. Evaluación de credenciales, exámenes de inglés y pasos de inmigración.",
    slug: "como-aplicar-nclex-rn-desde-colombia-guia-enfermeras",
    primaryKeyword: "aplicar NCLEX desde Colombia", searchIntent: "informational" },

  { id: "es-29", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "Ansiedad antes del NCLEX: cómo manejar los nervios el día del examen",
    metaTitle: "Ansiedad NCLEX manejar nervios día examen | NurseNest",
    metaDescription: "La ansiedad antes del NCLEX es normal. Técnicas de manejo del estrés antes y durante el examen para enfermeras latinas.",
    slug: "ansiedad-antes-nclex-manejar-nervios-dia-examen",
    primaryKeyword: "ansiedad NCLEX manejar nervios", searchIntent: "informational" },

  { id: "es-30", region: "us", locale: "es", profession: "rn", exam: "nclex-rn",
    title: "¿Vale la pena el NCLEX para enfermeras latinas? Salario y oportunidades en EE.UU.",
    metaTitle: "Vale la pena NCLEX enfermeras latinas salario | NurseNest",
    metaDescription: "¿Conviene preparar el NCLEX? Expectativas salariales, oportunidades de carrera y caminos migratorios para enfermeras latinoamericanas en Estados Unidos.",
    slug: "vale-la-pena-nclex-enfermeras-latinas-salario-oportunidades",
    primaryKeyword: "vale la pena NCLEX enfermeras latinas salario", searchIntent: "informational" },
];

// ═════════════════════════════════════════════════════════════════════════════
// 5 FULL BLOG POSTS  (1,200 – 1,500 words each)
// ═════════════════════════════════════════════════════════════════════════════

export const ESS_POSTS: ESSPost[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Cómo aprobar el NCLEX-RN en el primer intento (~1,380 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...ESS_TOPICS[0],
    wordCount: 1380,
    sections: [
      { heading: "Introducción",
        body: `Si eres enfermera en México, Colombia, Perú o cualquier país de Latinoamérica y quieres trabajar en Estados Unidos, el NCLEX-RN es tu puerta de entrada. Pero seamos honestos: este examen tiene fama de difícil — y la fama es merecida.

El NCLEX no es un examen de conocimiento como los que presentaste en tu universidad. Es un examen de RAZONAMIENTO CLÍNICO que utiliza un formato adaptativo por computadora (CAT) que ajusta la dificultad según tus respuestas. Y eso cambia completamente la forma en que debes prepararte.

La buena noticia: miles de enfermeras internacionales lo aprueban cada año, incluyendo muchas de Latinoamérica. La clave no es estudiar más — es estudiar de forma DIFERENTE.

Esta guía te dará el plan exacto para aprobar en tu primer intento.

[Empieza hoy](${lnk.questions}) — evalúa tu nivel actual con preguntas de práctica gratuitas.` },

      { heading: "Por qué el NCLEX es diferente de los exámenes de enfermería en Latinoamérica",
        body: `En tu universidad, los exámenes probablemente te pedían: "¿Cuáles son los signos de la hiperkalemia?" Podías responder con lo que memorizaste.

El NCLEX te pregunta: "Un paciente tiene potasio de 6.2 mEq/L con cambios en el ECG. ¿Cuál es tu PRIMERA acción?" Aquí la memorización no alcanza — necesitas RAZONAR.

**Diferencias clave:**
- **Formato adaptativo (CAT):** la dificultad cambia según tu rendimiento. Si respondes bien, las preguntas se ponen más difíciles. Si respondes mal, se facilitan un poco. El examen puede tener entre 85 y 150 preguntas.
- **No puedes regresar:** una vez que avanzas a la siguiente pregunta, no hay vuelta atrás.
- **[Juicio clínico](${lnk.lesson("clinical-judgment-prioritization-gold")}):** el NCLEX evalúa tu capacidad de priorizar, delegar y tomar decisiones — no solo tu conocimiento.
- **Modelo de práctica de EE.UU.:** la delegación, el alcance de práctica y los protocolos son DIFERENTES a los de Latinoamérica. Esto es un área donde muchas enfermeras latinas fallan.

Reconocer estas diferencias es el primer paso. El segundo es adaptar tu método de estudio.` },

      { heading: "Los 5 errores que las enfermeras latinas cometen al preparar el NCLEX",
        body: `**Error 1: Estudiar como en la universidad**
Releer apuntes y hacer resúmenes NO funciona para el NCLEX. La investigación muestra que la práctica activa (hacer preguntas y revisar justificaciones) es 2-3 veces más efectiva que la lectura pasiva (Karpicke & Blunt, 2011).

**Error 2: Ignorar la delegación y el alcance de práctica de EE.UU.**
En Latinoamérica, el modelo de delegación es diferente. El NCLEX te preguntará QUÉ puedes delegar, A QUIÉN y CUÁNDO. Si no estudias el modelo estadounidense específicamente, perderás puntos fáciles.

**Error 3: No hacer suficientes preguntas de práctica**
Muchas enfermeras latinas pasan el 80% de su tiempo leyendo y solo el 20% practicando. Deberías invertir esa proporción: 70% [preguntas de práctica](${lnk.questions}) con justificaciones, 30% revisión de contenido.

**Error 4: No practicar con exámenes adaptativos**
Hacer preguntas de formato fijo no te prepara para el CAT. Necesitas [exámenes de simulación adaptativos](${lnk.cat}) que repliquen la experiencia real.

**Error 5: Subestimar el inglés médico**
El NCLEX es en inglés. Aunque tu inglés conversacional sea bueno, el inglés médico tiene terminología específica que debes dominar. Hacer [preguntas de práctica](${lnk.questions}) en inglés diariamente mejora tu vocabulario médico automáticamente.

[Practica gratis](${lnk.questions}) — comienza a corregir estos errores hoy con preguntas de práctica gratuitas.` },

      { heading: "Plan de estudio de 8 semanas para enfermeras latinas",
        body: `**Semanas 1-2: Fundaciones (60-90 min/día)**
- 30 min: [Lección estructurada](${lnk.lessons}) sobre 1 tema
- 30-45 min: 20 [preguntas de práctica](${lnk.questions}) + revisión de justificaciones
- Temas: [juicio clínico](${lnk.lesson("clinical-judgment-prioritization-gold")}), delegación modelo EE.UU., seguridad del paciente
- Inicia un diario de errores: para cada pregunta incorrecta, anota POR QUÉ te equivocaste

**Semanas 3-4: Expansión (75-100 min/día)**
- 15 min: revisión del diario de errores del día anterior
- 60-75 min: 30-40 [preguntas mixtas](${lnk.questions}) + justificaciones
- Temas: [farmacología de alto riesgo](${lnk.lesson("high-alert-medications-gold")}), [líquidos y electrolitos](${lnk.lesson("fluids-electrolytes-emergencies-gold")}), cardíaco, respiratorio, diabetes
- 1 [examen adaptativo](${lnk.cat}) al final de la semana 4

**Semanas 5-6: Integración (90-120 min/día)**
- 75-90 min: 40-50 preguntas aleatorias cronometradas (90 segundos por pregunta)
- 15-30 min: revisión de áreas débiles del diario de errores
- 1 [examen adaptativo](${lnk.cat}) por semana
- Temas adicionales: salud mental, materno-infantil, ética, [sepsis](${lnk.lesson("sepsis-early-recognition-gold")})

**Semanas 7-8: Preparación final (90-120 min/día)**
- 90 min: 50-75 preguntas aleatorias cronometradas
- 30 min: SOLO temas del diario de errores
- 2 [exámenes adaptativos](${lnk.cat}) por semana
- Criterio para reservar el examen: 3 simulaciones consecutivas con resultado "APROBADO"

**Últimos 3 días:** reduce a 20-30 preguntas, duerme bien, prepara la logística del centro Pearson VUE.` },

      { heading: "La importancia de las preguntas de práctica: tu herramienta principal",
        body: `No exagero cuando digo que las preguntas de práctica son el 70% de tu preparación. No son un complemento — son el CENTRO de tu estudio.

**Por qué las preguntas funcionan mejor que leer:**
- **Recuperación activa:** buscar la respuesta en tu memoria fortalece el recuerdo mucho más que reconocer la información en un texto
- **Retroalimentación inmediata:** las justificaciones te dicen exactamente dónde está tu error
- **Simulación del examen:** cada pregunta replica la experiencia del NCLEX real
- **Desarrollo del juicio clínico:** el razonamiento se desarrolla PRACTICANDO, no leyendo

**Cómo usar las preguntas de práctica efectivamente:**
1. Haz [preguntas de práctica](${lnk.questions}) diariamente — mínimo 30
2. Lee CADA justificación completa — incluso cuando aciertas
3. Entiende por qué cada opción incorrecta es incorrecta — no solo la correcta
4. Actualiza tu diario de errores
5. Haz [exámenes adaptativos](${lnk.cat}) semanales para medir tu progreso objetivamente

**¿Cuántas preguntas en total?** Apunta a 1,500-2,000 preguntas antes del examen. Eso suena como mucho, pero a 40 preguntas por día durante 8 semanas = 2,240 preguntas.

[Practica gratis](${lnk.questions}) — tu primera sesión de 20 preguntas te mostrará exactamente dónde estás y qué necesitas mejorar.` },

      { heading: "Recursos para enfermeras latinas: preparación accesible",
        body: `Una preocupación legítima para muchas enfermeras en Latinoamérica es el costo. Los cursos de preparación pueden costar $300-$500 USD, y UWorld cobra $200+ USD.

**Recursos gratuitos:**
- [Preguntas de práctica gratuitas de NurseNest](${lnk.questions}) — con justificaciones
- YouTube: RegisteredNurseRN, Simple Nursing (excelentes videos gratuitos en inglés)
- Examen de práctica oficial del NCSBN (gratuito)

**Recursos accesibles:**
- [NurseNest acceso completo](${lnk.pricing}) — [lecciones estructuradas](${lnk.lessons}), [preguntas con justificaciones](${lnk.questions}) y [exámenes adaptativos](${lnk.cat}) a precio accesible
- Grupos de estudio en WhatsApp/Telegram con otras enfermeras latinas

**Lo que NO necesitas gastar:**
- Cursos presenciales costosos (la evidencia muestra que el autoestudio con preguntas de práctica es igualmente efectivo)
- Múltiples bancos de preguntas (uno bueno es suficiente)
- Libros de texto caros (usados en Amazon o versiones digitales)

[Empieza hoy](${lnk.pricing}) — el acceso a preparación de calidad no tiene que ser costoso.` },

      { heading: "Tu primer paso: empieza hoy, no mañana",
        body: `El mayor obstáculo no es el NCLEX — es la procrastinación. Cada día que pospones tu preparación es un día menos de práctica y un día más de ansiedad.

**Haz esto AHORA (toma 15 minutos):**
1. Haz 20 [preguntas de práctica gratuitas](${lnk.questions}) — sin preparación, solo tu conocimiento actual
2. Anota tu puntaje — ese es tu punto de partida
3. Identifica tus 3 temas más débiles
4. Empieza mañana con la semana 1 del plan de 8 semanas

No necesitas tener todo perfecto para empezar. No necesitas el mejor curso, el mejor libro ni la mejor app. Necesitas COMENZAR y ser CONSTANTE.

30-50 preguntas al día, todos los días, durante 8 semanas. Esa es la fórmula. Simple, no fácil — pero absolutamente alcanzable.

[Empieza hoy](${lnk.questions}) — tu carrera en Estados Unidos comienza con esta primera pregunta de práctica. [Accede a lecciones](${lnk.lessons}), [exámenes adaptativos](${lnk.cat}) y preparación completa en [NurseNest](${lnk.pricing}). [Practica gratis](${lnk.questions}).` },
    ],
    faq: [
      { question: "¿Puedo presentar el NCLEX en español?", answer: "No. El NCLEX se presenta únicamente en inglés. Sin embargo, tu inglés médico mejora significativamente al hacer preguntas de práctica diariamente en inglés. No necesitas un nivel de inglés perfecto — necesitas dominar la terminología clínica." },
      { question: "¿Cuánto tiempo toma todo el proceso desde Latinoamérica?", answer: "El proceso completo (evaluación de credenciales CGFNS + preparación + examen + visa) puede tomar 12-24 meses. La preparación para el NCLEX en sí toma 2-6 meses dependiendo de tu base." },
      { question: "¿Necesito una maestría para presentar el NCLEX?", answer: "No. El NCLEX-RN requiere un título de licenciatura en enfermería (BSN equivalente). Si tu programa en Latinoamérica es de licenciatura (4-5 años), generalmente califica. La evaluación de CGFNS determinará si tus credenciales son equivalentes." },
    ],
    references: [
      { text: "Karpicke, J. D., & Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying with concept mapping. *Science*, 331(6018), 772–775. https://doi.org/10.1126/science.1199327" },
      { text: "National Council of State Boards of Nursing. (2023). *NCLEX-RN examination: Test plan for the National Council Licensure Examination for Registered Nurses*. NCSBN. https://www.ncsbn.org/nclex" },
      { text: "Commission on Graduates of Foreign Nursing Schools. (2024). *Credentials evaluation for internationally educated nurses*. CGFNS International. https://www.cgfns.org/" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. ¿Por qué el NCLEX es tan difícil? (~1,320 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...ESS_TOPICS[21],
    wordCount: 1320,
    sections: [
      { heading: "Introducción",
        body: `"Es mucho más difícil que cualquier examen que presenté en la universidad." Eso dicen prácticamente todas las enfermeras latinoamericanas que se han enfrentado al NCLEX.

Y no están exagerando. El NCLEX ES más difícil que los exámenes de enfermería en México, Colombia, Perú, Argentina o cualquier otro país de la región. Pero entender POR QUÉ es difícil cambia completamente tu estrategia de preparación.

Demasiadas enfermeras tratan el NCLEX como un examen universitario más largo. Estudian igual, y reprueban. Esta guía te explica precisamente qué hace diferente al NCLEX y cómo adaptar tu preparación.

[Practica gratis](${lnk.questions}) — prueba 20 preguntas estilo NCLEX y siente la diferencia.` },

      { heading: "El formato CAT: un algoritmo que te lleva al límite",
        body: `La primera razón por la que el NCLEX se siente tan difícil es su formato adaptativo — Computer Adaptive Testing (CAT).

**Cómo funciona:**
El algoritmo ajusta la dificultad de cada pregunta según tu rendimiento. Si respondes correctamente, la siguiente pregunta será más difícil. Si respondes incorrectamente, será un poco más fácil. El objetivo es determinar si tu competencia está por encima o por debajo del umbral de aprobación.

**Por qué esto te desestabiliza:**
- No puedes regresar para corregir una respuesta
- Las preguntas se vuelven más complejas si estás respondiendo bien
- Sientes que "todo está mal" cuando en realidad el algoritmo está subiendo la dificultad — lo cual frecuentemente es SEÑAL DE QUE VAS BIEN
- El examen puede terminar entre 85 y 150 preguntas — nunca sabes cuándo

**La mejor preparación:** [exámenes de simulación adaptativos](${lnk.cat}) que reproduzcan exactamente este mecanismo. Las preguntas de formato fijo NO te preparan para el estrés del CAT.

En Latinoamérica, todos reciben el mismo examen con las mismas preguntas. En el NCLEX, cada candidata recibe un examen DIFERENTE adaptado a su nivel. Es una experiencia completamente nueva.` },

      { heading: "Juicio clínico vs memorización: el cambio de paradigma",
        body: `Tus exámenes universitarios en Latinoamérica probablemente evaluaban tu CONOCIMIENTO: "¿Cuáles son los signos de la hiperkalemia?" El NCLEX evalúa tu JUICIO: "Este paciente presenta estos síntomas — ¿cuál es tu PRIMERA acción?"

Esta diferencia es fundamental:

| Exámenes en Latinoamérica | NCLEX |
|---|---|
| ¿Qué SABES? | ¿Qué HARÍAS? |
| Memorización recompensada | Razonamiento exigido |
| Una respuesta claramente correcta | Varias opciones plausibles |
| Contenido de un solo curso | Todo el programa integrado |

El [juicio clínico](${lnk.lesson("clinical-judgment-prioritization-gold")}) no se memoriza — se DESARROLLA con práctica repetida. Cada [pregunta de práctica](${lnk.questions}) que haces construye tus circuitos de razonamiento.

Por eso las candidatas que hacen 1,000+ preguntas de práctica aprueban más que las que releen sus apuntes 10 veces. La práctica desarrolla el juicio; la lectura da una ilusión de dominio.

**Las áreas de juicio clínico más evaluadas:**
- Priorización (ABC, Maslow, urgente vs no urgente)
- Delegación (modelo de práctica de EE.UU. — diferente al de LATAM)
- Seguridad del paciente (prevención de caídas, errores de medicación)
- Comunicación terapéutica (salud mental)

[Accede a lecciones](${lnk.lessons}) sobre juicio clínico diseñadas para enfermeras que vienen de un sistema educativo diferente.` },

      { heading: "El modelo de práctica de EE.UU.: lo que no te enseñaron",
        body: `Esta es quizás la brecha más grande para las enfermeras latinas. El NCLEX evalúa tu conocimiento del modelo de práctica ESTADOUNIDENSE, que incluye:

**Delegación:**
En muchos países de Latinoamérica, las enfermeras hacen todo. En EE.UU., hay roles claros: RN (Registered Nurse), LPN/LVN (Licensed Practical/Vocational Nurse), UAP/CNA (Unlicensed Assistive Personnel). El NCLEX te preguntará QUÉ puedes delegar a QUIÉN.

Los Five Rights of Delegation:
1. Right task (tarea apropiada)
2. Right circumstance (circunstancia apropiada)
3. Right person (persona apropiada)
4. Right direction/communication (instrucciones claras)
5. Right supervision (supervisión adecuada)

**Alcance de práctica:**
Lo que una enfermera puede hacer varía por estado y por nivel de licencia. El NCLEX evalúa tu entendimiento de estos límites — algo que no existe de la misma manera en Latinoamérica.

**Confidencialidad (HIPAA):**
Las leyes de privacidad del paciente en EE.UU. son mucho más estrictas. Preguntas sobre HIPAA, consentimiento informado y documentación son frecuentes.

Estudia estos temas ESPECÍFICAMENTE — no asumas que tu experiencia clínica en Latinoamérica cubre esto. Las [lecciones estructuradas](${lnk.lessons}) de NurseNest abordan estas diferencias directamente.` },

      { heading: "La fatiga cognitiva: el enemigo invisible",
        body: `Después de 60-80 preguntas de razonamiento clínico intenso, tu cerebro empieza a funcionar más lento. Tus últimas preguntas reciben MENOS reflexión que las primeras — y frecuentemente ahí es donde se decide la aprobación.

**Cómo construir resistencia mental:**
- Aumenta progresivamente la duración de tus sesiones de práctica (20 preguntas → 40 → 60 → 85)
- Practica en condiciones reales: sin teléfono, sin pausas, con tiempo cronometrado
- Haz al menos 2-3 [exámenes de simulación completos](${lnk.cat}) antes del examen real
- El día del examen, usa tus pausas opcionales estratégicamente

La resistencia cognitiva, como la física, se desarrolla con entrenamiento progresivo. No la descuides en tu preparación.

Los exámenes en Latinoamérica raramente duran más de 2 horas con preguntas de alto nivel cognitivo. El NCLEX puede durar hasta 5 horas. Esa diferencia en resistencia mental es un factor que muchas candidatas subestiman.` },

      { heading: "El NCLEX es difícil — pero no es imposible",
        body: `Miles de enfermeras internacionales, incluyendo cientos de Latinoamérica, aprueban el NCLEX cada año. Lo que marca la diferencia:

1. **Preguntas de práctica diarias** — mínimo 30-50 por día con [justificaciones completas](${lnk.questions})
2. **Simulaciones CAT** — al menos semanales con [exámenes adaptativos](${lnk.cat})
3. **Análisis de errores** — entender POR QUÉ te equivocaste, no solo constatar el error
4. **Estudio del modelo de EE.UU.** — delegación, alcance de práctica, HIPAA
5. **Resistencia cognitiva** — construir progresivamente tu capacidad de razonar durante 85+ preguntas
6. **Estudio activo** — practicar, no releer

El hecho de que estés leyendo este artículo significa que tomas tu preparación en serio. Eso ya es una ventaja.

[Empieza hoy](${lnk.questions}) — haz 20 preguntas de práctica gratuitas. [Accede a lecciones](${lnk.lessons}), [exámenes adaptativos](${lnk.cat}) y preparación completa. El NCLEX es difícil — pero con el método correcto, está totalmente a tu alcance. [Practica gratis](${lnk.pricing}).` },
    ],
    faq: [
      { question: "¿Es el NCLEX el examen de enfermería más difícil del mundo?", answer: "Es considerado uno de los más difíciles por su formato adaptativo y énfasis en juicio clínico. Sin embargo, la dificultad percibida varía según tu preparación. Con el método correcto (preguntas de práctica + simulaciones adaptativas), es completamente aprobable." },
      { question: "¿Las enfermeras de Latinoamérica reprueban más que las de otros países?", answer: "Las tasas de aprobación varían, pero las enfermeras formadas internacionalmente en general tienen tasas más bajas que las formadas en EE.UU. Esto se debe principalmente a diferencias en el modelo de práctica, no a falta de conocimiento clínico. Estudiando las diferencias específicas, puedes cerrar esa brecha." },
      { question: "¿Puedo estudiar en español y luego tomar el examen en inglés?", answer: "Puedes revisar conceptos en español para entenderlos mejor, pero DEBES practicar preguntas en inglés. El NCLEX usa terminología médica en inglés y la práctica regular en inglés es la forma más efectiva de prepararte para el idioma del examen." },
    ],
    references: [
      { text: "National Council of State Boards of Nursing. (2023). *NCLEX-RN examination: Test plan*. NCSBN. https://www.ncsbn.org/nclex" },
      { text: "Karpicke, J. D., & Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying. *Science*, 331(6018), 772–775." },
      { text: "Baumeister, R. F., & Vohs, K. D. (2016). Strength model of self-regulation as limited resource. *Advances in Experimental Social Psychology*, 54, 67–127." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Aplicar al NCLEX desde México (~1,350 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...ESS_TOPICS[26],
    wordCount: 1350,
    sections: [
      { heading: "Introducción",
        body: `Eres enfermera en México y quieres trabajar en Estados Unidos. El NCLEX-RN es el examen que necesitas aprobar — pero antes del examen hay un PROCESO que debes seguir, y es más complejo de lo que parece.

Muchas enfermeras mexicanas comienzan a estudiar para el NCLEX sin siquiera saber si son elegibles, o sin haber iniciado la evaluación de credenciales. Esto puede resultar en meses de estudio desperdiciados.

Esta guía te lleva paso a paso — desde verificar tu elegibilidad hasta sentarte en el centro Pearson VUE — para que no pierdas tiempo ni dinero.

[Empieza hoy](${lnk.questions}) — mientras inicias el trámite, empieza a prepararte con preguntas de práctica gratuitas.` },

      { heading: "Paso 1: Verifica tu elegibilidad",
        body: `**¿Quién es elegible?**
Para presentar el NCLEX-RN, necesitas un título de enfermería equivalente a un BSN (Bachelor of Science in Nursing) en EE.UU. En México, esto generalmente es la Licenciatura en Enfermería (4-5 años).

**¿Los técnicos en enfermería son elegibles?**
La enfermería técnica (2-3 años) generalmente NO cumple los requisitos. Algunos estados tienen excepciones, pero la mayoría requiere la licenciatura. Si tienes título técnico, consulta si tu programa cumple los estándares del state board.

**¿Dónde verificar?**
Cada state board tiene sus propios requisitos. Algunos estados más accesibles para enfermeras mexicanas:
- **New York** — históricamente amigable con enfermeras internacionales
- **Texas** — gran comunidad mexicana, demanda de enfermeras bilingües
- **California** — mayores requisitos pero más oportunidades
- **Illinois** — proceso relativamente directo

**Paso de acción:** visita el sitio web del state board del estado donde quieres practicar y revisa los requisitos para "internationally educated nurses" (IEN).` },

      { heading: "Paso 2: Evaluación de credenciales (CGFNS)",
        body: `La mayoría de los state boards requieren una evaluación de credenciales por CGFNS (Commission on Graduates of Foreign Nursing Schools).

**Opciones de evaluación:**
- **CGFNS Certification Program** — incluye evaluación de credenciales + examen de enfermería + examen de inglés
- **VisaScreen** — requerido para la visa de trabajo
- **Credentials Evaluation Service (CES)** — solo evaluación de credenciales (algunos states la aceptan)

**Documentos que necesitas preparar:**
1. Título de enfermería (original y traducción oficial)
2. Cédula profesional
3. Transcriptos académicos (enviados directamente por tu universidad a CGFNS)
4. Verificación de licencia por el organismo regulador mexicano
5. Fotografía tipo pasaporte

**Costo aproximado:** $300-$600 USD dependiendo del programa
**Tiempo estimado:** 3-6 meses (puede variar)

**Consejo importante:** inicia este proceso ANTES de comenzar a estudiar intensivamente para el NCLEX. La evaluación tarda meses — usa ese tiempo para prepararte.

Mientras esperas la evaluación, [practica preguntas diariamente](${lnk.questions}). Cuando llegue tu Authorization to Test (ATT), ya estarás preparada.` },

      { heading: "Paso 3: Registro en el State Board y Pearson VUE",
        body: `Una vez que tu evaluación de credenciales sea aprobada:

**3a. Aplica al State Board of Nursing**
- Completa la solicitud del state board de tu estado elegido
- Paga la tarifa de aplicación ($100-$300 USD según el estado)
- Envía tu documentación (evaluación CGFNS aprobada + documentos adicionales)

**3b. Registro en Pearson VUE**
- Una vez que el state board apruebe tu solicitud, te enviarán instrucciones para registrarte en Pearson VUE
- Crea tu cuenta en pearsonvue.com
- Paga la tarifa del examen NCLEX: $200 USD

**3c. Recibe tu ATT (Authorization to Test)**
- El ATT es válido por un período limitado (generalmente 90 días)
- Una vez que lo recibas, reserva tu fecha de examen INMEDIATAMENTE
- No dejes pasar el ATT — renovarlo cuesta tiempo y dinero

**Centros Pearson VUE en México:**
Hay centros en Ciudad de México, Guadalajara, Monterrey y otras ciudades. También puedes presentar el examen en EE.UU. si estás de visita.

**Consejo:** reserva tu examen para 4-8 semanas después de recibir el ATT. Esto te da un deadline concreto para tu preparación.` },

      { heading: "Paso 4: Preparación para el NCLEX (mientras esperas el trámite)",
        body: `El proceso administrativo tarda 6-12 meses. NO esperes a tener tu ATT para empezar a estudiar. Usa ese tiempo para prepararte.

**Meses 1-3 (durante trámite de CGFNS):**
- Haz 20 [preguntas de práctica](${lnk.questions}) diarias para ir conociendo el formato
- Estudia las [lecciones sobre juicio clínico](${lnk.lesson("clinical-judgment-prioritization-gold")}) y delegación — las áreas más diferentes
- Mejora tu inglés médico leyendo material clínico en inglés
- Familiarízate con el modelo de práctica de EE.UU.

**Meses 4-6 (esperando ATT):**
- Intensifica a 30-40 preguntas diarias
- Comienza con [exámenes adaptativos](${lnk.cat}) semanales
- Cubre todos los sistemas corporales: cardíaco, respiratorio, renal, neuro, [farmacología](${lnk.lesson("high-alert-medications-gold")})
- Estudia [líquidos y electrolitos](${lnk.lesson("fluids-electrolytes-emergencies-gold")}) a profundidad

**Una vez que tienes el ATT (4-8 semanas finales):**
- 50-75 preguntas diarias cronometradas
- 2 [exámenes adaptativos](${lnk.cat}) por semana
- Solo áreas débiles del diario de errores
- Criterio de reserva: 3 simulaciones consecutivas con "APROBADO"

[Empieza hoy](${lnk.questions}) — no esperes a tener el ATT. Cada día de práctica cuenta.` },

      { heading: "Costo total del proceso desde México",
        body: `Una de las preguntas más frecuentes: ¿cuánto cuesta todo el proceso?

**Desglose aproximado:**
| Concepto | Costo (USD) |
|---|---|
| Evaluación CGFNS/CES | $300-$600 |
| Aplicación al State Board | $100-$300 |
| Examen NCLEX (Pearson VUE) | $200 |
| Material de estudio | $50-$200 (con opciones accesibles) |
| VisaScreen (para visa de trabajo) | $540 |
| Traducción de documentos | $100-$300 |
| Examen de inglés (IELTS/TOEFL/OET) | $200-$300 |
| **Total aproximado** | **$1,490-$2,440 USD** |

**Perspectiva financiera:**
El salario promedio de una enfermera registrada en EE.UU. es $75,000-$95,000 USD al año. Tu inversión total se recupera en las PRIMERAS SEMANAS de trabajo.

**Cómo reducir costos:**
- Usa [NurseNest](${lnk.pricing}) como tu plataforma principal de estudio — accesible y completa
- Aprovecha recursos gratuitos: YouTube, [preguntas gratis de NurseNest](${lnk.questions}), examen de práctica NCSBN
- Aplica al estado con la tarifa más baja si no tienes preferencia geográfica

La inversión es significativa para un salario mexicano, pero el retorno es extraordinario.

[Practica gratis](${lnk.questions}) — comienza tu preparación sin costo. [Accede al plan completo](${lnk.pricing}) cuando estés lista para intensificar.` },

      { heading: "Tu cronograma realista: de México a EE.UU.",
        body: `**Mes 0:** Investiga requisitos del state board → inicia aplicación CGFNS → comienza preguntas de práctica diarias
**Meses 1-6:** Evaluación de credenciales en proceso → preparación gradual (20-40 preguntas/día) → mejora de inglés médico
**Meses 6-9:** Evaluación aprobada → aplica al state board → intensifica preparación (40-50 preguntas/día)
**Meses 9-12:** ATT recibido → 8 semanas de preparación intensiva → NCLEX
**Meses 12-18:** NCLEX aprobado → VisaScreen → búsqueda de empleo → proceso de visa
**Meses 18-24:** Llegada a EE.UU. → inicio de trabajo como RN

**El proceso es largo pero cada paso te acerca.** La clave es no esperar para empezar la preparación. Mientras los trámites avanzan, tú avanzas también.

[Empieza hoy](${lnk.questions}) — el primer paso es hacer 20 preguntas de práctica y conocer tu nivel actual. Tu carrera en Estados Unidos comienza ahora. [Accede a lecciones](${lnk.lessons}) y [exámenes adaptativos](${lnk.cat}) en [NurseNest](${lnk.pricing}).` },
    ],
    faq: [
      { question: "¿Puedo presentar el NCLEX en México?", answer: "Sí. Hay centros Pearson VUE en Ciudad de México, Guadalajara, Monterrey y otras ciudades. No necesitas viajar a EE.UU. para presentar el examen." },
      { question: "¿La licenciatura en enfermería de México es aceptada?", answer: "Generalmente sí. La Licenciatura en Enfermería (4-5 años) generalmente cumple los requisitos. La evaluación de CGFNS determinará si tu programa específico es equivalente. La enfermería técnica (2-3 años) generalmente no califica." },
      { question: "¿Necesito hablar inglés perfectamente?", answer: "Necesitas un nivel funcional de inglés médico. No necesitas ser bilingüe perfecto — necesitas entender terminología clínica, leer preguntas con confianza y (para la visa) aprobar un examen de inglés como IELTS, TOEFL u OET." },
    ],
    references: [
      { text: "Commission on Graduates of Foreign Nursing Schools. (2024). *CGFNS Certification Program requirements*. CGFNS International. https://www.cgfns.org/" },
      { text: "National Council of State Boards of Nursing. (2023). *NCLEX-RN examination: Test plan*. NCSBN. https://www.ncsbn.org/nclex" },
      { text: "Bureau of Labor Statistics, U.S. Department of Labor. (2024). *Occupational Outlook Handbook: Registered Nurses*. https://www.bls.gov/ooh/healthcare/registered-nurses.htm" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. 7 errores más comunes (~1,300 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...ESS_TOPICS[20],
    wordCount: 1300,
    sections: [
      { heading: "Introducción",
        body: `La mayoría de las enfermeras que reprueban el NCLEX no fallan por falta de conocimiento — fallan por errores de MÉTODO. Estudian mucho pero estudian MAL.

Estos 7 errores son increíblemente comunes entre enfermeras latinoamericanas que preparan el NCLEX. No son errores de contenido ("no sé farmacología") sino errores de estrategia ("estudio farmacología de forma ineficiente").

La buena noticia: una vez que los identificas, son fáciles de corregir. Léelos, reconoce cuáles estás cometiendo y corrígelos ANTES del día del examen.

[Practica gratis](${lnk.questions}) — el primer paso hacia una preparación efectiva es reconocer lo que no funciona.` },

      { heading: "Error 1: Releer apuntes en lugar de practicar preguntas",
        body: `Este es el error más destructivo y el más común. Releer da una "ilusión de dominio" (Bjork & Bjork, 2011): reconoces la información y crees que la dominas. Pero en el examen, no te piden RECONOCER — te piden PRODUCIR respuestas bajo presión.

**La ciencia es clara:** la práctica de recuperación (hacer preguntas y buscar la respuesta en tu memoria) es 2-3 veces más efectiva que la lectura pasiva (Karpicke, 2012).

**La corrección:** reemplaza el 70% de tu tiempo de lectura por [preguntas de práctica](${lnk.questions}) con justificaciones. Si tienes 90 minutos para estudiar, dedica 60 minutos a preguntas y 30 a revisión de contenido — no al revés.

**Prueba esto hoy:** lee sobre hiperkalemia durante 20 minutos. Luego cierra tus notas y trata de escribir todo lo que recuerdas. Ahora haz 10 [preguntas de práctica](${lnk.questions}) sobre electrolitos. ¿Cuál te enseñó más? Las preguntas, siempre.` },

      { heading: "Error 2: No leer las justificaciones de cada pregunta",
        body: `Hacer 100 preguntas al día sin leer las justificaciones es como entrenar sin entrenador. Repites tus errores en lugar de corregirlos.

**La corrección:** para CADA pregunta, lee la justificación completa — incluso cuando respondas correctamente. Entiende por qué cada opción incorrecta es incorrecta. Las [preguntas de NurseNest](${lnk.questions}) incluyen justificaciones detalladas para cada opción.

**El 50% de tu tiempo de práctica debería ser leer justificaciones.** 30 preguntas con justificaciones completas son MUCHO más efectivas que 100 preguntas sin revisión.` },

      { heading: "Error 3: Estudiar un tema a la vez sin mezclar",
        body: `Estudiar solo farmacología durante 3 días, luego solo cardíaco durante 3 días, crea una falsa confianza. El NCLEX mezcla los temas — una pregunta de farmacología seguida de una de delegación seguida de una de salud mental.

**La corrección:** a partir de la tercera semana de preparación, cambia a [preguntas aleatorias mixtas](${lnk.questions}). La investigación muestra que alternar temas (interleaving) mejora la retención a largo plazo en un 43% comparado con estudiar un tema a la vez (Rohrer & Taylor, 2007).` },

      { heading: "Error 4: Memorizar sin entender + Error 5: No usar simulaciones adaptativas",
        body: `**Error 4: Memorizar listas sin entender conceptos**

El NCLEX no evalúa tu capacidad de recitar listas. Evalúa tu capacidad de RAZONAR. Memorizar 500 medicamentos sin entender las clases, efectos e interacciones es tiempo perdido.

**La corrección:** enfócate en ENTENDER los mecanismos. Si entiendes POR QUÉ la hiperkalemia es peligrosa (efecto en el corazón), puedes deducir las intervenciones sin haberlas memorizado una por una. Las [lecciones estructuradas](${lnk.lessons}) enseñan conceptos en profundidad.

**Error 5: No practicar con exámenes adaptativos**

Las preguntas de formato fijo (50 preguntas, todos reciben las mismas) NO simulan el NCLEX. El CAT es una experiencia única — la dificultad cambia, no puedes regresar y el estrés es diferente.

**La corrección:** haz al menos 1 [examen adaptativo completo](${lnk.cat}) por semana a partir de la 4a semana de preparación. Es NO NEGOCIABLE. Es la diferencia entre prepararte para un examen que imaginas y prepararte para el examen que vas a enfrentar.` },

      { heading: "Error 6: Ignorar el modelo de práctica de EE.UU. + Error 7: Procrastinar",
        body: `**Error 6: No estudiar delegación y alcance de práctica de EE.UU.**

Este error es específico de enfermeras internacionales. En Latinoamérica, la enfermera frecuentemente hace de todo. En EE.UU., hay roles definidos y reglas de delegación que no existen en tu país.

**La corrección:** dedica al menos una semana completa a estudiar delegación, Five Rights of Delegation y alcance de práctica de EE.UU. Practica con [preguntas específicas](${lnk.questions}) sobre este tema. Es un área donde puedes ganar puntos "fáciles" si la estudias.

**Error 7: Posponer la fecha del examen indefinidamente**

"No estoy lista todavía" es a veces legítimo, pero frecuentemente es evitación. Posponer indefinidamente el NCLEX tiene consecuencias reales:
- Pérdida de ingresos (no puedes trabajar como RN sin licencia)
- Erosión de conocimiento (lo que aprendiste se degrada con el tiempo)
- Ansiedad creciente (mientras más esperas, más presión sientes)

**La corrección:** fija una fecha de examen ANTES de comenzar tu preparación. Estudiar "hasta que me sienta lista" no tiene fin. Tener una fecha fija crea la urgencia necesaria.

¿Cuándo estás objetivamente lista? Cuando 3 [exámenes adaptativos](${lnk.cat}) consecutivos muestran "APROBADO".` },

      { heading: "Plan de acción inmediato",
        body: `No intentes cambiar los 7 errores al mismo tiempo. Identifica los 2-3 que estás cometiendo AHORA y corrígelos esta semana:

1. **Si relees tus notas** → reemplaza por 30 [preguntas de práctica](${lnk.questions}) diarias
2. **Si ignoras las justificaciones** → lee CADA justificación, correcta o no
3. **Si estudias un tema a la vez** → cambia a preguntas aleatorias mixtas
4. **Si memorizas sin entender** → enfócate en el POR QUÉ usando [lecciones](${lnk.lessons})
5. **Si evitas las simulaciones** → haz 1 [examen adaptativo](${lnk.cat}) esta semana
6. **Si no has estudiado delegación EE.UU.** → dedica 3 días a este tema
7. **Si postergas** → fija tu fecha de examen hoy

[Empieza hoy](${lnk.questions}) — la corrección de estos errores comienza con tu próxima sesión de preguntas de práctica. [Accede a lecciones](${lnk.lessons}) y [exámenes adaptativos](${lnk.cat}) para una preparación estructurada y efectiva. [Practica gratis](${lnk.pricing}).` },
    ],
    faq: [
      { question: "¿Cuál es el error más grave?", answer: "El Error 1 (releer en lugar de practicar) es el más destructivo porque crea una ilusión de dominio. Piensas que estás preparada porque reconoces el contenido, pero en el examen, el reconocimiento no basta — necesitas la recuperación activa." },
      { question: "¿Cuántas preguntas de práctica al día son suficientes?", answer: "Mínimo 30 preguntas con revisión completa de justificaciones. Si haces 100 preguntas sin leer justificaciones, es MENOS efectivo que 30 preguntas con justificaciones. La calidad supera a la cantidad." },
      { question: "¿Cómo saber si mi método de estudio funciona?", answer: "¿Tus puntajes de preguntas de práctica aumentan de semana en semana? ¿Tus errores recurrentes disminuyen? ¿Tus exámenes adaptativos muestran progreso? Si sí, continúa. Si no, cambia de método." },
    ],
    references: [
      { text: "Bjork, R. A., & Bjork, E. L. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In M. A. Gernsbacher et al. (Eds.), *Psychology and the real world*. Worth Publishers." },
      { text: "Karpicke, J. D. (2012). Retrieval-based learning: Active retrieval promotes meaningful learning. *Current Directions in Psychological Science*, 21(3), 157–163." },
      { text: "Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science*, 35(6), 481–498." },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. ¿Vale la pena el NCLEX? Salario y oportunidades (~1,280 words)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ...ESS_TOPICS[29],
    wordCount: 1280,
    sections: [
      { heading: "Introducción",
        body: `"¿Realmente vale la pena todo este esfuerzo?" Es la pregunta que toda enfermera latinoamericana se hace antes de comprometerse con el NCLEX.

El proceso es largo (12-24 meses), costoso ($1,500-$2,500 USD) y exigente (meses de estudio intensivo). Y todo esto mientras trabajas, cuidas a tu familia y manejas la incertidumbre.

Esta guía te da la respuesta con datos reales — no promesas vacías. Salarios actuales, oportunidades de carrera, calidad de vida y los retos reales que enfrentarás. Para que tomes una decisión informada.

[Empieza hoy](${lnk.questions}) — si decides que sí vale la pena, cada día cuenta.` },

      { heading: "Salario: la diferencia es dramática",
        body: `Comparemos los salarios promedio de enfermeras registradas:

**Latinoamérica (salarios anuales aproximados en USD):**
- México: $8,000-$15,000
- Colombia: $6,000-$12,000
- Perú: $5,000-$10,000
- Argentina: $4,000-$8,000 (varía con tipo de cambio)

**Estados Unidos (salarios anuales):**
- Promedio nacional: $86,070 (BLS, 2024)
- California: $124,000
- New York: $93,000
- Texas: $80,000
- Florida: $73,000

**La multiplicación:**
Una enfermera que gana $10,000/año en México pasaría a ganar $80,000-$95,000/año en EE.UU. Eso es un aumento de 8-9.5 veces.

**Después de impuestos y costo de vida:**
- Salario bruto: $86,000
- Impuestos federales + estatales: ~25% = $21,500
- Ingreso neto: ~$64,500
- Costo de vida (renta, comida, transporte): varía por ciudad
- Ahorro potencial: $15,000-$30,000/año (dependiendo de la ciudad y estilo de vida)

Ese ahorro anual es equivalente a 1-3 años de salario de enfermería en Latinoamérica.

Estudiar [preguntas de práctica](${lnk.questions}) diariamente es una inversión con el mejor retorno posible.` },

      { heading: "Oportunidades de carrera: crecimiento sin techo",
        body: `En muchos países de Latinoamérica, la carrera de enfermería tiene un techo bajo — los aumentos salariales son pequeños y las oportunidades de especialización limitadas.

**En EE.UU., las posibilidades son diferentes:**

**Especializaciones:**
- Enfermería de cuidados intensivos (ICU)
- Enfermería de emergencias
- Enfermería pediátrica
- Enfermería oncológica
- Enfermería de salud mental
- Cada especialización aumenta el salario $5,000-$15,000

**Avance profesional:**
- Nurse Practitioner (NP): $120,000-$150,000/año
- Clinical Nurse Specialist: $100,000-$120,000/año
- Nurse Manager: $95,000-$115,000/año
- Nurse Educator: $85,000-$100,000/año

**Ventaja bilingüe:**
Las enfermeras que hablan español son ALTAMENTE demandadas en EE.UU. La comunidad hispana es la minoría más grande del país y necesita atención de salud culturalmente competente. Tu español no es un obstáculo — es una VENTAJA COMPETITIVA.

Empresas de staffing y hospitales en Texas, California, Florida y New York buscan activamente enfermeras bilingües y frecuentemente ofrecen bonos por habilidad lingüística.` },

      { heading: "Caminos migratorios: cómo llegar a EE.UU. legalmente",
        body: `**Visa EB-3 (Inmigrante — Green Card):**
- La ruta más común para enfermeras
- Requiere: NCLEX aprobado, VisaScreen, oferta de trabajo de empleador estadounidense
- Tiempo de procesamiento: 2-5 años (varía por país de nacimiento)
- Resultado: residencia permanente (Green Card)

**Visa H-1B (Temporal):**
- Visa de trabajo temporal
- Sujeta a lotería (cupo limitado)
- Menos común para enfermeras que la EB-3

**Visa TN (para mexicanos — bajo T-MEC/USMCA):**
- Exclusiva para ciudadanos mexicanos y canadienses
- Proceso más rápido que la EB-3
- Renovable indefinidamente pero no lleva directamente a Green Card
- Requiere: título de licenciatura + licencia estatal + oferta de trabajo

**Para enfermeras mexicanas, la visa TN es una ventaja significativa** — es más rápida y menos costosa que la EB-3. Puedes comenzar a trabajar mientras procesas la residencia permanente por otra vía.

**Para enfermeras colombianas y del resto de LATAM**, la EB-3 es la ruta principal. Agencias de reclutamiento internacional frecuentemente cubren parte de los costos de visa y reubicación.` },

      { heading: "Los retos reales: lo que nadie te cuenta",
        body: `Ser honesta contigo es importante. Trabajar en EE.UU. no es perfecto:

**Choque cultural:**
- El sistema de salud de EE.UU. es MUY diferente al de Latinoamérica
- La documentación (charting) consume mucho tiempo
- Las demandas legales son más frecuentes — documentar todo es esencial
- La relación enfermera-paciente es diferente culturalmente

**Lejos de la familia:**
- La distancia de tu familia es real y dolorosa
- Los primeros 6-12 meses son los más difíciles emocionalmente
- La comunidad latina en EE.UU. ayuda, pero no reemplaza tu red de apoyo

**Adaptación profesional:**
- Aprender nuevos protocolos, medicamentos con nombres diferentes, sistemas electrónicos
- Los primeros 3-6 meses de trabajo son intensos y estresantes
- Tu experiencia en Latinoamérica es valiosa pero necesita adaptación

**El idioma:**
- Aunque hables inglés, el ritmo y los acentos varían
- La jerga médica informal (slang) toma tiempo en aprender
- Las instrucciones de los médicos pueden ser rápidas y difíciles de seguir al principio

Estos retos son REALES pero TEMPORALES. La mayoría de las enfermeras latinas se adaptan en 6-12 meses y reportan alta satisfacción con su decisión.` },

      { heading: "¿Entonces, vale la pena? La respuesta honesta",
        body: `**Vale la pena SI:**
- Buscas un salario significativamente mayor (8-10x en muchos casos)
- Quieres crecimiento profesional sin techo
- Estás dispuesta a invertir 12-24 meses en el proceso
- Puedes manejar la distancia de tu familia (temporal o permanente)
- Estás preparada para una adaptación cultural intensa pero gratificante

**Podría NO valer la pena SI:**
- Tu prioridad absoluta es estar cerca de tu familia y no estás dispuesta a la distancia
- No te sientes cómoda con el inglés y no estás dispuesta a mejorarlo
- Buscas resultados inmediatos (el proceso es largo)
- Estás satisfecha con tu situación actual y el esfuerzo no justifica el cambio

**Para la mayoría de las enfermeras latinas que dan el paso: SÍ vale la pena.** El impacto en tu vida financiera, profesional y personal es transformador.

[Empieza hoy](${lnk.questions}) — si tu respuesta es sí, el momento de comenzar es AHORA. Haz 20 preguntas de práctica gratuitas y empieza a construir tu futuro. [Accede a lecciones](${lnk.lessons}), [exámenes adaptativos](${lnk.cat}) y preparación completa en [NurseNest](${lnk.pricing}). [Practica gratis](${lnk.questions}).` },
    ],
    faq: [
      { question: "¿Cuánto dinero necesito ahorrar para todo el proceso?", answer: "El costo total del proceso (CGFNS, examen, visa, estudio) es aproximadamente $1,500-$2,500 USD. Muchas agencias de reclutamiento cubren parte o todos los costos de visa y reubicación a cambio de un contrato de trabajo. Investiga estas opciones para reducir tu inversión inicial." },
      { question: "¿Puedo llevar a mi familia a EE.UU.?", answer: "Sí. Con la Green Card (EB-3), puedes patrocinar a tu cónyuge e hijos menores. Con la visa TN (México), hay visa TD para dependientes. El proceso de reunificación familiar varía según el tipo de visa." },
      { question: "¿Qué pasa si repruebo el NCLEX?", answer: "Puedes volver a presentar el examen después de un período de espera (generalmente 45-90 días). No pierdes tu evaluación de credenciales ni tu elegibilidad. La mayoría de las enfermeras que reprueban la primera vez aprueban en el segundo intento con un cambio de método de estudio." },
    ],
    references: [
      { text: "Bureau of Labor Statistics, U.S. Department of Labor. (2024). *Occupational Outlook Handbook: Registered Nurses*. https://www.bls.gov/ooh/healthcare/registered-nurses.htm" },
      { text: "Commission on Graduates of Foreign Nursing Schools. (2024). *Credentials evaluation for internationally educated nurses*. CGFNS International. https://www.cgfns.org/" },
      { text: "National Council of State Boards of Nursing. (2023). *NCLEX-RN examination: Test plan*. NCSBN. https://www.ncsbn.org/nclex" },
    ],
  },
];

// ── Accessors ────────────────────────────────────────────────────────────────

export function getESSPost(id: string): ESSPost | undefined {
  return ESS_POSTS.find((p) => p.id === id);
}
export function getAllESSTopics(): ESSTopic[] {
  return ESS_TOPICS;
}
export function getAllESSSeoMeta() {
  return ESS_TOPICS.map((t) => ({
    id: t.id, locale: t.locale, region: t.region, profession: t.profession,
    exam: t.exam, title: t.metaTitle, description: t.metaDescription, slug: t.slug,
  }));
}
