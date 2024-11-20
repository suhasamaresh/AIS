import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(request: Request) {
  try {
    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const facultyId = searchParams.get("facultyId");

    // Validate the facultyId
    if (!facultyId) {
      return NextResponse.json(
        { error: "facultyId is required as a query parameter." },
        { status: 400 }
      );
    }

    // Fetch all courses related to the faculty
    const courses = await prisma.course.findMany({
      where: {
        facultyId: Number(facultyId),
      },
      select: {
        id: true,
        subject: true,
        semester: true,
        section: true,
        classes: true, // Include associated classes if needed
        students: {
          select: {
            student: {
              select: {
                id: true,
                name: true,
                usn: true,
              },
            },
          },
        }, // Include associated students if needed
      },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses for faculty:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses for the specified faculty." },
      { status: 500 }
    );
  }
}
