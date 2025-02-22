import {NextResponse } from "next/server";
import User from '../../../../models/user.model';
import connectDB from '../../../../lib/db';
import { createToken } from '../../../../lib/jwtUtils';

export async function POST(request) {
    try {
        const dataBody = await request.json();
        if(!dataBody.email || !dataBody.password || !dataBody.name){
            return NextResponse.json({
                message: "Invalid data"
            },{status:400})
        }
        console.log("Received data:", dataBody);
        connectDB();
        const existsUser = await User.findOne({ email})
        if(existsUser){
            return NextResponse.json({
                message: "User already exists"
            },{status:401})
        }
        const user = await User.create(dataBody);
        const tokenData = {
            email: user.email,
            name: user.name,
        }
        console.log("User created:", user);
        const token = createToken(user._id, tokenData);

        const response = NextResponse.json({ message: 'Success', token }, { status: 200 });
        
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 86400, // 24 hours
            path: '/',
        });

        return response;
    } catch (error) {
        console.error("Error in fetching data:", error);
        return NextResponse.json({
            message: error.message
        }, { status: 500 });
    }
}