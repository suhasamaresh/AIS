"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface ClassItemProps {
  id: number;
  subject: string;
  time: string;
  courseName: string;
}

const ClassItem: React.FC<ClassItemProps> = ({ subject, time, courseName }) => (
  <div className="bg-white rounded-md p-2 shadow-sm flex flex-col justify-center items-center text-center h-[80px] w-[80px]">
    <div className="text-xs font-semibold text-[#2D3748] truncate">{subject}</div>
    <div className="text-xs text-gray-500">{time}</div>
    <div className="text-xs text-gray-400 italic truncate">{courseName}</div>
  </div>
);

const AddClassModal: React.FC<{ onClose: () => void; onAdd: (data: any) => void }> = ({ onClose, onAdd }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time && subject) {
      onAdd({ date, time, subject });
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Add New Class</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
            Time
          </label>
          <input
            type="time"
            id="time"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md transition-all"
        >
          Add Class
        </button>
      </form>
    </div>
  );
};

const CancelClassModal: React.FC<{ onClose: () => void; onCancel: (id: number) => void }> = ({ onClose, onCancel }) => {
  const [classId, setClassId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classId) {
      onCancel(Number(classId));
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Cancel Class</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="classId" className="block text-gray-700 font-medium mb-2">
            Class ID
          </label>
          <input
            type="number"
            id="classId"
            required
            placeholder="Enter Class ID"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold shadow-md transition-all"
        >
          Cancel Class
        </button>
      </form>
    </div>
  );
};

const ClassManagement: React.FC = () => {
  const [schedule, setSchedule] = useState<Record<string, ClassItemProps[]>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekRange, setWeekRange] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const courseId = "1"; // Replace this with dynamic courseId if available

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`/api/faculty/classes?courseId=${courseId}`);
        const data = await response.json();

        if (response.ok) {
          const formattedSchedule: Record<string, ClassItemProps[]> = {};

          data.forEach((classItem: any) => {
            const classDate = new Date(classItem.date);
            const day = classDate.toLocaleDateString("en-US", { weekday: "long" });

            if (!formattedSchedule[day]) formattedSchedule[day] = [];
            formattedSchedule[day].push({
              id: classItem.id,
              subject: classItem.subject,
              time: classItem.time,
              courseName: classItem.courseName,
            });
          });

          setSchedule(formattedSchedule);
        } else {
          console.error("Failed to fetch classes:", data.error);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [courseId]);

  const addClass = async (newClass: any) => {
    try {
      const response = await fetch(`/api/faculty/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newClass, courseId }),
      });

      if (response.ok) {
        alert("Class added successfully!");
      } else {
        console.error("Failed to add class.");
      }
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  const cancelClass = async (classId: number) => {
    try {
      const response = await fetch(`/api/faculty/classes?classId=${classId}&courseId=${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Class canceled successfully!");
        setSchedule((prevSchedule) => {
          const updatedSchedule = { ...prevSchedule };
          for (const day in updatedSchedule) {
            updatedSchedule[day] = updatedSchedule[day].filter((item) => item.id !== classId);
          }
          return updatedSchedule;
        });
      } else {
        console.error("Failed to cancel class.");
      }
    } catch (error) {
      console.error("Error canceling class:", error);
    }
  };

  const calculateWeekRange = (date: Date): string => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${startOfWeek.toLocaleDateString("en-US", options)} - ${endOfWeek.toLocaleDateString(
      "en-US",
      options
    )}`;
  };

  useEffect(() => {
    setWeekRange(calculateWeekRange(selectedDate));
  }, [selectedDate]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold">Class Management</h1>
        <p className="opacity-80 mt-2">Efficiently manage your class schedule</p>
      </header>

      <div className="flex gap-4 mb-6">
        <button
          className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-green-600"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Class
        </button>
        <button
          className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-red-600"
          onClick={() => setIsCancelModalOpen(true)}
        >
          Cancel Class
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Weekly Schedule</h2>
          <button onClick={() => setShowCalendar(!showCalendar)} className="text-blue-500">
            {weekRange || "Select a Week"}
          </button>
        </div>

        {showCalendar && (
          <div className="absolute mt-2 bg-white shadow-lg p-4 rounded-lg z-10">
            <Calendar value={selectedDate} onChange={(date) => setSelectedDate(date as Date)} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 mt-4">
          {Object.entries(schedule).map(([day, classes]) => (
            <div
              key={day}
              className="bg-gray-100 rounded-lg p-4 shadow-md grid grid-cols-5 gap-2"
            >
              <h3 className="col-span-full text-lg font-semibold text-center mb-4">{day}</h3>
              {classes.map((classItem) => (
                <ClassItem
                  key={classItem.id}
                  id={classItem.id}
                  subject={classItem.subject}
                  time={classItem.time}
                  courseName={classItem.courseName}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {isAddModalOpen && <AddClassModal onClose={() => setIsAddModalOpen(false)} onAdd={addClass} />}
      {isCancelModalOpen && <CancelClassModal onClose={() => setIsCancelModalOpen(false)} onCancel={cancelClass} />}
    </div>
  );
};

export default ClassManagement;
