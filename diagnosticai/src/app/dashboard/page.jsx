'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaStethoscope, FaUserMd, FaChartLine, FaHistory, FaCheckCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';

const fetchUser = async () => {
  try {
      const response = await fetch('/api/auth/user');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.data;
  } catch (error) {
      throw new Error('An error occurred while fetching user data');
  }
}
export default function DashboardPage() {
  const { data: userData, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    select: (data) => data,
});

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError || !userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Feature Highlights */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
                    >
                        {[
                            {
                                icon: FaStethoscope,
                                title: "AI-Powered Diagnosis",
                                description: "Get instant analysis of medical reports using advanced AI"
                            },
                            {
                                icon: FaUserMd,
                                title: "Symptom Checker",
                                description: "Check your symptoms and get preliminary health insights"
                            },
                            {
                                icon: FaChartLine,
                                title: "Health Tracking",
                                description: "Monitor your health progress over time"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white p-6 rounded-xl shadow-lg"
                            >
                                <feature.icon className="text-4xl text-blue-600 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Preview Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-600 text-white rounded-2xl p-8 shadow-xl"
                    >
                        <h2 className="text-3xl font-bold mb-4">Experience Advanced Medical Analysis</h2>
                        <p className="text-lg mb-6">Access our full suite of AI-powered diagnostic tools and health monitoring features.</p>
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                            <p className="text-sm">Login or create an account to:</p>
                            <ul className="mt-2 space-y-2">
                                <li className="flex items-center">
                                    <FaCheckCircle className="mr-2" /> Get personalized health insights
                                </li>
                                <li className="flex items-center">
                                    <FaCheckCircle className="mr-2" /> Track your medical history
                                </li>
                                <li className="flex items-center">
                                    <FaCheckCircle className="mr-2" /> Access advanced analysis features
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const quickActions = [
        { 
            title: 'Get Diagnosis', 
            icon: FaStethoscope, 
            href: '/dashboard/diagnos',
            color: 'bg-blue-500' 
        },
        { 
            title: 'Check Symptoms', 
            icon: FaUserMd, 
            href: '/dashboard/symptomChecker',
            color: 'bg-green-500' 
        },
        { 
            title: 'View Reports', 
            icon: FaChartLine, 
            href: '/dashboard/reports',
            color: 'bg-purple-500' 
        },
        { 
            title: 'History', 
            icon: FaHistory, 
            href: '/dashboard/history',
            color: 'bg-orange-500' 
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Welcome Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-8"
            >
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
                    Welcome back, {userData.user?.name || 'User'}
                </h1>
                <p className="text-gray-600 mt-2">
                    Here's your health overview and quick actions
                </p>
            </motion.div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {quickActions.map((action, index) => (
                    <motion.div
                        key={action.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={action.href}>
                            <div className={`${action.color} rounded-xl p-6 text-white hover:shadow-lg transition-all cursor-pointer h-full`}>
                                <action.icon className="text-3xl mb-4" />
                                <h3 className="text-lg font-semibold">{action.title}</h3>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {/* Add recent activity items here */}
                    <p className="text-gray-600">No recent activity</p>
                </div>
            </motion.div>
        </div>
    );
}