export interface BookingModel {
  id?: string;
  userId: string;
  userName: string;
  maidId: string;
  maidName: string;
  service: string;
  date: string;
  timeSlot: string;
  address: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'completed' | 'cancelled';
  createdAt: Date;
}
