import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { date, status, studentId, classId } = body;
  
      if (!date || status === undefined || !studentId || !classId) {
        return NextResponse.json(
          { error: "Date, status, studentId, and classId are required fields." },
          { status: 400 }
        );
      }
  
      const newAttendance = await prisma.attendance.create({
        data: {
          date: new Date(date),
          status,
          studentId,
          classId,
        },
      });
  
      return NextResponse.json(newAttendance, { status: 201 });
    } catch (error) {
      console.error("Error marking attendance:", error);
  
      if ((error as any).code === "P2002") {
        return NextResponse.json(
          { error: "Attendance record for this student and class already exists." },
          { status: 409 }
        );
      }
  
      return NextResponse.json(
        { error: "Failed to mark attendance." },
        { status: 500 }
      );
    }
  }
  