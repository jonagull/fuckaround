import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { generateAccessToken, generateRefreshToken } from "../../lib/jwt";
import { asyncHandler } from "../../lib/types";
import { notFound, unauthorized } from "../../lib/ApiError";
import { LoginRequest, REFRESH_TOKEN_EXPIRY_MS, UserResponse } from "weddingplanner-types";
import { generateExpiryDate } from "../../lib/utils";

export const loginWebFunction = asyncHandler<LoginRequest, UserResponse>(200, async (req, res) => {
  const { email, password } = req.body;

  const user = (await prisma.user.findUnique({ where: { email } })) ?? notFound("User not found");

  if (!(await bcrypt.compare(password, user.hashedPassword)))
    return unauthorized("Invalid credentials");

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const data = { token: refreshToken, userId: user.id, expiresAt: generateExpiryDate() };

  await prisma.refreshToken.create({ data });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_EXPIRY_MS,
  });

  return { id: user.id, email: user.email };
});
