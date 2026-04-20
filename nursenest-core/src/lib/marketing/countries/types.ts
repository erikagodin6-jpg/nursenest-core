export type CountryCode =
  | "canada"
  | "us"
  | "philippines"
  | "middle-east"
  | "china"
  | "japan"
  | "portugal";

export type NavItem = {
  label: string;
  href: string;
  kind?: "primary" | "secondary" | "cta";
  children?: NavItem[];
};

export type CountryNavConfig = {
  country: CountryCode;
  regionLabel: string;
  heroExamLabel: string;
  primary: NavItem[];
  secondary: NavItem[];
  footerFeatured: NavItem[];
};

export type CountryHomepageContent = {
  headline: string;
  subheadline: string;
  brandLine: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  pathwayCards: Array<{
    title: string;
    href: string;
    description: string;
  }>;
  proofStrip: string[];
  crossBorderCta?: {
    title: string;
    href: string;
    label: string;
  };
};
