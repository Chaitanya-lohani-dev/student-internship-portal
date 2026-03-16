import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {z} from 'zod';
import User from '../models/User.js';
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import hashToken from '../utils/hashToken.js';

const secureOptions = {secure: process.env.NODE_ENV ==='production', httpOnly: true,  sameSite: 'lax', path: '/'}

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
        console.error("Some Error occurred: ", error);
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
        .cookie('refreshToken', refreshToken, { ...secureOptions, maxAge: 30*24*60*60*1000})
        .cookie('accessToken', accessToken, { ...secureOptions, maxAge: 15*60*1000})
        .json({message: 'User Loged in Successfully'})
    } catch (error) {
        console.error("Some Error occurred: ", error);
        res.status(500).json({message: 'Internal Server error'})
    }
}

export const logout = async (req, res) => {
    try {
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
    
        return res.status(200)
        .clearCookie('refreshToken', secureOptions)
        .clearCookie('accessToken', secureOptions)
        .json({message: 'User Logedout Successfully'})
    } catch (error) {
        console.error("Some Error occurred: ", error);
        return res.status(401).json({ message: "Internal Server error" });
    }
}

export const refresh = async (req, res) => {
  try {
    const userRefreshToken = req.cookies.refreshToken;

    if (!userRefreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(
      userRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById( decoded.userId);
    
    if (!user || !user.refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const hashedIncomingToken = await hashToken(userRefreshToken);

    if (hashedIncomingToken !== user.refreshToken) {
      await User.findByIdAndUpdate(decoded.userId, { refreshToken: undefined });

      return res
        .status(401)
        .clearCookie("refreshToken",secureOptions)
        .clearCookie("accessToken",secureOptions)
        .json({ message: "Unauthorized" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user._id);
    const hashedNewRefreshToken = await hashToken(newRefreshToken);

    await User.findByIdAndUpdate(user._id, {
      refreshToken: hashedNewRefreshToken
    });

    res
      .cookie("refreshToken", newRefreshToken, { ...secureOptions, maxAge: 30*24*60*60*1000 })
      .cookie("accessToken", newAccessToken, { ...secureOptions, maxAge: 15*60*1000 })
      .status(200)
      .json({ message: "Token refreshed successfully" });

  } catch (error) {
    console.error("Some Error occurred: ", error);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};
