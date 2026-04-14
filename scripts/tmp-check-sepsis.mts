import { getSepsisGoldLessonInput } from "../src/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard.ts";
import { countWords, stripToPlainText } from "../src/lib/content-quality/plain-text.ts";

const l = getSepsisGoldLessonInput("us-rn-nclex-rn");
if (!l) throw new Error("no lesson");
const intro = l.sections.find((x) => x.kind === "introduction")!;
console.log("intro words", countWords(stripToPlainText(intro.body)));
