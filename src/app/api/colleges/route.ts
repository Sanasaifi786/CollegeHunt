import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { collegeSchema, collegeFilterSchema } from "@/lib/validators/college";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// ─── GET /api/colleges ─────────────────────────────────────
// Public: list colleges with search, filter, sort, pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const parsed = collegeFilterSchema.safeParse(query);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      search,
      state,
      city,
      type,
      accreditation,
      minFees,
      maxFees,
      minRanking,
      maxRanking,
      approvedBy,
      page,
      limit,
      sortBy,
      sortOrder,
    } = parsed.data;

    // Build where clause
    const where: Prisma.CollegeWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { state: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(state && { state: { equals: state, mode: "insensitive" } }),
      ...(city && { city: { equals: city, mode: "insensitive" } }),
      ...(type && { type }),
      ...(accreditation && { accreditation }),
      ...(minFees !== undefined && { annualFees: { gte: minFees } }),
      ...(maxFees !== undefined && {
        annualFees: { ...((minFees !== undefined ? { gte: minFees } : {})), lte: maxFees },
      }),
      ...(minRanking !== undefined && { ranking: { gte: minRanking } }),
      ...(maxRanking !== undefined && { ranking: { lte: maxRanking } }),
      ...(approvedBy && {
        approvedBy: { hasSome: approvedBy.split(",").map((s) => s.trim()) },
      }),
    };

    const skip = (page - 1) * limit;

    // Run count + data in parallel
    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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
          images: true,
          isVerified: true,
          approvedBy: true,
          _count: {
            select: { reviews: true, courses: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
      }),
    ]);

    // Compute average rating per college
    const data = colleges.map((college: typeof colleges[number]) => {
      const avgRating =
        college.reviews.length > 0
          ? college.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
            college.reviews.length
          : null;

      const { reviews, ...rest } = college;
      return { ...rest, avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null };
    });

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[COLLEGES GET] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/colleges ────────────────────────────────────
// Admin only: create a new college
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = collegeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.college.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A college with this slug already exists" },
        { status: 409 }
      );
    }

    const college = await prisma.college.create({
      data: parsed.data,
    });

    return NextResponse.json(college, { status: 201 });
  } catch (error) {
    console.error("[COLLEGES POST] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
