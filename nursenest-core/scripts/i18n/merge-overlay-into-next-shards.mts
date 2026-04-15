/**
 * Applies flat key overlays to `nursenest-core/public/i18n/{locale}/*.json` shard trees.
 * Run after `npm run i18n:compile` so client monolith + Next shards exist.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readMergedBundleFromNextPublicI18n, writeMergedBundleToNextShardTree } from "../../../script/lib/next-public-i18n-bundle";
import { I18N_LANGUAGES } from "../../../script/merge-marketing-i18n";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** `nursenest-core/public/i18n` */
export const NEXT_PUBLIC_I18N_DIR = join(__dirname, "..", "..", "public", "i18n");

export function mergeOverlayIntoNextShards(
  tag: string,
  getOverlay: (locale: string) => Record<string, string>,
): void {
  for (const lang of I18N_LANGUAGES) {
    const bundle = readMergedBundleFromNextPublicI18n(NEXT_PUBLIC_I18N_DIR, lang);
    if (!bundle) {
      throw new Error(`[${tag}] missing Next bundle for ${lang} — run npm run i18n:compile from repo root`);
    }
    const overlay = getOverlay(lang);
    for (const [k, v] of Object.entries(overlay)) {
      bundle[k] = v;
    }
    writeMergedBundleToNextShardTree(NEXT_PUBLIC_I18N_DIR, lang, bundle);
  }
  console.log(`[${tag}] updated ${I18N_LANGUAGES.length} Next locale shard trees.`);
}
