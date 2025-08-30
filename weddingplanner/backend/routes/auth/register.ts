import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import { asyncHandler, apiSuccess } from '../../lib/types';
import { ApiError } from '../../lib/ApiError';
import { RegisterRequest, UserResponse } from 'weddingplanner-types';


export const registerFunction = asyncHandler<RegisterRequest, UserResponse>(201, async (req) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({ data: { email, hashedPassword, name } });

    const response = { id: user.id, email: user.email };

    return response;
  } catch (error) {
    throw new ApiError(400, 'Email already exists');
  }
});