import React, { useState } from 'react';
import {
    FaHome,
    FaChild,
    FaBook,
    FaCalendarDay,
    FaChartLine,
    FaQuestion,
    FaBrain,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaHeart,
    FaStar,
    FaMedal,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';
import SideNavbar from './SideNavbar';
// import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, onToggle }) => {
    // const { logout } = useAuth();
    const [activeSection, setActiveSection] = useState('');

    return (
        <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-600 to-blue-800 
            transition-all duration-300 ease-in-out z-50 flex flex-col
            ${isCollapsed ? 'w-20' : 'w-64'}`}>

            {/* Header Section */}
            <div className="flex-none p-4">
                <div className="flex items-center justify-between mb-6">
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold text-white">AI Diagnos</h1>
                    )}
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {isCollapsed ? <FaChevronRight className="text-white" /> :
                            <FaChevronLeft className="text-white" />}
                    </button>
                </div>
            </div>

            {/* Scrollable Navigation Menu */}
            <nav className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
                <div className="space-y-2">
                    <SideNavbar isCollapsed={isCollapsed}/>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;