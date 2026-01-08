import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {z} from 'zod';
import User from '../models/user';
import generateAccessToken from '../utils/generateAccessToken';
import generateRefreshToken from '../utils/generateRefreshToken';
import hashToken from '../utils/hashToken';

const secureOptions = {secure: process.env.NODE_ENV ==='production', httpOnly: true, sameSite: 'strict'}

const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password:  z.string().min(6)
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const register = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(401).json({message: "Invalid Details"})
        }
    
        const {name, email, password} = validation.data;
        
        const existingUser = await User.findOne({email});
    
        if (existingUser) {
            return res.status(409).json({message: 'User all ready exists'})
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({name, email, password: hashedPassword})
        await user.save()
        res.status(201).json({message: 'User Registered'})
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

export const login = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body);
    
        if (!validation.success) {
            return res.status(401).json("Invalid Credentials")
        }
    
        const { email, password} = validation.data;
    
        const user = await User.findOne({email});
    
        if (!user) {
            return res.status(401).json({message: 'Ivalid User please register'})
        }
    
        const verified = await bcrypt.compare(password, user.password);
    
        if (!verified) {
            return res.status(401).json({message: "Unauthorized"})
        }
    
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user._id)
    
        const hashedRefreshToken = await hashToken(refreshToken)
    
        await User.findByIdAndUpdate(user._id,
            {refreshToken: hashedRefreshToken},
            {new: true}
        )
    
        res.status(200)
        .cookie('refreshToken', refreshToken, secureOptions)
        .json({'accessToken': accessToken})
    } catch (error) {
        res.status(500).json({message: 'Internal Server error'})
    }
}

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const { userId } = decoded;

    await User.findByIdAndUpdate(
        userId,
        {refreshToken: undefined}
    )

    res.status(200)
    .clearCookie('refreshToken', secureOptions)
    .json({message: 'User Logedout Successfully'})
}

export const refresh = async (req, res) => {
    try {
        const userRefreshToken = req.cookies.refreshToken;
        if (!userRefreshToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const decoded = jwt.verify(userRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        
        const { userId } = decoded;
        const user = await User.findById(userId)
    
        if (!user) {
            return res.status(401).json({message: 'unauthorized'})
        }
        const hashedUserRefreshToken = await hashToken(userRefreshToken)
        if ( hashedUserRefreshToken !== user.refreshToken) {
            await User.findByIdAndUpdate({_id: userId}, {refreshToken: undefined})
            return res.status(401).clearCookie('refreshToken', secureOptions).json({message: "Unauthorized"})
        }
    
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user._id)
    
        const hashedRefreshToken = await hashToken(refreshToken)
    
        await User.findByIdAndUpdate(
            userId,
            {refreshToken: hashedRefreshToken},
            {new: true}
        )
    
        res.status(200)
        .cookie('refreshToken', refreshToken, secureOptions)
        .json({'accessToken': accessToken})
    } catch (error) {
        res.status(500).json({message: 'Internal Server error'})
    }
}