import { NextResponse } from 'next/server';
import User from '../../../../models/user.model';
import { createToken } from '../../../../lib/jwtUtils';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/db';

export async function POST(request) {
    try {
        connectDB();
        const { email, password } = await request.json();
        console.log(email, password);
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({
                message: "User not found"
            },{status:401})
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return NextResponse.json({
                message: "Invalid password"
            },{status:401})
        }
        const token = createToken(user._id, user);

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
    }
    catch (err) {
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
    }
}

export async function GET(request) {
    try {
        const cookies = request.cookies.get("token");
        if(!cookies){
            return NextResponse.json({message:"Cookies doesn't have token"},{status:401})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if(!user){
            return NextResponse.json({
                message: "User not found"
            },{status:401})
        }
        return NextResponse.json({
            message: "User found",
            user
        },{status:200})
    }
    catch (err) {
        return NextResponse.json({
            message: err.message
        },{status:500})
    }
}