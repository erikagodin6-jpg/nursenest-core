const fs = require('fs');

const LANGUAGES = {
  fr: 'French',
  tl: 'Tagalog/Filipino',
  hi: 'Hindi',
  es: 'Spanish',
  zh: 'Simplified Chinese',
  ar: 'Arabic',
  ko: 'Korean',
  pt: 'Portuguese (Brazilian)',
  pa: 'Punjabi (Gurmukhi)',
  vi: 'Vietnamese',
  ht: 'Haitian Creole',
  ur: 'Urdu',
  ja: 'Japanese',
  fa: 'Farsi/Persian'
};

async function main() {
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const missingKeys = JSON.parse(fs.readFileSync('/tmp/missing-keys.json', 'utf8'));
  const entries = Object.entries(missingKeys);
  console.log('Total missing keys:', entries.length);

  const batchSize = 80;
  const batches = [];
  for (let i = 0; i < entries.length; i += batchSize) {
    batches.push(entries.slice(i, i + batchSize));
  }
  console.log('Batches:', batches.length);

  const allTranslations = {};
  for (const lang of Object.keys(LANGUAGES)) {
    allTranslations[lang] = {};
  }

  const langCodes = Object.keys(LANGUAGES);

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = Object.fromEntries(batches[bi]);
    console.log(`\nBatch ${bi + 1}/${batches.length}: ${batches[bi].length} keys`);

    for (let li = 0; li < langCodes.length; li += 2) {
      const slice = langCodes.slice(li, li + 2);
      const promises = slice.map(async (lang) => {
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
            if (!jsonMatch) throw new Error('No JSON in response');
            const translated = JSON.parse(jsonMatch[0]);
            Object.assign(allTranslations[lang], translated);
            console.log(`  ${lang}: ${Object.keys(translated).length} keys`);
            return;
          } catch (e) {
            console.error(`  ${lang} attempt ${attempt + 1} failed: ${e.message?.substring(0, 80)}`);
            if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
          }
        }
        console.error(`  ${lang} GIVING UP on batch ${bi + 1}`);
        for (const [k, v] of Object.entries(batch)) {
          allTranslations[lang][k] = v;
        }
      });
      await Promise.all(promises);
    }

    fs.writeFileSync('/tmp/translations-progress.json', JSON.stringify(allTranslations));
    console.log(`  [Saved progress]`);
  }

  fs.writeFileSync('/tmp/translations-complete.json', JSON.stringify(allTranslations, null, 2));
  console.log('\nDone!');
  for (const lang of langCodes) {
    console.log(`  ${lang}: ${Object.keys(allTranslations[lang]).length} keys`);
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
