import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

// Fetch all classes for a specific course under a faculty
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required as a query parameter." },
        { status: 400 }
      );
    }

    const classes = await prisma.class.findMany({
      where: {
        courseId: Number(courseId),
      },
      select: {
        id: true,
        date: true,
        course: {
          select: {
            id: true,
            subject: true,
            section: true,
            semester: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes." },
      { status: 500 }
    );
  }
}

// Add a new class for a specific course
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, date, courseId } = body;

    if (!date || !courseId || !id) {
      return NextResponse.json(
        { error: "id, date, and courseId are required fields." },
        { status: 400 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        id: Number(id), // Allow setting a custom class ID
        date: new Date(date),
        courseId: Number(courseId),
      },
    });

    // Increment classesHeld for all students in the course
    await prisma.studentCourse.updateMany({
      where: {
        courseId: Number(courseId),
      },
      data: {
        classesHeld: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error: any) {
    console.error("Error adding class:", error);

    if (error.code === "P2002") {
      // Handle unique constraint violation for the custom class ID
      return NextResponse.json(
        { error: "Class ID already exists. Please use a unique ID." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add class." },
      { status: 500 }
    );
  }
}

// Cancel a class for a specific course
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const courseId = searchParams.get("courseId");

    if (!classId || !courseId) {
      return NextResponse.json(
        { error: "classId and courseId are required query parameters." },
        { status: 400 }
      );
    }

    // Check if the class exists
    const existingClass = await prisma.class.findUnique({
      where: { id: Number(classId) },
    });

    if (!existingClass) {
      return NextResponse.json({ error: "Class not found." }, { status: 404 });
    }

    // Delete the class
    await prisma.class.delete({
      where: { id: Number(classId) },
    });

    // Decrement classesHeld for all students in the course
    await prisma.studentCourse.updateMany({
      where: {
        courseId: Number(courseId),
      },
      data: {
        classesHeld: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json(
      { message: "Class successfully canceled." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error canceling class:", error);
    return NextResponse.json(
      { error: "Failed to cancel class." },
      { status: 500 }
    );
  }
}
