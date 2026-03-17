import crypto from 'crypto';
import hashToken from './hashToken.js';
import generateRefreshToken from './generateRefreshToken.js';

export default function generateUserSession(req, userId) {
    const sessionId = crypto.randomUUID();
    const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"] || "Unknown";
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const refreshToken = generateRefreshToken(userId, sessionId);

    return {
        sessionId,
        refreshTokenHash: hashToken(refreshToken),
        refreshToken,
        userAgent,
        userIp,
        expiresAt
    }
}
