import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("Received data:", data);
        const pyResponse = await fetch("http://lostserver.pythonanywhere.com/analyze_symptoms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const responseData = await pyResponse.json();
        console.log("Python response:", responseData);
        if (!pyResponse.ok) {
            throw new Error("Network response was not ok");
        }
        return NextResponse.json({
            message: "Symptoms analyzed successfully",
            data: responseData
        }, { status: 200 });
    } catch (error) {
        console.error("Error in fetching data:", error);
        return NextResponse.json({
            message: error.message
        }, { status: 500 });
    }
}