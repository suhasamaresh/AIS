import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      throw new Error("Request body must be a valid JSON object.");
    }

    const { courseId, classId, attendance } = body;

    if (!courseId || !classId || !Array.isArray(attendance)) {
      return NextResponse.json(
        { error: "Course ID, Class ID, and attendance data are required." },
        { status: 400 }
      );
    }

    console.log("Payload Received:", body);

    for (const record of attendance) {
      const { studentId, status } = record;

      if (!studentId || typeof status !== "string") {
        console.error("Invalid attendance record:", record);
        return NextResponse.json(
          { error: "Invalid attendance record. Each record must include studentId and status (P/A)." },
          { status: 400 }
        );
      }

      try {
        await prisma.attendance.upsert({
          where: {
            studentId_classId_date: {
              studentId,
              classId,
              date: new Date(body.date), // Use the provided date
            },
          },
          update: {
            status: status === "P",
          },
          create: {
            studentId,
            classId,
            date: new Date(body.date),
            status: status === "P",
          },
        });
      } catch (error) {
        console.error(`Failed to upsert attendance for studentId ${studentId}:`, error);
        return NextResponse.json(
          { error: `Failed to mark attendance for studentId ${studentId}.` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Attendance marked successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { error: "Failed to mark attendance." },
      { status: 500 }
    );
  }
}
