import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/frontend/NewsCard";
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
} from "lucide-react";
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
  let stats = { newsCount: 0, businessCount: 0, villageCount: 0, eventCount: 0 };
  let newsCategoryCounts: { id: string; name: string; nameTamil: string | null; slug: string; type: string; postCount: number }[] = [];

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
    ]);

    featuredNews = featured;
    latestNews = latest;
    newsCategories = newsCats;
    businessCategories = businessCats;
    upcomingEvents = events;
    stats = { newsCount, businessCount, villageCount, eventCount };

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
      image: "",
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Slider */}
      <HeroSlider slides={sliderData} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Newspaper className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground">{stats.newsCount}</div>
              <div className="text-sm text-muted-foreground">News Articles</div>
              <div className="text-xs text-muted-foreground/80 mt-1">செய்திகள்</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Building2 className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground">{stats.businessCount}</div>
              <div className="text-sm text-muted-foreground">Businesses</div>
              <div className="text-xs text-muted-foreground/80 mt-1">வணிகங்கள்</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <MapPin className="w-12 h-12 text-teal-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground">{stats.villageCount}</div>
              <div className="text-sm text-muted-foreground">Villages</div>
              <div className="text-xs text-muted-foreground/80 mt-1">கிராமங்கள்</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Calendar className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground">{stats.eventCount}</div>
              <div className="text-sm text-muted-foreground">Events</div>
              <div className="text-xs text-muted-foreground/80 mt-1">நிகழ்வுகள்</div>
            </CardContent>
          </Card>
        </section>

        {/* Latest News Section */}
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

        {/* News Categories Section */}
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

        {/* Business Directory Preview */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 rounded-2xl p-8 text-white">
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

        {/* Upcoming Events Section */}
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

        {/* Quick Access Section */}
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

        {/* Newsletter Signup */}
        <section className="py-12">
          <NewsletterSignup />
        </section>
      </div>
    </div>
  );
}
