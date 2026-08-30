import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { predictorSchema } from "@/lib/validators/predictor";

// POST /api/predictor
// Matches colleges based on exam rank/score/percentile against historical cutoffs
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = predictorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { exam, rank, score, percentile, category, preferredState, preferredType } = parsed.data;

    // Fetch cutoffs for the given exam
    const cutoffs = await prisma.collegeCutoff.findMany({
      where: {
        exam,
        category: { in: [category ?? "General", "General"] }, // also include General as fallback
        year: { gte: new Date().getFullYear() - 3 }, // last 3 years
        ...(rank !== undefined ? { cutoffRank: { not: null } } : {}),
        ...(percentile !== undefined ? { cutoffPercentile: { not: null } } : {}),
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            type: true,
            ranking: true,
            nirf: true,
            annualFees: true,
            accreditation: true,
            logo: true,
            ...(preferredState ? { state: true } : {}),
            ...(preferredType ? { type: true } : {}),
          },
        },
        course: {
          select: { id: true, name: true, degree: true },
        },
      },
      orderBy: { year: "desc" },
    });

    // Label each match with a chance: Safe / Good / Ambitious
    type ChanceLabel = "Safe" | "Good" | "Ambitious" | "Low";
    const results = cutoffs
      .filter((c: typeof cutoffs[number]) => {
        if (preferredState && c.college.state.toLowerCase() !== preferredState.toLowerCase()) return false;
        if (preferredType && c.college.type !== preferredType) return false;
        return true;
      })
      .map((cutoff: typeof cutoffs[number]) => {
        let chance: ChanceLabel = "Low";

        if (rank !== undefined && cutoff.cutoffRank !== null) {
          const ratio = rank / cutoff.cutoffRank;
          if (ratio <= 0.7) chance = "Safe";
          else if (ratio <= 0.9) chance = "Good";
          else if (ratio <= 1.1) chance = "Ambitious";
          else chance = "Low";
        } else if (percentile !== undefined && cutoff.cutoffPercentile !== null) {
          const diff = percentile - cutoff.cutoffPercentile;
          if (diff >= 5) chance = "Safe";
          else if (diff >= 0) chance = "Good";
          else if (diff >= -3) chance = "Ambitious";
          else chance = "Low";
        } else if (score !== undefined && cutoff.cutoffScore !== null) {
          const ratio = score / cutoff.cutoffScore;
          if (ratio >= 1.1) chance = "Safe";
          else if (ratio >= 1.0) chance = "Good";
          else if (ratio >= 0.9) chance = "Ambitious";
          else chance = "Low";
        }

        return {
          chance,
          college: cutoff.college,
          course: cutoff.course,
          cutoffRank: cutoff.cutoffRank,
          cutoffScore: cutoff.cutoffScore,
          cutoffPercentile: cutoff.cutoffPercentile,
          category: cutoff.category,
          year: cutoff.year,
        };
      })
      .filter((r: { chance: ChanceLabel }) => r.chance !== "Low")
      .sort((a: { chance: ChanceLabel }, b: { chance: ChanceLabel }) => {
        const order: Record<ChanceLabel, number> = { Safe: 0, Good: 1, Ambitious: 2, Low: 3 };
        return order[a.chance] - order[b.chance];
      });

    return NextResponse.json({ data: results, total: results.length });
  } catch (error) {
    console.error("[PREDICTOR POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
