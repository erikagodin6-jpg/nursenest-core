import { socialWorkEntries } from "./social-work-encyclopedia-entries";
import { socialWorkEntriesSupplement } from "./social-work-encyclopedia-entries-supplement";

async function importEntries() {
  const baseUrl = process.env.APP_URL || "http://localhost:5000";
  const adminId = process.env.ADMIN_ID || "system";

  const allEntries = [...socialWorkEntries, ...socialWorkEntriesSupplement];
  console.log(`Original entries: ${socialWorkEntries.length}`);
  console.log(`Supplement entries: ${socialWorkEntriesSupplement.length}`);
  console.log(`Total entries to import: ${allEntries.length}`);

  const batchSize = 50;
  let totalImported = 0;
  let totalErrors: string[] = [];

  for (let i = 0; i < allEntries.length; i += batchSize) {
    const batch = allEntries.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    console.log(`\nImporting batch ${batchNum} (${batch.length} entries)...`);

    try {
      const res = await fetch(`${baseUrl}/api/admin/encyclopedia/bulk-import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": adminId,
        },
        body: JSON.stringify({ entries: batch }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`Batch ${batchNum} failed (${res.status}): ${errText.substring(0, 200)}`);
        totalErrors.push(`Batch ${batchNum}: HTTP ${res.status}`);
        continue;
      }

      const result = await res.json();
      console.log(`Batch ${batchNum}: imported=${result.imported}, errors=${result.errors?.length || 0}`);
      totalImported += result.imported || 0;
      if (result.errors?.length) {
        totalErrors.push(...result.errors);
      }
    } catch (err: any) {
      console.error(`Batch ${batchNum} error: ${err.message}`);
      totalErrors.push(`Batch ${batchNum}: ${err.message}`);
    }
  }

  console.log(`\n========== IMPORT COMPLETE ==========`);
  console.log(`Total imported: ${totalImported}`);
  console.log(`Total errors: ${totalErrors.length}`);
  if (totalErrors.length > 0) {
    console.log("Errors:");
    totalErrors.forEach((e) => console.log(`  - ${e}`));
  }
}

importEntries().catch(console.error);
