import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req) {
    try {
        const { message, targetLanguage } = await req.json();
        console.log(message, targetLanguage);
        // Create chat model
        const model = genAI.getGenerativeModel({ model: "gemini-flash" });

        // Construct prompt with language instruction
        const languageMap = {
            'en': 'English',
            'hi': 'Hindi',
            'ur': 'Urdu'
        };

        const prompt = `
            You are a medical assistant. Please respond to the following query in ${languageMap[targetLanguage]}.
            If responding in Hindi or Urdu, use the respective script.
            Query: ${message}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
