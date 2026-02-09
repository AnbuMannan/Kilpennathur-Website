import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { format } from "date-fns";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    select: { title: true, titleTamil: true, description: true, image: true, date: true },
  });
  if (!event) {
    return { title: "Not Found" };
  }
  const description =
    event.description ??
    `Event on ${format(new Date(event.date), "MMMM dd, yyyy")}. ${event.titleTamil ?? ""}`.trim();
  return {
    title: `${event.title} - Events | Kilpennathur`,
    description,
    openGraph: {
      title: event.title,
      description,
      images: event.image ? [event.image] : [],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  const isUpcoming = new Date(event.date) >= new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: "Events", href: "/events" },
            { label: event.title },
          ]}
        />

        {/* Hero Image */}
        <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-24 h-24 text-white opacity-30 mx-auto mb-4" />
                <h1 className="text-5xl font-bold text-white">
                  {event.title.charAt(0)}
                </h1>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge
              variant={isUpcoming ? "default" : "secondary"}
              className={`${isUpcoming ? "bg-green-500" : "bg-gray-500"} text-white px-4 py-2`}
            >
              {isUpcoming ? "Upcoming Event" : "Past Event"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{event.title}</h1>
          {event.titleTamil && (
            <p className="text-xl sm:text-2xl text-gray-600 mb-6">
              {event.titleTamil}
            </p>
          )}

          {/* Date Info */}
          <div className="flex items-center gap-2 text-purple-600 mb-6 text-base sm:text-lg">
            <Calendar className="w-5 h-5 shrink-0" />
            <span className="font-semibold">
              {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
            </span>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          {event.description && (
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          {/* Share Section */}
          <div className="flex items-center gap-4 mt-8 pt-8 border-t">
            <Share2 className="w-5 h-5 text-gray-500 shrink-0" aria-hidden />
            <span className="text-gray-600 font-medium">Share this event:</span>
            {/* Add share buttons here */}
          </div>
        </div>
      </div>
    </div>
  );
}
