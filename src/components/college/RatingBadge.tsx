import { Sparkles, Star } from "lucide-react";

interface RatingBadgeProps {
  rating?: number | null;
  matchScore?: number;
  showStar?: boolean;
  className?: string;
}

export default function RatingBadge({
  rating,
  matchScore,
  showStar = true,
  className = "",
}: RatingBadgeProps) {
  // If match score is passed, format as 98%
  if (matchScore !== undefined) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80 shadow-xs ${className}`}
      >
        <Sparkles className="h-3 w-3 text-emerald-600" />
        <span>{matchScore}%</span>
      </span>
    );
  }

  if (rating === null || rating === undefined) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ${className}`}
      >
        New
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80 shadow-xs ${className}`}
    >
      {showStar && <Star className="h-3 w-3 fill-emerald-600 text-emerald-600" />}
      <span>{rating.toFixed(1)}</span>
    </span>
  );
}