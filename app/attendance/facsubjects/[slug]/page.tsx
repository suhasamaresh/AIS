"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

export default function AttendanceManagement() {
  const pathname = usePathname();
  const courseId = pathname.split("/").pop(); // Extract courseId from URL

  const [classInfo, setClassInfo] = useState({
    subject: "Mathematics", // Replace with dynamic data
    subjectCode: "22CSU109",
    department: "Computer Science Engineering",
    semester: 3,
    section: "A",
    faculty: "Balram Nayak",
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
    attendancePercentage?: number; // Optional, calculated dynamically
    status: string;
  }

  const [attendanceData, setAttendanceData] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all"); // "all", "above85", "75to85", "below75"
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

        // Calculate attendance percentage dynamically
        const updatedAttendanceData = attendanceData.map((student: any) => {
          const attendancePercentage =
            (student.classesAttended / student.classesHeld) * 100 || 0;
          return {
            ...student,
            attendancePercentage: parseFloat(attendancePercentage.toFixed(1)),
            status: student.status || "P", // Default to "P" (Present)
          };
        });

        setAttendanceData(updatedAttendanceData);
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

  const filteredStudents = attendanceData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.usn.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (attendanceFilter === "above85") {
      matchesFilter = (student.attendancePercentage || 0) >= 85;
    } else if (attendanceFilter === "75to85") {
      matchesFilter =
        (student.attendancePercentage || 0) >= 75 &&
        (student.attendancePercentage || 0) < 85;
    } else if (attendanceFilter === "below75") {
      matchesFilter = (student.attendancePercentage || 0) < 75;
    }

    return matchesSearch && matchesFilter;
  });

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
          courseId: Number(courseId),
          classId: 12, // Replace with the actual classId, or fetch dynamically if needed
          date: selectedDate,
          attendance: attendanceData.map((student) => ({
            studentId: Number(student.id),
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>

        {/* Class Information */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <p>
            <strong>Course:</strong> {classInfo.subject}
          </p>
          <p>
            <strong>Course ID:</strong> {classInfo.subjectCode}
          </p>
          <p>
            <strong>Faculty:</strong> {classInfo.faculty}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          />
          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Students</option>
            <option value="above85">Above 85%</option>
            <option value="75to85">75% - 85%</option>
            <option value="below75">Below 75%</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 w-80"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">SL NO</th>
                <th className="px-6 py-3 text-left">USN</th>
                <th className="px-6 py-3 text-left">NAME</th>
                <th className="px-6 py-3 text-center">CLASSES HELD</th>
                <th className="px-6 py-3 text-center">CLASSES ATTENDED</th>
                <th className="px-6 py-3 text-center">ATTENDANCE %</th>
                <th className="px-6 py-3 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="border-t border-gray-200">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{student.usn}</td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4 text-center">{student.classesHeld}</td>
                  <td className="px-6 py-4 text-center">
                    {student.classesAttended}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {student.attendancePercentage}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={student.status === "P"}
                        onChange={() => handleStatusToggle(student.id)}
                        className="sr-only peer"
                      />
                      <div className="w-16 h-8 bg-red-500 peer-checked:bg-green-500 rounded-full after:content-['A'] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 peer-checked:after:translate-x-8 peer-checked:after:content-['P']" />
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
            type="button"
            onClick={handleSubmit}
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg ${
              selectedDate !== new Date().toISOString().split("T")[0]
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={selectedDate !== new Date().toISOString().split("T")[0]}
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
