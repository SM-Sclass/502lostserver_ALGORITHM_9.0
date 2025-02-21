import { ZodError } from "zod";

export async function fetchAnalysis(state, formData) {
    try {
        const file = formData.get('files');
        const port = formData.get('port');
        if (!file || !(file instanceof File)) {
            throw new Error('No file provided');
        }

        // Create a FormData object to send the file
        const fileFormData = new FormData();
        fileFormData.append('file', file);
        console.log("File to be sent:", file);
        console.log()
        const response = await fetch("http://192.168.137.1:5001/schizo", {
            method: "POST",
            body: fileFormData // Send the FormData object directly
        });

        if (!response.ok) {
            throw new Error('Failed to process file');
        }

        const result = await response.json();
        return {
            message: 'Analysis completed successfully',
            error: {
                files: ""
            }
        };
    } catch (error) {
        console.error('Error processing file:', error);
        if (error instanceof ZodError) {
            const formValidationErrors = error.flatten().fieldErrors;
            return {
                message: "Validation failed",
                errors: {
                    files: formValidationErrors.files?.join(", ") || "",
                },
            };
        }
        return {
            message: "An error occurred while processing the file",
            error: {
                files: error.message
            }
        };
    }
}