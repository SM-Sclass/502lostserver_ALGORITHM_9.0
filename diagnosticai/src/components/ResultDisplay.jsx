'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ResultDisplay({ result }) {
    const getResultSections = () => {
        const baseConfig = [
            { key: 'prediction', title: 'Prediction', type: 'critical' },
            { key: 'diagnosis', title: 'Diagnosis', type: 'info' },
            { key: 'overview', title: 'Overview', type: 'info' },
            { key: 'symptoms', title: 'Symptoms', type: 'warning' },
            { key: 'remedies', title: 'Remedies', type: 'success' },
            { key: 'diet', title: 'Diet Recommendations', type: 'success' }
        ];

        return baseConfig.filter(section => result[section.key]);
    };

    const getTypeStyles = (type) => {
        const styles = {
            critical: 'bg-red-50 border-l-4 border-red-500 text-red-700',
            warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700',
            success: 'bg-green-50 border-l-4 border-green-500 text-green-700',
            info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
        };
        return styles[type] || styles.info;
    };

    return (
        <div className="space-y-6">
            {/* Image Result if available */}
            {result.link && !result.link.includes('Failed') && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg overflow-hidden shadow-lg"
                >
                    <Image
                        src={result.link}
                        alt="Analysis Result"
                        width={800}
                        height={400}
                        className="w-full object-contain"
                    />
                </motion.div>
            )}

            {/* Text Results */}
            <div className="grid gap-6">
                {getResultSections().map(({ key, title, type }, index) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-lg shadow-sm ${getTypeStyles(type)}`}
                    >
                        <h3 className="text-lg font-semibold mb-2">{title}</h3>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {result[key]}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Confidence Score if available */}
            {result.confidence && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-4 rounded-lg"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Confidence Score</span>
                        <span className="text-lg font-bold">{result.confidence}%</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${result.confidence}%` }}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
