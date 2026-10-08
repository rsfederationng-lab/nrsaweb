import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Trophy, FileText, Star, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { queryClient } from "@/lib/queryClient";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Link } from "wouter";
import { PhaseRegistrationManager } from "@/components/admin/PhaseRegistrationManager";

// Types matching the schema
interface InterschoolYear {
    id: number;
    year: string;
    logoUrl: string;
    isActive: boolean;
    themeColor: string;
    videoUrl?: string; // Optional
    description?: string; // Optional
    aboutImageUrl?: string; // Optional
}

interface SchoolStanding {
    id: number;
    yearId: number;
    phaseId?: number | null;
    schoolName: string;
    state: string;
    points: number;
    rank?: number;
    qualifiedForNational?: boolean;
    logoUrl?: string;
}

interface InterschoolNews {
    id: number;
    yearId: number;
    title: string;
    content: string;
    imageUrl?: string;
    publishedAt: string;
}



export default function AdminInterschool() {
    const { toast } = useToast();
    const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
    const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);

    // --- Site Settings ---
    const { data: siteSettings = [] } = useQuery<any[]>({
        queryKey: ["/api/site-settings"],
    });

    const updateSettingMutation = useMutation({
        mutationFn: async ({ key, value }: { key: string; value: string }) => {
            const res = await apiRequest("POST", "/api/site-settings", { key, value });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to save: ${res.status} ${errorText}`);
            }
            return await res.json();
        },
        onSuccess: async () => {
            // Force refetch the settings
            await queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
            await queryClient.refetchQueries({ queryKey: ["/api/site-settings"] });
            toast({ title: "Setting Updated", description: "The configuration has been saved." });
        },
        onError: (e: any) => {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        }
    });

    const [videoUrl, setVideoUrl] = useState("");
    const [disciplinesYoutubeUrl, setDisciplinesYoutubeUrl] = useState("");

    // Update local state when settings load
    useEffect(() => {
        if (siteSettings) {
            const videoSetting = siteSettings.find((s: any) => s.key === "interschool_video_url");
            if (videoSetting) setVideoUrl(videoSetting.value);
            const disciplinesSetting = siteSettings.find((s: any) => s.key === "interschool_disciplines_youtube_url");
            if (disciplinesSetting) setDisciplinesYoutubeUrl(disciplinesSetting.value);
        }
    }, [siteSettings]);

    // --- YEARS ---
    const { data: years = [], isLoading: isLoadingYears, isError: isYearsError } = useQuery<InterschoolYear[]>({
        queryKey: ["/api/interschool-years"],
    });

    const createYearMutation = useMutation({
        mutationFn: async (data: Partial<InterschoolYear>) => {
            // Explicitly send defaults to avoid Zod/Drizzle validation issues
            const payload = {
                ...data,
                isActive: data.isActive ?? false,
                themeColor: data.themeColor || "#10b981"
            };
            const res = await apiRequest("POST", "/api/interschool-years", payload);
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["/api/interschool-years"] });
            toast({ title: "Success", description: "Season created successfully." });
            setIsYearDialogOpen(false);
            // Optionally select the new year?
            // setSelectedYearId(data.id); 
        },
        onError: (error: Error) => {
            toast({
                title: "Error Creating Season",
                description: error.message || "Failed to create season. Please check console.",
                variant: "destructive"
            });
            console.error("Create Year Error:", error);
        }
    });

    const toggleActiveMutation = useMutation({
        mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
            const res = await apiRequest("PATCH", `/api/interschool-years/${id}`, { isActive });
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/interschool-years"] }),
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    });

    const updateYearMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<InterschoolYear> }) => {
            const res = await apiRequest("PATCH", `/api/interschool-years/${id}`, data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/interschool-years"] });
            toast({ title: "Success", description: "Season updated successfully." });
            setIsYearDialogOpen(false);
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    });

    const deleteYearMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/interschool-years/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/interschool-years"] });
            toast({ title: "Success", description: "Season deleted successfully." });
            setSelectedYearId(null);
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    });

    // Default to active year or first year
    useEffect(() => {
        if (!selectedYearId && years.length > 0) {
            const active = years.find((y) => y.isActive);
            setSelectedYearId(active ? active.id : years[0].id);
        }
    }, [years, selectedYearId]);


    // --- PHASES (for standings grouping) ---
    const { data: phases = [] } = useQuery<any[]>({
        queryKey: ["/api/championship-phases", { yearId: selectedYearId }],
        enabled: !!selectedYearId,
        queryFn: async () => {
            if (!selectedYearId) return [];
            const res = await apiRequest("GET", `/api/championship-phases?yearId=${selectedYearId}`);
            if (!res.ok) return [];
            return res.json();
        },
    });

    // --- STANDINGS ---
    const { data: standings = [], isError: isStandingsError } = useQuery<SchoolStanding[]>({
        queryKey: ["/api/school-standings", { yearId: selectedYearId }],
        enabled: !!selectedYearId,
    });

    const selectedYear = years.find(y => y.id === selectedYearId);

    const createStandingMutation = useMutation({
        mutationFn: async (data: Partial<SchoolStanding>) => {
            const res = await apiRequest("POST", "/api/school-standings", { ...data, yearId: selectedYearId! });
            if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `${res.status}`); }
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/school-standings"] }),
        onError: (e: any) => toast({ title: "Error saving standing", description: e.message, variant: "destructive" }),
    });

    const updateStandingMutation = useMutation({
        mutationFn: async ({ id, ...data }: Partial<SchoolStanding> & { id: number }) => {
            const res = await apiRequest("PATCH", `/api/school-standings/${id}`, data);
            if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `${res.status}`); }
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/school-standings"] }),
        onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
    });

    const deleteStandingMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await apiRequest("DELETE", `/api/school-standings/${id}`);
            if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `${res.status}`); }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/school-standings"] });
            toast({ title: "School removed." });
        },
        onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
    });

    // --- INTERSCHOOL NEWS ---
    const { data: newsItems = [] } = useQuery<InterschoolNews[]>({
        queryKey: ["/api/interschool-news", { yearId: selectedYearId }],
        enabled: !!selectedYearId,
    });

    const createNewsMutation = useMutation({
        mutationFn: async (data: { title: string; content: string; imageUrl?: string }) => {
            const res = await apiRequest("POST", "/api/interschool-news", { ...data, yearId: selectedYearId! });
            if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `${res.status}`); }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/interschool-news"] });
            toast({ title: "News added successfully." });
            setNewNews({ title: "", content: "", imageUrl: "" });
        },
        onError: (e: any) => toast({ title: "Error saving news", description: e.message, variant: "destructive" }),
    });

    const deleteNewsMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await apiRequest("DELETE", `/api/interschool-news/${id}`);
            if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `${res.status}`); }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/interschool-news"] });
            toast({ title: "News item deleted." });
        },
        onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
    });





    // Form States
    const [newYear, setNewYear] = useState<Partial<InterschoolYear>>({
        year: "", logoUrl: "/branding/nrsa_logo_sm.png", isActive: false,
        themeColor: "#10b981", videoUrl: "", description: "", aboutImageUrl: ""
    });
    const [newNews, setNewNews] = useState({ title: "", content: "", imageUrl: "" });
    const [selectedNewsItem, setSelectedNewsItem] = useState<InterschoolNews | null>(null);

    // Phase-based standings form state
    const [standingPhaseId, setStandingPhaseId] = useState<number | null>(null);
    const [phaseResults, setPhaseResults] = useState({
        first: "", second: "", third: "",
        firstPoints: 0, secondPoints: 0, thirdPoints: 0,
        qualifiedFirst: true,
    });


    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Interschool Management</h1>
                    {isLoadingYears && <p className="text-sm text-muted-foreground">Loading seasons...</p>}
                    {isYearsError && <p className="text-sm text-destructive">Failed to load seasons.</p>}
                </div>

                <Dialog open={isYearDialogOpen} onOpenChange={setIsYearDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setNewYear({ year: "", logoUrl: "/branding/nrsa_logo_sm.png", isActive: false, themeColor: "#10b981", videoUrl: "", description: "", aboutImageUrl: "" })}>
                            <Plus className="mr-2 h-4 w-4" /> New Season
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{newYear.id ? "Edit Season" : "Start a New Season"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label>Year / Season Name</label>
                                    <Input
                                        placeholder="e.g. 2025"
                                        value={newYear.year}
                                        onChange={(e) => setNewYear({ ...newYear, year: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label>Video URL (YouTube/MP4)</label>
                                    <Input
                                        placeholder="https://..."
                                        value={newYear.videoUrl || ""}
                                        onChange={(e) => setNewYear({ ...newYear, videoUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label>About / Description</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Brief description about this season..."
                                    value={newYear.description || ""}
                                    onChange={(e) => setNewYear({ ...newYear, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <ImageUpload
                                        label="Season Logo"
                                        value={newYear.logoUrl || ""}
                                        onChange={(url) => setNewYear({ ...newYear, logoUrl: url })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <ImageUpload
                                        label="About Image (Roadmap)"
                                        value={newYear.aboutImageUrl || ""}
                                        onChange={(url) => setNewYear({ ...newYear, aboutImageUrl: url })}
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={() => {
                                    if (newYear.id) {
                                        updateYearMutation.mutate({ id: newYear.id!, data: newYear });
                                    } else {
                                        createYearMutation.mutate(newYear);
                                    }
                                }}
                                disabled={!newYear.year || createYearMutation.isPending || updateYearMutation.isPending}
                                className="w-full"
                            >
                                {createYearMutation.isPending || updateYearMutation.isPending ? "Saving..." : (newYear.id ? "Update Season" : "Create Season")}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Season Selector */}
            <div className="flex items-center gap-4">
                <span className="font-medium">Select Season:</span>
                <Select
                    value={selectedYearId?.toString()}
                    onValueChange={(val) => setSelectedYearId(parseInt(val))}
                    disabled={years.length === 0}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={years.length === 0 ? "No Seasons" : "Select Year"} />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((y) => (
                            <SelectItem key={y.id} value={y.id.toString()}>
                                {y.year} {y.isActive && "(Active)"}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {selectedYearId && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const yearToEdit = years.find(y => y.id === selectedYearId);
                                if (yearToEdit) {
                                    setNewYear(yearToEdit);
                                    setIsYearDialogOpen(true);
                                }
                            }}
                        >
                            Edit Details
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const loadingYear = years.find(y => y.id === selectedYearId);
                                if (loadingYear) toggleActiveMutation.mutate({ id: loadingYear.id, isActive: !loadingYear.isActive });
                            }}
                        >
                            {years.find(y => y.id === selectedYearId)?.isActive ? "Deactivate" : "Set Active"}
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="w-9 h-9"
                            onClick={() => {
                                if (confirm("Are you sure you want to delete this season? This action cannot be undone and will delete all associated standings and activations.")) {
                                    if (selectedYearId) deleteYearMutation.mutate(selectedYearId);
                                }
                            }}
                            disabled={deleteYearMutation.isPending}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Global Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Global Settings</CardTitle>
                    <CardDescription>Manage general interschool configurations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label>Interschool Introduction Video URL</Label>
                            <Input
                                placeholder="https://youtube.com/..."
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => updateSettingMutation.mutate({ key: "interschool_video_url", value: videoUrl })}
                            disabled={updateSettingMutation.isPending}
                        >
                            {updateSettingMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>

                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label>9 Disciplines YouTube Course Link</Label>
                            <p className="text-xs text-muted-foreground">
                                Paste the YouTube playlist or course link here. It will appear on the school registration form so schools can watch all 9 discipline videos before registering.
                            </p>
                            <Input
                                placeholder="https://youtube.com/playlist?list=..."
                                value={disciplinesYoutubeUrl}
                                onChange={(e) => setDisciplinesYoutubeUrl(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => updateSettingMutation.mutate({ key: "interschool_disciplines_youtube_url", value: disciplinesYoutubeUrl })}
                            disabled={updateSettingMutation.isPending}
                        >
                            {updateSettingMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {selectedYearId ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                Rankings & Standings
                                {selectedYear && <span className="text-muted-foreground font-normal text-base">— {selectedYear.year}</span>}
                            </CardTitle>
                            <CardDescription>
                                Record top 3 results per zone after each competition week.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isStandingsError && (
                                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                                    Failed to load standings. Please refresh.
                                </div>
                            )}

                            {/* ── Zone selector + entry form ── */}
                            <div className="rounded-xl border bg-muted/20 p-4 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Select Zone / Phase</label>
                                    <Select
                                        value={standingPhaseId?.toString() ?? ""}
                                        onValueChange={(v) => setStandingPhaseId(parseInt(v))}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Choose a phase to record results for" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {phases.map((p: any) => (
                                                <SelectItem key={p.id} value={p.id.toString()}>
                                                    {p.stateName} Phase
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {standingPhaseId && (() => {
                                    const phase = phases.find((p: any) => p.id === standingPhaseId);
                                    const existing = standings.filter((s) => s.phaseId === standingPhaseId);
                                    if (existing.length > 0) return null; // already recorded
                                    return (
                                        <div className="space-y-3">
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                                Enter results for {phase?.stateName} Phase
                                            </p>
                                            {[
                                                { label: "🥇 1st Place", key: "first" as const, pts: "firstPoints" as const, medal: "text-yellow-600" },
                                                { label: "🥈 2nd Place", key: "second" as const, pts: "secondPoints" as const, medal: "text-gray-500" },
                                                { label: "🥉 3rd Place", key: "third" as const, pts: "thirdPoints" as const, medal: "text-orange-600" },
                                            ].map(({ label, key, pts }) => (
                                                <div key={key} className="grid grid-cols-12 gap-2 items-center">
                                                    <span className="col-span-2 text-sm font-semibold">{label}</span>
                                                    <Input
                                                        className="col-span-7"
                                                        placeholder="School name"
                                                        value={phaseResults[key]}
                                                        onChange={(e) => setPhaseResults({ ...phaseResults, [key]: e.target.value })}
                                                    />
                                                    <Input
                                                        className="col-span-3"
                                                        type="number"
                                                        placeholder="Pts"
                                                        value={phaseResults[pts]}
                                                        onChange={(e) => setPhaseResults({ ...phaseResults, [pts]: parseInt(e.target.value) || 0 })}
                                                    />
                                                </div>
                                            ))}
                                            <div className="flex items-center gap-2 pt-1">
                                                <Checkbox
                                                    id="qualifyFirst"
                                                    checked={phaseResults.qualifiedFirst}
                                                    onCheckedChange={(v) => setPhaseResults({ ...phaseResults, qualifiedFirst: !!v })}
                                                />
                                                <label htmlFor="qualifyFirst" className="text-sm cursor-pointer">
                                                    Mark 1st place as <span className="font-semibold text-emerald-700">Qualified for National Final</span>
                                                </label>
                                            </div>
                                            <Button
                                                className="w-full"
                                                disabled={!phaseResults.first || createStandingMutation.isPending}
                                                onClick={() => {
                                                    const entries = [
                                                        { schoolName: phaseResults.first, rank: 1, points: phaseResults.firstPoints, qualifiedForNational: phaseResults.qualifiedFirst },
                                                        phaseResults.second && { schoolName: phaseResults.second, rank: 2, points: phaseResults.secondPoints, qualifiedForNational: false },
                                                        phaseResults.third && { schoolName: phaseResults.third, rank: 3, points: phaseResults.thirdPoints, qualifiedForNational: false },
                                                    ].filter(Boolean) as any[];
                                                    const phaseName = phases.find((p: any) => p.id === standingPhaseId)?.stateName || "";
                                                    Promise.all(entries.map(async (e) => {
                                                        const res = await apiRequest("POST", "/api/school-standings", {
                                                            ...e,
                                                            state: phaseName,
                                                            phaseId: standingPhaseId,
                                                            yearId: selectedYearId,
                                                        });
                                                        if (!res.ok) {
                                                            const err = await res.json().catch(() => ({}));
                                                            throw new Error(err.error || `${res.status}`);
                                                        }
                                                        return res.json();
                                                    })).then(() => {
                                                        queryClient.invalidateQueries({ queryKey: ["/api/school-standings"] });
                                                        toast({ title: "Results saved", description: `${phaseName} phase standings recorded.` });
                                                        setPhaseResults({ first: "", second: "", third: "", firstPoints: 0, secondPoints: 0, thirdPoints: 0, qualifiedFirst: true });
                                                        setStandingPhaseId(null);
                                                    }).catch(() => toast({ title: "Error", description: "Failed to save results.", variant: "destructive" }));
                                                }}
                                            >
                                                <Plus className="h-4 w-4 mr-2" /> Save Phase Results
                                            </Button>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* ── Zone Champions Summary ── */}
                            {phases.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Zone Results</p>
                                    {phases.map((phase: any) => {
                                        const phaseStandings = standings
                                            .filter((s) => s.phaseId === phase.id || s.state === phase.stateName)
                                            .sort((a, b) => (a.rank ?? a.points) - (b.rank ?? b.points));

                                        return (
                                            <div key={phase.id} className="rounded-xl border bg-white overflow-hidden">
                                                <div className="flex items-center justify-between px-4 py-2 bg-emerald-50 border-b">
                                                    <span className="font-bold text-emerald-800 text-sm">{phase.stateName} Phase</span>
                                                    {phaseStandings.some(s => s.qualifiedForNational) && (
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                            <CheckCircle2 className="h-3 w-3" /> Qualifier recorded
                                                        </span>
                                                    )}
                                                </div>
                                                {phaseStandings.length === 0 ? (
                                                    <p className="text-xs text-muted-foreground px-4 py-3">
                                                        No standings recorded yet for this phase. Add results after the competition.
                                                    </p>
                                                ) : (
                                                    <div className="divide-y">
                                                        {phaseStandings.map((s) => (
                                                            <div key={s.id} className="flex items-center gap-3 px-4 py-2">
                                                                <span className="text-lg">
                                                                    {s.rank === 1 ? "🥇" : s.rank === 2 ? "🥈" : "🥉"}
                                                                </span>
                                                                <div className="flex-1">
                                                                    <span className="font-medium text-sm">{s.schoolName}</span>
                                                                    {s.qualifiedForNational && (
                                                                        <span className="ml-2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                                                            ✓ National Qualifier
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {s.points > 0 && (
                                                                    <span className="text-xs text-muted-foreground font-mono">{s.points} pts</span>
                                                                )}
                                                                <Button
                                                                    variant="ghost" size="icon"
                                                                    onClick={() => deleteStandingMutation.mutate(s.id)}
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ── National Qualifiers Summary ── */}
                            {standings.some(s => s.qualifiedForNational) && (
                                <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 p-4">
                                    <p className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        National Final Qualifiers
                                    </p>
                                    <div className="space-y-1">
                                        {standings.filter(s => s.qualifiedForNational).map(s => (
                                            <div key={s.id} className="flex items-center gap-2 text-sm">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                <span className="font-semibold">{s.schoolName}</span>
                                                <span className="text-muted-foreground">— {s.state} Zone</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {phases.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Create championship phases first to record zone standings.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Activations Management */}
                    {/* Interschool News Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-500" />
                                Interschool News
                            </CardTitle>
                            <CardDescription>
                                Post news, updates, and announcements specific to this season.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Add News Form */}
                            <div className="space-y-4 border-b pb-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Title</label>
                                        <Input
                                            placeholder="News title"
                                            value={newNews.title}
                                            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Image (Optional)</label>
                                        <ImageUpload
                                            value={newNews.imageUrl || ""}
                                            onChange={(url) => setNewNews({ ...newNews, imageUrl: url })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Content</label>
                                    <textarea
                                        className="w-full min-h-[80px] px-3 py-2 border rounded-md resize-none"
                                        placeholder="News content..."
                                        value={newNews.content}
                                        onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={() => createNewsMutation.mutate(newNews)}
                                    disabled={!newNews.title || !newNews.content || createNewsMutation.isPending}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add News
                                </Button>
                            </div>

                            {/* News List */}
                            <div className="space-y-2">
                                {newsItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                        {item.imageUrl && (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-16 h-16 object-cover rounded cursor-pointer"
                                                onClick={() => setSelectedNewsItem(item)}
                                            />
                                        )}
                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => setSelectedNewsItem(item)}
                                        >
                                            <div className="font-medium">{item.title}</div>
                                            <div className="text-xs text-muted-foreground line-clamp-1">{item.content}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {new Date(item.publishedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteNewsMutation.mutate(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                {newsItems.length === 0 && (
                                    <div className="text-center py-4 text-muted-foreground text-sm">
                                        No news items yet for this season.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* News Detail Dialog */}
                    <Dialog open={!!selectedNewsItem} onOpenChange={() => setSelectedNewsItem(null)}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{selectedNewsItem?.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                {selectedNewsItem?.imageUrl && (
                                    <img
                                        src={selectedNewsItem.imageUrl}
                                        alt={selectedNewsItem.title}
                                        className="w-full h-auto rounded-lg"
                                    />
                                )}
                                <div className="text-sm text-muted-foreground">
                                    {selectedNewsItem?.publishedAt && new Date(selectedNewsItem.publishedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="text-base whitespace-pre-wrap">
                                    {selectedNewsItem?.content}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/20 rounded-xl">
                    <h2 className="text-xl font-semibold mb-2">
                        {years.length === 0 ? "No Seasons Found" : "No Season Selected"}
                    </h2>
                    <p className="text-muted-foreground">
                        {years.length === 0 ? "Create your first season using the button above." : "Select a season from the dropdown above to manage it."}
                    </p>
                </div>
            )}

            {/* Phase & Registration Management */}
            {selectedYearId && <PhaseRegistrationManager selectedYearId={selectedYearId} />}
        </div>
    );
}
