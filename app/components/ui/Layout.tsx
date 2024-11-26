import React, { useState } from 'react';
import Header from '../ui/Header';
import HorizontalNavbarAdmission from '../ui/navigation_bar/admission'; // Admission Navbar
//import HorizontalNavbarAccounts from '../ui/navigation_bar/accounts'; // Accounts Navbar
import { useUser } from '../../context/usercontext';

interface LayoutProps {
  children: React.ReactNode;
  moduleType: 'admission' | 'accounts'; // Add module type prop
}

const Layout: React.FC<LayoutProps> = ({ children, moduleType }) => {
  const { user, setUser } = useUser();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Choose the Navbar based on moduleType
  const getNavbar = () => {
    if (moduleType === 'admission') {
      return <HorizontalNavbarAdmission />;
    }
    /* if (moduleType === 'accounts') {
      return <HorizontalNavbarAccounts />;
    } */
    return null;
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} /> 
      
      {/* Horizontal Navbar - Below Header */}
      <nav className="bg-blue-600 text-white shadow-md sticky top-20 z-40">
        {getNavbar()}
      </nav>
      
      {/* Main Content Area */}
      <div className="flex flex-grow mt-24"> {/* Adjusted margin-top for space below navbar */}
        <main className="flex flex-grow bg-gray-0 duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;