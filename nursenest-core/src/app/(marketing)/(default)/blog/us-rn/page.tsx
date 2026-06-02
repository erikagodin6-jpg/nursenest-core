import { redirect } from "next/navigation";

/**
 * Country selection is now a global preference (see CountryPreferenceRoot / country-selector-dropdown).
 * This hub index redirects to the main blog; article detail pages under /blog/us-rn/[slug]
 * continue to serve their canonical URLs unchanged.
 */
export const revalidate = false;

export default function BlogUsRnHubPage() {
  redirect("/blog");
}
