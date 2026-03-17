import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role :{
        type: String,
        enum : ['student', 'admin'],
        default: 'student'
    },
    refreshSessions: [{
        _id: false,
        sessionId: {type: String, required: true},
        refreshTokenHash: {type: String, required: true},
        userAgent: {type: String},
        userIp: {type: String},
        expiresAt: {type: Date, required: true}
    }]
},{timestamps: true}); 

const User = mongoose.model("User", userSchema);

export default User;