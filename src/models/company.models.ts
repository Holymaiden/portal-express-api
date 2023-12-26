import prisma from "../config/prisma";
import {
  CompanyCreateInterface,
  CompanyInterface,
  CompanyUpdateWithDetailInterface,
  CompanyWithDetailInterface,
} from "../interfaces/company.interface";

export const FindCompanyById = async (
  id: string
): Promise<CompanyWithDetailInterface | null> => {
  return await prisma.company.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      address: true,
      CompanyDetail: {
        select: {
          email: true,
          phone_number: true,
          logo: true,
          spr: true,
          spk_mandor: true,
        },
      },
      expired_at: true,
      deleted_at: true,
    },
  });
};

export const CompanyCreate = async ({
  name,
  address,
  expired_at,
}: CompanyCreateInterface): Promise<CompanyInterface> => {
  return await prisma.company.create({
    data: {
      name: name,
      address: address,
      expired_at: expired_at,
    },
  });
};

export const CompanyUpdate = async ({
  id,
  name,
  address,
  expired_at,
  email,
  phone_number,
  logo,
  spr,
  spk_mandor,
}: CompanyUpdateWithDetailInterface): Promise<CompanyInterface> => {
  return await prisma.company.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      address: address,
      expired_at: expired_at,
      CompanyDetail: {
        update: {
          email: email,
          phone_number: phone_number,
          logo: logo,
          spr: spr,
          spk_mandor: spk_mandor,
        },
      },
    },
  });
};

export const CompanyDelete = async (id: string): Promise<CompanyInterface> => {
  return await prisma.company.update({
    where: {
      id: id,
    },
    data: {
      deleted_at: new Date(),
    },
  });
};
