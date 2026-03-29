import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import {
  Search,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import {
  INFOGRAPHIC_CATALOG,
  INFOGRAPHIC_CATEGORIES,
  getInfographicUrl,
  getInfographicsByCategory,
  type InfographicMeta,
} from "@/lib/infographic-catalog";

function useDocumentMeta(title: string, description: string) {
  const { t } = useI18n();
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = metaDesc?.content || "";
    if (metaDesc) metaDesc.content = description;
    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
    };
  }, [title, description]);
}

function InfographicCard({ info, onClick }: { info: InfographicMeta; onClick: () => void }) {
  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-gray-200 hover:border-[#BFA6F6]"
      onClick={onClick}
      data-testid={`infographic-card-${info.slug}`}
    >
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={getInfographicUrl(info.fileName)}
          alt={info.altText}
          title={info.title}
          loading="lazy"
          decoding="async"
          className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/90 text-[#2E3A59] text-xs shadow-sm">
            {INFOGRAPHIC_CATEGORIES.find(c => c.key === info.category)?.label || info.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm text-[#2E3A59] mb-1 line-clamp-2" data-testid={`text-title-${info.slug}`}>
          {info.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{info.caption}</p>
        <div className="flex flex-wrap gap-1">
          {info.examRelevance.map(exam => (
            <Badge key={exam} variant="outline" className="text-[10px] px-1.5 py-0">{exam}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function InfographicDetail({ info, onBack }: { info: InfographicMeta; onBack: () => void }) {
  useDocumentMeta(
    `${info.title} | NurseNest Infographic Library`,
    info.metaDescription
  );

  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "name": info.title,
      "description": info.metaDescription,
      "contentUrl": `https://nursenest.ca${getInfographicUrl(info.fileName)}`,
      "url": `https://nursenest.ca/infographics/${info.slug}`,
      "width": info.width,
      "height": info.height,
      "caption": info.caption,
      "creator": {
        "@type": "Organization",
        "name": "NurseNest",
        "url": "https://nursenest.ca"
      },
      "copyrightHolder": {
        "@type": "Organization",
        "name": "NurseNest Education Inc."
      },
      "copyrightYear": new Date().getFullYear(),
      "license": "https://nursenest.ca/terms",
      "acquireLicensePage": "https://nursenest.ca/contact",
      "creditText": "NurseNest.ca - Professional Nursing Education",
      "keywords": info.keywords.join(", "),
      "isPartOf": {
        "@type": "CreativeWork",
        "name": "NurseNest Infographic Library",
        "url": "https://nursenest.ca/infographics"
      },
      "educationalLevel": "Professional / Post-Secondary",
      "about": {
        "@type": "MedicalEntity",
        "name": info.title
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    script.id = "infographic-structured-data";
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("infographic-structured-data");
      if (el) el.remove();
    };
  }, [info]);

  return (
    <div data-testid={`infographic-detail-${info.slug}`}>
      <Button variant="ghost" onClick={onBack} className="mb-4 text-gray-600 hover:text-[#2E3A59]" data-testid="button-back">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Library
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <img
              src={getInfographicUrl(info.fileName)}
              alt={info.altText}
              title={info.title}
              loading="lazy"
              className="w-full h-auto"
              data-testid="img-infographic-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-white text-xs">
                Copyright {new Date().getFullYear()} NurseNest Education Inc. All rights reserved. NurseNest.ca
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h1 className="text-2xl font-bold text-[#2E3A59]" data-testid="text-detail-title">{info.title}</h1>
            <p className="text-gray-600 leading-relaxed">{info.blogText}</p>

            <div className="border-t pt-4 space-y-3">
              <h3 className="font-semibold text-sm text-[#2E3A59]">{t("pages.infographicLibrary.relatedStudyResources")}</h3>
              <div className="flex flex-wrap gap-2">
                {info.internalLinks.map(link => (
                  <a
                    key={link}
                    href={link}
                    className="inline-flex items-center gap-1 text-xs text-[#BFA6F6] hover:text-[#A88DE0] underline"
                    data-testid={`link-related-${link.split("/").pop()}`}
                  >
                    <BookOpen className="w-3 h-3" />
                    {link.split("/").pop()?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm text-[#2E3A59]">{t("pages.infographicLibrary.infographicDetails")}</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{t("pages.infographicLibrary.resolution")}</span>
                  <span className="font-medium">{info.width} x {info.height} px</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("pages.infographicLibrary.format")}</span>
                  <span className="font-medium">PNG</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("pages.infographicLibrary.category")}</span>
                  <span className="font-medium">{INFOGRAPHIC_CATEGORIES.find(c => c.key === info.category)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("pages.infographicLibrary.license")}</span>
                  <span className="font-medium">{t("pages.infographicLibrary.educationalUse")}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 pt-2">
                {info.examRelevance.map(exam => (
                  <Badge key={exam} className="bg-[#BFA6F6]/10 text-[#BFA6F6] text-xs">{exam}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm text-[#2E3A59]">{t("pages.infographicLibrary.copyrightAndAttribution")}</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>{t("pages.infographicLibrary.copyrightHolder")}</strong> {t("pages.infographicLibrary.nursenestEducationInc")}</p>
                <p><strong>{t("pages.infographicLibrary.year")}</strong> {new Date().getFullYear()}</p>
                <p><strong>{t("pages.infographicLibrary.brand")}</strong> NurseNest.ca</p>
                <p><strong>{t("pages.infographicLibrary.usage")}</strong> {t("pages.infographicLibrary.educationalPurposesNotForCommercial")}</p>
                <p className="text-[10px] text-gray-400 mt-2">
                  All NurseNest infographics are protected by copyright. Content is provided for personal educational use only.
                  Unauthorized reproduction, distribution, or commercial use is strictly prohibited.
                  For licensing inquiries, contact info@nursenest.ca
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm text-[#2E3A59]">{t("pages.infographicLibrary.keywords")}</h3>
              <div className="flex flex-wrap gap-1">
                {info.keywords.map(kw => (
                  <Badge key={kw} variant="outline" className="text-[10px]">{kw}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm text-[#2E3A59]">{t("pages.infographicLibrary.pinterestSeo")}</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>{t("pages.infographicLibrary.pinTitle")}</strong> {info.pinTitle}</p>
                <p><strong>{t("pages.infographicLibrary.description")}</strong> {info.pinDescription}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {info.hashtags.map(tag => (
                    <span key={tag} className="text-[#BFA6F6] text-[10px]">{tag}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border text-center">
        <p className="text-xs text-gray-500">
          Copyright {new Date().getFullYear()} NurseNest Education Inc. All rights reserved.
          This infographic is the intellectual property of NurseNest.ca and is protected by copyright law.
          Educational use permitted with attribution to NurseNest.ca. Commercial use prohibited without written consent.
        </p>
      </div>
    </div>
  );
}

export default function InfographicLibrary() {
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    const parts = location.split("/");
    if (parts.length === 3 && parts[1] === "infographics" && parts[2]) {
      setSelectedSlug(parts[2]);
    } else {
      setSelectedSlug(null);
    }
  }, [location]);

  useDocumentMeta(
    selectedSlug ? "" : "Nursing Infographic Library | NurseNest.ca",
    "Free nursing education infographics for exam preparation. Lab diagnostics, cardiology, pharmacology, respiratory, emergency, maternity, and clinical skills reference charts."
  );

  useEffect(() => {
    if (selectedSlug) return;
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "NurseNest Infographic Library",
      "description": "Free nursing education infographics for exam preparation.",
      "url": "https://nursenest.ca/infographics",
      "provider": {
        "@type": "Organization",
        "name": "NurseNest Education Inc.",
        "url": "https://nursenest.ca"
      },
      "numberOfItems": INFOGRAPHIC_CATALOG.length,
      "hasPart": INFOGRAPHIC_CATALOG.map(info => ({
        "@type": "ImageObject",
        "name": info.title,
        "contentUrl": `https://nursenest.ca${getInfographicUrl(info.fileName)}`,
        "description": info.metaDescription
      }))
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    script.id = "library-structured-data";
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("library-structured-data");
      if (el) el.remove();
    };
  }, [selectedSlug]);

  const filteredInfos = getInfographicsByCategory(selectedCategory).filter(info => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      info.title.toLowerCase().includes(term) ||
      info.keywords.some(k => k.toLowerCase().includes(term)) ||
      info.caption.toLowerCase().includes(term) ||
      info.category.toLowerCase().includes(term)
    );
  });

  const selectedInfo = selectedSlug
    ? INFOGRAPHIC_CATALOG.find(i => i.slug === selectedSlug)
    : null;

  if (selectedInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <InfographicDetail info={selectedInfo} onBack={() => setLocation("/infographics")} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#BFA6F6]/10 via-white to-[#AEE3E1]/10 border-b">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2E3A59] mb-2" data-testid="page-title-infographic-library">
              Nursing Infographic Library
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional clinical reference charts for nursing exam preparation.
              Lab diagnostics, cardiology, pharmacology, respiratory, emergency medicine, and more.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {INFOGRAPHIC_CATALOG.length} infographics available | Copyright {new Date().getFullYear()} NurseNest Education Inc.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t("pages.infographicLibrary.searchInfographicsEgEcgInsulin")}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
                data-testid="input-search-infographics"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {INFOGRAPHIC_CATEGORIES.map(cat => (
            <Button
              key={cat.key}
              variant={selectedCategory === cat.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.key)}
              className={selectedCategory === cat.key ? "bg-[#BFA6F6] hover:bg-[#A88DE0] text-white" : ""}
              data-testid={`button-category-${cat.key}`}
            >
              {cat.label}
              {cat.key !== "all" && (
                <span className="ml-1 text-xs opacity-70">
                  ({getInfographicsByCategory(cat.key).length})
                </span>
              )}
            </Button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-4" data-testid="text-result-count">
          {filteredInfos.length} infographic{filteredInfos.length !== 1 ? "s" : ""}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>

        {filteredInfos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">{t("pages.infographicLibrary.noInfographicsFoundMatchingYour")}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInfos.map(info => (
              <InfographicCard
                key={info.slug}
                info={info}
                onClick={() => setLocation(`/infographics/${info.slug}`)}
              />
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-white rounded-lg border text-center space-y-2">
          <h2 className="font-semibold text-[#2E3A59]">{t("pages.infographicLibrary.aboutNursenestInfographics")}</h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Every infographic in this library is designed by NurseNest for nursing students preparing for
            REx-PN, NCLEX-PN, and NCLEX-RN licensing exams. Our clinical reference charts follow
            evidence-based guidelines and are reviewed for accuracy.
          </p>
          <p className="text-xs text-gray-400">
            Copyright {new Date().getFullYear()} NurseNest Education Inc. All rights reserved.
            Content is for educational purposes only. Follow your institution's policies and local protocols.
            Not a substitute for professional clinical judgment.
          </p>
        </div>
      </div>
    </div>
  );
}
