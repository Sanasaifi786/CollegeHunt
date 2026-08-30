import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { questionSchema, questionFilterSchema } from "@/lib/validators/question";
import { auth } from "@/lib/auth";

// GET /api/questions — paginated question list
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = questionFilterSchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const { collegeId, search, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where = {
      ...(collegeId ? { collegeId } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      } : {}),
    };

    const [total, questions] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          college: { select: { id: true, name: true, slug: true } },
          _count: { select: { answers: true } },
        },
      }),
    ]);

    return NextResponse.json({
      data: questions,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[QUESTIONS GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/questions — ask a question (auth required)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = questionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        ...parsed.data,
        userId: session!.user!.id,
        collegeId: parsed.data.collegeId ?? "",
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("[QUESTIONS POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
