
export const rateLimiter = (client) => {
    return async function (req, res, next) {
        try {
        const ip = req.headers['x-forwarded-for']?.split(",")[0] || req.socket.remoteAddress;
        
        const value = await client.get(ip);
        
        if (value === null) {
            await client.set(ip, 5, { EX: 60 });
            return next();
        }

        if (Number(value)<1) {
            return res.status(429).json({message: "Too many requests"});
        }

        await client.decr(ip);
        next();
    } catch (error) {
        res.status(500).json({message: "Internal Rate Limiter Error"});
    }
    }
}