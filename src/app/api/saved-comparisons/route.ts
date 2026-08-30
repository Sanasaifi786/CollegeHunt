import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/saved-comparisons — list user's saved comparisons
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const comparisons = await prisma.savedComparison.findMany({
      where: { userId: session!.user!.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: comparisons });
  } catch (error) {
    console.error("[SAVED_COMPARISONS GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/saved-comparisons — save a comparison set
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, collegeIds } = await req.json();

    if (!Array.isArray(collegeIds) || collegeIds.length < 2 || collegeIds.length > 4) {
      return NextResponse.json({ error: "collegeIds must be an array of 2–4 college IDs" }, { status: 400 });
    }

    const comparison = await prisma.savedComparison.create({
      data: {
        name: name ?? null,
        collegeIds,
        userId: session!.user!.id,
      },
    });

    return NextResponse.json(comparison, { status: 201 });
  } catch (error) {
    console.error("[SAVED_COMPARISONS POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
