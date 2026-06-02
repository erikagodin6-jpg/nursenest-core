import React, { useMemo } from "react";
import { LearningSessionState, getSessionProgress } from "../../lib/adaptive/learning-session";
import { localizeRecommendations } from "../../lib/adaptive/language-aware-adapter";
import { getRecommendations } from "../../lib/adaptive/recommendation-engine";
import { ReviewItem } from "../../lib/adaptive/spaced-repetition";
import { I18nDict, SupportedLocale } from "../../lib/adaptive/language-aware-adapter";

export type AdaptiveDashboardProps = {
  session: LearningSessionState;
  reviews: ReviewItem[];
  dictionaries: Record<SupportedLocale, I18nDict>;
  locale: SupportedLocale;
};

export function AdaptiveDashboard({
  session,
  reviews,
  dictionaries,
  locale,
}: AdaptiveDashboardProps) {
  const progress = useMemo(() => getSessionProgress(session), [session]);

  const recommendations = useMemo(() => {
    return getRecommendations(session.profile, session.queue, reviews);
  }, [session, reviews]);

  const localized = useMemo(() => {
    const itemLookup = Object.fromEntries(session.queue.map(i => [i.id, i]));
    return localizeRecommendations(recommendations, locale, dictionaries, itemLookup);
  }, [recommendations, locale, dictionaries, session.queue]);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2>Adaptive Learning Dashboard</h2>

      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <div>
          <h4>Accuracy</h4>
          <div>{Math.round(progress.accuracy * 100)}%</div>
        </div>

        <div>
          <h4>Total Events</h4>
          <div>{progress.totalEvents}</div>
        </div>

        <div>
          <h4>Due Reviews</h4>
          <div>{progress.dueReviews}</div>
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Weakest Domains</h3>
      <ul>
        {progress.weakestDomains.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>

      <h3 style={{ marginTop: 24 }}>Next Recommendations</h3>
      <ul>
        {localized.slice(0, 5).map((r) => (
          <li key={r.itemId}>
            <strong>{r.domainLabel}</strong> — {r.title} <br />
            <small>{r.reasonLabel}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
