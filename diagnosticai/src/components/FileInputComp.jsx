'use client'
import React, { useState, useActionState} from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchAnalysis } from '@/app/actions/fetchAnalysis';
import { FaUpload, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { diagnosisFormSchema } from '@/lib/validations/diagnos';

function FileInputComp({ label, id, acceptFirst, fileTypes,port }) {
    const {
        formState: { errors: formErrors },
    } = useForm({
        resolver: zodResolver(diagnosisFormSchema)
    });
    const formState = {
        message: "",
        errors: {
            files: ""
        }
    }
    const [state, formAction, isPending] = useActionState(fetchAnalysis, formState)
    const [files, setFiles] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState("");

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

    return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
            <form action={async (formData) => {
                if (files) {
                    formData.set('files', files);
                    formData.set('port',port) // Ensure file is added to FormData
                }
                await formAction(formData);
            }} className="space-y-6 w-full">
                <button
                    type="submit"
                    disabled={
                        isPending ||
                        !files ||
                        errors != (null || undefined || '')
                    }
                    className={`w-full md:w-auto px-6 py-2 rounded-lg transition-colors ${isPending ||
                        !files ||
                        errors != (null || undefined || '')
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
                    <div className={`border-2 border-dashed rounded-lg p-10 ${formErrors.file || errors? 'border-red-500' : 'border-gray-300'
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
                        {files  && (
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
    )
}

export default FileInputComp