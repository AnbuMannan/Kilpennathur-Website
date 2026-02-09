import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JobForm } from "@/components/admin/JobForm";

export default async function AdminJobEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/jobs"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Jobs
        </Link>
        <h1 className="text-3xl font-bold mt-2">Edit Job</h1>
        <p className="text-muted-foreground mt-1">Update {job.title}</p>
      </div>
      <JobForm
        mode="edit"
        job={{
          id: job.id,
          title: job.title,
          titleTamil: job.titleTamil,
          description: job.description,
          company: job.company,
          companyTamil: job.companyTamil,
          location: job.location,
          locationTamil: job.locationTamil,
          jobType: job.jobType,
          category: job.category,
          salaryDescription: job.salaryDescription,
          contactEmail: job.contactEmail,
          contactPhone: job.contactPhone,
          applicationUrl: job.applicationUrl,
          applicationDeadline: job.applicationDeadline,
          experience: job.experience,
          qualifications: job.qualifications,
          benefits: job.benefits,
          image: job.image,
          status: job.status,
        }}
      />
    </div>
  );
}
