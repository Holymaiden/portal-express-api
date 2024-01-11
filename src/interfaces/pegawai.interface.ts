import { Gender, Married, Religion } from "@prisma/client";
import { UserInterface } from "./user.interface";

export interface ListPegawaiInterface {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  job_status: string;
}

export interface PegawaiInterface {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  gender: Gender;
  rek?: string | null;
  date_of_birth: Date;
  place_of_birth: string;
  religion: Religion;
  married_status: Married;
  blood_type: string;
  father_name: string;
  mother_name: string;
  province: string;
  city: string;
  district: string;
  sub_district: string;
  rt: string;
  rw: string;
  postal_code: string;
  address: string;
  picture?: string | null;
  bank_name: string;
  bank_rekening: string;
  bank_account: string;
  job_status: string;
  job_pic?: string | null;
  job_start_date: Date;
  job_end_date?: Date | null;
  user?: UserInterface | null;
  user_id?: string | null;
}
