import type { Metadata } from "next";
import Link from "next/link";
import {
  Landmark,
  Swords,
  Map,
  Building2,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Camera,
  BookOpen,
  Scroll,
} from "lucide-react";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { generateMetadata as genMeta } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export const metadata: Metadata = genMeta({
  title: "History of Kilpennathur",
  description:
    "From the Sambuvarayar chieftains to a modern Taluk — explore 800 years of Kilpennathur's rich history.",
  path: "/about/history",
  keywords: ["history", "heritage", "Kilpennathur", "Sambuvarayar", "timeline"],
});

/* ================================================================
   TIMELINE DATA
   ================================================================ */

const TIMELINE = [
  {
    year: "1200s",
    era: "The Sambuvarayar Period",
    title: "The Sambuvarayar Inscriptions",
    content:
      "Inscriptions found in the historic Meenakshi Sundareshwarar Temple indicate the rule of the 'Maraya Sambuvaraya' chieftains. The temple, over 800 years old, stands as a testament to the Dravidian architecture of the Chola feudatories.",
    highlights: [
      "800-year-old Meenakshi Sundareshwarar Temple",
      "Chola feudatory inscriptions",
      "Dravidian architectural heritage",
    ],
    icon: Landmark,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    badgeBg: "bg-amber-600",
    borderColor: "border-l-amber-500",
    gradientFrom: "from-amber-100 dark:from-amber-900/40",
    gradientTo: "to-orange-50 dark:to-amber-800/20",
    side: "left" as const,
  },
  {
    year: "1767",
    era: "The Anglo-Mysore Wars",
    title: "A Strategic Crossroads",
    content:
      "During the Battle of Tiruvannamalai (September 1767) between the British East India Company and Hyder Ali, the Kilpennathur-Tindivanam route served as a critical movement corridor for troops and supplies.",
    highlights: [
      "Battle of Tiruvannamalai (1767)",
      "British East India Company vs. Hyder Ali",
      "Key military supply corridor",
    ],
    icon: Swords,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-900/20",
    badgeBg: "bg-red-600",
    borderColor: "border-l-red-500",
    gradientFrom: "from-red-100 dark:from-red-900/40",
    gradientTo: "to-rose-50 dark:to-red-800/20",
    side: "right" as const,
  },
  {
    year: "1989",
    era: "District Formation",
    title: "Part of a New Identity",
    content:
      "On September 30, 1989, when Tiruvannamalai district was carved out of North Arcot, Kilpennathur became a key Union in the new district, solidifying its administrative importance.",
    highlights: [
      "Tiruvannamalai district created (Sep 30, 1989)",
      "Carved from North Arcot district",
      "Kilpennathur becomes key Union",
    ],
    icon: Map,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    badgeBg: "bg-blue-600",
    borderColor: "border-l-blue-500",
    gradientFrom: "from-blue-100 dark:from-blue-900/40",
    gradientTo: "to-indigo-50 dark:to-blue-800/20",
    side: "left" as const,
  },
  {
    year: "2016",
    era: "Taluk Upgrade",
    title: "Rise to Taluk Status",
    content:
      "A major milestone was achieved on February 28, 2016, when Kilpennathur was officially upgraded to a separate Taluk, bringing Revenue and Tahsildar services directly to the people.",
    highlights: [
      "Official Taluk status (Feb 28, 2016)",
      "Revenue Division office established",
      "Tahsildar services for the people",
    ],
    icon: Building2,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    badgeBg: "bg-emerald-600",
    borderColor: "border-l-emerald-500",
    gradientFrom: "from-emerald-100 dark:from-emerald-900/40",
    gradientTo: "to-teal-50 dark:to-emerald-800/20",
    side: "right" as const,
  },
];

/* ================================================================
   DID YOU KNOW? DATA
   ================================================================ */

