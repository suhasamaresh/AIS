import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

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

    // Fetch students and attendance data
    const students = await prisma.studentCourse.findMany({
      where: {
        courseId: Number(courseId),
      },
      select: {
        student: {
          select: {
            id: true,
            name: true,
            usn: true,
            email: true,
            dob: true,
            contactNo: true,
            department: true,
          },
        },
        classesHeld: true,
        classesAttended: true,
        attendancePercentage: true,
      },
    });

    // Format the response
    const formattedData = students.map((record) => ({
      id: record.student.id,
      name: record.student.name,
      usn: record.student.usn,
      email: record.student.email,
      dob: record.student.dob,
      contactNo: record.student.contactNo,
      department: record.student.department,
      classesHeld: record.classesHeld,
      classesAttended: record.classesAttended,
      attendancePercentage: record.attendancePercentage,
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching students for the course:", error);
    return NextResponse.json(
      { error: "Failed to fetch students for the specified course." },
      { status: 500 }
    );
  }
}
