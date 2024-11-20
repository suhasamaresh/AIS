"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Course {
  id: number;
  subject: string;
  semester: number;
  section: string;
}

const Page = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/faculty/courses?facultyId=1", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Log the fetched data

        if (!Array.isArray(data)) {
          throw new Error("API did not return an array of courses.");
        }

        setCourses(data); // Update state with the fetched data
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <p>Loading courses...</p>;
  }

  return (
    <div className="ml-5 mr-5 mt-10">
      {/* Header Section */}
      <div>
        <header className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold">Your Courses</h1>
            <p className="opacity-80 mt-2">
              View and manage the courses you are teaching.
            </p>
          </div>
        </header>
      </div>

      {/* Courses Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="course-card p-4 border rounded-lg shadow-lg cursor-pointer hover:bg-gray-100"
            onClick={() =>
              router.push(`/attendance/facsubjects/${course.id}`)
            }
          >
            <h3 className="text-xl font-semibold mb-2">{course.subject}</h3>
            <p className="text-gray-700">Semester: {course.semester}</p>
            <p className="text-gray-700">Section: {course.section}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
