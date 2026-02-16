import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";

export default function AdminSettings() {
  const API_URL = "/api/site-settings";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteTitle: "Nigeria Rope Skipping Association",
    phone: "+2347069465965",
    email: "info@nrsa.ng",
    about: "",
    facebook: "",
    twitter: "",
    instagram: "",
  });

  // Fetch settings on load
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("GET", API_URL);
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequest("POST", API_URL, settings);
      alert("✅ Settings updated successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("❌ Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="text-center text-muted-foreground py-12">
        Loading site settings...
      </p>
    );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage website configuration
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Site Title</Label>
              <Input
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input name="phone" value={settings.phone} onChange={handleChange} />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input name="email" value={settings.email} onChange={handleChange} />
            </div>
            <div>
              <Label>About Text (Homepage)</Label>
              <Textarea
                name="about"
                className="min-h-[120px]"
                value={settings.about}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Facebook URL</Label>
              <Input
                name="facebook"
                placeholder="https://facebook.com/nrsa"
                value={settings.facebook}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Twitter URL</Label>
              <Input
                name="twitter"
                placeholder="https://twitter.com/nrsa"
                value={settings.twitter}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input
                name="instagram"
                placeholder="https://instagram.com/nrsa"
                value={settings.instagram}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
