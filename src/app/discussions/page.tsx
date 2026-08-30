"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MessageSquarePlus,
  TrendingUp,
  Flame,
  Clock,
  Award,
  ChevronRight,
  Send,
  X,
  GraduationCap,
} from "lucide-react";
import QuestionCard, { DiscussionItem } from "@/components/qa/QuestionCard";

export default function DiscussionsPage() {
  const [activeCategory, setActiveCategory] = useState("All Discussions");
  const [activeTab, setActiveTab] = useState<"Hot" | "New" | "Top">("Hot");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAskModal, setShowAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Admissions Q&A");
  const [newContent, setNewContent] = useState("");

  const categories = [
    { name: "All Discussions", count: "2.4k" },
    { name: "Admissions Q&A", count: "856" },
    { name: "Campus Life", count: "1.2k" },
    { name: "Financial Aid & Scholarships", count: "342" },
    { name: "Internships & Careers", count: "189" },
  ];

  const [discussions, setDiscussions] = useState<DiscussionItem[]>([
    {
      id: "disc-1",
      author: {
        name: "Sarah Jenkins",
        handle: "sarahj_24",
        role: "Verified Student",
      },
      timeAgo: "2 hours ago",
      category: "Admissions Q&A",
      title: "Is early round counseling worth it for highly selective engineering programs?",
      content:
        "I'm finalizing my application & counseling strategy for 2025 admissions. My stats are solid (AIR 1120 in JEE, 99.2%ile), but I'm debating whether locking an early seat at IIIT-H or BITS Pilani CS gives a significant statistical advantage over waiting for IIT 2nd round...",
      upvotes: 342,
      commentsCount: 84,
      tags: ["#Admissions2025", "#ComputerScience"],
    },
    {
      id: "disc-2",
      author: {
        name: "Marcus Tech",
        handle: "marcustech",
        role: "Alumni",
      },
      timeAgo: "5 hours ago",
      category: "Campus Life",
      title: "The real cost of living off-campus vs hostels: What I wish I knew as a fresher",
      content:
        "Just graduated last year from IIT Bombay. Moving off-campus sophomore year seemed like a great way to save money and get privacy, but there were so many hidden costs: electricity deposits, Wi-Fi setup, daily commute time, and missing late night hackathons in the wing...",
      upvotes: 891,
      commentsCount: 156,
      tags: ["#HostelLife", "#CostOfLiving"],
    },
    {
      id: "disc-3",
      author: {
        name: "Aman Verma",
        handle: "aman_v",
        role: "Verified Student",
      },
      timeAgo: "1 day ago",
      category: "Internships & Careers",
      title: "2024–2025 Tech placement report summary: Core vs AI & Quant hiring trends",
      content:
        "Compiled verified placement insights from senior batch coordinators across top IITs and NITs. High frequency trading and Quant roles offered ₹40L+ packages, while traditional web-dev hiring was slightly more selective with higher emphasis on systems programming...",
      upvotes: 620,
      commentsCount: 92,
      tags: ["#IITPlacements", "#QuantCareers"],
    },
  ]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/questions");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            const liveItems: DiscussionItem[] = json.data.map((q: any) => ({
              id: q.id,
              author: {
                name: q.user?.name || "Student",
                handle: q.user?.name?.toLowerCase().replace(/\s+/g, "_") || "student",
                role: q.user?.role === "ADMIN" ? "Counselor" : "Verified Student",
                avatar: q.user?.avatar,
              },
              timeAgo: "Recently",
              category: "Admissions Q&A",
              title: q.title,
              content: q.content,
              upvotes: 12,
              commentsCount: q._count?.answers || q.answers?.length || 0,
              tags: ["#Admissions", "#Community"],
            }));
            setDiscussions((prev) => [
              ...liveItems,
              ...prev.filter((p) => !liveItems.some((l) => l.title === p.title)),
            ]);
          }
        }
      } catch {
        // use fallback
      }
    }
    fetchQuestions();
  }, []);

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newItem: DiscussionItem = {
      id: `disc-${Date.now()}`,
      author: {
        name: "You",
        handle: "current_user",
        role: "Verified Student",
      },
      timeAgo: "just now",
      category: newCategory,
      title: newTitle,
      content: newContent,
      upvotes: 1,
      commentsCount: 0,
      tags: ["#NewTopic"],
    };

    setDiscussions([newItem, ...discussions]);
    setNewTitle("");
    setNewContent("");
    setShowAskModal(false);

    // Call backend API in background
    try {
      await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
        }),
      });
    } catch {
      // optimistic
    }
  };

  const filteredDiscussions = discussions.filter((item) => {
    if (activeCategory !== "All Discussions" && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.author.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 3-Column Layout matching Screenshot 2 */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Categories Sidebar (cols: 3) */}
        <aside className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sticky top-24">
            <h2 className="text-sm font-bold text-slate-900">Categories</h2>
            <nav className="mt-4 space-y-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? "bg-slate-100 font-bold text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] text-slate-400 font-normal">{cat.count}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Center Column: Discussions Feed (cols: 6) */}
        <main className="lg:col-span-6 space-y-5">
          {/* Search bar matching Screenshot 2 */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions, universities, or tags..."
              className="w-full rounded-2xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-2xs outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Filter tabs: Hot, New, Top */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {(["Hot", "New", "Top"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {tab === "Hot" && <Flame className="h-3.5 w-3.5 text-amber-400" />}
                  {tab === "New" && <Clock className="h-3.5 w-3.5 text-blue-400" />}
                  {tab === "Top" && <Award className="h-3.5 w-3.5 text-emerald-400" />}
                  <span>{tab}</span>
                </button>
              );
            })}
          </div>

          {/* Discussions List */}
          <div className="space-y-4">
            {filteredDiscussions.map((item) => (
              <QuestionCard key={item.id} item={item} />
            ))}

            {filteredDiscussions.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 text-xs">
                No discussions found matching your filter. Be the first to ask!
              </div>
            )}
          </div>
        </main>

        {/* Right Column: Ask Question & Trending Sidebar (cols: 3) */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Ask a Question Button matching Screenshot 2 */}
          <button
            onClick={() => setShowAskModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md shadow-slate-900/10 transition hover:bg-slate-800"
          >
            <MessageSquarePlus className="h-4 w-4 text-blue-300" />
            <span>Ask a Question</span>
          </button>

          {/* Trending Topics Card matching Screenshot 2 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span>Trending Topics</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "#JEE2025",
                "#ComputerScience",
                "#HostelLife",
                "#MeritScholarships",
                "#IITPlacements",
                "#CutoffDrop",
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag.replace("#", ""))}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Hot Universities List matching Screenshot 2 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Hot Institutions
            </h3>
            <div className="mt-3 divide-y divide-slate-100">
              {[
                { name: "IIT Bombay", location: "Mumbai" },
                { name: "BITS Pilani", location: "Pilani" },
                { name: "IIT Delhi", location: "New Delhi" },
                { name: "NIT Trichy", location: "Tiruchirappalli" },
              ].map((univ) => (
                <div
                  key={univ.name}
                  onClick={() => setSearchQuery(univ.name)}
                  className="flex items-center justify-between py-2.5 cursor-pointer text-xs font-medium text-slate-700 hover:text-blue-600 transition"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                    <span>{univ.name}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Ask the Student Community</h3>
              <button
                onClick={() => setShowAskModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Topic Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="Admissions Q&A">Admissions Q&A</option>
                  <option value="Campus Life">Campus Life</option>
                  <option value="Financial Aid & Scholarships">Financial Aid & Scholarships</option>
                  <option value="Internships & Careers">Internships & Careers</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Question Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How are hostel facilities and food for freshers at IIT Delhi?"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Details / Context
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide additional details, your rank, concerns, or background..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
                >
                  <Send className="h-3 w-3" />
                  <span>Post Question</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
