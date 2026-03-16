import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonTextarea,
  ToastController,
} from '@ionic/angular/standalone';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { MaidService } from '../../../core/services/maid.service';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonItem,
    IonLabel,
    IonTextarea,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start"
          ><ion-back-button></ion-back-button
        ></ion-buttons>
        <ion-title style="font-family:Poppins;">Rate Maid ⭐</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" style="--background:#F9FAFB;">
      <ion-card style="border-radius:16px;">
        <ion-card-content>
          <h3 style="font-family:Poppins;font-weight:600;color:#1E2A38;">
            How was the service?
          </h3>

          <div style="display:flex;gap:8px;margin:16px 0;font-size:36px;">
            <span
              *ngFor="let star of [1, 2, 3, 4, 5]"
              (click)="rating = star"
              style="cursor:pointer;"
            >
              {{ star <= rating ? '⭐' : '☆' }}
            </span>
          </div>

          <ion-item style="margin-bottom:16px;">
            <ion-label position="floating">Write a comment</ion-label>
            <ion-textarea [(ngModel)]="comment" rows="3"></ion-textarea>
          </ion-item>

          <div
            style="background:#FFF0F5;border-radius:12px;padding:12px;margin-bottom:16px;"
          >
            <p style="color:#E91E63;font-weight:600;margin:0;">
              {{
                rating === 0
                  ? 'Please select a rating ☝️'
                  : 'You rated: ' + rating + ' / 5 ⭐'
              }}
            </p>
          </div>

          <ion-button
            expand="block"
            (click)="submitReview()"
            [disabled]="rating === 0 || isLoading"
            style="--background:#E91E63;--border-radius:12px;height:50px;"
          >
            {{ isLoading ? 'Submitting...' : 'Submit Review' }}
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
})
export class ReviewPage implements OnInit {
  rating = 0;
  comment = '';
  isLoading = false;
  booking: any;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private maidService: MaidService,
    private authService: AuthService,
    private bookingService: BookingService,
    private toastCtrl: ToastController,
  ) {}

  async ngOnInit() {
    const bookingId = this.route.snapshot.paramMap.get('id')!;
    this.booking = await this.bookingService.getBookingById(bookingId);
    this.currentUser = await this.authService.getCurrentUserProfile();
  }

  async submitReview() {
    if (this.rating === 0) return;
    this.isLoading = true;
    try {
      await addDoc(collection(this.firestore, 'reviews'), {
        bookingId: this.booking.id,
        userId: this.currentUser.uid,
        userName: this.currentUser.name,
        maidId: this.booking.maidId,
        rating: this.rating,
        comment: this.comment,
        createdAt: new Date(),
      });

      const maidSnap = await getDoc(
        doc(this.firestore, `maids/${this.booking.maidId}`),
      );
      const maidData = maidSnap.data() as any;
      const newTotal = (maidData.totalReviews || 0) + 1;
      const newRating =
        ((maidData.rating || 0) * (maidData.totalReviews || 0) + this.rating) /
        newTotal;
      await this.maidService.updateRating(
        this.booking.maidId,
        Math.round(newRating * 10) / 10,
        newTotal,
      );

      const toast = await this.toastCtrl.create({
        message: '✅ Review submitted! Thank you.',
        duration: 3000,
        color: 'success',
      });
      toast.present();
      this.router.navigate(['/user/booking-history']);
    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: 'Failed to submit review.',
        duration: 3000,
        color: 'danger',
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
