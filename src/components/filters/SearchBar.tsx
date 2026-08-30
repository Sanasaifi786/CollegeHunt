"use client";

import { useState } from "react";
import { Search, GraduationCap, MapPin, IndianRupee, Percent } from "lucide-react";

interface SearchBarProps {
  initialSearch?: string;
  onSearch: (term: string) => void;
  onTagClick?: (tag: string) => void;
}

export default function SearchBar({
  initialSearch = "",
  onSearch,
  onTagClick,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const quickPills = [
    { label: "Engineering", icon: GraduationCap, query: "Engineering" },
    { label: "Management (MBA)", icon: GraduationCap, query: "MBA" },
    { label: "Top Delhi / Mumbai", icon: MapPin, query: "Delhi" },
    { label: "Under ₹2 Lakh", icon: IndianRupee, query: "fees" },
    { label: "High Placement Rate", icon: Percent, query: "placement" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Find Your Perfect Match
      </h1>
      <p className="mt-2 text-sm text-slate-600 sm:text-base max-w-xl">
        Leverage data-driven insights to discover institutions that align with your
        academic goals and financial profile.
      </p>

      {/* Prominent Search Bar from Screenshot 1 */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex w-full items-center rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-lg shadow-slate-200/50 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"
      >
        <div className="flex flex-1 items-center pl-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by university, degree, city, or state..."
            className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm"
        >
          Explore
        </button>
      </form>

      {/* Quick Filter Pills from Screenshot 1 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {quickPills.map((pill) => (
          <button
            key={pill.label}
            type="button"
            onClick={() => {
              setSearchTerm(pill.query);
              onSearch(pill.query);
            }}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-medium text-slate-600 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <pill.icon className="h-3 w-3 text-slate-500" />
            <span>{pill.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}