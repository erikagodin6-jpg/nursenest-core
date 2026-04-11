import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultLearnerStudyDefaults,
  readLearnerStudyDefaults,
  writeLearnerStudyDefaults,
} from "@/lib/student/learner-study-defaults";

function installLocalStorageMock(seed?: Record<string, string>) {
  const store = new Map(Object.entries(seed ?? {}));
  const mock = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {},
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: mock,
  });

  return store;
}

test("lesson assessment defaults are enabled by default", () => {
  const defaults = defaultLearnerStudyDefaults();
  assert.equal(defaults.lessonAssessments.enabled, true);
});

test("readLearnerStudyDefaults preserves stored lesson assessment preference", () => {
  installLocalStorageMock({
    nn_learner_study_defaults_user_123: JSON.stringify({
      v: 1,
      questionBank: { sessionSize: 20, examShell: false },
      practiceExam: { timedPreferred: false },
      lessonAssessments: { enabled: false },
    }),
  });

  const value = readLearnerStudyDefaults("user_123");
  assert.equal(value.lessonAssessments.enabled, false);
});

test("writeLearnerStudyDefaults persists lesson assessment preference", () => {
  const store = installLocalStorageMock();
  const next = defaultLearnerStudyDefaults();
  next.lessonAssessments.enabled = false;

  writeLearnerStudyDefaults("user_456", next);

  const raw = store.get("nn_learner_study_defaults_user_456");
  assert.ok(raw);
  assert.equal(JSON.parse(raw).lessonAssessments.enabled, false);
});
