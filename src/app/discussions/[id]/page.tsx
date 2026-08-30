"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  CheckCircle2,
  Send,
} from "lucide-react";

export default function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [votes, setVotes] = useState(342);
  const [answerText, setAnswerText] = useState("");
  const [questionData, setQuestionData] = useState<any>(null);
  const [answers, setAnswers] = useState([
    {
      id: "ans-1",
      author: "Aditya Roy",
      role: "Alumni (IIT Delhi)",
      timeAgo: "1 hour ago",
      isAccepted: true,
      content:
        "From my experience and tracking recent branch change and seat withdrawal trends, if your primary goal is core computer science research or premier algorithmic placements, taking the confirmed seat at a top-5 campus gives massive mental peace. Early counseling locks you in before cutoff volatility kicks in.",
      upvotes: 48,
    },
    {
      id: "ans-2",
      author: "Priya S.",
      role: "Verified Student",
      timeAgo: "30 mins ago",
      isAccepted: false,
      content:
        "I'd recommend checking last year's Round 2 to Round 5 opening-closing delta. Usually top 1000 ranks don't shift by more than 40-50 positions. If your rank is within 20 ranks of previous year's closing, it's worth taking the calculated chance.",
      upvotes: 19,
    },
  ]);

  useEffect(() => {
    async function loadQuestion() {
      try {
        const res = await fetch(`/api/questions/${id}`);
        if (res.ok) {
          const data = await res.json();
          setQuestionData(data);
          if (data.answers && data.answers.length > 0) {
            const mapped = data.answers.map((a: any) => ({
              id: a.id,
              author: a.user?.name || "Student",
              role: a.user?.role === "ADMIN" ? "Counselor" : "Verified Student",
              timeAgo: "Recently",
              isAccepted: a.isAccepted,
              content: a.content,
              upvotes: a.helpfulCount || 0,
            }));
            setAnswers(mapped);
          }
        }
      } catch {
        // Fallback to sample
      }
    }
    loadQuestion();
  }, [id]);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    const newAns = {
      id: `ans-${Date.now()}`,
      author: "You",
      role: "Verified Student",
      timeAgo: "just now",
      isAccepted: false,
      content: answerText,
      upvotes: 0,
    };

    setAnswers([...answers, newAns]);
    const submittedText = answerText;
    setAnswerText("");

    try {
      await fetch(`/api/questions/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: submittedText }),
      });
    } catch {
      // optimistic
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back to Discussions */}
      <Link
        href="/discussions"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Community</span>
      </Link>

      {/* Main Question Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-900 to-blue-700 font-bold text-xs text-white">
              SJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Sarah Jenkins</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                  <span>Verified Student</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">Posted 2 hours ago in Admissions Q&A</p>
            </div>
          </div>
        </div>

        <h1 className="mt-4 text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
          Is early round counseling worth it for highly selective engineering programs?
        </h1>

        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          I&apos;m finalizing my application & counseling strategy for 2025 admissions. My stats are
          solid (AIR 1120 in JEE, 99.2%ile), but I&apos;m debating whether locking an early seat at
          top-tier campuses gives a significant statistical advantage over waiting for subsequent
          rounds. How much cutoff drop typically happens between rounds?
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center rounded-full bg-slate-100 p-1 text-xs font-bold text-slate-700">
            <button
              onClick={() => setVotes(votes + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-slate-200"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <span className="px-2">{votes}</span>
            <button
              onClick={() => setVotes(votes - 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-slate-200"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <MessageSquare className="h-4 w-4" />
            <span>{answers.length} Answers</span>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="mt-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Community Answers</h2>

        <div className="space-y-4">
          {answers.map((ans) => (
            <div
              key={ans.id}
              className={`rounded-2xl border p-6 bg-white shadow-xs ${
                ans.isAccepted
                  ? "border-emerald-200 ring-2 ring-emerald-500/10"
                  : "border-slate-200/90"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{ans.author}</span>
                  <span className="text-[11px] text-slate-400">• {ans.role}</span>
                  <span className="text-[11px] text-slate-400">• {ans.timeAgo}</span>
                </div>

                {ans.isAccepted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Accepted Answer</span>
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {ans.content}
              </p>
            </div>
          ))}
        </div>

        {/* Post Answer Form */}
        <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">Your Answer</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Share your experience or advice to help this student.
          </p>

          <form onSubmit={handleAnswerSubmit} className="mt-4 space-y-3">
            <textarea
              rows={4}
              required
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Write a clear, helpful response with specific guidance..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
              >
                <Send className="h-3 w-3" />
                <span>Post Answer</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
