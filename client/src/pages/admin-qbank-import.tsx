import { useState, useRef } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Upload, CheckCircle, XCircle, AlertTriangle,
  Loader2, FileText, Download
} from "lucide-react";
import { Link } from "wouter";

import { useI18n } from "@/lib/i18n";
interface ImportQuestion {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  rationale: string;
  category: string;
  difficulty: string;
  exam: string;
  country: string;
  question_type: string;
  client_needs: string;
  topic: string;
  status: string;
}

interface ImportResult {
  success: boolean;
  total: number;
  inserted: number;
  skipped: number;
  validationErrors: { index: number; reason: string }[];
  insertErrors: { index: number; reason: string }[];
}

const SAMPLE_QUESTION: ImportQuestion = {
  question: "A nurse is caring for a client with COPD who becomes restless and confused. What is the priority action?",
  option_a: "Encourage oral fluids",
  option_b: "Assess oxygen saturation",
  option_c: "Provide a warm blanket",
  option_d: "Administer cough suppressant",
  correct_answer: "B",
  rationale: "Restlessness and confusion are early signs of hypoxia. The nurse should assess oxygen saturation immediately because impaired oxygenation takes priority. Oral fluids, blankets, and cough suppressants do not address the immediate risk of respiratory compromise.",
  category: "Respiratory",
  difficulty: "moderate",
  exam: "NCLEX-PN",
  country: "US",
  question_type: "priority",
  client_needs: "Physiological Integrity",
  topic: "COPD exacerbation",
  status: "active"
};

