import { HealthcareTestBankPage, metadataForHealthcareTestBankPage } from "@/components/seo/healthcare-test-bank-page";
import { getHealthcareTestBankPageByPath } from "@/lib/seo/healthcare-test-bank-pages";

const PATH = "/canada/np/cnple/test-bank";
const page = getHealthcareTestBankPageByPath(PATH);

export const revalidate = 86400;

export function generateMetadata() {
  return metadataForHealthcareTestBankPage(PATH);
}

export default function CnpleTestBankPage() {
  if (!page) throw new Error(`Missing healthcare test bank page config: ${PATH}`);
  return <HealthcareTestBankPage page={page} />;
}
