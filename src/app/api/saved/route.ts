import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ─── GET /api/user/saved ──────────────────────────────────
// Get current user's saved colleges
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: session!.user!.id },
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
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: saved });
  } catch (error) {
    console.error("[SAVED GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/user/saved ─────────────────────────────────
// Save / unsave a college (toggle)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collegeId } = await req.json();
    if (!collegeId) {
      return NextResponse.json({ error: "collegeId is required" }, { status: 400 });
    }

    // Check if already saved
    const existing = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: session!.user!.id, collegeId } },
    });

    if (existing) {
      // Unsave
      await prisma.savedCollege.delete({
        where: { userId_collegeId: { userId: session!.user!.id, collegeId } },
      });
      return NextResponse.json({ saved: false, message: "College removed from wishlist" });
    } else {
      // Save
      await prisma.savedCollege.create({
        data: { userId: session!.user!.id, collegeId },
      });
      return NextResponse.json({ saved: true, message: "College added to wishlist" }, { status: 201 });
    }
  } catch (error) {
    console.error("[SAVED POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
