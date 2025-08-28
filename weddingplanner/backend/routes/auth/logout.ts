import { Response } from 'express';
import { prisma } from '../../lib/prisma';
import { asyncHandler } from '../../lib/types';
import { RefreshRequest, LogoutResponse } from '@weddingplanner/types';

export const logoutFunction = asyncHandler<RefreshRequest, LogoutResponse>(200, async (req, res: Response) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;

  if (token) await prisma.refreshToken.deleteMany({ where: { token } });

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return { success: true };
});