'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { symptomCheckerSchema } from '@/lib/validations/symptomChecker';
import Select from 'react-select';
import { toast } from 'sonner';

const symptomCategories = {
    "General Symptoms": [
        "Fever", "Fatigue / Weakness", "Chills", "Night sweats",
        "Weight loss/gain", "Swelling"
    ],
    "Head and Neurological Symptoms": [
        "Headache", "Dizziness", "Confusion", "Seizures",
        "Memory loss", "Numbness / Tingling sensation"
    ],
    "Respiratory Symptoms": [
        "Cough (dry/productive)", "Shortness of breath", "Chest pain",
        "Wheezing", "Sore throat", "Nasal congestion / Runny nose"
    ],
    "Cardiovascular Symptoms": [
        "Palpitations", "Chest tightness", "High/low blood pressure",
        "Swelling in legs"
    ],
    "Gastrointestinal Symptoms": [
        "Nausea / Vomiting", "Diarrhea", "Constipation",
        "Abdominal pain", "Bloating", "Blood in stool"
    ],
    "Musculoskeletal Symptoms": [
        "Joint pain / Stiffness", "Muscle pain", "Back pain",
        "Difficulty walking"
    ],
    "Skin Symptoms": [
        "Rash", "Itching", "Redness", "Swelling",
        "Open sores / Ulcers"
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

            const result = await response.json();
            // Handle the result
            
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to analyze symptoms');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
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
                            className={`w-full p-2 border rounded-md ${
                                errors.age ? 'border-red-500' : 'border-gray-300'
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
                            className={`w-full p-2 border rounded-md ${
                                errors.sex ? 'border-red-500' : 'border-gray-300'
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
                                className={`basic-multi-select ${
                                    errors.symptoms ? 'select-error' : ''
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
    );
}