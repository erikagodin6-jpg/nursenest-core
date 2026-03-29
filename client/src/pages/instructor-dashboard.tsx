import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  Building2, Users, BookOpen, BarChart3, Plus, Search, Loader2, ChevronRight,
  GraduationCap, ClipboardList, Award, TrendingUp, TrendingDown, Target,
  Clock, CheckCircle2, XCircle, Upload, Mail, ArrowLeft, UserPlus, FileText,
  Calendar, Percent, Eye, AlertTriangle, Download,
} from "lucide-react";

function authFetch(url: string, options?: RequestInit) {
  const { t } = useI18n();
  const token = localStorage.getItem("nursenest-token") || "";
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers || {}),
    },
  });
}

interface InstitutionInfo {
  id: string;
  name: string;
  role: string;
  seatLimit: number;
  status: string;
}

export default function InstructorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState<InstitutionInfo[]>([]);
  const [selectedInst, setSelectedInst] = useState<InstitutionInfo | null>(null);
  const [tab, setTab] = useState("classrooms");

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/institutions/my-institutions");
      if (res.ok) {
        const data = await res.json();
        const instructorInsts = data.filter((d: any) => d.role === "instructor" || user?.tier === "admin");
        setInstitutions(instructorInsts);
        if (instructorInsts.length === 1) setSelectedInst(instructorInsts[0]);
      }
    } catch (e) {
      console.error("Failed to load institutions", e);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-login-required">{t("pages.instructorDashboard.loginRequired")}</h1>
          <p className="text-gray-600">{t("pages.instructorDashboard.pleaseLogInToAccess")}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation />
        <main className="flex justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!selectedInst) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-instructor-title">{t("pages.instructorDashboard.instructorDashboard")}</h1>
          <p className="text-gray-600 mb-8">{t("pages.instructorDashboard.selectAnInstitutionToManage")}</p>
          {institutions.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-16 text-center">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg" data-testid="text-no-institutions">{t("pages.instructorDashboard.youAreNotAssignedAs")}</p>
                <p className="text-gray-400 text-sm mt-2">{t("pages.instructorDashboard.contactYourAdministratorToBe")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {institutions.map(inst => (
                <Card key={inst.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedInst(inst)} data-testid={`card-select-institution-${inst.id}`}>
                  <CardContent className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{inst.name}</h3>
                        <p className="text-sm text-gray-500">Role: {inst.role}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {institutions.length > 1 && (
          <button onClick={() => setSelectedInst(null)} className="text-sm text-primary hover:underline mb-4 flex items-center gap-1" data-testid="button-back-institutions">
            <ArrowLeft className="w-4 h-4" /> Switch Institution
          </button>
        )}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-dashboard-title">{t("pages.instructorDashboard.instructorDashboard2")}</h1>
            <p className="text-gray-600 mt-1">{selectedInst.name}</p>
          </div>
          <Badge variant="default" className="text-sm px-3 py-1">{selectedInst.status}</Badge>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-gray-100 rounded-xl p-1 mb-6 flex-wrap">
            <TabsTrigger value="classrooms" className="rounded-lg gap-1" data-testid="tab-classrooms"><Users className="w-4 h-4" /> {t("pages.instructorDashboard.classrooms")}</TabsTrigger>
            <TabsTrigger value="assignments" className="rounded-lg gap-1" data-testid="tab-assignments"><ClipboardList className="w-4 h-4" /> {t("pages.instructorDashboard.assignments")}</TabsTrigger>
            <TabsTrigger value="students" className="rounded-lg gap-1" data-testid="tab-student-progress"><Target className="w-4 h-4" /> {t("pages.instructorDashboard.studentProgress")}</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg gap-1" data-testid="tab-analytics"><BarChart3 className="w-4 h-4" /> {t("pages.instructorDashboard.analytics")}</TabsTrigger>
            <TabsTrigger value="enrollment" className="rounded-lg gap-1" data-testid="tab-enrollment"><UserPlus className="w-4 h-4" /> {t("pages.instructorDashboard.enrollment")}</TabsTrigger>
            <TabsTrigger value="certificates" className="rounded-lg gap-1" data-testid="tab-certificates"><Award className="w-4 h-4" /> {t("pages.instructorDashboard.certificates")}</TabsTrigger>
            <TabsTrigger value="benchmarking" className="rounded-lg gap-1" data-testid="tab-benchmarking"><TrendingUp className="w-4 h-4" /> {t("pages.instructorDashboard.benchmarking")}</TabsTrigger>
          </TabsList>

          <TabsContent value="classrooms">
            <ClassroomsTab institutionId={selectedInst.id} />
          </TabsContent>
          <TabsContent value="assignments">
            <AssignmentsTab institutionId={selectedInst.id} />
          </TabsContent>
          <TabsContent value="students">
            <StudentProgressTab institutionId={selectedInst.id} />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab institutionId={selectedInst.id} />
          </TabsContent>
          <TabsContent value="enrollment">
            <EnrollmentTab institutionId={selectedInst.id} />
          </TabsContent>
          <TabsContent value="certificates">
            <CertificatesTab institutionId={selectedInst.id} />
          </TabsContent>
          <TabsContent value="benchmarking">
            <BenchmarkingTab institutionId={selectedInst.id} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

function ClassroomsTab({ institutionId }: { institutionId: string }) {
  const { toast } = useToast();
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => { loadClassrooms(); }, [institutionId]);

  const loadClassrooms = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/institutions/${institutionId}/classrooms`);
      if (res.ok) setClassrooms(await res.json());
    } catch {}
    setLoading(false);
  };

  const createClassroom = async () => {
    if (!newName.trim()) return;
    try {
      const res = await authFetch(`/api/institutions/${institutionId}/classrooms`, {
        method: "POST",
        body: JSON.stringify({ name: newName, description: newDesc }),
      });
      if (res.ok) {
        toast({ title: "Classroom created" });
        setShowCreate(false);
        setNewName("");
        setNewDesc("");
        loadClassrooms();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const viewStudents = async (classroom: any) => {
    setSelectedClassroom(classroom);
    try {
      const res = await authFetch(`/api/institutions/${institutionId}/classrooms/${classroom.id}/students`);
      if (res.ok) setStudents(await res.json());
    } catch {}
  };

  if (selectedClassroom) {
    return (
      <div>
        <button onClick={() => setSelectedClassroom(null)} className="text-sm text-primary hover:underline mb-4 flex items-center gap-1" data-testid="button-back-classrooms">
          <ArrowLeft className="w-4 h-4" /> Back to Classrooms
        </button>
        <h2 className="text-xl font-bold mb-4" data-testid="text-classroom-name">{selectedClassroom.name}</h2>
        {selectedClassroom.description && <p className="text-gray-600 mb-4">{selectedClassroom.description}</p>}
        <h3 className="font-semibold text-gray-700 mb-3">Students ({students.length})</h3>
        {students.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-8 text-center text-gray-500">
              No students enrolled in this classroom yet. Add students from the Enrollment tab.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {students.map(s => (
              <Card key={s.id} className="border-none shadow-sm" data-testid={`student-${s.userId}`}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-medium">{s.username || s.email || s.userId}</span>
                  </div>
                  <span className="text-xs text-gray-400">Enrolled: {new Date(s.enrolledAt).toLocaleDateString()}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t("pages.instructorDashboard.classroomGroups")}</h2>
        <Button onClick={() => setShowCreate(true)} className="gap-2" data-testid="button-create-classroom">
          <Plus className="w-4 h-4" /> New Classroom
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : classrooms.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2" data-testid="text-no-classrooms">{t("pages.instructorDashboard.noClassroomsYet")}</p>
            <p className="text-gray-400 text-sm mb-4">{t("pages.instructorDashboard.createYourFirstClassroomGroup")}</p>
            <Button variant="outline" onClick={() => setShowCreate(true)} className="gap-2" data-testid="button-create-first-classroom">
              <Plus className="w-4 h-4" /> Create Classroom
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map(c => (
            <Card key={c.id} className="cursor-pointer hover:shadow-lg transition-all border-none shadow-md" onClick={() => viewStudents(c)} data-testid={`card-classroom-${c.id}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{c.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  {c.description && <p className="text-gray-500">{c.description}</p>}
                  <div className="flex justify-between">
                    <span>{t("pages.instructorDashboard.students")}</span>
                    <span className="font-medium">{c.studentCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("pages.instructorDashboard.created")}</span>
                    <span className="font-medium">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
            <CardHeader><CardTitle>{t("pages.instructorDashboard.createClassroom")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.instructorDashboard.classroomName")}</label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder='e.g. "Radiography Cohort 2026"' data-testid="input-classroom-name" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.instructorDashboard.descriptionOptional")}</label>
                <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder={t("pages.instructorDashboard.briefDescription")} data-testid="input-classroom-desc" />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreate(false)} data-testid="button-cancel-classroom">{t("pages.instructorDashboard.cancel")}</Button>
                <Button onClick={createClassroom} disabled={!newName.trim()} data-testid="button-confirm-classroom">{t("pages.instructorDashboard.create")}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function AssignmentsTab({ institutionId }: { institutionId: string }) {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [form, setForm] = useState({ classroomId: "", title: "", description: "", type: "lesson", resourceId: "", dueDate: "" });

  useEffect(() => {
    Promise.all([
      authFetch(`/api/institutions/${institutionId}/assignments`).then(r => r.ok ? r.json() : []),
      authFetch(`/api/institutions/${institutionId}/classrooms`).then(r => r.ok ? r.json() : []),
    ]).then(([a, c]) => {
      setAssignments(a);
      setClassrooms(c);
      setLoading(false);
    });
  }, [institutionId]);

  const createAssignment = async () => {
    if (!form.classroomId || !form.title) return;
    try {
      const res = await authFetch(`/api/institutions/${institutionId}/assignments`, {
        method: "POST",
        body: JSON.stringify({
          classroomId: form.classroomId,
          title: form.title,
          description: form.description || null,
          type: form.type,
          resourceId: form.resourceId || null,
          dueDate: form.dueDate || null,
        }),
      });
      if (res.ok) {
        toast({ title: "Assignment created" });
        setShowCreate(false);
        setForm({ classroomId: "", title: "", description: "", type: "lesson", resourceId: "", dueDate: "" });
        const updatedRes = await authFetch(`/api/institutions/${institutionId}/assignments`);
        if (updatedRes.ok) setAssignments(await updatedRes.json());
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const viewSubmissions = async (assignment: any) => {
    setSelectedAssignment(assignment);
    try {
      const res = await authFetch(`/api/institutions/${institutionId}/assignments/${assignment.id}/submissions`);
      if (res.ok) setSubmissions(await res.json());
    } catch {}
  };

  if (selectedAssignment) {
    return (
      <div>
        <button onClick={() => setSelectedAssignment(null)} className="text-sm text-primary hover:underline mb-4 flex items-center gap-1" data-testid="button-back-assignments">
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </button>
        <h2 className="text-xl font-bold mb-1" data-testid="text-assignment-title">{selectedAssignment.title}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {selectedAssignment.classroomName} | Type: {selectedAssignment.type}
          {selectedAssignment.dueDate && ` | Due: ${new Date(selectedAssignment.dueDate).toLocaleDateString()}`}
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold">{submissions.length}</p>
              <p className="text-xs text-gray-500">{t("pages.instructorDashboard.totalStudents")}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold text-green-600">{submissions.filter(s => s.status === "completed").length}</p>
              <p className="text-xs text-gray-500">{t("pages.instructorDashboard.completed")}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold">
                {submissions.filter(s => s.score != null).length > 0
                  ? Math.round(submissions.filter(s => s.score != null).reduce((sum, s) => sum + s.score, 0) / submissions.filter(s => s.score != null).length) + "%"
                  : "—"}
              </p>
              <p className="text-xs text-gray-500">{t("pages.instructorDashboard.avgScore")}</p>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-2">
          {submissions.map(sub => (
            <Card key={sub.id} className="border-none shadow-sm" data-testid={`submission-${sub.id}`}>
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">{sub.username || sub.email || sub.studentId}</span>
                </div>
                <div className="flex items-center gap-3">
                  {sub.score != null && <Badge variant="outline">{sub.score}%</Badge>}
                  {sub.timeSpent != null && <span className="text-xs text-gray-400">{Math.round(sub.timeSpent / 60)} min</span>}
                  <Badge variant={sub.status === "completed" ? "default" : sub.status === "in_progress" ? "secondary" : "outline"}>
                    {sub.status === "not_started" ? "Not Started" : sub.status === "in_progress" ? "In Progress" : "Completed"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t("pages.instructorDashboard.assignments2")}</h2>
        <Button onClick={() => setShowCreate(true)} className="gap-2" disabled={classrooms.length === 0} data-testid="button-create-assignment">
          <Plus className="w-4 h-4" /> New Assignment
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : assignments.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2" data-testid="text-no-assignments">{t("pages.instructorDashboard.noAssignmentsYet")}</p>
            <p className="text-gray-400 text-sm">{classrooms.length === 0 ? "Create a classroom first, then add assignments." : "Create assignments for your students."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => (
            <Card key={a.id} className="cursor-pointer hover:shadow-md transition-all border-none shadow-sm" onClick={() => viewSubmissions(a)} data-testid={`card-assignment-${a.id}`}>
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{a.classroomName}</Badge>
                    <Badge variant="outline">{a.type}</Badge>
                    {a.dueDate && <Badge variant="secondary"><Calendar className="w-3 h-3 mr-1" />{new Date(a.dueDate).toLocaleDateString()}</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-sm">
                    <p className="font-medium">{a.completedCount || 0}/{a.submissionCount || 0}</p>
                    <p className="text-xs text-gray-400">{t("pages.instructorDashboard.completed2")}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <Card className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <CardHeader><CardTitle>{t("pages.instructorDashboard.createAssignment")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.instructorDashboard.classroom")}</label>
                <select
                  value={form.classroomId}
                  onChange={e => setForm(p => ({ ...p, classroomId: e.target.value }))}
                  className="w-full h-10 rounded-md border px-3 text-sm"
                  data-testid="select-assignment-classroom"
                >
                  <option value="">{t("pages.instructorDashboard.selectClassroom")}</option>
                  {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.instructorDashboard.title")}</label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Week 3 Practice Exam" data-testid="input-assignment-title" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.instructorDashboard.descriptionOptional2")}</label>
                <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} data-testid="input-assignment-desc" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.instructorDashboard.type")}</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full h-10 rounded-md border px-3 text-sm" data-testid="select-assignment-type">
                    <option value="lesson">{t("pages.instructorDashboard.lesson")}</option>
                    <option value="practice_exam">{t("pages.instructorDashboard.practiceExam")}</option>
                    <option value="flashcard_set">{t("pages.instructorDashboard.flashcardSet")}</option>
                    <option value="topic_drill">{t("pages.instructorDashboard.topicDrill")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.instructorDashboard.dueDate")}</label>
                  <Input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} data-testid="input-assignment-due" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowCreate(false)} data-testid="button-cancel-assignment">{t("pages.instructorDashboard.cancel2")}</Button>
                <Button onClick={createAssignment} disabled={!form.classroomId || !form.title} data-testid="button-confirm-assignment">{t("pages.instructorDashboard.create2")}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function StudentProgressTab({ institutionId }: { institutionId: string }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentDetail, setStudentDetail] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    authFetch(`/api/institutions/${institutionId}/student-progress`)
      .then(r => r.ok ? r.json() : [])
      .then(d => { setStudents(d); setLoading(false); });
  }, [institutionId]);

  const viewDetail = async (student: any) => {
    setSelectedStudent(student);
    try {
      const res = await authFetch(`/api/institutions/${institutionId}/student-progress/${student.userId}`);
      if (res.ok) setStudentDetail(await res.json());
    } catch {}
  };

  const filtered = students.filter(s =>
    !search || (s.username || "").toLowerCase().includes(search.toLowerCase()) || (s.email || "").toLowerCase().includes(search.toLowerCase())
  );

  if (selectedStudent && studentDetail) {
    return (
      <div>
        <button onClick={() => { setSelectedStudent(null); setStudentDetail(null); }} className="text-sm text-primary hover:underline mb-4 flex items-center gap-1" data-testid="button-back-students">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </button>
        <h2 className="text-xl font-bold mb-1" data-testid="text-student-name">{studentDetail.student?.username || selectedStudent.username}</h2>
        <p className="text-sm text-gray-500 mb-6">{studentDetail.student?.email || selectedStudent.email}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <Target className="w-5 h-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold">{Math.round(Number(selectedStudent.avgAccuracy || 0))}%</p>
              <p className="text-xs text-gray-500">{t("pages.instructorDashboard.avgAccuracy")}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <BookOpen className="w-5 h-5 mx-auto text-green-500 mb-1" />
              <p className="text-2xl font-bold">{selectedStudent.lessonsCompleted || 0}</p>
              <p className="text-xs text-gray-500">{t("pages.instructorDashboard.lessonsDone")}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <ClipboardList className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <p className="text-2xl font-bold">{selectedStudent.assignmentsCompleted || 0}/{selectedStudent.assignmentsTotal || 0}</p>
              <p className="text-xs text-gray-500">{t("pages.instructorDashboard.assignments3")}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <Clock className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <p className="text-2xl font-bold">{Math.round(Number(selectedStudent.totalStudyTime || 0) / 3600)}h</p>
              <p className="text-xs text-gray-500">{t("pages.instructorDashboard.studyTime")}</p>
            </CardContent>
          </Card>
        </div>

        {studentDetail.weakAreas && studentDetail.weakAreas.length > 0 && (
          <Card className="border-none shadow-md mb-6">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> {t("pages.instructorDashboard.weakAreas")}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {studentDetail.weakAreas.map((w: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{w.topic}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${w.accuracy}%` }} />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{w.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {studentDetail.recentExams && studentDetail.recentExams.length > 0 && (
          <Card className="border-none shadow-md">
            <CardHeader><CardTitle className="text-base">{t("pages.instructorDashboard.recentPracticeExams")}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {studentDetail.recentExams.slice(0, 10).map((ex: any) => (
                  <div key={ex.id} className="flex items-center justify-between text-sm">
                    <span>{ex.tier?.toUpperCase()} - {ex.totalQuestions} questions</span>
                    <div className="flex items-center gap-2">
                      {ex.score != null && <Badge variant={ex.score / ex.totalQuestions >= 0.7 ? "default" : "destructive"}>{Math.round(ex.score * 100 / ex.totalQuestions)}%</Badge>}
                      <span className="text-xs text-gray-400">{ex.completedAt ? new Date(ex.completedAt).toLocaleDateString() : "In Progress"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t("pages.instructorDashboard.studentProgress2")}</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("pages.instructorDashboard.searchStudents")} className="pl-10" data-testid="input-search-students" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center text-gray-500" data-testid="text-no-students">
            {students.length === 0 ? "No students enrolled yet." : "No students match your search."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(s => (
            <Card key={s.userId} className="cursor-pointer hover:shadow-md transition-all border-none shadow-sm" onClick={() => viewDetail(s)} data-testid={`card-student-${s.userId}`}>
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <span className="font-medium">{s.username || s.email || s.userId}</span>
                  {s.email && s.username && <span className="text-sm text-gray-400 ml-2">{s.email}</span>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">{Math.round(Number(s.avgAccuracy || 0))}%</p>
                    <p className="text-xs text-gray-400">{t("pages.instructorDashboard.accuracy")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{s.lessonsCompleted || 0}</p>
                    <p className="text-xs text-gray-400">{t("pages.instructorDashboard.lessons")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{s.assignmentsCompleted || 0}/{s.assignmentsTotal || 0}</p>
                    <p className="text-xs text-gray-400">{t("pages.instructorDashboard.assign")}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsTab({ institutionId }: { institutionId: string }) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`/api/institutions/${institutionId}/analytics`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setAnalytics(d); setLoading(false); });
  }, [institutionId]);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!analytics) return <div className="text-center text-gray-500 py-16">{t("pages.instructorDashboard.failedToLoadAnalytics")}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t("pages.instructorDashboard.institutionAnalytics")}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-none shadow-sm">
          <CardContent className="pt-4 pb-4 text-center">
            <Users className="w-6 h-6 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold" data-testid="text-total-students">{analytics.seats?.students || 0}</p>
            <p className="text-xs text-gray-500">{t("pages.instructorDashboard.students2")}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-4 pb-4 text-center">
            <GraduationCap className="w-6 h-6 mx-auto text-green-500 mb-1" />
            <p className="text-2xl font-bold" data-testid="text-instructors">{analytics.seats?.instructors || 0}</p>
            <p className="text-xs text-gray-500">{t("pages.instructorDashboard.instructors")}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-4 pb-4 text-center">
            <Target className="w-6 h-6 mx-auto text-blue-500 mb-1" />
            <p className="text-2xl font-bold" data-testid="text-avg-score">{Math.round(Number(analytics.performance?.avgScore || 0))}%</p>
            <p className="text-xs text-gray-500">{t("pages.instructorDashboard.avgScore2")}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-4 pb-4 text-center">
            <FileText className="w-6 h-6 mx-auto text-amber-500 mb-1" />
            <p className="text-2xl font-bold" data-testid="text-total-tests">{analytics.performance?.totalTests || 0}</p>
            <p className="text-xs text-gray-500">{t("pages.instructorDashboard.testsTaken")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="text-base">{t("pages.instructorDashboard.mostDifficultTopics")}</CardTitle></CardHeader>
          <CardContent>
            {(analytics.topicDifficulty || []).length === 0 ? (
              <p className="text-sm text-gray-400">{t("pages.instructorDashboard.noTopicDataAvailableYet")}</p>
            ) : (
              <div className="space-y-3">
                {analytics.topicDifficulty.slice(0, 10).map((t: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm truncate max-w-[200px]">{t.topic || "Unknown"}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.round(Number(t.avgScore))}%`, background: Number(t.avgScore) < 50 ? "#ef4444" : Number(t.avgScore) < 70 ? "#f59e0b" : "#22c55e" }} />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{Math.round(Number(t.avgScore))}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="text-base">{t("pages.instructorDashboard.classroomOverview")}</CardTitle></CardHeader>
          <CardContent>
            {(analytics.classroomStats || []).length === 0 ? (
              <p className="text-sm text-gray-400">{t("pages.instructorDashboard.noClassroomsCreatedYet")}</p>
            ) : (
              <div className="space-y-3">
                {analytics.classroomStats.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{c.name}</span>
                    <div className="flex gap-3 text-sm">
                      <span className="text-gray-500">{c.studentCount} students</span>
                      <span className="text-gray-500">{c.assignmentCount} assignments</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {(analytics.assignmentCompletion || []).length > 0 && (
        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="text-base">{t("pages.instructorDashboard.assignmentCompletionRates")}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.assignmentCompletion.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between">
                  <span className="text-sm truncate max-w-[250px]">{a.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{a.completed}/{a.totalSubmissions} completed</span>
                    {a.avgScore > 0 && <Badge variant="outline">{Math.round(Number(a.avgScore))}% avg</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(analytics.examReadiness || []).length > 0 && (
        <Card className="border-none shadow-md mt-6">
          <CardHeader><CardTitle className="text-base">{t("pages.instructorDashboard.examReadiness")}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.examReadiness.slice(0, 15).map((e: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{e.username || e.userId}</span>
                  <Badge variant={Number(e.pct) >= 70 ? "default" : Number(e.pct) >= 50 ? "secondary" : "destructive"}>
                    {e.pct}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EnrollmentTab({ institutionId }: { institutionId: string }) {
  const { toast } = useToast();
  const [emailList, setEmailList] = useState("");
  const [csvData, setCsvData] = useState("");
  const [enrollMode, setEnrollMode] = useState<"email" | "csv">("email");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendInvites = async () => {
    setSubmitting(true);
    try {
      if (enrollMode === "email") {
        const emails = emailList.split(/[,\n]/).map(e => e.trim()).filter(e => e.includes("@"));
        if (emails.length === 0) { toast({ title: "No valid emails", variant: "destructive" }); setSubmitting(false); return; }
        const res = await authFetch(`/api/institutions/${institutionId}/invite-email`, {
          method: "POST",
          body: JSON.stringify({ emails }),
        });
        if (res.ok) {
          const data = await res.json();
          setResult(data);
          toast({ title: `Enrollment code generated for ${data.emailCount} emails` });
        }
      } else {
        if (!csvData.trim()) { toast({ title: "No CSV data", variant: "destructive" }); setSubmitting(false); return; }
        const res = await authFetch(`/api/institutions/${institutionId}/bulk-csv`, {
          method: "POST",
          body: JSON.stringify({ csvData }),
        });
        if (res.ok) {
          const data = await res.json();
          setResult(data);
          toast({ title: `Processed ${data.totalEmails} emails, ${data.newlyAdded} added` });
        }
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t("pages.instructorDashboard.studentEnrollment")}</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Mail className="w-4 h-4" /> {t("pages.instructorDashboard.emailInvitations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-3">{t("pages.instructorDashboard.enterStudentEmailAddressesComma")}</p>
            <Textarea
              value={emailList}
              onChange={e => { setEmailList(e.target.value); setEnrollMode("email"); }}
              placeholder={"student1@college.edu\nstudent2@college.edu\nstudent3@college.edu"}
              rows={6}
              data-testid="textarea-email-invites"
            />
            <Button onClick={sendInvites} disabled={submitting || !emailList.trim()} className="mt-3 gap-2 w-full" data-testid="button-send-invites">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Generate Enrollment Code
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Upload className="w-4 h-4" /> {t("pages.instructorDashboard.csvBulkUpload")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-3">{t("pages.instructorDashboard.pasteCsvDataWithEmail")}</p>
            <Textarea
              value={csvData}
              onChange={e => { setCsvData(e.target.value); setEnrollMode("csv"); }}
              placeholder={"email,name\nstudent@college.edu,John Doe\nstudent2@college.edu,Jane Smith"}
              rows={6}
              data-testid="textarea-csv-upload"
            />
            <Button onClick={sendInvites} disabled={submitting || !csvData.trim()} className="mt-3 gap-2 w-full" data-testid="button-upload-csv">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Process CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card className="border-none shadow-md mt-6 bg-green-50">
          <CardContent className="py-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-green-700 mb-1">{t("pages.instructorDashboard.enrollmentCodeGenerated")}</p>
            <p className="text-3xl font-mono font-bold text-green-800 mb-2" data-testid="text-enrollment-code">{result.code}</p>
            <p className="text-sm text-green-600">
              {result.emailCount ? `${result.emailCount} email(s) added to roster` : `${result.totalEmails} email(s) processed, ${result.newlyAdded} newly added`}
            </p>
            <p className="text-xs text-gray-500 mt-2">{t("pages.instructorDashboard.studentsCanUseThisCode")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CertificatesTab({ institutionId }: { institutionId: string }) {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ studentId: "", studentName: "", courseName: "", classroomId: "" });
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      authFetch(`/api/institutions/${institutionId}/certificates`).then(r => r.ok ? r.json() : []),
      authFetch(`/api/institutions/${institutionId}/classrooms`).then(r => r.ok ? r.json() : []),
      authFetch(`/api/institutions/${institutionId}/student-progress`).then(r => r.ok ? r.json() : []),
    ]).then(([c, cl, st]) => {
      setCertificates(c);
      setClassrooms(cl);
      setStudents(st);
      setLoading(false);
    });
  }, [institutionId]);

  const issueCertificate = async () => {
    if (!form.studentId || !form.studentName || !form.courseName) return;
    try {
      const res = await authFetch(`/api/institutions/${institutionId}/certificates`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const cert = await res.json();
        setCertificates(prev => [cert, ...prev]);
        toast({ title: "Certificate issued" });
        setShowCreate(false);
        setForm({ studentId: "", studentName: "", courseName: "", classroomId: "" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t("pages.instructorDashboard.certificates2")}</h2>
        <Button onClick={() => setShowCreate(true)} className="gap-2" data-testid="button-issue-certificate">
          <Award className="w-4 h-4" /> Issue Certificate
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : certificates.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg" data-testid="text-no-certificates">{t("pages.instructorDashboard.noCertificatesIssuedYet")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {certificates.map(cert => (
            <Card key={cert.id} className="border-none shadow-sm" data-testid={`card-certificate-${cert.id}`}>
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{cert.studentName}</h3>
                  <p className="text-sm text-gray-500">{cert.courseName}</p>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-xs font-mono text-gray-500">{cert.certificateCode}</p>
                    <p className="text-xs text-gray-400">{new Date(cert.completionDate).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="default"><Award className="w-3 h-3 mr-1" /> {t("pages.instructorDashboard.issued")}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
            <CardHeader><CardTitle>{t("pages.instructorDashboard.issueCertificate")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.instructorDashboard.student")}</label>
                <select
                  value={form.studentId}
                  onChange={e => {
                    const s = students.find(st => st.userId === e.target.value);
                    setForm(p => ({ ...p, studentId: e.target.value, studentName: s?.username || s?.email || "" }));
                  }}
                  className="w-full h-10 rounded-md border px-3 text-sm"
                  data-testid="select-cert-student"
                >
                  <option value="">{t("pages.instructorDashboard.selectStudent")}</option>
                  {students.map(s => <option key={s.userId} value={s.userId}>{s.username || s.email}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.instructorDashboard.studentNameOnCertificate")}</label>
                <Input value={form.studentName} onChange={e => setForm(p => ({ ...p, studentName: e.target.value }))} data-testid="input-cert-name" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.instructorDashboard.courseprogramName")}</label>
                <Input value={form.courseName} onChange={e => setForm(p => ({ ...p, courseName: e.target.value }))} placeholder="e.g. Radiography Fundamentals" data-testid="input-cert-course" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("pages.instructorDashboard.classroomOptional")}</label>
                <select
                  value={form.classroomId}
                  onChange={e => setForm(p => ({ ...p, classroomId: e.target.value }))}
                  className="w-full h-10 rounded-md border px-3 text-sm"
                  data-testid="select-cert-classroom"
                >
                  <option value="">{t("pages.instructorDashboard.none")}</option>
                  {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowCreate(false)} data-testid="button-cancel-cert">{t("pages.instructorDashboard.cancel3")}</Button>
                <Button onClick={issueCertificate} disabled={!form.studentId || !form.studentName || !form.courseName} data-testid="button-confirm-cert">{t("pages.instructorDashboard.issueCertificate2")}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function BenchmarkingTab({ institutionId }: { institutionId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`/api/institutions/${institutionId}/benchmarking`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); });
  }, [institutionId]);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!data) return <div className="text-center text-gray-500 py-16">{t("pages.instructorDashboard.failedToLoadBenchmarkingData")}</div>;

  const ScoreComparison = ({ label, instValue, platformValue }: { label: string; instValue: number; platformValue: number }) => {
    const diff = instValue - platformValue;
    return (
      <div className="flex items-center justify-between py-3 border-b last:border-0">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold">{instValue}%</p>
            <p className="text-xs text-gray-400">{t("pages.instructorDashboard.yourProgram")}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">{platformValue}%</p>
            <p className="text-xs text-gray-400">{t("pages.instructorDashboard.platformAvg")}</p>
          </div>
          <Badge variant={diff > 0 ? "default" : diff < 0 ? "destructive" : "secondary"} className="w-16 justify-center">
            {diff > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : diff < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
            {diff > 0 ? "+" : ""}{diff}%
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t("pages.instructorDashboard.programBenchmarking")}</h2>
      <p className="text-gray-500 text-sm mb-6">{t("pages.instructorDashboard.compareYourInstitutionsPerformanceAgainst")}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="text-base">{t("pages.instructorDashboard.yourProgram2")}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary" data-testid="text-inst-avg">{data.institution?.avgScore || 0}%</p>
                <p className="text-xs text-gray-500">{t("pages.instructorDashboard.avgTestScore")}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500">{data.institution?.avgExamScore || 0}%</p>
                <p className="text-xs text-gray-500">{t("pages.instructorDashboard.avgExamScore")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{data.institution?.studentsCount || 0}</p>
                <p className="text-xs text-gray-500">{t("pages.instructorDashboard.activeStudents")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{data.institution?.testCount || 0}</p>
                <p className="text-xs text-gray-500">{t("pages.instructorDashboard.testsTaken2")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="text-base">{t("pages.instructorDashboard.platformAverage")}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-600" data-testid="text-platform-avg">{data.platform?.avgScore || 0}%</p>
                <p className="text-xs text-gray-500">{t("pages.instructorDashboard.avgTestScore2")}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-600">{data.platform?.avgExamScore || 0}%</p>
                <p className="text-xs text-gray-500">{t("pages.instructorDashboard.avgExamScore2")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{data.platform?.studentsCount || 0}</p>
                <p className="text-xs text-gray-500">{t("pages.instructorDashboard.totalStudents2")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{data.platform?.testCount || 0}</p>
                <p className="text-xs text-gray-500">{t("pages.instructorDashboard.totalTests")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md mb-6">
        <CardHeader><CardTitle className="text-base">{t("pages.instructorDashboard.scoreComparison")}</CardTitle></CardHeader>
        <CardContent>
          <ScoreComparison label={t("pages.instructorDashboard.averageTestScore")} instValue={data.institution?.avgScore || 0} platformValue={data.platform?.avgScore || 0} />
          <ScoreComparison label={t("pages.instructorDashboard.averageExamScore")} instValue={data.institution?.avgExamScore || 0} platformValue={data.platform?.avgExamScore || 0} />
        </CardContent>
      </Card>

      {(data.topicComparison || []).length > 0 && (
        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="text-base">{t("pages.instructorDashboard.topiclevelComparison")}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.topicComparison.map((t: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm truncate max-w-[200px]">{t.topic || "Unknown"}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-12 text-right">{t.institutionAvg}%</span>
                    <span className="text-sm text-gray-400 w-12 text-right">{t.platformAvg}%</span>
                    <Badge variant={t.institutionAvg > t.platformAvg ? "default" : t.institutionAvg < t.platformAvg ? "destructive" : "secondary"} className="w-14 justify-center text-xs">
                      {t.institutionAvg - t.platformAvg > 0 ? "+" : ""}{t.institutionAvg - t.platformAvg}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
