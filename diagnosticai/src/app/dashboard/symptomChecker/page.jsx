'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { symptomCheckerSchema } from '@/lib/validations/symptomChecker';
import Select from 'react-select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';    

const symptomCategories = {
    "General Symptoms": [
        "Fever", "Fatigue", " Weakness", "Chills", "Night sweats",
        "Weight loss", "weight gain", "Swelling"
    ],
    "Head and Neurological Symptoms": [
        "Headache", "Dizziness", "Confusion", "Seizures",
        "Memory loss", "Numbness", " Tingling sensation"
    ],
    "Respiratory Symptoms": [
        "Cough dry", "Cough productive", "Shortness of breath", "Chest pain",
        "Wheezing", "Sore throat", "Nasal congestion", "Runny nose"
    ],
    "Cardiovascular Symptoms": [
        "Palpitations", "Chest tightness", "High blood pressure", "low blood pressure",
        "Swelling in legs"
    ],
    "Gastrointestinal Symptoms": [
        "Nausea", "Vomiting", "Diarrhea", "Constipation",
        "Abdominal pain", "Bloating", "Blood in stool"
    ],
    "Musculoskeletal Symptoms": [
        "Joint pain", "Stiffness", "Muscle pain", "Back pain",
        "Difficulty walking"
    ],
    "Skin Symptoms": [
        "Rash", "Itching", "Redness", "Swelling",
        "Open sores", "Ulcers"
    ],
    "Urinary and Reproductive Symptoms": [
        "Pain during urination", "Frequent urination", "Blood in urine",
        "Lower abdominal pain", "Sexual dysfunction", "Menstrual irregularities"
    ],
    "Psychological Symptoms": [
        "Anxiety", "Depression", "Insomnia", "Mood swings",
        "Hallucinations"
    ]
};

export default function SymptomCheckerForm() {
    const [result, setResult] = useState(null);
    const {
        control,
        handleSubmit,
        register,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(symptomCheckerSchema),
        defaultValues: {
            age: null,
            sex: '',
            symptoms: []
        }
    });

    const [loading, setLoading] = useState(false);

    // Convert symptoms to react-select format
    const symptomOptions = Object.entries(symptomCategories).map(([group, symptoms]) => ({
        label: group,
        options: symptoms.map(symptom => ({
            value: symptom,
            label: symptom
        }))
    }));

    const onSubmit = async (data) => {
        try {
            const newData = {
                ...data,
                symptoms: data.symptoms.map(symptom => symptom.value)
            }
            setLoading(true);
            console.log('Form data:', newData);

            const response = await fetch('/api/symptomChecker', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze symptoms');
            }

            const responses = await response.json();
            setResult(responses.data.data);
            console.log('Analysis result:', responses.data.data);

        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to analyze symptoms');
        } finally {
            setLoading(false);
        }
    };

    const formatResults = (result) => ({
        sections: [
            {
                title: 'Possible Diseases',
                content: result.Diseases,
                type: 'list',
                className: 'bg-yellow-50 border-l-4 border-yellow-500'
            },
            {
                title: 'Detected Symptoms',
                content: result.Symptoms,
                type: 'list',
                className: 'bg-blue-50 border-l-4 border-blue-500'
            },
            {
                title: 'Recommended Precautions',
                content: result.Precautions,
                type: 'list',
                className: 'bg-green-50 border-l-4 border-green-500'
            },
            {
                title: 'Disease Information',
                content: result.Overview,
                type: 'object',
                className: 'bg-gray-50 border-l-4 border-gray-500'
            }
        ]
    });

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-6">


                <div className="w-full md:w-1/2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Age Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Age <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    {...register('age', { valueAsNumber: true })}
                                    className={`w-full p-2 border rounded-md ${errors.age ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.age && (
                                    <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>
                                )}
                            </div>

                            {/* Sex Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sex <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register('sex')}
                                    className={`w-full p-2 border rounded-md ${errors.sex ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select sex...</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.sex && (
                                    <p className="mt-1 text-sm text-red-500">{errors.sex.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Symptoms Multiselect */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Symptoms <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="symptoms"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        isMulti
                                        options={symptomOptions}
                                        className={`basic-multi-select ${errors.symptoms ? 'select-error' : ''
                                            }`}
                                        classNamePrefix="select"
                                        placeholder="Select symptoms..."
                                    />
                                )}
                            />
                            {errors.symptoms && (
                                <p className="mt-1 text-sm text-red-500">{errors.symptoms.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-3 rounded-md text-white font-medium
                        ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'Analyze Symptoms'
                            )}
                        </motion.button>
                    </form>
                </div>
                <div className="w-full md:w-1/2">
                    <AnimatePresence mode="wait">
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-lg shadow-lg p-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>
                                <div className="space-y-6">
                                    {formatResults(result).sections.map(({ title, content, type, className }) => (
                                        <motion.div
                                            key={title}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className={`rounded-lg p-4 ${className}`}
                                        >
                                            <h3 className="text-lg font-semibold mb-3">{title}</h3>
                                            {type === 'list' && Array.isArray(content) && (
                                                <ul className="list-disc list-inside space-y-1">
                                                    {content.map((item, index) => (
                                                        <li key={index} className="text-gray-700">
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {type === 'object' && typeof content === 'object' && (
                                                <div className="space-y-3">
                                                    {Object.entries(content).map(([disease, info]) => (
                                                        <div key={disease} className="p-3 bg-white rounded-md">
                                                            <h4 className="font-medium text-gray-900 mb-1">
                                                                {disease}
                                                            </h4>
                                                            <p className="text-gray-700 text-sm">
                                                                {info}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}