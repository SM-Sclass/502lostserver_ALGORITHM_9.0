"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import diagnosisImage from '../../../public/assets/diagImage.jpg';
import { FaStethoscope } from 'react-icons/fa';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL;
    console.log(googleClientId, redirectUri)
    const options = {
        redirect_uri: redirectUri,
        client_id: googleClientId,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(" ")
    }

    const qs = new URLSearchParams(options);
    const googleAuthUrl = `${rootUrl}?${qs.toString()}`

    const handleGoogleLogin = () => {
        window.location.href = googleAuthUrl;
    };
    console.log(googleAuthUrl)
    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(signInStart());
        try {
            const response = await fetch('/api/users/login', { 
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ email, password }),
            });
            const { token, user } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user)); 
            dispatch(signInSuccess(user));
            navigate('/dashboard');
        } catch (err) {
            dispatch(signInFailure(err.response?.data?.message || 'Login failed'));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <FaStethoscope className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">AI Diagnos</span>
                    </Link>
                    <Link 
                        href="/register"
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        Create Account
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-16 min-h-screen flex flex-col lg:flex-row">
                {/* Left side - Image with overlay */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden lg:block lg:w-1/2 relative"
                >
                    <Image
                        src={diagnosisImage}
                            alt="Medical Analysis"
                        className="absolute inset-0 w-full h-full object-cover"
                        priority
                        fill
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/60 to-blue-600/30" />
                    <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-bold mb-4"
                        >
                            AI-Powered Medical Analysis
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg"
                        >
                            Get instant insights from your medical reports using advanced AI technology
                        </motion.p>
                    </div>
                </motion.div>

                {/* Right side - Login Form */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16"
                >
                    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Sign in to access your medical dashboard
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    Sign in
                                </button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 font-medium"
                                >
                                    <FcGoogle className="w-6 h-6" />
                                    Continue with Google
                                </motion.button>
                            </div>

                            <div className="text-center text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                                    Register here
                                </Link>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
