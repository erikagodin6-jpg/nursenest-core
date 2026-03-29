const fs = require('fs');

const LANGUAGES = {
  fr: 'French', tl: 'Tagalog/Filipino', hi: 'Hindi', es: 'Spanish',
  zh: 'Simplified Chinese', ar: 'Arabic', ko: 'Korean', pt: 'Portuguese (Brazilian)',
  pa: 'Punjabi (Gurmukhi)', vi: 'Vietnamese', ht: 'Haitian Creole', ur: 'Urdu',
  ja: 'Japanese', fa: 'Farsi/Persian'
};

async function main() {
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const missingKeys = JSON.parse(fs.readFileSync('/tmp/missing-keys.json', 'utf8'));
  const entries = Object.entries(missingKeys);
  console.log('Total keys:', entries.length);

  const batchSize = 120;
  const batches = [];
  for (let i = 0; i < entries.length; i += batchSize) {
    batches.push(entries.slice(i, i + batchSize));
  }
  console.log('Batches:', batches.length);

  const allTranslations = {};
  for (const lang of Object.keys(LANGUAGES)) allTranslations[lang] = {};

  // Load progress if available
  try {
    const progress = JSON.parse(fs.readFileSync('/tmp/translations-progress2.json', 'utf8'));
    for (const lang of Object.keys(LANGUAGES)) {
      if (progress[lang]) Object.assign(allTranslations[lang], progress[lang]);
    }
    console.log('Loaded progress:', Object.keys(allTranslations.fr).length, 'fr keys');
  } catch {}

  const langCodes = Object.keys(LANGUAGES);

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = Object.fromEntries(batches[bi]);
    const batchKeys = Object.keys(batch);
    
    // Skip batch if already done for all langs
    const allDone = langCodes.every(l => batchKeys.every(k => allTranslations[l][k] && allTranslations[l][k] !== batch[k]));
    if (allDone) {
      console.log(`Batch ${bi+1}/${batches.length}: already done, skipping`);
      continue;
    }
    
    console.log(`\nBatch ${bi+1}/${batches.length}: ${batchKeys.length} keys`);

    // Process 4 languages in parallel
    for (let li = 0; li < langCodes.length; li += 4) {
      const slice = langCodes.slice(li, li + 4);
      const needsTranslation = slice.filter(l => !batchKeys.every(k => allTranslations[l][k] && allTranslations[l][k] !== batch[k]));
      if (needsTranslation.length === 0) continue;
      
      const promises = needsTranslation.map(async (lang) => {
        const langName = LANGUAGES[lang];
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const response = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: `Translate UI strings from English to ${langName} for a nursing education platform. Rules:
- Keep medical accuracy
- Do NOT translate: NurseNest, NCLEX, REX-PN, RPN, RN, NP, LVN, ECG, ABG, PPE, SBAR, ADPIE, AANP, ANCC
- Keep placeholders like {count} exactly as-is
- Return ONLY valid JSON mapping same keys to translations
- No explanations, just the JSON object`
                },
                { role: 'user', content: JSON.stringify(batch) }
              ],
              temperature: 0.2,
              max_tokens: 16000,
            });

            const text = response.choices?.[0]?.message?.content || '{}';
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON');
            const translated = JSON.parse(jsonMatch[0]);
            // Verify it's actually translated (not just English echoed back)
            const sampleKey = batchKeys[0];
            if (translated[sampleKey] === batch[sampleKey] && lang !== 'en') {
              // Might be untranslated, but accept if most keys differ
              const diffCount = batchKeys.filter(k => translated[k] && translated[k] !== batch[k]).length;
              if (diffCount < batchKeys.length * 0.3) {
                throw new Error(`Only ${diffCount}/${batchKeys.length} keys translated`);
              }
            }
            Object.assign(allTranslations[lang], translated);
            console.log(`  ${lang}: ${Object.keys(translated).length} keys`);
            return;
          } catch (e) {
            console.error(`  ${lang} attempt ${attempt+1}: ${e.message?.substring(0, 80)}`);
            if (attempt < 2) await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
          }
        }
        console.error(`  ${lang} FAILED on batch ${bi+1}`);
      });
      await Promise.all(promises);
    }

    fs.writeFileSync('/tmp/translations-progress2.json', JSON.stringify(allTranslations));
    console.log(`  [Progress saved]`);
  }

  fs.writeFileSync('/tmp/translations-complete2.json', JSON.stringify(allTranslations, null, 2));
  console.log('\nDone!');
  for (const lang of langCodes) {
    console.log(`  ${lang}: ${Object.keys(allTranslations[lang]).length} keys`);
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
