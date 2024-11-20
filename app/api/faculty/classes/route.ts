import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, courseId, subject } = body;

    if (!date || !courseId || !subject) {
      return NextResponse.json(
        { error: "Date, courseId, and subject are required fields." },
        { status: 400 }
      );
    }

    // Create a new class
    const newClass = await prisma.class.create({
      data: {
        date: new Date(date),
        courseId,
      },
    });

    // Increment classesHeld for all students whose subjects JSON array contains the course name
    await prisma.student.updateMany({
      where: {
        subjects: {
          array_contains: subject, // Check if the subjects array contains the course name
        },
      },
      data: {
        classesHeld: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { error: "Failed to create class." },
      { status: 500 }
    );
  }
}
