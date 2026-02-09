import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import NewsletterSignup from "./NewsletterSignup";

const SOCIAL_LINKS = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: MessageCircle, label: "WhatsApp" },
  { href: "#", icon: Youtube, label: "YouTube" },
] as const;

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Business Directory", href: "/directory" },
  { label: "Villages", href: "/villages" },
  { label: "Events", href: "/events" },
  { label: "Contact Us", href: "/contact" },
] as const;

const NEWS_CATEGORIES = [
  { label: "Breaking News", href: "/news?category=breaking" },
  { label: "Health", href: "/news?category=health" },
  { label: "Employment", href: "/news?category=employment" },
  { label: "EB News", href: "/news?category=eb-news" },
  { label: "Weather", href: "/news?category=weather" },
  { label: "Spiritual", href: "/news?category=spiritual" },
] as const;

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Signup */}
        <div className="mb-12">
          <NewsletterSignup />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About column */}
          <div>
            <Link
              href="/"
              className="inline-block text-xl font-bold text-white hover:text-blue-400 transition-colors mb-4"
            >
              Kilpennathur.com
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Your trusted source for Kilpennathur community news, events, business directory,
              and village information. Stay connected with local updates.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-300 text-sm hover:text-blue-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* News Categories column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              News Categories
            </h3>
            <ul className="space-y-2">
              {NEWS_CATEGORIES.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-300 text-sm hover:text-blue-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" aria-hidden />
                <span>Kilpennathur, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-slate-400" aria-hidden />
                <a href="tel:+91" className="hover:text-blue-400 transition-colors">
                  +91 XXXXX XXXXX
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-slate-400" aria-hidden />
                <a href="mailto:contact@kilpennathur.com" className="hover:text-blue-400 transition-colors">
                  contact@kilpennathur.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 shrink-0 text-slate-400" aria-hidden />
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © 2026 Kilpennathur.com. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-600" aria-hidden>|</span>
            <Link href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
