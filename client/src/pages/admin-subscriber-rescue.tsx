import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { adminFetch } from "@/lib/admin-fetch";
import { Navigation } from "@/components/navigation";

type RescueAction = {
  id: string;
  user_id: string;
  incident_id: string | null;
  action_type: string;
  action_data: any;
  performed_by: string;
  performed_by_username: string | null;
  reason: string | null;
  status: string;
  created_at: string;
};

type Template = {
  id: string;
  template_key: string;
  name: string;
  subject: string;
  body_email: string;
  body_in_app: string;
  placeholders: string[];
  is_active: boolean;
  updated_by: string | null;
  updated_at: string;
};

type UserProfile = {
  id: string;
  username: string;
  email: string;
  tier: string;
  subscription_status: string;
  stripe_customer_id: string;
  plan_expires_at: string | null;
};

type SearchUser = {
  id: string;
  username: string;
  email: string;
  tier: string;
  subscription_status: string;
};

type IncidentSummary = {
  incidentId: string;
  title: string;
  severity: string;
  category: string;
  affectedUserCount: number;
  status: string;
};

const ACTION_LABELS: Record<string, string> = {
  extend_subscription: "Extend Subscription",
  grant_temporary_access: "Grant Temporary Access",
  restore_entitlement: "Restore Entitlement",
  replay_billing_sync: "Replay Billing Sync",
  reset_exam_state: "Reset Exam State",
  send_backup_link: "Send Backup Link",
  support_note: "Support Note",
};

const DESTRUCTIVE_ACTIONS = new Set(["extend_subscription", "grant_temporary_access", "restore_entitlement"]);

