import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { collegeSchema } from "@/lib/validators/college";
import { auth } from "@/lib/auth";

type Params = { params: Promise<{ slug: string }> };

// GET /api/colleges/[slug]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    const college = await prisma.college.findFirst({
      where: {
        OR: [{ id: slug }, { slug }],
      },
      include: {
        courses: { orderBy: { degree: "asc" } },
        placements: { orderBy: { year: "desc" }, take: 5 },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        cutoffs: { orderBy: [{ year: "desc" }, { exam: "asc" }] },
        questions: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            answers: {
              include: { user: { select: { id: true, name: true, avatar: true } } },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { reviews: true, courses: true, questions: true, savedBy: true },
        },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const avgRating =
      college.reviews.length > 0
        ? college.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
          college.reviews.length
        : null;

    return NextResponse.json({
      ...college,
      avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
    });
  } catch (error) {
    console.error("[COLLEGE GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/colleges/[slug] — Admin only
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();

    const parsed = collegeSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const college = await prisma.college.update({
      where: { slug },
      data: parsed.data,
    });

    return NextResponse.json(college);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }
    console.error("[COLLEGE PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/colleges/[slug] — Admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    await prisma.college.delete({ where: { slug } });

    return NextResponse.json({ message: "College deleted successfully" });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }
    console.error("[COLLEGE DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
