"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt_1 = require("../lib/jwt");
const authenticateToken = (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "Access token required" });
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.userId = payload.userId;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
exports.authenticateToken = authenticateToken;
