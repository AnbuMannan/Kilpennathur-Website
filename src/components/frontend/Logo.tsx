import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 group", className)}>
      {/* Brand Mark: Temple Gopuram Icon */}
      <div className="relative w-10 h-10 flex items-center justify-center bg-blue-600 rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors duration-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-6 h-6 text-white"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Temple Tower (Gopuram) Stylized Shape */}
          <path
            d="M12 2L15 8H9L12 2Z"
            fill="currentColor"
            className="text-white/20"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 22H20M4 22V18H20V22M6 18V14H18V18M7 14V10H17V14M8 10V6H16V10M12 2L16 6H8L12 2Z"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col -space-y-1">
        <div className="flex items-baseline">
          <span className="text-xl font-bold font-serif tracking-tight text-slate-900 dark:text-white">
            Kilpennathur
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 ml-0.5">
            
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-tamil tracking-wide">
          கீழ்பென்னாத்தூர்
        </span>
      </div>
    </Link>
  );
}
