"use client";

import React, { useState, useEffect } from "react";

interface SubjectRecord {
  sub_code: string;
}

interface StudentRecord {
    usn: string;
    Name: string;
    TotalClassesHeld: number;
    ClassesAttended: number;
    AttendancePercentage: number;
  }

export default function SubjectDashboard() {
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [branchCode, setBranchCode] = useState<string>("CS");
  const [resultYear, setResultYear] = useState<string>("2025-01-01");
  const [selectedSem, setSelectedSem] = useState<string>("1"); // Default semester is 5
  const [selectedSubCode, setSelectedSubCode] = useState<string | null>(null);

  // Fetch subjects based on branch code, result year, and semester
  const fetchSubjects = async () => {
    try {
      const response = await fetch(
        `/api/fetch_subject_codes?brcode=${branchCode}&result_year=${resultYear}&sem=${selectedSem}`
      );
      const data = await response.json();
      setSubjects(data.subjectCodes); // Set subjects data
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError("Error fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  // Fetch students based on the selected subject code
  const fetchStudents = async (sub_code: string) => {
    try {
      const response = await fetch(`/api/hod_subjectwise_consolidated?sub_code=${sub_code}`);
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Error fetching students");
    }
  };

  useEffect(() => {
    fetchSubjects(); // Fetch subjects when the component mounts or when dependencies change
  }, [branchCode, selectedSem, resultYear]);

  // Handle semester change
  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSem(event.target.value);
  };

  // Handle "View Students" button click
  const handleViewStudents = (sub_code: string) => {
    setSelectedSubCode(sub_code); // Set the selected subject code
    fetchStudents(sub_code); // Fetch the students for the selected subject
  };

return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 w-full">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Subjects Dashboard
        </h1>

        {/* Semester Dropdown */}
        <div className="mb-8">
            <label htmlFor="semester-dropdown" className="mr-2">
                Select Semester:
            </label>
            <select
                id="semester-dropdown"
                value={selectedSem}
                onChange={handleSemesterChange}
                className="px-4 py-2 rounded border"
            >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
            </select>
        </div>

        {/* Subjects Table */}
        <div className="overflow-x-auto mx-auto max-w-7xl px-8">
            {loading ? (
                <div className="text-center">
                    <p>Loading subjects...</p>
                </div>
            ) : error ? (
                <div className="text-center text-red-500">
                    <p>{error}</p>
                </div>
            ) : (
                <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200 text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">Subject Code</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject, index) => (
                            <tr key={subject.sub_code + index} className="border-b">
                                <td className="py-2 px-4">{subject.sub_code}</td>
                                <td className="py-2 px-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                        onClick={() => handleViewStudents(subject.sub_code)}
                                    >
                                        View Students
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

        {/* Display Students Table */}
        {selectedSubCode && (
            <div className="mt-8 w-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Students for {selectedSubCode}
                </h2>
                <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200 text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">USN</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Total Classes Held</th>
                            <th className="py-2 px-4 border-b">Total Classes Attended</th>
                            <th className="py-2 px-4 border-b">Attendance%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students
                            .filter((student) => student.usn) // Filter out students without USN
                            .map((student, index) => (
                                <tr key={student.usn + index} className="border-b">
                                    <td className="py-2 px-4">{student.usn}</td>
                                    <td className="py-2 px-4">{student.Name}</td>
                                    <td className="py-2 px-4">{student.TotalClassesHeld}</td>
                                    <td className="py-2 px-4">{student.ClassesAttended}</td>
                                    <td className="py-2 px-4">{student.AttendancePercentage}%</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);
}
