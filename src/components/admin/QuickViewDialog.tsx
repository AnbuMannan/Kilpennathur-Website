"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Field = {
  label: string;
  value: string | number | null | undefined;
  type?: "text" | "badge" | "image" | "date";
};

type QuickViewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: Field[];
};

function statusColor(val: string) {
  const v = val.toLowerCase();
  if (v === "published" || v === "active") return "bg-emerald-100 text-emerald-700";
  if (v === "draft") return "bg-amber-100 text-amber-700";
  if (v === "closed") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

export function QuickViewDialog({ open, onOpenChange, title, fields }: QuickViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>
        <div className="divide-y divide-border">
          {fields.map((field) => (
            <div key={field.label} className="flex items-start gap-4 py-3">
              <span className="w-32 shrink-0 text-sm font-medium text-muted-foreground">
                {field.label}
              </span>
              <div className="flex-1 min-w-0">
                {field.type === "badge" && field.value ? (
                  <Badge className={`text-xs ${statusColor(String(field.value))}`}>
                    {String(field.value)}
                  </Badge>
                ) : field.type === "image" && field.value ? (
                  <img
                    src={String(field.value)}
                    alt=""
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-sm text-foreground break-words">
                    {field.value != null && field.value !== "" ? String(field.value) : "—"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
