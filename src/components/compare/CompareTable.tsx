"use client";

import {
  IndianRupee,
  Users,
  Briefcase,
  Trophy,
  Award,
  Sparkles,
  X,
  Plus,
  Star,
} from "lucide-react";
import { CollegeCard } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { COLLEGE_IMAGE_MAP } from "@/lib/mock-data";

interface CompareTableProps {
  colleges: CollegeCard[];
  onRemove: (id: string) => void;
  onAddClick: () => void;
}

export default function CompareTable({
  colleges,
  onRemove,
  onAddClick,
}: CompareTableProps) {
  // Determine winner for tuition (lowest is winner)
  const minFees = Math.min(...colleges.map((c) => c.annualFees || 9999999));
  // Determine winner for ranking (lowest rank number is best)
  const bestRank = Math.min(...colleges.map((c) => c.ranking || 999));

  const mockVibes: Record<string, string[]> = {
    "col-1": ["Research Heavy", "Startups Hub", "Competitive"],
    "col-2": ["Tech Innovators", "Startup Incubator", "Urban"],
    "col-3": ["Zero Attendance Policy", "Vibrant Fest", "Industry Oriented"],
    "col-4": ["Academics First", "Green Campus", "Strong Alumni"],
    "col-5": ["Coding Culture", "High Research", "No Reservation"],
    "col-6": ["Modern Labs", "Global Exchange", "Diverse"],
  };

  const studentFacultyRatios: Record<string, string> = {
    "col-1": "8:1",
    "col-2": "9:1",
    "col-3": "12:1",
    "col-4": "14:1",
    "col-5": "10:1",
    "col-6": "18:1",
  };

  const placementRates: Record<string, { rate: string; avg: string }> = {
    "col-1": { rate: "95%", avg: "₹28.5 LPA" },
    "col-2": { rate: "93%", avg: "₹26.2 LPA" },
    "col-3": { rate: "90%", avg: "₹21.0 LPA" },
    "col-4": { rate: "88%", avg: "₹18.5 LPA" },
    "col-5": { rate: "98%", avg: "₹32.0 LPA" },
    "col-6": { rate: "82%", avg: "₹9.2 LPA" },
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <table className="w-full border-collapse text-left">
        {/* Table Header: Colleges */}
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50">
            <th className="w-64 p-6 text-xs font-bold uppercase tracking-wider text-slate-400">
              Metrics
            </th>
            {colleges.map((college) => {
              const collegeMeta = COLLEGE_IMAGE_MAP[college.slug];
              const colImage =
                college.images?.[0] || college.image || collegeMeta?.cover;
              const brandGradient = collegeMeta?.logoColor || "from-indigo-900 to-blue-700";
              const brandLabel = collegeMeta?.label || college.name.slice(0, 2).toUpperCase();

              return (
                <th
                  key={college.id}
                  className="w-72 min-w-[260px] p-6 align-top font-normal"
                >
                  <div className="relative flex flex-col items-center text-center">
                    {/* Remove Button */}
                    <button
                      onClick={() => onRemove(college.id)}
                      className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-xs backdrop-blur-md transition hover:bg-rose-50 hover:text-rose-600"
                      title="Remove from comparison"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    {/* Campus Photo Thumbnail */}
                    {colImage && (
                      <div className="mb-3 h-24 w-full overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
                        <img
                          src={colImage}
                          alt={college.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Logo & Monogram */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white font-bold text-slate-800 shadow-xs overflow-hidden">
                      {college.logo ? (
                        <img src={college.logo} alt="" className="h-7 w-7 object-contain" />
                      ) : (
                        <div
                          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${brandGradient} text-xs font-black text-white`}
                        >
                          {brandLabel}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <Link
                      href={`/college/${college.slug}`}
                      className="mt-2.5 text-sm font-bold text-slate-900 transition hover:text-blue-600 line-clamp-1"
                    >
                      {college.name}
                    </Link>

                    {/* Type Pill */}
                    <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                      {college.type === "GOVERNMENT" ? "Public / Govt" : college.type.toLowerCase()}
                    </span>
                  </div>
                </th>
              );
            })}

            {/* Add College Column (up to 4) */}
            {colleges.length < 4 && (
              <th className="w-64 min-w-[220px] p-6 align-top font-normal">
                <button
                  onClick={onAddClick}
                  className="flex h-36 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-blue-100 group-hover:text-blue-600">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="mt-2 text-xs font-bold text-slate-700">Add College</span>
                  <span className="text-[10px] text-slate-400">Up to 4 colleges</span>
                </button>
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-sm">
          {/* Row 1: Annual Fees */}
          <tr>
            <td className="p-5 font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-slate-400" />
                <span>Annual Tuition / Fees</span>
              </div>
            </td>
            {colleges.map((college) => {
              const isWinner = college.annualFees === minFees;
              return (
                <td
                  key={college.id}
                  className={`p-5 text-center transition ${
                    isWinner ? "bg-emerald-50/70 text-emerald-950 font-bold" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>
                      {college.annualFees ? formatCurrency(college.annualFees) : "—"}
                    </span>
                    {isWinner && (
                      <span title="Lowest Tuition">
                        <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
                      </span>
                    )}
                  </div>
                </td>
              );
            })}
            {colleges.length < 4 && <td />}
          </tr>

          {/* Row 2: NIRF / Ranking */}
          <tr>
            <td className="p-5 font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-slate-400" />
                <span>Institutional Rank</span>
              </div>
            </td>
            {colleges.map((college) => {
              const isWinner = college.ranking === bestRank;
              return (
                <td
                  key={college.id}
                  className={`p-5 text-center ${
                    isWinner ? "bg-emerald-50/70 text-emerald-950 font-bold" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Rank #{college.ranking ?? "—"}</span>
                    {isWinner && (
                      <span title="Best Rank">
                        <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
                      </span>
                    )}
                  </div>
                </td>
              );
            })}
            {colleges.length < 4 && <td />}
          </tr>

          {/* Row 3: Student / Faculty Ratio */}
          <tr>
            <td className="p-5 font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                <span>Student / Faculty Ratio</span>
              </div>
            </td>
            {colleges.map((college) => {
              const ratio = studentFacultyRatios[college.id] || "10:1";
              const isWinner = ratio === "8:1";
              return (
                <td
                  key={college.id}
                  className={`p-5 text-center ${
                    isWinner ? "bg-emerald-50/70 text-emerald-950 font-bold" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>{ratio}</span>
                    {isWinner && <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />}
                  </div>
                </td>
              );
            })}
            {colleges.length < 4 && <td />}
          </tr>

          {/* Row 4: Placement Rate & Package */}
          <tr>
            <td className="p-5 font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-400" />
                <span>Placement Rate & Avg Package</span>
              </div>
            </td>
            {colleges.map((college) => {
              const pl = placementRates[college.id] || { rate: "90%", avg: "₹20 LPA" };
              const isWinner = pl.rate === "98%" || pl.rate === "95%";
              return (
                <td
                  key={college.id}
                  className={`p-5 text-center ${
                    isWinner ? "bg-emerald-50/70 text-emerald-950 font-bold" : "text-slate-700"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-slate-900">{pl.rate} Placed</span>
                    <span className="text-xs text-blue-600 font-semibold">{pl.avg}</span>
                  </div>
                </td>
              );
            })}
            {colleges.length < 4 && <td />}
          </tr>

          {/* Row 5: NAAC Accreditation */}
          <tr>
            <td className="p-5 font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-slate-400" />
                <span>NAAC Accreditation</span>
              </div>
            </td>
            {colleges.map((college) => {
              const isWinner = college.accreditation === "A++";
              return (
                <td
                  key={college.id}
                  className={`p-5 text-center ${
                    isWinner ? "bg-emerald-50/70 text-emerald-950 font-bold" : "text-slate-700"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200/60">
                    Grade {college.accreditation ?? "A"}
                  </span>
                </td>
              );
            })}
            {colleges.length < 4 && <td />}
          </tr>

          {/* Row 6: Campus Vibe / Tags matching Screenshot 1 */}
          <tr>
            <td className="p-5 font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-slate-400" />
                <span>Campus Vibe</span>
              </div>
            </td>
            {colleges.map((college) => {
              const vibes = mockVibes[college.id] || ["Academic", "Sprawling Campus", "Active Clubs"];
              return (
                <td key={college.id} className="p-5 text-center">
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {vibes.map((v) => (
                      <span
                        key={v}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </td>
              );
            })}
            {colleges.length < 4 && <td />}
          </tr>
        </tbody>
      </table>
    </div>
  );
}