import type { CasperFeedbackRating } from "@/lib/casper/casper-feedback";

export type CasperBenchmarkBand = {
  percentileLabel: string;
  summary: string;
  rating: CasperFeedbackRating;
};

export const CASPER_BENCHMARK_BANDS: CasperBenchmarkBand[] = [
  {
    percentileLabel: "Top growth zone",
    summary:
      "Responses show balanced professionalism, reflective communication, and strong stakeholder awareness.",
    rating: "strong",
  },
  {
    percentileLabel: "Competitive range",
    summary:
      "Responses demonstrate solid ethical reasoning with opportunities for clearer prioritization.",
    rating: "solid",
  },
  {
    percentileLabel: "Developing range",
    summary:
      "Responses show empathy but need more concise structure and clearer action planning.",
    rating: "developing",
  },
];

export function getBenchmarkBandForRating(
  rating: CasperFeedbackRating,
): CasperBenchmarkBand {
  return (
    CASPER_BENCHMARK_BANDS.find((band) => band.rating === rating) ??
    CASPER_BENCHMARK_BANDS[1]
  );
}
