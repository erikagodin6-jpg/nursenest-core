import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  Building2,
  Users,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Mail,
  Copy,
  Eye,
  ChevronRight,
  BarChart3,
  Key,
  Shield,
  UserPlus,
  AlertCircle,
  Trash2,
} from "lucide-react";

/** Paginated admin lists return `{ items, pagination }`; this also accepts legacy bare arrays. */
function normalizeAdminListPayload<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (
    data !== null &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: unknown }).items)
  ) {
    return (data as { items: T[] }).items;
  }
  return [];
}

function adminFetch(url: string, options?: RequestInit) {
  const { t } = useI18n();
  const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-id": creds.adminId || "",
      ...(options?.headers || {}),
    },
  });
}

/** List rows from GET /api/admin/institutions omit some columns; POST create returns full row. */
interface Institution {
  id: string;
  name: string;
  region: string;
  license_model: string;
  seat_limit: number;
  semester_end_date: string | null;
  enrollment_mode: string;
  status: string;
  seatCount?: number;
  career_scope?: string;
  default_duration_days?: number | null;
  tier_level?: string;
  add_ons?: unknown;
  allowed_email_domains?: string[] | null;
  require_email_verified?: boolean;
  created_at?: string;
}

interface Lead {
  id: string;
  institution_name: string;
  program_type: string;
  estimated_student_count: number;
  country: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  message: string;
  region: string;
  status: string;
  created_at: string;
}

interface InviteCode {
  id: string;
  institution_id: string;
  code: string;
  seat_limit: number;
  expires_at: string | null;
  usage_count: number;
}

interface Seat {
  id: string;
  institution_id: string;
  user_id: string;
  role: string;
  access_start: string;
  access_end: string | null;
  active: boolean;
  username?: string;
  email?: string;
}

