"use client";

import { useState, useEffect } from "react";
import { useCompareStore } from "@/lib/store";
import CompareTable from "@/components/compare/CompareTable";
import { MOCK_COLLEGES } from "@/lib/mock-data";
import { Scale, Plus, Bookmark, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CollegeCard } from "@/types";

export default function ComparePage() {
  const { selectedColleges, removeCollege, addCollege, clearColleges } = useCompareStore();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If empty on first visit, prepopulate with 3 top colleges like in Screenshot 1 (Stanford, MIT, UC Berkeley -> IIT Bombay, IIT Delhi, NIT Trichy)
    if (selectedColleges.length === 0) {
      MOCK_COLLEGES.slice(0, 3).forEach((col) => addCollege(col));
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSaveComparison = async () => {
    try {
      const res = await fetch("/api/saved-comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${selectedColleges.map((c) => c.name.split(" ")[0]).join(" vs ")}`,
          collegeIds: selectedColleges.map((c) => c.id),
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      // optimistic
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const availableToAdd = MOCK_COLLEGES.filter(
    (col) => !selectedColleges.some((c) => c.id === col.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header matching Screenshot 1 */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Side-by-Side Comparison
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
            Evaluate your top choices across key metrics. The best performing institution in each
            category is highlighted.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveComparison}
            disabled={selectedColleges.length < 2}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Saved to Library!</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 text-slate-400" />
                <span>Save Comparison</span>
              </>
            )}
          </button>

          {selectedColleges.length > 0 && (
            <button
              onClick={clearColleges}
              className="text-xs font-medium text-slate-500 hover:text-rose-600 transition"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedColleges.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Scale className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-800">
            No institutions selected for comparison
          </h2>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Browse our Discovery Hub and click the “Compare” button on any card to view metrics
            side by side.
          </p>
          <Link
            href="/"
            className="mt-6 flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <span>Explore Colleges</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <CompareTable
          colleges={selectedColleges}
          onRemove={(id) => removeCollege(id)}
          onAddClick={() => setShowModal(true)}
        />
      )}

      {/* Add College Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-bold text-slate-900">Add to Comparison</h3>
            <p className="mt-1 text-xs text-slate-500">
              Select an institution from the list below to compare side-by-side.
            </p>

            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
              {availableToAdd.map((col) => (
                <div
                  key={col.id}
                  onClick={() => {
                    addCollege(col);
                    setShowModal(false);
                  }}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:border-blue-500 hover:bg-blue-50/40 cursor-pointer transition"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{col.name}</h4>
                    <p className="text-[10px] text-slate-500">
                      {col.city}, {col.state} • Rank #{col.ranking}
                    </p>
                  </div>
                  <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {availableToAdd.length === 0 && (
                <p className="text-center py-6 text-xs text-slate-400">
                  All available colleges are already in your comparison!
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