const FUN_FACTS = [
  {
    fact: "Kilpennathur is an Assembly Constituency, currently held by the Deputy Speaker of the Tamil Nadu Legislative Assembly.",
    factTa:
      "கீழ்பென்னாத்தூர் ஒரு சட்டமன்ற தொகுதி, தற்போது தமிழ்நாடு சட்டமன்றத்தின் துணை சபாநாயகரால் பிரதிநிதித்துவப்படுத்தப்படுகிறது.",
  },
  {
    fact: "The Meenakshi Sundareshwarar Temple has inscriptions in Grantha script, linking the town to the broader Chola literary tradition.",
    factTa:
      "மீனாட்சி சுந்தரேஸ்வரர் கோயிலில் கிரந்த எழுத்துக்களில் கல்வெட்டுகள் உள்ளன, இது நகரத்தை சோழ இலக்கிய மரபுடன் இணைக்கிறது.",
  },
  {
    fact: "Kilpennathur Block covers over 25 Village Panchayats, making it one of the larger administrative units in Tiruvannamalai district.",
    factTa:
      "கீழ்பென்னாத்தூர் வட்டம் 25 கிராம பஞ்சாயத்துகளை உள்ளடக்கியது, இது திருவண்ணாமலை மாவட்டத்தின் பெரிய நிர்வாக அலகுகளில் ஒன்றாகும்.",
  },
  {
    fact: "The annual Panguni Uthiram and Thai Poosam temple festivals attract devotees from across Tiruvannamalai district.",
    factTa:
      "ஆண்டுதோறும் நடைபெறும் பங்குனி உத்திரம் மற்றும் தைப்பூசம் கோயில் திருவிழாக்கள் திருவண்ணாமலை மாவட்டம் முழுவதிலிருந்தும் பக்தர்களை ஈர்க்கின்றன.",
  },
];

/* ================================================================
   GALLERY DATA (CSS placeholders — replace with real images later)
   ================================================================ */

const GALLERY = [
  {
    label: "Meenakshi Sundareshwarar Temple",
    icon: Landmark,
    gradient: "from-amber-200 to-orange-100 dark:from-amber-900/50 dark:to-amber-800/30",
    iconColor: "text-amber-600/50",
  },
  {
    label: "Temple Inscriptions",
    icon: Scroll,
    gradient: "from-yellow-200 to-amber-100 dark:from-yellow-900/50 dark:to-yellow-800/30",
    iconColor: "text-yellow-600/50",
  },
  {
    label: "Town Landscape",
    icon: Map,
    gradient: "from-green-200 to-teal-100 dark:from-green-900/50 dark:to-green-800/30",
    iconColor: "text-green-600/50",
  },
  {
    label: "Agricultural Heritage",
    icon: Sparkles,
    gradient: "from-lime-200 to-green-100 dark:from-lime-900/50 dark:to-lime-800/30",
    iconColor: "text-lime-600/50",
  },
  {
    label: "Temple Festival",
    icon: Sparkles,
    gradient: "from-rose-200 to-pink-100 dark:from-rose-900/50 dark:to-rose-800/30",
    iconColor: "text-rose-600/50",
  },
];

/* ================================================================
   PAGE COMPONENT
   ================================================================ */

