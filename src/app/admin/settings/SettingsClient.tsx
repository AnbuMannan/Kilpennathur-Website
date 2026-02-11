"use client";

import { useState, useEffect } from "react";
import { Save, Settings, Sliders, Globe, Search as SearchIcon, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
  description: string | null;
  category: string;
}

const categoryMeta: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
  general: {
    label: "General",
    icon: <Settings className="h-4 w-4" />,
    description: "Site name and core configuration",
  },
  pagination: {
    label: "Pagination",
    icon: <Sliders className="h-4 w-4" />,
    description: "Configure items shown per page across the site",
  },
  display: {
    label: "Display",
    icon: <Wrench className="h-4 w-4" />,
    description: "Toggle features and elements on the public site",
  },
  seo: {
    label: "SEO",
    icon: <Globe className="h-4 w-4" />,
    description: "Search engine optimization and meta defaults",
  },
};

const categoryOrder = ["general", "pagination", "display", "seo"];

export default function SettingsClient({ initialSettings }: { initialSettings: Setting[] }) {
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const updateSetting = async (key: string, value: string) => {
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (res.ok) {
        setSettings((prev) =>
          prev.map((s) => (s.key === key ? { ...s, value } : s))
        );
        return true;
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update setting");
        return false;
      }
    } catch {
      toast.error("An error occurred");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.target as HTMLFormElement);
    let updated = 0;

    for (const setting of settings.filter((s) => s.category === activeTab)) {
      let value: string;
      const formValue = formData.get(setting.key);

      // For display (switch) settings: if not in formData, it's "false"
      if (setting.category === "display") {
        // Switches are handled in real-time, skip form submit for them
        continue;
      } else if (formValue !== null) {
        value = String(formValue);
      } else {
        continue;
      }

      if (value !== setting.value) {
        const ok = await updateSetting(setting.key, value);
        if (ok) updated++;
      }
    }

    setSaving(false);
    toast.success(
      updated > 0 ? "Settings updated successfully" : "No changes to save"
    );
  };

  const handleSwitchChange = async (key: string, checked: boolean) => {
    const value = checked ? "true" : "false";
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
    const ok = await updateSetting(key, value);
    if (ok) {
      toast.success("Setting updated");
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

  const availableCategories = categoryOrder.filter(
    (c) => groupedSettings[c] && groupedSettings[c].length > 0
  );

  const meta = categoryMeta[activeTab] ?? {
    label: activeTab,
    icon: <Settings className="h-4 w-4" />,
    description: "",
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">Site Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Configure site behavior, display options, and SEO
        </p>
      </div>

      <div className="flex gap-6 min-h-[calc(100vh-240px)]">
        {/* Vertical tab navigation */}
        <nav className="w-48 shrink-0">
          <div className="sticky top-4 space-y-1">
            {availableCategories.map((cat) => {
              const cm = categoryMeta[cat] ?? { label: cat, icon: null };
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    activeTab === cat
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {cm.icon}
                  {cm.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {meta.icon}
                {meta.label} Settings
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {meta.description}
              </p>
            </div>

            {activeTab === "display" ? (
              /* Display settings use real-time switches */
              <div className="space-y-4">
                {groupedSettings.display?.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor={setting.key} className="text-sm font-medium cursor-pointer">
                        {setting.label}
                      </Label>
                      {setting.description && (
                        <p className="text-xs text-muted-foreground">
                          {setting.description}
                        </p>
                      )}
                    </div>
                    <Switch
                      id={setting.key}
                      checked={setting.value === "true"}
                      onCheckedChange={(checked) =>
                        handleSwitchChange(setting.key, checked)
                      }
                    />
                  </div>
                ))}
                {(!groupedSettings.display ||
                  groupedSettings.display.length === 0) && (
                  <p className="text-sm text-muted-foreground py-4">
                    No display settings configured.
                  </p>
                )}
              </div>
            ) : (
              /* Other settings use a form */
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  {groupedSettings[activeTab]?.map((setting) => (
                    <div
                      key={setting.key}
                      className="space-y-2 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {setting.label}
                      </Label>
                      <Input
                        id={setting.key}
                        name={setting.key}
                        type={activeTab === "pagination" ? "number" : "text"}
                        min={activeTab === "pagination" ? 1 : undefined}
                        max={activeTab === "pagination" ? 50 : undefined}
                        defaultValue={setting.value}
                        className="max-w-md"
                      />
                      {setting.description && (
                        <p className="text-xs text-muted-foreground">
                          {setting.description}
                        </p>
                      )}
                    </div>
                  ))}
                  {(!groupedSettings[activeTab] ||
                    groupedSettings[activeTab].length === 0) && (
                    <p className="text-sm text-muted-foreground py-4">
                      No settings found in this category.
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <Button type="submit" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
