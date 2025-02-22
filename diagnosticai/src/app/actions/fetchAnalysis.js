import { ZodError } from "zod";

export async function fetchAnalysis(state, formData) {
    try {
        const file = formData.get('files');
        const host = formData.get('host')?.trim();

        if (!file || !(file instanceof File)) {
            throw new Error('No file provided');
        }

        if (!host) {
            throw new Error('Host URL is required');
        }

        // Construct the final URL
        let url;
        if (host.includes('pythonanywhere')) {
            // For report analysis endpoint
            url = host;
        } else {
            // For local Python server
            const port = formData.get('port')?.trim();
            const endpoint = formData.get('endpoint')?.trim();
            url = `${host}${port ? `:${port}` : ''}${endpoint ? `/${endpoint.replace(/^\//, '')}` : ''}`;
        }

        console.log("Final URL:", url);

        const fileFormData = new FormData();
        fileFormData.append('file', file);

        const response = await fetch(url, {
            method: "POST",
            body: fileFormData,
            headers: {
                'Accept': 'application/json',
            },// Important for cross-origin requests
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server error response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return {
            message: 'Analysis completed successfully',
            data: result,
            error: { files: "" }
        };

    } catch (error) {
        console.error('Fetch error:', error);
        return {
            message: "An error occurred while processing the file",
            error: {
                files: error.message
            }
        };
    }
}