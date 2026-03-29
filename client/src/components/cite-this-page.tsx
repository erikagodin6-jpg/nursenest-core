import { useState } from "react";
import { BookOpen, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import {
  generateAPA,
  generateMLA,
  generateChicago,
  generateHarvard,
  type CitationData,
} from "@/lib/citation";

interface CiteThisPageProps {
  title: string;
  author?: string;
  authorCredentials?: string;
  publishedDate?: string;
  updatedDate?: string;
}

export function CiteThisPage({
  title,
  author = "Godin, E.",
  authorCredentials = "RN, BScN",
  publishedDate,
  updatedDate,
}: CiteThisPageProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("apa");
  const { toast } = useToast();

  const url = typeof window !== "undefined" ? window.location.href : "";

  const citationData: CitationData = {
    title,
    author,
    authorCredentials,
    siteName: "NurseNest",
    url,
    publishedDate: publishedDate || null,
    updatedDate: updatedDate || null,
  };

  const citations: Record<string, { label: string; text: string }> = {
    apa: { label: "APA", text: generateAPA(citationData) },
    mla: { label: "MLA", text: generateMLA(citationData) },
    chicago: { label: "Chicago", text: generateChicago(citationData) },
    harvard: { label: "Harvard", text: generateHarvard(citationData) },
  };

  const handleCopy = async () => {
    const text = citations[activeTab].text;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Citation copied!",
        description: `${citations[activeTab].label} citation copied to clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full"
          data-testid="button-cite-this-page"
        >
          <BookOpen className="w-4 h-4" />
          Cite This Page
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid="dialog-cite-this-page">
        <DialogHeader>
          <DialogTitle>{t("components.citeThisPage.citeThisPage")}</DialogTitle>
          <DialogDescription>
            Select a citation format and copy it for your references.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4" data-testid="tabs-citation-formats">
            {Object.entries(citations).map(([key, { label }]) => (
              <TabsTrigger key={key} value={key} data-testid={`tab-${key}`}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(citations).map(([key, { text }]) => (
            <TabsContent key={key} value={key}>
              <div
                className="bg-muted rounded-lg p-4 text-sm leading-relaxed break-words select-all font-mono"
                data-testid={`text-citation-${key}`}
              >
                {text}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <Button
          onClick={handleCopy}
          className="w-full gap-2"
          data-testid="button-copy-citation"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
