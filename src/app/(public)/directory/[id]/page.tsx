import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  CheckCircle2,
  Building2,
  MessageCircle,
  Clock,
  Share2,
  Navigation,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FallbackImage } from "@/components/frontend/FallbackImage";
import { Breadcrumbs } from "@/components/frontend/Breadcrumbs";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const business = await prisma.business.findUnique({
    where: { id },
    select: { name: true, description: true, image: true },
  });
  if (!business) {
    return { title: "Not Found" };
  }
  return {
    title: `${business.name} - Business Directory | Kilpennathur`,
    description: business.description ?? undefined,
    openGraph: {
      title: business.name,
      description: business.description ?? undefined,
      images: business.image ? [business.image] : [],
    },
  };
}

export default async function BusinessDetailPage({ params }: Props) {
  const { id } = await params;

  const business = await prisma.business.findUnique({
    where: { id },
  });

  if (!business) notFound();

  // Parse services if available (assuming newline separated or just text)
  const servicesList = business.services
    ? business.services.split("\n").filter((s) => s.trim().length > 0)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 font-sans">
      {/* 2. Immersive Brand Hero */}
      <header className="relative h-[350px] w-full overflow-hidden group">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gray-900">
          {business.image ? (
            <FallbackImage
              src={business.image}
              alt={business.name}
              fill
              className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
              <Building2 className="w-24 h-24 text-white/10" />
            </div>
          )}
        </div>

        {/* Overlay with Bottom Blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute bottom-0 left-0 w-full h-24 backdrop-blur-[2px] bg-gradient-to-t from-black/50 to-transparent" />

        {/* Hero Content */}
        <div className="container relative h-full mx-auto px-4 flex flex-col justify-end pb-8 z-10">
          <div className="max-w-4xl space-y-2">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none px-3 py-1">
                {business.category}
              </Badge>
              <Badge variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/20 gap-1.5 px-3 py-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                Verified
              </Badge>
            </div>

            {/* Title Stack */}
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {business.name}
            </h1>
            {business.nameTamil && (
              <p className="text-xl md:text-2xl text-white/80 font-tamil mt-1">
                {business.nameTamil}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 4. Structured Content Tabs (Left Column - 70%) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-1 overflow-hidden relative">
              {/* 5. UI Polish: Watermark */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
                <div className="absolute -right-20 -bottom-20 transform -rotate-12">
                   {/* Kilpennathur Logo Watermark Text */}
                   <span className="text-9xl font-black text-gray-900 dark:text-white select-none">
                     KIL
                   </span>
                </div>
              </div>

              <Tabs defaultValue="about" className="w-full">
                <div className="px-4 pt-4 border-b border-gray-100 dark:border-gray-800">
                  <TabsList className="bg-transparent w-full justify-start gap-6 h-auto p-0">
                    <TabsTrigger 
                      value="about" 
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-2 py-3 text-base text-gray-500 data-[state=active]:text-blue-600 font-medium transition-all"
                    >
                      About
                    </TabsTrigger>
                    <TabsTrigger 
                      value="services" 
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-2 py-3 text-base text-gray-500 data-[state=active]:text-blue-600 font-medium transition-all"
                    >
                      Services
                    </TabsTrigger>
                    <TabsTrigger 
                      value="location" 
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-2 py-3 text-base text-gray-500 data-[state=active]:text-blue-600 font-medium transition-all"
                    >
                      Location
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6 md:p-8 min-h-[300px]">
                  <TabsContent value="about" className="mt-0 space-y-6 animate-in fade-in-50 duration-300">
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        About {business.name}
                      </h3>
                      {business.description ? (
                        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line">
                          {business.description}
                        </p>
                      ) : (
                        <p className="text-gray-500 italic">No description available for this business.</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="services" className="mt-0 space-y-6 animate-in fade-in-50 duration-300">
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                       <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Our Offerings
                      </h3>
                      {servicesList.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0">
                          {servicesList.map((service, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{service}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                          <p className="text-gray-500">Service details are being updated.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="mt-0 space-y-6 animate-in fade-in-50 duration-300">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Visit Us
                      </h3>
                      <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300 mb-4">
                         <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-gray-400" />
                         <span className="text-lg">{business.address || "Address not available"}</span>
                      </div>
                      
                      <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                        {business.mapUrl ? (
                          <iframe 
                            src={business.mapUrl} 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale-[0.5] hover:grayscale-0 transition-all duration-500"
                          ></iframe>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                            <MapPin className="w-10 h-10 opacity-50" />
                            <p>Map location not available</p>
                          </div>
                        )}
                      </div>
                      {business.mapUrl && (
                        <Button variant="outline" className="w-full gap-2" asChild>
                          <a href={business.mapUrl} target="_blank" rel="noopener noreferrer">
                            <Navigation className="w-4 h-4" />
                            Get Directions on Google Maps
                          </a>
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* 3. Action-Oriented Sidebar (Right Column - 30%) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              <Card className="shadow-xl border-t-4 border-t-blue-600 rounded-2xl overflow-hidden bg-white dark:bg-gray-900/95 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Contact Information</h3>
                    <p className="text-sm text-gray-500">Get in touch directly</p>
                  </div>

                  {/* Primary Actions */}
                  <div className="space-y-3">
                    {business.phone ? (
                      <Button className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" asChild>
                        <a href={`tel:${business.phone}`}>
                          <Phone className="w-5 h-5 mr-2" />
                          Call Now
                        </a>
                      </Button>
                    ) : (
                      <Button disabled className="w-full h-12 text-lg font-bold">
                        <Phone className="w-5 h-5 mr-2" />
                        Call Now
                      </Button>
                    )}

                    {business.whatsapp ? (
                      <Button className="w-full h-12 text-lg font-bold bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-green-600/20" asChild>
                        <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="w-5 h-5 mr-2" />
                          WhatsApp Chat
                        </a>
                      </Button>
                    ) : (
                       <Button disabled className="w-full h-12 text-lg font-bold bg-gray-100 text-gray-400 dark:bg-gray-800">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WhatsApp Chat
                      </Button>
                    )}
                  </div>

                  {/* Details List */}
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-200">
                           —
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Website</p>
                        {business.website ? (
                          <a 
                            href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-medium truncate text-blue-600 hover:underline block"
                          >
                            {business.website}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-400">Not available</p>
                        )}
                      </div>
                    </div>

                     <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Opening Hours</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          9:00 AM - 9:00 PM
                        </p>
                        <p className="text-xs text-green-600 font-medium mt-0.5">Open Now</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                     <Button variant="outline" className="w-full gap-2 text-gray-600" size="sm">
                       <Share2 className="w-4 h-4" />
                       Share Business
                     </Button>
                  </div>

                </CardContent>
              </Card>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
