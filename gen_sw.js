function q(id, stem, options, correctIndex, rationale, difficulty, category, topic) {
  return { id, stem, options, correctIndex, rationale, difficulty, category, topic };
}
let qNum = 1;
function pad(n) { return String(n).padStart(3, '0'); }
function qid() { return "sw-" + pad(qNum++); }

const questions = [];
