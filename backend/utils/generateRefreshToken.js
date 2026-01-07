import jwt from 'jsonwebtoken';

export default function generateRefreshToken (UserId) {
    return jwt.sign(
        { UserId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '30d'
        }
    )
}