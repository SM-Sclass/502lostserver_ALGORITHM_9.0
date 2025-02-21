'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

function Layout({ children }) {
    const [mounted, setMounted] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('sidebarCollapsed');
        if (saved !== null) {
            setIsCollapsed(JSON.parse(saved));
        }
    }, []);

    const handleToggleSidebar = () => {
        const newValue = !isCollapsed;
        setIsCollapsed(newValue);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newValue));
    };

    if (!mounted) {
        return null; // or a loading spinner
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden max-w-full">
            <Sidebar
                isCollapsed={isCollapsed}
                onToggle={handleToggleSidebar}
            />
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} overflow-auto`}>
                <Navbar />
                <div className="p-5 mt-5">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Layout;

