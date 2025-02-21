import Link from 'next/link';
import React, {useState } from 'react'
import { usePathname } from 'next/navigation';
// import { useTranslation } from 'react-i18next';
import {
    FaHome,
    FaDiagnoses ,
} from 'react-icons/fa';
import { TbReportMedical } from "react-icons/tb";
import { FaUserDoctor } from "react-icons/fa6";
import { BsPersonCheckFill } from "react-icons/bs";

function SideNavbar( {isCollapsed} ) {
    const [activeSection, setActiveSection] = useState('');
    const location = usePathname();
    // const { t } = useTranslation();
    const menuItems = [
        {
            path: '/dashboard',
            name: 'dashboard',
            icon: FaHome
        },
        {
            path: '/dashboard/diagnos',
            name: 'Get Diagnosis Report',
            icon: FaDiagnoses
        },
        {
            path: '/dashboard/symptomChecker',
            name: 'Check Symptoms',
            icon: BsPersonCheckFill
        },
        {
            path: '/dashboard/generateReport',
            name: 'Generate Report',
            icon: TbReportMedical
        },
        {
            path: '/dashboard/findDoctor',
            name: 'Find Doctor',
            icon: FaUserDoctor
        },
    ];
    const handleMouseEnter = (title) => {
        setActiveSection(title);
    };

    const handleMouseLeave = () => {
        setActiveSection('');
    };

    const handleItemClick = (path) => {
        navigate(path);
        handleMouseLeave();
    };
    return (
        <>
            {menuItems.map((item) => {
                const isActive = location === item.path;
                const Icon = item.icon;
                // const translatedName = t(`sidebar.${item.name}`);
                const translatedName = item.name;

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        onMouseEnter={() => handleMouseEnter(translatedName)}
                        onMouseLeave={handleMouseLeave}
                        className={`flex items-center p-3 rounded-xl transition-all duration-200 
                                    group relative cursor-pointer
                                    ${isActive
                                ? 'bg-white bg-opacity-20 text-white shadow-lg'
                                : 'text-white hover:bg-white hover:bg-opacity-10'
                            }`}
                    >
                        <Icon className={`text-xl ${isActive ? 'text-pink-300' :
                            'text-white group-hover:text-pink-300'}`} />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium">{translatedName}</span>
                        )}

                        {/* Tooltip */}
                        {isCollapsed && (
                            <div
                                className={`absolute left-full ml-2 px-3 py-2 bg-white 
                                            rounded-lg shadow-lg transition-opacity duration-200 
                                            whitespace-nowrap z-50
                                            ${activeSection === translatedName ? 'opacity-100' :
                                        'opacity-0 pointer-events-none'}`}
                            >
                                <p className="font-medium text-gray-800">{translatedName}</p>
                            </div>
                        )}
                    </Link>
                );
            })}
        </>
    )
}

export default SideNavbar