import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Mail, Phone, Calendar, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Contact } from "@/types/schema";

export default function AdminContacts() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await apiRequest("GET", "/api/contacts");
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      setContacts(items => items.filter(item => item.id !== id));
      toast({
        title: "Message deleted",
        description: "The contact message has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete message.",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        credentials: "include",
        body: JSON.stringify({ isRead: true }),
      });
      if (!res.ok) throw new Error('Update failed');
      setContacts(items => items.map(item => 
        item.id === id ? { ...item, isRead: true } : item
      ));
    } catch (error) {
      console.error("Failed to mark contact read:", error);
    }
  };

  const handleViewMessage = (contact: Contact) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);

    if (!contact.isRead) {
      markAsRead(contact.id);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
          Contact Messages
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage messages sent through the contact form
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading messages...</p>
          </CardContent>
        </Card>
      ) : contacts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No contact messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader className="bg-primary/10">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id} data-testid={`row-contact-${contact.id}`}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell className="max-w-md truncate">{contact.subject}</TableCell>
                  <TableCell>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={contact.isRead ? "secondary" : "default"}
                      className={contact.isRead ? "" : "bg-primary"}
                    >
                      {contact.isRead ? "Read" : "New"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewMessage(contact)}
                        data-testid={`button-view-${contact.id}`}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                        data-testid={`button-delete-${contact.id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium" data-testid="text-contact-name">
                      {selectedContact.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium break-all" data-testid="text-contact-email">
                      {selectedContact.email}
                    </p>
                  </div>
                </div>

                {selectedContact.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium" data-testid="text-contact-phone">
                        {selectedContact.phone}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date Received</p>
                    <p className="font-medium">
                      {new Date(selectedContact.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Subject</p>
                <p className="font-semibold text-lg" data-testid="text-contact-subject">
                  {selectedContact.subject}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <div
                  className="bg-muted/30 p-4 rounded-lg min-h-[200px]"
                  data-testid="text-contact-message"
                >
                  <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => setViewDialogOpen(false)}
                  className="flex-1"
                  data-testid="button-close-dialog"
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedContact.id);
                    setViewDialogOpen(false);
                  }}
                  data-testid="button-delete-from-dialog"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
