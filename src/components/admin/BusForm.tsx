"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { createBusTiming, updateBusTiming } from "@/app/admin/utilities/bus/actions";
import type { BusActionState } from "@/app/admin/utilities/bus/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminFormLayout } from "./AdminFormLayout";
import { FormPreviewCard } from "./FormPreviewCard";

/* ---------- Constants ---------- */

const BUS_TYPES = ["Town Bus", "Private", "SETC", "Express", "Mofussil"];

/* ---------- Zod schema ---------- */

const busSchema = z.object({
  route: z.string().min(1, "Route is required").trim(),
  busType: z.string().min(1, "Bus type is required"),
  departureTime: z.string().min(1, "Departure time is required").trim(),
});

/* ---------- Helpers ---------- */

const selectCls =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/* ---------- Types ---------- */

export type BusTimingForEdit = {
  id: string;
  route: string;
  routeTamil: string | null;
  busNumber: string | null;
  busType: string;
  departureTime: string;
};

type BusFormProps =
  | { mode: "create" }
  | { mode: "edit"; busTiming: BusTimingForEdit };

/* ---------- Component ---------- */

export function BusForm(props: BusFormProps) {
  const isEdit = props.mode === "edit";
  const bus = isEdit ? props.busTiming : null;

  const [state, formAction] = useActionState(
    isEdit ? updateBusTiming : createBusTiming,
    null as BusActionState | null,
  );

  const [previewRoute, setPreviewRoute] = useState(bus?.route ?? "");
  const [previewBusType, setPreviewBusType] = useState(bus?.busType ?? "Town Bus");
  const [previewTime, setPreviewTime] = useState(bus?.departureTime ?? "");

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = busSchema.safeParse({
      route: (formData.get("route") as string)?.trim(),
      busType: formData.get("busType"),
      departureTime: (formData.get("departureTime") as string)?.trim(),
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const msg =
        flat.route?.[0] ??
        flat.busType?.[0] ??
        flat.departureTime?.[0] ??
        "Please fix the errors";
      toast.error(msg);
      return;
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <AdminFormLayout
      preview={
        <FormPreviewCard
          title={previewRoute || "Bus Route"}
          statusLabel={previewBusType}
          statusColor="bg-blue-100 text-blue-700"
          fields={[
            { label: "Departure", value: previewTime },
            { label: "Type", value: previewBusType },
          ]}
        />
      }
    >
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {isEdit && bus && (
        <input type="hidden" name="id" value={bus.id} />
      )}

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* ──────────── Route Information ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Route Information
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="route" className="mb-1 block text-sm font-medium">
              Route (English) *
            </label>
            <Input
              id="route"
              name="route"
              required
              defaultValue={bus?.route ?? ""}
              placeholder="e.g., Kilpennathur to Tiruvannamalai"
              onChange={(e) => setPreviewRoute(e.target.value)}
            />
            {state?.fieldErrors?.route && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.route}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="routeTamil" className="mb-1 block text-sm font-medium">
              Route (Tamil)
            </label>
            <Input
              id="routeTamil"
              name="routeTamil"
              defaultValue={bus?.routeTamil ?? ""}
              placeholder="e.g., கீழ்பென்னாத்தூர் - திருவண்ணாமலை"
            />
          </div>
        </div>
      </fieldset>

      {/* ──────────── Bus Details ──────────── */}
      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Bus Details
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="busNumber" className="mb-1 block text-sm font-medium">
              Bus Number
            </label>
            <Input
              id="busNumber"
              name="busNumber"
              defaultValue={bus?.busNumber ?? ""}
              placeholder="e.g., 101, TVL-KPR"
            />
          </div>
          <div>
            <label htmlFor="busType" className="mb-1 block text-sm font-medium">
              Bus Type *
            </label>
            <select
              id="busType"
              name="busType"
              required
              defaultValue={bus?.busType ?? "Town Bus"}
              onChange={(e) => setPreviewBusType(e.target.value)}
              className={selectCls}
            >
              {BUS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {state?.fieldErrors?.busType && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.busType}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="departureTime" className="mb-1 block text-sm font-medium">
              Departure Time *
            </label>
            <Input
              id="departureTime"
              name="departureTime"
              required
              defaultValue={bus?.departureTime ?? ""}
              placeholder="e.g., 08:30 AM"
              onChange={(e) => setPreviewTime(e.target.value)}
            />
            {state?.fieldErrors?.departureTime && (
              <p className="mt-1 text-sm text-destructive">
                {state.fieldErrors.departureTime}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ──────────── Actions ──────────── */}
      <div className="flex gap-3 pt-4">
        <Button type="submit">
          {isEdit ? "Update Bus Timing" : "Add Bus Timing"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/utilities/bus">Cancel</Link>
        </Button>
      </div>
    </form>
    </AdminFormLayout>
  );
}
