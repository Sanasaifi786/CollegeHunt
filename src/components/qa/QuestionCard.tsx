"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Bookmark,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";

export interface DiscussionItem {
  id: string;
  author: {
    name: string;
    handle: string;
    role: "Verified Student" | "Alumni" | "Counselor";
    avatar?: string;
  };
  timeAgo: string;
  category: string;
  title: string;
  content: string;
  upvotes: number;
  commentsCount: number;
  tags: string[];
}

interface QuestionCardProps {
  item: DiscussionItem;
}

export default function QuestionCard({ item }: QuestionCardProps) {
  const [votes, setVotes] = useState(item.upvotes);
  const [hasVoted, setHasVoted] = useState<"up" | "down" | null>(null);
  const [saved, setSaved] = useState(false);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasVoted === "up") {
      setVotes(votes - 1);
      setHasVoted(null);
    } else {
      setVotes(hasVoted === "down" ? votes + 2 : votes + 1);
      setHasVoted("up");
    }
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasVoted === "down") {
      setVotes(votes + 1);
      setHasVoted(null);
    } else {
      setVotes(hasVoted === "up" ? votes - 2 : votes - 1);
      setHasVoted("down");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:border-slate-300">
      {/* Author Header matching Screenshot 2 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-800 to-blue-600 font-bold text-xs text-white shadow-2xs">
            {item.author.avatar ? (
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              item.author.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{item.author.name}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                <span>{item.author.role}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {item.timeAgo} in <span className="font-medium text-slate-600">{item.category}</span>
            </p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-600 p-1">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Title & Body */}
      <div className="mt-3">
        <Link href={`/discussions/${item.id}`}>
          <h3 className="text-base font-bold text-slate-900 transition hover:text-blue-600">
            {item.title}
          </h3>
        </Link>
        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {item.content}
        </p>
      </div>

      {/* Action Bar matching Screenshot 2 */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3">
          {/* Upvote / Downvote Pill from Screenshot 2 */}
          <div className="flex items-center rounded-full bg-slate-100 p-1 text-xs font-bold text-slate-700">
            <button
              onClick={handleUpvote}
              className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
                hasVoted === "up"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-200 text-slate-600"
              }`}
              title="Upvote"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <span className="px-2">{votes}</span>
            <button
              onClick={handleDownvote}
              className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
                hasVoted === "down"
                  ? "bg-rose-600 text-white"
                  : "hover:bg-slate-200 text-slate-600"
              }`}
              title="Downvote"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Comments count */}
          <Link
            href={`/discussions/${item.id}`}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{item.commentsCount} Comments</span>
          </Link>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => setSaved(!saved)}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
            saved
              ? "bg-blue-50 text-blue-600"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          }`}
          title="Save discussion"
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-blue-600" : ""}`} />
        </button>
      </div>
    </div>
  );
}