export interface UserInterface {
  id: string;
  name: string;
  email: string;
  email_verified: Date | null;
  phone_number: string;
  password?: string;
  suspended_at: Date | null;
  role: {
    id: string;
    name: string;
  };
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
