import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    // Validate courseId
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required as a query parameter." },
        { status: 400 }
      );
    }

    // Fetch students enrolled in the course
    const students = await prisma.student.findMany({
      where: {
        courses: {
          some: {
            courseId: Number(courseId), // Ensure courseId is numeric
          },
        },
      },
      select: {
        id: true,
        name: true,
        usn: true,
        email: true,
        status: true,
      },
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching students for the course:", error);
    return NextResponse.json(
      { error: "Failed to fetch students for the specified course." },
      { status: 500 }
    );
  }
}
