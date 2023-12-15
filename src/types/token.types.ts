export interface RefreshTokenInterface {
  id: string;
  token: string;
  user_id: string;
  createdAt: Date;
}

export interface ResetTokenInterface {
  id: string;
  token: string;
  expiresAt: Date;
  user_id: string;
  createdAt: Date;
}
