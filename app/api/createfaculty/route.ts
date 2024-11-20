import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();

    // Validate the required fields
    const { name, email, facultyId } = body;

    if (!name || !email || !facultyId) {
      return NextResponse.json(
        { error: "Name, email, and facultyId are required fields." },
        { status: 400 }
      );
    }

    // Create a new Faculty in the database
    const newFaculty = await prisma.faculty.create({
      data: {
        name,
        email,
        facultyId,
      },
    });

    // Return the newly created Faculty
    return NextResponse.json(newFaculty, { status: 201 });
  } catch (error) {
    // Handle potential errors (e.g., unique constraint violations)
    console.error("Error creating faculty:", error);

    if ((error as any).code === "P2002") {
      // Prisma error code for unique constraint violation
      return NextResponse.json(
        { error: "Email or Faculty ID already exists." },
        { status: 409 }
      );
    }

    // Return a generic error response for other cases
    return NextResponse.json(
      { error: "Failed to create faculty." },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}
