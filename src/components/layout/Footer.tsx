import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-sm text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <span>CollegeHunt</span>
          <span className="text-xs font-normal text-slate-400">
            © {new Date().getFullYear()} CollegeHunt. All rights reserved.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
          <Link href="#" className="transition hover:text-slate-900">
            Privacy
          </Link>
          <Link href="#" className="transition hover:text-slate-900">
            Terms
          </Link>
          <Link href="#" className="transition hover:text-slate-900">
            About
          </Link>
          <Link href="#" className="transition hover:text-slate-900">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}