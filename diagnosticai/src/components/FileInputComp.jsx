'use client'
import React, { useState, useActionState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchAnalysis } from '@/app/actions/fetchAnalysis';
import { FaUpload, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { AnimatePresence,motion } from 'framer-motion';
import { diagnosisFormSchema } from '@/lib/validations/diagnos';
import ResultDisplay from './ResultDisplay';
import ReportAnalysisDisplay from './ReportAnalysisDisplay';

function FileInputComp({ acceptFirst, label ,endpoint }) {
    const {
        formState: { errors: formErrors },
    } = useForm({
        resolver: zodResolver(diagnosisFormSchema)
    });
    const formState = {
        message: "",
        data: {},
        errors: {
            files: ""
        }
    }
    const [state, formAction, isPending] = useActionState(fetchAnalysis, formState)
    const [files, setFiles] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState("");
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);

    // Updated to handle new endpoint array format
    const diseases = endpoint || [];

    const handleDiseaseChange = (e) => {
        const selectedDisease = diseases.find(d => d.name === e.target.value);
        setSelectedEndpoint(selectedDisease || null);
        console.log("Selected disease:", selectedDisease);
    };
    console.log(state.data)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log("File selected:", e.target);
        if (!file) return;
        console.log("File selected:", file);
        setErrors("");

        try {
            if (file.size > 15000000) {
                setErrors('File size must be less than 15mb');
                return;
            }

            // First set the file
            setFiles(file);

            // Then create preview if it's an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    console.log("Preview URL generated:", event.target.result);
                    setPreview(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
            console.log("File selected:", file.name);
        } catch (error) {
            console.error("File processing error:", error);
            setPreview(null);
            setFiles(null);
            setErrors('Error processing file');
        }
    };

    const renderResult = () => {
        if (!state.data) return null;

        switch (label) {
            case 'Brain signals & MRI':
                return <ResultDisplay result={state.data} />;
            case 'Report analysis':
                return <ReportAnalysisDisplay result={state.data} />;
            default:
                return <ResultDisplay result={state.data} />;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3">
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
                        <form action={async (formData) => {
                            if (files) {
                                formData.set('files', files);
                                if (selectedEndpoint) {
                                    formData.set('host', selectedEndpoint.HOST);
                                    formData.set('port', selectedEndpoint.port);
                                    formData.set('endpoint', selectedEndpoint.endpoint);
                                }
                            }
                            await formAction(formData);
                        }} className="space-y-6 w-full">
                            {/* Updated Disease Selection Dropdown */}
                            {diseases.length > 0 && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">
                                        Select Disease Type
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        onChange={handleDiseaseChange}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select disease...</option>
                                        {diseases.map((disease) => (
                                            <option key={disease.name} value={disease.name}>
                                                {disease.name.replace(/_/g, ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={
                                    isPending ||
                                    !files ||
                                    (diseases.length > 0 && !selectedEndpoint) ||
                                    errors !== ""
                                }
                                className={`w-full md:w-auto px-6 py-2 rounded-lg transition-colors ${isPending ||
                                    !files ||
                                    (diseases.length > 0 && !selectedEndpoint) ||
                                    errors !== ""
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white`}
                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center">
                                        <FaSpinner className="animate-spin mr-2" />
                                        Processing...
                                    </span>
                                ) : (
                                    'Analyze'
                                )}
                            </button>

                            {/* File Input with Error Message */}
                            <div className="space-y-2">
                                <label htmlFor="file1" className="block text-sm font-medium">
                                    Upload File
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className={`border-2 border-dashed rounded-lg p-10 ${formErrors.file || errors ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                    <input
                                        name="files"
                                        type="file"
                                        accept={acceptFirst}
                                        onChange={handleFileChange}
                                        className="hidden cursor-pointer"
                                        id="file1"
                                    />
                                    <label htmlFor="file1" className="cursor-pointer flex flex-col items-center">
                                        <FaUpload className="text-3xl text-gray-400" />
                                        <span className="mt-2 text-sm text-gray-500">Click to upload</span>
                                    </label>
                                    {files && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            Selected: {files.name}
                                        </div>
                                    )}
                                    {formErrors.file || errors && (
                                        <p className="mt-2 text-sm text-red-500 flex items-center">
                                            <FaExclamationCircle className="mr-1" />
                                            {formErrors.file?.message || errors}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Preview Section */}
                        <div className="flex w-full items-center">
                            <Separator orientation="vertical" className="hidden md:block lg:block" />
                            {preview && (
                                <div className="w-full mt-20 mx-5 bg-white rounded-lg shadow-sm">
                                    <Image
                                        src={preview}
                                        width={500}
                                        height={500}
                                        alt="File preview"
                                        className="rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <AnimatePresence mode="wait">
                        {state.data && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-lg shadow-lg p-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>
                                {renderResult()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default FileInputComp