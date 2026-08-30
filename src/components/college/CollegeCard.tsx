"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Bookmark, Check, Plus, Scale } from "lucide-react";
import { CollegeCard as CollegeCardType } from "@/types";
import RatingBadge from "./RatingBadge";
import { formatCurrency } from "@/lib/utils";
import { useCompareStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { COLLEGE_IMAGE_MAP } from "@/lib/mock-data";

interface CollegeCardProps {
  college: CollegeCardType;
  matchScore?: number;
  featured?: boolean;
}

export default function CollegeCard({ college, matchScore, featured }: CollegeCardProps) {
  const { addCollege, removeCollege, isComparing } = useCompareStore();
  const [comparing, setComparing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setComparing(isComparing(college.id));
  }, [college.id, isComparing]);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (comparing) {
      removeCollege(college.id);
      setComparing(false);
    } else {
      const added = addCollege(college);
      if (added) {
        setComparing(true);
      } else {
        alert("You can compare up to 4 colleges at a time.");
      }
    }
  };

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    try {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college.id }),
      });
    } catch {
      // optimistic fallback
    }
  };

  // Real campus photo and brand branding
  const collegeMeta = COLLEGE_IMAGE_MAP[college.slug];
  const cardImage =
    college.images?.[0] ||
    college.image ||
    collegeMeta?.cover ||
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80";

  const brandGradient = collegeMeta?.logoColor || "from-indigo-800 to-blue-600";
  const brandLabel = collegeMeta?.label || college.name.slice(0, 2).toUpperCase();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Top Image Box */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={cardImage}
          alt={college.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-slate-800 backdrop-blur-md shadow-xs">
            {college.type === "GOVERNMENT" ? "Public" : college.type.toLowerCase()}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleCompare}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md transition ${
                comparing
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white/90 text-slate-700 hover:bg-white"
              }`}
              title="Compare college"
            >
              <Scale className="h-3 w-3" />
              <span>{comparing ? "Comparing" : "Compare"}</span>
            </button>

            <button
              onClick={toggleSave}
              className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition ${
                saved
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white/90 text-slate-700 hover:bg-white"
              }`}
              title="Save to Wishlist"
            >
              <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-white" : ""}`} />
            </button>
          </div>
        </div>

        {/* Floating College Logo on bottom-left */}
        <div className="absolute -bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-white font-bold text-slate-800 shadow-md overflow-hidden">
          {college.logo ? (
            <img src={college.logo} alt="" className="h-8 w-8 object-contain" />
          ) : (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${brandGradient} text-xs font-black tracking-wider text-white shadow-inner`}>
              {brandLabel}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5 pt-7">
        {/* Name & Match Rating */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/college/${college.slug}`}
              className="line-clamp-1 text-base font-bold text-slate-900 transition hover:text-blue-600"
            >
              {college.name}
            </Link>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {college.city}, {college.state}
              </span>
            </div>
          </div>

          <RatingBadge
            rating={college.avgRating ?? 4.5}
            matchScore={matchScore}
          />
        </div>

        {/* Quick Highlights / Tags */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
          {college.nirf && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
              NIRF #{college.nirf}
            </span>
          )}
          {college.accreditation && (
            <span className="rounded-md bg-amber-50 px-2 py-0.5 font-medium text-amber-800 border border-amber-200/60">
              NAAC {college.accreditation}
            </span>
          )}
          {college.ranking && (
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
              Rank #{college.ranking}
            </span>
          )}
        </div>

        {/* Bottom Metrics & Arrow Link */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Avg Tuition
            </span>
            <p className="text-sm font-bold text-slate-900">
              {college.annualFees ? `${formatCurrency(college.annualFees)}/yr` : "Fees on request"}
            </p>
          </div>

          <Link
            href={`/college/${college.slug}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-blue-600 group-hover:text-white"
            title="View Details"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}