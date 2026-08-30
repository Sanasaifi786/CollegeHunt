"use client";

import { useState, useEffect } from "react";
import { Bookmark, Scale, Trash2, ArrowRight } from "lucide-react";
import { MOCK_COLLEGES, COLLEGE_IMAGE_MAP } from "@/lib/mock-data";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<"colleges" | "comparisons">("colleges");
  const [savedColleges, setSavedColleges] = useState(MOCK_COLLEGES.slice(0, 3));
  const [savedComparisons, setSavedComparisons] = useState<any[]>([
    {
      id: "comp-1",
      name: "Top Premier Engineering Matrix",
      collegeNames: "IIT Bombay, IIT Delhi, and BITS Pilani",
      createdAt: "2 days ago",
    },
  ]);

  useEffect(() => {
    async function loadSaved() {
      try {
        const [colRes, compRes] = await Promise.all([
          fetch("/api/saved"),
          fetch("/api/saved-comparisons"),
        ]);
        if (colRes.ok) {
          const colData = await colRes.json();
          if (colData.data && colData.data.length > 0) {
            setSavedColleges(colData.data.map((item: any) => item.college));
          }
        }
        if (compRes.ok) {
          const compData = await compRes.json();
          if (compData.data && compData.data.length > 0) {
            setSavedComparisons(compData.data);
          }
        }
      } catch {
        // Fallback
      }
    }
    loadSaved();
  }, []);

  const removeSaved = async (id: string) => {
    setSavedColleges(savedColleges.filter((c) => c.id !== id));
    try {
      await fetch(`/api/saved/${id}`, { method: "DELETE" });
    } catch {
      // optimistic
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Saved Institutions & Comparisons
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Your bookmarked shortlist and custom comparison matrices.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 mb-6">
        <button
          onClick={() => setActiveTab("colleges")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "colleges"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          <span>Saved Colleges ({savedColleges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("comparisons")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "comparisons"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Scale className="h-3.5 w-3.5" />
          <span>Saved Comparisons (1)</span>
        </button>
      </div>

      {activeTab === "colleges" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedColleges.map((col) => {
            const collegeMeta = COLLEGE_IMAGE_MAP[col.slug];
            const colImage =
              col.images?.[0] || col.image || collegeMeta?.cover ||
              "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={col.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div>
                  {/* Campus Photo Header */}
                  <div className="relative -mx-5 -mt-5 mb-4 h-36 overflow-hidden bg-slate-100">
                    <img
                      src={colImage}
                      alt={col.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                    <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800 backdrop-blur-md shadow-xs">
                      {col.type}
                    </span>

                    <button
                      onClick={() => removeSaved(col.id)}
                      className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-500 backdrop-blur-md transition hover:bg-rose-50 hover:text-rose-600 shadow-xs"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{col.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {col.city}, {col.state} • NIRF #{col.nirf}
                  </p>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs flex justify-between">
                    <span className="text-slate-500">Annual Tuition:</span>
                    <span className="font-bold text-slate-800">
                      {formatCurrency(col.annualFees || 250000)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex justify-between items-center border-t border-slate-100 pt-3">
                  <Link
                    href={`/college/${col.slug}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}

          {savedColleges.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-slate-500">
              No saved colleges yet. Browse colleges and click the bookmark icon!
            </div>
          )}
        </div>
      )}

      {activeTab === "comparisons" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {savedComparisons.map((comp) => (
            <div key={comp.id} className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">{comp.name || "Saved Comparison"}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {comp.collegeNames || `${comp.collegeIds?.length || 3} institutions comparison`}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">{comp.createdAt || "Recently saved"}</span>
                <Link
                  href="/compare"
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  <span>Open Comparison</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
          {savedComparisons.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-slate-500">
              No saved comparisons yet. Compare colleges and click "Save Comparison"!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
