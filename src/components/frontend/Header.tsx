"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { GlobalSearch } from "./GlobalSearch";
import { ThemeToggle } from "./ThemeToggle";
import { BreakingNewsBar } from "./BreakingNewsBar";

/* ────────────── Sub-menu data ────────────── */

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

const SERVICES_ITEMS = [
  { label: "Our Services", href: "/services" },
  { label: "Bus Timings", href: "/bus-timings" },
  { label: "Helplines", href: "/helplines" },
];

/* ────────────── Navigation structure ────────────── */

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
  { label: "Directory", labelTa: "வணிக அடைவு", href: "/directory" },
  { label: "Villages", labelTa: "கிராமங்கள்", href: "/villages" },
  { label: "Schemes", labelTa: "திட்டங்கள்", href: "/schemes" },
  { label: "Events", labelTa: "நிகழ்வுகள்", href: "/events" },
  { label: "Classifieds", labelTa: "விளம்பரங்கள்", href: "/classifieds" },
  { label: "Services", labelTa: "சேவைகள்", href: "/bus-timings", subItems: SERVICES_ITEMS },
  { label: "About", labelTa: "எங்களை பற்றி", href: "/about", subItems: ABOUT_ITEMS },
  { label: "Jobs", labelTa: "வேலைகள்", href: "/jobs" },
];

/* ────────────── Component ────────────── */

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [dynamicServices, setDynamicServices] = useState<NavChild[]>([]);

  /* Fetch professional services for the nav dropdown */
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data: { title: string; slug: string }[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setDynamicServices(
            data.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
          );
        }
      })
      .catch(() => {});
  }, []);

  /* Build nav with dynamic services merged into the Services dropdown */
  const navItems = useMemo(() => {
    if (dynamicServices.length === 0) return MAIN_NAV;
    return MAIN_NAV.map((item) => {
      if (item.label === "Services" && item.subItems) {
        return {
          ...item,
          subItems: [...item.subItems, ...dynamicServices],
        };
      }
      return item;
    });
  }, [dynamicServices]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ═══ Top Bar (Breaking News) ═══ */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <BreakingNewsBar />
      </div>

      {/* ═══ Main Header ═══ */}
      <header
        className={cn(
          "fixed left-0 right-0 z-40 bg-white dark:bg-gray-900 shadow-md transition-all duration-300",
          scrolled
            ? "top-9 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95"
            : "top-9",
        )}
        role="banner"
      >
        <div className="max-w-[90rem] mx-auto px-4">
          <div className="flex items-center h-12">
            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex flex-col items-start shrink-0 mr-6"
              aria-label="Kilpennathur.com Home"
            >
              <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                Kilpennathur.com
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 hidden sm:block leading-none mt-0.5">
                கீழ்பென்னாத்தூர்
              </span>
            </Link>

            {/* ── Desktop Navigation ── */}
            <nav
              className="hidden xl:flex items-center flex-1 min-w-0"
              aria-label="Main navigation"
            >
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.subItems && setOpenDropdown(item.label)
                  }
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.subItems ? (
                    <>
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-0.5 whitespace-nowrap px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                          isActive(item.href)
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50"
                            : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800",
                        )}
                        aria-expanded={openDropdown === item.label}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                      </button>
                      {/* Dropdown */}
                      <div
                        className={cn(
                          "absolute top-full left-0 mt-0 py-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-150",
                          openDropdown === item.label
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible -translate-y-1",
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
                        "inline-flex whitespace-nowrap px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                        isActive(item.href)
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50"
                          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* ── Right Controls ── */}
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              <ThemeToggle />
              <GlobalSearch />
              <span className="hidden md:inline-flex">
                <LanguageSwitcher />
              </span>
              <button
                type="button"
                className="flex xl:hidden items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[calc(2.25rem+3rem)]" aria-hidden="true" />

      {/* ═══ Mobile / Tablet Drawer ═══ */}
      <div
        className={cn(
          "fixed inset-0 z-[60] xl:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <div
          className={cn(
            "absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl flex flex-col transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-bold text-gray-900 dark:text-white">
              Menu
            </span>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer nav */}
          <nav
            className="flex-1 overflow-y-auto p-4"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.subItems ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpanded((e) =>
                            e === item.label ? null : item.label,
                          )
                        }
                        className="flex w-full items-center justify-between px-3 py-2.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-left"
                        aria-expanded={mobileExpanded === item.label}
                      >
                        <span className="flex flex-col items-start leading-tight">
                          <span>{item.label}</span>
                          <span className="text-gray-400 text-xs font-normal">
                            {item.labelTa}
                          </span>
                        </span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform",
                            mobileExpanded === item.label && "rotate-180",
                          )}
                        />
                      </button>
                      <ul
                        className={cn(
                          "overflow-hidden transition-all duration-200",
                          mobileExpanded === item.label
                            ? "max-h-96"
                            : "max-h-0",
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
                        isActive(item.href)
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                    >
                      <span className="block">{item.label}</span>
                      <span className="block text-gray-400 text-xs font-normal">
                        {item.labelTa}
                      </span>
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
