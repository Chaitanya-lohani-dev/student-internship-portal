import jwt from 'jsonwebtoken';

export default function generateRefreshToken (UserId) {
    return jwt.sign(
        { UserId },
        process.env.REFRESH_TOKEN_SECREAT,
        {
            expiresIn: '30d'
        }
    )
}