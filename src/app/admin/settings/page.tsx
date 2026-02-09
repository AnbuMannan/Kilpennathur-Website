"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
  description: string | null;
  category: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/site-settings");
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
      } else {
        toast.error("Failed to load settings");
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (res.ok) {
        toast.success("Setting updated successfully");
        setSettings((prev) =>
          prev.map((s) => (s.key === key ? { ...s, value } : s))
        );
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update setting");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    for (const setting of settings) {
      let value: string;
      const formValue = formData.get(setting.key);

      // Checkbox: unchecked = null, checked = "true"
      if (setting.category === "display" && formValue === null) {
        value = "false";
      } else if (formValue !== null) {
        value = String(formValue);
      } else {
        continue;
      }

      if (value !== setting.value) {
        await updateSetting(setting.key, value);
      }
    }
  };

  const groupedSettings = settings.reduce(
    (acc, setting) => {
      if (!acc[setting.category]) acc[setting.category] = [];
      acc[setting.category].push(setting);
      return acc;
    },
    {} as Record<string, Setting[]>
  );

  if (loading)
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-96 bg-gray-100 rounded" />
        </div>
      </div>
    );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Site Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure pagination, display options, and SEO settings
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="pagination" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pagination">Pagination</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="pagination">
            <Card>
              <CardHeader>
                <CardTitle>Pagination Settings</CardTitle>
                <CardDescription>
                  Configure how many items to display per page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupedSettings.pagination?.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    <Input
                      id={setting.key}
                      name={setting.key}
                      type="number"
                      min={1}
                      max={50}
                      defaultValue={setting.value}
                    />
                    {setting.description && (
                      <p className="text-sm text-gray-500">
                        {setting.description}
                      </p>
                    )}
                  </div>
                ))}
                {(!groupedSettings.pagination || groupedSettings.pagination.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No pagination settings found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Configure what elements to show on the site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupedSettings.display?.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        id={setting.key}
                        name={setting.key}
                        type="checkbox"
                        defaultChecked={setting.value === "true"}
                        value="true"
                        className="h-4 w-4 rounded border-input"
                      />
                      <Label htmlFor={setting.key}>{setting.label}</Label>
                    </div>
                    {setting.description && (
                      <p className="text-sm text-gray-500">
                        {setting.description}
                      </p>
                    )}
                  </div>
                ))}
                {(!groupedSettings.display || groupedSettings.display.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No display settings found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Site name and general configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupedSettings.general?.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    <Input
                      id={setting.key}
                      name={setting.key}
                      defaultValue={setting.value}
                    />
                    {setting.description && (
                      <p className="text-sm text-gray-500">
                        {setting.description}
                      </p>
                    )}
                  </div>
                ))}
                {(!groupedSettings.general || groupedSettings.general.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No general settings found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Default meta descriptions and SEO-related options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupedSettings.seo?.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    <Input
                      id={setting.key}
                      name={setting.key}
                      defaultValue={setting.value}
                    />
                    {setting.description && (
                      <p className="text-sm text-gray-500">
                        {setting.description}
                      </p>
                    )}
                  </div>
                ))}
                {(!groupedSettings.seo || groupedSettings.seo.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No SEO settings found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button type="submit" size="lg" disabled={saving}>
            <Save className="w-5 h-5 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
