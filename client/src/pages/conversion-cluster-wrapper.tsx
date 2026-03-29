import ConversionClusterPage from "./conversion-cluster-page";
import { clusterPages } from "@/data/conversion-cluster-data";
import { useLocation, Redirect } from "wouter";

export default function ConversionClusterWrapper() {
  const [location] = useLocation();
  const segments = location.replace(/^\//, "").split("/");
  const slug = segments.length > 1 ? segments[segments.length - 1] : segments[0];
  const data = clusterPages[slug];

  if (!data) {
    return <Redirect to="/si-to-conventional-units-converter" />;
  }

  return <ConversionClusterPage data={data} />;
}
