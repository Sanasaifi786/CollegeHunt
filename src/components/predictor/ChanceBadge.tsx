import { ChanceLabel } from "@/types";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface ChanceBadgeProps {
  chance: ChanceLabel;
  className?: string;
}

export default function ChanceBadge({ chance, className = "" }: ChanceBadgeProps) {
  switch (chance) {
    case "Safe":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/80 ${className}`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Safety Match</span>
        </span>
      );
    case "Good":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200/80 ${className}`}
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Target School</span>
        </span>
      );
    case "Ambitious":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200/80 ${className}`}
        >
          <AlertCircle className="h-3.5 w-3.5 text-purple-600" />
          <span>Reach / Ambitious</span>
        </span>
      );
    default:
      return null;
  }
}