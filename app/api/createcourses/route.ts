import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();

    // Validate the required fields
    const { subject, semester, section, facultyId } = body;

    if (!subject || !semester || !section || !facultyId) {
      return NextResponse.json(
        { error: "Subject, semester, section, and facultyId are required fields." },
        { status: 400 }
      );
    }

    // Ensure the faculty exists
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
    });

    if (!faculty) {
      return NextResponse.json(
        { error: `Faculty with id ${facultyId} does not exist.` },
        { status: 404 }
      );
    }

    // Create a new Course in the database
    const newCourse = await prisma.course.create({
      data: {
        subject,
        semester,
        section,
        facultyId, // Associate the course with the provided facultyId
      },
    });

    // Return the newly created Course
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    // Handle potential errors
    console.error("Error creating course:", error);

    if ((error as any).code === "P2002") {
      // Prisma error code for unique constraint violation
      return NextResponse.json(
        { error: "A course with the same subject, semester, and section already exists." },
        { status: 409 }
      );
    }

    // Return a generic error response for other cases
    return NextResponse.json(
      { error: "Failed to create course." },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}
