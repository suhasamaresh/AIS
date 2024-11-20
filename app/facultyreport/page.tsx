"use client";

import React, { useState } from "react";

const AttendanceSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Faculty Report");
  const [iframeSrc, setIframeSrc] = useState<string | null>(null); // To manage iframe source dynamically
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<{ rollNo: number; name: string; percentage: number }[]>([
    { rollNo: 1, name: "John Doe", percentage: 85 },
    { rollNo: 2, name: "Jane Smith", percentage: 78 },
  ]);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPercentage, setNewStudentPercentage] = useState<number | "">("");

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "class":
        setIframeSrc("/attendance/classwise"); // Updated route for class tab
        break;
      case "student":
        setIframeSrc("/attendance/studentwise"); // Updated route for student tab
        break;
      case "action":
        setIframeSrc("/attendance/calltoaction");
        break;
      default:
        setIframeSrc(null);
        break;
    }
  };

  const addStudentRecord = () => {
    if (newStudentName && newStudentPercentage !== "") {
      const newRollNo = students.length + 1; // Increment roll number
      const newStudent = { rollNo: newRollNo, name: newStudentName, percentage: Number(newStudentPercentage) };
      setStudents([...students, newStudent]); // Add new student to the list
      setNewStudentName("");
      setNewStudentPercentage("");
      setIsModalOpen(false);
    }
  };

  const getFullPageLink = () => {
    switch (activeTab) {
      case "class":
        return "/faculty/attendance/classwise";
      case "student":
        return "/faculty/mentors/Attendance";
      case "action":
        return "/faculty/calltoaction";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full w-12 h-12"></div>
          <div>
            <h2 className="text-xl font-semibold">Dr. Ambedkar Institute of Technology</h2>
            <small>Bengaluru, Karnataka, India</small>
          </div>
        </div>
        <nav className="flex gap-8">
          <a href="index.html" className="font-medium hover:underline">
            Dashboard
          </a>
          <a href="2_AttendanceMarking.html" className="font-medium hover:underline">
            Attendance
          </a>
          <a href="3_ClassWise.html" className="font-medium hover:underline">
            Report
          </a>
          <a href="/faculty/classmanagement" className="font-medium hover:underline">
            Class Management
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full w-10 h-10"></div>
          <span>DR. Abc</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-indigo-600 text-center mb-8">Attendance Reports</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {["Faculty Report", "class", "student", "action"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-full ${
                activeTab === tab ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => switchTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Conditional Rendering */}
        {activeTab === "Faculty Report" && (
          <>
            {/* Faculty Report Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">CSE-A (Mathematics)</h3>
                <div className="bg-gray-200 h-2 rounded mt-2 overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "85%" }}></div>
                </div>
                <p className="mt-2">85% Attendance</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">CSE-B (Data Structures)</h3>
                <div className="bg-gray-200 h-2 rounded mt-2 overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: "78%" }}></div>
                </div>
                <p className="mt-2">78% Attendance</p>
              </div>
            </div>

            {/* Attendance Table */}
            <table className="w-full text-left bg-white rounded-lg overflow-hidden shadow">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="p-4">Roll No.</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.rollNo}>
                    <td className="p-4">{student.rollNo}</td>
                    <td className="p-4">{student.name}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          student.percentage >= 75
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {student.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Record Button */}
            <button
              className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition"
              onClick={() => setIsModalOpen(true)}
            >
              Add Record
            </button>
          </>
        )}

        {/* Iframe for Dynamic Pages */}
        {activeTab !== "Faculty Report" && iframeSrc && (
          <div className="mt-8">
            <iframe
              src={iframeSrc}
              title="Dynamic Tab Content"
              className="w-full h-[90vh] border rounded-lg shadow"
            ></iframe>
            <div className="text-center mt-4">
              <a
                href={getFullPageLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Go to Full Page →
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Attendance Record</h2>
            <div className="mb-4">
              <label htmlFor="student-name" className="block font-medium mb-2">
                Student Name
              </label>
              <input
                type="text"
                id="student-name"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Enter student name"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="attendance-percentage" className="block font-medium mb-2">
                Attendance Percentage
              </label>
              <input
                type="number"
                id="attendance-percentage"
                value={newStudentPercentage}
                onChange={(e) => setNewStudentPercentage(Number(e.target.value))}
                placeholder="Enter percentage"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={addStudentRecord}>
                Save
              </button>
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceSystem;
