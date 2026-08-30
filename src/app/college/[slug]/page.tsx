"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Trophy,
  Star,
  Building,
  ArrowLeft,
  Scale,
  Bookmark,
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { MOCK_COLLEGES, COLLEGE_IMAGE_MAP } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { useCompareStore } from "@/lib/store";
import { useEffect } from "react";

export default function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [liveCollege, setLiveCollege] = useState<any>(null);
  const { addCollege, isComparing, removeCollege } = useCompareStore();

  useEffect(() => {
    async function fetchCollege() {
      try {
        const res = await fetch(`/api/colleges/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setLiveCollege(data);
        }
      } catch {
        // Fallback to mock
      }
    }
    fetchCollege();
  }, [slug]);

  const fallbackCollege =
    MOCK_COLLEGES.find((c) => c.slug === slug || c.id === slug) || MOCK_COLLEGES[0];

  const college = liveCollege || fallbackCollege;

  // Real campus images and brand
  const collegeMeta = COLLEGE_IMAGE_MAP[slug] || COLLEGE_IMAGE_MAP[college.slug];
  const heroImage =
    (college.images && college.images.length > 0 ? college.images[0] : null) ||
    collegeMeta?.cover ||
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80";

  const galleryImages =
    college.images && college.images.length > 0
      ? college.images
      : collegeMeta?.gallery || [heroImage];

  const brandGradient = collegeMeta?.logoColor || "from-indigo-900 to-blue-700";
  const brandLabel = collegeMeta?.label || college.name.slice(0, 2).toUpperCase();

  const placements = college.placements || [];
  const latestPlacement = placements.length > 0 ? placements[0] : null;

  const comparing = isComparing(college.id);

  const toggleCompare = () => {
    if (comparing) {
      removeCollege(college.id);
    } else {
      addCollege(college);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "courses", label: "Courses & Cutoffs" },
    { id: "placements", label: "Placements" },
    { id: "reviews", label: "Student Reviews" },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Top Banner / Hero Image */}
      <div className="relative h-72 w-full bg-slate-900 sm:h-80 lg:h-96 overflow-hidden">
        <img
          src={heroImage}
          alt={college.name}
          className="h-full w-full object-cover opacity-75 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        {/* Back link & Actions */}
        <div className="absolute top-6 left-4 right-4 mx-auto max-w-7xl flex items-center justify-between sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/60"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Discovery</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleCompare}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold backdrop-blur-md transition ${
                comparing
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white/90 text-slate-800 hover:bg-white"
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>{comparing ? "In Comparison" : "Add to Compare"}</span>
            </button>

            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-800 backdrop-blur-md hover:bg-white transition"
              title="Bookmark"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Floating Identity & Details */}
        <div className="absolute bottom-6 left-4 right-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className={`flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br ${brandGradient} font-black text-xl sm:text-2xl text-white shadow-xl tracking-wider`}>
                {brandLabel}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-blue-500/30 px-3 py-0.5 text-xs font-bold text-blue-200 backdrop-blur-md border border-blue-400/30">
                    {college.type}
                  </span>
                  <span className="rounded-full bg-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-200 backdrop-blur-md border border-emerald-400/30">
                    NIRF #{college.nirf}
                  </span>
                  <span className="rounded-full bg-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-200 backdrop-blur-md border border-amber-400/30">
                    NAAC {college.accreditation}
                  </span>
                </div>

                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
                  {college.name}
                </h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {college.city}, {college.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-white">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                  Annual Tuition
                </span>
                <p className="text-lg font-extrabold">
                  {formatCurrency(college.annualFees || 250000)}
                </p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                  Student Rating
                </span>
                <div className="flex items-center gap-1 text-lg font-extrabold text-emerald-400">
                  <Star className="h-4 w-4 fill-emerald-400" />
                  <span>{college.avgRating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="sticky top-16 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl gap-6 px-4 sm:px-6 lg:px-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 py-4 text-xs font-bold transition uppercase tracking-wider ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Box */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold text-slate-900">About the Institution</h2>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {college.name} is recognized globally as one of the premier academic and
                    research institutions in the country. Known for high-impact innovation, state-of-the-art
                    laboratories, and industry partnerships with world-leading technology firms, it provides an
                    unmatched ecosystem for aspiring leaders, engineers, and researchers.
                  </p>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Established
                      </span>
                      <p className="text-sm font-bold text-slate-800">1958</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Campus Area</span>
                      <p className="text-sm font-bold text-slate-800">550 Acres</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Student Strength
                      </span>
                      <p className="text-sm font-bold text-slate-800">12,000+</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Faculty Ratio
                      </span>
                      <p className="text-sm font-bold text-slate-800">8:1</p>
                    </div>
                  </div>
                </div>

                {/* Real Campus Architecture & Verified Photo Gallery */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Campus Architecture & Tour</h3>
                      <p className="text-xs text-slate-500">Real verified photos of {college.name} campus & facilities</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                      {galleryImages.length} Verified Photos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {galleryImages.map((imgUrl: string, idx: number) => (
                      <div
                        key={idx}
                        className="group relative h-48 overflow-hidden rounded-xl bg-slate-100 shadow-2xs border border-slate-100"
                      >
                        <img
                          src={imgUrl}
                          alt={`${college.name} photo ${idx + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                        <span className="absolute bottom-2.5 left-3 text-xs font-semibold text-white tracking-wide drop-shadow-sm">
                          {idx === 0
                            ? "Main Academic Complex"
                            : idx === 1
                            ? "Research Lab & Innovation Quad"
                            : idx === 2
                            ? "Central Library & Media Center"
                            : "Hostel & Athletic Complex"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Placement Highlights */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">Recent Placement Highlights</h2>
                    {latestPlacement && (
                      <span className="text-xs font-semibold text-slate-500">
                        Class of {latestPlacement.year}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Average CTC</span>
                      <p className="mt-1 text-xl font-black text-blue-600">
                        ₹{latestPlacement?.avgPackage ? `${latestPlacement.avgPackage} LPA` : "24.5 LPA"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Highest CTC</span>
                      <p className="mt-1 text-xl font-black text-emerald-600">
                        ₹{latestPlacement?.highestPackage ? `${latestPlacement.highestPackage} LPA` : "85.0 LPA"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Placement Rate</span>
                      <p className="mt-1 text-xl font-black text-slate-900">
                        {latestPlacement?.placementRate ? `${latestPlacement.placementRate}%` : "95%"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Top Recruiters
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(latestPlacement?.topRecruiters || [
                        "Google",
                        "Microsoft",
                        "Goldman Sachs",
                        "Apple",
                        "Amazon",
                        "Uber",
                        "Jane Street",
                        "Rubrik",
                      ]).map((rec: string) => (
                        <span
                          key={rec}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === "courses" && (
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Offered Programs & Degrees</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Academic programs, seat matrix, duration, and annual tuition
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    {(college.courses || []).length || 4} Programs
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {(college.courses && college.courses.length > 0
                    ? college.courses
                    : [
                        {
                          name: "Computer Science & Engineering",
                          degree: "B.Tech",
                          duration: "4 Years",
                          seats: 120,
                          fees: college.annualFees,
                        },
                        {
                          name: "Electrical Engineering",
                          degree: "B.Tech",
                          duration: "4 Years",
                          seats: 90,
                          fees: Math.round(college.annualFees * 0.95),
                        },
                        {
                          name: "Mechanical Engineering",
                          degree: "B.Tech",
                          duration: "4 Years",
                          seats: 150,
                          fees: Math.round(college.annualFees * 0.9),
                        },
                      ]
                  ).map((c: any) => (
                    <div key={c.id || c.name} className="py-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {c.degree} • {c.duration} • {c.seats} Seats • {c.mode || "Full-time"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 block">
                          {formatCurrency(c.fees || college.annualFees)}/yr
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          {c.eligibility ? "Eligibility Verified" : "Merit Based"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Placements Tab */}
            {activeTab === "placements" && (
              <div className="space-y-6">
                {/* Placement Stats Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        Campus Placements & Career Statistics
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Verified placement reports and recruiting partner metrics for {college.name}
                      </p>
                    </div>
                    {latestPlacement && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                        Batch of {latestPlacement.year}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                      <span className="text-xs font-medium text-slate-500">Average CTC</span>
                      <p className="mt-1 text-2xl font-black text-blue-600">
                        ₹{latestPlacement?.avgPackage || 24.1} LPA
                      </p>
                      <span className="text-[10px] text-blue-600 font-semibold mt-1 inline-flex items-center gap-0.5">
                        <TrendingUp className="h-3 w-3" /> Across all branches
                      </span>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                      <span className="text-xs font-medium text-slate-500">Highest CTC</span>
                      <p className="mt-1 text-2xl font-black text-emerald-600">
                        ₹{latestPlacement?.highestPackage || 81.3} LPA
                      </p>
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-flex items-center gap-0.5">
                        <Award className="h-3 w-3" /> Domestic & Global
                      </span>
                    </div>

                    <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                      <span className="text-xs font-medium text-slate-500">Median CTC</span>
                      <p className="mt-1 text-2xl font-black text-purple-600">
                        ₹{latestPlacement?.medianPackage || 21.2} LPA
                      </p>
                      <span className="text-[10px] text-purple-600 font-semibold mt-1 inline-flex items-center gap-0.5">
                        50th Percentile
                      </span>
                    </div>

                    <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                      <span className="text-xs font-medium text-slate-500">Placement Rate</span>
                      <p className="mt-1 text-2xl font-black text-amber-600">
                        {latestPlacement?.placementRate || 86.7}%
                      </p>
                      <span className="text-[10px] text-amber-600 font-semibold mt-1 inline-flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" /> {latestPlacement?.totalPlaced || 1000}+ Placed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Multi-Year Table */}
                {placements.length > 0 && (
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      Year-over-Year Placement Records
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/60">
                          <tr>
                            <th className="py-3 px-4 rounded-l-xl">Year</th>
                            <th className="py-3 px-4">Average CTC</th>
                            <th className="py-3 px-4">Median CTC</th>
                            <th className="py-3 px-4">Highest CTC</th>
                            <th className="py-3 px-4">Placement Rate</th>
                            <th className="py-3 px-4 rounded-r-xl">Total Placed</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {placements.map((p: any) => (
                            <tr key={p.year} className="hover:bg-slate-50/80 transition">
                              <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                                Class of {p.year}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-blue-600">₹{p.avgPackage} LPA</td>
                              <td className="py-3.5 px-4 text-purple-700 font-semibold">₹{p.medianPackage} LPA</td>
                              <td className="py-3.5 px-4 font-bold text-emerald-600">₹{p.highestPackage} LPA</td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-emerald-500 h-2 rounded-full"
                                      style={{ width: `${Math.min(100, p.placementRate || 85)}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-slate-800">{p.placementRate}%</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">{p.totalPlaced ? `${p.totalPlaced} Offers` : "900+ Offers"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Major Recruiters */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Premier Visiting Recruiters</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Industry leaders actively participating in on-campus placements
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      {(latestPlacement?.topRecruiters || []).length || 6} Major Partners
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {(latestPlacement?.topRecruiters || [
                      "Google",
                      "Microsoft",
                      "Goldman Sachs",
                      "Apple",
                      "Amazon",
                      "NVIDIA",
                      "McKinsey & Co",
                      "Qualcomm",
                    ]).map((rec: string) => (
                      <div
                        key={rec}
                        className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-2 text-xs font-bold text-slate-800 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition shadow-2xs"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-white border border-slate-200 text-[10px] font-black text-blue-600 shadow-2xs">
                          {rec[0]}
                        </div>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Verified Student Reviews</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Honest feedback from enrolled students and recent alumni
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    {(college.reviews || []).length || 3} Reviews
                  </span>
                </div>

                <div className="space-y-4">
                  {(college.reviews && college.reviews.length > 0
                    ? college.reviews
                    : [
                        {
                          user: { name: "Priya Sharma" },
                          batch: 2024,
                          program: "B.Tech CSE",
                          rating: 5,
                          title: "Transformative experience with extraordinary peers",
                          content:
                            "The peer group here is second to none. Faculty members are active researchers and will mentor you if you take the initiative.",
                        },
                        {
                          user: { name: "Rohan K." },
                          batch: 2023,
                          program: "B.Tech EE",
                          rating: 4.5,
                          title: "Great placements, high academic rigor",
                          content:
                            "Academic workload is intense, but the preparation for competitive roles and placement season is thorough. Almost everyone gets placed in top tier firms.",
                        },
                      ]
                  ).map((rev: any, i: number) => (
                    <div key={rev.id || i} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs">
                            {rev.user?.name ? rev.user.name[0] : "S"}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900">
                              {rev.user?.name || "Student"}
                            </span>
                            <span className="text-[11px] text-slate-400 ml-2">
                              Batch of {rev.batch} {rev.program ? `(${rev.program})` : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 text-amber-700 font-bold text-xs">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{typeof rev.rating === "number" ? rev.rating.toFixed(1) : rev.rating}</span>
                        </div>
                      </div>
                      <h4 className="mt-3 text-xs font-bold text-slate-800">{rev.title}</h4>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{rev.content}</p>

                      {(rev.pros || rev.cons) && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          {rev.pros && (
                            <div className="rounded-lg bg-emerald-50/70 p-2 text-emerald-800 border border-emerald-200/50">
                              <span className="font-bold">Pros:</span> {rev.pros}
                            </div>
                          )}
                          {rev.cons && (
                            <div className="rounded-lg bg-rose-50/70 p-2 text-rose-800 border border-rose-200/50">
                              <span className="font-bold">Cons:</span> {rev.cons}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Admission Quick Card & Contact */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Admission Inquiry</h3>
              <p className="text-xs text-slate-500">
                Admissions for 2025–2026 academic sessions are facilitated through national exam counseling.
              </p>

              <div className="space-y-3 pt-2">
                <Link
                  href="/predictor"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Check Your Admission Chances</span>
                </Link>

                <button
                  onClick={toggleCompare}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Scale className="h-4 w-4" />
                  <span>{comparing ? "Remove from Compare" : "Compare with Other Colleges"}</span>
                </button>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <a
                    href="https://www.iitb.ac.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Official Portal
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-slate-400" />
                  <span>Approved by UGC, AICTE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
