import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, courseId } = body;

    // Validate the required fields
    if (!date || !courseId) {
      return NextResponse.json(
        { error: "Date and courseId are required fields." },
        { status: 400 }
      );
    }

    // Create a new class for the specified course
    const newClass = await prisma.class.create({
      data: {
        date: new Date(date),
        courseId,
      },
    });

    // Increment classesHeld for all students enrolled in the course
    await prisma.student.updateMany({
      where: {
        courses: {
          some: {
            courseId, // Match students linked to this courseId via the join model
          },
        },
      },
      data: {
        classesHeld: {
          increment: 1, // Increment classesHeld by 1
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
