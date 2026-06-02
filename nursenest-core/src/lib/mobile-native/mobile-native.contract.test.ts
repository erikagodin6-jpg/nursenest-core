import assert from "node:assert/strict";
import { test } from "node:test";
import { MobileNativeNotificationChannel } from "./push-notifications";

test("mobile-native barrel exports enums and types compile", () => {
  assert.equal(MobileNativeNotificationChannel.StudyStreak, "study_streak");
});
