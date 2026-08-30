import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { answerSchema } from "@/lib/validators/question";
import { auth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// POST /api/questions/[id]/answers
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: questionId } = await params;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { id: true },
    });
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = answerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const answer = await prisma.answer.create({
      data: {
        content: parsed.data.content,
        userId: session.user.id,
        questionId,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    console.error("[ANSWERS POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
