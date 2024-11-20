"use client";
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

// Class Information
const classInfo = {
  subject: "Mathematics",
  subjectCode: "22CSU109",
  department: "Computer Science Engineering",
  semester: 3,
  section: "A",
  faculty: "Balram Nayak",
  totalStudents: 4
};

const initialAttendanceData = [
  { id: 1, name: "Newton", usn: "1DA25CS001", classesHeld: 15, classesAttended: 15, status: "P", img: "/api/placeholder/40/40" },
  { id: 2, name: "Bose", usn: "1DA25CS002", classesHeld: 15, classesAttended: 13, status: "P", img: "/api/placeholder/40/40" },
  { id: 3, name: "Einstein", usn: "1DA25CS003", classesHeld: 15, classesAttended: 12, status: "A", img: "/api/placeholder/40/40" },
  { id: 4, name: "Rutherford", usn: "1DA25CS004", classesHeld: 15, classesAttended: 10, status: "A", img: "/api/placeholder/40/40" },
];

export default function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState(initialAttendanceData);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAbsentees, setShowAbsentees] = useState(false);
  const [attendanceFilter, setAttendanceFilter] = useState("all"); // "all", "above85", "75to85", "below75"

  const filteredStudents = attendanceData.filter((student) => {
    const usnLastThreeDigits = student.usn.slice(-3);
    const attendancePercentage = (student.classesAttended / student.classesHeld) * 100;
    
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usnLastThreeDigits.includes(searchTerm);

    let matchesAttendance = true;
    if (attendanceFilter === "above85") {
      matchesAttendance = attendancePercentage >= 85;
    } else if (attendanceFilter === "75to85") {
      matchesAttendance = attendancePercentage >= 75 && attendancePercentage < 85;
    } else if (attendanceFilter === "below75") {
      matchesAttendance = attendancePercentage < 75;
    }

    return matchesSearch && matchesAttendance;
  });

  const displayedStudents = showAbsentees
    ? filteredStudents.filter(student => student.status === "A")
    : filteredStudents;

  const isTodaySelected = selectedDate === new Date().toISOString().split('T')[0];

  const getAttendanceColor = (percentage : any) => {
    if (percentage >= 85) return 'bg-green-100 text-green-600';
    if (percentage >= 75) return 'bg-orange-100 text-orange-600';
    return 'bg-red-100 text-red-600';
  };

  const formatDate = (dateString : any) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const handleStatusToggle = (studentId : any) => {
    setAttendanceData((prevData) =>
      prevData.map((student) => {
        if (student.id === studentId) {
          const updatedStatus = student.status === "P" ? "A" : "P";
          const updatedClassesAttended =
            updatedStatus === "P" ? student.classesAttended + 1 : student.classesAttended - 1;

          return {
            ...student,
            status: updatedStatus,
            classesAttended: updatedClassesAttended,
          };
        }
        return student;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>
        
        {/* Class Information Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 font-bold ">Subject: <span className="font-medium">{classInfo.subject}</span></p>
              <p className="text-gray-600 font-bold">Subject Code: <span className="font-medium">{classInfo.subjectCode}</span></p>
            </div>
            <div>
              <p className="text-gray-600 font-bold">Department: <span className="font-medium">{classInfo.department}</span></p>
              <p className="text-gray-600 font-bold">Semester: <span className="font-medium">{classInfo.semester}</span> | Section: <span className="font-medium">{classInfo.section}</span></p>
            </div>
            <div>
              <p className="text-gray-600 font-bold">Faculty: <span className="font-medium">{classInfo.faculty}</span></p>
              <p className="text-gray-600 font-bold">Total Students: <span className="font-medium">{classInfo.totalStudents}</span></p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            />
            <div className="absolute top-full mt-1 text-sm text-gray-600">
              {formatDate(selectedDate)}
            </div>
          </div>

          <div className="flex gap-4 items-center">
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
                placeholder="Search students.."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-2 rounded-full border border-gray-300 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-2 rounded-lg mb-6 flex justify-between items-center">
          <div></div>
          <button
            onClick={() => setShowAbsentees(!showAbsentees)}
            className="bg-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            {showAbsentees ? 'Show All' : 'Show Absentees'}
          </button>
        </div>

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
              {displayedStudents.map((student, index) => {
                const attendancePercentage = ((student.classesAttended / student.classesHeld) * 100).toFixed(1);
                return (
                  <tr key={student.id} className="border-t border-gray-200">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{student.usn}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4 text-center">{student.classesHeld}</td>
                    <td className="px-6 py-4 text-center">{student.classesAttended}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full ${getAttendanceColor(attendancePercentage)}`}>
                        {attendancePercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isTodaySelected ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={student.status === "P"}
                            onChange={() => handleStatusToggle(student.id)}
                            className="sr-only peer"
                          />
                          <div className="w-16 h-8 bg-red-500 peer-checked:bg-green-500 rounded-full after:content-['A'] after:absolute after:top-1 after:start-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:flex after:items-center after:justify-center after:transition-all peer-checked:after:translate-x-8 peer-checked:after:content-['P']" />
                        </label>
                      ) : (
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${student.status === "P" ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                          {student.status}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-center gap-8 mb-6">
          <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
            Present: <span className="text-green-600 font-bold">{attendanceData.filter(d => d.status === "P").length}</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
            Absent: <span className="text-red-500 font-bold">{attendanceData.filter(d => d.status === "A").length}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Export
          </button>
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}