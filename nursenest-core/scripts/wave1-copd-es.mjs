import { SECTION_HEADINGS, SHARED_CORE } from "./wave1-copd-locales.mjs";

function q(question, options, rationale) {
  return { question, options, rationale };
}

const H = SECTION_HEADINGS.es;
const CORE = SHARED_CORE.es;

export const COPD_ES = {
  "us-lpn-nclex-pn:copd-clinical-judgment-gold": {
    title: "EPOC: juicio clínico (NCLEX-PN, EE. UU.)",
    seoTitle: "EPOC — juicio clínico | NCLEX-PN EE. UU. | NurseNest",
    seoDescription:
      "Alcance de enfermería práctica/vocacional en EE. UU.: valoración, delegación segura, oxígeno y broncodilatadores según orden, escalada — sin asumir juicio de nivel RN.",
    sections: {
      clinical_meaning: {
        heading: H.clinical_meaning,
        body: `**NCLEX-PN (LPN/LVN)** premia el cuidado **seguro y acorde al rol**: observar y reportar cambios, ejecutar **órdenes**, reforzar enseñanza, proteger el suministro de oxígeno **según prescripción** y escalar pronto cuando los hallazgos superen una EPOC estable.

**Línea de alcance**  
La práctica PN/LVN **varía por estado y política del centro**. En el examen, prefiera acciones que **permanezcan dentro del conjunto de órdenes / dirección del RN** cuando el ítem evalúa delegación — evite titular de forma independiente, nuevas prescripciones o diagnosticar más allá del registro de datos de enfermería.`,
      },
      exam_relevance: {
        heading: H.exam_relevance,
        body: `Espere **priorización** (quién necesita atención primero), **seguridad del oxígeno ligada a órdenes**, **pistas de infección/exacerbación** y **enseñanza** que puede reforzar. Trampas: **triage de nivel RN** como acción de LPN, **retrasar el reporte urgente** o **tareas rutinarias** antes de un **cambio respiratorio agudo**.`,
      },
      core_concept: { heading: H.core_concept, body: CORE },
      clinical_scenario: {
        heading: H.clinical_scenario,
        body: `**Viñeta — piso médico-quirúrgico (EE. UU.)**  
Su cliente tiene EPOC con **2 L/min en cánula nasal** según orden. Nota **FR 32**, **postura de trípode** y **SpO₂ 84 %** con el mismo flujo. El cliente está ansioso pero alerta.

**Rama PN**  
Sus primeros movimientos son **valoración y escalada dentro de la orden**: reevaluar entrega/equipo, enseñar **respiración con labios fruncidos**, permanecer con el cliente y **notificar de inmediato al RN o proveedor** para reevaluación y posibles cambios de orden. El error es **subir en silencio el oxígeno** o dar **sedantes** para “calmar” distrés respiratorio no diferenciado.`,
      },
      takeaways: {
        heading: H.takeaways,
        body: `• **Reporte** cambios respiratorios agudos; no espere ante desaturación crítica.  
• Los cambios de **oxígeno** en EPOC suelen requerir **orden/protocolo** — su rol es entrega segura y escalada oportuna.  
• **Refuerce** la enseñanza prescrita (inhaladores, labios fruncidos, ahorro de energía, cesación tabáquica).  
• Empareje esta lección con ítems **respiratorios / EPOC** filtrados para su vía.`,
      },
    },
    preTest: [
      q(
        "Una PN cuida a un cliente con EPOC con 2 L/min en cánula nasal según orden. La SpO₂ baja de 92 % a 84 % y aumenta la frecuencia respiratoria. ¿Qué debe hacer la PN primero?",
        [
          "Subir el oxígeno a 6 L/min sin contactar a nadie.",
          "Valorar al cliente y la entrega de oxígeno, luego notificar al RN o proveedor del cambio agudo.",
          "Pedirle al cliente que duerma plano para “descansar el diafragma”.",
          "Administrar un sedante PRN para reducir la ansiedad.",
        ],
        "Valorar entrega y cliente, luego escalar para reevaluación/órdenes. Subir oxígeno o sedar de forma independiente puede ser inseguro y a menudo está fuera del alcance PN; decúbito supino puede empeorar la disnea.",
      ),
      q(
        "¿Qué afirmación describe mejor la respiración con labios fruncidos en EPOC?",
        [
          "Aumenta principalmente la frecuencia respiratoria para eliminar CO₂.",
          "Crea una leve contrapresión para prolongar la espiración y reducir el atrapamiento aéreo.",
          "Sustituye la broncodilatación cuando el cliente está estable.",
          "Solo se usa durante el sueño, no con actividad.",
        ],
        "Los labios fruncidos prolongan la espiración y pueden limitar el colapso dinámico de vías; no sustituye medicamentos ni oxígeno prescrito.",
      ),
      q(
        "Durante una exacerbación de EPOC, ¿qué hallazgo debe reportar la PN de inmediato?",
        [
          "Solicitud de almohadas extra para comodidad.",
          "Nueva confusión o somnolencia creciente con empeoramiento del trabajo respiratorio.",
          "SpO₂ estable en el habitual domiciliario con oxígeno prescrito.",
          "Boca seca por la cánula.",
        ],
        "Alteración del sensorio con deterioro respiratorio: posible fallo hipercápnico o enfermedad crítica — reporte inmediato.",
      ),
    ],
    postTest: [
      q(
        "¿Qué acción PN apoya mejor la enseñanza de prevención de infecciones durante el cuidado de EPOC?",
        [
          "Fomentar vacuna anual contra influenza cuando esté en el plan y enseñar higiene de manos.",
          "Decir al cliente que deje toda actividad física de forma permanente.",
          "Recomendar suspender todos los inhaladores con un resfriado.",
          "Aconsejar duplicar el flujo de oxígeno domiciliario cuando se sienta cansado.",
        ],
        "Inmunización e higiene reducen desencadenantes; la actividad se ritma; inhaladores y oxígeno siguen dirección clínica.",
      ),
      q(
        "Un cliente dice: “Puedo fumar un poco; ya no importa.” ¿Mejor respuesta?",
        [
          "Tiene razón — bajar basta.",
          "Incluso pequeñas exposiciones mantienen la inflamación; dejar de fumar aún reduce exacerbaciones — conectemos apoyos del plan.",
          "Pase solo a vapeo; es seguro.",
          "Los puros son filtrados, así que son menos malos.",
        ],
        "El humo empeora progresión y riesgo de exacerbación; enseñanza factual y motivacional dentro del alcance.",
      ),
      q(
        "¿Qué tarea es más apropiada para la PN cuando el RN delega refuerzo estable de enseñanza en EPOC?",
        [
          "Ordenar sola un TC urgente para descartar EP.",
          "Observar técnica de inhalador y reportar uso incorrecto para seguimiento RN/proveedor.",
          "Prescribir cambios de antibióticos por esputo purulento.",
          "Dar de alta al cliente sin colaboración del RN.",
        ],
        "Reforzar habilidades y reportar brechas encaja en alcance PN; prescribir, ordenar diagnóstico o alta no encaja en NCLEX-PN.",
      ),
    ],
  },
  "ca-rpn-rex-pn:copd-clinical-judgment-gold": {
    title: "EPOC: juicio clínico (REx-PN, Canadá)",
    seoTitle: "EPOC — juicio clínico | REx-PN Canadá | NurseNest",
    seoDescription:
      "Enfermería práctica canadiense: valoración en contexto métrico, alcance del colegio, delegación segura y escalada al estilo REx-PN.",
    sections: {
      clinical_meaning: {
        heading: H.clinical_meaning,
        body: `**REx-PN / enfermería práctica en Canadá**  
Los ítems esperan **alcance definido por el colegio**, **constantes métricas y laboratorios SI** cuando se muestran, y escalada clara cuando los hallazgos exceden lo que la enfermera práctica puede iniciar sola.

**Significado clínico**  
Conecta **trabajo respiratorio**, **oxigenoterapia según orden**, **pistas de infección/exacerbación** y **educación del cliente** — manteniendo fuera de alcance la **prescripción independiente o titulación no supervisada**, salvo que el enunciado incluya explícitamente orden vigente o protocolo autorizado.`,
      },
      exam_relevance: {
        heading: H.exam_relevance,
        body: `Busque **priorización**, **comunicación terapéutica**, **administración segura** y **cuándo notificar al RN/NP/médico**. Trampa común: mezclar acciones de **RPN** con **evaluación primaria de RN** o implicar **cambios silenciosos de oxígeno** sin orden.`,
      },
      core_concept: { heading: H.core_concept, body: CORE },
      clinical_scenario: {
        heading: H.clinical_scenario,
        body: `**Viñeta — unidad de agudos (Canadá)**  
Una RPN tiene un cliente con EPOC y **oxígeno de bajo flujo ordenado**. En una hora, **sube la FR**, **cae la SpO₂** con la misma entrega y el cliente usa **postura de trípode**.

**Rama RPN**  
Reevaluar equipo y cliente, aplicar **posición de confort**, enseñar **labios fruncidos** y **notificar al RN** para reevaluación y posibles cambios de orden. Evite **titular oxígeno de forma independiente** salvo protocolo claro.`,
      },
      takeaways: {
        heading: H.takeaways,
        body: `• Pueden aparecer datos **métricos** y **entornos canadienses** — mismo patrón: valorar → escalar si inestable.  
• Los **estándares del colegio** gobiernan lo que puede iniciar; si hay duda, prefiera **colaboración** sobre cambios tipo prescripción en solitario.  
• Refuerce **cesación tabáquica**, **inmunización** y **planes de acción en exacerbación**.  
• Practique ítems **REx-PN** respiratorios después de este bloque.`,
      },
    },
    preTest: [
      q(
        "Una RPN nota SpO₂ 86 % con oxígeno ordenado en un cliente con EPOC y mayor trabajo respiratorio. ¿Mejor acción inicial?",
        [
          "Aumentar el flujo de oxígeno de forma independiente para maximizar saturación.",
          "Reevaluar entrega y cliente, notificar al RN y seguir órdenes/protocolos.",
          "Pedirle al cliente que camine el pasillo para movilizar secreciones.",
          "Documentar solo y reevaluar en dos horas.",
        ],
        "Reevaluar y escalar; titulación no supervisada puede ser inapropiada sin orden/protocolo. Caminar puede empeorar distrés; retrasar reporte es inseguro.",
      ),
      q(
        "¿Qué hallazgo amerita reporte inmediato en exacerbación de EPOC?",
        [
          "Tos seca leve sin cambio en constantes.",
          "Confusión creciente con patrón de retención de CO₂ y somnolencia empeorada.",
          "Solicitud de una segunda manta.",
          "Apetito estable con oxígeno habitual.",
        ],
        "Alteración del nivel de conciencia con patrón de fallo ventilatorio: escalada de emergencia.",
      ),
      q(
        "La enseñanza sobre ahorro de energía en EPOC debe enfatizar:",
        [
          "Agrupar actividades con descansos planificados.",
          "Completar todo el cuidado rápido sin pausas.",
          "Evitar toda actividad física de forma permanente.",
          "Eliminar broncodilatadores para reducir carga de medicación.",
        ],
        "El ritmo reduce disnea; eliminar bruscamente medicamentos prescritos es inseguro.",
      ),
    ],
    postTest: [
      q(
        "¿Qué frase refleja lenguaje correcto de alcance RPN en Canadá sobre cambios de oxígeno?",
        [
          "Yo titulo el oxígeno a mi objetivo personal sin documentar.",
          "Sigo órdenes/protocolos autorizados y colaboro cuando el cliente se desestabiliza.",
          "Yo prescribo antibióticos cuando cambia el color del esputo.",
          "Yo doy de alta cuando el cliente se siente mejor.",
        ],
        "Colaboración y protocolos autorizados preservan alcance; prescribir y alta independiente no encajan en este marco.",
      ),
      q(
        "¿Por qué sirve la respiración con labios fruncidos en EPOC?",
        [
          "Acelera la espiración para subir CO₂.",
          "Puede prolongar la espiración y reducir el colapso dinámico de vías.",
          "Sustituye la oxigenoterapia.",
          "Solo es para asma, no EPOC.",
        ],
        "Mecánica del atrapamiento aéreo; complementa — no reemplaza — terapias ordenadas.",
      ),
      q(
        "Un cliente con EPOC desarrolla fiebre, esputo purulento y disnea creciente. ¿Qué debe esperar la RPN del cuidado colaborativo?",
        [
          "Ignorar constantes porque en EPOC siempre hay fiebre.",
          "Vigilar de cerca constantes y estado respiratorio y reportar hallazgos pronto.",
          "Suspender líquidos para reducir secreciones.",
          "Apagar el oxígeno para favorecer respiraciones más profundas.",
        ],
        "La exacerbación puede requerir reevaluación y cambios terapéuticos; monitoreo y reporte son núcleo del rol RPN.",
      ),
    ],
  },
  "us-rn-nclex-rn:copd-clinical-judgment-gold": {
    title: "EPOC: juicio clínico (NCLEX-RN, EE. UU.)",
    seoTitle: "EPOC — juicio clínico | NCLEX-RN EE. UU. | NurseNest",
    seoDescription:
      "RN en EE. UU.: objetivos de oxigenación, manejo de exacerbación, seguridad con retención de CO₂, priorización y educación del paciente.",
    sections: {
      clinical_meaning: {
        heading: H.clinical_meaning,
        body: `**NCLEX-RN** evalúa **juicio clínico**: a quién atender primero, qué valoración aclara el riesgo y qué intervención encaja con **fisiopatología** y **órdenes**.

En EPOC, espere **objetivos de oxigenación** (a menudo **titular hacia un rango de SpO₂ prescrito**, frecuentemente **~88–92 %** cuando ese es el plan — no un número aislado del enunciado), **momento de broncodilatadores/esteroides/antibióticos**, **movilización temprana si estable** y pistas de **fallo ventilatorio** (somnolencia, CO₂ creciente) que requieren escalada rápida.`,
      },
      exam_relevance: {
        heading: H.exam_relevance,
        body: `Patrones de alto rendimiento: **priorización** entre varios pacientes, **oxígeno seguro**, solapamiento **infección vs insuficiencia cardíaca**, **enseñanza** que demuestra comprensión y **evitar sedación** que enmascara fallo respiratorio.`,
      },
      core_concept: { heading: H.core_concept, body: CORE },
      clinical_scenario: {
        heading: H.clinical_scenario,
        body: `**Viñeta — sala de espera de urgencias**  
Un adulto de 68 años con EPOC presenta **tos aumentada**, **esputo purulento**, **38,3 °C**, **FR 30**, **SpO₂ 86 % en aire ambiente**. Está alerta pero fatigado.

**Rama RN**  
Su secuencia sigue órdenes/protocolos: **oxígeno al objetivo prescrito**, **acceso IV si está ordenado**, **laboratorios/gasometría si está ordenada**, **broncodilatación**, **posición** y **monitorización estrecha** por **narcosis por CO₂** si suben las necesidades de O₂. La trampa es el **papeleo rutinario** o **medicación de rutina** antes de **oxigenación y preparación para escalar**.`,
      },
      takeaways: {
        heading: H.takeaways,
        body: `• Cruzar **SpO₂** con **trabajo respiratorio y estado mental**.  
• **Paquete de exacerbación**: O₂ según plan, medicamentos, monitorización, control de infecciones, movilización si es segura.  
• **Enseñe** señales de alarma de exacerbación y uso correcto de dispositivos.  
• Después, bloque **cronometrado** respiratorio en el banco.`,
      },
    },
    preTest: [
      q(
        "¿Cuál es la prioridad en exacerbación aguda de EPOC con SpO₂ 86 % en aire y malestar moderado?",
        [
          "Terminar educación sobre dieta hiposódica del alta.",
          "Aplicar oxígeno según orden/protocolo y valorar respuesta, preparando escalada si no mejora.",
          "Programar curación de heridas en otra unidad primero.",
          "Ejercicio vigoroso para movilizar secreciones.",
        ],
        "Primero estabilizar hipoxemia y distrés según órdenes; lo demás es secundario.",
      ),
      q(
        "¿Qué hallazgo sugiere mejor fallo ventilatorio agudo en EPOC con oxígeno?",
        [
          "Pide la comida favorita.",
        "Somnolencia creciente, cefalea y patrón de retención de CO₂/acidosis en gasometría.",
          "SpO₂ estable en objetivo con habla fácil.",
          "Ansiedad leve sin cambios en signos vitales.",
        ],
        "CO₂ en ascenso con alteración neurológica es bandera roja.",
      ),
      q(
        "La educación domiciliaria debe incluir:",
        [
          "Suspender inhaladores al mejorar los síntomas.",
          "Plan escrito: cuándo llamar a la clínica vs 911.",
          "Evitar todas las vacunas.",
          "Sedantes nocturnos sin valoración respiratoria.",
        ],
        "Planes de exacerbación e inmunizaciones adecuadas reducen daño; sedantes sin evaluación son riesgo.",
      ),
    ],
    postTest: [
      q(
        "¿Por qué el oxígeno de alto flujo puede ser arriesgado en algunos pacientes con EPOC sin monitorización?",
        [
          "Siempre cura la hipercapnia.",
          "Puede empeorar la retención de CO₂ y el estado mental en sujetos susceptibles—vigilar y gasometría según órdenes.",
          "Nunca se usa en EPOC.",
          "Solo cambia la FC, no la ventilación.",
        ],
        "La respuesta ventilatoria varía; vigilar narcosis por CO₂.",
      ),
      q(
        "¿Qué frase muestra comprensión de respiración con labios fruncidos?",
        [
          "Espiro rápido para eliminar CO₂.",
          "Inspiro por la nariz y espiro lento con labios fruncidos para controlar el espirar.",
          "Aguanto la respiración un minuto cada vez.",
          "Lo uso en lugar de mi broncodilatador.",
        ],
        "Espiración lenta y controlada; broncodilatadores siguen siendo terapia prescrita.",
      ),
      q(
        "En el reporte, ¿a qué cliente debe evaluar primero la enfermera?",
        [
          "Viendo TV con constantes estables con 2 L/min.",
          "Nueva confusión, FR 32 y SpO₂ en caída pese a oxígeno.",
          "Pide almohada con SpO₂ estable.",
          "Pide hielo con mentación normal.",
        ],
        "Cambio agudo en oxigenación y mente supera comodidad.",
      ),
    ],
  },
  "ca-rn-nclex-rn:copd-clinical-judgment-gold": {
    title: "EPOC: juicio clínico (NCLEX-RN, Canadá)",
    seoTitle: "EPOC — juicio clínico | NCLEX-RN Canadá | NurseNest",
    seoDescription:
      "Contexto RN Canadá: exacerbación de EPOC, objetivos de oxígeno, detección de fallo ventilatorio y priorización estilo NCLEX-RN.",
    sections: {
      clinical_meaning: {
        heading: H.clinical_meaning,
        body: `**NCLEX-RN (Canadá)**  
Los ítems evalúan **juicio clínico**: a quién ver primero, qué datos confirman riesgo y qué acción coincide con **órdenes** y **normas provinciales/institucionales**.

En EPOC: **estrategia de oxigenación según orden**, reconocimiento de **exacerbación**, signos de **fallo ventilatorio** (somnolencia, acidosis/CO₂ si hay gasometría) y **enseñanza** adaptada al cliente.`,
      },
      exam_relevance: {
        heading: H.exam_relevance,
        body: `Misma **columna vertebral de priorización** que ítems de EE. UU., a veces con **unidades SI**, **terminología canadiense** y vocabulario de **rol de enfermería**. Trampa: **tareas rutinarias** o **educación de alta** antes de **estabilidad respiratoria**.`,
      },
      core_concept: { heading: H.core_concept, body: CORE },
      clinical_scenario: {
        heading: H.clinical_scenario,
        body: `**Pabellón (Canadá)**  
Cliente con EPOC conocida: **disnea creciente**, **esputo purulento**, **38,1 °C**, **FR 28**, **SpO₂ 88 %** con **2 L/min** según orden.

**Rama RN**  
Según protocolo: reevaluar **entrega de oxígeno y respuesta**, notificar a **NP/médico** por probable escalada terapéutica, administrar **broncodilatadores/esteroides/antibióticos** ordenados y vigilar **retención de CO₂** si aumentan las necesidades de O₂. Evite **alta** antes de **estabilidad**.`,
      },
      takeaways: {
        heading: H.takeaways,
        body: `• Lea **unidades canadienses** con cuidado; razone con los datos del enunciado.  
• **Estabilidad primero**: vía aérea, respiración, circulación, luego confort.  
• Una **infección** con **oxigenación** y monitorización cercana.  
• Siga con ítems **respiratorios** filtrados RN Canadá en el banco.`,
      },
    },
    preTest: [
      q(
        "Una RN en Canadá cuida un cliente en exacerbación de EPOC con SpO₂ 88 % con el oxígeno actual. ¿Prioridad?",
        [
          "Terminar documentación de un error de medicación de turno previo.",
          "Valorar estado respiratorio y terapia de O₂, luego colaborar para ajustes según protocolo u orden.",
          "Iniciar planificación de alta para mañana.",
          "Intervalos de alta intensidad en el pasillo.",
        ],
        "Estabilizar y avanzar cuidados según órdenes; documentación y alta vienen después del riesgo inmediato.",
      ),
      q(
        "¿Qué hallazgo debe motivar reevaluación urgente en exacerbación de EPOC?",
        [
          "Sensorio estable con SpO₂ mejorada tras terapia ordenada.",
          "Nueva confusión y somnolencia creciente con trabajo respiratorio mayor.",
          "Leyendo con 2 L/min.",
          "Tos seca leve sin cambio en constantes.",
        ],
        "Alteración neurológica con deterioro respiratorio: posible hipercapnia — acción inmediata.",
      ),
      q(
        "La enseñanza sobre autocuidado de EPOC en Canadá debe enfatizar:",
        [
          "Suspender esteroides apenas se sienta mejor.",
          "Reconocer desencadenantes de exacerbación y cuándo buscar urgencias.",
          "Evitar toda actividad de forma permanente.",
          "Usar el inhalador de otra persona si se acaba el propio.",
        ],
        "Planes de acción y adherencia; los mantenedores reducen exacerbaciones; la actividad se ritma.",
      ),
    ],
    postTest: [
      q(
        "Sobre oxígeno en EPOC, ¿qué formulación es más acertada para el examen?",
        [
          "Siempre apuntar a SpO₂ 100 % en todos.",
          "Titular a objetivos prescritos; vigilar retención de CO₂ en sujetos susceptibles.",
          "El oxígeno está contraindicado en toda EPOC.",
          "La cánula nunca requiere humedad ni cuidado de piel.",
        ],
        "Objetivos individualizados y monitorización; los absolutos suelen ser falsos.",
      ),
      q(
        "El cliente dice: “Dejé mi inhalador porque me sentía bien.” ¿Mejor respuesta?",
        [
          "Bien — los medicamentos solo son para días malos.",
          "Los medicamentos de mantenimiento suelen controlar inflamación y broncoespasmo aunque se sienta bien; dejarlos puede desencadenar exacerbaciones — revisemos el esquema con el equipo.",
          "Pase solo a vaporizaciones.",
          "Duplique la dosis la próxima semana sin hablar con el clínico.",
        ],
        "Terapia de mantenimiento y adherencia; enseñanza sin cambiar sola la prescripción.",
      ),
      q(
        "¿Qué tarea puede delegar la RN a personal auxiliar competente en EPOC estable?",
        [
          "Interpretar gasometrías y cambiar órdenes de oxígeno de forma independiente.",
          "Medir y registrar signos vitales e informar anomalías.",
          "Enseñar técnica de inhalador de cero sin verificación.",
          "Decidir diagnóstico médico para facturación.",
        ],
        "Recolección de datos con reporte sí; interpretación clínica y órdenes no.",
      ),
    ],
  },
  "us-np-fnp:copd-clinical-judgment-gold": {
    title: "EPOC: juicio en atención primaria (FNP, EE. UU.)",
    seoTitle: "EPOC en atención primaria | FNP EE. UU. | NurseNest",
    seoDescription:
      "Encuadre FNP adulto: conceptos tipo GOLD, triaje de exacerbación, diferenciales vs IC/EP, decisión compartida y escalada segura.",
    sections: {
      clinical_meaning: {
        heading: H.clinical_meaning,
        body: `**FNP / atención primaria adulta**  
Integra **historia**, **contexto espirométrico cuando exista**, **carga de comorbilidad**, **riesgo infeccioso** y **estado funcional** en un plan alineado con **manejo basado en evidencia** de EPOC y su **acuerdo colaborativo**.

En estilo de ítem, enfatice **estratificación de riesgo** (exacerbaciones, hospitalizaciones), **subir/bajar** terapia de mantenimiento, **anclas no farmacológicas** (cesación, vacunas, rehabilitación pulmonar) y **cuándo la urgencia es más segura que “ajustes por teléfono”.**`,
      },
      exam_relevance: {
        heading: H.exam_relevance,
        body: `Busque **diferenciación** (exacerbación de EPOC vs **IC aguda** vs **banderas rojas de EP**), **estudios apropiados**, **decisiones de antibiótico/esteroide** según guías, **seguridad del oxígeno** y **asesoramiento centrado en la persona** sin pasos inseguros fuera del rol.`,
      },
      core_concept: { heading: H.core_concept, body: CORE },
      clinical_scenario: {
        heading: H.clinical_scenario,
        body: `**Seguimiento ambulatorio tras visita a urgencias**  
Adulto de 62 años con EPOC regresa tras **esteroides orales y antibióticos** por exacerbación. Aún tiene **disnea al caminar una cuadra**, **esputo diario** y **dos visitas a urgencias este año**.

**Rama FNP**  
Optimiza **terapia de control**, **técnica de inhalador**, **cesación tabáquica**, **vacunas**, **rehabilitación pulmonar** y un plan escrito de **exacerbación**. **Marca roja**: síncope, **hipoxemia de reposo severa**, **cambio rápido del sensorio** u **hemoptisis** para evaluación urgente. Trampa: **minimizar exacerbaciones frecuentes** como “normales” sin intensificar prevención.`,
      },
      takeaways: {
        heading: H.takeaways,
        body: `• Trate las **exacerbaciones** como resultados a prevenir: vacunas, cesación, rehab, régimen de inhaladores optimizado e instrucciones claras de rescate.  
• Mantenga **diagnóstico diferencial** activo si empeora la disnea (EP, SCA, IC, neumotórax).  
• **Documente** decisiones compartidas e intervalos de seguimiento.  
• Use preguntas de práctica de **nivel NP** que evalúen **síntesis de manejo**.`,
      },
    },
    preTest: [
      q(
        "¿Qué antecedente apoya más intensificar la terapia de mantenimiento de EPOC en AP?",
        [
          "Una exacerbación hace diez años.",
          "Exacerbaciones repetidas u hospitalizaciones en el año pese a terapia basal.",
          "Apendicectomía remota.",
          "Cefalea leve ocasional sin síntomas respiratorios.",
        ],
        "Exacerbaciones frecuentes orientan escalada según guía y apoyos no farmacológicos.",
      ),
      q(
        "Un cliente con EPOC desarrolla dolor torácico pleurítico agudo, edema unilateral de pierna y taquipnea. ¿Mejor prioridad inicial?",
        [
          "Solo aumentar ICS domiciliario.",
          "Reconocer posible EP/SCA y dirigir a evaluación de emergencia.",
          "Duplicar oxígeno domiciliario indefinidamente sin valoración.",
          "Diferir evaluación dos semanas.",
        ],
        "Síntomas cardiopulmonares de bandera roja: evaluación urgente.",
      ),
      q(
        "¿Qué intervención tiene el mayor beneficio a largo plazo en fumadores con EPOC?",
        [
          "Albuterol ocasional sin cesación tabáquica.",
          "Cesación tabáquica sostenida con consejería y farmacoterapia cuando corresponda.",
          "Sedantes diarios para ansiedad.",
          "Evitar todo ejercicio de forma permanente.",
        ],
        "La cesación tabáquica sigue siendo fundamento; sedación e inactividad dañan.",
      ),
    ],
    postTest: [
      q(
        "¿Qué elemento pertenece a un plan de acción de exacerbación de EPOC en AP apropiado?",
        [
          "Duplicar en secreto antibióticos prestados por un amigo.",
          "Umbrales claros para iniciar esteroides/antibióticos orales de rescate si están prescritos, y cuándo llamar al 911.",
          "Suspender todos los inhaladores con resfriados.",
          "Evitar vacuna antigripal por mito.",
        ],
        "Planes escritos reducen daño; préstamos ad hoc y rechazo de vacunas aumentan riesgo.",
      ),
      q(
        "¿Por qué referir a rehabilitación pulmonar a pacientes elegibles?",
        [
          "Reemplaza toda la farmacoterapia.",
          "Mejora disnea, capacidad de ejercicio y calidad de vida en muchos pacientes.",
          "Solo sirve tras trasplante pulmonar.",
          "Cura el enfisema.",
        ],
        "La rehab pulmonar es un coadyuvante con evidencia; no sustituye farmacoterapia.",
      ),
      q(
        "¿Qué hallazgo en consulta amerita más escalada el mismo día o envío a urgencias?",
        [
          "Caminata estable desde el estacionamiento sin distrés.",
          "SpO₂ de reposo en 70 % pese a oxígeno prescrito y síntomas agudos.",
          "Fatiga leve tras jornada laboral con constantes estables.",
          "Solicitud de justificante sin cambio respiratorio.",
        ],
        "Hipoxemia severa en reposo con enfermedad aguda: patrón de emergencia.",
      ),
    ],
  },
};
