"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Facebook, Instagram, Twitter, MessageCircle, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { GlobalSearch } from "./GlobalSearch";
import { ThemeToggle } from "./ThemeToggle";
import { BreakingNewsBar } from "./BreakingNewsBar";

const SOCIAL_LINKS = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: MessageCircle, label: "WhatsApp" },
  { href: "#", icon: Youtube, label: "YouTube" },
] as const;

const NEWS_ITEMS = [
  { label: "All News", href: "/news" },
  { label: "Breaking News", href: "/news?category=breaking" },
  { label: "Health", href: "/news?category=health" },
  { label: "EB News", href: "/news?category=eb-news" },
  { label: "Employment", href: "/news?category=employment" },
  { label: "Blood Donation", href: "/news?category=blood-donation" },
  { label: "Weather", href: "/news?category=weather" },
  { label: "Spiritual News", href: "/news?category=spiritual" },
];

const ABOUT_ITEMS = [
  { label: "Introduction", href: "/about" },
  { label: "History", href: "/about/history" },
  { label: "Contact", href: "/contact" },
];

type NavChild = { label: string; href: string };
type NavItem = {
  label: string;
  labelTa: string;
  href: string;
  subItems?: NavChild[];
};

const MAIN_NAV: NavItem[] = [
  { label: "Home", labelTa: "முகப்பு", href: "/" },
  { label: "News", labelTa: "செய்திகள்", href: "/news", subItems: NEWS_ITEMS },
  { label: "Business Directory", labelTa: "வணிக அடைவு", href: "/directory" },
  { label: "Villages", labelTa: "கிராமங்கள்", href: "/villages" },
  { label: "Events", labelTa: "நிகழ்வுகள்", href: "/events" },
  { label: "About", labelTa: "எங்களை பற்றி", href: "/about", subItems: ABOUT_ITEMS },
  { label: "Jobs", labelTa: "வேலைகள்", href: "/jobs" },
];

export function Header() {
  const pathname = usePathname();
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <BreakingNewsBar />
      </div>

      {/* Main Navigation */}
      <header
        className={cn(
          "fixed left-0 right-0 z-40 bg-white dark:bg-gray-900 shadow-md transition-all duration-300",
          scrolled ? "top-9 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95" : "top-9"
        )}
        role="banner"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-14">
            <Link href="/" className="flex flex-col items-start shrink-0" aria-label="Kilpennathur.com Home">
              <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Kilpennathur.com</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block leading-tight">கீழ்பென்னாத்தூர்</span>
            </Link>

            {/* Desktop menu */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {MAIN_NAV.map((item) => (
                <div
                  key={item.href}
                  className="relative group"
                  onMouseEnter={() => item.subItems && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.subItems ? (
                    <>
                      <button
                        type="button"
                        className={cn(
                          "flex items-center gap-0.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isActive(item.href)
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50"
                            : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                        aria-expanded={openDropdown === item.label}
                        aria-haspopup="true"
                      >
                        <span className="flex flex-col items-start leading-tight">
                          <span>{item.label}</span>
                          <span className="text-gray-400 text-xs font-normal">{item.labelTa}</span>
                        </span>
                        <ChevronDown className="w-4 h-4 ml-0.5 shrink-0" />
                      </button>
                      <div
                        className={cn(
                          "absolute top-full left-0 mt-0 py-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 transition-opacity duration-200",
                          openDropdown === item.label ? "opacity-100 visible" : "opacity-0 invisible"
                        )}
                        role="menu"
                      >
                        {item.subItems.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400"
                            role="menuitem"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex flex-col items-start px-3 py-2 rounded-md text-sm font-medium transition-colors leading-tight",
                        isActive(item.href)
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50"
                          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      <span>{item.label}</span>
                      <span className="text-gray-400 text-xs font-normal">{item.labelTa}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <GlobalSearch />
              <LanguageSwitcher />
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[calc(2.25rem+4rem)]" aria-hidden="true" />

      {/* Mobile menu drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl flex flex-col transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-gray-900 dark:text-white">Menu</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
            <ul className="space-y-1">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  {item.subItems ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpanded((e) => (e === item.label ? null : item.label))
                        }
                        className="flex w-full items-center justify-between px-3 py-2.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-left"
                        aria-expanded={mobileExpanded === item.label}
                      >
                        <span className="flex flex-col items-start leading-tight">
                          <span>{item.label}</span>
                          <span className="text-gray-400 text-xs font-normal">{item.labelTa}</span>
                        </span>
                        <ChevronDown
                          className={cn("w-4 h-4 transition-transform", mobileExpanded === item.label && "rotate-180")}
                        />
                      </button>
                      <ul
                        className={cn(
                          "overflow-hidden transition-all duration-200",
                          mobileExpanded === item.label ? "max-h-96" : "max-h-0"
                        )}
                      >
                        {item.subItems.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-2 pl-6 pr-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-3 py-2.5 rounded-md font-medium leading-tight",
                        isActive(item.href) ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      <span className="block">{item.label}</span>
                      <span className="block text-gray-400 text-xs font-normal">{item.labelTa}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

    </>
  );
}
