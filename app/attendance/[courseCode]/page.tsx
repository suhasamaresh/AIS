"use client";

import AttendanceTable from "@/app/components/detailedattendance";
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

export default function Page() {
  interface student {
    S_NAME: string;
    USN: string;
    status: string;
    TotalClassesHeld: number;
    ClassesAttended: number;
    ClassesAbsent: number;
    AttendancePercentage: number;
    usn: string;
    Name: string;
  }

  interface Attendance {
    usn: string;
    name: string;
    status: string;
    timePeriod: string;
  }

  interface AttendanceByDate {
    date: string;
    timePeriod: string;
    dateTimeKey: string;
    attendance: Attendance[];
  }

  const [activeOption, setActiveOption] = useState("Student");
  const [students, setStudents] = useState<student[]>([]); // Set initial data as sample
  const classInfo = {
    subject: "ME",
    subjectCode: "22CSU501",
    faculty: "Dr Nandini N",
    facultyId: "CSU07",
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [code, SetCode] = useState<string>("");
  const [sect, setSect] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [activeReport, setActiveReport] = useState<string>(
    "Consolidated Report"
  );
  const [attendanceFilter, setAttendanceFilter] = useState<string>("all");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("");
  const [studentdetails, setStudentDetails] = useState<any[]>([]);
  const [detailed, setDetailed] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceByDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flag, setFlag] = useState<any[]>([]);
  const pathname = usePathname();
  const slug = pathname ? pathname.split("/").pop() : "";
  const [searchs, SetSearchs] = useState<any[]>([]);

  const decode = (encoded: string) => {
    const decoded = atob(encoded);
    const subjectcode = decoded.slice(0, -1);
    const section = decoded.slice(-1);
    return { subjectcode, section };
  };

  const { subjectcode, section } = decode(slug || "");
  console.log(subjectcode, section);

  const fetchdetailedreport = async () => {
    try {
      const response = await fetch(
        `/api/detailed_report?sub_code=${subjectcode}&facultyId=CSU09`
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }
      const data = await response.json();
      setAttendanceData(data);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchstudentdetails = async () => {
    try {
      const response = await fetch(
        `/api/consolidated_query?sub_code=${subjectcode}&section=${section}&facultyId=CSU09`
      );
      const data = await response.json();
      console.log(data);
      setStudentDetails(data.attendance);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `/api/get_course_students?subjectCode=${subjectcode}&section=${section}&facultyId=CSU09`
      );
      const data = await response.json();
      const studentsWithDefaultStatus = data.students.map(
        (student: student) => ({
          ...student,
          status: "P",
        })
      );
      setStudents(studentsWithDefaultStatus);
      console.log(data);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const handleSubmit = async () => {
    if (
      selectedDate === new Date().toISOString().split("T")[0] &&
      selectedTimePeriod
    ) {
      const attendanceData = filteredStudents.map((student) => ({
        usn: student.USN,
        status: student.status,
      }));

      const data = {
        sub_code: subjectcode,
        sec: section,
        faculty_id: classInfo.facultyId,
        dept: "CS", // Example department (replace with actual value)
        sem: 5, // Example semester (replace with actual value)
        year: new Date(selectedDate).getFullYear(), // Use the year from the selected date
        Date: selectedDate,
        timePeriod: selectedTimePeriod,
        attendanceData,
      };

      // First, check if the attendance already exists for the given date and time period
      try {
        const checkResponse = await fetch("/api/check_attendance_exists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sub_code: subjectcode,
            sec: section,
            attendanceDate: selectedDate,
            timePeriod: selectedTimePeriod,
          }),
        });

        const checkData = await checkResponse.json();

        if (checkResponse.ok) {
          if (checkData.exists) {
            // If the attendance exists, make a PUT request to update it
            const updateResponse = await fetch(
              "/api/post_students_attendance",
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );

            const updateResponseData = await updateResponse.json();
            if (updateResponse.ok) {
              alert("Attendance updated successfully!");
            } else {
              alert(updateResponseData.error || "Failed to update attendance");
            }
          } else {
            // If the attendance doesn't exist, make a POST request to insert it
            const postResponse = await fetch("/api/post_students_attendance", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });

            const postResponseData = await postResponse.json();
            if (postResponse.ok) {
              alert("Attendance submitted successfully!");
            } else {
              alert(postResponseData.error || "Failed to submit attendance");
            }
          }
        } else {
          alert("Error checking attendance existence");
        }
      } catch (error) {
        console.error("Error submitting attendance:", error);
        alert("Error submitting attendance");
      }
    } else {
      alert("Please select the current date and time period");
    }
  };

  const fetchresultyear = async () => {
    try {
      const response = await fetch(
        `/api/fetch_result_year?subjectCode=${subjectcode}&section=${section}`
      );
      const data = await response.json();
      //console.log(data);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const fetchflag = async () => {
    try {
      const response = await fetch(
        `/api/fetch_attendance_flag?date=${selectedDate}&timePeriod=${selectedTimePeriod}`
      );
      const data = await response.json();
      setFlag(data);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchresultyear();
    fetchflag();
    fetchstudentdetails();
    fetchdetailedreport();
  }, []);

  useEffect(() => {
    setFilteredStudents(
      students.filter(
        (student: { S_NAME: string }) =>
          // Check if the student's name is defined and is a string
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

  const filterStudentsByAttendance = (students: student[], filter: string) => {
    switch (filter) {
      case "above85":
        return students.filter((student) => student.AttendancePercentage > 85);
      case "75to85":
        return students.filter(
          (student) =>
            student.AttendancePercentage >= 75 &&
            student.AttendancePercentage <= 85
        );
      case "below75":
        return students.filter((student) => student.AttendancePercentage < 75);
      default:
        return students;
    }
  };

  const searchStudents = (students: student[], searchTerm: string) => {
    return students.filter((student) =>
      student.S_NAME.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    const filtered = filterStudentsByAttendance(students, attendanceFilter);
    setFilteredStudents(searchStudents(filtered, searchTerm));
    const search = searchStudents(students, searchTerm);
    SetSearchs(search);
    const { subjectcode, section } = decode(slug || "");
    SetCode(subjectcode);
    setSect(section);
  }, [attendanceFilter, searchTerm, students]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 w-full">
      <div className="flex space-x-4 mb-8">
        {["Student", "Attendance Marking", "Attendance Register"].map(
          (option) => (
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
          )
        )}
      </div>

      <div className="text-center">
        <p className="text-xl font-bold">Subject Code : {subjectcode}</p>
        <p className="text-xl font-bold">Section: {sect}</p>
        <p className="text-3xl font-bold">Student List</p>
      </div>

      {activeOption === "Student" && (
        <div className="w-full max-w-6xl overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-3 text-left">Sl No</th>
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
                    <td className="px-4 py-3">{index + 1}</td>
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
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => {
                const printContent =
                  document.querySelector(".w-full.max-w-6xl");
                const printWindow = window.open("", "", "width=800,height=600");
                if (printWindow && printContent) {
                  printWindow.document.write(`
                <html>
                <head>
                <title>Print</title>
                <style>
                  body { font-family: Arial, sans-serif; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid #ddd; padding: 8px; }
                  th { background-color: #f2f2f2; }
                </style>
                </head>
                <body>
                ${document.querySelector(".text-center")?.innerHTML}
                ${printContent.innerHTML}
                </body>
                </html>
                `);
                  printWindow.document.close();
                  printWindow.print();
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Print
            </button>
            <button
              onClick={() => {
                const csvContent = [
                  ["USN", "Name"],
                  ...students.map((student) => [student.USN, student.S_NAME]),
                ]
                  .map((e) => e.join(","))
                  .join("\n");

                const blob = new Blob([csvContent], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", "students_list.csv");
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
                <option className="bg-gray-800" value="9:00-9:55 am">
                  9:00 - 9:55 am
                </option>
                <option className="bg-gray-800" value="9:55-10:50 am">
                  9:55 - 10:50 am
                </option>
                <option className="bg-gray-800" value="11:10-12:05 pm">
                  11:10 - 12:05 pm
                </option>
                <option className="bg-gray-800" value="12:05-1:00 pm">
                  12:05 - 1:00 pm
                </option>
                <option className="bg-gray-800" value="1:45-2:40 pm">
                  1:45 - 2:40 pm
                </option>
                <option className="bg-gray-800" value="2:40-3:35 pm">
                  2:40 - 3:35 pm
                </option>
                <option className="bg-gray-800" value="3:35-4:30 pm">
                  3:35 - 4:30 pm
                </option>
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
                    <tr
                      key={student.USN + index}
                      className="border-t border-gray-200"
                    >
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
                  selectedDate !== new Date().toISOString().split("T")[0] ||
                  !selectedTimePeriod
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  selectedDate !== new Date().toISOString().split("T")[0] ||
                  !selectedTimePeriod
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
                <div className="min-h-screen bg-gray-50 w-full">
                  <div className="mx-auto p-6 w-full max-w-6xl">
                    {/* Content based on active report */}
                    {activeReport === "Consolidated Report" && (
                      <div className="min-h-screen bg-gray-50">
                        <div className="max-w-7xl mx-auto p-6">
                          {/* Class Information */}
                          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <p>
                              <strong>Course:</strong> {classInfo.subject}
                            </p>
                            <p>
                              <strong>Course ID:</strong>{" "}
                              {classInfo.subjectCode}
                            </p>
                            <p>
                              <strong>Faculty:</strong> {classInfo.faculty}
                            </p>
                          </div>

                          {/* Filters */}
                          <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                            <select
                              value={attendanceFilter}
                              onChange={(e) =>
                                setAttendanceFilter(e.target.value)
                              }
                              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="all">All Students</option>
                              <option value="above85">Above 85%</option>
                              <option value="75to85">75% - 85%</option>
                              <option value="below75">Below 75%</option>
                            </select>
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
                                {Array.isArray(studentdetails) &&
                                studentdetails.length > 0 ? (
                                  filterStudentsByAttendance(
                                    studentdetails,
                                    attendanceFilter
                                  )
                                    .filter(
                                      (student) =>
                                        student.Name !== null &&
                                        student.Name !== ""
                                    ) // Filter out rows where student.Name is null or empty
                                    .map((student, index) => (
                                      <tr
                                        key={student.USN + student.Name}
                                        className="border-t border-gray-200"
                                      >
                                        <td className="px-6 py-4">
                                          {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                          {student.usn}
                                        </td>
                                        <td className="px-6 py-4">
                                          {student.Name}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                          {student.TotalClassesHeld}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                          {student.ClassesAttended}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                          {student.AttendancePercentage}%
                                        </td>
                                      </tr>
                                    ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={6}
                                      className="px-6 py-4 text-center"
                                    >
                                      No data available
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {/* Print and Export Buttons */}
                        <div className="flex justify-end space-x-4 mt-8">
                          <button
                            onClick={() => window.print()}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg"
                          >
                            Print
                          </button>
                          <button
                            onClick={() => {
                              const csvContent = [
                                [
                                  "USN",
                                  "Name",
                                  "Total Classes Held",
                                  "Classes Attended",
                                  "Attendance Percentage",
                                ],
                                ...filterStudentsByAttendance(
                                  studentdetails,
                                  attendanceFilter
                                ).map((student) => [
                                  student.usn,
                                  student.Name,
                                  student.TotalClassesHeld,
                                  student.ClassesAttended,
                                  student.AttendancePercentage,
                                ]),
                              ]
                                .map((e) => e.join(","))
                                .join("\n");

                              const blob = new Blob([csvContent], {
                                type: "text/csv;charset=utf-8;",
                              });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.setAttribute("href", url);
                              link.setAttribute(
                                "download",
                                "attendance_report.csv"
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
                  </div>
                </div>
              )}

              {activeReport === "Detailed Report" && (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-200 text-center">
                    <thead>
                      <tr>
                        <th className="border border-gray-200 px-4 py-2">
                          Sl. No
                        </th>
                        <th className="border border-gray-200 px-4 py-2">
                          USN
                        </th>
                        <th className="border border-gray-200 px-4 py-2">
                          Name
                        </th>
                        {/* Dynamically generate headers for each unique Date-Time combination */}
                        {attendanceData.map((item) => (
                          <th
                            key={item.dateTimeKey}
                            className="border border-gray-200 px-4 py-2"
                          >
                            {new Date(item.date).toISOString().split("T")[0]}{" "}
                            <br /> {item.timePeriod}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Loop through each student */}
                      {students.map((student, index) => (
                        <tr
                          key={student.USN + index}
                          className="border-t border-gray-200"
                        >
                          <td className="border border-gray-200 px-4 py-2">
                            {index + 1}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {student.USN}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-left">
                            {student.S_NAME}
                          </td>
                          {/* Render the attendance for each unique Date-Time combination */}
                          {attendanceData.map((item) => {
                            // Find the attendance data for the current student and date-time combination
                            const studentForDateTime = item.attendance.find(
                              (attendance) => attendance.usn === student.USN
                            );

                            return (
                              <td
                                key={`${item.dateTimeKey}-${student.USN}`}
                                className="border border-gray-200 px-4 py-2"
                              >
                                {studentForDateTime
                                  ? studentForDateTime.status
                                  : "-"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      onClick={() => window.print()}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Print
                    </button>
                    <button
                      onClick={() => {
                        const csvContent = [
                          [
                            "USN",
                            "Name",
                            ...attendanceData.map(
                              (item) =>
                                `${
                                  new Date(item.date)
                                    .toISOString()
                                    .split("T")[0]
                                } ${item.timePeriod}`
                            ),
                          ],
                          ...students.map((student) => [
                            student.USN,
                            student.S_NAME,
                            ...attendanceData.map((item) => {
                              const studentForDateTime = item.attendance.find(
                                (attendance) => attendance.usn === student.USN
                              );
                              return studentForDateTime
                                ? studentForDateTime.status
                                : "-";
                            }),
                          ]),
                        ]
                          .map((e) => e.join(","))
                          .join("\n");

                        const blob = new Blob([csvContent], {
                          type: "text/csv;charset=utf-8;",
                        });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.setAttribute("href", url);
                        link.setAttribute(
                          "download",
                          "detailed_attendance_report.csv"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
