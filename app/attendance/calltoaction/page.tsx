import React from "react";

const App: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
        
        </div>
      </nav>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <header className="gradient-bg rounded-lg shadow-lg text-white p-6 mb-8 bg-gradient-to-r from-[#667EEA] to-[#764BA2]">
          <h1 className="text-2xl font-semibold">Call to Action</h1>
          <div className="text-sm opacity-80 mt-2">Important Actions and Notifications</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Attendance Below 75% */}
          <Card
            bgColor="bg-red-100"
            title="Low Attendance Alert"
            titleColor="text-red-800"
            icon="fa-exclamation-triangle"
            iconColor="text-red-600"
            description="Students with attendance below 75%"
            buttonText="Take Action"
            buttonColor="bg-red-500"
            buttonHoverColor="hover:bg-red-600"
            listItems={[
              { name: "John Doe", status: "65%", color: "text-red-600" },
              { name: "Jane Smith", status: "70%", color: "text-red-600" },
            ]}
          />

          {/* Pending Approvals */}
          <Card
            bgColor="bg-yellow-100"
            title="Pending Approvals"
            titleColor="text-yellow-800"
            icon="fa-clock"
            iconColor="text-yellow-600"
            description="Leave requests pending approval"
            buttonText="Review Requests"
            buttonColor="bg-yellow-500"
            buttonHoverColor="hover:bg-yellow-600"
            listItems={[
              { name: "Sarah Johnson", status: "2 days", color: "text-yellow-600" },
              { name: "Mike Brown", status: "1 day", color: "text-yellow-600" },
            ]}
          />

          {/* Upcoming Events */}
          <Card
            bgColor="bg-blue-100"
            title="Upcoming Events"
            titleColor="text-blue-800"
            icon="fa-calendar"
            iconColor="text-blue-600"
            description="Important dates and events"
            buttonText="View Calendar"
            buttonColor="bg-blue-500"
            buttonHoverColor="hover:bg-blue-600"
            listItems={[
              { name: "Mid-term Exam", status: "Oct 15", color: "text-blue-600" },
              { name: "Parent Meeting", status: "Oct 20", color: "text-blue-600" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  bgColor: string;
  title: string;
  titleColor: string;
  icon: string;
  iconColor: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  buttonHoverColor: string;
  listItems: { name: string; status: string; color: string }[];
}

const Card: React.FC<CardProps> = ({
  bgColor,
  title,
  titleColor,
  icon,
  iconColor,
  description,
  buttonText,
  buttonColor,
  buttonHoverColor,
  listItems,
}) => (
  <div className={`card ${bgColor} rounded-lg p-6 shadow-lg`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className={`text-lg font-semibold ${titleColor}`}>{title}</h3>
      <span className={iconColor}>
        <i className={`fas ${icon}`}></i>
      </span>
    </div>
    <p className={`${titleColor} mb-4`}>{description}</p>
    <div className="bg-white rounded-lg p-4 shadow">
      <ul className="space-y-2">
        {listItems.map((item, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{item.name}</span>
            <span className={item.color}>{item.status}</span>
          </li>
        ))}
      </ul>
    </div>
    <button
      className={`mt-4 w-full ${buttonColor} ${buttonHoverColor} text-white rounded-lg py-2 px-4`}
    >
      {buttonText}
    </button>
  </div>
);

export default App;
