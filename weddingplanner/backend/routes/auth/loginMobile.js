"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginMobileFunction = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../lib/prisma");
const jwt_1 = require("../../lib/jwt");
const types_1 = require("../../lib/types");
const ApiError_1 = require("../../lib/ApiError");
const utils_1 = require("../../lib/utils");
exports.loginMobileFunction = (0, types_1.asyncHandler)(200, async (req) => {
    const { email, password } = req.body;
    const user = (await prisma_1.prisma.user.findUnique({ where: { email } })) ?? (0, ApiError_1.notFound)("User not found");
    if (!(await bcrypt_1.default.compare(password, user.hashedPassword)))
        return (0, ApiError_1.unauthorized)("Invalid credentials");
    const accessToken = (0, jwt_1.generateAccessToken)(user.id);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
    await prisma_1.prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: (0, utils_1.generateExpiryDate)(),
        },
    });
    return {
        user: { id: user.id, email: user.email },
        accessToken,
        refreshToken,
    };
});
