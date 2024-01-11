import moment from "moment";

import {
  ListPegawaiInterface,
  PegawaiInterface,
} from "../interfaces/pegawai.interface";
import prisma from "../config/prisma";

export const GetListPegawai = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: string = "id",
  order: string = "desc"
): Promise<ListPegawaiInterface[] | null> => {
  return await prisma.pegawai.findMany({
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
          email: {
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
      email: true,
      phone_number: true,
      job_status: true,
    },
    orderBy: {
      [sort]: order,
    },
  });
};

export const GetPegawaiById = async (
  condition: object
): Promise<PegawaiInterface | null> => {
  return await prisma.pegawai.findFirst({
    where: {
      ...condition,
      deleted_at: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone_number: true,
      gender: true,
      rek: true,
      date_of_birth: true,
      place_of_birth: true,
      religion: true,
      married_status: true,
      blood_type: true,
      father_name: true,
      mother_name: true,
      province: true,
      city: true,
      district: true,
      sub_district: true,
      rt: true,
      rw: true,
      postal_code: true,
      address: true,
      picture: true,
      bank_name: true,
      bank_rekening: true,
      bank_account: true,
      job_status: true,
      job_pic: true,
      job_start_date: true,
      job_end_date: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          email_verified: true,
          suspended_at: true,
          phone_number: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              address: true,
              expired_at: true,
            },
          },
          deleted_at: true,
        },
      },
    },
  });
};

export const CreatePegawai = async (data: PegawaiInterface) => {
  return await prisma.pegawai.create({
    data: {
      name: data.name,
      email: data.email,
      phone_number: data.phone_number,
      gender: data.gender,
      rek: data.rek || null,
      date_of_birth: moment(data.date_of_birth).toISOString(),
      place_of_birth: data.place_of_birth,
      religion: data.religion,
      married_status: data.married_status,
      blood_type: data.blood_type,
      father_name: data.father_name,
      mother_name: data.mother_name,
      province: data.province,
      city: data.city,
      district: data.district,
      sub_district: data.sub_district,
      rt: data.rt,
      rw: data.rw,
      postal_code: data.postal_code,
      address: data.address,
      picture: data.picture || null,

      bank_name: data.bank_name,
      bank_rekening: data.bank_rekening,
      bank_account: data.bank_account,

      job_status: data.job_status,
      job_pic: data.job_pic || null,
      job_start_date: moment(data.job_start_date).toISOString(),
      job_end_date: moment(data.job_end_date).toISOString() || null,

      user_id: data.user_id || null,
    },
    select: {
      id: true,
    },
  });
};

export const UpdatePegawai = async (data: PegawaiInterface) => {
  return await prisma.pegawai.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      email: data.email,
      phone_number: data.phone_number,
      gender: data.gender,
      rek: data.rek || null,
      date_of_birth: moment(data.date_of_birth).toISOString(),
      place_of_birth: data.place_of_birth,
      religion: data.religion,
      married_status: data.married_status,
      blood_type: data.blood_type,
      father_name: data.father_name,
      mother_name: data.mother_name,
      province: data.province,
      city: data.city,
      district: data.district,
      sub_district: data.sub_district,
      rt: data.rt,
      rw: data.rw,
      postal_code: data.postal_code,
      address: data.address,
      picture: data.picture || null,

      bank_name: data.bank_name,
      bank_rekening: data.bank_rekening,
      bank_account: data.bank_account,

      job_status: data.job_status,
      job_pic: data.job_pic || null,
      job_start_date: moment(data.job_start_date).toISOString(),
      job_end_date: moment(data.job_end_date).toISOString() || null,

      user_id: data.user_id || null,
    },
    select: {
      id: true,
    },
  });
};

export const DeletePegawai = async (id: string) => {
  return await prisma.pegawai.update({
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
