'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFileUpload, FaBrain, FaChartLine, FaFileImage, FaFileMedical } from 'react-icons/fa';
import AnimatedBackground from '../components/AnimatedBackground';
import { useQuery } from '@tanstack/react-query';

const fetchUser = async () => {
  try {
    const response = await fetch('/api/auth/user');
    if (!response.ok) {
      return null;
    }
    return response.data;
  } catch (error) {
    return null;
  }
};

export default function LandingPage() {
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    select: (data) => data,
  });

  const renderAuthButtons = () => {
    if (isLoading) {
      return null;
    }

    if (!userProfile) {
      return (
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Register
          </Link>
        </div>
      );
    }

    return (
      <Link
        href="/dashboard"
        className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard
      </Link>
    );
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        {/* Glass effect container */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            AI-Powered Medical Diagnostics
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Upload your medical reports and get instant AI-assisted analysis and insights.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {renderAuthButtons()}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gray-50/70 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaFileUpload className="text-4xl mb-4 text-blue-600" />,
                title: "Easy Upload",
                description: "Support for multiple file formats including PNG, EDF, and more"
              },
              {
                icon: <FaBrain className="text-4xl mb-4 text-blue-600" />,
                title: "AI Analysis",
                description: "Advanced machine learning algorithms for accurate diagnostics"
              },
              {
                icon: <FaChartLine className="text-4xl mb-4 text-blue-600" />,
                title: "Instant Results",
                description: "Get detailed analysis and insights within seconds"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Files Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12">Supported File Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <FaFileImage />, type: "PNG Files" },
              { icon: <FaFileMedical />, type: "EDF Files" },
              { icon: <FaFileMedical />, type: "DICOM Files" },
              { icon: <FaFileMedical />, type: "Lab Reports" }
            ].map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-3xl text-blue-600 mb-2">{file.icon}</div>
                <span className="text-gray-700 font-medium">{file.type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-blue-600/90 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals using DiagnosticAI
          </p>
          <Link href="/dashboard" 
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Try DiagnosticAI Now
          </Link>
        </div>
      </section>
    </div>
  );
}
