import {
  CANADA_NEW_GRAD_MARKETING_HUB_PATH,
  US_NEW_GRAD_MARKETING_HUB_PATH,
} from "@/lib/navigation/marketing-mega-menu-active-prefixes";

export type NewGradMarketingShell = "us" | "canada";

export function newGradMarketingHubBase(shell: NewGradMarketingShell): string {
  return shell === "us" ? US_NEW_GRAD_MARKETING_HUB_PATH : CANADA_NEW_GRAD_MARKETING_HUB_PATH;
}

export function newGradWorkAreaHubPath(shell: NewGradMarketingShell, slug: string): string {
  return `${newGradMarketingHubBase(shell)}/${slug}`;
}
