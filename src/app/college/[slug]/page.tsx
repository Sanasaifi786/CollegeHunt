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
                  <h2 className="text-base font-bold text-slate-900">Recent Placement Highlights</h2>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <span className="text-xs text-slate-500 font-medium">Average CTC</span>
                      <p className="mt-1 text-xl font-black text-blue-600">₹28.5 LPA</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <span className="text-xs text-slate-500 font-medium">Highest CTC</span>
                      <p className="mt-1 text-xl font-black text-emerald-600">₹3.67 Cr</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <span className="text-xs text-slate-500 font-medium">Placement Rate</span>
                      <p className="mt-1 text-xl font-black text-slate-900">95%</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Top Recruiters
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        "Google",
                        "Microsoft",
                        "Goldman Sachs",
                        "Apple",
                        "Amazon",
                        "Uber",
                        "Jane Street",
                        "Rubrik",
                      ].map((rec) => (
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
                <h2 className="text-base font-bold text-slate-900">Offered Programs & Degrees</h2>
                <div className="divide-y divide-slate-100">
                  {[
                    {
                      name: "Computer Science & Engineering",
                      degree: "B.Tech",
                      duration: "4 Years",
                      seats: 120,
                      cutoff: "AIR 65",
                    },
                    {
                      name: "Electrical Engineering",
                      degree: "B.Tech",
                      duration: "4 Years",
                      seats: 90,
                      cutoff: "AIR 450",
                    },
                    {
                      name: "Mechanical Engineering",
                      degree: "B.Tech",
                      duration: "4 Years",
                      seats: 150,
                      cutoff: "AIR 1200",
                    },
                    {
                      name: "Artificial Intelligence & Data Science",
                      degree: "M.Tech",
                      duration: "2 Years",
                      seats: 40,
                      cutoff: "GATE 850+",
                    },
                  ].map((c) => (
                    <div key={c.name} className="py-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {c.degree} • {c.duration} • {c.seats} Seats Available
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200/60">
                          {c.cutoff}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">Verified Student Reviews</h2>
                  <button className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                    Write a Review
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      user: "Priya Sharma",
                      batch: "2024 (B.Tech CSE)",
                      rating: 5,
                      title: "Transformative experience with extraordinary peers",
                      content:
                        "The peer group here is second to none. Faculty members are active researchers and will mentor you if you take the initiative. Hostel life is fun, tech festivals are unmatched.",
                    },
                    {
                      user: "Rohan K.",
                      batch: "2023 (B.Tech EE)",
                      rating: 4.5,
                      title: "Great placements, high academic rigor",
                      content:
                        "Academic workload is intense, but the preparation for competitive roles and placement season is thorough. Almost everyone gets placed in top tier firms.",
                    },
                  ].map((rev, i) => (
                    <div key={i} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-900">{rev.user}</span>
                          <span className="text-[11px] text-slate-400 ml-2">{rev.batch}</span>
                        </div>
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, s) => (
                            <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <h4 className="mt-2 text-xs font-bold text-slate-800">{rev.title}</h4>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{rev.content}</p>
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
