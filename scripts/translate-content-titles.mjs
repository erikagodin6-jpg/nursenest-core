import fs from 'fs';

const OPENAI_BASE = 'http://localhost:1106/modelfarm/openai';
const OPENAI_KEY = '_DUMMY_API_KEY_';

const LANG_NAMES = { id: 'Indonesian', th: 'Thai', tr: 'Turkish' };

async function callAI(systemPrompt, userContent) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const resp = await fetch(`${OPENAI_BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
          ],
          temperature: 0.3,
          max_tokens: 16000,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!resp.ok) {
        if (attempt < 2) { await new Promise(r => setTimeout(r, 1000)); continue; }
        return null;
      }
      const data = await resp.json();
      const c = data.choices?.[0]?.message?.content;
      if (!c) return null;
      return JSON.parse(c);
    } catch (e) {
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000));
    }
  }
  return null;
}

async function main() {
  const targetLang = process.argv[2] || 'id';
  const langName = LANG_NAMES[targetLang];
  if (!langName) { console.error(`Unknown lang: ${targetLang}`); process.exit(1); }

  const frContent = JSON.parse(fs.readFileSync('client/src/data/translations/fr.json', 'utf8'));
  const frKeys = Object.keys(frContent);
  const enContent = JSON.parse(fs.readFileSync('scripts/english-content.json', 'utf8'));
  const targetKeys = frKeys.filter(k => enContent[k]);

  const outFile = `client/src/data/translations/${targetLang}.json`;
  let existing = {};
  try { existing = JSON.parse(fs.readFileSync(outFile, 'utf8')); } catch {}

  const missing = targetKeys.filter(k => !existing[k]);
  console.log(`${langName} (${targetLang}): ${missing.length}/${targetKeys.length} to translate`);

  const BATCH = 30;
  let done = 0;

  const systemPrompt = `Translate nursing education titles and overviews to ${langName}. Keep medical abbreviations in English. Return JSON: {"key": {"title": "...", "overview": "..."}}`;

  for (let i = 0; i < missing.length; i += BATCH) {
    const batchKeys = missing.slice(i, i + BATCH);
    const batch = {};
    for (const k of batchKeys) {
      batch[k] = {
        title: enContent[k].title || '',
        overview: (enContent[k].overview || '').substring(0, 300)
      };
    }

    process.stdout.write(`  [${i+1}-${Math.min(i+BATCH, missing.length)}/${missing.length}] `);
    const result = await callAI(systemPrompt, JSON.stringify(batch));

    if (result) {
      for (const k of batchKeys) {
        if (result[k]) {
          existing[k] = {
            title: result[k].title || enContent[k].title,
            overview: result[k].overview || enContent[k].overview,
            pathophysiology: enContent[k].pathophysiology || '',
            ...(enContent[k].diagnostics && { diagnostics: enContent[k].diagnostics }),
            ...(enContent[k].management && { management: enContent[k].management }),
            ...(enContent[k].nursingActions && { nursingActions: enContent[k].nursingActions }),
          };
          done++;
        }
      }
    }
    console.log(result ? `${Object.keys(result).length}/${batchKeys.length} ok` : 'FAILED');
    fs.writeFileSync(outFile, JSON.stringify(existing, null, 2));
  }

  console.log(`Done: ${done} new. Total: ${Object.keys(existing).length}/${targetKeys.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });
