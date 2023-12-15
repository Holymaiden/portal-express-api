import prisma from "../config/prisma";
import { UserInterface } from "../types/user.types";

interface CreateUser {
  name: string;
  email: string;
  email_verified?: Date | null;
  phone_number: string;
  password: string;
  role_id: string;
}

export const FindUserByEmail = async (
  email: string
): Promise<UserInterface | null> => {
  return await prisma.user.findUnique({
    where: {
      email: email,
      suspended_at: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      email_verified: true,
      phone_number: true,
      password: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const FindUserById = async (
  id: string
): Promise<UserInterface | null> => {
  return await prisma.user.findUnique({
    where: {
      id: id,
      suspended_at: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      email_verified: true,
      phone_number: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const CreateUser = async ({
  name,
  email,
  phone_number,
  password,
  role_id,
}: CreateUser) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      phone_number,
      password,
      role_id,
      updated_at: new Date(),
    },
  });
};

export const UpdatePassword = async (id: string, password: string) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      password,
    },
  });
};

export const VerifiedEmail = async (email: string) => {
  return await prisma.user.update({
    where: {
      email,
    },
    data: {
      email_verified: new Date(),
    },
  });
};

export const SuspendedUser = async (id: string) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      suspended_at: new Date(),
    },
  });
};
