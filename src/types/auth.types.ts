export interface SignInEmailRequest {
  email: string;
  password: string;
}

export interface SignInPhoneRequest {
  phone_number: string;
  password: string;
}

export interface SignUpEmailRequest {
  name: string;
  phone_number: string;
  email: string;
  password: string;
  confirmPassword: string;
}
