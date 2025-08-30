"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFunction = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../lib/prisma");
const types_1 = require("../../lib/types");
const ApiError_1 = require("../../lib/ApiError");
exports.registerFunction = (0, types_1.asyncHandler)(201, async (req) => {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({ data: { email, hashedPassword, name } });
        const response = { id: user.id, email: user.email };
        return response;
    }
    catch (error) {
        throw new ApiError_1.ApiError(400, 'Email already exists');
    }
});
