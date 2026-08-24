import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/schema";

export default function AdminEvents() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    city: "",
    state: "",
    eventDate: "",
    registrationDeadline: "",
    registrationLink: "",
    imageUrl: "",
    isFeatured: false,
  });

  const fetchEvents = async () => {
    try {
      const res = await apiRequest("GET", "/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async () => {
    try {
      const method = editEvent ? "PATCH" : "POST";
      const url = editEvent ? `/api/events/${editEvent.id}` : "/api/events";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        const savedEvent = await res.json();
        
        if (editEvent) {
          setEvents(items => items.map(item => 
            item.id === editEvent.id ? savedEvent : item
          ));
        } else {
          setEvents(items => [savedEvent, ...items]);
        }

        toast({
          title: editEvent ? "Event Updated" : "Event Added",
          description: "Event details saved successfully!",
        });
        setIsDialogOpen(false);
        setEditEvent(null);
        setForm({
          title: "",
          description: "",
          venue: "",
          city: "",
          state: "",
          eventDate: "",
          registrationDeadline: "",
          registrationLink: "",
          imageUrl: "",
          isFeatured: false,
        });
      } else {
        throw new Error('Save failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save event.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
      });
      if (res.ok || res.status === 204) {
        setEvents(items => items.filter(item => item.id !== id));
        toast({
          title: "Event Deleted",
          description: "The event has been removed successfully.",
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    }
  };

  // Handle Form Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = 'checked' in target ? target.checked : false;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (event: Event) => {
    setEditEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      venue: event.venue,
      city: event.city,
      state: event.state,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : "",
      registrationDeadline: event.registrationDeadline
        ? new Date(event.registrationDeadline).toISOString().slice(0, 16)
        : "",
      registrationLink: (event as any).registrationLink || "",
      imageUrl: event.imageUrl || "",
      isFeatured: event.isFeatured,
    });
    setIsDialogOpen(true);
  };



  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage upcoming events and competitions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setEditEvent(null)}
              data-testid="button-add-event"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editEvent ? "Edit Event" : "Add Event"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {[
                { label: "Event Title *", name: "title" as const, type: "text" },
                { label: "Description *", name: "description" as const, type: "textarea" },
                { label: "Venue *", name: "venue" as const, type: "text" },
                { label: "City *", name: "city" as const, type: "text" },
                { label: "State *", name: "state" as const, type: "text" },
              ].map((field, idx) => (
                <div key={idx}>
                  <Label>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      name={field.name}
                      value={form[field.name] as string}
                      onChange={handleChange}
                      className="min-h-[120px]"
                    />
                  ) : (
                    <Input
                      name={field.name}
                      value={form[field.name] as string}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Event Date *</Label>
                  <Input
                    type="datetime-local"
                    name="eventDate"
                    value={form.eventDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Registration Deadline</Label>
                  <Input
                    type="datetime-local"
                    name="registrationDeadline"
                    value={form.registrationDeadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label>Registration Link (Optional)</Label>
                <Input
                  type="url"
                  name="registrationLink"
                  placeholder="https://example.com/register"
                  value={form.registrationLink}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  If provided, the "Register Now" button will open this link
                </p>
              </div>

              <ImageUpload
                label="Event Image"
                value={form.imageUrl}
                onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
              />

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, isFeatured: checked }))
                  }
                />
                <Label>Featured Event</Label>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleSave}
              >
                {editEvent ? "Update Event" : "Save Event"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading events...</p>
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No events yet. Click "Add Event" to create one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="p-4">
              <CardContent>
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.city}, {event.state}</p>
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(event)}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
