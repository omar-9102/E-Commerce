const NodeCache = require('node-cache');
const userCache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache
const jwt = require('jsonwebtoken')
const appError = require('../utils/AppError')
const httpStatusText = require('../utils/httpStatusText')
const prisma = require('../lib/prisma')

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(appError.create("You must login", 400, httpStatusText.ERROR));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // In Postgres, IDs are usually stored as 'id'. 
        // Ensure your JWT payload matches your Prisma schema field.
        const userId = decodedToken.id; 

        const Cache_Key = `user-${userId}`;
        let user = userCache.get(Cache_Key);

        if (!user) {
            // Prisma query replace Mongoose findById
            user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    role: true,
                },
            });

            if (user) {
                // Prisma returns a plain object, so we can cache it directly
                userCache.set(Cache_Key, user);
            }
        }

        if (!user) {
            return next(appError.create("User not found", 404, httpStatusText.FAIL));
        }

        // Standardize the request user object
        req.user = user;

        next();
    } catch (err) {
        return next(appError.create("Invalid token", 401, httpStatusText.ERROR));
    }
};

module.exports = {verifyToken};