import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      throw new Error("Request body must be a valid JSON object.");
    }

    const { courseId, classId, attendance, date } = body;

    if (!courseId || !classId || !date || !Array.isArray(attendance)) {
      return NextResponse.json(
        {
          error: "Course ID, Class ID, date, and attendance data are required.",
        },
        { status: 400 }
      );
    }

    console.log("Payload Received:", body);

    // Validate classId
    const existingClass = await prisma.class.findUnique({
      where: { id: Number(classId) },
    });

    if (!existingClass) {
      return NextResponse.json(
        { error: "Invalid classId. Class does not exist." },
        { status: 400 }
      );
    }

    // Validate student IDs and ensure they belong to the course
    const validStudentIds = new Set(
      (
        await prisma.studentCourse.findMany({
          where: { courseId: Number(courseId) },
          select: { studentId: true },
        })
      ).map((record) => record.studentId)
    );

    for (const record of attendance) {
      const { studentId, status } = record;

      if (!studentId || typeof status !== "string") {
        console.error("Invalid attendance record:", record);
        return NextResponse.json(
          {
            error:
              "Invalid attendance record. Each record must include studentId and status (P/A).",
          },
          { status: 400 }
        );
      }

      if (!validStudentIds.has(studentId)) {
        console.error(
          `Invalid studentId: ${studentId}. Student is not enrolled in courseId: ${courseId}`
        );
        return NextResponse.json(
          { error: `Invalid studentId: ${studentId}. Not enrolled in course.` },
          { status: 400 }
        );
      }

      // Upsert attendance for the valid student and class
      try {
        await prisma.attendance.upsert({
          where: {
            studentId_classId_date: {
              studentId,
              classId: Number(classId),
              date: new Date(date),
            },
          },
          update: {
            status: status === "P",
          },
          create: {
            studentId,
            classId: Number(classId),
            date: new Date(date),
            status: status === "P",
          },
        });

        console.log(
          `Attendance upserted for studentId ${studentId}, classId ${classId}, date ${date}`
        );

        // Increment classesAttended if status is "P"
        if (status === "P") {
          await prisma.studentCourse.update({
            where: {
              studentId_courseId: {
                studentId,
                courseId: Number(courseId),
              },
            },
            data: {
              classesAttended: {
                increment: 1,
              },
            },
          });

          console.log(
            `classesAttended incremented for studentId ${studentId}, courseId ${courseId}`
          );
        }
      } catch (error) {
        console.error(
          `Failed to upsert attendance or update classesAttended for studentId ${studentId}:`,
          error
        );
      }
    }

    return NextResponse.json(
      { message: "Attendance marked and classesAttended updated successfully!" },
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