export default function HistoryPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* ────────────────────────────────────────
          HERO — Parallax-inspired dark section
         ──────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />
        {/* Decorative glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" aria-hidden />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl" aria-hidden />

        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 backdrop-blur-sm border border-amber-400/20 text-amber-200 text-xs font-semibold uppercase tracking-widest mb-6">
            <Scroll className="w-3.5 h-3.5" />
            Est. 12th Century
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            The Legacy of Kilpennathur
          </h1>
          <p className="mt-3 font-tamil text-xl md:text-2xl text-amber-200/80 leading-relaxed">
            கீழ்பென்னாத்தூர் வரலாறு
          </p>
          <p className="mt-4 text-sm md:text-base text-amber-100/60 max-w-2xl mx-auto leading-relaxed italic">
            From the Chola Chieftains to a Modern Taluk &mdash; A journey through
            800&nbsp;years.
          </p>
        </div>
      </div>

      {/* ────────────────────────────────────────
          MAIN CONTENT
         ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Breadcrumbs
          items={[
            { label: "About", href: "/about" },
            { label: "History" },
          ]}
        />

        {/* ── Introduction Card ── */}
        <section className="mb-16 mt-4">
          <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl p-8 md:p-10">
            <BookOpen className="w-8 h-8 text-amber-600/40 absolute top-6 right-6" aria-hidden />
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Kilpennathur, nestled in the heart of Tiruvannamalai district in
              Tamil Nadu, carries a legacy that spans over eight centuries. From
              ancient Chola feudatory inscriptions to its modern status as an
              independent Taluk, the town&apos;s history mirrors the broader arc
              of South Indian civilization.
            </p>
            <p className="mt-4 font-tamil text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              தமிழ்நாட்டின் திருவண்ணாமலை மாவட்டத்தின் மையத்தில் அமைந்துள்ள
              கீழ்பென்னாத்தூர், எட்டு நூற்றாண்டுகளுக்கும் மேலான பாரம்பரியத்தைக்
              கொண்டுள்ளது.
            </p>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
              Historical Timeline
            </h2>
            <p className="font-tamil text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              வரலாற்றுக் காலவரிசை
            </p>
          </div>

          {/* Timeline container */}
          <div className="relative">
            {/* Central line (desktop) */}
            <div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-red-400 via-blue-400 to-emerald-400 md:-translate-x-px"
              aria-hidden
            />

            <div className="space-y-12 md:space-y-16">
              {TIMELINE.map((item, idx) => {
                const Icon = item.icon;
                const isLeft = item.side === "left";

                return (
                  <div key={idx} className="relative">
                    {/* ── Year Badge on the line ── */}
                    <div
                      className={cn(
                        "absolute z-10 left-4 md:left-1/2 -translate-x-1/2",
                        "flex items-center justify-center"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold shadow-lg",
                          item.badgeBg
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {item.year}
                      </span>
                    </div>

                    {/* ── Card wrapper ── */}
                    <div
                      className={cn(
                        "md:grid md:grid-cols-2 md:gap-12",
                        "pl-12 md:pl-0" /* mobile left offset for the line */
                      )}
                    >
                      {/* Spacer or card depending on side */}
                      {isLeft ? (
                        <>
                          {/* Card — LEFT side (desktop) */}
                          <div className="md:pr-8 pt-8 md:pt-2">
                            <TimelineCard item={item} />
                          </div>
                          <div className="hidden md:block" />
                        </>
                      ) : (
                        <>
                          <div className="hidden md:block" />
                          {/* Card — RIGHT side (desktop) */}
                          <div className="md:pl-8 pt-8 md:pt-2">
                            <TimelineCard item={item} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Terminal dot */}
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 -bottom-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/40" />
            </div>
          </div>
        </section>

        {/* ── Cultural Heritage Quick Cards ── */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-gray-50 tracking-tight mb-8">
            Cultural Heritage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Landmark,
                color: "text-amber-600",
                bg: "bg-amber-50 dark:bg-amber-900/20",
                title: "Temples & Architecture",
                titleTa: "கோயில்கள் & கட்டிடக்கலை",
                desc: "Ancient temples showcase Dravidian architecture with intricate carvings. The Meenakshi Sundareshwarar Temple remains the town's crown jewel.",
              },
              {
                icon: Sparkles,
                color: "text-green-600",
                bg: "bg-green-50 dark:bg-green-900/20",
                title: "Festivals & Traditions",
                titleTa: "திருவிழாக்கள் & மரபுகள்",
                desc: "Pongal, Panguni Uthiram, Thai Poosam, and Deepavali are celebrated with great fervour, binding the community together each year.",
              },
              {
                icon: Map,
                color: "text-blue-600",
                bg: "bg-blue-50 dark:bg-blue-900/20",
                title: "Agricultural Legacy",
                titleTa: "விவசாய பாரம்பரியம்",
                desc: "Paddy, groundnut, and sugarcane farming have sustained the region for centuries. The fertile Pennaiyar basin feeds thousands of families.",
              },
            ].map((c) => {
              const CIcon = c.icon;
              return (
                <div
                  key={c.title}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                      c.bg
                    )}
                  >
                    <CIcon className={cn("w-6 h-6", c.color)} />
                  </div>
                  <h3 className="font-serif font-bold text-base text-gray-900 dark:text-gray-50">
                    {c.title}
                  </h3>
                  <p className="font-tamil text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">
                    {c.titleTa}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── DID YOU KNOW? ── */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 md:p-10 shadow-xl text-white overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" aria-hidden />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" aria-hidden />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-7 h-7 text-yellow-300" />
                <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                  Did You Know?
                </h2>
              </div>
              <p className="font-tamil text-sm text-indigo-200 mb-6">
                உங்களுக்கு தெரியுமா?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FUN_FACTS.map((f, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-yellow-400/20 text-yellow-300 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm leading-relaxed">{f.fact}</p>
                        <p className="font-tamil text-xs text-indigo-200 mt-2 leading-relaxed">
                          {f.factTa}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Camera className="w-6 h-6 text-gray-400" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
              Gallery
            </h2>
            <p className="font-tamil text-sm text-gray-500 dark:text-gray-400 ml-1">
              புகைப்படத் தொகுப்பு
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {GALLERY.map((img, idx) => {
              const GIcon = img.icon;
              return (
                <div
                  key={idx}
                  className={cn(
                    "relative group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1",
                    idx === 0
                      ? "col-span-2 row-span-2 aspect-square"
                      : "aspect-[4/3]"
                  )}
                >
                  {/* Gradient placeholder with icon */}
                  <div className={cn("absolute inset-0 bg-gradient-to-br flex items-center justify-center", img.gradient)}>
                    <GIcon className={cn("w-12 h-12", idx === 0 ? "w-20 h-20" : "", img.iconColor)} />
                  </div>
                  {/* Label overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                    <p className="text-white text-xs font-semibold leading-tight">
                      {img.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="text-center mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight mb-3">
            Explore More
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto leading-relaxed">
            Discover the vibrant community, local businesses, and upcoming events
            that make Kilpennathur special.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-sm"
            >
              About Kilpennathur
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/villages"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold text-sm shadow-sm border border-gray-200 dark:border-gray-700"
            >
              Our Villages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================================================================
   TIMELINE CARD SUB-COMPONENT
   ================================================================ */

interface TimelineItem {
  year: string;
  era: string;
  title: string;
  content: string;
  highlights: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  badgeBg: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  side: "left" | "right";
}

function TimelineCard({ item }: { item: TimelineItem }) {
  const Icon = item.icon;

  return (
    <article
      className={cn(
        "relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl",
        "rounded-xl border border-gray-200/60 dark:border-gray-700/60",
        "border-l-4 shadow-lg",
        "hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
        item.borderColor
      )}
    >
      {/* Gradient header with icon */}
      <div className={cn("relative h-40 rounded-t-xl overflow-hidden bg-gradient-to-br flex items-center justify-center", item.gradientFrom, item.gradientTo)}>
        <Icon className={cn("w-16 h-16 opacity-20", item.color)} aria-hidden />
        {/* Era badge */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-md",
              item.badgeBg
            )}
          >
            {item.era}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center",
              item.bg
            )}
          >
            <Icon className={cn("w-5 h-5", item.color)} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900 dark:text-gray-50 leading-tight">
              {item.title}
            </h3>
            <p className="font-serif text-xs text-gray-500 dark:text-gray-400">
              {item.year}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {item.content}
        </p>

        {/* Highlights */}
        <div className={cn("rounded-lg p-3", item.bg)}>
          <ul className="space-y-1">
            {item.highlights.map((h, i) => (
              <li
                key={i}
                className={cn(
                  "text-xs flex items-start gap-2",
                  item.color
                )}
              >
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
