"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface ClassItemProps {
  subject: string;
  time: string;
}

const ClassItem: React.FC<ClassItemProps> = ({ subject, time }) => (
  <div className="bg-white rounded-lg  p-4 shadow-md hover:shadow-lg transition-shadow duration-200 mb-2 flex flex-col justify-center items-center min-h-[100px] h-full">
    <div className=" text-sm  font-semibold text-[#2D3748] text-center">{subject}</div>
    <div className="text-sm text-gray-500 text-center">{time}</div>
  </div>
);

const ExchangeClassModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentClass, setCurrentClass] = useState("");
  const [newClass, setNewClass] = useState("");
  const [exchangeDate, setExchangeDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Current Class:", currentClass);
    console.log("New Class:", newClass);
    console.log("Exchange Date:", exchangeDate);
    onClose(); // Close modal after submission
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto relative">
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        onClick={onClose}
      >
        &times;
      </button>

      {/* Modal Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Exchange Class</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Current Class Selector */}
        <div className="mb-4">
          <label
            htmlFor="currentClass"
            className="block text-gray-700 font-medium mb-2"
          >
            Current Class
          </label>
          <select
            id="currentClass"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentClass}
            onChange={(e) => setCurrentClass(e.target.value)}
          >
            <option value="">Select current class</option>
            <option value="math">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>

        {/* New Class Selector */}
        <div className="mb-4">
          <label
            htmlFor="newClass"
            className="block text-gray-700 font-medium mb-2"
          >
            New Class
          </label>
          <select
            id="newClass"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
          >
            <option value="">Select new class</option>
            <option value="biology">Biology</option>
            <option value="computerScience">Computer Science</option>
            <option value="english">English</option>
          </select>
        </div>

        {/* Exchange Date Selector */}
        <div className="mb-4">
          <label
            htmlFor="exchangeDate"
            className="block text-gray-700 font-medium mb-2"
          >
            Exchange Date
          </label>
          <input
            type="date"
            id="exchangeDate"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={exchangeDate}
            onChange={(e) => setExchangeDate(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition duration-200"
        >
          Confirm Exchange
        </button>
      </form>
    </div>
  );
};
const CancelClassModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
      <form>
        <div className="mb-4">
          <label
            htmlFor="extraClass"
            className="block text-gray-700 font-medium mb-2"
          >
            Class to Cancel
          </label>
          <select
            id="extraClass"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select class to cancel</option>
            <option value="math">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="extraDate"
            className="block text-gray-700 font-medium mb-2"
          >
            Date
          </label>
          <input
            type="date"
            id="extraDate"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="extraTime"
            className="block text-gray-700 font-medium mb-2"
          >
            Reason for Cancellation
          </label>
          <input
            type="text"
            id="extraTime"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg transition-all"
        >
          Confirm Cancellation
        </button>
      </form>
    </div>
  );
};
const AddExtraClassModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Add Extra Class</h2>
      </div>
      <form>
        <div className="mb-4">
          <label
            htmlFor="extraClass"
            className="block text-gray-700 font-medium mb-2"
          >
            Class Subject
          </label>
          <select
            id="extraClass"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select subject</option>
            <option value="math">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="extraDate"
            className="block text-gray-700 font-medium mb-2"
          >
            Date
          </label>
          <input
            type="date"
            id="extraDate"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="extraTime"
            className="block text-gray-700 font-medium mb-2"
          >
            Time
          </label>
          <input
            type="time"
            id="extraTime"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg transition-all"
        >
          Add Extra Class
        </button>
      </form>
    </div>
  );
};

const ClassManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [schedule, setSchedule] = useState({
    Monday: [
      { subject: "Mathematics", time: "09:00 AM - 10:30 AM" },
      { subject: "Physics", time: "11:00 AM - 12:30 PM" },
    ],
    Tuesday: [
      { subject: "English", time: "09:00 AM - 10:30 AM" },
      { subject: "Chemistry", time: "11:00 AM - 12:30 PM" },
    ],
    // Add other days similarly

    Wednesday: [
      { subject: "Biology", time: "09:00 AM - 10:30 AM" },
      { subject: "Computer Science", time: "11:00 AM - 12:30 PM" },
    ],
    Thursday: [
      { subject: "History", time: "09:00 AM - 10:30 AM" },
      { subject: "Geography", time: "11:00 AM - 12:30 PM" },
    ],
    Friday: [
      { subject: "Economics", time: "09:00 AM - 10:30 AM" },
      { subject: "Political Science", time: "11:00 AM - 12:30 PM" },
    ],
    Saturday: [
      { subject: "Philosophy", time: "09:00 AM - 10:30 AM" },
      { subject: "Sociology", time: "11:00 AM - 12:30 PM" },
    ],
    Sunday: [
      { subject: "Art", time: "09:00 AM - 10:30 AM" },
      { subject: "Music", time: "11:00 AM - 12:30 PM" },
    ],
  });

  const openModal = (content: JSX.Element) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekRange, setWeekRange] = useState<string>("");

  // Function to calculate the week range (Monday to Sunday) for a given date
  const calculateWeekRange = (date: Date): string => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);

    // Adjusting to get Monday and Sunday for the selected date
    const dayOfWeek = startOfWeek.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday (0) or other days
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);

    const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // Adjust for Sunday
    endOfWeek.setDate(endOfWeek.getDate() + diffToSunday);

    // Format the dates
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return `${startOfWeek.toLocaleDateString(
      "en-US",
      options
    )} - ${endOfWeek.toLocaleDateString("en-US", options)}`;
  };

  // Function to handle when a date is selected
  const handleDateChange = (date: Date | null) => {
      if (date) {
        setSelectedDate(date);
        setWeekRange(calculateWeekRange(date));
      }
    };

  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold">Class Management</h1>
        <p className="opacity-80 mt-2">
          Efficiently manage your class schedule
        </p>
      </header>

      <div className="flex gap-4 mb-6">
        <button
          className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-blue-600"
          onClick={() => openModal(<ExchangeClassModal onClose={closeModal} />)}
        >
          <i className="fas fa-exchange-alt"></i> Exchange Class
        </button>
        <button
          className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-green-600"
          onClick={() => openModal(<AddExtraClassModal onClose={closeModal} />)}
        >
          <i className="fas fa-plus-circle"></i> Add Extra Class
        </button>
        <button
          className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-red-600"
          onClick={() => openModal(<CancelClassModal onClose={closeModal} />)}
        >
          <i className="fas fa-times-circle"></i> Cancel Class
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Weekly Schedule</h2>

          <div className="relative">
            <button
              onClick={toggleCalendar}
              className="text-xl font-medium text-blue-500 hover:text-blue-700"
            >
              {weekRange || "Select a Week"}
            </button>

            {showCalendar && (
              <div className="absolute mt-2 bg-white shadow-lg p-4 rounded-lg z-10">
                <Calendar
                  onChange={(value) => handleDateChange(value as Date | null)}
                  value={selectedDate}
                  minDate={new Date("2020-01-01")}
                  maxDate={new Date("2030-12-31")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Schedule Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {Object.entries(schedule).map(([day, classes]) => (
            <div
              key={day}
              className="flex flex-col bg-[#f7fafc] p-4 rounded-lg shadow-md min-h-full"
            >
              <h3 className="font-semibold text-[#2D3748] mb-3">{day}</h3>
              {classes.map((classItem, index) => (
                <ClassItem
                  key={index}
                  subject={classItem.subject}
                  time={classItem.time}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-md">
            <button
              className="text-gray-500 float-right text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
