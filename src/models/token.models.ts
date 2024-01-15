import prisma from "@/config/prisma";
import { RefreshTokenInterface } from "@/interfaces/token.interface";

export const CreateRefreshToken = async (token: string, userId: string) => {
  return await prisma.refreshToken.create({
    data: {
      token: token,
      user_id: userId,
    },
  });
};

export const FindRefreshToken = async (
  token: string
): Promise<RefreshTokenInterface | null> => {
  return await prisma.refreshToken.findUnique({
    where: {
      token: token,
    },
  });
};

export const DeleteRefreshToken = async (token: string) => {
  return await prisma.refreshToken.delete({
    where: {
      token: token,
    },
  });
};

export const DeleteRefreshTokenByUserId = async (userId: string) => {
  return await prisma.refreshToken.deleteMany({
    where: {
      user_id: userId,
    },
  });
};
