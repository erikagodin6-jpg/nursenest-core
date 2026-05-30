import { notFound } from "next/navigation";
import { HealthcareTestBankPage, metadataForHealthcareTestBankPage } from "@/components/seo/healthcare-test-bank-page";
import { getHealthcareTestBankPageByPath } from "@/lib/seo/healthcare-test-bank-pages";

const PATH = "/canada/rpn/rex-pn/test-bank";
const page = getHealthcareTestBankPageByPath(PATH);

export const revalidate = 86400;

export function generateMetadata() {
  return metadataForHealthcareTestBankPage(PATH);
}

export default function RexPnTestBankPage() {
  if (!page) notFound();
  return <HealthcareTestBankPage page={page} />;
}
