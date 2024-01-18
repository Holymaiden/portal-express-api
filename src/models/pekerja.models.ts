import prisma from "@/config/prisma";

import { PekerjaInterface } from "@/interfaces/pekerja.interface";

export const GetPekerjaList = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: string = "id",
  order: string = "desc"
): Promise<PekerjaInterface[] | null> => {
  return await prisma.pekerja.findMany({
    skip: Number((page - 1) * limit),
    take: Number(limit),
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          phone_number: {
            contains: search,
          },
        },
      ],
      AND: {
        deleted_at: null,
      },
    },
    select: {
      id: true,
      name: true,
      address: true,
      phone_number: true,
      user_id: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: {
      [sort]: order,
    },
  });
};

export const GetPekerjaById = async (
  condition: object
): Promise<PekerjaInterface | null> => {
  return await prisma.pekerja.findFirst({
    where: {
      ...condition,
      deleted_at: null,
    },
    select: {
      id: true,
      name: true,
      address: true,
      phone_number: true,
      user_id: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const CreatePekerja = async (
  data: Omit<Omit<PekerjaInterface, "id">, "created_at">
): Promise<{ id: string } | null> => {
  return await prisma.pekerja.create({
    data: {
      ...data,
    },
    select: {
      id: true,
    },
  });
};

export const UpdatePekerja = async (
  data: PekerjaInterface
): Promise<{ id: string } | null> => {
  return await prisma.pekerja.update({
    where: {
      id: data.id,
    },
    data: {
      ...data,
    },
    select: {
      id: true,
    },
  });
};

export const DeletePekerja = async (id: string) => {
  return await prisma.pekerja.update({
    where: {
      id: id,
    },
    data: {
      deleted_at: new Date(),
    },
    select: {
      id: true,
    },
  });
};
