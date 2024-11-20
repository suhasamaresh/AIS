import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");
    const courseId = url.searchParams.get("courseId");
  
    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: "studentId and courseId are required query parameters." },
        { status: 400 }
      );
    }
  
    try {
      // Fetch all attendance records for the student and course
      const attendanceRecords = await prisma.attendance.findMany({
        where: {
          studentId: parseInt(studentId),
          class: {
            courseId: parseInt(courseId),
          },
        },
        include: {
          class: {
            select: { date: true },
          },
        },
      });
  
      return NextResponse.json(attendanceRecords, { status: 200 });
    } catch (error) {
      console.error("Error fetching attendance report:", error);
      return NextResponse.json(
        { error: "Failed to fetch attendance report." },
        { status: 500 }
      );
    }
  }
  