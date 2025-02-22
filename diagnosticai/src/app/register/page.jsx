'use client';
import React from 'react';
import UserProfileForm from '@/components/UserProfileForm';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStethoscope } from 'react-icons/fa';

function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <FaStethoscope className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">AI Diagnos</span>
                    </Link>
                    <Link
                        href="/login"
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Already have an account?
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Left Side - Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full lg:w-1/2 bg-white rounded-2xl shadow-xl p-6"
                        >
                            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                                Create Your Account
                            </h1>
                            <UserProfileForm />
                        </motion.div>

                        {/* Right Side - Features */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full lg:w-1/2 space-y-8 lg:pl-12"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                Why Create an Account?
                            </h2>

                            {[
                                {
                                    title: 'AI-Powered Diagnostics',
                                    description: 'Get instant analysis of medical reports and symptoms.'
                                },
                                {
                                    title: 'Secure Health Records',
                                    description: 'Safely store and access your medical history anytime.'
                                },
                                {
                                    title: 'Expert Consultations',
                                    description: 'Connect with healthcare professionals easily.'
                                },
                                {
                                    title: 'Personalized Health Insights',
                                    description: 'Receive tailored health recommendations and alerts.'
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start space-x-4 bg-white/50 backdrop-blur-sm p-4 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Background Decorations */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-20" />
                <div className="absolute -bottom-1/4 -left-1/4 w-64 h-64 bg-blue-200 rounded-full opacity-20" />
            </div>
        </div>
    );
}

export default RegisterPage;