import { Share2, Linkedin, Instagram } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/lib/i18n";
interface SocialShareCardsProps {
  title: string;
  description: string;
  url: string;
  tags?: string[];
}

export function SocialShareCards({ title, description, url, tags = [] }: SocialShareCardsProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState<string | null>(null);
  const fullUrl = `https://www.nursenest.ca${url}`;
  const hashtags = tags.slice(0, 5).map(t => `#${t.replace(/\s+/g, "")}`).join(" ");

  const snippets = [
    {
      platform: "LinkedIn",
      icon: Linkedin,
      color: "#0077b5",
      content: `📋 ${title}\n\n${description.slice(0, 200)}${description.length > 200 ? "..." : ""}\n\nRead more: ${fullUrl}\n\n${hashtags} #NewGrad #Healthcare`,
    },
    {
      platform: "Instagram",
      icon: Instagram,
      color: "#E4405F",
      content: `🩺 ${title}\n\n${description.slice(0, 150)}${description.length > 150 ? "..." : ""}\n\n💡 Save this post for your first year!\n\n${hashtags} #NewGradNurse #Healthcare #NurseNest`,
    },
    {
      platform: "Pinterest",
      icon: Share2,
      color: "#BD081C",
      content: `${title} | New Grad Guide | NurseNest\n\n${description.slice(0, 180)}${description.length > 180 ? "..." : ""}\n\n${fullUrl}`,
    },
    {
      platform: "TikTok",
      icon: Share2,
      color: "#000000",
      content: `🎯 ${title}\n\n${description.slice(0, 100)}${description.length > 100 ? "..." : ""}\n\n👉 Link in bio for the full guide!\n\n${hashtags} #NewGrad #HealthcareTikTok`,
    },
  ];

  async function copyToClipboard(text: string, platform: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(platform);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <section className="py-16 bg-gray-50" data-testid="section-social-share">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{t("components.newGradSocialShareCards.shareThisGuide")}</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">{t("components.newGradSocialShareCards.copyTheseReadymadeSnippetsFor")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {snippets.map((snippet) => (
            <div key={snippet.platform} className="bg-white rounded-xl border border-gray-100 p-4" data-testid={`share-card-${snippet.platform.toLowerCase()}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <snippet.icon className="w-4 h-4" style={{ color: snippet.color }} />
                  <span className="text-sm font-semibold text-gray-900">{snippet.platform}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(snippet.content, snippet.platform)}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  data-testid={`button-copy-${snippet.platform.toLowerCase()}`}
                >
                  {copied === snippet.platform ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-gray-500 whitespace-pre-line line-clamp-4">{snippet.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
