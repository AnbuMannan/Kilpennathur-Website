import type { Metadata } from "next";
import Link from "next/link";
import { generateMetadata } from "@/lib/metadata";
import {
  Building2,
  Users,
  Target,
  Heart,
  MapPin,
  Landmark,
  GraduationCap,
  Sprout,
  Mail,
  ArrowRight,
} from "lucide-react";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = generateMetadata({
  title: "About Us",
  description:
    "Learn about Kilpennathur Community Portal and our mission to serve the community.",
  path: "/about",
  keywords: ["about", "community"],
});

const KEY_FACTS = [
  { label: "District", value: "Tiruvannamalai", labelTa: "மாவட்டம்", valueTa: "திருவண்ணாமலை" },
  { label: "State", value: "Tamil Nadu", labelTa: "மாநிலம்", valueTa: "தமிழ்நாடு" },
  { label: "Pincode", value: "604 601", labelTa: "அஞ்சல் குறியீடு", valueTa: "606 111" },
  { label: "Block", value: "Kilpennathur", labelTa: "வட்டம்", valueTa: "கீழ்பென்னாத்தூர்" },
  { label: "Taluk", value: "Tiruvannamalai", labelTa: "தாலுகா", valueTa: "திருவண்ணாமலை" },
  { label: "Type", value: "Town Panchayat", labelTa: "வகை", valueTa: "நகர பஞ்சாயத்து" },
];

const STATS = [
  { label: "Villages", value: "25+", icon: MapPin, color: "text-teal-600" },
  { label: "Businesses", value: "100+", icon: Building2, color: "text-blue-600" },
  { label: "Temples", value: "50+", icon: Landmark, color: "text-amber-600" },
  { label: "Schools", value: "30+", icon: GraduationCap, color: "text-purple-600" },
  { label: "Farms", value: "500+", icon: Sprout, color: "text-green-600" },
  { label: "Population", value: "50k+", icon: Users, color: "text-rose-600" },
];

const VALUES = [
  {
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950",
    title: "Community First",
    titleTa: "சமூகம் முதலில்",
    desc: "We prioritize the needs and interests of our community members above all else.",
  },
  {
    icon: Heart,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950",
    title: "Integrity",
    titleTa: "நேர்மை",
    desc: "We maintain accuracy, transparency, and ethical standards in all our content.",
  },
  {
    icon: Building2,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950",
    title: "Local Focus",
    titleTa: "உள்ளூர் கவனம்",
    desc: "We celebrate and promote local businesses, culture, and community achievements.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('/images/about-hero.jpg')` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-5">
            <Users className="w-3.5 h-3.5" aria-hidden />
            About Us
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white tracking-tight">
            Kilpennathur
          </h1>
          <p className="mt-2 font-serif text-2xl md:text-3xl text-indigo-200/70 italic">
            A Historic Town
          </p>
          <p className="mt-2 font-tamil text-xl md:text-2xl text-indigo-200/80">
            கீழ்பென்னாத்தூரை பற்றி
          </p>
          <p className="mt-4 text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your trusted source for community news, business directory, and
            local information
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: "About Us" }]} />

        {/* ── Stats Strip ── */}
        <section className="mb-16 -mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center transition-all hover:shadow-md"
                >
                  <Icon className={cn("w-6 h-6 mx-auto mb-2", s.color)} />
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-2xl md:text-3xl text-white flex items-center gap-3">
                <Target className="w-7 h-7 shrink-0" aria-hidden />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base md:text-lg leading-relaxed space-y-3">
              <p>
                To serve as the central hub for Kilpennathur community,
                providing timely local news, comprehensive business directory,
                and essential community information to residents and visitors.
              </p>
              <p className="font-tamil text-blue-100 leading-relaxed">
                எங்கள் நோக்கம் கீழ்பென்னாத்தூர் சமூகத்திற்கு நம்பகமான
                செய்திகள், வணிக தகவல்கள் மற்றும் உள்ளூர் தகவல்களை
                வழங்குவதாகும்.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ── Values ── */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-center text-gray-900 dark:text-gray-50 mb-8">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <Card
                  key={v.title}
                  className="text-center hover:shadow-lg transition-all hover:-translate-y-1 border-gray-200 dark:border-gray-700"
                >
                  <CardHeader className="pb-2">
                    <div className={cn("w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center", v.bg)}>
                      <Icon className={cn("w-7 h-7", v.color)} aria-hidden />
                    </div>
                    <CardTitle className="font-serif text-lg">{v.title}</CardTitle>
                    <p className="font-tamil text-sm text-gray-500 dark:text-gray-400">
                      {v.titleTa}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {v.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── Main Content: Article + Sidebar ── */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Introduction article */}
          <div className="lg:col-span-2">
            <article className="prose prose-lg prose-gray dark:prose-invert max-w-none">
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-50">
                About Kilpennathur
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                
                Kilpennathur is a vibrant town in Tiruvannamalai district of
                Tamil Nadu, known for its rich cultural heritage, agricultural
                significance, and growing community. Located in the northern
                part of Tamil Nadu, Kilpennathur serves as an important
                administrative and commercial center for surrounding villages.
              </p>

              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-50 mt-8">
                History
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                With a history spanning several centuries, Kilpennathur has been
                a significant settlement in the region. The town has witnessed
                various historical events and cultural transformations while
                maintaining its traditional values and community bonds.
              </p>

              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-50 mt-8">
                Demographics
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The town and its surrounding areas are home to diverse
                communities engaged in agriculture, small businesses, education,
                and various services. The population speaks primarily Tamil,
                with a strong cultural identity rooted in traditional values.
              </p>

              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-50 mt-8">
                Economy
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Agriculture remains the backbone of the local economy, with
                paddy, groundnut, and sugarcane being major crops. The town
                also has a growing number of small and medium businesses,
                educational institutions, and service providers contributing
                to economic development.
              </p>

              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-50 mt-8">
                Culture &amp; Festivals
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Kilpennathur celebrates all major Hindu festivals with great
                enthusiasm. Temple festivals, Pongal celebrations, and cultural
                events bring the community together throughout the year.
                Traditional arts, music, and crafts continue to thrive in the
                region.
              </p>
            </article>
          </div>

          {/* Right — Key Facts Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h3 className="font-serif font-bold text-base text-gray-900 dark:text-gray-50 mb-4 uppercase tracking-wider">
                Key Facts
              </h3>
              <div className="space-y-3">
                {KEY_FACTS.map((f) => (
                  <div
                    key={f.label}
                    className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {f.label}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Explore
                </h4>
                <div className="space-y-2">
                  <Link
                    href="/villages"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Our Villages
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Link>
                  <Link
                    href="/directory"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Business Directory
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Link>
                  <Link
                    href="/news"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors"
                  >
                    <Target className="w-3.5 h-3.5" />
                    Latest News
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* ── Contact CTA ── */}
        <section className="text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Have questions or want to contribute to our community portal?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
          >
            <Mail className="w-4 h-4" />
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
}
