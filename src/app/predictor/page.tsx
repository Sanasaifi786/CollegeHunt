"use client";

import { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { MOCK_COLLEGES, COLLEGE_IMAGE_MAP } from "@/lib/mock-data";
import ChanceBadge from "@/components/predictor/ChanceBadge";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState(1450);
  const [score, setScore] = useState(98.5);
  const [category, setCategory] = useState("General");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Leadership",
    "Athletics (Varsity)",
    "Community Service",
  ]);
  const [isCalculating, setIsCalculating] = useState(false);

  const availableTags = [
    "Leadership",
    "Athletics (Varsity)",
    "Community Service",
    "Debate / Model UN",
    "Hackathons / Coding",
    "Research Paper",
  ];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const defaultMatches = [
    {
      college: MOCK_COLLEGES[0],
      course: "Computer Science & Engineering",
      chance: (rank <= 1000 ? "Good" : "Ambitious") as "Safe" | "Good" | "Ambitious",
      cutoffRank: 65,
    },
    {
      college: MOCK_COLLEGES[1],
      course: "Electrical Engineering",
      chance: (rank <= 1500 ? "Good" : "Ambitious") as "Safe" | "Good" | "Ambitious",
      cutoffRank: 1100,
    },
    {
      college: MOCK_COLLEGES[2],
      course: "Computer Science",
      chance: "Safe" as const,
      cutoffRank: 3200,
    },
    {
      college: MOCK_COLLEGES[3],
      course: "Electronics & Communication",
      chance: "Safe" as const,
      cutoffRank: 4500,
    },
  ];

  const [matchedColleges, setMatchedColleges] = useState<any[]>(defaultMatches);

  const handleRecalculate = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          rank: Number(rank),
          percentile: Number(score),
          category,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setMatchedColleges(
            json.data.map((item: any) => ({
              college: item.college,
              course: item.course?.name || "Engineering Program",
              chance: item.chance,
              cutoffRank: item.cutoffRank,
            }))
          );
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header matching Screenshot 2 */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Admission Chance Predictor
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
          Enter your academic and entrance exam profile to visualize your admission chances across
          different university tiers.
        </p>
      </div>

      {/* 2-Column Grid matching Screenshot 2 */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Your Profile Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">Your Profile</h2>

            <div className="mt-5 space-y-4">
              {/* Exam Selection */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Entrance Examination
                </label>
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="JEE Main">JEE Main (Engineering)</option>
                  <option value="JEE Advanced">JEE Advanced (IITs)</option>
                  <option value="NEET">NEET (Medical)</option>
                  <option value="CAT">CAT (IIMs / Management)</option>
                  <option value="BITSAT">BITSAT (BITS Campuses)</option>
                </select>
              </div>

              {/* Rank & Score / Percentile inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    AIR / Exam Rank
                  </label>
                  <input
                    type="number"
                    value={rank}
                    onChange={(e) => setRank(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="e.g. 1450"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Percentile (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="e.g. 98.5"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Admission Category
                </label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {["General", "OBC", "SC", "ST", "EWS"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        category === cat
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extracurricular Impact Chips matching Screenshot 2 */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Extracurricular / Profile Impact
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Recalculate Button */}
              <button
                type="button"
                onClick={handleRecalculate}
                disabled={isCalculating}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-75"
              >
                <RotateCcw className={`h-4 w-4 ${isCalculating ? "animate-spin" : ""}`} />
                <span>{isCalculating ? "Calculating Odds..." : "Recalculate Odds"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Dashboard matching Screenshot 2 */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            {/* Top Analysis Row: Circular Donut Gauge + Segment Progress Bars */}
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-8">
              {/* Circular Gauge matching Screenshot 2 */}
              <div className="flex flex-col items-center">
                <div className="relative flex h-36 w-36 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#059669"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="75.3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center text-center">
                    <span className="text-3xl font-extrabold text-slate-900">70%</span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      Average Match
                    </span>
                  </div>
                </div>
              </div>

              {/* Target University Segments matching Screenshot 2 */}
              <div className="w-full flex-1 max-w-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Target University Segments</h3>

                {/* Safety Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Safety Tier</span>
                    <span className="text-emerald-600">78%</span>
                  </div>
                  <div className="mt-1 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[78%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Target Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Target Tier</span>
                    <span className="text-amber-600">42%</span>
                  </div>
                  <div className="mt-1 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[42%] rounded-full bg-amber-500" />
                  </div>
                </div>

                {/* Reach Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Reach / Ambitious</span>
                    <span className="text-indigo-600">15%</span>
                  </div>
                  <div className="mt-1 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[15%] rounded-full bg-indigo-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Gap Areas matching Screenshot 2 */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Strengths Box */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Strengths</span>
                </div>
                <ul className="mt-2 space-y-2 text-xs text-emerald-950">
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>
                      Rank #{rank} firmly places your profile in the top quartile for tier-1 NITs and
                      top deemed institutes.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>
                      Active leadership and extracurricular engagement strengthen eligibility for
                      special quota programs.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Gap Areas Box */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  <span>Gap Areas</span>
                </div>
                <ul className="mt-2 space-y-2 text-xs text-rose-950">
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" />
                    <span>
                      Rank is slightly below the cutoff threshold for Top 3 IIT CSE branches.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" />
                    <span>
                      Consider exploring top interdisciplinary or dual-degree tracks for higher odds.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Link to improve odds */}
            <div className="mt-6 flex justify-end">
              <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition">
                <span>Improve My Odds</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Matched Institutions Section below */}
      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recommended Institutions For You</h2>
            <p className="text-xs text-slate-500">
              Categorized by real admission probability derived from past year opening & closing ranks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {matchedColleges.map((item) => {
            const collegeMeta = COLLEGE_IMAGE_MAP[item.college.slug];
            const colImage =
              item.college.images?.[0] || item.college.image || collegeMeta?.cover ||
              "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80";

            return (
              <div
                key={item.college.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div>
                  {/* Campus Photo Header */}
                  <div className="relative -mx-5 -mt-5 mb-4 h-32 overflow-hidden bg-slate-100">
                    <img
                      src={colImage}
                      alt={item.college.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                    <div className="absolute top-2.5 left-2.5">
                      <ChanceBadge chance={item.chance} />
                    </div>
                    <span className="absolute top-2.5 right-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-800 backdrop-blur-md shadow-xs">
                      NIRF #{item.college.nirf}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {item.college.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{item.course}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {item.college.city}, {item.college.state}
                  </p>

                  <div className="mt-4 rounded-xl bg-slate-50 p-2.5 text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Closing Rank:</span>
                      <span className="font-semibold text-slate-800">~{item.cutoffRank}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Annual Tuition:</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(item.college.annualFees || 200000)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3">
                  <Link
                    href={`/college/${item.college.slug}`}
                    className="flex items-center justify-between text-xs font-bold text-slate-900 hover:text-blue-600"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
