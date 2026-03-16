export interface ReviewModel {
  id?: string;
  bookingId: string;
  userId: string;
  userName: string;
  maidId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}