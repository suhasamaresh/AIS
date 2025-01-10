"use client";
import React from "react";
import { useState, useEffect } from "react";
import Hodmonitor from "@/app/components/hod_monitor";
import AttendanceDashboard from "@/app/components/hod_view_attendance";
import AttendanceTable from "@/app/components/condonation";
import CondonationStatus from "@/app/components/nsastudents";

const page = () => {
  const [activeOption, setActiveOption] = React.useState("Monitor Attendance");
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 w-full">
      <div className=" mb-8 flex space-x-4">
        {[
          "Monitor Attendance",
          "View Attendance",
          "Attendance Condonation",
          "NSA List",
        ].map((option) => (
          <button
            key={option}
            onClick={() => setActiveOption(option)}
            className={`px-6 py-3 text-sm font-medium rounded-lg border transition-all duration-300 ${
              activeOption === option
                ? "bg-blue-500 text-white border-blue-500 "
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {activeOption === "Monitor Attendance" && (<Hodmonitor />)}
      {activeOption === "View Attendance" && (<AttendanceDashboard />)}
      {activeOption === "Attendance Condonation" && (<AttendanceTable/>)}
      {activeOption === "NSA List" && (<CondonationStatus/>)}
    </div>
  );
};

export default page;
