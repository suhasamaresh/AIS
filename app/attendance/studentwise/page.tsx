"use client";
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // For the search icon
import { useRouter } from 'next/navigation'; // For navigation

const AttendanceReports: React.FC = () => {
  const [section, setSection] = useState('CSE-A'); // Default to CSE-A
  const [clickedCard, setClickedCard] = useState<string | null>(null); // To track clicked card
  const [searchQuery, setSearchQuery] = useState(''); // State to track search query
  const router = useRouter();

  const students = [
    {
      name: 'Issac Newton',
      usn: '1DA22CS192',
      attendance: 91,
      imageUrl: 'https://example.com/image-newton.jpg', // Example image URL
    },
    {
      name: 'Satyendra Nath Bose',
      usn: '1DA25CS187',
      attendance: 76,
      imageUrl: 'https://example.com/image-bose.jpg', // Example image URL
    },
    {
      name: 'Albert Einstein',
      usn: '1DA20CS185',
      attendance: 67,
      imageUrl: 'https://example.com/image-einstein.jpg', // Example image URL
    },
    {
      name: 'Marie Curie',
      usn: '1DA22CS101',
      attendance: 88,
      imageUrl: 'https://example.com/image-curie.jpg', // Example image URL
    },
    {
      name: 'Nikola Tesla',
      usn: '1DA21CS150',
      attendance: 95,
      imageUrl: 'https://example.com/image-tesla.jpg', // Example image URL
    },
  ];

  // Function to get background color for attendance text
  const getAttendanceBgColor = (attendance: number) => {
    if (attendance > 85) return 'bg-green-500';
    if (attendance >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleSectionClick = (sectionName: string) => {
    setSection(sectionName);
  };

  const handleCardClick = (studentName: string) => {
    setClickedCard(studentName); // Track clicked card
    router.push(`/faculty/mentors/attendance/${studentName.replace(' ', '').toLowerCase()}`);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Filter by name
      student.usn.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by USN
  );

  return (
    <div>
      <div className="p-6 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-3xl text-purple-800 mb-4 text-center">Attendance Reports</h1>

        {/* Sub Title */}
        <h2 className="text-2xl text-violet-500 mb-6 text-center">Student wise attendance report</h2>

        {/* Search Bar */}
        <div className="relative w-full max-w-7xl mb-6 px-4"> {/* Added px-4 for padding */}
          <input
            type="text"
            placeholder="Enter USN or Student Name"
            className="w-full p-3 pl-5 pr-10 border rounded-full shadow-lg focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaSearch />
          </div>
        </div>

        {/* Section Buttons */}
        <div className="flex space-x-4 mb-6">
          {['CSE-A', 'CSE-B', 'CSE-C', 'CSE-D'].map((sec) => (
            <button
              key={sec}
              className={`px-6 py-2 rounded-full border-2 bg-gradient-to-br from-blue-900 to-blue-300 ${
                section === sec ? 'bg-white text-blue-500' : 'text-white'
              } border-blue-500`}
              onClick={() => handleSectionClick(sec)}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Student Cards */}
        {section && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <div
                  key={index}
                  className={`border p-4 rounded-lg shadow-lg flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-105 ${
                    clickedCard === student.name ? 'bg-white' : ''
                  }`}
                  style={{ width: '200px', height: '300px' }} // Fixed width and height for each card
                  onClick={() => handleCardClick(student.name)}
                >
                  {/* Student Image */}
                  <img
                    src={student.imageUrl}
                    alt={`${student.name}'s photo`}
                    className="w-20 h-20 rounded-full mb-4 object-cover"
                  />

                  {/* Student Info */}
                  <h3 className="text-xl font-semibold mb-2">{student.name}</h3>
                  <p className="text-gray-600 mb-2">USN: {student.usn}</p>

                  {/* Attendance with rounded background color */}
                  <div className="flex items-center space-x-2">
                    <p className="text-lg text-gray-600">Overall:</p>
                    <p
                      className={`text-lg font-bold text-white px-3 py-1 rounded-full ${getAttendanceBgColor(
                        student.attendance
                      )}`}
                    >
                      {student.attendance}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-5">
                No students match the search criteria.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReports;
