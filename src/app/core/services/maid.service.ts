import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, doc, updateDoc, docData } from '@angular/fire/firestore';
import { MaidModel } from '../models/maid.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MaidService {

  constructor(private firestore: Firestore) {}

  getApprovedMaids(city?: string): Observable<MaidModel[]> {
    let q;
    if (city) {
      q = query(collection(this.firestore, 'maids'),
        where('isApproved', '==', 'approved'),
        where('isAvailable', '==', true),
        where('city', '==', city),
        where('isBlocked', '==', false));
    } else {
      q = query(collection(this.firestore, 'maids'),
        where('isApproved', '==', 'approved'),
        where('isAvailable', '==', true),
        where('isBlocked', '==', false));
    }
    return collectionData(q, { idField: 'uid' }) as Observable<MaidModel[]>;
  }

  getAllMaids(): Observable<MaidModel[]> {
    return collectionData(collection(this.firestore, 'maids'), { idField: 'uid' }) as Observable<MaidModel[]>;
  }

  getMaidById(uid: string): Observable<MaidModel> {
    return docData(doc(this.firestore, `maids/${uid}`), { idField: 'uid' }) as Observable<MaidModel>;
  }

  async updateMaidProfile(uid: string, data: Partial<MaidModel>) {
    await updateDoc(doc(this.firestore, `maids/${uid}`), data as any);
  }

  async approveMaid(uid: string) {
    await updateDoc(doc(this.firestore, `maids/${uid}`), { isApproved: 'approved' });
  }

  async rejectMaid(uid: string) {
    await updateDoc(doc(this.firestore, `maids/${uid}`), { isApproved: 'rejected' });
  }

  async toggleAvailability(uid: string, isAvailable: boolean) {
    await updateDoc(doc(this.firestore, `maids/${uid}`), { isAvailable });
  }

  async updateRating(maidId: string, newRating: number, totalReviews: number) {
    await updateDoc(doc(this.firestore, `maids/${maidId}`), { rating: newRating, totalReviews });
  }
}