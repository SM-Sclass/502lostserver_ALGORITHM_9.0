'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const medicalProblems = {
    'no': 0,
    'yes(diabetes)': 1,
    'yes(bp)': 2,
    'kidney stone': 3,
    'yes(increase in heart rate)': 4,
    'Yes(Diabetes,bp)': 5,
    'Yes(Diabetes,Blockage in Heart)': 6,
    'yes(diabetes,kidney stone)': 7
};

const surgeryHistory = {
    'no': 0,
    'vericose vein surgery': 1,
    'uteres removal': 2,
    'kidney stone opreration': 3,
    'uterus surgery': 4,
    'yes(diverticulities)': 5,
    'shouler surgery': 6,
    'knee surgery': 7,
    'yes(open heart surgery)': 8
};

const drugHistory = {
    'no': 0,
    'yes': 1,
    'yes(ecosprin)': 2
};

const formSchema = z.object({
    age: z.number()
        .min(1, 'Age is required')
        .refine((val) => !isNaN(val) && parseInt(val) > 0 && parseInt(val) < 150, {
            message: 'Please enter a valid age between 1 and 150'
        }),
    sex: z.enum(['Male', 'Female']),
    medicalProblem: z.string().min(1, "Medical Problem is required"),
    surgeryHistory: z.string().min(1, "Surgery History is required"),
    drugHistory: z.string().min(1, "Drug History is required"),
    additionalInfo: z.string().optional()
});

export default function SymptomChecker() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema)
    });

    // const selectedMedicalProblem = watch('medicalProblem');
    const selectedDrugHistory = watch('drugHistory');

    const fetchOstoporosisAnalysis = async (data) => {
        try {
            setLoading(true);
            const response = await fetch("/api/ostoporosis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            setResult(responseData.data);
        } catch (error) {
            console.error("Error in fetching data:", error);
            toast.error("Failed to analyze data");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async(data) => {
        const Data = {
            ...data,
            sex: data.sex === 'Male' ? 1 : 0,
            medicalProblem: medicalProblems[data.medicalProblem],
            surgeryHistory: surgeryHistory[data.surgeryHistory],
            drugHistory: drugHistory[data.drugHistory]
        }
        console.log(Data);
        await fetchOstoporosisAnalysis(Data);
    };

    const getResultStyles = (title, content) => {
        if (title === 'Prediction') {
            switch (content) {
                case 'Osteoporotic':
                    return 'bg-red-50 border-l-4 border-red-500 text-red-700';
                case 'Osteopenia':
                    return 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700';
                default:
                    return 'bg-green-50 border-l-4 border-green-500 text-green-700';
            }
        }
        return 'bg-gray-50';
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Form Section */}
                <div className="w-full md:w-1/2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Symptom Analysis</h2>
                        {/* Age Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Age
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="number"
                                onChange={(event) => setValue('age', parseInt(event.target.value))}
                                className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter your age"
                                min="1"
                                max="150"
                            />
                            {errors.age && (
                                <p className="text-red-500 text-sm">{errors.age.message}</p>
                            )}
                        </div>

                        {/* Sex Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Sex</label>
                            <div className="flex space-x-4">
                                {['Male', 'Female'].map((option) => (
                                    <label key={option} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            {...register('sex')}
                                            value={option}
                                            className="form-radio"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.sex && (
                                <p className="text-red-500 text-sm">{errors.sex.message}</p>
                            )}
                        </div>

                        {/* Medical Problems */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Associated Medical Problems
                            </label>
                            <select
                                {...register('medicalProblem')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                            >
                                <option value="">Select...</option>
                                {Object.keys(medicalProblems).map((problem) => (
                                    <option key={problem} value={problem}>
                                        {problem}
                                    </option>
                                ))}
                            </select>
                            {errors.medicalProblem && (
                                <p className="text-red-500 text-sm">{errors.medicalProblem.message}</p>
                            )}
                        </div>

                        {/* Surgery History */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                History of Injury/Surgery
                            </label>
                            <select
                                {...register('surgeryHistory')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                            >
                                <option value="">Select...</option>
                                {Object.keys(surgeryHistory).map((surgery) => (
                                    <option key={surgery} value={surgery}>
                                        {surgery}
                                    </option>
                                ))}
                            </select>
                            {errors.surgeryHistory && (
                                <p className="text-red-500 text-sm">{errors.surgeryHistory.message}</p>
                            )}
                        </div>

                        {/* Drug History */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Drug History
                            </label>
                            <select
                                {...register('drugHistory')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                            >
                                <option value="">Select...</option>
                                {Object.keys(drugHistory).map((drug) => (
                                    <option key={drug} value={drug}>
                                        {drug}
                                    </option>
                                ))}
                            </select>
                            {errors.drugHistory && (
                                <p className="text-red-500 text-sm">{errors.drugHistory.message}</p>
                            )}
                        </div>

                        {/* Conditional Additional Fields */}
                        <AnimatePresence>
                            {selectedDrugHistory === 'yes' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="block text-sm font-medium text-gray-700">
                                        Additional Information
                                    </label>
                                    <textarea
                                        {...register('additionalInfo')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                                        rows={3}
                                        placeholder="Please provide additional details about your drug history..."
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </div>
                            ) : (
                                'Analyze Symptoms'
                            )}
                        </button>
                    </form>
                </div>

                {/* Results Section */}
                <div className="w-full md:w-1/2">
                    <AnimatePresence mode="wait">
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-lg shadow-sm p-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>
                                <div className="space-y-6">
                                    {[
                                        { title: 'Prediction', content: result.prediction },
                                        { title: 'Overview', content: result.overview },
                                        { title: 'Diagnosis', content: result.diagnosis },
                                        { title: 'Symptoms', content: result.symptoms },
                                        { title: 'Remedies', content: result.remedies },
                                        { title: 'Diet', content: result.diet }
                                    ].map(({ title, content }) => (
                                        <motion.div
                                            key={title}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className={`p-4 rounded-lg ${getResultStyles(title, content)}`}
                                        >
                                            <h3 className={`text-lg font-semibold mb-2 rounded-lg p-1 ${
                                                title === 'Prediction' ? getResultStyles(title, content) : 'text-gray-700'
                                            }`}>
                                                {title}
                                            </h3>
                                            <p className={`rounded-lg p-2  ${
                                                title === 'Prediction' 
                                                    ? getResultStyles(title, content)
                                                    : 'text-gray-600'}`
                                            }>
                                                {content}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Mobile Results Section */}
            <div className="md:hidden mt-6">
                <AnimatePresence mode="wait">
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            {/* Same content as desktop results */}
                            {/* ...existing results content... */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}