/** Portuguese long-form sections (native terminology; placeholders §T§ §E§ §N§). */
export function ptSectionBlocks(ctx: { topicPhrase: string; examFrame: string; n: number }): string[] {
  const { topicPhrase: T, examFrame: E, n: N } = ctx;
  const sub = (s: string) => s.replace(/§T§/g, T).replace(/§E§/g, E).replace(/§N§/g, String(N));
  return [
    sub(`<h2>Introdução</h2>
<p>Este material educativo conecta §T§ a prioridades de avaliação, comunicação e segurança do paciente comuns em §E§. Não substitui protocolos locais nem supervisão clínica; funciona como roteiro de estudo para profissionais que transitam entre sistemas de saúde.</p>
<p>O fio condutor permanece explícito: reconhecer risco, registrar com clareza, escalar no tempo certo e educar o paciente quando houver estabilidade.</p>
<p>O índice §N§ reforça que a profundidade vem de repetir o mesmo arcabouço clínico com nuances distintas: interações medicamentosas, barreiras culturais, recursos limitados e trabalho interprofissional.</p>`),
    sub(`<h2>Principais conclusões</h2>
<ul>
  <li>§T§ entra em decisões de priorização: primeiro estabilidade hemodinâmica e via aérea quando necessário, depois causas reversíveis e educação.</li>
  <li>O prontuário deve refletir sinais objetivos, intervenções e resposta do paciente; rastreabilidade é valorizada.</li>
  <li>Farmacoterapia exige checar alergias, função renal/hepática e sobreposição terapêutica antes de administrar ou sugerir mudanças.</li>
  <li>Educação em saúde deve usar linguagem verificável e testar compreensão, especialmente nas transições.</li>
  <li>A preparação para §E§ melhora com casos que obrigam a comparar duas ações razoáveis e justificar a mais segura.</li>
</ul>`),
    sub(`<h2>Panorama clínico e foco de prova</h2>
<p>Em §E§, itens costumam misturar dados parciais com distratores plausíveis. Para §T§, use um roteiro: déficit fisiológico principal, complicações prováveis e alinhamento com o escopo legal da enfermagem no país-alvo.</p>
<p>Marcos de segurança (checklists, dupla checagem, tempos para antibiótico ou reperfusão) são expectativas implícitas. Nomeie o princípio de segurança antes da opção técnica.</p>
<p>Comunicação com médicos e terapeutas deve ser concisa: situação, história relevante, achados focais e recomendação de enfermagem quando couber.</p>
<p>Ética e consentimento informado moldam respostas quando autonomia tensiona com risco imediato.</p>`),
    sub(`<h2>Fisiopatologia quando pertinente a §T§</h2>
<p>A fisiopatologia orienta a observação: qual sinal antecede qual falha. Para §T§, relacione hemodinâmica, equilíbrio ácido-base, inflamação ou disfunção orgânica a parâmetros monitoráveis.</p>
<p>Não é preciso memorizar toda cascata molecular; é útil compreender compensações para interpretar tendências.</p>
<p>Provas cobram mecanismos que explicam achados inesperados após intervenção.</p>
<p>Em pediatria ou geriatria, ajuste limiares esperados e documente fragilidade.</p>`),
    sub(`<h2>Prioridades de avaliação</h2>
<p>Inicie com ABC em instabilidade; depois sistemas relevantes a §T§ com inspeção, palpação, ausculta e monitorização.</p>
<p>Registre dor, consciência, diurese, esforço respiratório e perfusão. Para dados subjetivos, cite o paciente e a escala.</p>
<p>Integre alerta precoce e canal de escalação quando existirem.</p>
<p>Considere fatores psicossociais e linguísticos que alterem apresentação ou adesão.</p>`),
    sub(`<h2>Intervenções de enfermagem e coordenação</h2>
<p>Intervenções devem ser específicas, datadas e avaliáveis. Para §T§, descreva posicionamento, oxigenoterapia, acesso, preparo de medicamentos, vigilância pós-procedimento e educação.</p>
<p>Coordenação interprofissional inclui esclarecer prescrições ambíguas e segurar passagens de plantão.</p>
<p>Prevenção de infecção e técnica asséptica são transversais.</p>
<p>Documente eventos adversos com fatos observáveis e horários.</p>`),
    sub(`<h2>Farmacologia e medicamentos relacionados</h2>
<p>Confira nome, dose, via, frequência e contraindicações relativas. Para §T§, atenção a ajustes por peso, idade, gravidez ou insuficiência orgânica.</p>
<p>Avalie interações com medicação domiciliar e suplementos.</p>
<ul>
  <li>Verificação independente para medicamentos de alto risco.</li>
  <li>Orientação sobre efeitos adversos comuns e sinais de alarme.</li>
  <li>Reconciliação na admissão, transferência e alta.</li>
</ul>
<p>Em prova, a alternativa correta frequentemente segue políticas de segurança e sínteses de diretrizes.</p>`),
    sub(`<h2>Educação do paciente e familiares</h2>
<ol>
  <li>§T§: explique em linguagem simples a vigilância domiciliar e como medir sinais quando aplicável.</li>
  <li>Confirme compreensão com demonstração reversa para dispositivos ou curativos.</li>
  <li>Ofereça materiais acessíveis e tempo para perguntas; registre barreiras sensoriais ou cognitivas.</li>
  <li>Acione serviço social ou interpretação se houver risco social ou lacuna linguística.</li>
  <li>Reforce retorno precoce e canal de contato adequado.</li>
</ol>`),
    sub(`<h2>Julgamento clínico e priorização</h2>
<p>Diante de duas ações razoáveis, escolha primeiro a que elimina risco vital ou prevenção de dano imediato. §T§ favorece itens de priorização com dados heterogêneos.</p>
<p>Evite âncora: reavalie quando os sintomas mudarem ou após intervenção.</p>
<p>Integre ética: confidencialidade, equidade e respeito à autonomia dentro da lei local.</p>`),
    sub(`<h2>Pontos de revisão para o exame</h2>
<ul>
  <li>Sinais duros de deterioração ligados a §T§ e escalonamento.</li>
  <li>Documentação mínima que mostre continuidade e segurança.</li>
  <li>Educação verificável sem estereótipos culturais.</li>
  <li>Trabalho em equipe e comunicação estruturada.</li>
  <li>Reconciliação e vigilância farmacológica nas transições.</li>
</ul>`),
    sub(`<h2>Aprofundamento: segurança e continuidade</h2>
<p>A continuidade aparece em notas legíveis por outro profissional: o que mudou, por quê, o que foi tentado e o plano se piorar. Para §T§, evite adjetivos vagos sem dados; prefira tendências tensionais, balanço hídrico ou marcadores pertinentes.</p>
<p>Segurança inclui ergonomia, quedas e integridade da pele; em §E§, esses temas retornam como segunda melhor resposta quando a primeira já cobriu o risco imediato.</p>
<p>Considere equidade no acesso a analgesia, interpretação e apoio social; documente fatos e preferências com precisão.</p>`),
    sub(`<h2>Aprofundamento: comunicação em crise e limites éticos</h2>
<p>Em crise, tom calmo e técnica breve reduzem erro. Pratique assertividade e leitura de retorno em canais telefônicos ou rádio.</p>
<p>Limites éticos incluem recusar ordem potencialmente lesiva no seu arcabouço legal, acionando a cadeia correta.</p>
<p>Feche cada caso com uma linha de aprendizado: o que monitoraria diferente amanhã, consolidando §T§ como experiência.</p>`),
  ];
}
