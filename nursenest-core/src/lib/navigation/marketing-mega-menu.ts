/**
 * Marketing header mega-menus — all user-visible strings resolve through marketing i18n (`t`).
 * @see SiteHeader
 */

import { ALLIED_HUB_CATEGORY_ORDER, ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import {
  alliedHub,
  HUB,
  NP,
  npNpQuestionsForRegion,
  pnLessons,
  pnQuestions,
  rnLessons,
  rnQuestions,
  signupWithCallback,
} from "@/lib/marketing/marketing-entry-routes";
import { publicMarketingCatHrefForOffering } from "@/lib/marketing/marketing-exam-navigation";
import { publicExamPrepHubDestinations } from "@/lib/navigation/canonical-destinations";
import type { MarketingPathwayMegaMenuKey } from "@/lib/navigation/marketing-mega-menu-active-prefixes";
import { publicNewGradStudyDestinations } from "@/lib/navigation/marketing-pathway-nav-destinations";

export type ExamMenuKey = MarketingPathwayMegaMenuKey;

export type MegaMenuLink = {
  key: string;
  label: string;
  href: string;
};

export type MegaMenuGroup = {
  key: string;
  heading: string;
  links: MegaMenuLink[];
};

export type MegaMenuConfig = {
  key: ExamMenuKey;
  label: string;
  hubHref: string;
  hubDescription: string;
  groups: MegaMenuGroup[];
  hubBadge?: string;
};

type TFn = (key: string) => string;

export function buildMarketingMegaMenus(region: "US" | "CA", t: TFn): MegaMenuConfig[] {
  const hubs = publicExamPrepHubDestinations(region);
  const rnHub = hubs.rn;
  const pnHub = hubs.pn;
  const npHub = hubs.np;
  const alliedHubHref = alliedHub(region);
  const npLessons = region === "US" ? NP.fnpLessons : NP.caNpLessons;
  const npQuestionHref = npNpQuestionsForRegion(region);
  const studyPlanSignupHref = signupWithCallback("/pre-nursing/study-plan");
  const newGrad = publicNewGradStudyDestinations(region, rnHub);
  const newGradStudyPlanHref = signupWithCallback(newGrad.lessons);

  const gl = () => t("nav.mega.group.learn");
  const gp = () => t("nav.mega.group.practice");
  const gt = () => t("nav.mega.group.studyTools");
  const ll = () => t("nav.mega.link.lessons");
  const lf = () => t("nav.mega.link.flashcards");
  const lq = () => t("nav.mega.link.practiceQuestions");
  const lcat = () => t("nav.mega.link.catReadiness");
  const lplan = () => t("nav.mega.link.buildStudyPlan");
  const lex = () => t("nav.mega.link.practiceExams");
  const lhow = () => t("nav.mega.link.howItWorks");

  return [
    {
      key: "rn",
      label: t("nav.mega.rn.label"),
      hubHref: rnHub,
      hubDescription: t("nav.mega.rn.hubDescription"),
      groups: [
        {
          key: "learn",
          heading: gl(),
          links: [
            { key: "rn-lessons", label: ll(), href: rnLessons(region) },
            { key: "rn-flashcards", label: lf(), href: HUB.flashcards },
          ],
        },
        {
          key: "practice",
          heading: gp(),
          links: [
            { key: "rn-questions", label: lq(), href: rnQuestions(region) },
            { key: "rn-readiness", label: lcat(), href: publicMarketingCatHrefForOffering(region, "rn") },
          ],
        },
        {
          key: "tools",
          heading: gt(),
          links: [{ key: "rn-study-plan", label: lplan(), href: studyPlanSignupHref }],
        },
      ],
    },
    {
      key: "pn",
      label: region === "US" ? t("nav.mega.pn.labelUS") : t("nav.mega.pn.labelCA"),
      hubHref: pnHub,
      hubDescription: t("nav.mega.pn.hubDescription"),
      hubBadge: region === "CA" ? t("nav.mega.pn.badgeCA") : t("nav.mega.pn.badgeUS"),
      groups: [
        {
          key: "learn",
          heading: gl(),
          links: [
            { key: "pn-lessons", label: ll(), href: pnLessons(region) },
            { key: "pn-flashcards", label: lf(), href: HUB.flashcards },
          ],
        },
        {
          key: "practice",
          heading: gp(),
          links: [
            { key: "pn-questions", label: lq(), href: pnQuestions(region) },
            { key: "pn-readiness", label: lcat(), href: publicMarketingCatHrefForOffering(region, "pn") },
          ],
        },
        {
          key: "tools",
          heading: gt(),
          links: [{ key: "pn-study-plan", label: lplan(), href: studyPlanSignupHref }],
        },
      ],
    },
    {
      key: "np",
      label: t("nav.mega.np.label"),
      hubHref: npHub,
      hubDescription: t("nav.mega.np.hubDescription"),
      hubBadge: region === "CA" ? t("nav.mega.np.badgeCA") : t("nav.mega.np.badgeUS"),
      groups: [
        {
          key: "learn",
          heading: gl(),
          links: [
            { key: "np-lessons", label: ll(), href: npLessons },
            { key: "np-flashcards", label: lf(), href: HUB.flashcards },
          ],
        },
        {
          key: "practice",
          heading: gp(),
          links: [
            { key: "np-questions", label: lq(), href: npQuestionHref },
            { key: "np-readiness", label: lcat(), href: publicMarketingCatHrefForOffering(region, "np") },
          ],
        },
        {
          key: "tools",
          heading: gt(),
          links: [{ key: "np-study-plan", label: lplan(), href: studyPlanSignupHref }],
        },
      ],
    },
    {
      key: "newgrad",
      label: t("nav.mega.newGrad.label"),
      hubHref: newGrad.hubHref,
      hubDescription: t("nav.mega.newGrad.hubDescription"),
      groups: [
        {
          key: "learn",
          heading: gl(),
          links: [
            { key: "ng-lessons", label: ll(), href: newGrad.lessons },
            { key: "ng-flashcards", label: lf(), href: newGrad.flashcards },
          ],
        },
        {
          key: "practice",
          heading: gp(),
          links: [
            { key: "ng-questions", label: lq(), href: newGrad.questions },
            { key: "ng-exams", label: lex(), href: newGrad.practiceExams },
            { key: "ng-readiness", label: lcat(), href: newGrad.cat },
          ],
        },
        {
          key: "tools",
          heading: gt(),
          links: [
            { key: "ng-study-plan", label: lplan(), href: newGradStudyPlanHref },
            { key: "ng-how", label: lhow(), href: newGrad.howItWorks },
          ],
        },
      ],
    },
    {
      key: "allied",
      label: t("nav.mega.allied.label"),
      hubHref: alliedHubHref,
      hubDescription: t("nav.mega.allied.hubDescription"),
      groups: ALLIED_HUB_CATEGORY_ORDER.map((catId) => {
        const profs = ALLIED_PROFESSIONS.filter((p) => p.hubCategory === catId);
        return {
          key: `allied-cat-${catId}`,
          heading: t(`nav.mega.allied.category.${catId}`),
          links: profs.map((p) => ({
            key: `allied-${p.professionKey}`,
            label: p.h1.replace(/ exam prep$/i, "").replace(/ \(.*\)$/i, "").trim(),
            href: `/allied/${p.professionKey}`,
          })),
        };
      }),
    },
  ];
}
