"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
    const [time, setTime] = useState<string>(new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }));

    const [date, setDate] = useState<string>(new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    }));

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <img src="/api/placeholder/50/50" alt="Institute Logo" className="h-12 w-12" />
                            <div className="ml-4">
                                <h1 className="text-xl font-semibold text-gray-800">
                                    Dr. AMBEDKAR INSTITUTE OF TECHNOLOGY
                                </h1>
                                <p className="text-sm text-gray-600">{time}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-8">
                            <a href="index.html" className="nav-link px-3 py-2 rounded-md">Dashboard</a>
                            <a href="2_AttendanceMarking.html" className="nav-link px-3 py-2 rounded-md">Attendance</a>
                            <a href="3_ClassWise.html" className="nav-link px-3 py-2 rounded-md">Report</a>
                            <a href="7_ClassManagement.html" className="nav-link px-3 py-2 rounded-md">Class Management</a>
                            <div className="flex items-center">
                                <img src="/api/placeholder/40/40" alt="Profile" className="h-10 w-10 rounded-full" />
                                <span className="ml-2">DR. ABC</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Welcome, Dr. ABC</h2>
                    <div className="gradient-bg text-white p-6 rounded-lg mt-4 bg-gradient-to-r from-[#4e54c8] to-[#8f94fb]">
                        <h3 className="text-2xl font-semibold">Faculty Attendance Dashboard</h3>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div className="text-gray-600">{date}</div>
                    <div className="text-gray-600">{time}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/attendance/facsubjects" className="card bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-8 text-center cursor-pointer">
                        <h3 className="text-xl font-semibold">Attendance Marking</h3>
                    </Link>
                    <Link href="/facultyreport" className="card bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-8 text-center cursor-pointer">
                        <h3 className="text-xl font-semibold">Report</h3>
                    </Link>
                    <Link href="/classmanagement" className="card bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-8 text-center cursor-pointer">
                        <h3 className="text-xl font-semibold">Class Management</h3>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
