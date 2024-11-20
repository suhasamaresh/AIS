import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Destructure the required fields from the parsed body
    const {
      usn,
      name,
      mentorId,
      classesHeld,
      classesAttended,
      attendancePercentage,
      status,
      department,
      semester,
      section,
      courseId,
      dob,
      email,
      contactNo,
    } = body;

    // Validate required fields
    if (
      !usn ||
      !name ||
      !department ||
      !semester ||
      !section ||
      !courseId ||
      !dob ||
      !email ||
      !contactNo
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided." },
        { status: 400 }
      );
    }

    // Create a new student in the database
    const newStudent = await prisma.student.create({
      data: {
        usn,
        name,
        mentorId,
        classesHeld: classesHeld || 0,
        classesAttended: classesAttended || 0,
        attendancePercentage: attendancePercentage || 0,
        status: status || true,
        department,
        semester,
        section,
        courseId,
        dob: new Date(dob),
        email,
        contactNo,
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);

    // Handle Prisma unique constraint violation error
    if ((error as any).code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate entry for a unique field." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create student." },
      { status: 500 }
    );
  }
}
