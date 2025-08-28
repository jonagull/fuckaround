import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import { generateAccessToken, generateRefreshToken } from '../../lib/jwt';
import { asyncHandler } from '../../lib/types';
import { notFound, unauthorized } from '../../lib/ApiError';
import { LoginRequest, LoginMobileResponse } from '@weddingplanner/types';
import { generateExpiryDate, requireExists } from '../../lib/utils';

export const loginMobileFunction = asyncHandler<LoginRequest, LoginMobileResponse>(200, async (req) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } }) ?? notFound('User not found');

  if (!(await bcrypt.compare(password, user.hashedPassword))) return unauthorized('Invalid credentials');

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: generateExpiryDate()
    }
  });

  return {
    user: { id: user.id, email: user.email },
    accessToken,
    refreshToken
  }
});