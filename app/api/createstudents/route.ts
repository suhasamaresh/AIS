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
      status,
      department,
      semester,
      section,
      courses, // Array of course IDs
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
      !dob ||
      !email ||
      !contactNo ||
      !Array.isArray(courses) ||
      courses.length === 0
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided, including courses." },
        { status: 400 }
      );
    }

    // Ensure `courses` is an array of numbers (course IDs)
    const courseIds = courses.map((course) => course.courseId);

    // Create a new student and link courses
    const newStudent = await prisma.student.create({
      data: {
        usn,
        name,
        mentorId,
        status: status !== undefined ? status : true,
        department,
        semester,
        section,
        dob: new Date(dob),
        email,
        contactNo,
        courses: {
          create: courseIds.map((id) => ({
            course: { connect: { id } },
          })),
        },
      },
      include: {
        courses: true, // Include related courses in the response
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
