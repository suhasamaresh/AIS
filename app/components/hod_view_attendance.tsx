"use client";

import { set } from "date-fns";
import React, { useState, useEffect } from "react";
import SubjectDashboard from "./subjectwise";

interface AttendanceRecord {
  usn: string;
  Name: string;
  TotalClassesHeld: number;
  ClassesAttended: number;
  AttendancePercentage: number;
  sub_code: string;
  sec: string;
  sem: string;
}

interface StudentRecord {
  usn: string;
  Name: string;
  sem: string;
  sec: string;
}

export default function AttendanceDashboard() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [studentData, setStudentData] = useState<StudentRecord[]>([]);
  const [filteredData, setFilteredData] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [branchCode, setBranchCode] = useState<string>("CS");
  const [resultYear, setResultYear] = useState<string>("2024-01-06");
  const [selectedSem, setSelectedSem] = useState<string>("5"); // Default semester is 5
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeOption, setActiveOption] = useState<string>("Studentwise");
  const [studentName, setStudentName] = useState<string>("");
  const [studentUSN, setStudentUSN] = useState<string>("");
  const [studentSem, setStudentSem] = useState<string>("");
  const [studentSec, setStudentSec] = useState<string>("");

  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(
    null
  );
  const [attendanceDetails, setAttendanceDetails] = useState<
    AttendanceRecord[]
  >([]);
  const [isDetailsTabOpen, setIsDetailsTabOpen] = useState<boolean>(false);
  const [tableOpen, setTableOpen] = useState<boolean>(true);

  // Fetch student data for Studentwise option
  const fetchStudentData = async (branchCode: string, sem: string) => {
    try {
      const response = await fetch(
        `/api/fetch_students_hod?brcode=${branchCode}&sem=${sem}`
      );
      const data = await response.json();
      setStudentData(data.students);
      setFilteredData(data.students); // Initialize filtered data with all student data
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Error fetching student data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance data for Subjectwise option (if needed)
  const fetchAttendanceData = async (
    branchCode: string,
    resultYear: string,
    sem: string
  ) => {
    try {
      const response = await fetch(
        `/api/fetch_hod_view_attendance?brcode=${branchCode}&result_year=${resultYear}&sem=${sem}`
      );
      const data = await response.json();
      setAttendanceData(data.attendance);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setError("Error fetching attendance data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch individual student details when Get Details button is clicked
  const fetchIndividualDetails = async (
    usn: string,
    sem: string,
    Name: string,
    sec: string
  ) => {
    try {
      const response = await fetch(
        `/api/fetch_individual_details?usn=${usn}&sem=${sem}`
      );
      const data = await response.json();
      console.log(data);
      setAttendanceDetails(data.attendance); // Set the attendance data for the selected student
      setSelectedStudent(data.student); // Set the selected student details
      setStudentName(Name);
      setStudentUSN(usn);
      setStudentSem(sem);
      setStudentSec(sec);
      setTableOpen(false);
      setIsDetailsTabOpen(true); // Open the details tab
    } catch (error) {
      console.error("Error fetching individual student details:", error);
      setError("Error fetching individual student details");
    }
  };

  // Call the fetchStudentData function on component mount or whenever branchCode or selectedSem changes
  useEffect(() => {
    if (activeOption === "Studentwise") {
      fetchStudentData(branchCode, selectedSem);
    } else {
      fetchAttendanceData(branchCode, resultYear, selectedSem);
    }
  }, [branchCode, selectedSem, activeOption]);

  // Handle search input change and filter data
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    filterData(event.target.value);
  };

  // Filter data based on the search term (usn, name)
  const filterData = (term: string) => {
    if (!term) {
      setFilteredData(studentData); // No search term, show all data
    } else {
      const filtered = studentData.filter((student) => {
        return (
          student.usn.toLowerCase().includes(term.toLowerCase()) ||
          student.Name.toLowerCase().includes(term.toLowerCase())
        );
      });
      setFilteredData(filtered);
    }
  };

  // Handle active option (Studentwise / Subjectwise) change
  const handleViewOptionChange = (option: string) => {
    setActiveOption(option);
  };

  // Close the details tab
  const closeDetailsTab = () => {
    setIsDetailsTabOpen(false);
    setAttendanceDetails([]); // Clear attendance data
    setTableOpen(true);
    setSelectedStudent(null); // Clear selected student data
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 w-full">
      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        HOD Attendance Dashboard
      </h1>

      {/* Semester Dropdown */}
      <div className="mb-8">
        <label htmlFor="semester-dropdown" className="mr-2">
          Select Semester:
        </label>
        <select
          id="semester-dropdown"
          value={selectedSem}
          onChange={(e) => setSelectedSem(e.target.value)}
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

      {/* View Option Dropdown */}
      <div className="mb-8 flex space-x-4">
        {["Studentwise", "Subjectwise"].map((option) => (
          <button
            key={option}
            onClick={() => handleViewOptionChange(option)}
            className={`px-6 py-3 text-sm font-medium rounded-lg border transition-all duration-300 ${
              activeOption === option
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <label htmlFor="search" className="mr-2">
          Search:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by USN or Name"
          className="px-4 py-2 rounded border"
        />
      </div>

      {/* Display Student-wise data */}
      {activeOption === "Studentwise" && tableOpen === true && (
        <div className="overflow-x-auto mx-auto max-w-7xl px-8">
          {loading ? (
            <div className="text-center">
              <p>Loading student data...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">USN</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Section</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((student, index) => (
                  <tr key={student.usn + index} className="border-b">
                    <td className="py-2 px-4">{student.usn}</td>
                    <td className="py-2 px-4">{student.Name}</td>
                    <td className="py-2 px-4">{student.sec}</td>
                    <td className="py-2 px-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() =>
                          fetchIndividualDetails(
                            student.usn,
                            selectedSem,
                            student.Name,
                            student.sec
                          )
                        }
                      >
                        Get Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Display Individual Student Details in a new tab */}
      {isDetailsTabOpen && (
        <div className="mt-6 p-6 bg-white shadow-lg rounded-lg max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            {/* Close Button */}
            <button
              onClick={closeDetailsTab}
              className="text-red-500 font-semibold text-2xl hover:text-red-700 transition-all"
            >
              &times;
            </button>
          </div>

          {/* Student Info */}
          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">
              Name: {studentName}
            </h2>
            <p className="text-lg font-medium text-gray-600">
              USN: {studentUSN}
            </p>
            <p className="text-lg font-medium text-gray-600">
              Semester: {studentSem}
            </p>
            <p className="text-lg font-medium text-gray-600">
              Section: {studentSec}
            </p>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-600">
                  <th className="py-3 px-4 font-semibold">Subject Code</th>
                  <th className="py-3 px-4 font-semibold">
                    Total Classes Held
                  </th>
                  <th className="py-3 px-4 font-semibold">Classes Attended</th>
                  <th className="py-3 px-4 font-semibold">
                    Attendance Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {attendanceDetails.map((attendance, index) => (
                  <tr
                    key={attendance.sub_code + index}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4">{attendance.sub_code}</td>
                    <td className="py-3 px-4">{attendance.TotalClassesHeld}</td>
                    <td className="py-3 px-4">{attendance.ClassesAttended}</td>
                    <td className="py-3 px-4">
                      {attendance.AttendancePercentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Print
            </button>
            <button
              onClick={() => {
                const csvContent: string = [
                  [
                    "USN",
                    "Name",
                    "Subject Code",
                    "Total Classes Held",
                    "Classes Attended",
                    "Attendance Percentage",
                  ],
                  ...attendanceDetails.map((item: AttendanceRecord) => [
                    studentUSN,
                    studentName,
                    item.sub_code,
                    item.TotalClassesHeld.toString(),
                    item.ClassesAttended.toString(),
                    item.AttendancePercentage.toString(),
                  ]),
                ]
                  .map((e: string[]) => e.join(","))
                  .join("\n");

                const blob = new Blob([csvContent], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute(
                  "download",
                  `${studentUSN}_attendance_report.csv`
                );
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Export as CSV
            </button>
          </div>
        </div>
      )}
      {activeOption === "Subjectwise" && tableOpen === true && (<SubjectDashboard />)}
    </div>
  );
}
