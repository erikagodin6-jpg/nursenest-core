const fs = require('fs');
const LANGUAGES = { fr: 'French', es: 'Spanish' };

async function main() {
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const missing = JSON.parse(fs.readFileSync('/tmp/missing-263.json', 'utf8'));
  const existing = JSON.parse(fs.readFileSync('/tmp/fr-es-complete.json', 'utf8'));
  console.log('Translating', Object.keys(missing).length, 'keys for FR and ES...');

  const batchSize = 140;
  const entries = Object.entries(missing);
  const batches = [];
  for (let i = 0; i < entries.length; i += batchSize) batches.push(Object.fromEntries(entries.slice(i, i + batchSize)));

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi];
    console.log(`Batch ${bi+1}/${batches.length}: ${Object.keys(batch).length} keys`);

    const promises = Object.entries(LANGUAGES).map(async ([lang, langName]) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: `Translate UI strings from English to ${langName} for NurseNest, a nursing exam prep platform. Do NOT translate: NurseNest, NCLEX, REX-PN, RPN, RN, NP, LVN, ECG, ABG, PPE, SBAR, ADPIE, AANP, ANCC. Keep placeholders like {count} exactly as-is. Return ONLY valid JSON.` },
              { role: 'user', content: JSON.stringify(batch) }
            ],
            temperature: 0.15,
            max_tokens: 16000,
          });
          const text = response.choices?.[0]?.message?.content || '{}';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('No JSON');
          const translated = JSON.parse(jsonMatch[0]);
          Object.assign(existing[lang], translated);
          console.log(`  ${lang}: +${Object.keys(translated).length}`);
          return;
        } catch (e) {
          console.error(`  ${lang} attempt ${attempt+1}: ${e.message?.substring(0, 80)}`);
          if (attempt < 2) await new Promise(r => setTimeout(r, 3000));
        }
      }
    });
    await Promise.all(promises);
  }

  fs.writeFileSync('/tmp/fr-es-all.json', JSON.stringify(existing, null, 2));
  console.log('Done! fr:', Object.keys(existing.fr).length, 'es:', Object.keys(existing.es).length);
}
main().catch(e => { console.error('Fatal:', e); process.exit(1); });
