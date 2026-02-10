import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DynamicIcon } from "@/lib/icons";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type ServiceHeroProps = {
  title: string;
  titleTamil?: string | null;
  subtitle?: string | null;
  iconName?: string | null;
  breadcrumbItems: BreadcrumbItem[];
};

export function ServiceHero({
  title,
  titleTamil,
  subtitle,
  iconName,
  breadcrumbItems,
}: ServiceHeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-slate-800">
      {/* Watermark Icon */}
      <div className="absolute right-4 -bottom-8 md:right-10 md:-bottom-10 opacity-[0.07] pointer-events-none">
        <DynamicIcon name={iconName} className="w-48 h-48 md:w-64 md:h-64 text-white" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 40L40 0M-10 10L10-10M30 50L50 30' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative container max-w-7xl mx-auto px-4 py-10 md:py-14">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex items-center gap-1.5 text-sm">
            {breadcrumbItems.map((item, i) => {
              const isLast = i === breadcrumbItems.length - 1;
              return (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 text-white/50 shrink-0" />
                  )}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-white/90 font-medium">
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Title row */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-yellow-400/20 border border-yellow-400/30 p-3 shrink-0">
            <DynamicIcon
              name={iconName}
              className="h-10 w-10 md:h-12 md:w-12 text-yellow-400"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
              {title}
            </h1>
            {titleTamil && (
              <p className="text-lg md:text-xl text-blue-200 mt-1 leading-relaxed">
                {titleTamil}
              </p>
            )}
          </div>
        </div>

        {/* Subtitle / Description */}
        {subtitle && (
          <p className="mt-5 text-blue-100 max-w-3xl text-lg leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
