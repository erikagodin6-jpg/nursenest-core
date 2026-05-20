import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import {
  Play, Clock, AlertTriangle, RefreshCw, Search,
  ChevronRight, Monitor, MousePointer, Globe, Bug
} from "lucide-react";

export default function AdminSessionReplay() {
  const { user } = useAuth();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [userIdFilter, setUserIdFilter] = useState("");
  const [hasErrorsFilter, setHasErrorsFilter] = useState(false);
  const isAdmin = user?.tier === "admin";

  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/telemetry/sessions", userIdFilter, hasErrorsFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (userIdFilter) params.set("userId", userIdFilter);
      if (hasErrorsFilter) params.set("hasErrors", "true");
      return adminFetch(`/api/admin/telemetry/sessions?${params}`).then(r => r.json());
    },
    enabled: isAdmin,
  });

  const { data: sessionDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["/api/admin/telemetry/session", selectedSessionId],
    queryFn: () => adminFetch(`/api/admin/telemetry/session/${selectedSessionId}`).then(r => r.json()),
    enabled: isAdmin && !!selectedSessionId,
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold" data-testid="text-access-denied">Access Denied</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">Session Replay</h1>
            <p className="text-gray-600 mt-1">Time-travel debugging: replay user sessions, API calls, and state transitions</p>
          </div>
          <Button data-testid="btn-refresh" onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              data-testid="input-user-filter"
              placeholder="Filter by User ID..."
              className="pl-10"
              value={userIdFilter}
              onChange={e => setUserIdFilter(e.target.value)}
            />
          </div>
          <Button
            data-testid="btn-errors-filter"
            variant={hasErrorsFilter ? "default" : "outline"}
            onClick={() => setHasErrorsFilter(!hasErrorsFilter)}
          >
            <Bug className="w-4 h-4 mr-1" /> {hasErrorsFilter ? "Showing Errors Only" : "Show Errors Only"}
          </Button>
        </div>

        {selectedSessionId && sessionDetail && !detailLoading ? (
          <div className="space-y-6">
            <Button data-testid="btn-back" variant="outline" onClick={() => setSelectedSessionId(null)}>
              ← Back to Sessions
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" /> Session: {sessionDetail.recording?.session_id?.slice(0, 16)}...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 border rounded-lg text-center">
                    <div className="text-xs text-gray-500">User</div>
                    <div className="font-mono text-sm mt-1" data-testid="detail-user">{sessionDetail.recording?.user_id?.slice(0, 12) || "Anonymous"}...</div>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <div className="text-xs text-gray-500">Duration</div>
                    <div className="font-bold mt-1" data-testid="detail-duration">{sessionDetail.recording?.duration || 0}s</div>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <div className="text-xs text-gray-500">Started</div>
                    <div className="text-sm mt-1" data-testid="detail-started">{sessionDetail.recording?.started_at ? new Date(sessionDetail.recording.started_at).toLocaleString() : "—"}</div>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <div className="text-xs text-gray-500">Errors</div>
                    <div className="font-bold mt-1 text-red-600" data-testid="detail-errors">
                      {Array.isArray(sessionDetail.recording?.errors) ? sessionDetail.recording.errors.length : 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MousePointer className="w-5 h-5" /> Actions Timeline</CardTitle></CardHeader>
              <CardContent>
                {(!sessionDetail.recording?.actions || (Array.isArray(sessionDetail.recording.actions) && sessionDetail.recording.actions.length === 0)) ? (
                  <div className="text-center py-6 text-gray-500">No actions recorded</div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {(Array.isArray(sessionDetail.recording.actions) ? sessionDetail.recording.actions : []).map((action: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-2 border rounded text-sm" data-testid={`action-${i}`}>
                        <div className="text-xs text-gray-400 w-16 shrink-0">{action.timestamp ? new Date(action.timestamp).toLocaleTimeString() : `#${i + 1}`}</div>
                        <div className="flex-1">
                          <span className="font-medium">{action.type || "action"}</span>
                          {action.target && <span className="ml-2 text-gray-500">→ {action.target}</span>}
                          {action.detail && <div className="text-xs text-gray-400 mt-0.5">{JSON.stringify(action.detail).slice(0, 100)}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> API Calls</CardTitle></CardHeader>
              <CardContent>
                {(!sessionDetail.recording?.api_calls || (Array.isArray(sessionDetail.recording.api_calls) && sessionDetail.recording.api_calls.length === 0)) ? (
                  <div className="text-center py-6 text-gray-500">No API calls recorded</div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {(Array.isArray(sessionDetail.recording.api_calls) ? sessionDetail.recording.api_calls : []).map((call: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-2 border rounded text-sm" data-testid={`api-call-${i}`}>
                        <Badge variant={call.status >= 400 ? "destructive" : "outline"} className="shrink-0">{call.method || "GET"}</Badge>
                        <span className="font-mono text-xs truncate flex-1">{call.url || call.path || "—"}</span>
                        <span className={`text-xs ${call.status >= 400 ? "text-red-600 font-bold" : "text-gray-500"}`}>{call.status || "—"}</span>
                        {call.duration && <span className="text-xs text-gray-400">{call.duration}ms</span>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Play className="w-5 h-5" /> State Transitions</CardTitle></CardHeader>
              <CardContent>
                {(!sessionDetail.recording?.state_transitions || (Array.isArray(sessionDetail.recording.state_transitions) && sessionDetail.recording.state_transitions.length === 0)) ? (
                  <div className="text-center py-6 text-gray-500">No state transitions recorded</div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {(Array.isArray(sessionDetail.recording.state_transitions) ? sessionDetail.recording.state_transitions : []).map((transition: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 border rounded text-sm" data-testid={`transition-${i}`}>
                        <Badge variant="outline">{transition.from || "—"}</Badge>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Badge>{transition.to || "—"}</Badge>
                        {transition.trigger && <span className="text-xs text-gray-500 ml-2">({transition.trigger})</span>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {sessionDetail.recording?.errors && Array.isArray(sessionDetail.recording.errors) && sessionDetail.recording.errors.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-red-600"><Bug className="w-5 h-5" /> Errors</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sessionDetail.recording.errors.map((error: any, i: number) => (
                      <div key={i} className="p-3 border border-red-200 rounded-lg bg-red-50" data-testid={`error-${i}`}>
                        <div className="font-medium text-red-800">{error.message || error.type || "Unknown error"}</div>
                        {error.stack && <pre className="text-xs text-red-600 mt-1 overflow-x-auto">{error.stack.slice(0, 300)}</pre>}
                        {error.timestamp && <div className="text-xs text-red-400 mt-1">{new Date(error.timestamp).toLocaleString()}</div>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {sessionDetail.events && sessionDetail.events.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Telemetry Events ({sessionDetail.events.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {sessionDetail.events.map((evt: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 border rounded text-xs" data-testid={`event-${i}`}>
                        <Badge variant={evt.event_category === "error" ? "destructive" : "outline"} className="text-xs">{evt.event_category}</Badge>
                        <span className="font-medium">{evt.event_type}</span>
                        {evt.page && <span className="text-gray-400">{evt.page}</span>}
                        <span className="ml-auto text-gray-400">{new Date(evt.created_at).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <>
            {isLoading && <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>}

            {!isLoading && (
              <div className="space-y-4">
                <div className="text-sm text-gray-500">{sessions?.total || 0} sessions found</div>

                {(!sessions?.sessions || sessions.sessions.length === 0) ? (
                  <Card>
                    <CardContent className="py-12 text-center text-gray-500">
                      <Monitor className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <div>No session recordings yet</div>
                      <div className="text-sm mt-1">Sessions will appear here as users interact with the platform</div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {sessions.sessions.map((session: any) => (
                      <Card
                        key={session.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedSessionId(session.session_id)}
                        data-testid={`session-${session.id}`}
                      >
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Monitor className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="font-mono text-sm font-medium">{session.session_id?.slice(0, 20)}...</div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  User: {session.user_id?.slice(0, 12) || "Anonymous"} • {new Date(session.started_at).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex gap-2 text-xs">
                                <Badge variant="outline"><MousePointer className="w-3 h-3 mr-1" />{session.action_count || 0}</Badge>
                                <Badge variant="outline"><Globe className="w-3 h-3 mr-1" />{session.api_call_count || 0}</Badge>
                                {session.error_count > 0 && <Badge variant="destructive"><Bug className="w-3 h-3 mr-1" />{session.error_count}</Badge>}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" /> {session.duration || 0}s
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
