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
    <ion-header class="bh-header">
      <ion-toolbar class="bh-toolbar">
        <ion-title class="bh-title">My Bookings 📋</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bh-content">

      <!-- Stats Row -->
      <div class="stats-row" *ngIf="bookings.length > 0">
        <div class="stat-box">
          <span class="stat-num">{{ bookings.length }}</span>
          <span class="stat-lbl">Total</span>
        </div>
        <div class="stat-box">
          <span class="stat-num">{{ countStatus('pending') }}</span>
          <span class="stat-lbl">Pending</span>
        </div>
        <div class="stat-box">
          <span class="stat-num">{{ countStatus('completed') }}</span>
          <span class="stat-lbl">Done</span>
        </div>
        <div class="stat-box">
          <span class="stat-num">{{ countStatus('accepted') }}</span>
          <span class="stat-lbl">Accepted</span>
        </div>
      </div>

      <!-- Booking Cards -->
      <div class="cards-wrap">
        <div
          class="booking-card"
          *ngFor="let booking of bookings; let i = index"
          [style.animation-delay]="i * 0.07 + 's'">

          <!-- Top Row -->
          <div class="bc-top">
            <div class="bc-avatar">
              {{ booking.maidName?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="bc-info">
              <h4 class="bc-name">{{ booking.maidName }}</h4>
              <p class="bc-service">{{ booking.service }} • {{ booking.timeSlot }}</p>
              <p class="bc-date">📅 {{ booking.date }}</p>
            </div>
            <div class="bc-right">
              <ion-badge class="bc-badge" [color]="getStatusColor(booking.status)">
                {{ booking.status | uppercase }}
              </ion-badge>
              <p class="bc-amount">₹{{ booking.amount }}</p>
            </div>
          </div>

          <!-- Address -->
          <div class="bc-address" *ngIf="booking.address">
            📍 {{ booking.address }}
          </div>

          <!-- Divider -->
          <div class="bc-divider"></div>

          <!-- Action Buttons -->
          <ion-button
            *ngIf="booking.status === 'accepted'"
            expand="block"
            class="pay-btn"
            (click)="payNow(booking)">
            💳 Pay Now — ₹{{ booking.amount }}
          </ion-button>

          <ion-button
            *ngIf="booking.status === 'completed'"
            expand="block"
            class="rate-btn"
            [routerLink]="['/user/review', booking.id]">
            ⭐ Rate Your Experience
          </ion-button>

          <div *ngIf="booking.status === 'pending'" class="waiting-row">
            <span class="waiting-dot"></span>
            <span class="waiting-txt">Waiting for maid to accept...</span>
          </div>

          <div *ngIf="booking.status === 'rejected'" class="rejected-row">
            ❌ Booking was rejected
          </div>

          <div *ngIf="booking.status === 'paid'" class="paid-row">
            ✅ Payment done — service upcoming
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-wrap" *ngIf="bookings.length === 0">
        <div class="empty-icon">📭</div>
        <h3 class="empty-title">No Bookings Yet</h3>
        <p class="empty-sub">Find a maid and book your first service!</p>
        <ion-button class="find-btn" routerLink="/user/home">
          🔍 Find a Maid
        </ion-button>
      </div>

    </ion-content>

    <ion-tab-bar class="bh-tabbar" slot="bottom">
      <ion-tab-button routerLink="/user/home" routerLinkActive="active">
        <ion-icon name="home-outline"></ion-icon>
        <ion-label>Discover</ion-label>
      </ion-tab-button>
      <ion-tab-button routerLink="/user/booking-history" routerLinkActive="active">
        <ion-icon name="calendar-outline"></ion-icon>
        <ion-label>Bookings</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  `,
  styles: [`
    /* HEADER */
    .bh-header { --background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); box-shadow: 0 4px 20px rgba(236,72,153,0.15); }
    .bh-toolbar { --min-height: 64px; --padding-start: 20px; --padding-end: 20px; }
    .bh-title { font-size: 22px; font-weight: 700; background: linear-gradient(135deg, #ec4899, #f43f5e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'Poppins', sans-serif; }

    /* CONTENT */
    .bh-content { --background: linear-gradient(180deg, #0f172a 0%, #1a1f2e 100%); --padding-bottom: 100px; }

    /* STATS ROW */
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 20px 16px 8px; }
    .stat-box { background: rgba(255,255,255,0.06); border: 1px solid rgba(236,72,153,0.2); border-radius: 14px; padding: 14px 8px; text-align: center; }
    .stat-num { display: block; font-size: 22px; font-weight: 700; color: #ec4899; font-family: 'Poppins', sans-serif; }
    .stat-lbl { display: block; font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px; }

    /* CARDS */
    .cards-wrap { padding: 12px 16px; }
    .booking-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(236,72,153,0.25);
      border-radius: 18px;
      padding: 16px;
      margin-bottom: 14px;
      animation: slideUp 0.4s ease-out forwards;
      opacity: 0;
    }
    @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

    /* CARD TOP */
    .bc-top { display: flex; align-items: flex-start; gap: 12px; }
    .bc-avatar {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, #ec4899, #f43f5e);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 700; color: white;
      flex-shrink: 0;
    }
    .bc-info { flex: 1; }
    .bc-name { color: white; font-size: 15px; font-weight: 700; margin: 0 0 3px; font-family: 'Poppins', sans-serif; }
    .bc-service { color: rgba(255,255,255,0.55); font-size: 12px; margin: 0 0 2px; }
    .bc-date { color: rgba(255,255,255,0.4); font-size: 11px; margin: 0; }
    .bc-right { text-align: right; flex-shrink: 0; }
    .bc-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; border-radius: 8px; }
    .bc-amount { color: #ec4899; font-weight: 700; font-size: 16px; margin: 6px 0 0; font-family: 'Poppins', sans-serif; }

    /* ADDRESS */
    .bc-address { color: rgba(255,255,255,0.45); font-size: 12px; margin-top: 10px; padding-left: 4px; }

    /* DIVIDER */
    .bc-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 12px 0; }

    /* ACTION BUTTONS */
    .pay-btn {
      --background: linear-gradient(135deg, #ec4899, #f43f5e);
      --border-radius: 12px; height: 46px;
      font-weight: 700; font-size: 14px;
      box-shadow: 0 6px 20px rgba(236,72,153,0.35);
    }
    .rate-btn {
      --background: linear-gradient(135deg, #1e293b, #0f172a);
      --border: 1px solid rgba(236,72,153,0.4);
      --border-radius: 12px; height: 46px;
      font-weight: 700; font-size: 14px;
      --color: #ec4899;
    }
    .waiting-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
    .waiting-dot { width: 8px; height: 8px; border-radius: 50%; background: #ffc107; animation: pulse 1.5s ease-in-out infinite; flex-shrink: 0; }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
    .waiting-txt { color: rgba(255,193,7,0.8); font-size: 13px; }
    .rejected-row { color: rgba(239,68,68,0.8); font-size: 13px; padding: 4px 0; }
    .paid-row { color: rgba(34,197,94,0.8); font-size: 13px; padding: 4px 0; }

    /* EMPTY STATE */
    .empty-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 30px; text-align: center; }
    .empty-icon { font-size: 64px; margin-bottom: 20px; opacity: 0.5; }
    .empty-title { color: white; font-size: 22px; font-weight: 700; margin: 0 0 10px; font-family: 'Poppins', sans-serif; }
    .empty-sub { color: rgba(255,255,255,0.5); font-size: 14px; margin: 0 0 28px; line-height: 1.6; }
    .find-btn { --background: linear-gradient(135deg, #ec4899, #f43f5e); --border-radius: 14px; height: 50px; font-weight: 700; font-size: 15px; box-shadow: 0 8px 24px rgba(236,72,153,0.3); }

    /* TAB BAR */
    .bh-tabbar { --background: rgba(15,23,42,0.98); --border: 1px solid rgba(236,72,153,0.2); backdrop-filter: blur(10px); box-shadow: 0 -4px 20px rgba(0,0,0,0.3); }
    ion-tab-button { --color: rgba(255,255,255,0.5); --color-selected: #ec4899; --padding-bottom: 8px; --padding-top: 8px; }
    ion-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  `],
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

  countStatus(status: string): number {
    return this.bookings.filter(b => b.status === status).length;
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
          await this.paymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: booking.id!,
          }).toPromise();
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