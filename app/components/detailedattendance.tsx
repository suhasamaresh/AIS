"use client";

import React, { useState } from "react";
import { format, subDays } from "date-fns";

const classesHeld = 100;

const sampleStudents = Array.from({ length: 50 }, (_, index) => {
    const classesAttended = Math.floor(Math.random() * classesHeld); // Random attendance
    const attendancePercentage = ((classesAttended / classesHeld) * 100).toFixed(2); // Calculate percentage

    return {
        usn: `1DA22CS${String(index + 1).padStart(3, "0")}`,
        name: [
            "Aarav Sharma",
            "Ananya Verma",
            "Rohit Gupta",
            "Ishita Mishra",
            "Vikram Reddy",
            "Meera Nair",
            "Rohan Mehta",
            "Tanya Desai",
            "Siddharth Rao",
            "Kavya Patel",
            "Aditya Joshi",
            "Ria Kapoor",
            "Arjun Bhatia",
            "Sneha Jain",
            "Aakash Iyer",
            "Priya Roy",
            "Nikhil Shetty",
            "Divya Singh",
            "Karan Malhotra",
            "Neha Kulkarni",
            "Aryan Choudhary",
            "Pooja Das",
            "Harsh Vyas",
            "Simran Agarwal",
            "Dhruv Saxena",
            "Naina Bansal",
            "Rahul Kumar",
            "Shruti Narang",
            "Varun Pillai",
            "Radhika Goswami",
            "Pranav Gupta",
            "Sanya Bhargava",
            "Vivek Shukla",
            "Tanvi Dubey",
            "Arvind Nambiar",
            "Ira Pandey",
            "Kartik Venkatesh",
            "Swati Tripathi",
            "Kabir Chauhan",
            "Aditi Ghosh",
            "Nitin Thakur",
            "Payal Bhardwaj",
            "Rajesh Khatri",
            "Seema Sethi",
            "Yash Sharma",
            "Anjali Saxena",
            "Omkar Purohit",
            "Sahil Aggarwal",
            "Pooja Nair",
            "Harini Kaur",
        ][index % 50],
        status: "P",
        classesHeld,
        classesAttended,
        attendancePercentage,
    };
});

// Generate random attendance for 50 days
const generateAttendanceForDays = (days: number) =>
    sampleStudents.map((student) => ({
        ...student,
        attendance: Array.from({ length: days }, () =>
            Math.random() > 0.5 ? "P" : "A" // Randomly assign Present or Absent
        ),
    }));

const studentsWithAttendance = generateAttendanceForDays(50);

// Generate dates for the last 50 days
const generateLastNDates = (n: number) => {
    const dates = [];
    for (let i = 0; i < n; i++) {
        dates.push(format(subDays(new Date(), i), "yyyy-MM-dd"));
    }
    return dates.reverse();
};

const last50Days = generateLastNDates(50);

export default function AttendanceTable() {
    const [students] = useState(studentsWithAttendance);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Attendance Tracker</h1>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="table-auto border-collapse w-full text-sm">
                    <thead className="bg-blue-600 text-white sticky top-0">
                        <tr>
                            <th className="px-4 py-2 text-left border">SL NO</th>
                            <th className="px-4 py-2 text-left border">USN</th>
                            <th className="px-4 py-2 text-left border">Name</th>
                            {/* Dynamically generate headers for the last 50 days */}
                            {last50Days.map((date, dayIndex) => (
                                <th
                                    key={dayIndex}
                                    className="px-4 py-2 text-center border whitespace-nowrap"
                                >
                                    {date}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, studentIndex) => (
                            <tr
                                key={studentIndex}
                                className={`${
                                    studentIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
                                } hover:bg-blue-50`}
                            >
                                <td className="px-4 py-2 border">{studentIndex + 1}</td>
                                <td className="px-4 py-2 border">{student.usn}</td>
                                <td className="px-4 py-2 border">{student.name}</td>
                                {/* Render attendance for the last 50 days */}
                                {student.attendance.map((status, dayIndex) => (
                                    <td
                                        key={dayIndex}
                                        className={`px-4 py-2 border text-center ${
                                            status === "P" ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        {status}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