export default function AdminSubscriberRescue() {
  const { user } = useAuth();
  const isAdmin = user?.tier === "admin";
  const [activeTab, setActiveTab] = useState<"rescue" | "templates" | "prevention">("rescue");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [rescueHistory, setRescueHistory] = useState<RescueAction[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});
  const [renderedTemplate, setRenderedTemplate] = useState<{ subject: string; bodyEmail: string; bodyInApp: string } | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editForm, setEditForm] = useState({ name: "", subject: "", bodyEmail: "", bodyInApp: "" });
  const [confirmAction, setConfirmAction] = useState<{ action: string; data: any } | null>(null);
  const [actionForm, setActionForm] = useState({ days: "7", hours: "24", tier: "", reason: "", note: "", incidentId: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [refundData, setRefundData] = useState<{ activeIncidents: IncidentSummary[]; recentRescueStats: any[]; atRiskSubscribers: any[] } | null>(null);
  const [incidentUsers, setIncidentUsers] = useState<{ incident: any; affectedUsers: any[]; rescueActions: any[]; suggestedActions: any[] } | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState("");
  const [bulkSelectedUsers, setBulkSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [copiedField, setCopiedField] = useState("");

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const searchUsers = useCallback(async (q: string) => {
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const res = await adminFetch(`/api/admin/rescue/search-user?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(data.users || []);
    } catch { setSearchResults([]); }
  }, []);

  const selectUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const res = await adminFetch(`/api/admin/rescue/user/${userId}`);
      const data = await res.json();
      setSelectedUser(data.user);
      setRescueHistory(data.rescueHistory || []);
      setSearchResults([]);
      setSearchQuery("");
    } catch (e: any) {
      showMessage("error", e.message);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  const executeRescueAction = useCallback(async (action: string, data: any) => {
    if (DESTRUCTIVE_ACTIONS.has(action) && !confirmAction) {
      setConfirmAction({ action, data });
      return;
    }
    setConfirmAction(null);
    try {
      setLoading(true);
      const res = await adminFetch(`/api/admin/rescue/${action.replace(/_/g, "-")}`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      showMessage("success", `${ACTION_LABELS[action] || action} completed successfully`);
      if (selectedUser) selectUser(selectedUser.id);
    } catch (e: any) {
      showMessage("error", e.message);
    } finally {
      setLoading(false);
    }
  }, [confirmAction, selectedUser, selectUser, showMessage]);

  const loadTemplates = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/rescue/templates");
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch {}
  }, []);

  const renderTemplate = useCallback(async (templateId: string, values: Record<string, string>) => {
    try {
      const res = await adminFetch(`/api/admin/rescue/templates/${templateId}/render`, {
        method: "POST",
        body: { values },
      });
      const data = await res.json();
      setRenderedTemplate(data);
    } catch {}
  }, []);

  const saveTemplate = useCallback(async () => {
    if (!editingTemplate) return;
    try {
      setLoading(true);
      const res = await adminFetch(`/api/admin/rescue/templates/${editingTemplate.id}`, {
        method: "PUT",
        body: { name: editForm.name, subject: editForm.subject, bodyEmail: editForm.bodyEmail, bodyInApp: editForm.bodyInApp },
      });
      if (!res.ok) throw new Error("Failed to save template");
      showMessage("success", "Template saved");
      setEditingTemplate(null);
      loadTemplates();
    } catch (e: any) {
      showMessage("error", e.message);
    } finally {
      setLoading(false);
    }
  }, [editingTemplate, editForm, loadTemplates, showMessage]);

  const loadRefundPrevention = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/rescue/refund-prevention");
      const data = await res.json();
      setRefundData(data);
    } catch {}
  }, []);

  const loadIncidentUsers = useCallback(async (incidentId: string) => {
    try {
      setLoading(true);
      const res = await adminFetch(`/api/admin/rescue/incident/${encodeURIComponent(incidentId)}/affected-users`);
      const data = await res.json();
      setIncidentUsers(data);
      setBulkSelectedUsers(new Set());
    } catch (e: any) {
      showMessage("error", e.message);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  const executeBulkAction = useCallback(async () => {
    if (!bulkAction || bulkSelectedUsers.size === 0) return;
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/rescue/bulk-action", {
        method: "POST",
        body: {
          userIds: Array.from(bulkSelectedUsers),
          actionType: bulkAction,
          actionData: { days: parseInt(actionForm.days), hours: parseInt(actionForm.hours), note: actionForm.note },
          reason: actionForm.reason,
          incidentId: selectedIncidentId || null,
        },
      });
      const data = await res.json();
      showMessage("success", `Bulk action completed: ${data.successCount}/${data.totalProcessed} succeeded`);
      if (selectedIncidentId) loadIncidentUsers(selectedIncidentId);
    } catch (e: any) {
      showMessage("error", e.message);
    } finally {
      setLoading(false);
    }
  }, [bulkAction, bulkSelectedUsers, actionForm, selectedIncidentId, loadIncidentUsers, showMessage]);

  const copyToClipboard = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2000);
    });
  }, []);

  useEffect(() => {
    if (activeTab === "templates") loadTemplates();
    if (activeTab === "prevention") loadRefundPrevention();
  }, [activeTab, loadTemplates, loadRefundPrevention]);

  useEffect(() => {
    const timeout = setTimeout(() => searchUsers(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, searchUsers]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600" data-testid="text-access-denied">Access Denied</h2>
          <p className="text-gray-600 mt-2">Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">Subscriber Rescue & Protection</h1>
          <p className="text-gray-600 mt-1">One-click rescue tools, communication templates, and refund prevention</p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`} data-testid={`status-message-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="flex gap-1 mb-6 bg-white rounded-lg shadow p-1">
          {(["rescue", "templates", "prevention"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              data-testid={`button-tab-${tab}`}
            >
              {tab === "rescue" ? "Subscriber Rescue" : tab === "templates" ? "Communication Templates" : "Refund Prevention"}
            </button>
          ))}
        </div>

        {activeTab === "rescue" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search User</label>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by username, email, or user ID..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-search-user"
              />
              {searchResults.length > 0 && (
                <div className="mt-2 border rounded-lg divide-y max-h-60 overflow-auto">
                  {searchResults.map(u => (
                    <button
                      key={u.id}
                      onClick={() => selectUser(u.id)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors"
                      data-testid={`button-select-user-${u.id}`}
                    >
                      <div className="font-medium text-gray-900">{u.username}</div>
                      <div className="text-sm text-gray-500">{u.email || "No email"} &middot; {u.tier} &middot; {u.subscription_status || "N/A"}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedUser && (
              <>
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-900 mb-3" data-testid="text-selected-user">
                    {selectedUser.username}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-gray-500">Tier:</span> <span className="font-medium" data-testid="text-user-tier">{selectedUser.tier}</span></div>
                    <div><span className="text-gray-500">Status:</span> <span className="font-medium" data-testid="text-user-status">{selectedUser.subscription_status || "N/A"}</span></div>
                    <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedUser.email || "None"}</span></div>
                    <div><span className="text-gray-500">Plan Expires:</span> <span className="font-medium">{selectedUser.plan_expires_at ? new Date(selectedUser.plan_expires_at).toLocaleDateString() : "N/A"}</span></div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Rescue Actions</h3>
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Reason</label>
                      <input type="text" value={actionForm.reason} onChange={e => setActionForm(f => ({ ...f, reason: e.target.value }))} placeholder="Reason for action..." className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="input-reason" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Incident ID (optional)</label>
                      <input type="text" value={actionForm.incidentId} onChange={e => setActionForm(f => ({ ...f, incidentId: e.target.value }))} placeholder="INC-..." className="w-full px-3 py-2 border rounded-lg text-sm" data-testid="input-incident-id" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">Extend Subscription</h4>
                      <div className="flex gap-2 mb-2">
                        <input type="number" value={actionForm.days} onChange={e => setActionForm(f => ({ ...f, days: e.target.value }))} className="w-20 px-2 py-1 border rounded text-sm" data-testid="input-extend-days" />
                        <span className="text-sm text-gray-500 self-center">days</span>
                      </div>
                      <button onClick={() => executeRescueAction("extend_subscription", { userId: selectedUser.id, days: parseInt(actionForm.days), reason: actionForm.reason, incidentId: actionForm.incidentId || undefined })} disabled={loading} className="w-full bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50" data-testid="button-extend-subscription">
                        Extend
                      </button>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">Grant Temporary Access</h4>
                      <div className="flex gap-2 mb-2">
                        <input type="number" value={actionForm.hours} onChange={e => setActionForm(f => ({ ...f, hours: e.target.value }))} className="w-20 px-2 py-1 border rounded text-sm" data-testid="input-access-hours" />
                        <span className="text-sm text-gray-500 self-center">hours</span>
                      </div>
                      <button onClick={() => executeRescueAction("grant_temporary_access", { userId: selectedUser.id, hours: parseInt(actionForm.hours), reason: actionForm.reason, incidentId: actionForm.incidentId || undefined })} disabled={loading} className="w-full bg-amber-600 text-white px-3 py-1.5 rounded text-sm hover:bg-amber-700 disabled:opacity-50" data-testid="button-grant-access">
                        Grant Access
                      </button>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">Restore Entitlement</h4>
                      <select value={actionForm.tier} onChange={e => setActionForm(f => ({ ...f, tier: e.target.value }))} className="w-full px-2 py-1 border rounded text-sm mb-2" data-testid="select-restore-tier">
                        <option value="">Current Tier</option>
                        <option value="rpn">RPN</option>
                        <option value="rn">RN</option>
                        <option value="np">NP</option>
                      </select>
                      <button onClick={() => executeRescueAction("restore_entitlement", { userId: selectedUser.id, tier: actionForm.tier || undefined, reason: actionForm.reason, incidentId: actionForm.incidentId || undefined })} disabled={loading} className="w-full bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50" data-testid="button-restore-entitlement">
                        Restore
                      </button>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">Replay Billing Sync</h4>
                      <p className="text-xs text-gray-500 mb-2">Clear entitlement cache and re-verify</p>
                      <button onClick={() => executeRescueAction("replay_billing_sync", { userId: selectedUser.id, reason: actionForm.reason, incidentId: actionForm.incidentId || undefined })} disabled={loading} className="w-full bg-purple-600 text-white px-3 py-1.5 rounded text-sm hover:bg-purple-700 disabled:opacity-50" data-testid="button-replay-billing">
                        Replay Sync
                      </button>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">Reset Exam State</h4>
                      <p className="text-xs text-gray-500 mb-2">Reset stuck exam/session state</p>
                      <button onClick={() => executeRescueAction("reset_exam_state", { userId: selectedUser.id, reason: actionForm.reason, incidentId: actionForm.incidentId || undefined })} disabled={loading} className="w-full bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 disabled:opacity-50" data-testid="button-reset-exam">
                        Reset
                      </button>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">Add Support Note</h4>
                      <input type="text" value={actionForm.note} onChange={e => setActionForm(f => ({ ...f, note: e.target.value }))} placeholder="Note text..." className="w-full px-2 py-1 border rounded text-sm mb-2" data-testid="input-support-note" />
                      <button onClick={() => executeRescueAction("add_support_note", { userId: selectedUser.id, note: actionForm.note, reason: actionForm.reason, incidentId: actionForm.incidentId || undefined })} disabled={loading || !actionForm.note} className="w-full bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700 disabled:opacity-50" data-testid="button-add-note">
                        Add Note
                      </button>
                    </div>
                  </div>
                </div>

                {rescueHistory.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Rescue History</h3>
                    <div className="space-y-2 max-h-80 overflow-auto">
                      {rescueHistory.map(a => (
                        <div key={a.id} className="border rounded-lg p-3 text-sm" data-testid={`card-rescue-action-${a.id}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium text-gray-900">{ACTION_LABELS[a.action_type] || a.action_type}</span>
                              {a.incident_id && <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{a.incident_id}</span>}
                            </div>
                            <span className="text-xs text-gray-500">{new Date(a.created_at).toLocaleString()}</span>
                          </div>
                          {a.reason && <p className="text-gray-600 mt-1">{a.reason}</p>}
                          <p className="text-gray-400 text-xs mt-1">By: {a.performed_by_username || a.performed_by}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "templates" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Communication Templates</h3>
                <div className="space-y-2 max-h-[600px] overflow-auto">
                  {templates.map(t => (
                    <div
                      key={t.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedTemplate?.id === t.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                      onClick={() => { setSelectedTemplate(t); setTemplateValues({}); setRenderedTemplate(null); }}
                      data-testid={`card-template-${t.id}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{t.name}</span>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${t.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                            {t.is_active ? "Active" : "Inactive"}
                          </span>
                          <button onClick={e => { e.stopPropagation(); setEditingTemplate(t); setEditForm({ name: t.name, subject: t.subject, bodyEmail: t.body_email, bodyInApp: t.body_in_app }); }} className="text-xs text-blue-600 hover:underline" data-testid={`button-edit-template-${t.id}`}>
                            Edit
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{t.subject}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {selectedTemplate && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Preview: {selectedTemplate.name}</h3>
                    {Array.isArray(selectedTemplate.placeholders) && selectedTemplate.placeholders.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="text-xs font-medium text-gray-500">Placeholder Values</p>
                        {selectedTemplate.placeholders.map((p: string) => (
                          <div key={p} className="flex gap-2 items-center">
                            <label className="text-xs text-gray-600 w-32 truncate">{`{{${p}}}`}</label>
                            <input
                              type="text"
                              value={templateValues[p] || ""}
                              onChange={e => setTemplateValues(v => ({ ...v, [p]: e.target.value }))}
                              placeholder={p.replace(/_/g, " ")}
                              className="flex-1 px-2 py-1 border rounded text-sm"
                              data-testid={`input-placeholder-${p}`}
                            />
                          </div>
                        ))}
                        {selectedUser && (
                          <button onClick={() => setTemplateValues(v => ({ ...v, customer_name: selectedUser.username, product_name: selectedUser.tier?.toUpperCase() || "" }))} className="text-xs text-blue-600 hover:underline" data-testid="button-autofill">
                            Auto-fill from selected user
                          </button>
                        )}
                        <button onClick={() => renderTemplate(selectedTemplate.id, templateValues)} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700" data-testid="button-render-template">
                          Render Preview
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium text-gray-500">Subject</p>
                          <button onClick={() => copyToClipboard(renderedTemplate?.subject || selectedTemplate.subject, "subject")} className="text-xs text-blue-600 hover:underline" data-testid="button-copy-subject">
                            {copiedField === "subject" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <p className="text-sm bg-gray-50 p-2 rounded mt-1" data-testid="text-template-subject">{renderedTemplate?.subject || selectedTemplate.subject}</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium text-gray-500">Email Body</p>
                          <button onClick={() => copyToClipboard(renderedTemplate?.bodyEmail || selectedTemplate.body_email, "email")} className="text-xs text-blue-600 hover:underline" data-testid="button-copy-email">
                            {copiedField === "email" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <pre className="text-sm bg-gray-50 p-2 rounded mt-1 whitespace-pre-wrap max-h-40 overflow-auto" data-testid="text-template-email">{renderedTemplate?.bodyEmail || selectedTemplate.body_email}</pre>
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium text-gray-500">In-App Message</p>
                          <button onClick={() => copyToClipboard(renderedTemplate?.bodyInApp || selectedTemplate.body_in_app, "inapp")} className="text-xs text-blue-600 hover:underline" data-testid="button-copy-inapp">
                            {copiedField === "inapp" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <p className="text-sm bg-gray-50 p-2 rounded mt-1" data-testid="text-template-inapp">{renderedTemplate?.bodyInApp || selectedTemplate.body_in_app}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {editingTemplate && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
                  <h3 className="text-lg font-semibold mb-4">Edit Template: {editingTemplate.name}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" data-testid="input-edit-name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input type="text" value={editForm.subject} onChange={e => setEditForm(f => ({ ...f, subject: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" data-testid="input-edit-subject" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                      <textarea value={editForm.bodyEmail} onChange={e => setEditForm(f => ({ ...f, bodyEmail: e.target.value }))} rows={6} className="w-full px-3 py-2 border rounded-lg" data-testid="input-edit-body-email" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">In-App Message</label>
                      <textarea value={editForm.bodyInApp} onChange={e => setEditForm(f => ({ ...f, bodyInApp: e.target.value }))} rows={3} className="w-full px-3 py-2 border rounded-lg" data-testid="input-edit-body-inapp" />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-4">
                    <button onClick={() => setEditingTemplate(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg" data-testid="button-cancel-edit">Cancel</button>
                    <button onClick={saveTemplate} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" data-testid="button-save-template">Save</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "prevention" && (
          <div className="space-y-6">
            {refundData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Active Critical Incidents</h3>
                    <p className="text-2xl font-bold text-red-600 mt-1" data-testid="text-active-incidents">
                      {refundData.activeIncidents.filter(i => i.severity === "critical").length}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">At-Risk Subscribers</h3>
                    <p className="text-2xl font-bold text-amber-600 mt-1" data-testid="text-at-risk-count">
                      {refundData.atRiskSubscribers.length}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Rescue Actions (7d)</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-1" data-testid="text-rescue-count">
                      {refundData.recentRescueStats.reduce((s, r) => s + r.count, 0)}
                    </p>
                  </div>
                </div>

                {refundData.activeIncidents.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Active Incidents Affecting Subscribers</h3>
                    <div className="space-y-2">
                      {refundData.activeIncidents.map(inc => (
                        <div key={inc.incidentId} className="border rounded-lg p-3 flex justify-between items-center" data-testid={`card-incident-${inc.incidentId}`}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded font-medium ${inc.severity === "critical" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                                {inc.severity}
                              </span>
                              <span className="font-medium text-sm">{inc.title || inc.incidentId}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{inc.affectedUserCount} users affected &middot; {inc.category}</p>
                          </div>
                          <button onClick={() => { setSelectedIncidentId(inc.incidentId); loadIncidentUsers(inc.incidentId); }} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700" data-testid={`button-view-incident-${inc.incidentId}`}>
                            View & Rescue
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {refundData.atRiskSubscribers.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">At-Risk Subscribers</h3>
                    <div className="space-y-2 max-h-80 overflow-auto">
                      {refundData.atRiskSubscribers.map((u: any) => (
                        <div key={u.id} className="border rounded-lg p-3 flex justify-between items-center" data-testid={`card-at-risk-${u.id}`}>
                          <div>
                            <span className="font-medium text-sm">{u.username}</span>
                            <span className="text-xs text-gray-500 ml-2">{u.email || ""} &middot; {u.tier} &middot; {u.incident_count} incident(s)</span>
                          </div>
                          <button onClick={() => selectUser(u.id).then(() => setActiveTab("rescue"))} className="text-sm text-blue-600 hover:underline" data-testid={`button-rescue-user-${u.id}`}>
                            Rescue
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {incidentUsers && (
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Affected Users: {selectedIncidentId}
                    <span className="text-sm font-normal text-gray-500 ml-2">({incidentUsers.affectedUsers.length} users)</span>
                  </h3>
                  <button onClick={() => setIncidentUsers(null)} className="text-sm text-gray-500 hover:text-gray-700" data-testid="button-close-incident-users">Close</button>
                </div>

                {incidentUsers.suggestedActions.length > 0 && (
                  <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-800 mb-2">Suggested Actions</p>
                    <div className="flex flex-wrap gap-2">
                      {incidentUsers.suggestedActions.map((sa: any) => (
                        <span key={sa.action} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded" title={sa.description}>
                          {sa.label} ({sa.priority})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {incidentUsers.affectedUsers.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-3 mb-4 items-end">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Bulk Action</label>
                        <select value={bulkAction} onChange={e => setBulkAction(e.target.value)} className="px-2 py-1.5 border rounded text-sm" data-testid="select-bulk-action">
                          <option value="">Select action...</option>
                          <option value="extend_subscription">Extend Subscription</option>
                          <option value="grant_temporary_access">Grant Temporary Access</option>
                          <option value="replay_billing_sync">Replay Billing Sync</option>
                          <option value="support_note">Add Support Note</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Reason</label>
                        <input type="text" value={actionForm.reason} onChange={e => setActionForm(f => ({ ...f, reason: e.target.value }))} placeholder="Reason..." className="px-2 py-1.5 border rounded text-sm w-48" data-testid="input-bulk-reason" />
                      </div>
                      <button
                        onClick={executeBulkAction}
                        disabled={loading || !bulkAction || bulkSelectedUsers.size === 0}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        data-testid="button-execute-bulk"
                      >
                        Apply to {bulkSelectedUsers.size} users
                      </button>
                      <button onClick={() => setBulkSelectedUsers(new Set(incidentUsers.affectedUsers.map((u: any) => u.id)))} className="text-sm text-blue-600 hover:underline" data-testid="button-select-all">
                        Select All
                      </button>
                    </div>

                    <div className="space-y-1 max-h-60 overflow-auto">
                      {incidentUsers.affectedUsers.map((u: any) => (
                        <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer" data-testid={`checkbox-user-${u.id}`}>
                          <input type="checkbox" checked={bulkSelectedUsers.has(u.id)} onChange={e => {
                            const s = new Set(bulkSelectedUsers);
                            e.target.checked ? s.add(u.id) : s.delete(u.id);
                            setBulkSelectedUsers(s);
                          }} className="rounded" />
                          <span className="text-sm font-medium">{u.username}</span>
                          <span className="text-xs text-gray-500">{u.email || ""} &middot; {u.tier} &middot; {u.subscription_status}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}

                {incidentUsers.rescueActions.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Rescue Actions for this Incident</h4>
                    <div className="space-y-1 max-h-40 overflow-auto">
                      {incidentUsers.rescueActions.map((a: any) => (
                        <div key={a.id} className="text-xs bg-gray-50 p-2 rounded">
                          <span className="font-medium">{ACTION_LABELS[a.action_type] || a.action_type}</span>
                          <span className="text-gray-500 ml-2">for user {a.user_id}</span>
                          <span className="text-gray-400 ml-2">{new Date(a.created_at).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {confirmAction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Confirm Destructive Action</h3>
              <p className="text-gray-700 mb-4">
                You are about to perform <strong>{ACTION_LABELS[confirmAction.action] || confirmAction.action}</strong> on user <strong>{selectedUser?.username || confirmAction.data?.userId}</strong>. This action modifies the user's subscription or access.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirmAction(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg" data-testid="button-cancel-confirm">Cancel</button>
                <button onClick={() => executeRescueAction(confirmAction.action, confirmAction.data)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" data-testid="button-confirm-action">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
