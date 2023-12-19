export interface UserInterface {
  id: string;
  name: string;
  email: string;
  email_verified: Date | null;
  phone_number: string;
  suspended_at: Date | null;
  password?: string;
  role: {
    id: string;
    name: string;
  };
  company?: {
    id: string;
    name: string;
    address: string;
    expired_at: Date | null;
  } | null;
  deleted_at: Date | null;
}

export interface UserCreateInterface {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  role_id: string;
}

export interface UserUpdatePasswordInterface {
  id: string;
  password: string;
  confirmPassword: string;
  password_old: string;
}

export interface SuspendedUserInterface {
  id: string;
}

export interface UnSuspendedUserInterface {
  id: string;
}
