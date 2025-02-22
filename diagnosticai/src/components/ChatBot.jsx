'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaMicrophone, FaLanguage, FaTimes } from 'react-icons/fa';
import { BsSend } from 'react-icons/bs';
import { toast } from 'sonner';

const SUPPORTED_LANGUAGES = {
    en: { name: 'English', code: 'en' },
    hi: { name: 'हिंदी', code: 'hi' },
    ur: { name: 'اردو', code: 'ur' }
};

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isListening, setIsListening] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    
    const chatContainerRef = useRef(null);
    const recognition = useRef(null);

    useEffect(() => {
        let speechRecognition = null;
        
        const initializeSpeechRecognition = async () => {
            try {
                // Check for browser support
                if (typeof window === 'undefined') return null;
                
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                
                if (!SpeechRecognition) {
                    console.log('Speech recognition not supported');
                    return null;
                }

                // Check for network connectivity
                if (!navigator.onLine) {
                    toast.error('No internet connection available');
                    return null;
                }

                // Check for microphone permission first
                try {
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                } catch (err) {
                    toast.error('Microphone access is required for voice input');
                    return null;
                }

                speechRecognition = new SpeechRecognition();
                
                // Configure recognition settings
                speechRecognition.continuous = false;
                speechRecognition.interimResults = false;
                speechRecognition.lang = selectedLanguage;
                speechRecognition.maxAlternatives = 1;

                // Event handlers with better error management
                speechRecognition.onstart = () => {
                    setIsListening(true);
                };

                speechRecognition.onend = () => {
                    setIsListening(false);
                };

                speechRecognition.onresult = (event) => {
                    if (event.results && event.results[0]) {
                        const transcript = event.results[0][0].transcript;
                        setInput(transcript);
                    }
                    setIsListening(false);
                };

                speechRecognition.onerror = (event) => {
                    setIsListening(false);
                    
                    switch (event.error) {
                        case 'network':
                            toast.error('Please check your internet connection');
                            break;
                        case 'not-allowed':
                        case 'permission-denied':
                            toast.error('Microphone access is required');
                            break;
                        case 'no-speech':
                            toast.error('No speech detected. Please try again');
                            break;
                        case 'audio-capture':
                            toast.error('No microphone detected');
                            break;
                        case 'service-not-allowed':
                            toast.error('Speech recognition service not available');
                            break;
                        default:
                            toast.error('Speech recognition error. Please try typing');
                    }
                };

                return speechRecognition;
            } catch (error) {
                console.error('Speech recognition initialization error:', error);
                toast.error('Failed to initialize voice input');
                return null;
            }
        };

        // Initialize and store the recognition instance
        initializeSpeechRecognition().then(instance => {
            recognition.current = instance;
        });

        // Cleanup
        return () => {
            if (recognition.current) {
                try {
                    recognition.current.abort();
                } catch (error) {
                    console.error('Error cleaning up speech recognition:', error);
                }
            }
        };
    }, [selectedLanguage]);

    const startListening = async () => {
        if (!recognition.current) {
            toast.error('Voice input not available');
            return;
        }

        if (!navigator.onLine) {
            toast.error('Please check your internet connection');
            return;
        }

        try {
            recognition.current.start();
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
            toast.error('Failed to start voice input');
            setIsListening(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            text: input,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    targetLanguage: selectedLanguage
                })
            });

            const data = await response.json();
            
            setMessages(prev => [...prev, {
                text: data.response,
                isUser: false,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            toast.error('Failed to get response');
        }
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div className="fixed bottom-4 right-4 z-[9999]">
            {!isOpen ? (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full text-white shadow-lg flex items-center justify-center"
                    aria-label="Open chat"
                >
                    <FaRobot size={24} />
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-lg shadow-2xl w-80 h-[500px] flex flex-col"
                >
                    {/* Chat Header */}
                    <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <FaRobot size={20} />
                            <h3 className="font-semibold">AI Assistant</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="bg-blue-500 text-white rounded px-2 py-1 text-sm"
                            >
                                {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                                    <option key={code} value={code}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-blue-700 p-1 rounded"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4"
                    >
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                        message.isUser
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Section */}
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={startListening}
                                disabled={isListening}
                                className={`p-2 rounded-full transition-colors ${
                                    isListening
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <FaMicrophone />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message..."
                                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={handleSend}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                            >
                                <BsSend />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
