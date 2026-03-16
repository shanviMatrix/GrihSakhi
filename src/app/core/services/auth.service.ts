import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, docData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { MaidModel } from '../models/maid.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$ = user(this.auth);
  userProfile$: Observable<any>;

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    this.userProfile$ = this.user$.pipe(
      switchMap(u => {
        if (!u) return [null];
        return docData(doc(this.firestore, `users/${u.uid}`));
      })
    );
  }

  async registerUser(data: { email: string; password: string; name: string; phone: string; city: string }) {
    const cred = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
    const userDoc: UserModel = {
      uid: cred.user.uid,
      email: data.email,
      name: data.name,
      phone: data.phone,
      city: data.city,
      role: 'user',
      isBlocked: false,
      createdAt: new Date()
    };
    await setDoc(doc(this.firestore, `users/${cred.user.uid}`), userDoc);
    return cred;
  }

  async registerMaid(data: { email: string; password: string; name: string; phone: string; city: string; skills: string[]; experience: number; salaryExpectation: number; address: string }) {
    const cred = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
    await setDoc(doc(this.firestore, `users/${cred.user.uid}`), {
      uid: cred.user.uid,
      email: data.email,
      name: data.name,
      role: 'maid',
      isBlocked: false,
      createdAt: new Date()
    });
    const maidDoc: MaidModel = {
      uid: cred.user.uid,
      email: data.email,
      name: data.name,
      phone: data.phone,
      city: data.city,
      address: data.address,
      skills: data.skills,
      experience: data.experience,
      salaryExpectation: data.salaryExpectation,
      isAvailable: true,
      isApproved: 'pending',
      isBlocked: false,
      rating: 0,
      totalReviews: 0,
      createdAt: new Date()
    };
    await setDoc(doc(this.firestore, `maids/${cred.user.uid}`), maidDoc);
    return cred;
  }

  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const profileSnap = await getDoc(doc(this.firestore, `users/${cred.user.uid}`));
    const profile = profileSnap.data() as UserModel;
    if (profile.isBlocked) {
      await signOut(this.auth);
      throw new Error('Your account has been blocked. Contact support.');
    }
    if (profile.role === 'admin') this.router.navigate(['/admin/dashboard']);
    else if (profile.role === 'maid') this.router.navigate(['/maid/dashboard']);
    else this.router.navigate(['/user/home']);
    return cred;
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/auth/login']);
  }

  async getCurrentUserProfile(): Promise<any> {
    const u = this.auth.currentUser;
    if (!u) return null;
    const snap = await getDoc(doc(this.firestore, `users/${u.uid}`));
    return snap.data();
  }
}