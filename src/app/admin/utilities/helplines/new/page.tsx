import Link from "next/link";
import { HelplineForm } from "@/components/admin/HelplineForm";

export default function AdminHelplineCreatePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/utilities/helplines"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Helplines
        </Link>
        <h1 className="text-3xl font-bold mt-2">Add Helpline</h1>
        <p className="text-muted-foreground mt-1">
          Create a new emergency helpline entry.
        </p>
      </div>
      <HelplineForm mode="create" />
    </div>
  );
}
