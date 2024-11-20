"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

export default function AttendanceManagement() {
  const pathname = usePathname();
  const courseId = pathname.split("/").pop(); // Extract courseId from URL

  const [classInfo, setClassInfo] = useState({
    subject: "",
    subjectCode: "",
    department: "",
    semester: 0,
    section: "",
    faculty: "",
    totalStudents: 0,
  });

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  interface Student {
    id: string;
    name: string;
    usn: string;
    classesHeld: number;
    classesAttended: number;
    attendancePercentage: number;
    status: string;
  }

  const [attendanceData, setAttendanceData] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAbsentees, setShowAbsentees] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError("Course ID is missing in the URL.");
      setLoading(false);
      return;
    }

    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError(null);

        const attendanceResponse = await fetch(
          `/api/course/students?courseId=${courseId}`
        );

        if (!attendanceResponse.ok) {
          throw new Error("Failed to fetch class or attendance data.");
        }

        const attendanceData = await attendanceResponse.json();

        setAttendanceData(
          attendanceData.map((student: any) => ({
            ...student,
            status: student.status || "P",
          }))
        );
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [courseId]);

  const handleStatusToggle = (studentId: string) => {
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.id === studentId
          ? {
              ...student,
              status: student.status === "P" ? "A" : "P",
            }
          : student
      )
    );
  };

  const handleSubmit = async () => {
    if (!courseId) {
      alert("Course ID is missing.");
      return;
    }

    try {
      const response = await fetch(`/api/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: Number(courseId), // Ensure courseId is a number
          classId: 1, // Replace with the actual classId, or fetch dynamically if needed
          date: selectedDate,
          attendance: attendanceData.map((student) => ({
            studentId: Number(student.id), // Ensure studentId is a number
            status: student.status,
          })),
        }),
      });

      if (response.ok) {
        alert("Attendance submitted successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to submit attendance: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("An error occurred while submitting attendance.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>

        {/* Class Information Card */}
        {/* ... */}

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">SL NO</th>
                <th className="px-6 py-3 text-left">USN</th>
                <th className="px-6 py-3 text-left">NAME</th>
                <th className="px-6 py-3 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student, index) => (
                <tr key={student.id} className="border-t border-gray-200">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{student.usn}</td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={student.status === "P"}
                        onChange={() => handleStatusToggle(student.id)}
                        className="sr-only peer"
                      />
                      <div className="w-16 h-8 bg-red-500 peer-checked:bg-green-500 rounded-full after:content-['A'] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-8 peer-checked:after:content-['P']" />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
