/** Spanish long-form sections (native terminology; placeholders §T§ §E§ §N§). */
export function esSectionBlocks(ctx: { topicPhrase: string; examFrame: string; n: number }): string[] {
  const { topicPhrase: T, examFrame: E, n: N } = ctx;
  const sub = (s: string) => s.replace(/§T§/g, T).replace(/§E§/g, E).replace(/§N§/g, String(N));
  return [
    sub(`<h2>Introducción</h2>
<p>Este artículo educativo enlaza §T§ con prioridades de valoración, comunicación y seguridad del paciente que suelen evaluarse en §E§. No sustituye protocolos locales ni tutoría clínica; sirve como mapa de estudio para candidatas y candidatos que comparan sistemas de salud.</p>
<p>La lectura mantiene un hilo explícito: reconocer riesgo, documentar con claridad, escalar de forma oportuna y educar al paciente cuando la estabilidad lo permite. Esos pasos aparecen en escenarios de examen como decisiones secuenciales, no como listas memorizadas fuera de contexto.</p>
<p>El índice temático §N§ refuerza que el aprendizaje profundo proviene de repetir el mismo marco clínico con matices distintos: interacciones farmacológicas, barreras culturales, limitaciones de recursos y equipos interprofesionales.</p>`),
    sub(`<h2>Puntos clave</h2>
<ul>
  <li>§T§ se integra en decisiones de priorización: primero estabilidad hemodinámica y vía aérea cuando aplique, luego causas reversibles y educación.</li>
  <li>La documentación debe reflejar síntomas objetivos, intervenciones y la respuesta del paciente; los examinadores premian trazabilidad y transparencia.</li>
  <li>La farmacoterapia exige verificar alergias, función renal/hepática y duplicidad terapéutica antes de administrar o sugerir cambios.</li>
  <li>La enseñanza al paciente debe usar lenguaje verificable y comprobar comprensión, especialmente en alta o transferencia de unidad.</li>
  <li>La preparación para §E§ mejora cuando se practica con casos que fuerzan comparar dos intervenciones razonables y justificar la más segura.</li>
</ul>`),
    sub(`<h2>Panorama clínico y de examen</h2>
<p>En §E§, los ítems suelen mezclar datos parciales con distractores plausibles. Para §T§, conviene partir de un guion: identificar el déficit fisiológico principal, anticipar complicaciones y alinear la intervención con el alcance del rol de enfermería en el país de destino.</p>
<p>Los marcos de seguridad (checklists, doble verificación, tiempos estándar para antibióticos o reperfusión) aparecen como expectativas implícitas. La práctica educativa consiste en nombrar el principio de seguridad antes de elegir la opción técnica.</p>
<p>La comunicación con médicos y terapeutas debe ser concisa: situación, antecedentes relevantes, valoración focal y recomendación de enfermería cuando el formato lo permita. Esa estructura reduce errores en paso de guardia y en simulaciones de alta fidelidad.</p>
<p>Finalmente, la ética profesional y el consentimiento informado modelan respuestas cuando hay conflicto entre autonomía del paciente y riesgo inmediato; estudie ambos polos con casos breves.</p>`),
    sub(`<h2>Fisiopatología cuando aplica a §T§</h2>
<p>La fisiopatología orienta la observación: qué signo anticipa qué fallo. En §T§, relacione alteraciones hemodinámicas, equilibrio ácido-base, respuesta inflamatoria o disfunción de órgano diana con los parámetros que usted puede vigilar en cabecera.</p>
<p>No es necesario memorizar cada vía molecular; sí es útil comprender compensaciones (por ejemplo, mecanismos respiratorios o renales) para interpretar tendencias en monitorización y laboratorio.</p>
<p>Los exámenes suelen preguntar por el mecanismo que explica un hallazgo inesperado tras una intervención; entrenar ese vínculo reduce respuestas impulsivas.</p>
<p>Si el foco es pediátrico o geriátrico, ajuste el umbral fisiológico esperado y documente variaciones basadas en edad, fragilidad o comorbilidades.</p>`),
    sub(`<h2>Prioridades de valoración</h2>
<p>Comience por ABC cuando haya inestabilidad; luego complete sistemas relevantes a §T§ con inspección, palpación, auscultación y monitorización según protocolo.</p>
<p>Registre dolor, nivel de conciencia, diuresis, trabajo respiratorio y marcadores de perfusión. Para datos subjetivos, cite palabras del paciente y la escala utilizada.</p>
<p>Integre alertas tempranas y escalamiento si existen en su entorno de práctica; en examen, demuestre que reconoce signos de deterioro y el canal correcto de notificación.</p>
<p>Considere factores psicosociales y lingüísticos que modifiquen la presentación clínica o la adherencia; el juicio cultural responsable es parte del cuidado seguro.</p>`),
    sub(`<h2>Intervenciones de enfermería y coordinación</h2>
<p>Las intervenciones deben ser específicas, temporizadas y evaluables. Para §T§, describa posición, oxigenoterapia, acceso vascular, preparación de medicamentos, vigilancia posterior a procedimiento y educación simultánea cuando sea apropiado.</p>
<p>La coordinación interprofesional incluye clarificar órdenes ambiguas, solicitar aclaraciones por escrito cuando proceda y asegurar continuidad en traslados.</p>
<p>La prevención de infecciones y la técnica aséptica son transversales; incorpórelas incluso cuando el ítem parezca centrado en farmacología.</p>
<p>Registre eventos adversos y acciones correctivas sin juicio subjetivo hacia el paciente; use datos observables y tiempos.</p>`),
    sub(`<h2>Farmacología y medicamentos relacionados</h2>
<p>Revise nombre, dosis, vía, frecuencia y contraindicaciones relativas. Para §T§, preste atención a ajustes por peso, edad, embarazo o insuficiencia orgánica.</p>
<p>Evalúe interacciones con medicación domiciliaria y suplementos; pregunte de forma abierta y confirme con fuentes institucionales.</p>
<ul>
  <li>Verificación independiente en fármacos de alto riesgo.</li>
  <li>Educación sobre efectos adversos frecuentes y señales de alarma.</li>
  <li>Reconciliación medicamentosa en ingreso, transferencia y alta.</li>
</ul>
<p>En examen, la opción correcta suele alinearse con políticas de seguridad y evidencia resumida en guías nacionales o hospitalarias.</p>`),
    sub(`<h2>Educación al paciente y familia</h2>
<ol>
  <li>§T§: explique en lenguaje llano qué vigilancia continuará en casa y cómo medir signos si aplica.</li>
  <li>Confirme comprensión con técnica de enseñanza vuelta-demostración cuando haya dispositivos o vendajes.</li>
  <li>Ofrezca recursos escritos accesibles y tiempo para preguntas; documente barreras sensoriales o cognitivas.</li>
  <li>Coordine con trabajo social o interpretación si hay riesgo social o brecha lingüística relevante.</li>
  <li>Refuerce señales de retorno temprano y el canal adecuado de contacto.</li>
</ol>`),
    sub(`<h2>Juicio clínico y priorización</h2>
<p>Ante dos acciones razonables, elija primero la que elimine riesgo vital o prevenga daño inmediato. §T§ se presta a preguntas de priorización porque combina datos heterogéneos.</p>
<p>Evite sesgos de anclaje: revalore cuando cambien síntomas o tras intervención. Explique por escrito el razonamiento en notas educativas para consolidar el hábito.</p>
<p>Integre perspectiva ética: confidencialidad, equidad y respeto a la autonomía dentro de los límites legales del país de práctica.</p>`),
    sub(`<h2>Puntos de repaso para el examen</h2>
<ul>
  <li>Señales “hard” de deterioro ligadas a §T§ y su escalamiento.</li>
  <li>Documentación mínima que demuestre continuidad y seguridad.</li>
  <li>Educación verificable y ajuste cultural sin estereotipos.</li>
  <li>Colaboración interprofesional y comunicación estructurada.</li>
  <li>Reconciliación y vigilancia farmacológica en puntos de transición.</li>
</ul>`),
    sub(`<h2>Profundización: seguridad y continuidad asistencial</h2>
<p>La continuidad se demuestra en notas que cualquier colega pueda leer a las 03:00: qué cambió, por qué, qué se intentó y cuál es el plan si empeora. Para §T§, evite adjetivos vagos (“estable”) sin datos que los respalden; prefiera tendencias de signos vitales, balance hídrico o marcadores pertinentes.</p>
<p>La seguridad del paciente también incluye ergonomía, prevención de caídas y protección de la piel. En §E§, esos temas reaparecen como “segunda mejor respuesta” cuando la primera ya cubrió el riesgo inmediato; entrenar el orden evita trampas.</p>
<p>Finalmente, reflexione sobre equidad: acceso a analgesia, interpretación y apoyo social modifica resultados. La enfermería internacional valora la sensibilidad cultural sin caer en generalizaciones; documente lo observado y las preferencias del paciente con precisión.</p>`),
    sub(`<h2>Profundización: comunicación en crisis y límites éticos</h2>
<p>En crisis, el tono calmado y la brevedad técnica reducen errores. Practique voz activa (“necesito revisión ahora por hipotensión sintomática vinculada a §T§”) y confirme lectura de vuelta cuando el medio sea telefónico o radio.</p>
<p>Los límites éticos incluyen negarse a ejecutar una orden que considere dañina dentro de su marco legal, activando la cadena de escalamiento adecuada. Los exámenes suelen premiar la conducta que protege al paciente y respeta el proceso institucional.</p>
<p>Cierre cada estudio de caso con una línea de aprendizaje: qué vigilaría distinto mañana. Esa práctica convierte §T§ en experiencia acumulada, no en memorización frágil.</p>`),
  ];
}
