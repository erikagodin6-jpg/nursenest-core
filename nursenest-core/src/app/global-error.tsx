import GlobalErrorClient from "./global-error.client";

export const dynamic = "force-dynamic";

export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <GlobalErrorClient {...props} />;
}