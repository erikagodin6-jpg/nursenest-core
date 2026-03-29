const fs = require('fs');

const LANGUAGES = { fr: 'French', es: 'Spanish' };

async function main() {
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const allKeys = JSON.parse(fs.readFileSync('/tmp/needs-fr-es-translation.json', 'utf8'));
  const entries = Object.entries(allKeys);
  console.log('Total keys:', entries.length);

  const batchSize = 150;
  const batches = [];
  for (let i = 0; i < entries.length; i += batchSize) {
    batches.push(entries.slice(i, i + batchSize));
  }
  console.log('Batches:', batches.length);

  const results = { fr: {}, es: {} };

  try {
    const prog = JSON.parse(fs.readFileSync('/tmp/fr-es-progress.json', 'utf8'));
    if (prog.fr) Object.assign(results.fr, prog.fr);
    if (prog.es) Object.assign(results.es, prog.es);
    console.log('Loaded progress: fr=' + Object.keys(results.fr).length + ' es=' + Object.keys(results.es).length);
  } catch {}

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = Object.fromEntries(batches[bi]);
    const batchKeys = Object.keys(batch);

    const frDone = batchKeys.every(k => results.fr[k] && results.fr[k] !== batch[k]);
    const esDone = batchKeys.every(k => results.es[k] && results.es[k] !== batch[k]);
    if (frDone && esDone) {
      console.log(`Batch ${bi+1}/${batches.length}: skip (done)`);
      continue;
    }

    console.log(`Batch ${bi+1}/${batches.length}: ${batchKeys.length} keys`);

    const promises = Object.entries(LANGUAGES).map(async ([lang, langName]) => {
      const done = batchKeys.every(k => results[lang][k] && results[lang][k] !== batch[k]);
      if (done) { console.log(`  ${lang}: skip`); return; }

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are translating UI strings from English to ${langName} for NurseNest, a nursing exam prep platform. Rules:
- Keep medical/clinical accuracy
- Do NOT translate: NurseNest, NCLEX, REX-PN, RPN, RN, NP, LVN, ECG, ABG, PPE, SBAR, ADPIE, AANP, ANCC
- Keep placeholders like {count}, {name}, {total} exactly as-is
- Return ONLY a valid JSON object mapping the same keys to ${langName} translations
- No explanations, markdown, or wrapping - just the raw JSON object`
              },
              { role: 'user', content: JSON.stringify(batch) }
            ],
            temperature: 0.15,
            max_tokens: 16000,
          });

          const text = response.choices?.[0]?.message?.content || '{}';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('No JSON');
          const translated = JSON.parse(jsonMatch[0]);
          const tCount = Object.keys(translated).filter(k => translated[k] !== batch[k]).length;
          if (tCount < batchKeys.length * 0.5) throw new Error(`Only ${tCount}/${batchKeys.length} actually translated`);
          Object.assign(results[lang], translated);
          console.log(`  ${lang}: ${Object.keys(translated).length} keys (${tCount} translated)`);
          return;
        } catch (e) {
          console.error(`  ${lang} attempt ${attempt+1}: ${e.message?.substring(0, 100)}`);
          if (attempt < 2) await new Promise(r => setTimeout(r, 3000 * (attempt + 1)));
        }
      }
      console.error(`  ${lang} FAILED batch ${bi+1}`);
    });

    await Promise.all(promises);
    fs.writeFileSync('/tmp/fr-es-progress.json', JSON.stringify(results));
    console.log('  [saved]');
  }

  fs.writeFileSync('/tmp/fr-es-complete.json', JSON.stringify(results, null, 2));
  console.log('\nDone!');
  console.log('  fr:', Object.keys(results.fr).length, 'keys');
  console.log('  es:', Object.keys(results.es).length, 'keys');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
