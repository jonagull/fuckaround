import { Response } from 'express';
import { prisma } from '../../lib/prisma';
import { generateAccessToken, verifyRefreshToken } from '../../lib/jwt';
import { asyncHandler } from '../../lib/types';
import { unauthorized, forbidden } from '../../lib/ApiError';
import { RefreshRequest, RefreshResponse } from '@weddingplanner/types';

export const refreshFunction = asyncHandler<RefreshRequest, RefreshResponse>(200, async (req, res: Response) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;

  if (!token) return unauthorized('Refresh token required');

  try {
    verifyRefreshToken(token);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) return forbidden('Invalid refresh token');

    const accessToken = generateAccessToken(storedToken.userId);

    if (req.cookies?.refreshToken) {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });
    }

    return { accessToken };
  } catch (error) {
    return forbidden('Invalid refresh token');
  }
}
);