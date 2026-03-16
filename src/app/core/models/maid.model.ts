export interface MaidModel {
  uid: string;
  email: string;
  name: string;
  phone: string;
  profileImage?: string;
  skills: string[];
  experience: number;
  salaryExpectation: number;
  city: string;
  address: string;
  isAvailable: boolean;
  isApproved: 'pending' | 'approved' | 'rejected';
  isBlocked: boolean;
  rating: number;
  totalReviews: number;
  createdAt: Date;
}