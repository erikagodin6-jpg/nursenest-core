import fs from 'fs';

const OPENAI_BASE = 'http://localhost:1106/modelfarm/openai';
const OPENAI_KEY = '_DUMMY_API_KEY_';

async function callAI(systemPrompt, userContent) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);
      const resp = await fetch(`${OPENAI_BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
          ],
          temperature: 0.2,
          max_tokens: 16000,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!resp.ok) {
        console.error(`API error ${resp.status}`);
        if (attempt < 2) { await new Promise(r => setTimeout(r, 2000)); continue; }
        return null;
      }
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) return null;
      return JSON.parse(content);
    } catch (e) {
      console.error(`Error: ${e.message?.substring(0, 80)}`);
      if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

async function main() {
  const zhContent = JSON.parse(fs.readFileSync('client/src/data/translations/zh.json', 'utf8'));
  const zhtwFile = 'client/src/data/translations/zh-tw.json';
  let zhtwContent = {};
  try { zhtwContent = JSON.parse(fs.readFileSync(zhtwFile, 'utf8')); } catch {}

  const keys = Object.keys(zhContent).filter(k => !zhtwContent[k]);
  console.log(`Converting ${keys.length} lessons from Simplified to Traditional Chinese...`);

  const BATCH = 5;
  for (let i = 0; i < keys.length; i += BATCH) {
    const batchKeys = keys.slice(i, i + BATCH);
    const batch = {};
    for (const k of batchKeys) batch[k] = zhContent[k];

    const batchStr = JSON.stringify(batch);
    if (batchStr.length > 60000) {
      for (const k of batchKeys) {
        process.stdout.write(`  Converting ${k}... `);
        const singleBatch = { [k]: zhContent[k] };
        const result = await callAI(
          'Convert all Simplified Chinese text to Traditional Chinese (Taiwan). Keep all JSON structure, keys, English terms, and medical abbreviations unchanged. Return the same JSON structure with Traditional Chinese text.',
          JSON.stringify(singleBatch)
        );
        if (result && result[k]) {
          zhtwContent[k] = result[k];
          console.log('ok');
        } else {
          console.log('FAILED');
        }
      }
    } else {
      process.stdout.write(`  Batch ${Math.floor(i/BATCH)+1}/${Math.ceil(keys.length/BATCH)} (${batchKeys.length} lessons)... `);
      const result = await callAI(
        'Convert all Simplified Chinese text to Traditional Chinese (Taiwan). Keep all JSON structure, keys, English terms, and medical abbreviations unchanged. Return the same JSON structure with Traditional Chinese text.',
        JSON.stringify(batch)
      );
      if (result) {
        for (const k of batchKeys) {
          if (result[k]) zhtwContent[k] = result[k];
        }
        console.log(`${Object.keys(result).length}/${batchKeys.length} ok`);
      } else {
        console.log('FAILED');
      }
    }

    fs.writeFileSync(zhtwFile, JSON.stringify(zhtwContent, null, 2));
  }

  console.log(`Done. ${Object.keys(zhtwContent).length} lessons in zh-tw.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
