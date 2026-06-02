import test from "node:test";
import assert from "node:assert/strict";
import { publicCommunityDeckIsPublishable, viewerCanAccessVerifiedStudyDeck } from "./verified-study-deck-access";

test("viewerCanAccessVerifiedStudyDeck — owner always", () => {
  assert.equal(
    viewerCanAccessVerifiedStudyDeck({
      viewerId: "u1",
      deck: {
        ownerId: "u1",
        visibility: "PRIVATE",
        moderationStatus: "APPROVED",
        verificationStatus: "UNVERIFIED",
        unlistedSlug: null,
      },
      sharesForViewer: [],
      unlistedSlugFromRequest: null,
    }),
    true,
  );
});

test("viewerCanAccessVerifiedStudyDeck — public requires approved + verified", () => {
  assert.equal(
    viewerCanAccessVerifiedStudyDeck({
      viewerId: "u2",
      deck: {
        ownerId: "u1",
        visibility: "PUBLIC",
        moderationStatus: "PENDING",
        verificationStatus: "UNVERIFIED",
        unlistedSlug: null,
      },
      sharesForViewer: [],
      unlistedSlugFromRequest: null,
    }),
    false,
  );
  assert.equal(
    viewerCanAccessVerifiedStudyDeck({
      viewerId: "u2",
      deck: {
        ownerId: "u1",
        visibility: "PUBLIC",
        moderationStatus: "APPROVED",
        verificationStatus: "VERIFIED",
        unlistedSlug: null,
      },
      sharesForViewer: [],
      unlistedSlugFromRequest: null,
    }),
    true,
  );
});

test("viewerCanAccessVerifiedStudyDeck — unlisted slug", () => {
  assert.equal(
    viewerCanAccessVerifiedStudyDeck({
      viewerId: "u9",
      deck: {
        ownerId: "u1",
        visibility: "UNLISTED",
        moderationStatus: "APPROVED",
        verificationStatus: "UNVERIFIED",
        unlistedSlug: "secret",
      },
      sharesForViewer: [],
      unlistedSlugFromRequest: "secret",
    }),
    true,
  );
});

test("publicCommunityDeckIsPublishable enforces pending review + verified cards + refs", () => {
  const bad = publicCommunityDeckIsPublishable(
    { visibility: "PUBLIC", moderationStatus: "APPROVED" },
    [{ verificationStatus: "VERIFIED", referencesJson: [{ url: "https://www.cdc.gov/hypertension/facts.htm" }] }],
  );
  assert.equal(bad.ok, false);

  const ok = publicCommunityDeckIsPublishable(
    { visibility: "PUBLIC", moderationStatus: "PENDING" },
    [{ verificationStatus: "VERIFIED", referencesJson: [{ url: "https://www.cdc.gov/hypertension/facts.htm" }] }],
  );
  assert.equal(ok.ok, true);
});
