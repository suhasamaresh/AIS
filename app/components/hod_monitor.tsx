"use client";
import React, { useEffect, useState } from "react";
interface AttendanceDetail {
  faculty_id: string;
  facultyName: string;
  Date: string;
  timePeriod: string;
  classesMarked: string;
  sub_code: string;
}

const Hodmonitor = () => {
  const [attendData, setAttendData] = useState<AttendanceDetail[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [load, setLoad] = useState<boolean>(true);
  // Fetch attendance data from the backend
  const fetchAttendanceData = async (date: string) => {
    try {
      const response = await fetch(
        `/api/faculty_attendance?date=${date}&brcode=CS`
      );
      const data = await response.json();
      setAttendData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    // Fetch attendance data for the current date when the component mounts
    console.log("hello");
    fetchAttendanceData(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
      // Fetch attendance data for the current date when the component mounts
      console.log("hello");
      fetchAttendanceData(selectedDate);
    }, [selectedDate]);
  
    const resetflag = async (
      faculty_id: string,
      date: string,
      timePeriod: string,
      sub_code: string
    ) => {
      try {
        const data = {
          facultyId: faculty_id,
          date: date,
          timePeriod: timePeriod,
          subjectcode: sub_code,
        };
        const response = await fetch(`/api/reset_flag`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        alert("Flag reset successfully");
      } catch (error) {
        console.error("Error resetting flag:", error);
      }
    };
  
    // Handle date change to fetch attendance for the new date
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedDate(event.target.value);
    };
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Title */}
      <div className="text-center mt-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          HOD Attendance Dashboard
        </h1>
      </div>

      {/* Date Picker */}
      <div className="text-center mb-8">
        <label htmlFor="date-picker" className="mr-2">
          Select Date:
        </label>
        <input
          type="date"
          id="date-picker"
          value={selectedDate}
          onChange={handleDateChange}
          className="border rounded px-2 py-1"
        />
      </div>

      {/* Attendance Table Section */}
      <div className="overflow-x-auto mx-auto max-w-7xl px-8">
        {load ? (
          <div className="text-center">
            <p>Loading attendance data...</p>
          </div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Faculty ID</th>
                <th className="py-2 px-4 border-b">Faculty Name</th>
                <th className="py-2 px-4 border-b">Subject Code</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Time Period</th>
                <th className="py-2 px-4 border-b">Attendance Status</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {attendData.map((attendance) => (
                <tr
                  key={`${attendance.faculty_id}-${attendance.Date}-${attendance.timePeriod}`}
                >
                  <td className="py-2 px-4 border-b">
                    {attendance.faculty_id}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {attendance.facultyName}
                  </td>
                  <td className="py-2 px-4 border-b">{attendance.sub_code}</td>
                  <td className="py-2 px-4 border-b">
                    {attendance.Date.split("T")[0]}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {attendance.timePeriod}
                  </td>
                  <td
                    className={`py-2 px-4 border-b ${
                      attendance.classesMarked === "true"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {attendance.classesMarked === "true"
                      ? "Attendance Marked"
                      : "No Attendance Marked"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() =>
                        resetflag(
                          attendance.faculty_id,
                          attendance.Date,
                          attendance.timePeriod,
                          attendance.sub_code
                        )
                      }
                    >
                      Enable to Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Hodmonitor;
