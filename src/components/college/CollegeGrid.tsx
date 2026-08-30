"use client";

import { CollegeCard as CollegeCardType } from "@/types";
import CollegeCard from "./CollegeCard";
import { GraduationCap } from "lucide-react";

interface CollegeGridProps {
  colleges: CollegeCardType[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function CollegeGrid({
  colleges,
  isLoading,
  onLoadMore,
  hasMore = false,
}: CollegeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="h-80 w-full animate-pulse rounded-2xl border border-slate-200/80 bg-white p-4"
          >
            <div className="h-40 rounded-xl bg-slate-100" />
            <div className="mt-4 h-4 w-3/4 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
            <div className="mt-6 flex justify-between">
              <div className="h-4 w-1/3 rounded bg-slate-100" />
              <div className="h-8 w-8 rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (colleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-800">
          No institutions found
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Try loosening your search filters or clear keywords to view all matching colleges.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 3-Column Responsive Grid matching Screenshot 1 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {colleges.map((college, idx) => (
          <CollegeCard
            key={college.id}
            college={college}
            matchScore={98 - idx * 2} // visually striking match percentages like in the reference
          />
        ))}
      </div>

      {/* "Load More Results" outline button from Screenshot 1 */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            className="rounded-xl border border-slate-200 bg-white px-8 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
}