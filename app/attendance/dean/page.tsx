"use client";

import React, { useState, useEffect } from "react";

interface Student {
  usn: string;
  student_name: string;
  sub_code: string;
  sem: string;
  dept: string;
  year: string;
  attendance_percentage: number;
  condonation_status: string;
  status: string;
}

export default function RecommendedStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<{
    [key: string]: boolean;
  }>({});

  // State for filter inputs
  const [selectedSem, setSelectedSem] = useState<string>("1");
  const [selectedBranch, setSelectedBranch] = useState<string>("CS");
  const [resultYear, setResultYear] = useState<string>("2025-01-01");

  // Fetch students with condonation status
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/fetch_recommended_students?sem=${selectedSem}&branch=${selectedBranch}&resultYear=${resultYear}`
      );

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);

        const initialStatus = data.students.reduce(
          (acc: any, student: Student) => {
            acc[`${student.usn}-${student.sub_code}`] =
              student.condonation_status === "Approved";
            return acc;
          },
          {}
        );
        setApprovalStatus(initialStatus);
      } else {
        const result = await response.json();
        setError(result.error || "Failed to fetch students.");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  // Update Condonation Status
  const handleUpdate = async () => {
    setLoading(true);

    const payload = {
      students: students.map((student) => ({
        usn: student.usn,
        sem: selectedSem,
        result_year: resultYear,
        sub_code: student.sub_code,
        br_code: 'CS',
        condonation_status: student.status === "A" ? "Approved" : "Recommended",
      })),
    };

    console.log("Sending payload:", payload);

    try {
      const response = await fetch(`/api/update_condonation_status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send payload in body
      });

      if (response.ok) {
        alert("Condonation status updated successfully.");
        fetchStudents();
      } else {
        const result = await response.json();
        setError(result.error || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating condonation status:", error);
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch students when filters change
  useEffect(() => {
    fetchStudents();
  }, [selectedSem, selectedBranch, resultYear]);

  const handleToggle = (index: number) => {
    const updatedStudents = [...students];
    updatedStudents[index].status =
      updatedStudents[index].status === "A" ? "NA" : "A";
    setStudents(updatedStudents);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 w-full">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Recommended Students
      </h1>

      {/* Dropdown filters */}
      <div className="flex space-x-4 mb-8">
        <div>
          <label className="block mb-2 font-medium">Semester</label>
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="CS">CS</option>
            <option value="EC">EC</option>
            <option value="ME">ME</option>
            <option value="IT">IT</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Result Year</label>
          <input
            type="date"
            value={resultYear}
            onChange={(e) => setResultYear(e.target.value)}
            className="px-4 py-2 border rounded"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-6xl">
          <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">USN</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Subject Code</th>
                <th className="py-2 px-4 border-b">Semester</th>
                <th className="py-2 px-4 border-b">Attendance %</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Approval</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.usn + student.sub_code} className="border-b">
                  <td className="py-2 px-4">{student.usn}</td>
                  <td className="py-2 px-4">{student.student_name}</td>
                  <td className="py-2 px-4">{student.sub_code}</td>
                  <td className="py-2 px-4">{student.sem}</td>
                  <td className="py-2 px-4">
                    {student.attendance_percentage}%
                  </td>
                  <td className="py-2 px-4">{student.condonation_status}</td>
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={student.status === "A"}
                        onChange={() => handleToggle(index)}
                        className="sr-only peer"
                      />
                      <div className="w-16 h-8 bg-red-500 peer-checked:bg-green-500 rounded-full after:content-['NA'] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 peer-checked:after:translate-x-8 peer-checked:after:content-['A']" />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleUpdate}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            type="button"
          >
            Update Status
          </button>
        </div>
      )}
    </div>
  );
}
