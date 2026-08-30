import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// DELETE /api/saved/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const record = await prisma.savedCollege.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!record) {
      return NextResponse.json({ error: "Saved college not found" }, { status: 404 });
    }

    if (record.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.savedCollege.delete({ where: { id } });

    return NextResponse.json({ message: "College removed from wishlist" });
  } catch (error) {
    console.error("[SAVED DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
