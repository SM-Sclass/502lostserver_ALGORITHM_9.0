import { ZodError } from "zod";

export async function fetchAnalysis(state, formData) {
    try {
        const file = formData.get('files');
        const host = formData.get('host');
        const port = formData.get('port');
        const endpoint = formData.get('endpoint');

        if (!file || !(file instanceof File)) {
            throw new Error('No file provided');
        }

        const fileFormData = new FormData();
        fileFormData.append('file', file);

        // Debug logs
        console.log("Request details:", {
            host,
            port,
            endpoint,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
        });

        const url = port ? 
            `${host}:${port}${endpoint}` : 
            `${host}${endpoint}`;

        console.log("Sending request to:", url);

            const response = await fetch(url, {
                method: "POST",
                body: fileFormData,
                // headers: {
                //     'Accept': '*/*',
                // },
                // Remove mode: 'cors' as it's handled by middleware
            });

            // Debug response
            console.log("Response status:", response.status);
            console.log("Response headers:", Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server error response:", errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Parsed response:", result);

            return {
                message: 'Analysis completed successfully',
                data: result,
                error: { files: "" }
            };

    } catch (error) {
        // Detailed error logging
        console.error('Error full details:', {
            message: error.message,
            type: error.constructor.name,
            stack: error.stack
        });

        return {
            message: "An error occurred while processing the file",
            error: {
                files: error.message
            }
        };
    }
}