export default function AdminQBankImport() {
  const { t } = useI18n();
  const [jsonText, setJsonText] = useState("");
  const [parsed, setParsed] = useState<ImportQuestion[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [autoPublish, setAutoPublish] = useState(true);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleParse = (text: string) => {
    setJsonText(text);
    setParsed(null);
    setParseError(null);
    setResult(null);

    if (!text.trim()) return;

    try {
      const data = JSON.parse(text);
      let arr: ImportQuestion[];
      if (Array.isArray(data)) {
        arr = data;
      } else if (typeof data === "object" && data !== null) {
        const values = Object.values(data);
        if (values.length > 0 && Array.isArray(values[0])) {
          arr = values.flat() as ImportQuestion[];
        } else if (data.question) {
          arr = [data];
        } else {
          setParseError("Unrecognized format. Expected a JSON array of questions or an object with arrays.");
          return;
        }
      } else {
        setParseError("Expected a JSON array or object");
        return;
      }
      if (arr.length === 0) {
        setParseError("No questions found in the data. Supports flat arrays or batch-keyed objects.");
        return;
      }
      setParsed(arr);
    } catch (e: any) {
      setParseError(`Invalid JSON: ${e.message}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleParse(reader.result as string);
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!parsed) return;
    setImporting(true);
    setResult(null);
    try {
      const res = await adminFetch("/api/admin/qbank/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: parsed, autoPublish }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ success: false, total: parsed.length, inserted: 0, skipped: 0, validationErrors: [{ index: -1, reason: data.error || "Import failed" }], insertErrors: [] });
      } else {
        setResult(data);
      }
    } catch (e: any) {
      setResult({ success: false, total: 0, inserted: 0, skipped: 0, validationErrors: [{ index: -1, reason: e.message }], insertErrors: [] });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([JSON.stringify([SAMPLE_QUESTION], null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "question-import-template.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoryCounts = parsed ? parsed.reduce((acc, q) => {
    const key = q.category || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) : {};

  const examCounts = parsed ? parsed.reduce((acc, q) => {
    const key = q.exam || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) : {};

  const difficultyCounts = parsed ? parsed.reduce((acc, q) => {
    const key = q.difficulty || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) : {};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="sm" data-testid="btn-back-admin">
              <ArrowLeft className="h-4 w-4 mr-1" /> Admin
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#2E3A59]" data-testid="heading-qbank-import">{t("pages.adminQbankImport.questionBankImport")}</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#2E3A59]">{t("pages.adminQbankImport.importQuestions")}</CardTitle>
              <Button variant="outline" size="sm" onClick={downloadTemplate} data-testid="btn-download-template">
                <Download className="h-4 w-4 mr-1" /> Download Template
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <input
                ref={fileRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileRef.current?.click()}
                data-testid="btn-upload-file"
              >
                <Upload className="h-4 w-4 mr-1" /> Upload JSON File
              </Button>
              <span className="text-sm text-gray-500 self-center">{t("pages.adminQbankImport.orPasteJsonBelow")}</span>
            </div>

            <Textarea
              placeholder={'Paste JSON here (flat array or batch-keyed object)...\n[\n  { "question": "...", "option_a": "...", ... }\n]\n\nor\n\n{\n  "american_lvn_batch_1": [...],\n  "canadian_rpn_batch_1": [...]\n}'}
              value={jsonText}
              onChange={e => handleParse(e.target.value)}
              className="font-mono text-xs min-h-[200px]"
              data-testid="textarea-json-input"
            />

            {parseError && (
              <div className="flex items-center gap-2 text-red-600 text-sm" data-testid="text-parse-error">
                <XCircle className="h-4 w-4" /> {parseError}
              </div>
            )}

            {parsed && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-green-700 font-medium" data-testid="text-parse-success">
                    <CheckCircle className="h-4 w-4" /> {parsed.length} question{parsed.length !== 1 ? "s" : ""} parsed successfully
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-[#2E3A59] mb-1">{t("pages.adminQbankImport.byExam")}</p>
                      {Object.entries(examCounts).map(([exam, count]) => (
                        <div key={exam} className="flex justify-between">
                          <span className="text-gray-600">{exam}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-medium text-[#2E3A59] mb-1">{t("pages.adminQbankImport.byCategory")}</p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {Object.entries(categoryCounts).map(([cat, count]) => (
                          <div key={cat} className="flex justify-between">
                            <span className="text-gray-600 text-xs">{cat}</span>
                            <Badge variant="secondary" className="text-xs">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-[#2E3A59] mb-1">{t("pages.adminQbankImport.byDifficulty")}</p>
                      {Object.entries(difficultyCounts).map(([diff, count]) => (
                        <div key={diff} className="flex justify-between">
                          <span className="text-gray-600">{diff}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b sticky top-0">
                      <tr>
                        <th className="p-2 text-left w-8">#</th>
                        <th className="p-2 text-left">{t("pages.adminQbankImport.question")}</th>
                        <th className="p-2 text-left w-20">{t("pages.adminQbankImport.exam")}</th>
                        <th className="p-2 text-left w-20">{t("pages.adminQbankImport.category")}</th>
                        <th className="p-2 text-left w-16">{t("pages.adminQbankImport.diff")}</th>
                        <th className="p-2 text-left w-10">{t("pages.adminQbankImport.ans")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.slice(0, 100).map((q, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="p-2 text-gray-500">{i + 1}</td>
                          <td className="p-2 max-w-xs truncate" title={q.question}>{q.question}</td>
                          <td className="p-2">{q.exam}</td>
                          <td className="p-2 text-gray-600">{q.category}</td>
                          <td className="p-2">{q.difficulty}</td>
                          <td className="p-2 font-mono font-bold">{q.correct_answer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={autoPublish}
                      onCheckedChange={setAutoPublish}
                      id="auto-publish"
                      data-testid="switch-auto-publish"
                    />
                    <Label htmlFor="auto-publish" className="text-sm text-[#2E3A59]">
                      Auto-publish (make questions live immediately)
                    </Label>
                  </div>

                  <Button
                    onClick={handleImport}
                    disabled={importing}
                    className="bg-[#BFA6F6] hover:bg-[#a88de0] text-white"
                    data-testid="btn-import"
                  >
                    {importing ? (
                      <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> {t("pages.adminQbankImport.importing")}</>
                    ) : (
                      <><FileText className="h-4 w-4 mr-1" /> Import {parsed.length} Questions</>
                    )}
                  </Button>
                </div>
              </>
            )}

            {result && (
              <div className={`rounded-lg p-4 border ${result.inserted > 0 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`} data-testid="div-import-result">
                <h3 className="font-medium text-[#2E3A59] mb-2">{t("pages.adminQbankImport.importResults")}</h3>
                <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">{t("pages.adminQbankImport.total")}</span>
                    <p className="text-xl font-bold text-[#2E3A59]">{result.total}</p>
                  </div>
                  <div>
                    <span className="text-green-600">{t("pages.adminQbankImport.inserted")}</span>
                    <p className="text-xl font-bold text-green-700" data-testid="text-inserted-count">{result.inserted}</p>
                  </div>
                  <div>
                    <span className="text-yellow-600">{t("pages.adminQbankImport.skippedDuplicates")}</span>
                    <p className="text-xl font-bold text-yellow-700">{result.skipped}</p>
                  </div>
                  <div>
                    <span className="text-red-600">{t("pages.adminQbankImport.errors")}</span>
                    <p className="text-xl font-bold text-red-700">{result.validationErrors.length + result.insertErrors.length}</p>
                  </div>
                </div>

                {result.validationErrors.length > 0 && (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    <p className="text-xs font-medium text-red-700">{t("pages.adminQbankImport.validationErrors")}</p>
                    {result.validationErrors.map((e, i) => (
                      <div key={i} className="flex gap-2 text-xs text-red-600">
                        <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>Row {e.index + 1}: {e.reason}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#2E3A59] text-base">{t("pages.adminQbankImport.importFormatReference")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-[#2E3A59] mb-1">{t("pages.adminQbankImport.requiredFields")}</p>
                <ul className="space-y-1 list-disc pl-4">
                  <li><code>{t("pages.adminQbankImport.question2")}</code> {t("pages.adminQbankImport.questionStemMin10Chars")}</li>
                  <li><code>option_a</code> through <code>option_d</code> {t("pages.adminQbankImport.all4Required")}</li>
                  <li><code>correct_answer</code> {t("pages.adminQbankImport.aBCOrD")}</li>
                  <li><code>{t("pages.adminQbankImport.rationale")}</code> {t("pages.adminQbankImport.explanationMin20Chars")}</li>
                  <li><code>{t("pages.adminQbankImport.difficulty")}</code> {t("pages.adminQbankImport.easyModerateOrHard")}</li>
                  <li><code>{t("pages.adminQbankImport.exam2")}</code> {t("pages.adminQbankImport.nclexpnRexpnNclexrnAanpAncc")}</li>
                  <li><code>{t("pages.adminQbankImport.country")}</code> {t("pages.adminQbankImport.usOrCanada")}</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-[#2E3A59] mb-1">{t("pages.adminQbankImport.optionalFields")}</p>
                <ul className="space-y-1 list-disc pl-4">
                  <li><code>{t("pages.adminQbankImport.category2")}</code> {t("pages.adminQbankImport.bodySystemClinicalArea")}</li>
                  <li><code>question_type</code> {t("pages.adminQbankImport.standardPriorityDelegationEtc")}</li>
                  <li><code>client_needs</code> {t("pages.adminQbankImport.nclexClientNeedsCategory")}</li>
                  <li><code>{t("pages.adminQbankImport.topic")}</code> {t("pages.adminQbankImport.specificClinicalTopic")}</li>
                  <li><code>{t("pages.adminQbankImport.status")}</code> {t("pages.adminQbankImport.activeDefault")}</li>
                </ul>
                <p className="font-medium text-[#2E3A59] mt-3 mb-1">{t("pages.adminQbankImport.examMapping")}</p>
                <ul className="space-y-1 list-disc pl-4">
                  <li>NCLEX-PN / REx-PN maps to <strong>{t("pages.adminQbankImport.rpnTier")}</strong></li>
                  <li>NCLEX-RN maps to <strong>{t("pages.adminQbankImport.rnTier")}</strong></li>
                  <li>AANP / ANCC maps to <strong>{t("pages.adminQbankImport.npTier")}</strong></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
