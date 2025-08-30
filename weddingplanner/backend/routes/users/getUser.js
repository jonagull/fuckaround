"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFunction = void 0;
const prisma_1 = require("../../lib/prisma");
const types_1 = require("../../lib/types");
const ApiError_1 = require("../../lib/ApiError");
exports.getUserFunction = (0, types_1.asyncHandler)(200, async (req) => {
  const { id } = req.params;
  const authenticatedUserId = req.userId;
  if (id !== authenticatedUserId)
    (0, ApiError_1.forbidden)("You can only access your own user data");
  const select = {
    id: true,
    email: true,
    name: true,
    phone: true,
    createdAt: true,
    updatedAt: true,
  };
  const user =
    (await prisma_1.prisma.user.findUnique({ where: { id }, select })) ??
    (0, ApiError_1.notFound)("User not found");
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phone || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
});
