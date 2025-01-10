"use client";
import {
  useState,
  useEffect,
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { FaSearch as Search, FaTimes as X } from "react-icons/fa";

// Sample data: Array of student objects
import { usePathname } from "next/navigation";

const classesHeld = 100; // Same for all students

export default function Page() {
  interface Student {
    S_NAME: string;
    USN: string;
    status: string;
    classesAttended: number;
  }

  const [activeOption, setActiveOption] = useState("Student");
  const [students, setStudents] = useState<Student[]>([]); // Set initial data as sample
  const classInfo = {
    subject: "CGIP",
    subjectCode: "22CSU502",
    faculty: "Vinod Kumar KP",
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [activeReport, setActiveReport] = useState<string>(
    "Consolidated Report"
  );
  const [attendanceFilter, setAttendanceFilter] = useState<string>("all");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("");

  const pathname = usePathname();
  const [subjectCode, setSubjectCode] = useState<string>("");
  const [semester, setSemester] = useState<string>("");

  useEffect(() => {
    if (pathname) {
      // Extract subjectCode and semester using a regular expression
      const regex = /\/attendance\/([^/]+)\/([^/]+)/;
      const match = pathname.match(regex);
      if (match) {
        setSubjectCode(match[1]); // Extracts the subject code (e.g., 22CSU502)
        setSemester(match[2]); // Extracts the semester (e.g., A)
      }
    }
  }, [pathname]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `/api/get_course_students?subjectCode=${subjectCode}&semester=${semester}`
      );
      const data = await response.json();
      console.log(data);
      // Set all students' status to "P" (Present) by default
      const studentsWithDefaultStatus = data.courses.map(
        (student: Student) => ({
          ...student,
          status: "P",
        })
      );
      setStudents(studentsWithDefaultStatus);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  useEffect(() => {
    if (subjectCode && semester) {
      fetchStudents();
    }
  }, [subjectCode, semester]);

  useEffect(() => {
    setFilteredStudents(
      students.filter(
        (student: { S_NAME: string }) =>
          student.S_NAME &&
          student.S_NAME.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, students]);

  const handleStatusToggle = (id: any) => {
    setFilteredStudents((prevStudents: any[]) =>
      prevStudents.map((student) =>
        student.USN === id
          ? { ...student, status: student.status === "P" ? "A" : "P" }
          : student
      )
    );
  };

  const handleSubmit = () => {
    console.log("Attendance submitted for date:", selectedDate);
    console.log("Attendance data:", filteredStudents);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 w-full">
      <div className="flex space-x-4 mb-8">
        {[
          "Student",
          "Attendance Marking",
          "Attendance Register",
          "CIE Marks Entry",
        ].map((option) => (
          <button
            key={option}
            onClick={() => setActiveOption(option)}
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

      {activeOption === "Student" && (
        <div className="w-full max-w-6xl overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-3 text-left">USN</th>
                <th className="px-4 py-3 text-left">Name</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } text-gray-700`}
                  >
                    <td className="px-4 py-3">{student.USN}</td>
                    <td className="px-4 py-3">{student.S_NAME}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeOption == "Attendance Marking" && (
        <div className="min-h-screen bg-gray-50 w-full">
          <div className="mx-auto p-6 w-full max-w-6xl">
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
              {/* Date Picker */}
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              />

              {/* Time Period Dropdown */}
              <select
                value={selectedTimePeriod}
                onChange={(e) => setSelectedTimePeriod(e.target.value)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <option value="" disabled>
                  Select Time Period
                </option>
                <option value="9:00-9:55 am">9:00 - 9:55 am</option>
                <option value="9:55-10:50 am">9:55 - 10:50 am</option>
                <option value="11:10-12:05 pm">11:10 - 12:05 pm</option>
                <option value="12:05-1:00 pm">12:05 - 1:00 pm</option>
                <option value="1:45-2:40 pm">1:45 - 2:40 pm</option>
                <option value="2:40-3:35 pm">2:40 - 3:35 pm</option>
                <option value="3:35-4:30 pm">3:35 - 4:30 pm</option>
              </select>

              {/* Search Input */}
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
                    <th className="px-6 py-3 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.USN} className="border-t border-gray-200">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{student.USN}</td>
                      <td className="px-6 py-4">{student.S_NAME}</td>
                      <td className="px-6 py-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={student.status === "P"}
                            onChange={() => handleStatusToggle(student.USN)}
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
                disabled={
                  selectedDate !== new Date().toISOString().split("T")[0]
                }
              >
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {activeOption === "Attendance Register" && (
        <div className="min-h-screen bg-gray-50 w-full">
          <div className="mx-auto p-6 w-full max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">Attendance Register</h1>
            {/* Report type toggle buttons */}
            <div className="flex space-x-4 mb-8">
              {["Consolidated Report", "Detailed Report"].map((report) => (
                <button
                  key={report}
                  onClick={() => setActiveReport(report)}
                  className={`px-6 py-3 text-sm font-medium rounded-lg border transition-all duration-300 ${
                    activeReport === report
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                  }`}
                >
                  {report}
                </button>
              ))}
            </div>
            {/* Content based on active report */}
            <div>
              {activeReport === "Consolidated Report" && (
                <div className="min-h-screen bg-gray-50">
                  <div className="max-w-7xl mx-auto p-6">
                    <h1 className="text-2xl font-bold mb-4">
                      Attendance Management
                    </h1>

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
                            <th className="px-6 py-3 text-center">
                              CLASSES HELD
                            </th>
                            <th className="px-6 py-3 text-center">
                              CLASSES ATTENDED
                            </th>
                            <th className="px-6 py-3 text-center">
                              ATTENDANCE %
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student, index) => (
                            <tr
                              key={student.USN}
                              className="border-t border-gray-200"
                            >
                              <td className="px-6 py-4">{index + 1}</td>
                              <td className="px-6 py-4">{student.USN}</td>
                              <td className="px-6 py-4">{student.S_NAME}</td>
                              <td className="px-6 py-4 text-center">
                                {classesHeld}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {student.classesAttended}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {((student.classesAttended / classesHeld) * 100).toFixed(2)}%
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
                          selectedDate !==
                          new Date().toISOString().split("T")[0]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={
                          selectedDate !==
                          new Date().toISOString().split("T")[0]
                        }
                      >
                        Submit Attendance
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
