"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Tag,
  Newspaper,
  Building2,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  nameTamil: string | null;
  slug: string;
  type: string;
  createdAt: Date;
  itemCount: number;
}

const typeMeta: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; badgeColor: string }
> = {
  news: {
    label: "News",
    icon: <Newspaper className="h-4 w-4" />,
    color: "text-blue-600 dark:text-blue-400",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  business: {
    label: "Business",
    icon: <Building2 className="h-4 w-4" />,
    color: "text-emerald-600 dark:text-emerald-400",
    badgeColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  event: {
    label: "Events",
    icon: <CalendarDays className="h-4 w-4" />,
    color: "text-purple-600 dark:text-purple-400",
    badgeColor:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

const typeOrder = ["news", "business", "event"];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    name: "",
    nameTamil: "",
    slug: "",
    type: "news",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(
          editingCategory ? "Category updated" : "Category created"
        );
        setIsDialogOpen(false);
        resetForm();
        fetchCategories();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to save category");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to delete category");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", nameTamil: "", slug: "", type: "news" });
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameTamil: category.nameTamil || "",
      slug: category.slug,
      type: category.type,
    });
    setIsDialogOpen(true);
  };

  const handleAddInType = (type: string) => {
    resetForm();
    setFormData((f) => ({ ...f, type }));
    setIsDialogOpen(true);
  };

  const toggleCollapse = (type: string) => {
    setCollapsed((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Group categories by type
  const grouped = categories.reduce(
    (acc, cat) => {
      if (!acc[cat.type]) acc[cat.type] = [];
      acc[cat.type].push(cat);
      return acc;
    },
    {} as Record<string, Category[]>
  );

  const availableTypes = typeOrder.filter(
    (t) => grouped[t] && grouped[t].length > 0
  );
  // Include types from data that aren't in typeOrder
  const extraTypes = Object.keys(grouped).filter(
    (t) => !typeOrder.includes(t)
  );
  const allTypes = [...availableTypes, ...extraTypes];

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Loading...</p>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Categories</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} categories across{" "}
            {allTypes.length} types
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                Create or update category information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Name (English)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: name
                          .toLowerCase()
                          .trim()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                      });
                    }}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="nameTamil">Name (Tamil)</Label>
                  <Input
                    id="nameTamil"
                    value={formData.nameTamil}
                    onChange={(e) =>
                      setFormData({ ...formData, nameTamil: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                    className="mt-1.5 font-mono text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="news">News</option>
                    <option value="business">Business</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground rounded-xl border border-border bg-card">
          <Tag className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No categories yet</p>
          <p className="text-sm mt-1">
            Add your first category to organize content.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allTypes.map((type) => {
            const meta = typeMeta[type] ?? {
              label: type,
              icon: <Tag className="h-4 w-4" />,
              color: "text-gray-600",
              badgeColor: "bg-gray-100 text-gray-700",
            };
            const items = grouped[type] ?? [];
            const isCollapsed = collapsed[type] ?? false;

            return (
              <div
                key={type}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                {/* Group Header */}
                <button
                  onClick={() => toggleCollapse(type)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={meta.color}>{meta.icon}</div>
                    <div>
                      <span className="font-semibold text-sm">
                        {meta.label}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({items.length}{" "}
                        {items.length === 1 ? "category" : "categories"})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddInType(type);
                      }}
                      className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title={`Add ${meta.label} category`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Category pills */}
                {!isCollapsed && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {items.map((cat) => (
                        <div
                          key={cat.id}
                          className={`group inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors`}
                        >
                          <span className="text-sm font-medium">
                            {cat.name}
                          </span>
                          {cat.nameTamil && (
                            <span className="text-xs text-muted-foreground">
                              ({cat.nameTamil})
                            </span>
                          )}

                          {/* Count badge */}
                          <span
                            className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${meta.badgeColor}`}
                          >
                            {cat.itemCount}
                          </span>

                          {/* Actions (visible on hover) */}
                          <div className="inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                            <button
                              onClick={() => handleEdit(cat)}
                              className="p-1 rounded hover:bg-muted transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-3 w-3 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className="p-1 rounded hover:bg-destructive/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
