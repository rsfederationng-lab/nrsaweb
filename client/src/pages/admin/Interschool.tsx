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
import { Plus, Trash2, Trophy, FileText } from "lucide-react";
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
    schoolName: string;
    state: string;
    points: number;
    logoUrl?: string; // Optional
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


    // --- STANDINGS ---
    const { data: standings = [], isError: isStandingsError } = useQuery<SchoolStanding[]>({
        queryKey: ["/api/school-standings", { yearId: selectedYearId }],
        enabled: !!selectedYearId,
    });

    const selectedYear = years.find(y => y.id === selectedYearId);

    const createStandingMutation = useMutation({
        mutationFn: async (data: Partial<SchoolStanding>) => {
            const res = await apiRequest("POST", "/api/school-standings", { ...data, yearId: selectedYearId! });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/school-standings"] });
            toast({ title: "Success", description: "School added to standings." });
            setNewStanding({ schoolName: "", state: "", points: 0 }); // Reset form
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: "Failed to add standing.", variant: "destructive" });
        }
    });

    const deleteStandingMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/school-standings/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/school-standings"] });
            toast({ title: "Success", description: "School removed." });
        }
    });

    // --- INTERSCHOOL NEWS ---
    const { data: newsItems = [] } = useQuery<InterschoolNews[]>({
        queryKey: ["/api/interschool-news", { yearId: selectedYearId }],
        enabled: !!selectedYearId,
    });

    const createNewsMutation = useMutation({
        mutationFn: async (data: { title: string; content: string; imageUrl?: string }) => {
            const res = await apiRequest("POST", "/api/interschool-news", { ...data, yearId: selectedYearId! });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/interschool-news"] });
            toast({ title: "Success", description: "News item created." });
            setNewNews({ title: "", content: "", imageUrl: "" });
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    });

    const deleteNewsMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/interschool-news/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/interschool-news"] });
            toast({ title: "Success", description: "News item deleted." });
        }
    });





    // Form States
    const [newYear, setNewYear] = useState<Partial<InterschoolYear>>({
        year: "",
        logoUrl: "/branding/nrsa_logo_sm.png",
        isActive: false,
        themeColor: "#10b981",
        videoUrl: "",
        description: "",
        aboutImageUrl: ""
    }); // Default proper path?
    const [newStanding, setNewStanding] = useState({ schoolName: "", state: "", points: 0 });
    const [newNews, setNewNews] = useState({ title: "", content: "", imageUrl: "" });
    const [selectedNewsItem, setSelectedNewsItem] = useState<InterschoolNews | null>(null);


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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                Rankings & Standings {selectedYear && <span className="text-muted-foreground font-normal text-base">- {selectedYear.year}</span>}
                            </CardTitle>
                            <CardDescription>Manage points for participating schools.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isStandingsError && (
                                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm mb-4">
                                    Failed to load standings. Please try refreshing the page.
                                </div>
                            )}
                            {/* Add Form */}
                            <div className="grid grid-cols-12 gap-2 items-end border-b pb-4">
                                <div className="col-span-4 space-y-1">
                                    <label className="text-xs">School Name</label>
                                    <Input
                                        placeholder="School Name"
                                        value={newStanding.schoolName}
                                        onChange={(e) => setNewStanding({ ...newStanding, schoolName: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-4 space-y-1">
                                    <label className="text-xs">State</label>
                                    <Input
                                        placeholder="State"
                                        value={newStanding.state}
                                        onChange={(e) => setNewStanding({ ...newStanding, state: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs">Points</label>
                                    <Input
                                        type="number"
                                        value={newStanding.points}
                                        onChange={(e) => setNewStanding({ ...newStanding, points: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Button
                                        className="w-full"
                                        onClick={() => createStandingMutation.mutate(newStanding)}
                                        disabled={!newStanding.schoolName || createStandingMutation.isPending}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* List */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rank</TableHead>
                                        <TableHead>School</TableHead>
                                        <TableHead>Pts</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {standings.map((s, i) => (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-bold">{i + 1}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{s.schoolName}</div>
                                                <div className="text-xs text-muted-foreground">{s.state}</div>
                                            </TableCell>
                                            <TableCell>{s.points}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteStandingMutation.mutate(s.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {standings.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                                                No standings yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
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