export default function AdminInstitutions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [seatRequests, setSeatRequests] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);

  const [newInst, setNewInst] = useState({
    name: "",
    region: "CA",
    careerScope: "MULTI",
    licenseModel: "COHORT",
    seatLimit: 50,
    semesterEndDate: "",
    defaultDurationDays: 120,
    tierLevel: "COHORT",
    enrollmentMode: "DOMAIN_LOCK",
    allowedEmailDomains: "",
    requireEmailVerified: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [instRes, leadsRes] = await Promise.all([
        adminFetch("/api/admin/institutions?page=1&limit=100"),
        adminFetch("/api/admin/institution-leads?page=1&limit=100"),
      ]);
      if (instRes.ok) {
        const data = await instRes.json();
        setInstitutions(normalizeAdminListPayload<Institution>(data));
      }
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(normalizeAdminListPayload<Lead>(data));
      }
    } catch (e) {
      console.error("Failed to load institutions data", e);
    }
    setLoading(false);
  };

  const createInstitution = async () => {
    try {
      const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
      const body = {
        name: newInst.name,
        region: newInst.region,
        careerScope: newInst.careerScope,
        licenseModel: newInst.licenseModel,
        seatLimit: newInst.seatLimit,
        semesterEndDate: newInst.semesterEndDate || null,
        defaultDurationDays: newInst.defaultDurationDays,
        tierLevel: newInst.tierLevel,
        enrollmentMode: newInst.enrollmentMode,
        allowedEmailDomains: newInst.allowedEmailDomains ? newInst.allowedEmailDomains.split(",").map(d => d.trim()) : [],
        requireEmailVerified: newInst.requireEmailVerified,
        username: creds.username,
        password: creds.password,
      };
      const res = await adminFetch("/api/admin/institutions", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to create institution");
      toast({ title: "Institution created successfully" });
      setShowCreateModal(false);
      loadData();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const selectInstitution = async (inst: Institution) => {
    setSelectedInstitution(inst);
    setTab("detail");
    try {
      const [seatsRes, codesRes, reqRes, logRes] = await Promise.all([
        fetch(`/api/institutions/${inst.id}/seats`),
        fetch(`/api/institutions/${inst.id}/invite-codes`),
        fetch(`/api/institutions/${inst.id}/seat-requests`),
        fetch(`/api/institutions/${inst.id}/audit-log`),
      ]);
      if (seatsRes.ok) setSeats(await seatsRes.json());
      if (codesRes.ok) {
        const data = await codesRes.json();
        setInviteCodes(Array.isArray(data) ? data : []);
      }
      if (reqRes.ok) setSeatRequests(await reqRes.json());
      if (logRes.ok) setAuditLog(await logRes.json());
    } catch (e) {
      console.error("Error loading institution detail", e);
    }
  };

  const generateInviteCode = async () => {
    if (!selectedInstitution) return;
    try {
      const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
      const res = await fetch(`/api/institutions/${selectedInstitution.id}/invite-codes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatLimit: selectedInstitution.seat_limit,
          expiresAt: selectedInstitution.semester_end_date || null,
          username: creds.username,
          password: creds.password,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const code = await res.json();
      setInviteCodes(prev => [code, ...prev]);
      toast({ title: "Invite code generated" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const decideSeatRequest = async (reqId: string, decision: string) => {
    if (!selectedInstitution) return;
    try {
      const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
      const res = await fetch(`/api/institutions/${selectedInstitution.id}/seat-requests/${reqId}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          reason: "",
          username: creds.username,
          password: creds.password,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: `Request ${decision}` });
      setSeatRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: decision } : r));
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (user?.tier !== "admin") {
    return <div className="min-h-screen flex items-center justify-center"><p>{t("pages.adminInstitutions.accessDenied")}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-institutions-title">{t("pages.adminInstitutions.educationalInstitutions")}</h1>
            <p className="text-gray-600 mt-1">{t("pages.adminInstitutions.manageInstitutionalLicensesSeatsAnd")}</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2" data-testid="button-create-institution">
            <Plus className="w-4 h-4" /> New Institution
          </Button>
        </div>

        {tab === "detail" && selectedInstitution ? (
          <InstitutionDetail
            institution={selectedInstitution}
            seats={seats}
            inviteCodes={inviteCodes}
            seatRequests={seatRequests}
            auditLog={auditLog}
            onBack={() => { setTab("overview"); setSelectedInstitution(null); }}
            onGenerateCode={generateInviteCode}
            onDecideRequest={decideSeatRequest}
          />
        ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="bg-gray-100 rounded-xl p-1 mb-6">
              <TabsTrigger value="overview" className="rounded-lg" data-testid="tab-institutions-overview">{t("pages.adminInstitutions.institutions")}</TabsTrigger>
              <TabsTrigger value="leads" className="rounded-lg" data-testid="tab-institution-leads">
                Leads {leads.filter(l => l.status === "new").length > 0 && <Badge variant="destructive" className="ml-1 text-xs">{leads.filter(l => l.status === "new").length}</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : institutions.length === 0 ? (
                <Card className="border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Building2 className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-4">{t("pages.adminInstitutions.noInstitutionsYet")}</p>
                    <Button onClick={() => setShowCreateModal(true)} variant="outline" className="gap-2" data-testid="button-create-first-institution">
                      <Plus className="w-4 h-4" /> Create First Institution
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {institutions.map(inst => (
                    <Card
                      key={inst.id}
                      className="cursor-pointer hover:shadow-lg transition-all border-none shadow-md"
                      onClick={() => selectInstitution(inst)}
                      data-testid={`card-institution-${inst.id}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{inst.name}</CardTitle>
                          <Badge variant={inst.status === "active" ? "default" : "secondary"} data-testid={`badge-status-${inst.id}`}>
                            {inst.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>{t("pages.adminInstitutions.region")}</span>
                            <span className="font-medium">{inst.region}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("pages.adminInstitutions.seatLimit")}</span>
                            <span className="font-medium">{inst.seat_limit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("pages.adminInstitutions.seatsUsed")}</span>
                            <span className="font-medium">{inst.seatCount || 0} / {inst.seat_limit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("pages.adminInstitutions.licenseModel")}</span>
                            <span className="font-medium">{inst.license_model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("pages.adminInstitutions.enrollment")}</span>
                            <span className="font-medium">{inst.enrollment_mode}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="leads">
              {leads.length === 0 ? (
                <Card className="border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Mail className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">{t("pages.adminInstitutions.noInstitutionalLeadsYet")}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {leads.map(lead => (
                    <Card key={lead.id} className="border-none shadow-sm" data-testid={`card-lead-${lead.id}`}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{lead.institution_name}</h3>
                            <p className="text-sm text-gray-600">{lead.contact_name} - {lead.email}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{lead.program_type}</Badge>
                              <Badge variant="outline">{lead.estimated_student_count} students</Badge>
                              <Badge variant="outline">{lead.country}</Badge>
                            </div>
                            {lead.message && <p className="text-sm text-gray-500 mt-2">{lead.message}</p>}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={lead.status === "new" ? "destructive" : lead.status === "contacted" ? "default" : "secondary"}>
                              {lead.status}
                            </Badge>
                            <span className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{t("pages.adminInstitutions.createNewInstitution")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.adminInstitutions.institutionName")}</label>
                <Input value={newInst.name} onChange={e => setNewInst(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Humber College" data-testid="input-inst-name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.adminInstitutions.region2")}</label>
                  <select value={newInst.region} onChange={e => setNewInst(p => ({ ...p, region: e.target.value }))} className="w-full h-10 rounded-md border px-3 text-sm" data-testid="select-inst-region">
                    <option value="CA">{t("pages.adminInstitutions.canada")}</option>
                    <option value="US">{t("pages.adminInstitutions.unitedStates")}</option>
                    <option value="UK">{t("pages.adminInstitutions.unitedKingdom")}</option>
                    <option value="AU">{t("pages.adminInstitutions.australia")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.adminInstitutions.seatLimit2")}</label>
                  <Input type="number" value={newInst.seatLimit} onChange={e => setNewInst(p => ({ ...p, seatLimit: parseInt(e.target.value) || 50 }))} data-testid="input-inst-seats" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.adminInstitutions.licenseModel2")}</label>
                  <select value={newInst.licenseModel} onChange={e => setNewInst(p => ({ ...p, licenseModel: e.target.value }))} className="w-full h-10 rounded-md border px-3 text-sm" data-testid="select-inst-license">
                    <option value="COHORT">{t("pages.adminInstitutions.cohortSemesterbased")}</option>
                    <option value="ROLLING">{t("pages.adminInstitutions.rollingDurationbased")}</option>
                    <option value="PERPETUAL">{t("pages.adminInstitutions.perpetual")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.adminInstitutions.enrollmentMode")}</label>
                  <select value={newInst.enrollmentMode} onChange={e => setNewInst(p => ({ ...p, enrollmentMode: e.target.value }))} className="w-full h-10 rounded-md border px-3 text-sm" data-testid="select-inst-enrollment">
                    <option value="DOMAIN_LOCK">{t("pages.adminInstitutions.domainLockEmailDomain")}</option>
                    <option value="INVITE_CODE">{t("pages.adminInstitutions.inviteCode")}</option>
                    <option value="ROSTER_UPLOAD">{t("pages.adminInstitutions.rosterUpload")}</option>
                    <option value="OPEN">{t("pages.adminInstitutions.openEnrollment")}</option>
                  </select>
                </div>
              </div>
              {newInst.enrollmentMode === "DOMAIN_LOCK" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.adminInstitutions.allowedEmailDomainsCommaseparated")}</label>
                  <Input value={newInst.allowedEmailDomains} onChange={e => setNewInst(p => ({ ...p, allowedEmailDomains: e.target.value }))} placeholder="e.g. humber.ca, student.humber.ca" data-testid="input-inst-domains" />
                </div>
              )}
              {newInst.licenseModel === "COHORT" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.adminInstitutions.semesterEndDate")}</label>
                  <Input type="date" value={newInst.semesterEndDate} onChange={e => setNewInst(p => ({ ...p, semesterEndDate: e.target.value }))} data-testid="input-inst-semester-end" />
                </div>
              )}
              {newInst.licenseModel === "ROLLING" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.adminInstitutions.accessDurationDays")}</label>
                  <Input type="number" value={newInst.defaultDurationDays} onChange={e => setNewInst(p => ({ ...p, defaultDurationDays: parseInt(e.target.value) || 120 }))} data-testid="input-inst-duration" />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)} data-testid="button-cancel-create">{t("pages.adminInstitutions.cancel")}</Button>
                <Button onClick={createInstitution} disabled={!newInst.name.trim()} data-testid="button-confirm-create">{t("pages.adminInstitutions.createInstitution")}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}

function InstitutionDetail({
  institution,
  seats,
  inviteCodes,
  seatRequests,
  auditLog,
  onBack,
  onGenerateCode,
  onDecideRequest,
}: {
  institution: Institution;
  seats: Seat[];
  inviteCodes: InviteCode[];
  seatRequests: any[];
  auditLog: any[];
  onBack: () => void;
  onGenerateCode: () => void;
  onDecideRequest: (reqId: string, decision: string) => void;
}) {
  const [detailTab, setDetailTab] = useState("seats");
  const { toast } = useToast();
  const activeSeats = seats.filter(s => s.active);
  const pendingRequests = seatRequests.filter(r => r.status === "pending");

  return (
    <div>
      <button onClick={onBack} className="text-sm text-primary hover:underline mb-4 flex items-center gap-1" data-testid="button-back-to-institutions">
        Back to all institutions
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" data-testid="text-institution-name">{institution.name}</h2>
          <p className="text-gray-500">{institution.region} | {institution.license_model} | {institution.enrollment_mode}</p>
        </div>
        <Badge variant={institution.status === "active" ? "default" : "secondary"} className="text-sm px-3 py-1">
          {institution.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-none shadow-sm">
          <CardContent className="pt-4 pb-4 text-center">
            <Users className="w-6 h-6 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{activeSeats.length}</p>
            <p className="text-xs text-gray-500">{t("pages.adminInstitutions.activeSeats")}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-4 pb-4 text-center">
            <Shield className="w-6 h-6 mx-auto text-blue-500 mb-1" />
            <p className="text-2xl font-bold">{institution.seat_limit}</p>
            <p className="text-xs text-gray-500">{t("pages.adminInstitutions.seatLimit3")}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-4 pb-4 text-center">
            <Key className="w-6 h-6 mx-auto text-green-500 mb-1" />
            <p className="text-2xl font-bold">{inviteCodes.length}</p>
            <p className="text-xs text-gray-500">{t("pages.adminInstitutions.inviteCodes")}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-4 pb-4 text-center">
            <AlertCircle className="w-6 h-6 mx-auto text-amber-500 mb-1" />
            <p className="text-2xl font-bold">{pendingRequests.length}</p>
            <p className="text-xs text-gray-500">{t("pages.adminInstitutions.pendingRequests")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={detailTab} onValueChange={setDetailTab}>
        <TabsList className="bg-gray-100 rounded-xl p-1 mb-4">
          <TabsTrigger value="seats" className="rounded-lg" data-testid="tab-seats">Seats ({activeSeats.length})</TabsTrigger>
          <TabsTrigger value="codes" className="rounded-lg" data-testid="tab-codes">{t("pages.adminInstitutions.inviteCodes2")}</TabsTrigger>
          <TabsTrigger value="requests" className="rounded-lg" data-testid="tab-requests">
            Requests {pendingRequests.length > 0 && <Badge variant="destructive" className="ml-1 text-xs">{pendingRequests.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="log" className="rounded-lg" data-testid="tab-audit-log">{t("pages.adminInstitutions.auditLog")}</TabsTrigger>
        </TabsList>

        <TabsContent value="seats">
          {activeSeats.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center text-gray-500">
                No active seats. Generate an invite code or approve seat requests to add students.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {seats.map(seat => (
                <Card key={seat.id} className="border-none shadow-sm" data-testid={`seat-${seat.id}`}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium">{seat.username || seat.email || seat.user_id}</span>
                      <span className="text-sm text-gray-500 ml-2">({seat.role})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {seat.access_end && (
                        <span className="text-xs text-gray-400">
                          Expires: {new Date(seat.access_end).toLocaleDateString()}
                        </span>
                      )}
                      <Badge variant={seat.active ? "default" : "secondary"}>
                        {seat.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="codes">
          <div className="mb-4">
            <Button onClick={onGenerateCode} className="gap-2" data-testid="button-generate-code">
              <Key className="w-4 h-4" /> Generate Invite Code
            </Button>
          </div>
          {inviteCodes.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center text-gray-500">
                No invite codes yet. Generate one to allow students to enroll.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {inviteCodes.map(code => (
                <Card key={code.id} className="border-none shadow-sm" data-testid={`code-${code.id}`}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">{code.code}</code>
                      <button
                        onClick={() => { navigator.clipboard.writeText(code.code); toast({ title: "Code copied" }); }}
                        className="text-gray-400 hover:text-gray-600"
                        data-testid={`button-copy-code-${code.id}`}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>Used: {code.usage_count} / {code.seat_limit}</span>
                      {code.expires_at && <span>Expires: {new Date(code.expires_at).toLocaleDateString()}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests">
          {seatRequests.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center text-gray-500">
                No seat requests yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {seatRequests.map(req => (
                <Card key={req.id} className="border-none shadow-sm" data-testid={`request-${req.id}`}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium">{req.username || req.email || req.user_id}</span>
                      <span className="text-sm text-gray-500 ml-2">{new Date(req.requested_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {req.status === "pending" ? (
                        <>
                          <Button size="sm" variant="outline" className="gap-1 text-green-600 border-green-200 hover:bg-green-50" onClick={() => onDecideRequest(req.id, "approved")} data-testid={`button-approve-${req.id}`}>
                            <CheckCircle2 className="w-3 h-3" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => onDecideRequest(req.id, "rejected")} data-testid={`button-reject-${req.id}`}>
                            <XCircle className="w-3 h-3" /> Reject
                          </Button>
                        </>
                      ) : (
                        <Badge variant={req.status === "approved" ? "default" : "destructive"}>{req.status}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="log">
          {auditLog.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center text-gray-500">
                No audit log entries yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-1">
              {auditLog.map((entry: any) => (
                <div key={entry.id} className="flex items-center gap-3 py-2 border-b border-gray-100 text-sm">
                  <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500">{new Date(entry.created_at).toLocaleString()}</span>
                  <Badge variant="outline" className="text-xs">{entry.action_type}</Badge>
                  <span className="text-gray-600 truncate">{entry.actor_user_id}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
