import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Mail, Eye, CheckCircle, XCircle, Clock, AlertCircle, Pencil } from "lucide-react";

interface Props {
  selectedYearId: number | null;
}

export function PhaseRegistrationManager({ selectedYearId }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── dialog state ───────────────────────────────────────────────
  const [isCreatePhaseOpen,   setIsCreatePhaseOpen]   = useState(false);
  const [editingPhase,        setEditingPhase]         = useState<any | null>(null);
  const [viewingRegistration, setViewingRegistration]  = useState<any | null>(null);

  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);

  // ── queries ────────────────────────────────────────────────────
  const { data: phases = [], isLoading: phasesLoading, isError: phasesError, error: phasesQueryError } = useQuery<any[]>({
    queryKey: ["/api/championship-phases", { yearId: selectedYearId }],
    enabled: !!selectedYearId,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/championship-phases?yearId=${selectedYearId}`);
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `Unable to load phases (${res.status})`);
      }
      return res.json();
    },
  });

  const { data: registrations = [], isLoading: registrationsLoading, isError: registrationsError, error: registrationsQueryError } = useQuery<any[]>({
    queryKey: ["/api/school-registrations", { yearId: selectedYearId }],
    enabled: !!selectedYearId,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/school-registrations?yearId=${selectedYearId}`);
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `Unable to load registrations (${res.status})`);
      }
      return res.json();
    },
  });

  const phaseList = Array.isArray(phases) ? phases : [];
  const registrationList = Array.isArray(registrations) ? registrations : [];
  const visibleRegistrations = selectedPhaseId
    ? registrationList.filter((registration) => registration.phaseId === selectedPhaseId)
    : registrationList;

  // ── new phase form state ───────────────────────────────────────
  const [newPhase, setNewPhase] = useState({
    stateName: "",
    venue: "",
    registrationOpens: "",
    registrationCloses: "",
    competitionDate: "",
    maxSchools: 9,
    whatsappGroupLink: "",
  });

  // ── mutations ──────────────────────────────────────────────────
  const createPhaseMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/championship-phases", { ...data, yearId: selectedYearId });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/championship-phases"] });
      toast({ title: "Phase created" });
      setIsCreatePhaseOpen(false);
      setNewPhase({ stateName: "", venue: "", registrationOpens: "", registrationCloses: "", competitionDate: "", maxSchools: 9, whatsappGroupLink: "" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updatePhaseMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await apiRequest("PATCH", `/api/championship-phases/${id}`, data);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/championship-phases"] });
      toast({ title: "Phase updated" });
      setEditingPhase(null);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deletePhaseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/championship-phases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/championship-phases"] });
      toast({ title: "Phase deleted" });
    },
  });

  const updateRegistrationMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: string; adminNotes?: string }) => {
      const body: any = { status };
      if (adminNotes !== undefined) body.adminNotes = adminNotes;
      const res = await apiRequest("PATCH", `/api/school-registrations/${id}`, body);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed"); }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/school-registrations"] });
      // Keep viewingRegistration in sync with the new status
      if (viewingRegistration?.id === variables.id) {
        setViewingRegistration((prev: any) => ({ ...prev, status: variables.status }));
      }
      const label = variables.status.replace(/_/g, " ");
      const note  = (variables.status === "selected" || variables.status === "not_selected")
        ? " — notification email sent." : ".";
      toast({ title: "Status updated", description: `Marked as ${label}${note}` });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const notifySchoolsMutation = useMutation({
    mutationFn: async (phaseId: number) => {
      const res = await apiRequest("POST", `/api/championship-phases/${phaseId}/notify-selected`, {});
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Notifications sent", description: `${data.selected} selected, ${data.notSelected} not selected schools emailed.` });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // ── helpers ────────────────────────────────────────────────────
  const getStatusBadge = (status: string) => {
    const map: Record<string, { color: string; Icon: any }> = {
      pending:      { color: "bg-yellow-100 text-yellow-800", Icon: Clock },
      under_review: { color: "bg-blue-100 text-blue-800",    Icon: AlertCircle },
      selected:     { color: "bg-green-100 text-green-800",  Icon: CheckCircle },
      not_selected: { color: "bg-red-100 text-red-800",      Icon: XCircle },
      waitlisted:   { color: "bg-purple-100 text-purple-800",Icon: Clock },
      withdrawn:    { color: "bg-gray-100 text-gray-800",    Icon: XCircle },
    };
    const { color, Icon } = map[status] || map.pending;
    return (
      <Badge className={`${color} flex items-center gap-1`} variant="outline">
        <Icon className="h-3 w-3" />
        {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  if (!selectedYearId) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Please select a season first to manage phases and registrations.
        </CardContent>
      </Card>
    );
  }

  // ── render ─────────────────────────────────────────────────────
  return (
    <>
      <Tabs defaultValue="phases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="phases">Championship Phases</TabsTrigger>
          <TabsTrigger value="registrations">School Registrations</TabsTrigger>
        </TabsList>

        {/* ── Phases tab ── */}
        <TabsContent value="phases">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Championship Phases</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  The competition dates below control the public homepage countdown. Update a date here whenever the schedule changes.
                </p>
              </div>
              <Button size="sm" onClick={() => setIsCreatePhaseOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Phase
              </Button>
            </CardHeader>
            <CardContent>
              {phasesLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading championship phases...</div>
              ) : phasesError ? (
                <div className="py-8 text-center text-destructive">
                  {(phasesQueryError as Error)?.message || "Unable to load championship phases. Please sign in again if your admin session expired."}
                </div>
              ) : phaseList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No phases yet. Add your first championship phase.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>State</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Competition Date</TableHead>
                      <TableHead>Max Schools</TableHead>
                      <TableHead>Registrations</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {phaseList.map((phase) => {
                      const phaseRegs     = registrationList.filter((r) => r.phaseId === phase.id);
                      const selectedCount = phaseRegs.filter((r) => r.status === "selected").length;
                      return (
                        <TableRow key={phase.id}>
                          <TableCell className="font-medium">{phase.stateName}</TableCell>
                          <TableCell>{phase.venue || "—"}</TableCell>
                          <TableCell>
                            {phase.competitionDate
                              ? new Date(phase.competitionDate).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell>{phase.maxSchools}</TableCell>
                          <TableCell>
                            <button
                              className="text-sm text-emerald-600 hover:underline"
                              onClick={() => setSelectedPhaseId(phase.id)}
                            >
                              {phaseRegs.length} schools
                              {selectedCount > 0 && ` (${selectedCount} selected)`}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" title="Edit phase"
                                onClick={() => setEditingPhase({ ...phase })}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" title="Delete phase"
                                onClick={() => deletePhaseMutation.mutate(phase.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Registrations tab ── */}
        <TabsContent value="registrations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>School Registrations</CardTitle>
                {selectedPhaseId && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Viewing: {phases.find((p) => p.id === selectedPhaseId)?.stateName || ""}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedPhaseId?.toString() || "all"}
                  onValueChange={(val) => setSelectedPhaseId(val === "all" ? null : parseInt(val))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Phases</SelectItem>
                    {phaseList.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.stateName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPhaseId && (
                  <Button size="sm" onClick={() => notifySchoolsMutation.mutate(selectedPhaseId)}
                    disabled={notifySchoolsMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700">
                    <Mail className="mr-2 h-4 w-4" />
                    Notify Selected
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {registrationsLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading school registrations...</div>
              ) : registrationsError ? (
                <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {(registrationsQueryError as Error)?.message || "Unable to load school registrations. Please sign in again if your admin session expired."}
                </div>
              ) : visibleRegistrations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {selectedPhaseId ? "No registrations yet for this phase." : "No school registrations yet."}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Coordinator</TableHead>
                      <TableHead>Athletes</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleRegistrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.schoolName}</TableCell>
                        <TableCell>{reg.state}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{reg.coordinatorName}</div>
                            <div className="text-muted-foreground text-xs">{reg.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{reg.athleteCount}</TableCell>
                        <TableCell className="capitalize">{reg.category}</TableCell>
                        <TableCell>{getStatusBadge(reg.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" title="View details"
                              onClick={() => setViewingRegistration(reg)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Select
                              value={reg.status}
                              onValueChange={(status) =>
                                updateRegistrationMutation.mutate({ id: reg.id, status })
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="under_review">Under Review</SelectItem>
                                <SelectItem value="selected">Selected</SelectItem>
                                <SelectItem value="not_selected">Not Selected</SelectItem>
                                <SelectItem value="waitlisted">Waitlisted</SelectItem>
                                <SelectItem value="withdrawn">Withdrawn</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Create Phase Dialog ────────────────────────────────────── */}
      <Dialog open={isCreatePhaseOpen} onOpenChange={setIsCreatePhaseOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Championship Phase</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label>State Name *</Label>
              <Input value={newPhase.stateName}
                onChange={(e) => setNewPhase({ ...newPhase, stateName: e.target.value })}
                placeholder="e.g., Delta" />
            </div>
            <div>
              <Label>Venue</Label>
              <Input value={newPhase.venue}
                onChange={(e) => setNewPhase({ ...newPhase, venue: e.target.value })}
                placeholder="Competition venue" />
            </div>
            <div>
              <Label>Registration Opens</Label>
              <Input type="datetime-local" value={newPhase.registrationOpens}
                onChange={(e) => setNewPhase({ ...newPhase, registrationOpens: e.target.value })} />
            </div>
            <div>
              <Label>Registration Closes</Label>
              <Input type="datetime-local" value={newPhase.registrationCloses}
                onChange={(e) => setNewPhase({ ...newPhase, registrationCloses: e.target.value })} />
            </div>
            <div>
              <Label>Competition Date</Label>
              <Input type="datetime-local" value={newPhase.competitionDate}
                onChange={(e) => setNewPhase({ ...newPhase, competitionDate: e.target.value })} />
            </div>
            <div>
              <Label>Max Schools</Label>
              <Input type="number" value={newPhase.maxSchools}
                onChange={(e) => setNewPhase({ ...newPhase, maxSchools: parseInt(e.target.value) })} />
            </div>
            <div className="col-span-2">
              <Label>WhatsApp Group Link <span className="text-xs text-muted-foreground">(unique per state)</span></Label>
              <Input value={newPhase.whatsappGroupLink}
                onChange={(e) => setNewPhase({ ...newPhase, whatsappGroupLink: e.target.value })}
                placeholder="https://chat.whatsapp.com/..." />
            </div>
          </div>
          <Button onClick={() => createPhaseMutation.mutate(newPhase)}
            disabled={createPhaseMutation.isPending} className="w-full">
            {createPhaseMutation.isPending ? "Creating..." : "Create Phase"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* ── Edit Phase Dialog ──────────────────────────────────────── */}
      <Dialog open={!!editingPhase} onOpenChange={(open) => { if (!open) setEditingPhase(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Phase — {editingPhase?.stateName}</DialogTitle>
          </DialogHeader>
          {editingPhase && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Venue</Label>
                <Input value={editingPhase.venue || ""}
                  onChange={(e) => setEditingPhase({ ...editingPhase, venue: e.target.value })}
                  placeholder="Competition venue" />
              </div>
              <div>
                <Label>Competition Date</Label>
                <Input type="datetime-local"
                  value={editingPhase.competitionDate
                    ? new Date(editingPhase.competitionDate).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setEditingPhase({ ...editingPhase, competitionDate: e.target.value })} />
              </div>
              <div>
                <Label>Max Schools</Label>
                <Input type="number" value={editingPhase.maxSchools || 9}
                  onChange={(e) => setEditingPhase({ ...editingPhase, maxSchools: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label>
                  WhatsApp Group Link
                  <span className="ml-1 text-xs text-muted-foreground">(unique per state — sent in selection emails)</span>
                </Label>
                <Input value={editingPhase.whatsappGroupLink || ""}
                  onChange={(e) => setEditingPhase({ ...editingPhase, whatsappGroupLink: e.target.value })}
                  placeholder="https://chat.whatsapp.com/..." />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setEditingPhase(null)}>Cancel</Button>
                <Button onClick={() => updatePhaseMutation.mutate(editingPhase)}
                  disabled={updatePhaseMutation.isPending}>
                  {updatePhaseMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── View Registration Dialog ───────────────────────────────── */}
      <Dialog open={!!viewingRegistration} onOpenChange={(open) => { if (!open) setViewingRegistration(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingRegistration?.schoolName} — Registration Details</DialogTitle>
          </DialogHeader>
          {viewingRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["School",      viewingRegistration.schoolName],
                  ["State",       viewingRegistration.state],
                  ["Address",     viewingRegistration.schoolAddress],
                  ["Principal",   viewingRegistration.principalName],
                  ["Coordinator", viewingRegistration.coordinatorName],
                  ["Email",       viewingRegistration.email],
                  ["Phone",       viewingRegistration.coordinatorPhone],
                  ["WhatsApp",    viewingRegistration.whatsappNumber],
                  ["Athletes",    viewingRegistration.athleteCount],
                  ["Category",    viewingRegistration.category],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <Label className="text-xs text-muted-foreground">{label}</Label>
                    <p className="capitalize">{value || "—"}</p>
                  </div>
                ))}
              </div>

              {viewingRegistration.eventsCategories && (
                <div>
                  <Label className="text-xs text-muted-foreground">Events / Categories</Label>
                  <p className="text-sm">{viewingRegistration.eventsCategories}</p>
                </div>
              )}

              {viewingRegistration.additionalNotes && (
                <div>
                  <Label className="text-xs text-muted-foreground">Additional Notes</Label>
                  <p className="text-sm">{viewingRegistration.additionalNotes}</p>
                </div>
              )}

              <div className="border-t pt-4 space-y-4">
                <div>
                  <Label>Change Status</Label>
                  <Select
                    value={viewingRegistration.status}
                    onValueChange={(status) => {
                      updateRegistrationMutation.mutate({ id: viewingRegistration.id, status });
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="selected">Selected</SelectItem>
                      <SelectItem value="not_selected">Not Selected</SelectItem>
                      <SelectItem value="waitlisted">Waitlisted</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Admin Notes</Label>
                  <Textarea
                    className="mt-1"
                    placeholder="Internal notes (not sent to school)..."
                    defaultValue={viewingRegistration.adminNotes || ""}
                    onBlur={(e) =>
                      updateRegistrationMutation.mutate({
                        id: viewingRegistration.id,
                        status: viewingRegistration.status,
                        adminNotes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
