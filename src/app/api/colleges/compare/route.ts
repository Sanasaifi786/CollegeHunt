import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/colleges/compare?ids=id1,id2,id3
// Public: fetch comparison data for 2–3 colleges side by side
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json({ error: "Provide college ids as ?ids=id1,id2,id3" }, { status: 400 });
    }

    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);

    if (ids.length < 2 || ids.length > 4) {
      return NextResponse.json({ error: "Compare between 2 and 4 colleges" }, { status: 400 });
    }

    const colleges = await prisma.college.findMany({
      where: { OR: [{ id: { in: ids } }, { slug: { in: ids } }] },
      include: {
        courses: { orderBy: { degree: "asc" } },
        placements: { orderBy: { year: "desc" }, take: 3 },
        reviews: { select: { rating: true, academics: true, infrastructure: true, faculty: true, placement: true } },
        cutoffs: { orderBy: [{ year: "desc" }, { exam: "asc" }], take: 20 },
        _count: { select: { reviews: true, courses: true } },
      },
    });

    // Enrich with avgRating
    const data = colleges.map((college: typeof colleges[number]) => {
      const avgRating =
        college.reviews.length > 0
          ? college.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / college.reviews.length
          : null;
      const { reviews, ...rest } = college;
      return {
        ...rest,
        avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        ratingBreakdown: {
          academics: avg(reviews.map((r: { academics: number | null }) => r.academics).filter(Boolean) as number[]),
          infrastructure: avg(reviews.map((r: { infrastructure: number | null }) => r.infrastructure).filter(Boolean) as number[]),
          faculty: avg(reviews.map((r: { faculty: number | null }) => r.faculty).filter(Boolean) as number[]),
          placement: avg(reviews.map((r: { placement: number | null }) => r.placement).filter(Boolean) as number[]),
        },
      };
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[COMPARE GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function avg(nums: number[]): number | null {
  if (!nums.length) return null;
  return Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 10) / 10;
}
