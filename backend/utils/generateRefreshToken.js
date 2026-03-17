import jwt from 'jsonwebtoken';

export default function generateRefreshToken (userId, sessionId) {
    return jwt.sign(
        { userId, sessionId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '30d'
        }
    )
}
