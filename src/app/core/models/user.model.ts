export interface UserModel {
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'maid' | 'admin';
  address?: string;
  city?: string;
  profileImage?: string;
  isBlocked: boolean;
  createdAt: Date;
}