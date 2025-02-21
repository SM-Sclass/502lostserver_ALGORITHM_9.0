import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        const newData = {
            Age: data.age,
            SEX: data.sex,
            Prob: data.medicalProblem,
            INJURY: data.surgeryHistory,
            DRUG: data.drugHistory,
        };
        // console.log("Sending to Flask:", newData);
         
        const response = await fetch("http://192.168.137.1:5000/bone", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newData)
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        // console.log("Flask response:", responseData);

        return NextResponse.json({
            message: "Analysed successfully", 
            data: responseData
        }, { status: 200 });
    } catch (error) {
        console.error("Error in fetching data:", error);
        return NextResponse.json({
            message: error.message
        }, { status: 500 });
    }
}