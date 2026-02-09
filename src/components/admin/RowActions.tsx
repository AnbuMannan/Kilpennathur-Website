"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Copy, Pencil, Trash2 } from "lucide-react";
import { QuickViewDialog } from "./QuickViewDialog";

type Field = {
  label: string;
  value: string | number | null | undefined;
  type?: "text" | "badge" | "image" | "date";
};

type RowActionsProps = {
  editUrl: string;
  title: string;
  fields: Field[];
  onDuplicate?: () => void;
  onDelete?: () => void;
  deleteComponent?: React.ReactNode;
};

export function RowActions({
  editUrl,
  title,
  fields,
  onDuplicate,
  deleteComponent,
}: RowActionsProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={() => setQuickViewOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Quick View
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={editUrl}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </DropdownMenuItem>
          {onDuplicate && (
            <DropdownMenuItem onSelect={onDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
          )}
          {deleteComponent && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">{deleteComponent}</div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <QuickViewDialog
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        title={title}
        fields={fields}
      />
    </>
  );
}
