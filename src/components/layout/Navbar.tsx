"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Search, Bell, Sparkles, Scale, MessageSquare, Compass, User, Bookmark, LogOut } from "lucide-react";
import { useCompareStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const selectedColleges = useCompareStore((state) => state.selectedColleges);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Discovery", href: "/", icon: Compass },
    {
      name: "Compare",
      href: "/compare",
      icon: Scale,
      badge: mounted && selectedColleges.length > 0 ? selectedColleges.length : null,
    },
    { name: "Predictor", href: "/predictor", icon: Sparkles },
    { name: "Community", href: "/discussions", icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-900 to-blue-700 text-white shadow-md shadow-indigo-900/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              College<span className="text-blue-600">Hunt</span>
            </span>
          </Link>

          {/* Quick Search in Navbar (matching screenshot 2 & 3) */}
          <div className="hidden md:flex relative w-64 lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search colleges..."
              className="w-full rounded-full bg-slate-100/90 py-1.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  window.location.href = `/?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                }
              }}
            />
          </div>
        </div>

        {/* Center / Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <link.icon className={`h-4 w-4 ${isActive ? "text-blue-300" : "text-slate-500"}`} />
                <span>{link.name}</span>
                {link.badge !== null && link.badge !== undefined && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          <Link
            href="/saved"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            title="Saved Colleges"
          >
            <Bookmark className="h-5 w-5" />
          </Link>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          {session?.user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 text-xs font-semibold text-slate-700 shadow-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs">
                  {session.user.name?.slice(0, 2).toUpperCase() || "U"}
                </div>
                <span className="max-w-[100px] truncate">{session.user.name || "Student"}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-semibold text-xs">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}