import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Trophy, Image, Mail, Newspaper } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { News, Event, Player, Club, Media, Contact } from "@/types/schema";

export default function AdminDashboard() {
  const { data: news = [] } = useQuery<News[]>({ queryKey: ["/api/news"] });
  const { data: events = [] } = useQuery<Event[]>({ queryKey: ["/api/events"] });
  const { data: players = [] } = useQuery<Player[]>({ queryKey: ["/api/players"] });
  const { data: clubs = [] } = useQuery<Club[]>({ queryKey: ["/api/clubs"] });
  const { data: mediaItems = [] } = useQuery<Media[]>({ queryKey: ["/api/media"] });
  const { data: contacts = [] } = useQuery<Contact[]>({ queryKey: ["/api/contacts"] });

  const stats = [
    { label: "Total News Articles", value: news.length.toString(), icon: Newspaper, color: "text-blue-600" },
    { label: "Upcoming Events", value: events.length.toString(), icon: Calendar, color: "text-green-600" },
    { label: "Registered Players", value: players.length.toString(), icon: Users, color: "text-purple-600" },
    { label: "Active Clubs", value: clubs.length.toString(), icon: Trophy, color: "text-orange-600" },
    { label: "Media Items", value: mediaItems.length.toString(), icon: Image, color: "text-pink-600" },
    { label: "Contact Messages", value: contacts.length.toString(), icon: Mail, color: "text-red-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome to NRSA Admin Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">No recent activity to display.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Use the sidebar navigation to manage website content.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
