import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/frontend/NewsCard";
import { JobCard } from "@/components/frontend/JobCard";
import { ClassifiedCard } from "@/components/frontend/ClassifiedCard";
import HeroSlider from "@/components/frontend/HeroSlider";
import NewsletterSignup from "@/components/frontend/NewsletterSignup";
import {
  Newspaper,
  Building2,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles,
  Mail,
  Bus,
  Phone,
  Landmark,
  Briefcase,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import { DynamicIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Kilpennathur - Community News & Information Portal | கீழ்பென்னாத்தூர்",
  description:
    "Your trusted source for local news, business directory, events, and community information in Kilpennathur and surrounding villages. கீழ்பென்னாத்தூர் சமூக தகவல் தளம்.",
  keywords: [
    "kilpennathur",
    "கீழ்பென்னாத்தூர்",
    "tamil nadu",
    "tiruvannamalai",
    "community news",
    "local businesses",
    "villages",
    "events",
    "செய்திகள்",
  ],
  authors: [{ name: "Kilpennathur.com" }],
  openGraph: {
    title: "Kilpennathur - Community News & Information Portal",
    description:
      "Your trusted source for local news, business directory, events, and community information in Kilpennathur and surrounding villages.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ta_IN",
    url: "https://kilpennathur.com",
    siteName: "Kilpennathur Community Portal",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kilpennathur Community Portal - கீழ்பென்னாத்தூர்",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kilpennathur - Community News & Information Portal",
    description:
      "Your trusted source for local news, business directory, events, and community information.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://kilpennathur.com",
    languages: {
      en: "https://kilpennathur.com",
      ta: "https://kilpennathur.com/ta",
    },
  },
};

export default async function HomePage() {
  type NewsWithAuthor = Awaited<
    ReturnType<
      typeof prisma.news.findMany<{ include: { author: true } }>
    >
  >[number];
  let featuredNews: NewsWithAuthor[] = [];
  let latestNews: NewsWithAuthor[] = [];
  let newsCategories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let businessCategories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let upcomingEvents: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  let stats = {
    newsCount: 0,
    businessCount: 0,
    villageCount: 0,
    eventCount: 0,
    jobCount: 0,
    schemeCount: 0,
    classifiedCount: 0,
  };
  let newsCategoryCounts: { id: string; name: string; nameTamil: string | null; slug: string; type: string; postCount: number }[] = [];
  let latestJobs: Awaited<ReturnType<typeof prisma.job.findMany>> = [];
  let latestSchemes: Awaited<ReturnType<typeof prisma.scheme.findMany>> = [];
  let latestClassifieds: Awaited<ReturnType<typeof prisma.classified.findMany>> = [];
  let services: { title: string; titleTamil: string | null; slug: string; icon: string | null }[] = [];
  let showNewsletter = true;
  let enableSchemes = true;
  let enableClassifieds = true;
  let enableBusTimings = true;
  let enableHelplines = true;

  try {
    const [
      featured,
      latest,
      newsCats,
      businessCats,
      events,
      newsCount,
      businessCount,
      villageCount,
      eventCount,
      jobCount,
      schemeCount,
      classifiedCount,
      jobs,
      schemes,
      classifieds,
      fetchedServices,
      displaySettings,
    ] = await Promise.all([
      prisma.news.findMany({
        where: { status: "published" },
        orderBy: { views: "desc" },
        take: 5,
        include: { author: true },
      }),
      prisma.news.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 6,
        include: { author: true },
      }),
      prisma.category.findMany({ where: { type: "news" }, take: 8 }),
      prisma.category.findMany({ where: { type: "business" }, take: 8 }),
      prisma.event.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
        take: 3,
      }),
      prisma.news.count({ where: { status: "published" } }),
      prisma.business.count(),
      prisma.village.count(),
      prisma.event.count(),
      prisma.job.count({ where: { status: "published" } }),
      prisma.scheme.count({ where: { status: "published" } }),
      prisma.classified.count({ where: { status: "published" } }),
      prisma.job.findMany({
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.scheme.findMany({
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.classified.findMany({
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.service.findMany({
        orderBy: { order: "asc" },
        select: { title: true, titleTamil: true, slug: true, icon: true },
      }),
      prisma.siteSetting.findMany({
        where: { category: "display" },
      }),
    ]);

    featuredNews = featured;
    latestNews = latest;
    newsCategories = newsCats;
    businessCategories = businessCats;
    upcomingEvents = events;
    stats = { newsCount, businessCount, villageCount, eventCount, jobCount, schemeCount, classifiedCount };
    latestJobs = jobs;
    latestSchemes = schemes;
    latestClassifieds = classifieds;
    services = fetchedServices;

    const getFlag = (key: string) =>
      (displaySettings as { key: string; value: string }[]).find((s) => s.key === key)?.value !== "false";
    showNewsletter = getFlag("enable_newsletter");
    enableSchemes = getFlag("enableSchemes");
    enableClassifieds = getFlag("enableClassifieds");
    enableBusTimings = getFlag("enableBusTimings");
    enableHelplines = getFlag("enableHelplines");

    newsCategoryCounts = await Promise.all(
      newsCats.map(async (c) => ({
        ...c,
        postCount: await prisma.news.count({ where: { category: c.name } }),
      }))
    );
  } catch {
    // Fallback: use latest news for slider when DB fails
    try {
      latestNews = await prisma.news.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 6,
        include: { author: true },
      });
      featuredNews = latestNews.slice(0, 5);
    } catch {
      /* ignore */
    }
  }

  const sliderData = [
    {
      id: "welcome",
      title: "Welcome to Kilpennathur",
      titleTamil: "கீழ்பென்னாத்தூர் வரவேற்கிறது",
      description:
        "Your trusted source for local news, business directory, events, and community information. Stay connected with Kilpennathur and surrounding villages.",
      image: "/images/hero-bg.jpg",
      link: "/news",
    },
    ...featuredNews.map((news) => ({
      id: news.id,
      title: news.title,
      titleTamil: news.titleTamil ?? "",
      description:
        (news.excerpt && news.excerpt.length > 120
          ? news.excerpt.slice(0, 120) + "…"
          : news.excerpt) ?? "",
      image: news.image ?? "",
      link: `/news/${news.slug}`,
    })),
  ].slice(0, 6);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Slider */}
      <HeroSlider slides={sliderData} />

      {/* ══════════ Our Professional Services ══════════ */}
      {services.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold mb-2 flex items-center justify-center gap-3">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
                Our Services
              </h2>
              <p className="text-muted-foreground text-lg">முக்கிய சேவைகள்</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((svc) => (
                <Link key={svc.slug} href={`/services/${svc.slug}`} className="group">
                  <Card className="text-center bg-card hover:shadow-md transition-all hover:-translate-y-1">
                    <CardContent className="pt-6 pb-5">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <DynamicIcon name={svc.icon ?? undefined} className="w-7 h-7" />
                      </div>
                      <div className="font-semibold text-sm text-foreground">{svc.title}</div>
                      {svc.titleTamil && (
                        <div className="text-xs text-muted-foreground mt-0.5">{svc.titleTamil}</div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/services">
                <Button variant="outline" className="gap-2">
                  View All Services
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-16">

        {/* ══════════ Quick Services Strip ══════════ */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {enableBusTimings && (
              <Link href="/bus-timings" className="group">
                <Card className="text-center hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:-translate-y-1">
                  <CardContent className="pt-5 pb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Bus className="w-6 h-6" />
                    </div>
                    <div className="font-semibold text-sm">Bus Timings</div>
                    <div className="text-xs text-muted-foreground">பேருந்து நேரம்</div>
                  </CardContent>
                </Card>
              </Link>
            )}
            {enableHelplines && (
              <Link href="/helplines" className="group">
                <Card className="text-center hover:shadow-lg hover:border-red-300 dark:hover:border-red-600 transition-all hover:-translate-y-1">
                  <CardContent className="pt-5 pb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div className="font-semibold text-sm">Helplines</div>
                    <div className="text-xs text-muted-foreground">அவசர எண்கள்</div>
                  </CardContent>
                </Card>
              </Link>
            )}
            {enableSchemes && (
              <Link href="/schemes" className="group">
                <Card className="text-center hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-all hover:-translate-y-1">
                  <CardContent className="pt-5 pb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <div className="font-semibold text-sm">Schemes</div>
                    <div className="text-xs text-muted-foreground">அரசு திட்டங்கள்</div>
                  </CardContent>
                </Card>
              </Link>
            )}
            <Link href="/jobs" className="group">
              <Card className="text-center hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-600 transition-all hover:-translate-y-1">
                <CardContent className="pt-5 pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-sm">Jobs</div>
                  <div className="text-xs text-muted-foreground">வேலைகள்</div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* ══════════ Stats Section ══════════ */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-5 pb-4">
              <Newspaper className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.newsCount}</div>
              <div className="text-xs text-muted-foreground">News</div>
              <div className="text-[10px] text-muted-foreground/80">செய்திகள்</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-5 pb-4">
              <Building2 className="w-10 h-10 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.businessCount}</div>
              <div className="text-xs text-muted-foreground">Businesses</div>
              <div className="text-[10px] text-muted-foreground/80">வணிகங்கள்</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-5 pb-4">
              <MapPin className="w-10 h-10 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.villageCount}</div>
              <div className="text-xs text-muted-foreground">Villages</div>
              <div className="text-[10px] text-muted-foreground/80">கிராமங்கள்</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-5 pb-4">
              <Calendar className="w-10 h-10 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.eventCount}</div>
              <div className="text-xs text-muted-foreground">Events</div>
              <div className="text-[10px] text-muted-foreground/80">நிகழ்வுகள்</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-5 pb-4">
              <Briefcase className="w-10 h-10 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.jobCount}</div>
              <div className="text-xs text-muted-foreground">Jobs</div>
              <div className="text-[10px] text-muted-foreground/80">வேலைகள்</div>
            </CardContent>
          </Card>
          {enableSchemes && (
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-5 pb-4">
                <Landmark className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stats.schemeCount}</div>
                <div className="text-xs text-muted-foreground">Schemes</div>
                <div className="text-[10px] text-muted-foreground/80">திட்டங்கள்</div>
              </CardContent>
            </Card>
          )}
          {enableClassifieds && (
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-5 pb-4">
                <ShoppingBag className="w-10 h-10 text-pink-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stats.classifiedCount}</div>
                <div className="text-xs text-muted-foreground">Classifieds</div>
                <div className="text-[10px] text-muted-foreground/80">விளம்பரங்கள்</div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* ══════════ Latest News Section ══════════ */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                Latest News
              </h2>
              <p className="text-muted-foreground text-lg">சமீபத்திய செய்திகள்</p>
            </div>
            <Link href="/news">
              <Button variant="outline" className="gap-2">
                View All News
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((item) => (
              <NewsCard
                key={item.id}
                news={{
                  id: item.id,
                  title: item.title,
                  titleTamil: item.titleTamil,
                  slug: item.slug,
                  excerpt: item.excerpt,
                  image: item.image,
                  category: item.category,
                  publishedAt: item.publishedAt,
                  views: item.views,
                  author: { name: item.author.name },
                }}
              />
            ))}
          </div>
        </section>

        {/* ══════════ Government Schemes Section ══════════ */}
        {enableSchemes && latestSchemes.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <Landmark className="w-8 h-8 text-emerald-600" />
                  Government Schemes
                </h2>
                <p className="text-muted-foreground text-lg">அரசு திட்டங்கள்</p>
              </div>
              <Link href="/schemes">
                <Button variant="outline" className="gap-2">
                  View All Schemes
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestSchemes.map((scheme) => (
                <Link key={scheme.id} href={`/schemes?search=${encodeURIComponent(scheme.title)}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {scheme.sponsor}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {scheme.beneficiaryType}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{scheme.title}</CardTitle>
                      {scheme.titleTamil && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {scheme.titleTamil}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {scheme.description}
                      </p>
                      {scheme.applicationLink && (
                        <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium mt-3">
                          Apply Now <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ══════════ Jobs & Classifieds Split Section ══════════ */}
        {(latestJobs.length > 0 || (enableClassifieds && latestClassifieds.length > 0)) && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Latest Jobs */}
            <div className={!enableClassifieds ? "lg:col-span-2" : ""}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-amber-600" />
                    Latest Jobs
                  </h2>
                  <p className="text-muted-foreground text-sm">சமீபத்திய வேலைகள்</p>
                </div>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm" className="gap-1 text-sm">
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              {latestJobs.length > 0 ? (
                <div className="space-y-4">
                  {latestJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={{
                        id: job.id,
                        title: job.title,
                        titleTamil: job.titleTamil,
                        company: job.company,
                        companyTamil: job.companyTamil,
                        location: job.location,
                        locationTamil: job.locationTamil,
                        jobType: job.jobType,
                        category: job.category,
                        salaryDescription: job.salaryDescription,
                        applicationDeadline: job.applicationDeadline,
                        applicationUrl: job.applicationUrl,
                        publishedAt: job.publishedAt,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-8">
                  <CardContent>
                    <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No jobs posted yet</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Marketplace / Classifieds */}
            {enableClassifieds && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                      <ShoppingBag className="w-6 h-6 text-pink-600" />
                      Marketplace
                    </h2>
                    <p className="text-muted-foreground text-sm">சந்தை</p>
                  </div>
                  <Link href="/classifieds">
                    <Button variant="ghost" size="sm" className="gap-1 text-sm">
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

                {latestClassifieds.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {latestClassifieds.map((item) => (
                      <ClassifiedCard
                        key={item.id}
                        classified={{
                          id: item.id,
                          type: item.type,
                          category: item.category,
                          title: item.title,
                          titleTamil: item.titleTamil,
                          description: item.description,
                          descriptionTamil: item.descriptionTamil,
                          price: item.price,
                          priceLabel: item.priceLabel,
                          contactName: item.contactName,
                          contactPhone: item.contactPhone,
                          location: item.location,
                          images: item.images,
                          isFeatured: item.isFeatured,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-8">
                    <CardContent>
                      <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No classifieds posted yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </section>
        )}

        {/* ══════════ News Categories Section ══════════ */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Explore by Category</h2>
            <p className="text-muted-foreground text-lg">வகைகளை ஆராயுங்கள்</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newsCategoryCounts.map((category) => (
              <Link key={category.id} href={`/news?category=${category.slug}`} className="group">
                <Card className="text-center hover:shadow-lg hover:border-primary/30 transition-all hover:-translate-y-1">
                  <CardContent className="pt-6 pb-4">
                    <Newspaper className="w-10 h-10 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <div className="font-semibold text-foreground mb-1">{category.name}</div>
                    {category.nameTamil && (
                      <div className="text-sm text-muted-foreground">{category.nameTamil}</div>
                    )}
                    <Badge variant="secondary" className="mt-2">
                      {category.postCount} posts
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════ Business Directory Preview ══════════ */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 rounded-2xl p-6 md:p-8 text-white">
          <div className="text-center mb-8">
            <Building2 className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Business Directory</h2>
            <p className="text-purple-100 text-lg">வணிக அடைவு</p>
            <p className="text-purple-100 mt-2">
              Discover local businesses and services in Kilpennathur
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {businessCategories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/directory?category=${category.slug}`}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg p-4 text-center transition-all hover:scale-105"
              >
                <div className="font-semibold mb-1">{category.name}</div>
                {category.nameTamil && (
                  <div className="text-sm text-purple-200">{category.nameTamil}</div>
                )}
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/directory">
              <Button size="lg" variant="secondary" className="gap-2">
                View Full Directory
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* ══════════ Upcoming Events Section ══════════ */}
        {upcomingEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-orange-600" />
                  Upcoming Events
                </h2>
                <p className="text-muted-foreground text-lg">வரவிருக்கும் நிகழ்வுகள்</p>
              </div>
              <Link href="/events">
                <Button variant="outline" className="gap-2">
                  View All Events
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit mb-2">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Badge>
                      <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                      {event.titleTamil && (
                        <p className="text-muted-foreground">{event.titleTamil}</p>
                      )}
                    </CardHeader>
                    {event.description && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {event.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ══════════ Quick Access Section ══════════ */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Quick Access</h2>
            <p className="text-muted-foreground text-lg">விரைவு அணுகல்</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/villages" className="group">
              <Card className="text-center hover:shadow-xl hover:border-teal-300 dark:hover:border-teal-600 transition-all hover:-translate-y-2">
                <CardContent className="pt-8 pb-6">
                  <MapPin className="w-16 h-16 text-teal-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">Our Villages</h3>
                  <p className="text-muted-foreground mb-1">எங்கள் கிராமங்கள்</p>
                  <p className="text-sm text-muted-foreground/80">
                    Explore {stats.villageCount}+ villages
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/about" className="group">
              <Card className="text-center hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:-translate-y-2">
                <CardContent className="pt-8 pb-6">
                  <Users className="w-16 h-16 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">About Us</h3>
                  <p className="text-muted-foreground mb-1">எங்களை பற்றி</p>
                  <p className="text-sm text-muted-foreground/80">Learn about our community</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/about/history" className="group">
              <Card className="text-center hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-600 transition-all hover:-translate-y-2">
                <CardContent className="pt-8 pb-6">
                  <TrendingUp className="w-16 h-16 text-amber-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">Our History</h3>
                  <p className="text-muted-foreground mb-1">எங்கள் வரலாறு</p>
                  <p className="text-sm text-muted-foreground/80">Discover our heritage</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/contact" className="group">
              <Card className="text-center hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 transition-all hover:-translate-y-2">
                <CardContent className="pt-8 pb-6">
                  <Mail className="w-16 h-16 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">Contact Us</h3>
                  <p className="text-muted-foreground mb-1">தொடர்பு கொள்ள</p>
                  <p className="text-sm text-muted-foreground/80">Get in touch with us</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* ══════════ Newsletter Signup ══════════ */}
        {showNewsletter && (
          <section className="py-12">
            <NewsletterSignup />
          </section>
        )}
      </div>
    </div>
  );
}
