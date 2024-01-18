export interface PekerjaInterface {
  id: string;
  name: string;
  address?: string | null;
  phone_number: string;
  user_id?: string | null;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
