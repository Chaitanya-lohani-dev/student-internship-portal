import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({message: "Unauthorized"})
    }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        }
        
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
}