export interface CompanyInterface {
  id: string;
  name: string;
  address: string;
  expired_at: Date | null;
}

export interface CompanyWithDetailInterface {
  id: string;
  name: string;
  address: string;
  CompanyDetail: {
    email: string | null;
    phone_number: string | null;
    logo: string | null;
    spr: string | null;
    spk_mandor: string | null;
  } | null;
  expired_at: Date | null;
  deleted_at: Date | null;
}

export interface CompanyCreateInterface {
  name: string;
  address: string;
  expired_at: Date | null;
}

export interface CompanyUpdateWithDetailInterface {
  id: string;
  name: string;
  address: string;
  expired_at: Date | null;
  email: string | null;
  phone_number: string | null;
  logo: string | null;
  spr: string | null;
  spk_mandor: string | null;
}
