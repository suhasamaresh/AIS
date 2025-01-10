"use client";

import React, { useState, useEffect } from "react";

interface StudentRecord {
  usn: string;
  Name: string;
  sub_code: string;
  TotalClassesHeld: number;
  ClassesAttended: number;
  AttendancePercentage: number;
  status: string;
  remarks: string; // Added field for remarks
}

export default function AttendanceTable() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSem, setSelectedSem] = useState<string>("1");
  const [selectedDept, setSelectedDept] = useState<string>("CS");
  const [resultYear, setResultYear] = useState<string>("2025-01-01");

  // Fetch student data based on selected filters
  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/condonation?sem=${selectedSem}&dept=${selectedDept}&year=${resultYear}`
      );
      const data = await response.json();
      setStudents(
        data.students.map((student: StudentRecord) => ({
          ...student,
          status: "C", // Default to Condonation status
          remarks: student.remarks, // Default remarks
        }))
      );
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Failed to fetch student data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle switch change
  const handleToggle = (index: number) => {
    const updatedStudents = [...students];
    updatedStudents[index].status =
      updatedStudents[index].status === "C" ? "NC" : "C";
    setStudents(updatedStudents);
  };

  // Handle remarks change
  const handleRemarksChange = (index: number, value: string) => {
    const updatedStudents = [...students];
    updatedStudents[index].remarks = value;
    setStudents(updatedStudents);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const confirm = window.confirm(
      "Are you sure you want to proceed with this action?"
    );

    if (confirm) {
      try {
        const payload = {
          students: students.map((student) => ({
            usn: student.usn,
            student_name: student.Name,
            sem: selectedSem,
            result_year: resultYear,
            sub_code: student.sub_code,
            br_code: selectedDept,
            classes_held: student.TotalClassesHeld,
            classes_attended: student.ClassesAttended,
            attendance_percentage: student.AttendancePercentage,
            condonation_status: student.status === "C" ? "Recommended" : "Rejected",
            remarks: student.remarks, // Include remarks in the payload
          })),
        };

        console.log("Final Payload before submission:", payload);

        const response = await fetch("/api/push_condonation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert("Condonation data submitted successfully.");
        } else {
          const result = await response.json();
          alert(`Failed to submit condonation data: ${result.error}`);
        }
      } catch (error) {
        console.error("Error submitting condonation data:", error);
        alert("Submission failed.");
      }
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [selectedSem, selectedDept, resultYear]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 w-full">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Attendance Dashboard
      </h1>

      <div className="flex space-x-4 mb-8">
        <div>
          <label htmlFor="semester" className="block font-medium mb-1">
            Semester
          </label>
          <select
            id="semester"
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="px-4 py-2 rounded border"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Semester {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="department" className="block font-medium mb-1">
            Department
          </label>
          <select
            id="department"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-4 py-2 rounded border"
          >
            <option value="CS">CS</option>
            <option value="IT">IT</option>
            <option value="EC">EC</option>
            <option value="ME">ME</option>
          </select>
        </div>

        <div>
          <label htmlFor="resultYear" className="block font-medium mb-1">
            Result Year
          </label>
          <input
            type="date"
            id="resultYear"
            value={resultYear}
            onChange={(e) => setResultYear(e.target.value)}
            className="px-4 py-2 rounded border"
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full max-w-7xl">
        {loading ? (
          <div className="text-center">
            <p>Loading student data...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">USN</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Sem</th>
                  <th className="py-2 px-4 border-b">Subject Code</th>
                  <th className="py-2 px-4 border-b">Classes Held</th>
                  <th className="py-2 px-4 border-b">Classes Attended</th>
                  <th className="py-2 px-4 border-b">Attendance %</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <tr
                      key={student.usn + student.sub_code}
                      className="border-b"
                    >
                      <td className="py-2 px-4">{student.usn}</td>
                      <td className="py-2 px-4">{student.Name}</td>
                      <td className="py-2 px-4">{selectedSem}</td>
                      <td className="py-2 px-4">{student.sub_code}</td>
                      <td className="py-2 px-4 text-center">
                        {student.TotalClassesHeld}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {student.ClassesAttended}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {student.AttendancePercentage}%
                      </td>
                      <td className="px-6 py-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={student.status === "C"}
                            onChange={() => handleToggle(index)}
                            className="sr-only peer"
                          />
                          <div className="w-16 h-8 bg-red-500 peer-checked:bg-green-500 rounded-full after:content-['NC'] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 peer-checked:after:translate-x-8 peer-checked:after:content-['C']" />
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={student.remarks}
                          onChange={(e) =>
                            handleRemarksChange(index, e.target.value)
                          }
                          className="px-4 py-2 rounded border"
                        >
                          <option value="document provided">
                            Document Provided
                          </option>
                          <option value="document not provided">
                            Document Not Provided
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-4 px-4 text-center text-gray-600"
                    >
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
