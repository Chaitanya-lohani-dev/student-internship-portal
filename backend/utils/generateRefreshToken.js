import jwt from 'jsonwebtoken';

export default function generateRefreshToken (userId) {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '30d'
        }
    )
}