import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/questions/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        college: { select: { id: true, name: true, slug: true, city: true } },
        answers: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: [{ isAccepted: "desc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("[QUESTION GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
