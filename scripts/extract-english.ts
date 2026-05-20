import { contentMap } from "../client/src/data/lessons/index";
import * as fs from "fs";

const output: Record<string, any> = {};
let total = 0;
let withQuiz = 0;
let withMeds = 0;
let withSigns = 0;
let withDiagnostics = 0;
let withManagement = 0;
let withNursingActions = 0;
let withAssessment = 0;

for (const [key, lesson] of Object.entries(contentMap)) {
  total++;
  const entry: any = { title: lesson.title };
  
  if ((lesson as any).cellular?.content) entry.pathophysiology = (lesson as any).cellular.content;
  if ((lesson as any).lifespan?.content) entry.lifespan = (lesson as any).lifespan.content;
  if (lesson.riskFactors?.length) entry.riskFactors = lesson.riskFactors;
  if (lesson.diagnostics?.length) { entry.diagnostics = lesson.diagnostics; withDiagnostics++; }
  if (lesson.management?.length) { entry.management = lesson.management; withManagement++; }
  if (lesson.nursingActions?.length) { entry.nursingActions = lesson.nursingActions; withNursingActions++; }
  if (lesson.assessmentFindings?.length) { entry.assessmentFindings = lesson.assessmentFindings; withAssessment++; }
  if ((lesson as any).pearls?.length) entry.clinicalPearls = (lesson as any).pearls;
  if (lesson.medications?.length) { entry.medications = lesson.medications; withMeds++; }
  if (lesson.signs) { entry.signs = lesson.signs; withSigns++; }
  if (lesson.quiz?.length) { entry.quiz = lesson.quiz; withQuiz++; }
  if (lesson.preTest?.length) entry.preTest = lesson.preTest;
  if (lesson.postTest?.length) entry.postTest = lesson.postTest;
  
  output[key] = entry;
}

console.log(`Total lessons: ${total}`);
console.log(`With quiz: ${withQuiz}`);
console.log(`With medications: ${withMeds}`);
console.log(`With signs: ${withSigns}`);
console.log(`With diagnostics: ${withDiagnostics}`);
console.log(`With management: ${withManagement}`);
console.log(`With nursingActions: ${withNursingActions}`);
console.log(`With assessmentFindings: ${withAssessment}`);

fs.writeFileSync("/home/runner/workspace/scripts/english-content.json", JSON.stringify(output, null, 2));
console.log("Written to scripts/english-content.json");
