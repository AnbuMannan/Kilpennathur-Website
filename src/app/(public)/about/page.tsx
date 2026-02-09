import type { Metadata } from "next";
import Link from "next/link";
import { generateMetadata } from "@/lib/metadata";
import { Building2, Users, Target, Heart } from "lucide-react";
import Breadcrumbs from "@/components/frontend/Breadcrumbs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = generateMetadata({
  title: "About Us",
  description:
    "Learn about Kilpennathur Community Portal and our mission to serve the community.",
  path: "/about",
  keywords: ["about", "community"],
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Full-width Hero Section */}
      <div className="relative h-96 md:h-[28rem] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700" aria-hidden />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/about-hero.jpg')` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 via-blue-800/55 to-purple-900/50 backdrop-blur-[2px]"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <Users className="w-16 h-16 mb-6 animate-pulse" aria-hidden />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">About Kilpennathur</h1>
          <p className="text-2xl md:text-3xl mb-3">கீழ்பென்னாத்தூரை பற்றி</p>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl text-center">
            Your trusted source for community news, business directory, and local information
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden>
          <div className="absolute top-10 right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ label: "About Us" }]} />

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-3xl text-white flex items-center gap-3">
                <Target className="w-8 h-8 shrink-0" aria-hidden />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg">
              <p className="mb-4">
                To serve as the central hub for Kilpennathur community,
                providing timely local news, comprehensive business directory,
                and essential community information to residents and visitors.
              </p>
              <p>
                எங்கள் நோக்கம் கீழ்பென்னாத்தூர் சமூகத்திற்கு நம்பகமான செய்திகள்,
                வணிக தகவல்கள் மற்றும் உள்ளூர் தகவல்களை வழங்குவதாகும்.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users
                  className="w-12 h-12 text-blue-600 mx-auto mb-4"
                  aria-hidden
                />
                <CardTitle>Community First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We prioritize the needs and interests of our community members
                  above all else.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart
                  className="w-12 h-12 text-red-600 mx-auto mb-4"
                  aria-hidden
                />
                <CardTitle>Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We maintain accuracy, transparency, and ethical standards in
                  all our content.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Building2
                  className="w-12 h-12 text-green-600 mx-auto mb-4"
                  aria-hidden
                />
                <CardTitle>Local Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We celebrate and promote local businesses, culture, and
                  community achievements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* About Content */}
        <div className="prose prose-lg prose-neutral max-w-4xl mx-auto mb-16">
          <h2 className="text-gray-900">About Kilpennathur</h2>
          <p className="text-gray-700">
            Kilpennathur is a vibrant town in Tiruvannamalai district of Tamil
            Nadu, known for its rich cultural heritage, agricultural
            significance, and growing community. Located in the northern part of
            Tamil Nadu, Kilpennathur serves as an important administrative and
            commercial center for surrounding villages.
          </p>

          <h3 className="text-gray-900">History</h3>
          <p className="text-gray-700">
            With a history spanning several centuries, Kilpennathur has been a
            significant settlement in the region. The town has witnessed various
            historical events and cultural transformations while maintaining its
            traditional values and community bonds.
          </p>

          <h3 className="text-gray-900">Demographics</h3>
          <p className="text-gray-700">
            The town and its surrounding areas are home to diverse communities
            engaged in agriculture, small businesses, education, and various
            services. The population speaks primarily Tamil, with a strong
            cultural identity rooted in traditional values.
          </p>

          <h3 className="text-gray-900">Economy</h3>
          <p className="text-gray-700">
            Agriculture remains the backbone of the local economy, with paddy,
            groundnut, and sugarcane being major crops. The town also has a
            growing number of small and medium businesses, educational
            institutions, and service providers contributing to economic
            development.
          </p>

          <h3 className="text-gray-900">Culture &amp; Festivals</h3>
          <p className="text-gray-700">
            Kilpennathur celebrates all major Hindu festivals with great
            enthusiasm. Temple festivals, Pongal celebrations, and cultural
            events bring the community together throughout the year. Traditional
            arts, music, and crafts continue to thrive in the region.
          </p>
        </div>

        {/* Statistics */}
        <div className="bg-blue-600 text-white rounded-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Kilpennathur at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-blue-100">Villages</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Temples</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30+</div>
              <div className="text-blue-100">Schools</div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-6">
            Have questions or want to contribute to our community portal?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
