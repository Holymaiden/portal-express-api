export interface UserInterface {
  id: string;
  name: string;
  email: string;
  email_verified: Date | null;
  phone_number: string;
  password?: string;
  role: {
    id: string;
    name: string;
  };
}
