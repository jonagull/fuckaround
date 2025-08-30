"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutFunction = void 0;
const prisma_1 = require("../../lib/prisma");
const types_1 = require("../../lib/types");
exports.logoutFunction = (0, types_1.asyncHandler)(200, async (req, res) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (token)
        await prisma_1.prisma.refreshToken.deleteMany({ where: { token } });
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { success: true };
});
