import { NextResponse } from 'next/server';
import { createToken } from '../../../../lib/jwtUtils';
import User from '../../../../models/user.model';
import connectDB from '../../../../lib/db';

export async function POST(request) {
    try {
        const { email, password } = req.json();
        const user = await User.findOne({ email });
        const tokenData = {
            email: user.email,
            name: user.name,
        }
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }
        const token = createToken(user._id, tokenData);
        NextResponse.json({
            message: "Login successful",
            token,
            user
        }, { status: 200 })

    }
    catch (err) {
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
    }
}