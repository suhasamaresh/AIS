"use client";

import React, { useState } from "react";

export default function CondonationStatus() {
  const [selectedSem, setSelectedSem] = useState<string>("1");
  const [selectedDept, setSelectedDept] = useState<string>("CS");
  const [resultYear, setResultYear] = useState<string>("2025-01-01");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCondonationData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/nsa_students?sem=${selectedSem}&dept=${selectedDept}&year=${resultYear}`
      );

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
      } else {
        const result = await response.json();
        setError(result.error || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching condonation data:", error);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkNotEligible = async () => {
    const confirm = window.confirm(
      "Are you sure you want to mark all displayed students as not eligible?"
    );

    if (confirm) {
      try {
        const payload = {
          students: students.map((student) => ({
            usn: student.usn,
            sem: selectedSem,
            br_code: selectedDept,
            result_year: resultYear,
            sub_code: student.sub_code,
            att_elg: 1, // Mark as not eligible
          })),
        };

        if (!payload.students || payload.students.length === 0) {
          alert("No students available to mark as not eligible.");
          return;
        }

        console.log("Payload for marking not eligible:", payload);

        const response = await fetch("/api/update_cr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert("Students marked as not eligible successfully.");
        } else {
          const result = await response.json();
          alert(`Failed to mark students as not eligible: ${result.error}`);
        }
      } catch (error) {
        console.error("Error marking students as not eligible:", error);
        alert("Failed to mark students as not eligible.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCondonationData();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 w-full">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Condonation Status
      </h1>

      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Semester Dropdown */}
          <div>
            <label htmlFor="semester" className="block font-medium mb-1">
              Semester
            </label>
            <select
              id="semester"
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semester {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Department Dropdown */}
          <div>
            <label htmlFor="department" className="block font-medium mb-1">
              Department
            </label>
            <select
              id="department"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="CS">CS</option>
              <option value="ECE">ECE</option>
              <option value="AE">AE</option>
            </select>
          </div>

          {/* Result Year (Default 2025-01-01) */}
          <div>
            <label htmlFor="resultYear" className="block font-medium mb-1">
              Result Year
            </label>
            <input
              type="date"
              id="resultYear"
              value={resultYear}
              onChange={(e) => setResultYear(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Fetch Data
          </button>
        </div>
      </form>

      {/* Data Table */}
      <div className="mt-8 w-full max-w-4xl">
        {loading ? (
          <p className="text-center">Loading data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : students.length > 0 ? (
          <>
            <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">USN</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Subject Code</th>
                  <th className="py-2 px-4 border-b">Semester</th>
                  <th className="py-2 px-4 border-b">Attendance %</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{student.usn}</td>
                    <td className="py-2 px-4">{student.student_name}</td>
                    <td className="py-2 px-4">{student.sub_code}</td>
                    <td className="py-2 px-4">{student.sem}</td>
                    <td className="py-2 px-4">
                      {student.attendance_percentage}%
                    </td>
                    <td className="py-2 px-4">{student.condonation_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleMarkNotEligible}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Mark Students Not Eligible
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">No data available.</p>
        )}
      </div>
    </div>
  );
}
