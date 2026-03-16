import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, query, where, collectionData, orderBy, getDoc } from '@angular/fire/firestore';
import { BookingModel } from '../models/booking.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService {

  constructor(private firestore: Firestore) {}

  async createBooking(booking: BookingModel): Promise<string> {
    const ref = await addDoc(collection(this.firestore, 'bookings'), {
      ...booking,
      createdAt: new Date()
    });
    return ref.id;
  }

  async updateBookingStatus(bookingId: string, status: string, extraData?: any) {
    await updateDoc(doc(this.firestore, `bookings/${bookingId}`), { status, ...extraData });
  }

  getUserBookings(userId: string): Observable<BookingModel[]> {
    const q = query(collection(this.firestore, 'bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<BookingModel[]>;
  }

  getMaidBookings(maidId: string): Observable<BookingModel[]> {
    const q = query(collection(this.firestore, 'bookings'),
      where('maidId', '==', maidId),
      orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<BookingModel[]>;
  }

  getAllBookings(): Observable<BookingModel[]> {
    const q = query(collection(this.firestore, 'bookings'), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<BookingModel[]>;
  }

  async getBookingById(id: string): Promise<BookingModel | null> {
    const snap = await getDoc(doc(this.firestore, `bookings/${id}`));
    return snap.exists() ? { id: snap.id, ...snap.data() } as BookingModel : null;
  }
}