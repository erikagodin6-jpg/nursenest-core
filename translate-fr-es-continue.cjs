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
  const batchSize = 150;
  const batches = [];
  for (let i = 0; i < entries.length; i += batchSize) batches.push(entries.slice(i, i + batchSize));

  const results = JSON.parse(fs.readFileSync('/tmp/fr-es-progress.json', 'utf8'));
  console.log('Loaded: fr=' + Object.keys(results.fr).length + ' es=' + Object.keys(results.es).length);

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = Object.fromEntries(batches[bi]);
    const batchKeys = Object.keys(batch);
    const frDone = batchKeys.every(k => k in results.fr);
    const esDone = batchKeys.every(k => k in results.es);
    if (frDone && esDone) { continue; }

    console.log(`Batch ${bi+1}/${batches.length}: ${batchKeys.length} keys`);
    const langs = [];
    if (!frDone) langs.push('fr');
    if (!esDone) langs.push('es');

    const promises = langs.map(async (lang) => {
      const missing = Object.fromEntries(batchKeys.filter(k => !(k in results[lang])).map(k => [k, batch[k]]));
      if (Object.keys(missing).length === 0) return;
      const langName = LANGUAGES[lang];
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: `Translate UI strings from English to ${langName} for NurseNest, a nursing exam prep platform. Rules:\n- Keep medical accuracy\n- Do NOT translate: NurseNest, NCLEX, REX-PN, RPN, RN, NP, LVN, ECG, ABG, PPE, SBAR, ADPIE, AANP, ANCC\n- Keep placeholders like {count} exactly as-is\n- Return ONLY valid JSON mapping same keys to translations` },
              { role: 'user', content: JSON.stringify(missing) }
            ],
            temperature: 0.15,
            max_tokens: 16000,
          });
          const text = response.choices?.[0]?.message?.content || '{}';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('No JSON');
          const translated = JSON.parse(jsonMatch[0]);
          Object.assign(results[lang], translated);
          console.log(`  ${lang}: +${Object.keys(translated).length}`);
          return;
        } catch (e) {
          console.error(`  ${lang} attempt ${attempt+1}: ${e.message?.substring(0, 100)}`);
          if (attempt < 2) await new Promise(r => setTimeout(r, 3000));
        }
      }
    });
    await Promise.all(promises);
    fs.writeFileSync('/tmp/fr-es-progress.json', JSON.stringify(results));
  }

  fs.writeFileSync('/tmp/fr-es-complete.json', JSON.stringify(results, null, 2));
  console.log('Done! fr:', Object.keys(results.fr).length, 'es:', Object.keys(results.es).length);
}
main().catch(e => { console.error('Fatal:', e); process.exit(1); });
