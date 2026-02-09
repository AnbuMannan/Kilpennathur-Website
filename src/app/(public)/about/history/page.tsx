import type { Metadata } from "next";
import {
  BookOpen,
  Calendar,
  MapPin,
  Users,
  Landmark,
  School,
  Sprout,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "History of Kilpennathur",
  description:
    "Discover the rich history and cultural heritage of Kilpennathur, from ancient times to modern development.",
  path: "/about/history",
  keywords: ["history", "heritage", "cultural legacy"],
});

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Full-width Hero Section */}
      <div className="relative h-96 md:h-[28rem] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-red-700" aria-hidden />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/history-hero.jpg')` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-amber-900/50 via-orange-800/55 to-red-900/50 backdrop-blur-[2px]"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 rounded-full mb-6 shadow-2xl">
            <BookOpen className="w-16 h-16 text-white" aria-hidden />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">History of Kilpennathur</h1>
          <p className="text-2xl md:text-3xl mb-3">கில்பென்னாத்தூர் வரலாறு</p>
          <p className="text-lg md:text-xl text-amber-100 max-w-4xl text-center">
            A journey through time - Exploring the rich heritage and cultural legacy of our community
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden>
          <div className="absolute top-10 right-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-orange-400/20 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs
          items={[
            { label: "About", href: "/about" },
            { label: "History" },
          ]}
        />

        {/* Timeline Introduction */}
        <div className="prose prose-lg max-w-4xl mx-auto mb-16">
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 border border-border">
            <p className="text-lg leading-relaxed text-foreground">
              Kilpennathur, nestled in the heart of Tiruvannamalai district in
              Tamil Nadu, carries a legacy that spans centuries. The name
              &quot;Kilpennathur&quot; itself reflects the region&apos;s
              agricultural roots and traditional Tamil nomenclature. This historic
              town has been a witness to various dynasties, cultural movements,
              and transformative periods in South Indian history.
            </p>
          </div>
        </div>

        {/* Historical Periods */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Historical Timeline
          </h2>

          <div className="space-y-12">
            {/* Ancient Period */}
            <div className="relative">
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-500 to-orange-600" />

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Card className="md:ml-auto hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                        <Landmark className="w-6 h-6 text-amber-600" />
                      </div>
                      <Badge className="bg-amber-600">Ancient Period</Badge>
                    </div>
                    <CardTitle>Early Settlements (Before 1000 CE)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      The region around Kilpennathur has evidence of ancient
                      settlements dating back over a millennium. Archaeological
                      findings suggest the area was inhabited during the Sangam
                      period, serving as an important agricultural center. The
                      fertile lands and proximity to water sources made it an
                      ideal location for early Tamil communities.
                    </p>
                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="text-sm text-amber-900 dark:text-amber-200 font-semibold">
                        Key Features:
                      </p>
                      <ul className="text-sm text-amber-800 dark:text-amber-300 mt-2 space-y-1">
                        <li>• Ancient temple foundations</li>
                        <li>• Traditional agricultural practices</li>
                        <li>• Early Tamil cultural influence</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                <div className="hidden md:block" />
              </div>
            </div>

            {/* Medieval Period */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="hidden md:block" />
                <Card className="md:mr-auto hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <Badge className="bg-blue-600">Medieval Period</Badge>
                    </div>
                    <CardTitle>Chola & Vijayanagara Era (1000-1600 CE)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      During the medieval period, Kilpennathur flourished under
                      various dynasties including the Cholas and later the
                      Vijayanagara Empire. This era saw the construction of many
                      temples and the establishment of organized village
                      administration systems. The region&apos;s agricultural
                      productivity contributed significantly to the prosperity
                      of these kingdoms.
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-900 dark:text-blue-200 font-semibold">
                        Achievements:
                      </p>
                      <ul className="text-sm text-blue-800 dark:text-blue-300 mt-2 space-y-1">
                        <li>• Temple architecture development</li>
                        <li>• Advanced irrigation systems</li>
                        <li>• Trade route establishment</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Colonial Period */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Card className="md:ml-auto hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                        <MapPin className="w-6 h-6 text-purple-600" />
                      </div>
                      <Badge className="bg-purple-600">Colonial Period</Badge>
                    </div>
                    <CardTitle>British Era (1600-1947)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      The British colonial period brought significant changes to
                      Kilpennathur. The introduction of modern administrative
                      systems, land revenue policies, and railway connectivity
                      transformed the region. Despite challenges, the community
                      maintained its cultural identity and traditional
                      practices.
                    </p>
                    <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-purple-900 dark:text-purple-200 font-semibold">
                        Developments:
                      </p>
                      <ul className="text-sm text-purple-800 dark:text-purple-300 mt-2 space-y-1">
                        <li>• Modern infrastructure development</li>
                        <li>• Educational institutions established</li>
                        <li>• Freedom movement participation</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                <div className="hidden md:block" />
              </div>
            </div>

            {/* Post-Independence */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="hidden md:block" />
                <Card className="md:mr-auto hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <Badge className="bg-green-600">Modern Era</Badge>
                    </div>
                    <CardTitle>Post-Independence (1947-Present)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      After India&apos;s independence, Kilpennathur experienced
                      rapid development. Establishment of schools, healthcare
                      facilities, and improved connectivity transformed the
                      region. Today, it stands as a thriving community that
                      balances modernity with traditional values, serving as a
                      hub for surrounding villages.
                    </p>
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-900 dark:text-green-200 font-semibold">
                        Progress:
                      </p>
                      <ul className="text-sm text-green-800 dark:text-green-300 mt-2 space-y-1">
                        <li>• Educational expansion</li>
                        <li>• Healthcare improvements</li>
                        <li>• Economic development</li>
                        <li>• Digital connectivity</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Cultural Heritage */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Cultural Heritage
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <Landmark className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Temples & Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ancient temples showcase Dravidian architecture with intricate
                  carvings and sculptures. These structures serve as spiritual
                  centers and architectural marvels.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <Sprout className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Agricultural Traditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Traditional farming methods passed down through generations
                  continue to sustain the community. Paddy, groundnut, and
                  sugarcane remain major crops.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <School className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Educational Legacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  From traditional gurukul system to modern schools, education
                  has always been valued. Today, numerous institutions serve the
                  educational needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Festivals & Traditions */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-white">
                Festivals & Traditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Major Festivals</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 shrink-0" />
                      <div>
                        <strong>Pongal:</strong> Harvest festival celebrated
                        with great enthusiasm
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 shrink-0" />
                      <div>
                        <strong>Temple Festivals:</strong> Annual celebrations
                        at local temples
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 shrink-0" />
                      <div>
                        <strong>Deepavali:</strong> Festival of lights celebrated
                        across communities
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Cultural Practices</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 shrink-0" />
                      <div>
                        <strong>Traditional Arts:</strong> Kolam, Bharatanatyam,
                        and folk music
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 shrink-0" />
                      <div>
                        <strong>Crafts:</strong> Handloom weaving and
                        traditional pottery
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 shrink-0" />
                      <div>
                        <strong>Cuisine:</strong> Traditional Tamil cuisine and
                        sweets
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Kilpennathur */}
        <div className="prose prose-lg max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Kilpennathur Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                Today, Kilpennathur stands as a testament to the harmonious
                blend of tradition and progress. While embracing modern
                development, the community has successfully preserved its
                cultural heritage and traditional values.
              </p>
              <p className="text-foreground">
                The town serves as an important administrative and commercial
                center for the surrounding villages, with improved
                infrastructure, healthcare facilities, educational
                institutions, and connectivity transforming the lives of
                residents.
              </p>
              <p className="text-foreground">
                As Kilpennathur continues to grow and develop, it remains
                committed to its roots, ensuring that future generations can
                appreciate and learn from the rich history and cultural legacy
                that defines this remarkable community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
