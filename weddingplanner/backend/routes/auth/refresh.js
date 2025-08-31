"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshFunction = void 0;
const prisma_1 = require("../../lib/prisma");
const jwt_1 = require("../../lib/jwt");
const types_1 = require("../../lib/types");
const ApiError_1 = require("../../lib/ApiError");
exports.refreshFunction = (0, types_1.asyncHandler)(200, async (req, res) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token)
        return (0, ApiError_1.unauthorized)("Refresh token required");
    try {
        (0, jwt_1.verifyRefreshToken)(token);
        const storedToken = await prisma_1.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!storedToken || storedToken.expiresAt < new Date())
            return (0, ApiError_1.forbidden)("Invalid refresh token");
        const accessToken = (0, jwt_1.generateAccessToken)(storedToken.userId);
        if (req.cookies?.refreshToken) {
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            });
        }
        return { accessToken };
    }
    catch (error) {
        return (0, ApiError_1.forbidden)("Invalid refresh token");
    }
});
