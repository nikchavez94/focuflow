// focuflow/frontend/src/components/Sidebar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HomeIcon, ViewColumnsIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout().then(() => {
      navigate('/login');
    });
  };

  return (
    // The 'group' class is the key. It allows child elements to change
    // style when the PARENT is hovered.
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex flex-col transition-transform duration-300 ease-in-out -translate-x-56 hover:translate-x-0 group z-50">
      
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">FocusFlow</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-2">
        <ul>
          {user ? (
            <>
              <li className="mb-2">
                <Link to="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                  <HomeIcon className="h-6 w-6 mr-3" />
                  Dashboard
                </Link>
              </li>
              
               {/* --- THIS IS THE MISSING LINK --- */}
              <li className="mb-2">
                <Link to="/calendar" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                  <CalendarDaysIcon className="h-6 w-6 mr-3" />
                  Calendar
                </Link>
              </li>
              {/* ------------------------------- */}

              {/* We can add a link to the Kanban board later */}
              <li className="mb-2">
                <Link to="/settings" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                  <Cog6ToothIcon className="h-6 w-6 mr-3" />
                  Settings
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="mb-2">
                <Link to="/login" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                  Login
                </Link>
              </li>
               <li className="mb-2">
                <Link to="/signup" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Logout Button at the bottom */}
      {user && (
        <div className="p-2 border-t border-gray-700">
          <button onClick={handleLogout} className="flex items-center w-full p-2 rounded-md hover:bg-red-500">
            <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
            Logout
          </button>
        </div>
      )}
      
       {/* Handle to show the sidebar on hover */}
       <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-6 h-20 bg-gray-800 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default Sidebar;