import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonBadge,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, calendarOutline } from 'ionicons/icons';
import { BookingService } from '../../../core/services/booking.service';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';
import { BookingModel } from '../../../core/models/booking.model';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonBadge,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonIcon,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title style="font-family:Poppins;">My Bookings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content style="--background:#F9FAFB;">
      <div style="padding:16px;">
        <ion-card
          *ngFor="let booking of bookings"
          style="border-radius:16px;margin-bottom:12px;"
        >
          <ion-card-content>
            <div
              style="display:flex;justify-content:space-between;align-items:flex-start;"
            >
              <div>
                <h4
                  style="font-family:Poppins;font-weight:600;color:#1E2A38;margin:0 0 4px;"
                >
                  {{ booking.maidName }}
                </h4>
                <p style="color:#666;font-size:13px;margin:0;">
                  {{ booking.service }} • {{ booking.timeSlot }}
                </p>
                <p style="color:#666;font-size:12px;margin:4px 0 0;">
                  📅 {{ booking.date }}
                </p>
              </div>
              <div style="text-align:right;">
                <ion-badge
                  [color]="getStatusColor(booking.status)"
                  style="border-radius:8px;"
                >
                  {{ booking.status | uppercase }}
                </ion-badge>
                <p
                  style="font-family:Poppins;font-weight:700;color:#E91E63;margin:6px 0 0;"
                >
                  ₹{{ booking.amount }}
                </p>
              </div>
            </div>

            <ion-button
              *ngIf="booking.status === 'accepted'"
              expand="block"
              (click)="payNow(booking)"
              style="margin-top:12px;--background:#E91E63;--border-radius:10px;"
            >
              💳 Pay Now
            </ion-button>

            <ion-button
              *ngIf="booking.status === 'completed'"
              expand="block"
              [routerLink]="['/user/review', booking.id]"
              style="margin-top:12px;--background:#1E2A38;--border-radius:10px;"
            >
              ⭐ Rate Maid
            </ion-button>
          </ion-card-content>
        </ion-card>

        <p
          *ngIf="bookings.length === 0"
          style="text-align:center;padding:40px;color:#999;"
        >
          No bookings yet. Find a maid to get started!
        </p>
      </div>
    </ion-content>

    <ion-tab-bar slot="bottom" style="--background:#fff;">
      <ion-tab-button routerLink="/user/home">
        <ion-icon name="home-outline"></ion-icon>
        <ion-label>Home</ion-label>
      </ion-tab-button>
      <ion-tab-button routerLink="/user/booking-history">
        <ion-icon name="calendar-outline"></ion-icon>
        <ion-label>Bookings</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  `,
})
export class BookingHistoryPage implements OnInit {
  bookings: BookingModel[] = [];
  currentUser: any;

  constructor(
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private toastCtrl: ToastController,
  ) {
    addIcons({ homeOutline, calendarOutline });
  }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUserProfile();
    this.bookingService.getUserBookings(this.currentUser.uid).subscribe((b) => {
      this.bookings = b;
    });
  }

  getStatusColor(status: string): string {
    const map: any = {
      pending: 'warning',
      accepted: 'success',
      rejected: 'danger',
      paid: 'primary',
      completed: 'secondary',
      cancelled: 'medium',
    };
    return map[status] || 'medium';
  }

  async payNow(booking: BookingModel) {
    try {
      const orderRes: any = await this.paymentService
        .createOrder(booking.amount, booking.id!)
        .toPromise();
      this.paymentService.openRazorpay({
        orderId: orderRes.orderId,
        amount: booking.amount,
        name: booking.maidName,
        description: `Payment for ${booking.service}`,
        userEmail: this.currentUser.email,
        userPhone: this.currentUser.phone || '',
        onSuccess: async (response) => {
          await this.paymentService
            .verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking.id!,
            })
            .toPromise();
          const toast = await this.toastCtrl.create({
            message: '✅ Payment successful!',
            duration: 3000,
            color: 'success',
          });
          toast.present();
        },
        onFailure: () => {},
      });
    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: 'Payment failed. Try again.',
        duration: 3000,
        color: 'danger',
      });
      toast.present();
    }
  }
}
