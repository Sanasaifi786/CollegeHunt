"use client";

import { useState, useEffect, useMemo } from "react";
import SearchBar from "@/components/filters/SearchBar";
import FilterSidebar from "@/components/filters/FilterSidebar";
import CollegeGrid from "@/components/college/CollegeGrid";
import { CollegeCard } from "@/types";
import { MOCK_COLLEGES } from "@/lib/mock-data";
import { ArrowUpDown } from "lucide-react";

export default function DiscoveryPage() {
  const [colleges, setColleges] = useState<CollegeCard[]>(MOCK_COLLEGES);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedAccreditation, setSelectedAccreditation] = useState<string[]>([]);
  const [maxFees, setMaxFees] = useState(500000);
  const [sortBy, setSortBy] = useState("ranking");

  // Fetch from backend API if available, fallback to mock
  useEffect(() => {
    async function loadColleges() {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.set("search", search);
        if (selectedState) query.set("state", selectedState);
        const res = await fetch(`/api/colleges?${query.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setColleges(json.data);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // use mock data
      }
      setColleges(MOCK_COLLEGES);
      setIsLoading(false);
    }
    loadColleges();
  }, [search, selectedState]);

  // Client-side filtering on mock data for super instant responsive interactions
  const filteredColleges = useMemo(() => {
    return colleges
      .filter((col) => {
        if (search) {
          const s = search.toLowerCase();
          const matches =
            col.name.toLowerCase().includes(s) ||
            col.city.toLowerCase().includes(s) ||
            col.state.toLowerCase().includes(s);
          if (!matches) return false;
        }

        if (selectedType.length > 0 && !selectedType.includes(col.type)) {
          return false;
        }

        if (selectedState && col.state.toLowerCase() !== selectedState.toLowerCase()) {
          return false;
        }

        if (
          selectedAccreditation.length > 0 &&
          (!col.accreditation || !selectedAccreditation.includes(col.accreditation))
        ) {
          return false;
        }

        if (col.annualFees && maxFees < 500000 && col.annualFees > maxFees) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "ranking") return (a.ranking ?? 999) - (b.ranking ?? 999);
        if (sortBy === "fees-asc") return (a.annualFees ?? 0) - (b.annualFees ?? 0);
        if (sortBy === "fees-desc") return (b.annualFees ?? 0) - (a.annualFees ?? 0);
        if (sortBy === "rating") return (b.avgRating ?? 0) - (a.avgRating ?? 0);
        return 0;
      });
  }, [colleges, search, selectedType, selectedState, selectedAccreditation, maxFees, sortBy]);

  const handleReset = () => {
    setSearch("");
    setSelectedType([]);
    setSelectedState("");
    setSelectedAccreditation([]);
    setMaxFees(500000);
    setSortBy("ranking");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Hero Section matching Screenshot 1 */}
      <section className="mb-12">
        <SearchBar
          initialSearch={search}
          onSearch={(term) => setSearch(term)}
        />
      </section>

      {/* Main Area: Sidebar + College Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left Sidebar (Refine Search) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <FilterSidebar
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedState={selectedState}
              onStateChange={setSelectedState}
              selectedAccreditation={selectedAccreditation}
              onAccreditationChange={setSelectedAccreditation}
              maxFees={maxFees}
              onMaxFeesChange={setMaxFees}
              onReset={handleReset}
            />
          </div>
        </aside>

        {/* Right Content */}
        <main className="lg:col-span-3">
          {/* Header Row: Result counter & Sorting */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Showing <span className="text-blue-600">{filteredColleges.length}</span> institutions
              </p>
              <p className="text-xs text-slate-400">
                Ranked by institutional metrics and verified student ratings
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none transition hover:border-slate-300 focus:border-blue-500"
              >
                <option value="ranking">Overall Rank</option>
                <option value="rating">Student Rating</option>
                <option value="fees-asc">Tuition: Low to High</option>
                <option value="fees-desc">Tuition: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <CollegeGrid
            colleges={filteredColleges}
            isLoading={isLoading}
            hasMore={false}
          />
        </main>
      </div>
    </div>
  );
}
