import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { studentId, subject } = body;
  
      if (!studentId || !subject) {
        return NextResponse.json(
          { error: "studentId and subject are required fields." },
          { status: 400 }
        );
      }
  
      // Fetch the student to update their subjects
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });
  
      if (!student) {
        return NextResponse.json(
          { error: `Student with id ${studentId} does not exist.` },
          { status: 404 }
        );
      }
  
      // Add the new subject to the student's subjects array
      const updatedSubjects = [...(student.subjects as string[]), subject];
  
      // Update the student record in the database
      const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: { subjects: updatedSubjects },
      });
  
      return NextResponse.json(updatedStudent, { status: 200 });
    } catch (error) {
      console.error("Error adding subject to student:", error);
      return NextResponse.json(
        { error: "Failed to add subject to student." },
        { status: 500 }
      );
    }
  }
  