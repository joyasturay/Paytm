const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.userId = decoded.id; // Make sure to access the correct property from the decoded token

        next();
    } catch (err) {
        return res.status(403).json({ message: "Token verification failed" });
    }
};

// Export the middleware function directly
module.exports = authMiddleware;
